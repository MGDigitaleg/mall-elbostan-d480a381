/**
 * Egyptian phone / WhatsApp validation & normalization.
 *
 * Canonical format required for store contact numbers:
 *   +20 followed by a 10-digit Egyptian mobile number (starting with 1).
 *   e.g. +201022267444
 *
 * Accepts common input variants and normalizes them:
 *   01022267444     -> +201022267444   (local 0-prefixed mobile)
 *   201022267444    -> +201022267444
 *   00201022267444  -> +201022267444
 *   +20 102 226 7444 -> +201022267444  (spaces/dashes ignored)
 *
 * Invisible characters (e.g. RTL marks U+200F) and any non-digit
 * characters are stripped before validation.
 */

/** Strip everything except digits (removes RTL marks, spaces, dashes, +, etc.). */
export function stripToDigits(input: string | null | undefined): string {
  return (input ?? "").replace(/\D/g, "");
}

/**
 * Normalize an Egyptian mobile number to canonical `+20XXXXXXXXXX` form.
 * Returns null if the input is not a valid Egyptian mobile number.
 */
export function normalizeEgyptPhone(input: string | null | undefined): string | null {
  let d = stripToDigits(input);
  if (!d) return null;

  // Drop international 00 prefix
  if (d.startsWith("00")) d = d.slice(2);

  // Local 0-prefixed mobile: 01XXXXXXXXX (11 digits) -> 20 + 10 digits
  if (d.length === 11 && d.startsWith("01")) {
    d = "20" + d.slice(1);
  }

  // Now we expect: 20 + 10 digits, and the local part must start with 1 (mobile)
  if (d.length === 12 && d.startsWith("20") && d[2] === "1") {
    return "+" + d;
  }

  return null;
}

/** True when the input is (or can be normalized to) a valid Egyptian mobile number. */
export function isValidEgyptPhone(input: string | null | undefined): boolean {
  return normalizeEgyptPhone(input) !== null;
}

/** Digits-only WhatsApp form (no `+`), e.g. `201022267444`, or null if invalid. */
export function normalizeEgyptWhatsapp(input: string | null | undefined): string | null {
  const n = normalizeEgyptPhone(input);
  return n ? n.replace(/^\+/, "") : null;
}
