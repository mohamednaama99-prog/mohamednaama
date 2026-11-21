import { z } from "zod";

import {
  allFields,
  formSteps,
  GENERAL_ENQUIRY,
  heightUnits,
  limits,
  validationMessages as msg,
  weightUnits,
  type FormField,
} from "@/content/form";
import { packageIds } from "@/content/packages";
import { toE164 } from "@/lib/phone";

/**
 * One schema for the New Client Application, used on both sides.
 *
 * The browser validates each step with `stepSchemas` before moving on, so
 * mistakes show without a round trip. The server action validates the whole
 * payload again with `applicationSchema`, because anything the browser does is
 * a convenience and never a guarantee. Both are built from the field list in
 * src/content/form.ts.
 *
 * Every rule a field has lives on that field — including the unit toggles and
 * the Yes → details questions, which are small nested objects — so all of a
 * step's errors are reported together, not one round at a time.
 *
 * The server-side guarantees: unknown keys are rejected (strict objects), every
 * choice must be one of its options, numbers must be in range, text is trimmed,
 * stripped of control characters and capped (short 120, long 1000).
 */

/* ------------------------------------------------------------------------ */
/* Text cleaning                                                             */
/* ------------------------------------------------------------------------ */

/*
 * C0 and C1 control characters (tab and newline are handled separately),
 * zero-width and bidirectional-override characters, and the BOM. The zero-width
 * joiner (U+200D) is kept: emoji sequences depend on it.
 */
const INVISIBLE =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F​‌‎‏‪-‮⁠-⁤⁦-⁩﻿]/g;

export function cleanText(input: string, multiline: boolean): string {
  let text = input.replace(/\r\n?/g, "\n").replace(/\t/g, " ");
  text = text.replace(INVISIBLE, "");

  if (multiline) {
    text = text
      .split("\n")
      .map((line) => line.replace(/ {2,}/g, " ").trimEnd())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
  } else {
    text = text.replace(/\s+/g, " ");
  }

  return text.trim();
}

/* ------------------------------------------------------------------------ */
/* Building blocks                                                           */
/* ------------------------------------------------------------------------ */

/** Raw strings are capped generously before cleaning, then precisely after. */
function text(max: number, multiline: boolean, required: string | false) {
  const cleaned = z
    .string()
    .max(max * 2, msg.tooLong(max))
    .transform((value) => cleanText(value, multiline));

  return cleaned.pipe(
    required
      ? z.string().min(1, required).max(max, msg.tooLong(max))
      : z.string().max(max, msg.tooLong(max)),
  );
}

function choice(options: readonly { value: string }[], required: boolean) {
  const values = options.map((o) => o.value) as [string, ...string[]];
  const oneOf = z.enum(values, { message: msg.choose });
  return required ? oneOf : z.union([z.literal(""), oneOf], { message: msg.choose });
}

/** Whole numbers only, as typed: "32", never "32.5" or "3e1". */
function wholeNumber(raw: string): number | null {
  const value = cleanText(raw, false);
  return /^\d{1,3}$/.test(value) ? Number(value) : null;
}

/** Up to one decimal place, for body weight: "180" or "180.5". */
function decimalNumber(raw: string): number | null {
  const value = cleanText(raw, false);
  return /^\d{1,3}(\.\d)?$/.test(value) ? Number(value) : null;
}

const within = (value: number | null, range: { min: number; max: number }) =>
  value !== null && value >= range.min && value <= range.max;

const shortRaw = z.string().max(16);

const heightUnitValues = heightUnits.map((u) => u.value) as ["ft-in", "cm"];
const weightUnitValues = weightUnits.map((u) => u.value) as ["lbs", "kg"];

