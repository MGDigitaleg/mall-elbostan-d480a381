/**
 * Single source of truth for the official public phone number.
 *
 * ─── HOW TO UPDATE (one-click flow) ───
 * When the owner confirms the final number, edit ONLY the value of
 * `OFFICIAL_PHONE` below. Both the JSON-LD `telephone` field (used by Google
 * Rich Results) and the Footer "اتصل بنا" link will update automatically.
 *
 * Format: full international E.164 form, e.g. "+20225750000"
 *         (digits + leading "+", no spaces / dashes — works for tel: links
 *          and schema.org/telephone validation).
 *
 * Leave as an empty string to keep the phone hidden everywhere.
 */
export const OFFICIAL_PHONE = "";

/**
 * Optional WhatsApp number (digits only, with country code, no "+").
 * Used by the Footer fallback when no phone is set.
 * Example: "201000000000"
 */
export const OFFICIAL_WHATSAPP = "201000000000";

/** Convert OFFICIAL_PHONE into a tel: href, or null if not set. */
export function getPhoneHref(): string | null {
  const v = OFFICIAL_PHONE.trim();
  return v ? `tel:${v.replace(/\s+/g, "")}` : null;
}

/** Human-readable display version of OFFICIAL_PHONE, or null if not set. */
export function getPhoneDisplay(): string | null {
  const v = OFFICIAL_PHONE.trim();
  return v ? v : null;
}
