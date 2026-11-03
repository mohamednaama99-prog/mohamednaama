/**
 * US phone numbers.
 *
 * The audience is United States only for now, so the country code is fixed at
 * +1 and there is no country selector. Shared by the form and the server action
 * so client and server apply exactly the same rule.
 */

export const US_DIAL_CODE = "+1";

/** Digits only, capped at the 10 national digits. */
export function normalizeUsPhone(input: string): string {
  return input.replace(/\D/g, "").slice(0, 10);
}

/** Formats as the visitor types: (212) 555-0147 */
export function formatUsPhone(input: string): string {
  const digits = normalizeUsPhone(input);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/**
 * North American Numbering Plan: the area code and the exchange code both
 * start 2–9, so 10 digits alone is not enough to be valid.
 */
const US_PHONE = /^[2-9]\d{2}[2-9]\d{6}$/;

export function isValidUsPhone(digits: string): boolean {
  return US_PHONE.test(digits);
}

/** E.164, for storage: +12125550147 */
export function toE164(digits: string): string {
  return `${US_DIAL_CODE}${digits}`;
}
