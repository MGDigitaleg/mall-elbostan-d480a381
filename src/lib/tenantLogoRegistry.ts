/**
 * Centralized Tenant Logo Registry
 * 
 * Single source of truth for all tenant branding data.
 * Every logo display across the platform should reference this registry.
 * 
 * Verification statuses:
 * - "verified"   → Official logo sourced from tenant website/social media
 * - "sourced"    → Logo obtained from a reliable public source, pending final confirmation
 * - "generated"  → AI-generated placeholder — NOT an official logo
 * - "missing"    → No logo available at all
 */

export type LogoVerification = "verified" | "sourced" | "generated" | "missing";
export type BackgroundMode = "light" | "dark" | "auto";

export interface TenantLogoEntry {
  /** Slug matching the stores table */
  slug: string;
  /** Arabic display name */
  displayNameAr: string;
  /** English display name */
  displayNameEn: string | null;
  /** Path to the logo file in public/ */
  logoPath: string | null;
  /** Verification status of the logo */
  verified: LogoVerification;
  /** Official website if known */
  officialSite: string | null;
  /** Does the logo work on dark backgrounds? */
  backgroundMode: BackgroundMode;
  /** Internal notes for unverified logos */
  notes: string | null;
}

/**
 * Master registry of all tenant logos.
 * Kasr Zero is always first.
 */
