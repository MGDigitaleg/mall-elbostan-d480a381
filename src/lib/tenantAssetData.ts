export type TenantFloor = "Ground" | "First" | "Second";

export type LogoStatus =
  | "Confirmed"
  | "Needs Cleanup"
  | "Needs Better Source"
  | "Missing"
  | "Pending Confirmation";

export type TenantBrand = {
  key: string;
  providedName: string;
  normalizedName: string;
  logoStatus: LogoStatus;
  matchedAsset: string | null;
  executionNote: string;
  exportSlug: string;
};

export type TenantUnit = {
  floor: TenantFloor;
  unit: string;
  providedName: string;
  normalizedName: string;
  brandKey: string;
  notes: string;
};

export const logoWorkflowOrder: LogoStatus[] = [
  "Confirmed",
  "Needs Cleanup",
  "Needs Better Source",
  "Pending Confirmation",
  "Missing",
];

export const tenantBrands: TenantBrand[] = [
  {
    key: "static",
    providedName: "ستاتيك",
    normalizedName: "ستاتيك",
    logoStatus: "Confirmed",
    matchedAsset: "/logos/tenants/static.png",
    executionNote: "Logo extracted from composite source.",
    exportSlug: "Static",
  },
  {
    key: "sharaf",
    providedName: "شرف",
    normalizedName: "شرف",
    logoStatus: "Confirmed",
    matchedAsset: "/logos/tenants/sharaf.png",
    executionNote: "Logo extracted from composite source.",
    exportSlug: "Sharaf",
  },
  {
    key: "2b",
    providedName: "2B",
    normalizedName: "2B",
    logoStatus: "Needs Cleanup",
    matchedAsset: "Confirmed source logo",
    executionNote: "Isolate the wordmark on a transparent square artboard.",
    exportSlug: "2B",
  },
  {
    key: "go-plus",
    providedName: "Go plus",
    normalizedName: "Go Plus",
    logoStatus: "Confirmed",
    matchedAsset: "/logos/tenants/go-plus.png",
    executionNote: "Logo extracted from composite source.",
    exportSlug: "Go-Plus",
  },
  {
    key: "al-hoda",
    providedName: "الهدى",
    normalizedName: "الهدى",
    logoStatus: "Needs Cleanup",
    matchedAsset: "Confirmed source logo",
    executionNote: "Remove background noise and keep original proportions.",
    exportSlug: "Al-Hoda",
  },
  {
    key: "al-sahaba",
    providedName: "الصحابة",
    normalizedName: "الصحابة",
    logoStatus: "Confirmed",
    matchedAsset: "/logos/tenants/al-sahaba.png",
    executionNote: "Logo extracted from composite source.",
    exportSlug: "Al-Sahaba",
  },
  {
    key: "red-line",
    providedName: "ريد لاين",
    normalizedName: "ريد لاين",
    logoStatus: "Confirmed",
    matchedAsset: "/logos/tenants/red-line.png",
    executionNote: "Logo extracted from composite source.",
    exportSlug: "Red-Line",
  },
  {
    key: "egypt-laptop",
    providedName: "ايجيبت لاب توب",
    normalizedName: "Egypt Laptop",
    logoStatus: "Needs Cleanup",
    matchedAsset: "Confirmed source logo",
    executionNote: "Standardize margins and export transparent PNG.",
    exportSlug: "Egypt-Laptop",
  },
  {
    key: "print-show",
    providedName: "برنت شو",
    normalizedName: "برنت شو",
    logoStatus: "Confirmed",
    matchedAsset: "/logos/tenants/print-show.png",
    executionNote: "Logo extracted from composite source.",
    exportSlug: "Print-Show",
  },
  {
    key: "hk",
    providedName: "HK",
    normalizedName: "HK",
    logoStatus: "Confirmed",
    matchedAsset: "/logos/tenants/hk.png",
    executionNote: "Logo extracted from composite source.",
    exportSlug: "HK",
  },
  {
    key: "wifi",
    providedName: "Wifi",
    normalizedName: "WiFi",
    logoStatus: "Confirmed",
    matchedAsset: "/logos/tenants/wifi.png",
    executionNote: "Logo extracted from composite source.",
    exportSlug: "WiFi",
  },
  {
    key: "kareem-store",
    providedName: "كريم ستور",
    normalizedName: "Kareem Store",
    logoStatus: "Pending Confirmation",
    matchedAsset: "Confirmed Kareem Store source logo",
    executionNote: "Use one family mark for G-15 and G-16 until storefront naming is reconfirmed.",
    exportSlug: "Kareem-Store",
  },
  {
    key: "kasr-zero",
    providedName: "كسر زيرو",
    normalizedName: "كسر زيرو",
    logoStatus: "Needs Cleanup",
    matchedAsset: "Confirmed source logo",
    executionNote: "Tight crop and remove any opaque background.",
    exportSlug: "Kasr-Zero",
  },
  {
    key: "infinity",
    providedName: "انفينتي",
    normalizedName: "Infinity",
    logoStatus: "Needs Cleanup",
    matchedAsset: "Confirmed source logo",
    executionNote: "Preserve thin strokes and normalize artboard spacing.",
    exportSlug: "Infinity",
  },
  {
    key: "express-home",
    providedName: "اكسبريس هوم",
    normalizedName: "اكسبريس هوم",
    logoStatus: "Confirmed",
    matchedAsset: "/logos/tenants/express-home.png",
    executionNote: "Logo extracted from composite source. Keep separate from XPRS.",
    exportSlug: "Express-Home",
  },
  {
    key: "el-badr",
    providedName: "البدر",
    normalizedName: "El Badr",
    logoStatus: "Confirmed",
    matchedAsset: "Confirmed shared El Badr logo",
    executionNote: "Apply the same cleaned master file across F-7, F-8, and F-9.",
    exportSlug: "El-Badr",
  },
  {
    key: "time-tech",
    providedName: "تايم تك",
    normalizedName: "Time Tech",
    logoStatus: "Needs Better Source",
    matchedAsset: "Uploaded PDF reference",
    executionNote: "Extract the clean vector/text mark from the PDF before final PNG export.",
    exportSlug: "Time-Tech",
  },
  {
    key: "prime-technology",
    providedName: "برايم تكنولوجي",
    normalizedName: "Prime Technology",
    logoStatus: "Needs Cleanup",
    matchedAsset: "Confirmed source logo",
    executionNote: "Center the full lockup and keep a consistent safe margin.",
    exportSlug: "Prime-Technology",
  },
  {
    key: "digital-plus",
    providedName: "ديجيتال بلس",
    normalizedName: "Digital Plus",
    logoStatus: "Needs Better Source",
    matchedAsset: "Available banner asset",
    executionNote: "Extract the cleanest logo from the banner asset and remove banner-only noise.",
    exportSlug: "Digital-Plus",
  },
  {
    key: "spark",
    providedName: "سبارك",
    normalizedName: "Spark",
    logoStatus: "Confirmed",
    matchedAsset: "/logos/tenants/spark.png",
    executionNote: "Logo extracted from composite source.",
    exportSlug: "Spark",
  },
  {
    key: "games-to-egypt",
    providedName: "Games to Egypt",
    normalizedName: "Games to Egypt",
    logoStatus: "Confirmed",
    matchedAsset: "/logos/tenants/games-to-egypt.png",
    executionNote: "Logo extracted from composite source.",
    exportSlug: "Games-to-Egypt",
  },
  {
    key: "xprs",
    providedName: "Xprs",
    normalizedName: "XPRS",
    logoStatus: "Needs Cleanup",
    matchedAsset: "Confirmed XPRS text logo",
    executionNote: "Use the text logo only; avoid the standalone green X symbol.",
    exportSlug: "XPRS",
  },
  {
    key: "info-max",
    providedName: "info max",
    normalizedName: "Info Max",
    logoStatus: "Confirmed",
    matchedAsset: "/logos/tenants/info-max.png",
    executionNote: "Logo extracted from composite source.",
    exportSlug: "Info-Max",
  },
  {
    key: "mix-apex",
    providedName: "مكس اند ابكس",
    normalizedName: "Mix & Apex",
    logoStatus: "Needs Cleanup",
    matchedAsset: "Confirmed source logo",
    executionNote: "Balance the dual-name lockup and preserve original aspect ratio.",
    exportSlug: "Mix-and-Apex",
  },
  {
    key: "i7",
    providedName: "i7",
    normalizedName: "i7",
    logoStatus: "Missing",
    matchedAsset: null,
    executionNote: "Need official source before directory export.",
    exportSlug: "i7",
  },
  {
    key: "compu-marts",
    providedName: "سوق الكمبيوتر",
    normalizedName: "سوق الكمبيوتر / Compu Marts",
    logoStatus: "Needs Cleanup",
    matchedAsset: "Confirmed clean blue logo source",
    executionNote: "Use the clean blue version for S-7, S-8, and S-9.",
    exportSlug: "Compu-Marts",
  },
  {
    key: "quick-fix",
    providedName: "كويك فيكس",
    normalizedName: "Quick Fix",
    logoStatus: "Needs Cleanup",
    matchedAsset: "Confirmed source logo",
    executionNote: "Standardize artboard size and remove extra framing.",
    exportSlug: "Quick-Fix",
  },
];

