import "server-only";

import { createPrivateKey, createSign } from "node:crypto";

import { answerColumns, appendRange, APPLICATIONS_TAB } from "@/lib/application-sheet";

/**
 * Google Sheets, with no SDK dependency.
 *
 * A service-account JWT is signed locally, exchanged for an access token
 * scoped to spreadsheets only, and used for plain REST calls. The `googleapis`
 * package would add megabytes for the few calls this needs.
 *
 * `import "server-only"` makes any attempt to pull this into a client bundle a
 * build error, so the private key cannot reach the browser. The setup script
 * runs it under Node's `react-server` condition for the same reason.
 *
 * Nothing here logs a key, a token or an answer.
 */

const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://sheets.googleapis.com/v4/spreadsheets";
const TIMEOUT_MS = 10_000;

export const REQUIRED_ENV = [
  "GOOGLE_SHEETS_SPREADSHEET_ID",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
] as const;

export type SheetsConfig = {
  spreadsheetId: string;
  clientEmail: string;
  privateKey: string;
};

/**
 * Accepts the key with real newlines or with escaped `\n` sequences, with or
 * without surrounding quotes, and with Windows line endings.
 */
export function normalizePrivateKey(raw: string): string {
  let key = raw.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\r/g, "").replace(/\\n/g, "\n").replace(/\r/g, "").trim() + "\n";
}

/** The config, or the names of the variables that are missing. */
export function readSheetsConfig(
  env: Record<string, string | undefined> = process.env,
): { config: SheetsConfig; missing?: undefined } | { config?: undefined; missing: string[] } {
  const missing = REQUIRED_ENV.filter((name) => !env[name]?.trim());
  if (missing.length) return { missing };

  return {
    config: {
      spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID!.trim(),
      clientEmail: env.GOOGLE_SERVICE_ACCOUNT_EMAIL!.trim(),
      privateKey: normalizePrivateKey(env.GOOGLE_PRIVATE_KEY!),
    },
  };
}

/* ------------------------------------------------------------------------ */
/* Errors                                                                    */
/* ------------------------------------------------------------------------ */

export type GoogleErrorCode =
  | "malformed-key"
  | "invalid-credentials"
  | "api-disabled"
  | "missing-tab"
  | "no-access"
  | "not-found"
  | "rate-limited"
  | "network"
  | "unexpected";

export class GoogleApiError extends Error {
  constructor(
    readonly code: GoogleErrorCode,
    readonly status: number | null,
    message: string,
    /** For "api-disabled": the console link that enables the API. */
    readonly activationUrl?: string,
  ) {
    super(message);
    this.name = "GoogleApiError";
  }
}

type GoogleErrorBody = {
  error?:
    | string
    | {
        code?: number;
        message?: string;
        status?: string;
        details?: { reason?: string; metadata?: Record<string, string> }[];
      };
  error_description?: string;
};

function classify(status: number, body: GoogleErrorBody): GoogleApiError {
  const error = typeof body.error === "object" ? body.error : undefined;
  const message =
    error?.message ?? body.error_description ?? (typeof body.error === "string" ? body.error : "");
  const reasons = error?.details?.map((d) => d.reason) ?? [];
  const activationUrl = error?.details?.find((d) => d.metadata?.activationUrl)?.metadata
    ?.activationUrl;

  if (reasons.includes("SERVICE_DISABLED") || /has not been used|is disabled/i.test(message)) {
    return new GoogleApiError("api-disabled", status, message, activationUrl);
  }
  /* A range naming a tab that does not exist. */
  if (status === 400 && /unable to parse range/i.test(message)) {
    return new GoogleApiError("missing-tab", status, message);
  }
  if (status === 400 && /invalid_grant|invalid_client|JWT|signature/i.test(`${body.error} ${message}`)) {
    return new GoogleApiError("invalid-credentials", status, message);
  }
  if (status === 401) return new GoogleApiError("invalid-credentials", status, message);
  if (status === 403) return new GoogleApiError("no-access", status, message);
  if (status === 404) return new GoogleApiError("not-found", status, message);
  if (status === 429) return new GoogleApiError("rate-limited", status, message);
  return new GoogleApiError("unexpected", status, message);
}

async function request(url: string, init: RequestInit): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (cause) {
    throw new GoogleApiError(
      "network",
      null,
      cause instanceof Error ? cause.message : "Network error",
    );
  }

  const body = (await response.json().catch(() => ({}))) as GoogleErrorBody;
  if (!response.ok) throw classify(response.status, body);
  return body;
}

/* ------------------------------------------------------------------------ */
/* Auth                                                                      */
/* ------------------------------------------------------------------------ */