export const TENANT_LOGO_REGISTRY: TenantLogoEntry[] = [
  {
    slug: "kasr-zero",
    displayNameAr: "كسر زيرو",
    displayNameEn: "Kasr Zero",
    logoPath: "/logos/tenants/kasr-zero.webp",
    verified: "verified",
    officialSite: "https://kasrzero.net",
    backgroundMode: "auto",
    notes: null,
  },
  {
    slug: "2b",
    displayNameAr: "2B",
    displayNameEn: "2B",
    logoPath: "/logos/tenants/2b.webp",
    verified: "verified",
    officialSite: "https://2b.com.eg",
    backgroundMode: "auto",
    notes: null,
  },
  {
    slug: "games-to-egypt",
    displayNameAr: "Games to Egypt",
    displayNameEn: "Games to Egypt",
    logoPath: "/logos/tenants/games-to-egypt.webp",
    verified: "verified",
    officialSite: "https://games2egypt.com",
    backgroundMode: "dark",
    notes: null,
  },
  {
    slug: "compu-marts",
    displayNameAr: "سوق الكمبيوتر",
    displayNameEn: "Compu Marts",
    logoPath: "/logos/tenants/compu-marts.webp",
    verified: "verified",
    officialSite: "https://compumarts.com",
    backgroundMode: "auto",
    notes: null,
  },
  {
    slug: "digital-plus",
    displayNameAr: "ديجيتال بلس",
    displayNameEn: "Digital Plus",
    logoPath: "/logos/tenants/digital-plus.webp",
    verified: "verified",
    officialSite: "https://dpsy.com",
    backgroundMode: "auto",
    notes: null,
  },
  {
    slug: "el-badr",
    displayNameAr: "البدر",
    displayNameEn: "El Badr",
    logoPath: "/logos/tenants/el-badr.webp",
    verified: "sourced",
    officialSite: null,
    backgroundMode: "auto",
    notes: null,
  },
  {
    slug: "sharaf",
    displayNameAr: "شرف",
    displayNameEn: "Sharaf",
    logoPath: "/logos/tenants/sharaf.webp",
    verified: "sourced",
    officialSite: null,
    backgroundMode: "auto",
    notes: null,
  },
  {
    slug: "static",
    displayNameAr: "ستاتيك",
    displayNameEn: "Static",
    logoPath: "/logos/tenants/static.webp",
    verified: "sourced",
    officialSite: null,
    backgroundMode: "auto",
    notes: null,
  },
  {
    slug: "kareem-store",
    displayNameAr: "كريم ستور",
    displayNameEn: "Kareem Store",
    logoPath: "/logos/tenants/kareem-store.webp",
    verified: "verified",
    officialSite: "https://kareemstores.com",
    backgroundMode: "auto",
    notes: null,
  },
  {
    slug: "spark",
    displayNameAr: "سبارك",
    displayNameEn: "Spark",
    logoPath: "/logos/tenants/spark.webp",
    verified: "sourced",
    officialSite: null,
    backgroundMode: "auto",
    notes: "Logo sourced from Facebook page",
  },
  {
    slug: "hk",
    displayNameAr: "HK",
    displayNameEn: "HK Computers",
    logoPath: "/logos/tenants/hk.webp",
    verified: "sourced",
    officialSite: null,
    backgroundMode: "auto",
    notes: "Logo sourced from Facebook page",
  },
  // --- Generated logos (AI placeholders, need replacement) ---
  {
    slug: "go-plus",
    displayNameAr: "Go Plus",
    displayNameEn: "Go Plus",
    logoPath: "/logos/tenants/go-plus.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
  {
    slug: "al-hoda",
    displayNameAr: "الهدى",
    displayNameEn: "Al Hoda",
    logoPath: "/logos/tenants/al-hoda.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
  {
    slug: "al-sahaba",
    displayNameAr: "الصحابة",
    displayNameEn: "Al Sahaba",
    logoPath: "/logos/tenants/al-sahaba.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
  {
    slug: "red-line",
    displayNameAr: "ريد لاين",
    displayNameEn: "Red Line",
    logoPath: "/logos/tenants/red-line.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
  {
    slug: "egypt-laptop",
    displayNameAr: "Egypt Laptop",
    displayNameEn: "Egypt Laptop",
    logoPath: "/logos/tenants/egypt-laptop.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
  {
    slug: "print-show",
    displayNameAr: "برنت شو",
    displayNameEn: "Print Show",
    logoPath: "/logos/tenants/print-show.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
  {
    slug: "wifi",
    displayNameAr: "WiFi",
    displayNameEn: "WiFi",
    logoPath: "/logos/tenants/wifi.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
  {
    slug: "ics",
    displayNameAr: "إنفينيتي لخدمات الكمبيوتر / ICS",
    displayNameEn: "Infinity Computer Services / ICS",
    logoPath: "/logos/tenants/infinity.webp",
    verified: "verified",
    officialSite: null,
    backgroundMode: "auto",
    notes: "Official circular logo provided by tenant; white background removed for transparent display.",
  },
  {
    slug: "info-max",
    displayNameAr: "Info Max",
    displayNameEn: "Info Max",
    logoPath: "/logos/tenants/info-max.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
  {
    slug: "express-home",
    displayNameAr: "اكسبريس هوم",
    displayNameEn: "Express Home",
    logoPath: "/logos/tenants/express-home.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
  {
    slug: "time-tech",
    displayNameAr: "Time Tech",
    displayNameEn: "Time Tech",
    logoPath: "/logos/tenants/time-tech.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
  {
    slug: "prime-technology",
    displayNameAr: "Prime Technology",
    displayNameEn: "Prime Technology",
    logoPath: "/logos/tenants/prime-technology.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
  {
    slug: "mix-apex",
    displayNameAr: "Mix & Apex",
    displayNameEn: "Mix & Apex",
    logoPath: "/logos/tenants/mix-apex.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
  {
    slug: "i7",
    displayNameAr: "i7",
    displayNameEn: "i7",
    logoPath: "/logos/tenants/i7.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
  {
    slug: "xprs",
    displayNameAr: "XPRS",
    displayNameEn: "XPRS",
    logoPath: "/logos/tenants/xprs.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
  {
    slug: "quick-fix",
    displayNameAr: "Quick Fix",
    displayNameEn: "Quick Fix",
    logoPath: "/logos/tenants/quick-fix.webp",
    verified: "generated",
    officialSite: null,
    backgroundMode: "auto",
    notes: "AI-generated placeholder. Official logo not yet sourced.",
  },
];

/* ── Lookup helpers ── */

const _bySlug = new Map<string, TenantLogoEntry>();
TENANT_LOGO_REGISTRY.forEach((t) => _bySlug.set(t.slug, t));

/** Get tenant entry by slug. Returns undefined if not in registry. */
export function getTenantBySlug(slug: string): TenantLogoEntry | undefined {
  return _bySlug.get(slug);
}

/** Get logo path by slug, returns null if missing. */
export function getTenantLogoPath(slug: string): string | null {
  return _bySlug.get(slug)?.logoPath ?? null;
}

/**
 * Returns the logo URL only if the tenant is verified or sourced.
 * For "generated" or "missing" statuses, returns null so TenantLogo falls back to initials.
 * If the tenant isn't in the registry at all, passes through the DB logo_url as-is.
 */
export function getVerifiedLogoUrl(slug: string | undefined, dbLogoUrl: string | null | undefined): string | null {
  if (!slug) return dbLogoUrl ?? null;

  // DB value (set via admin override) always wins when present
  if (dbLogoUrl) return dbLogoUrl;

  const entry = _bySlug.get(slug);
  if (!entry) return null;
  if (entry.verified === "verified" || entry.verified === "sourced") {
    return entry.logoPath ?? null;
  }
  return null; // Generated/missing → show initials
}

/** Check if a tenant logo is verified (official source confirmed). */
export function isTenantLogoVerified(slug: string): boolean {
  const entry = _bySlug.get(slug);
  return entry?.verified === "verified" || entry?.verified === "sourced";
}

/** Get all unverified tenants that need official logos. */
export function getUnverifiedTenants(): TenantLogoEntry[] {
  return TENANT_LOGO_REGISTRY.filter((t) => t.verified === "generated" || t.verified === "missing");
}

/** Registry statistics */
export const registryStats = {
  total: TENANT_LOGO_REGISTRY.length,
  verified: TENANT_LOGO_REGISTRY.filter((t) => t.verified === "verified").length,
  sourced: TENANT_LOGO_REGISTRY.filter((t) => t.verified === "sourced").length,
  generated: TENANT_LOGO_REGISTRY.filter((t) => t.verified === "generated").length,
  missing: TENANT_LOGO_REGISTRY.filter((t) => t.verified === "missing").length,
};
