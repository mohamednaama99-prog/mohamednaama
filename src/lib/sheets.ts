import { createSign } from "node:crypto";

/**
 * Google Sheets append, with no SDK dependency.
 *
 * A service-account JWT is signed locally, exchanged for an access token, and
 * used to append one row. That is the whole integration — the `googleapis`
 * package would add megabytes for this single call.
 *
 * Nothing here invents credentials. Until the client supplies a spreadsheet and
 * a service account, `readConfig()` returns null and submissions are accepted
 * and logged without being written anywhere. See docs/02-google-sheets-setup.md.
 *
 * This module is server-only: it is imported exclusively by a "use server"
 * action, so the private key never reaches the client bundle.
 */

const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

type SheetsConfig = {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
  range: string;
};

function readConfig(): SheetsConfig | null {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  /* .env files keep the PEM on one line with literal \n sequences. */
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const range = process.env.GOOGLE_SHEETS_RANGE ?? "Applications!A:Z";

  if (!clientEmail || !privateKey || !spreadsheetId) return null;

  return { clientEmail, privateKey, spreadsheetId, range };
}

export function isSheetsConfigured(): boolean {
  return readConfig() !== null;
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

async function getAccessToken(config: SheetsConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const assertionBody = [
    base64url(JSON.stringify({ alg: "RS256", typ: "JWT" })),
    base64url(
      JSON.stringify({
        iss: config.clientEmail,
        scope: SCOPE,
        aud: TOKEN_URL,
        iat: now,
        exp: now + 3600,
      }),
    ),
  ].join(".");

  const signer = createSign("RSA-SHA256");
  signer.update(assertionBody);
  signer.end();
  const signature = signer.sign(config.privateKey).toString("base64url");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${assertionBody}.${signature}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed (${response.status})`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Token exchange returned no token");

  return data.access_token;
}

export type AppendResult =
  | { status: "appended" }
  | { status: "skipped"; reason: string }
  | { status: "failed"; reason: string };

export async function appendRow(values: string[]): Promise<AppendResult> {
  const config = readConfig();

  if (!config) {
    return {
      status: "skipped",
      reason: "Google Sheets is not configured (missing environment variables)",
    };
  }

  try {
    const token = await getAccessToken(config);

    const url =
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(config.spreadsheetId)}` +
      `/values/${encodeURIComponent(config.range)}:append` +
      `?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ values: [values] }),
    });

    if (!response.ok) {
      return {
        status: "failed",
        reason: `Sheets API responded ${response.status}`,
      };
    }

    return { status: "appended" };
  } catch (error) {
    return {
      status: "failed",
      reason: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
