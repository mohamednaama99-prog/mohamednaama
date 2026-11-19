/**
 * npm run sheets:setup            check access, then build or repair the sheet
 * npm run sheets:setup -- --test  …and append one marked test row, then read
 *                                 it back to confirm every column landed right
 *
 * Reads .env.local, exactly as `next dev` does. Safe to run any number of
 * times: it never deletes a row, and re-running only re-applies the layout.
 * It never prints the private key.
 *
 * The column list, statuses and row format all come from
 * src/lib/application-sheet.ts — the same module the app writes with — so the
 * sheet and the form cannot drift apart.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { loadEnvConfig } from "@next/env";

import {
  answerColumns,
  APPLICATIONS_TAB,
  COACH_NOTES,
  columnLetter,
  headerRange,
  OVERVIEW_TAB,
  sheetColumns,
  statuses,
  toSheetRow,
  toSheetsDateTime,
  type SheetColumn,
} from "../src/lib/application-sheet";
import {
  appendApplicationRow,
  checkPrivateKey,
  getAccessToken,
  GoogleApiError,
  readSheetsConfig,
  sheetsRequest,
  type SheetsConfig,
} from "../src/lib/sheets";
import { applicationSchema, initialValues } from "../src/lib/validation";

/* ------------------------------------------------------------------------ */
/* Output                                                                    */
/* ------------------------------------------------------------------------ */

const ok = (text: string) => console.log(`  ✓ ${text}`);
const info = (text: string) => console.log(`    ${text}`);

class SetupError extends Error {}

function fail(lines: string[]): never {
  throw new SetupError(lines.join("\n"));
}

/** Turns a Google error into a message that says what to do next. */
function explain(error: unknown, config: SheetsConfig, during: string): never {
  if (!(error instanceof GoogleApiError)) throw error;

  switch (error.code) {
    case "malformed-key":
      fail([
        "GOOGLE_PRIVATE_KEY is not a valid private key.",
        'Copy the whole "private_key" value from the service account\'s JSON file,',
        "including the -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY----- lines.",
        "In .env.local, keep it in double quotes: either on one line with the \\n",
        "sequences exactly as they are in the JSON, or with real line breaks.",
      ]);
    case "invalid-credentials":
      fail([
        "Google rejected the service account's credentials.",
        "Check that GOOGLE_SERVICE_ACCOUNT_EMAIL is the \"client_email\" from the same",
        "JSON file the private key came from, and that the key has not been deleted",
        "in Google Cloud (IAM & Admin > Service Accounts > Keys).",
      ]);
    case "api-disabled":
      fail([
        "The Google Sheets API is not enabled for the service account's Cloud project.",
        `Enable it here, wait a minute, then run this again:`,
        `  ${error.activationUrl ?? "https://console.cloud.google.com/apis/library/sheets.googleapis.com"}`,
      ]);
    case "no-access":
      fail(
        during === "write"
          ? [
              "The service account can read the spreadsheet but cannot edit it.",
              `In Google Sheets, open Share and change ${config.clientEmail} to Editor.`,
            ]
          : [
              "The service account cannot open this spreadsheet.",
              "In Google Sheets, open Share and add this address as an Editor:",
              `  ${config.clientEmail}`,
            ],
      );
    case "not-found":
      fail([
        `No spreadsheet with the ID "${config.spreadsheetId}" was found.`,
        "Copy the ID from the sheet's address: docs.google.com/spreadsheets/d/<ID>/edit",
      ]);
    case "rate-limited":
      fail(["Google is rate-limiting requests right now. Wait a minute and run this again."]);
    case "network":
      fail([`Could not reach Google (${error.message}). Check the connection and try again.`]);
    default:
      fail([`Google returned an unexpected error during ${during} (HTTP ${error.status ?? "?"}).`]);
  }
}

/* ------------------------------------------------------------------------ */
/* Sheets API shapes                                                         */
/* ------------------------------------------------------------------------ */