export const tenantUnits: TenantUnit[] = [
  { floor: "Ground", unit: "G-1", providedName: "ستاتيك", normalizedName: "ستاتيك", brandKey: "static", notes: "Missing logo source." },
  { floor: "Ground", unit: "G-2", providedName: "شرف", normalizedName: "شرف", brandKey: "sharaf", notes: "Missing logo source." },
  { floor: "Ground", unit: "G-3", providedName: "2B", normalizedName: "2B", brandKey: "2b", notes: "Confirmed brand source; prepare final cleanup export." },
  { floor: "Ground", unit: "G-5", providedName: "Go plus", normalizedName: "Go Plus", brandKey: "go-plus", notes: "Normalized casing locked; logo still missing." },
  { floor: "Ground", unit: "G-7", providedName: "الهدى", normalizedName: "الهدى", brandKey: "al-hoda", notes: "Confirmed source needs transparent cleanup." },
  { floor: "Ground", unit: "G-8", providedName: "الصحابة", normalizedName: "الصحابة", brandKey: "al-sahaba", notes: "No asset matched yet." },
  { floor: "Ground", unit: "G-9", providedName: "ريد لاين", normalizedName: "ريد لاين", brandKey: "red-line", notes: "Needs official logo file." },
  { floor: "Ground", unit: "G-10", providedName: "ايجيبت لاب توب", normalizedName: "Egypt Laptop", brandKey: "egypt-laptop", notes: "English display name locked." },
  { floor: "Ground", unit: "G-12", providedName: "برنت شو", normalizedName: "برنت شو", brandKey: "print-show", notes: "Missing logo source." },
  { floor: "Ground", unit: "G-13", providedName: "HK", normalizedName: "HK", brandKey: "hk", notes: "Needs source confirmation." },
  { floor: "Ground", unit: "G-14", providedName: "Wifi", normalizedName: "WiFi", brandKey: "wifi", notes: "Display casing normalized; logo unresolved." },
  { floor: "Ground", unit: "G-15", providedName: "كريم ستور", normalizedName: "Kareem Store", brandKey: "kareem-store", notes: "Treat as one brand family with G-16 for now." },
  { floor: "Ground", unit: "G-16", providedName: "كريمستور", normalizedName: "Kareem Store", brandKey: "kareem-store", notes: "Pending confirmation if storefront variant differs from G-15." },
  { floor: "Ground", unit: "G-17", providedName: "كسر زيرو", normalizedName: "كسر زيرو", brandKey: "kasr-zero", notes: "Source available; cleanup required." },
  { floor: "First", unit: "F-4", providedName: "انفينتي", normalizedName: "Infinity", brandKey: "infinity", notes: "Confirmed source available." },
  { floor: "First", unit: "F-6", providedName: "اكسبريس هوم", normalizedName: "اكسبريس هوم", brandKey: "express-home", notes: "Must remain separate from XPRS until confirmed later." },
  { floor: "First", unit: "F-7", providedName: "البدر", normalizedName: "El Badr", brandKey: "el-badr", notes: "Uses shared El Badr logo." },
  { floor: "First", unit: "F-8", providedName: "البدر", normalizedName: "El Badr", brandKey: "el-badr", notes: "Uses shared El Badr logo." },
  { floor: "First", unit: "F-9", providedName: "البدر", normalizedName: "El Badr", brandKey: "el-badr", notes: "Uses shared El Badr logo." },
  { floor: "First", unit: "F-10", providedName: "تايم تك", normalizedName: "Time Tech", brandKey: "time-tech", notes: "Use uploaded PDF as the main reference asset." },
  { floor: "First", unit: "F-11", providedName: "برايم تكنولوجي", normalizedName: "Prime Technology", brandKey: "prime-technology", notes: "Display name normalized to English." },
  { floor: "First", unit: "F-13", providedName: "ديجيتال بلس", normalizedName: "Digital Plus", brandKey: "digital-plus", notes: "Extract from the cleanest available banner source." },
  { floor: "First", unit: "F-14", providedName: "سبارك", normalizedName: "Spark", brandKey: "spark", notes: "No matched logo yet." },
  { floor: "First", unit: "F-15", providedName: "Games to Egypt", normalizedName: "Games to Egypt", brandKey: "games-to-egypt", notes: "Correct display name is locked; logo is missing." },
  { floor: "First", unit: "F-17", providedName: "Xprs", normalizedName: "XPRS", brandKey: "xprs", notes: "Prefer the text logo, not the green X symbol alone." },
  { floor: "Second", unit: "S-1", providedName: "info max", normalizedName: "Info Max", brandKey: "info-max", notes: "Normalized English display name only; source missing." },
  { floor: "Second", unit: "S-5", providedName: "مكس اند ابكس", normalizedName: "Mix & Apex", brandKey: "mix-apex", notes: "Confirmed source available." },
  { floor: "Second", unit: "S-6", providedName: "i7", normalizedName: "i7", brandKey: "i7", notes: "No matched logo yet." },
  { floor: "Second", unit: "S-7", providedName: "سوق الكمبيوتر", normalizedName: "سوق الكمبيوتر / Compu Marts", brandKey: "compu-marts", notes: "Use the clean blue logo version." },
  { floor: "Second", unit: "S-8", providedName: "سوق الكمبيوتر", normalizedName: "سوق الكمبيوتر / Compu Marts", brandKey: "compu-marts", notes: "Uses the same shared logo as S-7 and S-9." },
  { floor: "Second", unit: "S-9", providedName: "سوق الكمبيوتر", normalizedName: "سوق الكمبيوتر / Compu Marts", brandKey: "compu-marts", notes: "Uses the same shared logo as S-7 and S-8." },
  { floor: "Second", unit: "S-10", providedName: "كويك فيكس", normalizedName: "Quick Fix", brandKey: "quick-fix", notes: "Confirmed source available." },
];