const heightSchema = z
  .strictObject({
    unit: z.enum(heightUnitValues, { message: msg.height }),
    feet: shortRaw,
    inches: shortRaw,
    cm: shortRaw,
  })
  .transform((value, ctx) => {
    if (value.unit === "cm") {
      if (!cleanText(value.cm, false)) {
        ctx.addIssue({ code: "custom", message: msg.height });
        return z.NEVER;
      }
      const cm = wholeNumber(value.cm);
      if (!within(cm, limits.heightCm)) {
        ctx.addIssue({ code: "custom", message: msg.heightRange });
        return z.NEVER;
      }
      return { unit: "cm" as const, cm: cm as number };
    }

    if (!cleanText(value.feet, false)) {
      ctx.addIssue({ code: "custom", message: msg.height });
      return z.NEVER;
    }
    const feet = wholeNumber(value.feet);
    /* Inches may be left blank for an even number of feet. */
    const inches = cleanText(value.inches, false) ? wholeNumber(value.inches) : 0;
    if (!within(feet, limits.heightFeet) || !within(inches, limits.heightInches)) {
      ctx.addIssue({ code: "custom", message: msg.heightRange });
      return z.NEVER;
    }
    return { unit: "ft-in" as const, feet: feet as number, inches: inches as number };
  });

const weightSchema = z
  .strictObject({
    unit: z.enum(weightUnitValues, { message: msg.weight }),
    value: shortRaw,
  })
  .transform((value, ctx) => {
    if (!cleanText(value.value, false)) {
      ctx.addIssue({ code: "custom", message: msg.weight });
      return z.NEVER;
    }
    const amount = decimalNumber(value.value);
    const range = value.unit === "kg" ? limits.weightKg : limits.weightLbs;
    if (!within(amount, range)) {
      ctx.addIssue({ code: "custom", message: msg.weightRange });
      return z.NEVER;
    }
    return { unit: value.unit, value: amount as number };
  });

const healthSchema = z
  .strictObject({
    answer: z.enum(["yes", "no"], { message: msg.choose }),
    details: text(limits.longText, true, false),
  })
  .superRefine((value, ctx) => {
    if (value.answer === "yes" && !value.details) {
      ctx.addIssue({ code: "custom", message: msg.details, path: ["details"] });
    }
  })
  /* Details typed before switching back to No are not kept. */
  .transform((value) =>
    value.answer === "yes" ? value : { answer: "no" as const, details: "" },
  );

const planValues = [GENERAL_ENQUIRY, ...packageIds] as [string, ...string[]];

/* ------------------------------------------------------------------------ */
/* Per-field schema                                                          */
/* ------------------------------------------------------------------------ */

function schemaFor(field: FormField): z.ZodType {
  switch (field.kind) {
    case "text":
      return field.name === "fullName"
        ? text(limits.shortText, false, msg.fullName).pipe(
            z.string().min(2, msg.fullName),
          )
        : text(limits.shortText, false, field.required ? msg.required : false);

    case "longText":
      return text(limits.longText, true, field.required ? msg.required : false);

    case "email":
      return text(limits.shortText, false, msg.email).pipe(
        z.email({ message: msg.email }),
      );

    case "phone":
      /* The browser sends "+" and digits, or digits alone for a US number.
         Whatever arrives must be a real number for its country; it leaves
         the schema in E.164 (+447911123456). */
      return z
        .string()
        .max(40)
        .transform((value, ctx) => {
          const e164 = toE164(value);
          if (!e164) {
            ctx.addIssue({ code: "custom", message: msg.phone });
            return z.NEVER;
          }
          return e164;
        });

    case "age":
      return z
        .string()
        .max(8)
        .transform((value, ctx) => {
          const age = wholeNumber(value);
          if (!within(age, { min: limits.minAge, max: limits.maxAge })) {
            ctx.addIssue({ code: "custom", message: msg.age });
            return z.NEVER;
          }
          return age as number;
        });

    case "choice":
      return choice(field.options, field.required);

    case "multiChoice": {
      const values = field.options.map((o) => o.value) as [string, ...string[]];
      return z
        .array(z.enum(values, { message: msg.choose }))
        .max(values.length)
        /* De-duplicated and put back in the options' order (Mon → Sun). */
        .transform((chosen) => values.filter((v) => chosen.includes(v)));
    }

    case "health":
      return healthSchema;

    case "height":
      return heightSchema;

    case "weight":
      return weightSchema;

    case "plan":
      return z.enum(planValues, { message: msg.choose });

    case "consent":
      return z.literal(true, { message: msg.consent });
  }
}

