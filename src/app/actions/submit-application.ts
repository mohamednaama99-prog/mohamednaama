"use server";

import { headers } from "next/headers";

import { limits } from "@/content/form";
import { toSheetRow, toSheetsDateTime } from "@/lib/application-sheet";
import { allowSubmission, clientIp } from "@/lib/rate-limit";
import {
  appendApplicationRow,
  getSpreadsheetTimeZone,
  readSheetsConfig,
} from "@/lib/sheets";
import {
  applicationSchema,
  fieldErrorsFrom,
  HONEYPOT_FIELD,
} from "@/lib/validation";

/* A "use server" module may only export async functions; types are erased at
   compile time, so exporting one is fine. */
export type SubmitResult =
  | { status: "success" }
  | { status: "invalid"; fieldErrors: Record<string, string> }
  | { status: "rate-limited" }
  | { status: "failed" };

/** Metadata the form sends alongside the answers. Never stored. */
const ELAPSED_FIELD = "elapsedMs";

/**
 * Receives one New Client Application.
 *
 * Order matters: the rate limit counts every call, the cheap bot checks run
 * before validation, and nothing reaches Google until the payload has passed
 * the same schema the browser used. A success is only ever returned for an
 * application that was actually stored.
 *
 * What reaches the visitor is deliberately generic. What reaches the server
 * log is a reason code — never an answer, a key or a token.
 */
export async function submitApplication(payload: unknown): Promise<SubmitResult> {
  const ip = clientIp(await headers());
  if (!allowSubmission(ip)) return { status: "rate-limited" };

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { status: "failed" };
  }

  const {
    [HONEYPOT_FIELD]: honeypot,
    [ELAPSED_FIELD]: elapsedMs,
    ...answers
  } = payload as Record<string, unknown>;

  /* Honeypot: people never see this field; bots fill everything. Answer as
     though it worked, so a bot learns nothing. */
  if (typeof honeypot === "string" && honeypot.trim()) {
    return { status: "success" };
  }

  /* Five steps of questions cannot be answered in a few seconds. Too fast is
     treated as a failure rather than a fake success, so a real person who
     somehow trips it sees the retry banner instead of losing their answers. */
  if (
    typeof elapsedMs !== "number" ||
    !Number.isFinite(elapsedMs) ||
    elapsedMs < limits.minSecondsToSubmit * 1000
  ) {
    return { status: "failed" };
  }

  const parsed = applicationSchema.safeParse(answers);
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error);
    /* Unknown keys or a malformed shape: nothing a visitor could fix. */
    if (Object.keys(fieldErrors).length === 0) return { status: "failed" };
    return { status: "invalid", fieldErrors };
  }

  /* Development only: rehearse each outcome without a spreadsheet. Production
     builds inline NODE_ENV, so this branch does not exist there. */
  if (process.env.NODE_ENV !== "production") {
    const simulate = process.env.APPLY_DEV_SIMULATE;
    if (simulate === "success") return { status: "success" };
    if (simulate === "invalid") {
      /* What a server-side rejection looks like: the real schema, run on a
         copy with a broken email, so the form jumps back to step 1. */
      const rejected = applicationSchema.safeParse({ ...answers, email: "not-an-email" });
      return rejected.success
        ? { status: "failed" }
        : { status: "invalid", fieldErrors: fieldErrorsFrom(rejected.error) };
    }
    if (simulate === "failure") return { status: "failed" };
    if (simulate === "rate-limited") return { status: "rate-limited" };
  }

  const { config, missing } = readSheetsConfig();
  if (!config) {
    console.error(
      `[application] Not stored: Google Sheets is not configured. Missing environment variable(s): ${missing.join(", ")}`,
    );
    return { status: "failed" };
  }

  const timeZone = await getSpreadsheetTimeZone(config);
  const row = toSheetRow(parsed.data, toSheetsDateTime(new Date(), timeZone));
  const result = await appendApplicationRow(config, row);

  if (result.status === "not-set-up") {
    console.error(
      result.missing === "tab"
        ? '[application] Not stored: the spreadsheet has no "Applications" tab. Run `npm run sheets:setup` to create it.'
        : '[application] Not stored: the "Applications" tab has no header row. Run `npm run sheets:setup` to restore it.',
    );
    return { status: "failed" };
  }
  if (result.status === "failed") {
    console.error(
      `[application] Not stored: Google Sheets ${result.code}${result.httpStatus ? ` (HTTP ${result.httpStatus})` : ""}`,
    );
    return { status: "failed" };
  }

  return { status: "success" };
}