const brandMap = new Map(tenantBrands.map((brand) => [brand.key, brand]));

export const tenantMasterRows = tenantUnits.map((unit) => {
  const brand = brandMap.get(unit.brandKey);

  if (!brand) {
    throw new Error(`Missing brand configuration for ${unit.brandKey}`);
  }

  return {
    floor: unit.floor,
    unit: unit.unit,
    tenantProvidedName: unit.providedName,
    normalizedDisplayName: unit.normalizedName,
    logoStatus: brand.logoStatus,
    matchedAsset: brand.matchedAsset,
    notes: unit.notes,
    exportPath: `/logos/final/${unit.unit}_${brand.exportSlug}.png`,
  };
});

export const logoMatchingMatrixRows = tenantBrands.map((brand) => {
  const units = tenantUnits.filter((unit) => unit.brandKey === brand.key).map((unit) => unit.unit);

  return {
    tenantProvidedName: brand.providedName,
    normalizedDisplayName: brand.normalizedName,
    units,
    logoStatus: brand.logoStatus,
    matchedAsset: brand.matchedAsset,
    executionNote: brand.executionNote,
  };
});

export const missingLogoRows = logoMatchingMatrixRows
  .filter((row) => row.logoStatus === "Missing")
  .map((row) => ({
    tenant: row.normalizedDisplayName,
    units: row.units,
    missingReason: "No approved logo source exists in the current asset pool.",
    nextAction: "Request an official logo file or capture a readable storefront reference.",
  }));

export const workflowSummary = logoWorkflowOrder.map((status) => {
  const matchingBrands = tenantBrands.filter((brand) => brand.logoStatus === status);

  return {
    status,
    count: matchingBrands.length,
    brands: matchingBrands.map((brand) => brand.normalizedName),
  };
});

export const tenantAssetStats = {
  totalUnits: tenantUnits.length,
  totalBrands: tenantBrands.length,
  confirmedSourceMatches: tenantBrands.filter((brand) => brand.matchedAsset).length,
  missingBrands: tenantBrands.filter((brand) => brand.logoStatus === "Missing").length,
};

export const exportStructureExamples = tenantMasterRows
  .filter((row) => ["G-3", "G-7", "F-10", "F-13", "S-10"].includes(row.unit))
  .map((row) => row.exportPath);