type SheetMeta = {
  properties: { sheetId: number; title: string; gridProperties?: { rowCount?: number; columnCount?: number } };
  conditionalFormats?: unknown[];
  basicFilter?: { range?: { startColumnIndex?: number; endColumnIndex?: number } };
};

type SpreadsheetMeta = {
  properties: { title: string; timeZone: string };
  sheets: SheetMeta[];
};

type Request = Record<string, unknown>;

const rgb = (hex: string) => ({
  red: parseInt(hex.slice(1, 3), 16) / 255,
  green: parseInt(hex.slice(3, 5), 16) / 255,
  blue: parseInt(hex.slice(5, 7), 16) / 255,
});

const NAVY = "#0E2344";
const WHITE = "#FFFFFF";
/** The site's off-white (mist-100). */
const OFF_WHITE = "#F0F4F7";

async function getMeta(config: SheetsConfig): Promise<SpreadsheetMeta> {
  return sheetsRequest<SpreadsheetMeta>(
    config,
    "?fields=properties(title,timeZone),sheets(properties(sheetId,title,gridProperties),conditionalFormats,basicFilter)",
  );
}

async function batchUpdate(config: SheetsConfig, requests: Request[]) {
  if (!requests.length) return;
  await sheetsRequest(config, ":batchUpdate", { method: "POST", body: { requests } });
}

async function getValues(config: SheetsConfig, range: string, unformatted = false) {
  const data = await sheetsRequest<{ values?: unknown[][] }>(
    config,
    `/values/${encodeURIComponent(range)}${unformatted ? "?valueRenderOption=UNFORMATTED_VALUE" : ""}`,
  );
  return data.values ?? [];
}

async function putValues(
  config: SheetsConfig,
  range: string,
  values: unknown[][],
  input: "RAW" | "USER_ENTERED",
) {
  await sheetsRequest(
    config,
    `/values/${encodeURIComponent(range)}?valueInputOption=${input}`,
    { method: "PUT", body: { range, majorDimension: "ROWS", values } },
  );
}

/* ------------------------------------------------------------------------ */
/* Steps                                                                     */
/* ------------------------------------------------------------------------ */

function loadEnv(): SheetsConfig {
  const cwd = process.cwd();
  if (!existsSync(join(cwd, ".env.local"))) {
    fail([
      `No .env.local file in ${cwd}.`,
      "Create it from .env.example and fill in the three GOOGLE_ variables",
      "(docs/launch-handoff.md, section 2).",
    ]);
  }
  loadEnvConfig(cwd, true, { info: () => {}, error: console.error });

  const { config, missing } = readSheetsConfig();
  if (!config) {
    fail([
      `Missing from .env.local: ${missing.join(", ")}.`,
      "docs/launch-handoff.md, section 2, says where each value comes from.",
    ]);
  }
  ok("Environment variables found");
  return config;
}

async function checkAccess(config: SheetsConfig): Promise<SpreadsheetMeta> {
  try {
    checkPrivateKey(config.privateKey);
    ok("Private key is readable");
    await getAccessToken(config);
    ok(`Signed in as ${config.clientEmail}`);
  } catch (error) {
    explain(error, config, "sign-in");
  }

  try {
    const meta = await getMeta(config);
    ok(`Opened "${meta.properties.title}" (time zone ${meta.properties.timeZone})`);
    return meta;
  } catch (error) {
    explain(error, config, "read");
  }
}

const sameRow = (a: unknown[], b: string[]) =>
  b.every((value, i) => String(a[i] ?? "").trim() === value);