/** Parses the key without using it, so a malformed key gets its own message. */
export function checkPrivateKey(privateKey: string): void {
  try {
    createPrivateKey(privateKey);
  } catch {
    throw new GoogleApiError(
      "malformed-key",
      null,
      "GOOGLE_PRIVATE_KEY could not be read as a private key",
    );
  }
}

const tokenCache = new Map<string, { token: string; expiresAt: number }>();

export async function getAccessToken(config: SheetsConfig): Promise<string> {
  const cached = tokenCache.get(config.clientEmail);
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

  checkPrivateKey(config.privateKey);

  const now = Math.floor(Date.now() / 1000);
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({
    iss: config.clientEmail,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  })}`;

  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(config.privateKey).toString("base64url");

  const data = (await request(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
  })) as { access_token?: string; expires_in?: number };

  if (!data.access_token) {
    throw new GoogleApiError("invalid-credentials", null, "Token exchange returned no token");
  }

  tokenCache.set(config.clientEmail, {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  });
  return data.access_token;
}

/** A call to the Sheets API for the configured spreadsheet. */
export async function sheetsRequest<T>(
  config: SheetsConfig,
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const token = await getAccessToken(config);
  return (await request(`${API}/${encodeURIComponent(config.spreadsheetId)}${path}`, {
    method: init.method ?? "GET",
    headers: {
      authorization: `Bearer ${token}`,
      ...(init.body ? { "content-type": "application/json" } : {}),
    },
    ...(init.body ? { body: JSON.stringify(init.body) } : {}),
  })) as T;
}

/* ------------------------------------------------------------------------ */
/* What the app uses                                                         */
/* ------------------------------------------------------------------------ */

const timeZones = new Map<string, string>();

/** The spreadsheet's own time zone, looked up once per server instance. */
export async function getSpreadsheetTimeZone(config: SheetsConfig): Promise<string> {
  const known = timeZones.get(config.spreadsheetId);
  if (known) return known;
  try {
    const data = await sheetsRequest<{ properties?: { timeZone?: string } }>(
      config,
      "?fields=properties.timeZone",
    );
    const zone = data.properties?.timeZone || "UTC";
    timeZones.set(config.spreadsheetId, zone);
    return zone;
  } catch {
    return "UTC";
  }
}

export type AppendResult =
  | { status: "appended"; updatedRange: string }
  /** The Applications tab or its header row is gone: run the setup script. */
  | { status: "not-set-up"; missing: "tab" | "header" }
  | { status: "failed"; code: GoogleErrorCode; httpStatus: number | null };

const headerCheckRange = `${APPLICATIONS_TAB}!A1:B1`;
const expectedHeader = answerColumns.slice(0, 2).map((c) => c.header.toLowerCase());

/**
 * Appends one application.
 *
 * The header row is checked first. Without it, an append into an empty tab
 * would put the application in row 1, where the header belongs, and every
 * later one would line up under the wrong labels.
 *
 * RAW: nothing written is ever parsed as a formula, a number or a date — the
 * submitted-at serial and the age are sent as JSON numbers, everything else as
 * text. OVERWRITE fills the first empty row rather than inserting one, so the
 * row keeps the column-wide Status dropdown and formatting the setup script
 * applied.
 */
export async function appendApplicationRow(
  config: SheetsConfig,
  row: (string | number)[],
): Promise<AppendResult> {
  try {
    const header = await sheetsRequest<{ values?: unknown[][] }>(
      config,
      `/values/${encodeURIComponent(headerCheckRange)}`,
    );
    const found = (header.values?.[0] ?? []).map((v) => String(v ?? "").trim().toLowerCase());
    if (expectedHeader.some((label, i) => found[i] !== label)) {
      return { status: "not-set-up", missing: "header" };
    }

    const result = await sheetsRequest<{ updates?: { updatedRange?: string } }>(
      config,
      `/values/${encodeURIComponent(appendRange)}:append` +
        "?valueInputOption=RAW&insertDataOption=OVERWRITE&includeValuesInResponse=false",
      { method: "POST", body: { majorDimension: "ROWS", values: [row] } },
    );
    return { status: "appended", updatedRange: result.updates?.updatedRange ?? "" };
  } catch (error) {
    if (error instanceof GoogleApiError && error.code === "missing-tab") {
      return { status: "not-set-up", missing: "tab" };
    }
    if (error instanceof GoogleApiError) {
      return { status: "failed", code: error.code, httpStatus: error.status };
    }
    return { status: "failed", code: "unexpected", httpStatus: null };
  }
}
