// Shared tenant name & logo lookups for the interactive map

export const UNIT_TENANT_NAMES: Record<string, string> = {
  "G-01": "ستاتيك",
  "G-02": "شرف",
  "G-03": "2B",
  "G-05": "Go Plus",
  "G-07": "الهدى",
  "G-08": "الصحابة",
  "G-09": "ريد لاين",
  "G-11": "Egypt Laptop",
  "G-13": "HK",
  "G-14": "WiFi",
  "G-16": "Kareem Store",
  "G-17": "كسر زيرو",
  "F-04": "Infinity Computer Services / ICS",
  "F-06": "Express Home",
  "F-07": "El Badr",
  "F-08": "El Badr",
  "F-09": "El Badr",
  "F-10": "Time Tech",
  "F-11": "Prime Technology",
  "F-13": "Digital Plus",
  "F-14": "سبارك",
  "F-15": "Games to Egypt",
  "S-01": "Info Max",
  "S-05": "Mix & Apex",
  "S-06": "i7",
  "S-10": "Quick Fix",
  "S-07": "Compu Marts",
  "S-08": "Compu Marts",
  "S-09": "Compu Marts",
};

/** Brand background colors for unit polygon fills — extracted from each tenant's branding */
export const UNIT_TENANT_BG_COLORS: Record<string, string> = {
  "G-01": "#1A1A2E",   // Static – dark navy
  "G-02": "#003876",   // Sharaf DG – brand deep blue
  "G-03": "#003DA5",   // 2B – brand blue (from 2b.com.eg)
  "G-05": "#1B3A5C",   // Go Plus – dark blue
  "G-07": "#1A6B3C",   // Al Hoda – green
  "G-08": "#C8A96E",   // Al Sahaba – gold
  "G-09": "#CC0000",   // Red Line – true red
  "G-11": "#2C2C2C",   // Egypt Laptop – dark gray
  "G-12": "#3A3A3A",   // Print Show – charcoal
  "G-13": "#1C1C1C",   // HK – near black
  "G-14": "#FFFFFF",   // WiFi – white
  "G-16": "#2B4570",   // Kareem Store – navy
  "G-17": "#FDD835",   // Kasr Zero – brand yellow (from kasrzero.net)
  "F-04": "#0D0D0D",   // Infinity – black
  "F-06": "#E8DDD0",   // Express Home – beige
  "F-07": "#1A3A5C",   // El Badr – dark blue
  "F-08": "#1A3A5C",   // El Badr
  "F-09": "#1A3A5C",   // El Badr
  "F-10": "#222222",   // Time Tech – dark
  "F-11": "#1E3A5F",   // Prime Technology – navy
  "F-13": "#1A237E",   // Digital Plus – deep indigo blue (from dpsy.com)
  "F-14": "#FF6B00",   // Spark – orange
  "F-15": "#0F1923",   // Games to Egypt – dark navy (from games2egypt.com)
  "F-17": "#E0D8C8",   // XPRS – cream
  "S-01": "#1B2838",   // Info Max – dark blue
  "S-05": "#2C2C2C",   // Mix & Apex – dark
  "S-06": "#0A0A0A",   // i7 – black
  "S-07": "#0D1117",   // Compu Marts – dark navy (from compumarts.com)
  "S-08": "#0D1117",   // Compu Marts
  "S-09": "#0D1117",   // Compu Marts
  "S-10": "#D4272E",   // Quick Fix – red
};

// Only include verified/sourced tenant logos on the map — generated placeholders excluded
import { isTenantLogoVerified, getTenantLogoPath } from "@/lib/tenantLogoRegistry";

const _allMapLogos: Record<string, { slug: string; path: string }> = {
  "G-01": { slug: "static", path: "/logos/tenants/static.webp" },
  "G-02": { slug: "sharaf", path: "/logos/tenants/sharaf.webp" },
  "G-03": { slug: "2b", path: "/logos/tenants/2b.webp" },
  "G-05": { slug: "go-plus", path: "/logos/tenants/go-plus.webp" },
  "G-07": { slug: "al-hoda", path: "/logos/tenants/al-hoda.webp" },
  "G-08": { slug: "al-sahaba", path: "/logos/tenants/al-sahaba.webp" },
  "G-09": { slug: "red-line", path: "/logos/tenants/red-line.webp" },
  "G-11": { slug: "egypt-laptop", path: "/logos/tenants/egypt-laptop.webp" },
  "G-12": { slug: "print-show", path: "/logos/tenants/print-show.webp" },
  "G-13": { slug: "hk", path: "/logos/tenants/hk.webp" },
  "G-14": { slug: "wifi", path: "/logos/tenants/wifi.webp" },
  "G-16": { slug: "kareem-store", path: "/logos/tenants/kareem-store.webp" },
  "G-17": { slug: "kasr-zero", path: "/logos/tenants/kasr-zero.webp" },
  "F-04": { slug: "ics", path: "/logos/tenants/infinity.webp" },
  "F-06": { slug: "express-home", path: "/logos/tenants/express-home.webp" },
  "F-07": { slug: "el-badr", path: "/logos/tenants/el-badr.webp" },
  "F-08": { slug: "el-badr", path: "/logos/tenants/el-badr.webp" },
  "F-09": { slug: "el-badr", path: "/logos/tenants/el-badr.webp" },
  "F-10": { slug: "time-tech", path: "/logos/tenants/time-tech.webp" },
  "F-11": { slug: "prime-technology", path: "/logos/tenants/prime-technology.webp" },
  "F-13": { slug: "digital-plus", path: "/logos/tenants/digital-plus.webp" },
  "F-14": { slug: "spark", path: "/logos/tenants/spark.webp" },
  "F-15": { slug: "games-to-egypt", path: "/logos/tenants/games-to-egypt.webp" },
  "F-17": { slug: "xprs", path: "/logos/tenants/xprs.webp" },
  "S-01": { slug: "info-max", path: "/logos/tenants/info-max.webp" },
  "S-05": { slug: "mix-apex", path: "/logos/tenants/mix-apex.webp" },
  "S-06": { slug: "i7", path: "/logos/tenants/i7.webp" },
  "S-07": { slug: "compu-marts", path: "/logos/tenants/compu-marts.webp" },
  "S-08": { slug: "compu-marts", path: "/logos/tenants/compu-marts.webp" },
  "S-09": { slug: "compu-marts", path: "/logos/tenants/compu-marts.webp" },
  "S-10": { slug: "quick-fix", path: "/logos/tenants/quick-fix.webp" },
};

/** Only returns logo paths for verified/sourced tenants */
export const UNIT_TENANT_LOGOS: Record<string, string> = Object.fromEntries(
  Object.entries(_allMapLogos)
    .filter(([, { slug }]) => isTenantLogoVerified(slug))
    .map(([unit, { path }]) => [unit, path])
);

/** Tenant slugs by unit id — used to deep-link from the map to the store detail page */
export const UNIT_TENANT_SLUGS: Record<string, string> = Object.fromEntries(
  Object.entries(_allMapLogos).map(([unit, { slug }]) => [unit, slug])
);