/** Creates the Applications tab, or brings an existing one to the current layout. */
async function ensureApplicationsTab(config: SheetsConfig, meta: SpreadsheetMeta): Promise<number> {
  const headers = sheetColumns.map((c) => c.header);
  let sheet = meta.sheets.find((s) => s.properties.title === APPLICATIONS_TAB);

  if (sheet) {
    const current = (await getValues(config, headerRange))[0] ?? [];
    const blank = current.every((v) => String(v ?? "").trim() === "");

    if (!blank && !sameRow(current, headers)) {
      const rows = await getValues(config, `${APPLICATIONS_TAB}!A2:${columnLetter(Math.max(current.length, headers.length) - 1)}`);
      const hasData = rows.some((row) => row.some((v) => String(v ?? "").trim() !== ""));

      if (hasData) {
        /* Never rewrite a header over rows laid out for another one. */
        /* Minutes included, so a second archive on the same day gets its own name. */
        const stamp = new Date().toISOString().slice(0, 16).replace("T", " ").replace(":", "");
        const archived = `${APPLICATIONS_TAB} (old layout ${stamp})`;
        await batchUpdate(config, [
          {
            updateSheetProperties: {
              properties: { sheetId: sheet.properties.sheetId, title: archived },
              fields: "title",
            },
          },
        ]);
        info(`Existing "${APPLICATIONS_TAB}" tab has a different layout and data, so it was`);
        info(`renamed to "${archived}" and kept. A fresh tab is created below.`);
        sheet = undefined;
      }
    }
  }

  if (!sheet) {
    const result = await sheetsRequest<{ replies: { addSheet: { properties: { sheetId: number } } }[] }>(
      config,
      ":batchUpdate",
      {
        method: "POST",
        body: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: APPLICATIONS_TAB,
                  index: 0,
                  gridProperties: { rowCount: 1000, columnCount: sheetColumns.length },
                },
              },
            },
          ],
        },
      },
    );
    ok(`Created the "${APPLICATIONS_TAB}" tab`);
    const sheetId = result.replies[0].addSheet.properties.sheetId;
    await putValues(config, headerRange, [headers], "RAW");
    return sheetId;
  }

  const columnCount = sheet.properties.gridProperties?.columnCount ?? 0;
  if (columnCount < sheetColumns.length) {
    await batchUpdate(config, [
      {
        appendDimension: {
          sheetId: sheet.properties.sheetId,
          dimension: "COLUMNS",
          length: sheetColumns.length - columnCount,
        },
      },
    ]);
  }
  await putValues(config, headerRange, [headers], "RAW");
  ok(`"${APPLICATIONS_TAB}" tab has the current ${headers.length} columns`);
  return sheet.properties.sheetId;
}

function columnFormat(column: SheetColumn) {
  const format: Record<string, unknown> = {
    verticalAlignment: "TOP",
    wrapStrategy: column.kind === "long" ? "WRAP" : "CLIP",
  };
  if (column.kind === "date") {
    format.numberFormat = { type: "DATE_TIME", pattern: "mmm d, yyyy h:mm am/pm" };
  } else if (column.kind === "number") {
    format.numberFormat = { type: "NUMBER", pattern: "0" };
  } else {
    /* Text format: nothing typed here later is turned into a number or date. */
    format.numberFormat = { type: "TEXT", pattern: "@" };
  }
  return format;
}