const fieldSchemas = Object.fromEntries(
  allFields.map((field) => [field.name, schemaFor(field)]),
) as Record<string, z.ZodType>;

/** One schema per step, so each step can be checked before moving on. */
export const stepSchemas = formSteps.map((step) =>
  z.strictObject(
    Object.fromEntries(step.fields.map((f) => [f.name, fieldSchemas[f.name]])),
  ),
);

/** Answers that only apply when another answer has a given value. */
const conditionalFields = allFields.filter((field) => field.showIf);

/** The whole application, as the server action accepts it. */
export const applicationSchema = z
  .strictObject(fieldSchemas)
  .transform((data) => {
    const result: Record<string, unknown> = { ...data };
    for (const field of conditionalFields) {
      const { field: other, equals } = field.showIf!;
      if (result[other] !== equals) result[field.name] = emptyValue(field);
    }
    return result;
  });

export type ApplicationData = Record<string, unknown>;

/* ------------------------------------------------------------------------ */
/* Values the form starts from                                               */
/* ------------------------------------------------------------------------ */

export type HeightValue = { unit: "ft-in" | "cm"; feet: string; inches: string; cm: string };
export type WeightValue = { unit: "lbs" | "kg"; value: string };
export type HealthValue = { answer: "" | "yes" | "no"; details: string };

export type FieldValue =
  | string
  | string[]
  | boolean
  | HeightValue
  | WeightValue
  | HealthValue;

export type FormValues = Record<string, FieldValue>;

export function emptyValue(field: FormField): FieldValue {
  switch (field.kind) {
    case "multiChoice":
      return [];
    case "health":
      return { answer: "", details: "" };
    case "height":
      return { unit: "ft-in", feet: "", inches: "", cm: "" };
    case "weight":
      return { unit: "lbs", value: "" };
    case "consent":
      return false;
    case "plan":
      return GENERAL_ENQUIRY;
    default:
      return "";
  }
}

export function initialValues(): FormValues {
  return Object.fromEntries(allFields.map((f) => [f.name, emptyValue(f)]));
}

/** True when a stored value still has the shape its field expects. */
export function isValueShape(field: FormField, value: unknown): value is FieldValue {
  const empty = emptyValue(field);
  if (Array.isArray(empty)) {
    return Array.isArray(value) && value.every((v) => typeof v === "string");
  }
  if (typeof empty === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    return Object.keys(empty).every(
      (key) => typeof (value as Record<string, unknown>)[key] === "string",
    );
  }
  return typeof value === typeof empty;
}

/* ------------------------------------------------------------------------ */
/* Errors                                                                    */
/* ------------------------------------------------------------------------ */

/** The details box of a health question has its own error key. */
export const detailsKey = (name: string) => `${name}.details`;

/**
 * One message per field. Keys are field names, or `name.details` for the
 * details box of a health question.
 */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const [name, part] = issue.path.map(String);
    if (!name) continue;
    const key = part === "details" ? detailsKey(name) : name;
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** The field an error key belongs to. */
export const fieldOfErrorKey = (key: string) => key.split(".")[0];

/** Index of the step a field is on, or -1. */
export function stepOfField(name: string): number {
  return formSteps.findIndex((step) => step.fields.some((f) => f.name === name));
}

/**
 * Honeypot: a field real people never see or fill in. Its name matches no
 * autofill category — a field called "company" would be filled by browser
 * autofill for a real person, and their application silently dropped.
 */
export const HONEYPOT_FIELD = "ref_check";
