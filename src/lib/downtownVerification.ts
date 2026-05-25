// Downtown directory verification helpers — status maps, badge logic, CSV utils.

export type VerificationStatus =
  | "VERIFIED_EXTERNAL"
  | "PARTIAL_EXTERNAL_MATCH"
  | "CONFLICT_CHECK"
  | "LISTED_ONLY"
  | "UNREVIEWED_LISTED_ONLY"
  | "EXTERNAL_VERIFIED_NOT_ON_SITE_LIST"
  | "EXTERNAL_DIRECTORY_CANDIDATE"
  // Legacy values kept for back-compat with existing rows:
  | "Verified"
  | "Official source linked"
  | "Needs review"
  | "Archived / inactive"
  | "Unknown status"
  | "needs_review";

export const VERIFICATION_STATUSES: { value: VerificationStatus; label: string; tone: string }[] = [
  { value: "VERIFIED_EXTERNAL",                  label: "موثّق خارجياً",            tone: "green" },
  { value: "PARTIAL_EXTERNAL_MATCH",             label: "تطابق جزئي",               tone: "amber" },
  { value: "CONFLICT_CHECK",                     label: "تعارض في البيانات",        tone: "red" },
  { value: "LISTED_ONLY",                        label: "مدرج فقط",                 tone: "gray" },
  { value: "UNREVIEWED_LISTED_ONLY",             label: "مدرج — لم تتم المراجعة",   tone: "amber" },
  { value: "EXTERNAL_VERIFIED_NOT_ON_SITE_LIST", label: "موثّق خارجياً وغير مدرج",  tone: "purple" },
  { value: "EXTERNAL_DIRECTORY_CANDIDATE",       label: "مرشح من دليل خارجي",       tone: "purple" },
];

export const CURRENT_STATUS_OPTIONS = [
  { value: "Open",                       label: "مفتوح" },
  { value: "Closed",                     label: "مغلق" },
  { value: "Unclear",                    label: "غير واضح" },
  { value: "Needs Field Verification",   label: "يحتاج تحقق ميداني" },
];

export const STORE_CATEGORIES = [
  "Computers & Laptops",
  "Mobile Phones",
  "Electronics",
  "Maintenance & Repair",
  "Accessories",
  "Cameras & Security Systems",
  "Gaming",
  "Printing & Office Equipment",
  "Software / IT Services",
  "Fashion",
  "Food & Beverage",
  "Services",
  "Other",
];

export const HIGH_PRIORITY_TECH = [
  "Technology Egypt", "Compu Tec", "Speed Technology Systems", "Techno Tech",
  "Bit Computer", "Lap Technology Systems", "Ebad El Rahman", "The First",
  "Saudi", "Mahmoud Khalwi",
];

// Public-facing badge logic. Returns null when nothing should be shown publicly.
export type PublicBadge = { label: string; tone: "green" | "amber" | "gray" | "blue" };

export function getPublicBadge(m: {
  verification_status?: string | null;
  show_verified_publicly?: boolean | null;
  last_manual_check_date?: string | null;
  confirmed_by_team_at?: string | null;
  current_status?: string | null;
}): PublicBadge | null {
  const status = m.verification_status ?? "";
  const confirmed = m.show_verified_publicly && (m.last_manual_check_date || m.confirmed_by_team_at);

  if ((status === "VERIFIED_EXTERNAL" || status === "Verified") && confirmed) {
    return { label: "موثّق", tone: "green" };
  }
  if (status === "LISTED_ONLY") {
    return { label: "مدرج", tone: "blue" };
  }
  if (
    status === "UNREVIEWED_LISTED_ONLY" ||
    status === "Needs review" ||
    m.current_status === "Needs Field Verification"
  ) {
    return { label: "قيد التحقق", tone: "amber" };
  }
  return null;
}

// Statuses that must NOT appear in the public directory at all.
export function isAdminOnlyStatus(status?: string | null): boolean {
  return (
    status === "EXTERNAL_VERIFIED_NOT_ON_SITE_LIST" ||
    status === "EXTERNAL_DIRECTORY_CANDIDATE" ||
    status === "CONFLICT_CHECK"
  );
}

// A contact field is publicly safe to show only when present AND the row has at least some confirmation.
export function publicSafe<T>(value: T | null | undefined, m: { last_manual_check_date?: string | null; confirmed_by_team_at?: string | null }): T | null {
  if (!value) return null;
  if (!m.last_manual_check_date && !m.confirmed_by_team_at) return null;
  return value;
}

// ─── CSV parsing for the seed/import sheet ────────────────────────────
export function parseBoolAr(v: string | null | undefined): boolean | null {
  if (!v) return null;
  const s = v.trim().toLowerCase();
  if (s === "نعم" || s === "true" || s === "yes" || s === "y") return true;
  if (s === "لا" || s === "false" || s === "no" || s === "n") return false;
  return null;
}

export function cleanUncertain(v: string | null | undefined): string | null {
  if (!v) return null;
  const s = v.trim();
  if (!s) return null;
  if (s === "غير مؤكد" || s === "Unknown" || s === "N/A" || s === "-") return null;
  return s;
}

// CSV parser: handles quoted fields, escaped quotes, CRLF.
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else cell += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\r") { /* skip */ }
      else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
      else cell += c;
    }
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(x => x && x.length));
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `store-${Date.now()}`;
}
