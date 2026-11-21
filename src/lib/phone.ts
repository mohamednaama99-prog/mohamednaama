/**
 * WhatsApp numbers, any country.
 *
 * A visitor can type a number with its country code (+44 7911 123456, or
 * 0044 7911 123456) or, in the US, without one ((212) 555-0147). A number with
 * no country code is read as a US number. Shared by the form and the server
 * action, so the browser and the server apply exactly the same rule.
 *
 * Validation and formatting come from libphonenumber-js (Google's
 * libphonenumber data): a number has to be a real, dialable number for its
 * country.
 */
import { AsYouType, parsePhoneNumberFromString } from "libphonenumber-js";

/** The country a number without a country code belongs to. */
const DEFAULT_COUNTRY = "US";

/** E.164 allows at most 15 digits. */
const MAX_DIGITS = 15;

/**
 * What the form keeps while the visitor types: a leading "+" if they typed
 * one, then digits only. A leading "00" (the international prefix in most of
 * the world) becomes "+"; no US number starts with 0, so this is unambiguous.
 */
export function cleanPhoneInput(input: string): string {
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) return `+${digits.slice(0, MAX_DIGITS)}`;
  if (digits.startsWith("00")) return `+${digits.slice(2, 2 + MAX_DIGITS)}`;
  return digits.slice(0, MAX_DIGITS);
}

/** Formats as the visitor types: (212) 555-0147, or +44 7911 123456. */
export function formatPhoneAsYouType(input: string): string {
  const clean = cleanPhoneInput(input);
  if (!clean) return "";
  return new AsYouType(clean.startsWith("+") ? undefined : DEFAULT_COUNTRY).input(clean);
}

/**
 * The number in E.164 (+447911123456), or null when it is not a valid number.
 * Without a country code it is read as a US number.
 */
export function toE164(input: string): string | null {
  const clean = cleanPhoneInput(input);
  if (!/\d/.test(clean)) return null;
  const parsed = parsePhoneNumberFromString(
    clean,
    clean.startsWith("+") ? undefined : DEFAULT_COUNTRY,
  );
  return parsed?.isValid() ? parsed.number : null;
}

/**
 * How the number reads in the sheet: the full international format, grouped
 * the way that country writes it (+1 212 555 0147, +44 7911 123456).
 */
export function formatPhoneInternational(input: string): string {
  const parsed = parsePhoneNumberFromString(toE164(input) ?? "");
  return parsed ? parsed.formatInternational() : input.trim();
}
