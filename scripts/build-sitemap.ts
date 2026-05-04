/**
 * Build-time sitemap generator + parity guard.
 *
 * Responsibilities:
 *   1. Regenerate `public/sitemap.xml` (the static sitemap *index*) from the
 *      single source of truth: the section list defined inside the edge
 *      function `supabase/functions/sitemap/index.ts`. This guarantees the
 *      static index can never drift from the dynamic backend.
 *   2. Cross-check parity between three sources so dev/prod can't diverge:
 *        - React Router routes        → src/App.tsx
 *        - Edge function STATIC_ROUTES → supabase/functions/sitemap/index.ts
 *        - robots.txt Sitemap entries  → public/robots.txt
 *      Any mismatch fails the build with a clear report.
 *
 * Run via `prebuild` (npm/bun lifecycle) so every `vite build` is gated.
 *
 * Exit codes:
 *   0 — all good, sitemap regenerated.
 *   1 — drift detected; sitemap may still have been written but build aborts.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const EDGE_FN_PATH = resolve(ROOT, "supabase/functions/sitemap/index.ts");
const APP_TSX_PATH = resolve(ROOT, "src/App.tsx");
const ROBOTS_PATH = resolve(ROOT, "public/robots.txt");
const SITEMAP_PATH = resolve(ROOT, "public/sitemap.xml");

// Base URLs — overridable per environment so dev/staging/prod don't drift.
//   PUBLIC_SITE_URL  → public canonical origin (default: production domain)
//   SUPABASE_URL     → Supabase project URL hosting the sitemap edge function
const stripSlash = (s: string) => s.replace(/\/+$/, "");
const PUBLIC_BASE = stripSlash(process.env.PUBLIC_SITE_URL ?? "https://mallelbostan.com");
const SUPABASE_URL = stripSlash(
  process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "https://wrheltmgquyqqhscrpds.supabase.co"
);
const EDGE_BASE = `${SUPABASE_URL}/functions/v1/sitemap`;

// Routes intentionally excluded from public crawling
const EXCLUDED_FROM_SITEMAP = new Set<string>([
  "/admin",
  "/spin-win/claim",
  "/spin-win/account",
  "/kz/cart",
  "/kz/products",
  "/kz/search",
  "/countdown",
  "/rss",
  "*",
]);

function bail(title: string, lines: string[]): never {
  console.error(`\n✖ ${title}`);
  for (const l of lines) console.error(`  - ${l}`);
  console.error("");
  process.exit(1);
}

// ── 1. Read edge function: extract section keys + STATIC_ROUTES ─────────
const edgeSrc = readFileSync(EDGE_FN_PATH, "utf8");

const sectionKeys = Array.from(
  edgeSrc.matchAll(/\{\s*key:\s*"([^"]+)",\s*label_ar:/g)
).map((m) => m[1]);

if (sectionKeys.length === 0) {
  bail("Could not extract section keys from edge function", [EDGE_FN_PATH]);
}

const staticRoutes = Array.from(
  edgeSrc.matchAll(/\{\s*loc:\s*"(\/[^"]*)"\s*,\s*priority:/g)
).map((m) => m[1]);

if (staticRoutes.length === 0) {
  bail("Could not extract STATIC_ROUTES from edge function", [EDGE_FN_PATH]);
}

// ── 2. Read React Router routes from App.tsx ─────────────────────────────
const appSrc = readFileSync(APP_TSX_PATH, "utf8");
const appRoutes = Array.from(appSrc.matchAll(/<Route\s+path="([^"]+)"/g))
  .map((m) => m[1])
  .filter((p) => !p.startsWith(":") && p !== "*");

// Routes that are sitemap-eligible (concrete, non-parameterised)
function isCrawlable(path: string): boolean {
  if (EXCLUDED_FROM_SITEMAP.has(path)) return false;
  if (path.startsWith("/admin")) return false;
  if (path.includes(":")) return false;        // dynamic segments like /stores/:slug
  if (path.includes("*")) return false;
  return path.startsWith("/");
}

const crawlableAppRoutes = appRoutes.filter(isCrawlable);

// ── 3. Parity check #1: every static-route in edge fn has a real React route ─
const appRouteSet = new Set(appRoutes);
const orphanEdgeRoutes = staticRoutes.filter((r) => {
  if (appRouteSet.has(r)) return true ? false : false;
  return !appRouteSet.has(r);
});
if (orphanEdgeRoutes.length) {
  bail("Edge sitemap STATIC_ROUTES that have no matching React Router path:", orphanEdgeRoutes);
}

// ── 4. Parity check #2: every crawlable React route is in edge STATIC_ROUTES ─
// Allow dynamic landing groups handled by other sections (stores/categories/devices/products/blog/...)
const DYNAMIC_HANDLED_PREFIXES = [
  "/stores/", "/products/", "/devices/", "/blog/", "/daily-deals/", "/kz/",
];
const edgeStaticSet = new Set(staticRoutes);
const missingFromEdge = crawlableAppRoutes.filter((r) => {
  if (edgeStaticSet.has(r)) return false;
  if (DYNAMIC_HANDLED_PREFIXES.some((p) => r.startsWith(p))) return false;
  return true;
});
if (missingFromEdge.length) {
  bail(
    "React Router routes missing from edge sitemap STATIC_ROUTES (add them or excludelist):",
    missingFromEdge
  );
}

// ── 5. Parity check #3: robots.txt Sitemap entries match section keys ────
// Accept either query-string form (`?section=key`) or clean per-section
// public files (`/sitemap-key.xml`). Both must resolve to a known section.
const robots = readFileSync(ROBOTS_PATH, "utf8");
const robotsSitemapEntries = Array.from(robots.matchAll(/^Sitemap:\s*(\S+)/gm)).map((m) => m[1]);

const robotsSectionKeys: string[] = [];
for (const u of robotsSitemapEntries) {
  try {
    const parsed = new URL(u);
    const qs = parsed.searchParams.get("section");
    if (qs) {
      robotsSectionKeys.push(qs);
      continue;
    }
    const m = parsed.pathname.match(/\/sitemap-([a-z0-9-]+)\.xml$/i);
    if (m) robotsSectionKeys.push(m[1]);
  } catch {
    // ignore unparseable URL
  }
}

const robotsHasIndex = robotsSitemapEntries.some(
  (u) => u === `${PUBLIC_BASE}/sitemap.xml` || u === EDGE_BASE
);
if (!robotsHasIndex) {
  bail("robots.txt is missing the sitemap index entry", [
    `${PUBLIC_BASE}/sitemap.xml or ${EDGE_BASE}`,
  ]);
}

const sectionSet = new Set(sectionKeys);
const robotsExtras = robotsSectionKeys.filter((k) => !sectionSet.has(k));
const robotsMissing = sectionKeys.filter((k) => !robotsSectionKeys.includes(k));
if (robotsExtras.length || robotsMissing.length) {
  bail("robots.txt sitemap sections drift from edge function sections", [
    ...(robotsMissing.length ? [`Missing in robots.txt: ${robotsMissing.join(", ")}`] : []),
    ...(robotsExtras.length ? [`Unknown in robots.txt: ${robotsExtras.join(", ")}`] : []),
  ]);
}

// ── 6. Generate public/sitemap.xml (static index) ────────────────────────
// We expose each section as a clean public URL on the canonical domain
// (e.g. https://mallelbostan.com/sitemap-stores.xml) so Search Console
// shows our own domain rather than the internal Supabase functions URL.
// Each per-section file is itself a tiny <sitemapindex> shim that wraps
// the live edge function — keeping data dynamic while hiding the backend.
const today = new Date().toISOString().slice(0, 10);

// Fallback shim used only when the edge function cannot be reached at build
// time (offline/CI without network). Search engines reject nested
// <sitemapindex> entries, so we prefer to inline the real <urlset> below.
function fallbackShim(key: string): string {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<!-- FALLBACK shim for section: ${key} (edge fetch failed at build) -->`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    `  <sitemap><loc>${EDGE_BASE}?section=${key}</loc><lastmod>${today}</lastmod></sitemap>`,
    `</sitemapindex>`,
    ``,
  ].join("\n");
}

// Strip the XML prolog so we can inject our own header comment, then return
// the body of the <urlset> response from the edge function unchanged.
function inlineSection(key: string, xml: string): string {
  const body = xml.replace(/^\s*<\?xml[^?]*\?>\s*/i, "");
  if (!/^<urlset\b/i.test(body)) {
    throw new Error(`Section ${key}: expected <urlset> root, got: ${body.slice(0, 80)}`);
  }
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<!--`,
    `  Sitemap section: ${key}`,
    `  AUTO-GENERATED by scripts/build-sitemap.ts — do not edit by hand.`,
    `  Snapshot of the live edge function (urlset inlined on the canonical`,
    `  domain so search engines do not see nested sitemapindex entries).`,
    `  Generated: ${today}`,
    `-->`,
    body,
  ].join("\n");
}

async function fetchSection(key: string): Promise<string> {
  const url = `${EDGE_BASE}?section=${key}`;
  const res = await fetch(url, { headers: { Accept: "application/xml" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

const PUBLIC_DIR = dirname(SITEMAP_PATH);
mkdirSync(PUBLIC_DIR, { recursive: true });

const skipFetch = process.env.SKIP_SITEMAP_FETCH === "1";
let fetched = 0;
let fellBack = 0;

for (const key of sectionKeys) {
  const filePath = resolve(PUBLIC_DIR, `sitemap-${key}.xml`);
  if (skipFetch) {
    writeFileSync(filePath, fallbackShim(key), "utf8");
    fellBack++;
    continue;
  }
  try {
    const xml = await fetchSection(key);
    writeFileSync(filePath, inlineSection(key, xml), "utf8");
    fetched++;
  } catch (e) {
    console.warn(`  ⚠ ${key}: edge fetch failed (${(e as Error).message}) — writing fallback shim`);
    writeFileSync(filePath, fallbackShim(key), "utf8");
    fellBack++;
  }
}

console.log(`  fetched=${fetched} fallback=${fellBack} total=${sectionKeys.length}`);

const indexLines: string[] = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<!--`,
  `  Sitemap index — Mall El Bostan`,
  `  AUTO-GENERATED at build time by scripts/build-sitemap.ts`,
  `  Source of truth: supabase/functions/sitemap/index.ts (sections list)`,
  `  Do NOT edit by hand — re-run \`bun run prebuild\` to regenerate.`,
  `  Generated: ${today}`,
  `-->`,
  `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
];
for (const key of sectionKeys) {
  indexLines.push(
    `  <sitemap><loc>${PUBLIC_BASE}/sitemap-${key}.xml</loc><lastmod>${today}</lastmod></sitemap>`
  );
}
indexLines.push(`</sitemapindex>`, ``);

writeFileSync(SITEMAP_PATH, indexLines.join("\n"), "utf8");

console.log(
  `✓ sitemap.xml regenerated with ${sectionKeys.length} public per-section files (sitemap-<key>.xml) — parity verified.`
);

