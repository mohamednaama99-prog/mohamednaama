import { z } from "zod";

import { formFields, GENERAL_ENQUIRY } from "@/content/form";
import { packageIds } from "@/content/packages";
import { isValidUsPhone, normalizeUsPhone } from "@/lib/phone";

const packageValues: [string, ...string[]] = [GENERAL_ENQUIRY, ...packageIds];

/**
 * One schema, used on both sides.
 *
 * The client runs it before submitting so errors appear without a round trip;
 * the server action runs it again on the raw FormData, because client-side
 * validation is a convenience and never a guarantee.
 *
 * It is derived from the same field config the form renders from, so the two
 * cannot drift apart.
 */
function schemaForField(field: (typeof formFields)[number]) {
  switch (field.type) {
    case "email":
      return z.string().trim().email("Enter a valid email address").max(120);

    case "tel":
      /* US only: the field carries whatever the visitor typed, so normalise to
         digits first and then apply the NANP rule. */
      return z
        .string()
        .transform(normalizeUsPhone)
        .refine(isValidUsPhone, "Enter a 10-digit US number, e.g. (212) 555-0147");

    case "select": {
      const values = (field.options?.map((o) => o.value) ?? []) as [
        string,
        ...string[],
      ];
      return z.enum(values, { message: "Choose one of the options" });
    }

    case "checkbox":
      return field.required
        ? z.literal("on", { message: "This has to be ticked to continue" })
        : z.string().optional();

    case "textarea":
      return z
        .string()
        .trim()
        .max(field.maxLength ?? 1200)
        .optional();

    default:
      return z
        .string()
        .trim()
        .min(2, "This field is required")
        .max(field.maxLength ?? 120);
  }
}

export const applicationSchema = z.object({
  ...Object.fromEntries(
    formFields.map((field) => {
      const base = schemaForField(field);
      return [field.name, field.required ? base : (base as z.ZodTypeAny).optional()];
    }),
  ),
  /* Not a rendered field — it comes from the two segmented controls. */
  packageId: z.enum(packageValues, { message: "Choose a plan or a general enquiry" }),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

/** Honeypot: a field real people never fill in. */
export const HONEYPOT_FIELD = "company";

/** Flattens zod issues into one message per field. */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}