async function styleApplicationsTab(config: SheetsConfig, sheetId: number) {
  const meta = await getMeta(config);
  const sheet = meta.sheets.find((s) => s.properties.sheetId === sheetId)!;
  const width = sheetColumns.length;
  const statusColumn = 0;
  const submittedColumn = 1;

  const requests: Request[] = [
    {
      updateSheetProperties: {
        properties: { sheetId, gridProperties: { frozenRowCount: 1, frozenColumnCount: 3 } },
        fields: "gridProperties.frozenRowCount,gridProperties.frozenColumnCount",
      },
    },
    /* Header: navy, white bold text. */
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: width },
        cell: {
          userEnteredFormat: {
            backgroundColor: rgb(NAVY),
            textFormat: { foregroundColor: rgb(WHITE), bold: true },
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment,wrapStrategy)",
      },
    },
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex: 0, endIndex: 1 },
        properties: { pixelSize: 44 },
        fields: "pixelSize",
      },
    },
    /* Widths, wrapping and number formats, column by column, for every row
       below the header — including rows that do not exist yet. */
    ...sheetColumns.flatMap((column, index) => [
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: "COLUMNS", startIndex: index, endIndex: index + 1 },
          properties: { pixelSize: column.width },
          fields: "pixelSize",
        },
      },
      {
        repeatCell: {
          range: { sheetId, startRowIndex: 1, startColumnIndex: index, endColumnIndex: index + 1 },
          cell: { userEnteredFormat: columnFormat(column) },
          fields: "userEnteredFormat(verticalAlignment,wrapStrategy,numberFormat)",
        },
      },
    ]),
    /* Status: a dropdown on the whole column. */
    {
      setDataValidation: {
        range: { sheetId, startRowIndex: 1, startColumnIndex: statusColumn, endColumnIndex: statusColumn + 1 },
        rule: {
          condition: {
            type: "ONE_OF_LIST",
            values: statuses.map((s) => ({ userEnteredValue: s.label })),
          },
          strict: true,
          showCustomUi: true,
        },
      },
    },
  ];

  /* Conditional formats are rebuilt from scratch so re-running never stacks
     duplicates. Each deletion shifts the rest down, so index 0 every time. */
  for (let i = 0; i < (sheet.conditionalFormats?.length ?? 0); i++) {
    requests.push({ deleteConditionalFormatRule: { sheetId, index: 0 } });
  }

  /* One color per status, first so they win over the row banding. */
  statuses.forEach((status, index) => {
    requests.push({
      addConditionalFormatRule: {
        index,
        rule: {
          ranges: [{ sheetId, startRowIndex: 1, startColumnIndex: statusColumn, endColumnIndex: statusColumn + 1 }],
          booleanRule: {
            condition: { type: "TEXT_EQ", values: [{ userEnteredValue: status.label }] },
            format: {
              backgroundColor: rgb(status.background),
              textFormat: { foregroundColor: rgb(status.text), bold: true },
            },
          },
        },
      },
    });
  });

  /* Alternate rows in the off-white, on rows that hold an application. */
  const submitted = columnLetter(submittedColumn);
  requests.push({
    addConditionalFormatRule: {
      index: statuses.length,
      rule: {
        ranges: [{ sheetId, startRowIndex: 1, startColumnIndex: 0, endColumnIndex: width }],
        booleanRule: {
          condition: {
            type: "CUSTOM_FORMULA",
            values: [{ userEnteredValue: `=AND(ISEVEN(ROW()),$${submitted}2<>"")` }],
          },
          format: { backgroundColor: rgb(OFF_WHITE) },
        },
      },
    },
  });

  /* A filter on the header row. An existing one is left alone, so re-running
     never clears criteria Mohamed has set. */
  const filter = sheet.basicFilter?.range;
  if (!filter || (filter.endColumnIndex ?? 0) < width) {
    requests.push({
      setBasicFilter: {
        filter: { range: { sheetId, startRowIndex: 0, startColumnIndex: 0, endColumnIndex: width } },
      },
    });
  }

  await batchUpdate(config, requests);
  ok("Styled: frozen header and first three columns, navy header, banding,");
  info("column widths, wrapped long answers, date-time format, filter");
  ok(`Status dropdown with ${statuses.length} values, each with its own color`);
}

