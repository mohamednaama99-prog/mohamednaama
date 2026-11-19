import { allFields, planCopy, type FormField } from "@/content/form";
import { getPackage } from "@/content/packages";
import { formatUsPhone } from "@/lib/phone";
import type { ApplicationData } from "@/lib/validation";

/**
 * The layout of the Google Sheet that receives applications.
 *
 * Shared by the server action (which appends one row per application) and
 * `npm run sheets:setup` (which builds and styles the tab). Everything is
 * derived from the field list in src/content/form.ts, so adding a question
 * adds a column in both places at once.
 *
 * Column order: Status, Submitted at, Full name, WhatsApp, Email, Plan, then
 * every other answer in form order, then Coach notes last.
 */

export const APPLICATIONS_TAB = "Applications";
export const OVERVIEW_TAB = "Overview";

/** Tracking statuses, in pipeline order, each with its own row color. */
export const statuses = [
  { label: "New", background: "#DCE7F7", text: "#0E2344" },
  { label: "Contacted", background: "#E3DDF5", text: "#3B2A73" },
  { label: "In conversation", background: "#FBEFD5", text: "#6B4A08" },
  { label: "Awaiting payment", background: "#FCE2CF", text: "#7A3A0B" },
  { label: "Active client", background: "#D7EFE2", text: "#1F5C40" },
  { label: "Not a fit", background: "#EDEFF2", text: "#4A5566" },
  { label: "No response", background: "#F6DADA", text: "#7A1F1F" },
] as const;

/** What the app writes into Status on every new application. */
export const NEW_STATUS = statuses[0].label;

export type ColumnKind = "status" | "date" | "short" | "long" | "number" | "phone";

export type SheetColumn = {
  header: string;
  kind: ColumnKind;
  /** Pixel width in the sheet. */
  width: number;
  /** The form field this column holds, if any. */
  field?: FormField;
};

/** Answers placed straight after Submitted at, ahead of form order. */
const LEADING_FIELDS = ["fullName", "phone", "email", "packageId"] as const;

function kindOf(field: FormField): ColumnKind {
  switch (field.kind) {
    case "longText":
    case "health":
      return "long";
    case "age":
      return "number";
    case "phone":
      return "phone";
    default:
      return "short";
  }
}

const WIDTHS: Record<ColumnKind, number> = {
  status: 150,
  date: 160,
  short: 170,
  long: 300,
  number: 70,
  phone: 140,
};

function fieldColumn(field: FormField): SheetColumn {
  const kind = kindOf(field);
  const width = field.name === "fullName" ? 180 : field.name === "email" ? 220 : WIDTHS[kind];
  return { header: field.column, kind, width, field };
}

const byName = (name: string) => allFields.find((f) => f.name === name)!;

/** Every column the app writes, in order. Coach notes is not among them. */
export const answerColumns: SheetColumn[] = [
  { header: "Status", kind: "status", width: WIDTHS.status },
  { header: "Submitted at", kind: "date", width: WIDTHS.date },
  ...LEADING_FIELDS.map((name) => fieldColumn(byName(name))),
  ...allFields
    .filter((f) => !(LEADING_FIELDS as readonly string[]).includes(f.name))
    .map(fieldColumn),
];

export const COACH_NOTES = "Coach notes";

/** The full header row: every answer column, then Coach notes. */
export const sheetColumns: SheetColumn[] = [
  ...answerColumns,
  { header: COACH_NOTES, kind: "long", width: 320 },
];

/** 0 → A, 25 → Z, 26 → AA. */
export function columnLetter(index: number): string {
  let letter = "";
  let n = index + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    n = Math.floor((n - 1) / 26);
  }
  return letter;
}

/**
 * Where new rows are appended: every column the app writes, and nothing to the
 * right of it. Leaving Coach notes outside the range means a note typed into
 * an otherwise empty row can never move where the next application lands —
 * the append looks only at the answer columns to find the first empty row.
 */
export const appendRange = `${APPLICATIONS_TAB}!A1:${columnLetter(answerColumns.length - 1)}`;

/** The whole header row, Coach notes included. */
export const headerRange = `${APPLICATIONS_TAB}!A1:${columnLetter(sheetColumns.length - 1)}1`;

/* ------------------------------------------------------------------------ */
/* Cell values                                                               */
/* ------------------------------------------------------------------------ */

/**
 * Formula-injection guard. Values are written with valueInputOption RAW, so
 * Sheets never evaluates them; this is the second layer, for when the sheet is
 * exported and opened elsewhere. Anything starting with = + - @ or a tab gets a
 * leading apostrophe.
 */
export function escapeCell(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

const labelOf = (field: FormField, value: string) =>
  "options" in field
    ? (field.options.find((o) => o.value === value)?.label ?? "")
    : value;

/** One answer as it reads in the sheet. */
export function formatAnswer(field: FormField, value: unknown): string | number {
  switch (field.kind) {
    case "age":
      return typeof value === "number" ? value : "";

    case "phone":
      /* National format: it reads as text, and with no leading "+" it needs no
         apostrophe from the injection guard. */
      return formatUsPhone(String(value ?? ""));

    case "choice":
      return labelOf(field, String(value ?? ""));

    case "multiChoice":
      return (Array.isArray(value) ? value : [])
        .map((v) => labelOf(field, String(v)))
        .join(", ");

    case "health": {
      const health = value as { answer?: string; details?: string } | undefined;
      return health?.answer === "yes" ? `Yes - ${health.details ?? ""}` : "No";
    }

    case "height": {
      const height = value as
        | { unit: "cm"; cm: number }
        | { unit: "ft-in"; feet: number; inches: number }
        | undefined;
      if (!height) return "";
      return height.unit === "cm"
        ? `${height.cm} cm`
        : `${height.feet} ft ${height.inches} in`;
    }

    case "weight": {
      const weight = value as { unit: string; value: number } | undefined;
      return weight ? `${weight.value} ${weight.unit}` : "";
    }

    case "plan": {
      const pkg = getPackage(String(value ?? ""));
      return pkg ? `${pkg.name} · ${pkg.termLabel}` : planCopy.generalSheetValue;
    }

    case "consent":
      return value === true ? "Yes" : "No";

    default:
      return String(value ?? "");
  }
}

/**
 * Google Sheets stores date-times as days since 30 December 1899. The
 * wall-clock time is taken in the spreadsheet's own time zone, so "Submitted
 * at" reads in the owner's local time and "this month" formulas line up.
 */
export function toSheetsDateTime(date: Date, timeZone: string): number {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
  } catch {
    return toSheetsDateTime(date, "UTC");
  }
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const wallClock = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );
  return wallClock / 86_400_000 + 25_569;
}

/** The row the app appends: one value per answer column. */
export function toSheetRow(
  data: ApplicationData,
  submittedAt: number,
): (string | number)[] {
  return answerColumns.map((column) => {
    if (column.kind === "status") return NEW_STATUS;
    if (column.kind === "date") return submittedAt;
    const value = formatAnswer(column.field!, data[column.field!.name]);
    return typeof value === "string" ? escapeCell(value) : value;
  });
}
