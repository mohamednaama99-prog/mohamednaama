"use server";

import { formFields } from "@/content/form";
import { toE164 } from "@/lib/phone";
import { appendRow, isSheetsConfigured } from "@/lib/sheets";
import {
  applicationSchema,
  fieldErrorsFrom,
  HONEYPOT_FIELD,
} from "@/lib/validation";

/* A "use server" module may only export async functions. Types are erased at
   compile time so they are fine here; values are not. */
export type ApplicationState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** True only when a development build accepted a submission that was never
   *  stored. Never set in production. */
  devMock?: boolean;
};

/** Column order in the spreadsheet. Submitted-at first, then the fields. */
const columns = [
  "submittedAt",
  "packageId",
  ...formFields.map((field) => field.name),
];

export async function submitApplication(
  _previous: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  /* Honeypot. Bots fill every field; people never see this one. Respond as
     though it succeeded so the bot learns nothing. */
  if (formData.get(HONEYPOT_FIELD)) {
    return { status: "success" };
  }

  const raw = {
    packageId: formData.get("packageId") ?? "",
    ...Object.fromEntries(
      formFields.map((field) => [field.name, formData.get(field.name) ?? ""]),
    ),
  };

  const parsed = applicationSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const data = parsed.data as Record<string, unknown>;

  const values = columns.map((column) => {
    if (column === "submittedAt") return new Date().toISOString();
    if (column === "phone") return toE164(String(data.phone ?? ""));
    return String(data[column] ?? "");
  });

  /*
   * A success state is only ever shown when the submission was actually
   * stored.
   *
   * Until the client supplies the spreadsheet and credentials there is nowhere
   * to store it, so in production this is an error: the visitor is told
   * plainly that it did not reach Mohamed and is pointed at WhatsApp. A
   * development build accepts it so the flow can be reviewed, and flags it as
   * a mock so the UI can say so.
   */
  if (!isSheetsConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[application] Rejected: Google Sheets is not configured, so the submission could not be stored.",
      );
      return { status: "error", message: "not-stored" };
    }

    console.warn(
      "[application] DEV MOCK — not stored anywhere. Google Sheets is not configured.\nPayload:",
      Object.fromEntries(columns.map((column, i) => [column, values[i]])),
    );
    return { status: "success", devMock: true };
  }

  const result = await appendRow(values);

  if (result.status !== "appended") {
    console.error("[application] Sheets append failed:", result);
    return { status: "error", message: "not-stored" };
  }

  return { status: "success" };
}