async function buildOverview(config: SheetsConfig, meta: SpreadsheetMeta) {
  let sheetId = meta.sheets.find((s) => s.properties.title === OVERVIEW_TAB)?.properties.sheetId;

  if (sheetId === undefined) {
    const result = await sheetsRequest<{ replies: { addSheet: { properties: { sheetId: number } } }[] }>(
      config,
      ":batchUpdate",
      {
        method: "POST",
        body: { requests: [{ addSheet: { properties: { title: OVERVIEW_TAB, index: 1 } } }] },
      },
    );
    sheetId = result.replies[0].addSheet.properties.sheetId;
  }

  const tab = APPLICATIONS_TAB;
  const statusCol = `${tab}!A2:A`;
  const dateCol = `${tab}!B2:B`;
  const monthStart = "DATE(YEAR(TODAY()),MONTH(TODAY()),1)";

  const rows: (string | number)[][] = [
    ["Applications overview", ""],
    ["Updates by itself as rows are added or statuses change.", ""],
    ["", ""],
    ["Total applications", `=COUNTA(${dateCol})`],
    ["This month", `=COUNTIFS(${dateCol},">="&${monthStart},${dateCol},"<"&EDATE(${monthStart},1))`],
    ["Last 30 days", `=COUNTIFS(${dateCol},">="&(NOW()-30))`],
    ["Conversion rate (Active client / total)", `=IF(B4=0,0,COUNTIF(${statusCol},"Active client")/B4)`],
    ["", ""],
    ["By status", "Count"],
    ...statuses.map((s, i) => [s.label, `=COUNTIF(${statusCol},A${10 + i})`]),
  ];

  await sheetsRequest(config, `/values/${encodeURIComponent(`${OVERVIEW_TAB}!A1:Z200`)}:clear`, {
    method: "POST",
    body: {},
  });
  await putValues(config, `${OVERVIEW_TAB}!A1:B${rows.length}`, rows, "USER_ENTERED");

  const statusRows = statuses.map((status, i) => ({
    repeatCell: {
      range: { sheetId, startRowIndex: 9 + i, endRowIndex: 10 + i, startColumnIndex: 0, endColumnIndex: 1 },
      cell: {
        userEnteredFormat: {
          backgroundColor: rgb(status.background),
          textFormat: { foregroundColor: rgb(status.text), bold: true },
        },
      },
      fields: "userEnteredFormat(backgroundColor,textFormat)",
    },
  }));

  await batchUpdate(config, [
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
        properties: { pixelSize: 320 },
        fields: "pixelSize",
      },
    },
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
        properties: { pixelSize: 120 },
        fields: "pixelSize",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 2 },
        cell: { userEnteredFormat: { textFormat: { bold: true, fontSize: 14, foregroundColor: rgb(NAVY) } } },
        fields: "userEnteredFormat.textFormat",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 1 },
        cell: { userEnteredFormat: { textFormat: { italic: true, foregroundColor: rgb("#5C6B80") } } },
        fields: "userEnteredFormat.textFormat",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 8, endRowIndex: 9, startColumnIndex: 0, endColumnIndex: 2 },
        cell: {
          userEnteredFormat: {
            backgroundColor: rgb(NAVY),
            textFormat: { foregroundColor: rgb(WHITE), bold: true },
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 3, endRowIndex: 7, startColumnIndex: 0, endColumnIndex: 1 },
        cell: { userEnteredFormat: { textFormat: { bold: true } } },
        fields: "userEnteredFormat.textFormat",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 6, endRowIndex: 7, startColumnIndex: 1, endColumnIndex: 2 },
        cell: { userEnteredFormat: { numberFormat: { type: "PERCENT", pattern: "0.0%" } } },
        fields: "userEnteredFormat.numberFormat",
      },
    },
    ...statusRows,
  ]);

  ok(`"${OVERVIEW_TAB}" tab: total, this month, last 30 days, conversion rate, count per status`);
}

/* ------------------------------------------------------------------------ */
/* --test                                                                    */
/* ------------------------------------------------------------------------ */

async function appendTestRow(config: SheetsConfig, timeZone: string) {
  const parsed = applicationSchema.safeParse({
    ...initialValues(),
    fullName: "TEST ROW - safe to delete",
    email: "sheets.setup@test.invalid",
    phone: "2125550147",
    age: "30",
    gender: "prefer-not-to-say",
    height: { unit: "ft-in", feet: "5", inches: "10", cm: "" },
    weight: { unit: "lbs", value: "180" },
    occupation: "Test",
    workSchedule: "Written by npm run sheets:setup -- --test",
    primaryGoal: "overall-fitness",
    medicalConditions: { answer: "yes", details: "Test details" },
    surgery: { answer: "no", details: "" },
    injuries: { answer: "no", details: "" },
    jointPain: { answer: "no", details: "" },
    heartLung: { answer: "no", details: "" },
    trainingHistory: "beginner",
    currentlyTraining: "yes",
    currentDays: "3",
    trainingLocation: "home-gym",
    currentTrainingType: "combination",
    commitDays: "4",
    sessionLength: "60",
    availableDays: ["mon", "wed", "fri"],
    consent: true,
    healthConsent: true,
  });
  if (!parsed.success) fail(["The built-in test application no longer passes validation."]);

  const expected = toSheetRow(parsed.data, toSheetsDateTime(new Date(), timeZone));
  const result = await appendApplicationRow(config, expected);
  if (result.status !== "appended") {
    explain(
      new GoogleApiError(result.status === "failed" ? result.code : "unexpected", null, "append"),
      config,
      "write",
    );
  }

  const row = Number(/(\d+)(?::[A-Z]+\d+)?$/.exec(result.updatedRange)?.[1]);
  if (!row) fail([`The append reported an unexpected range: ${result.updatedRange}`]);

  const notes = columnLetter(sheetColumns.length - 1);
  await putValues(
    config,
    `${APPLICATIONS_TAB}!${notes}${row}`,
    [[`Test row from npm run sheets:setup -- --test, ${new Date().toISOString()}. Delete this row.`]],
    "RAW",
  );

  const [header] = await getValues(config, headerRange);
  const [landed] = await getValues(
    config,
    `${APPLICATIONS_TAB}!A${row}:${columnLetter(answerColumns.length - 1)}${row}`,
    true,
  );

  const problems: string[] = [];
  answerColumns.forEach((column, i) => {
    if (String(header?.[i] ?? "") !== column.header) {
      problems.push(`column ${columnLetter(i)} is headed "${header?.[i] ?? ""}", expected "${column.header}"`);
    }
    const want = expected[i];
    const got = landed?.[i] ?? "";
    const same =
      typeof want === "number"
        ? Math.abs(Number(got) - want) < 1e-6
        : String(got) === want;
    if (!same) problems.push(`${column.header} (${columnLetter(i)}): wrote ${JSON.stringify(want)}, read ${JSON.stringify(got)}`);
  });
  if (String(header?.[sheetColumns.length - 1] ?? "") !== COACH_NOTES) {
    problems.push(`the last column is not "${COACH_NOTES}"`);
  }

  if (problems.length) fail(["The test row did not land as expected:", ...problems.map((p) => `  - ${p}`)]);

  ok(`Test row appended at row ${row}; all ${answerColumns.length} answers are under the right headers`);
  info(`Delete row ${row} in "${APPLICATIONS_TAB}" once you have looked at it.`);
}

/* ------------------------------------------------------------------------ */

async function main() {
  const test = process.argv.includes("--test");
  console.log(`\nGoogle Sheets setup${test ? " (with test row)" : ""}\n`);

  const config = loadEnv();
  const meta = await checkAccess(config);

  try {
    const sheetId = await ensureApplicationsTab(config, meta);
    await styleApplicationsTab(config, sheetId);
    await buildOverview(config, await getMeta(config));
    if (test) await appendTestRow(config, meta.properties.timeZone);
  } catch (error) {
    if (error instanceof SetupError) throw error;
    explain(error, config, "write");
  }

  console.log("\nDone. The sheet is ready for applications.\n");
}

main().catch((error) => {
  if (error instanceof SetupError) {
    console.error(`\n  ✗ ${error.message.split("\n").join("\n    ")}\n`);
  } else {
    /* Unknown failures: the message only, never an object that could hold config. */
    console.error(`\n  ✗ Unexpected error: ${error instanceof Error ? error.message : String(error)}\n`);
  }
  /* exitCode, not exit(): exiting while a fetch socket is still closing
     trips a libuv assertion on Windows. */
  process.exitCode = 1;
});
