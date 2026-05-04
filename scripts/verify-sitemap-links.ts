/**
 * Verify that every sitemap URL referenced in robots.txt, sitemap.xml,
 * and the public Sitemap React page resolves to an actual file in /public,
 * and (optionally) returns HTTP 200 from the production domain.
 *
 * Run:
 *   bun scripts/verify-sitemap-links.ts          # local file checks only
 *   CHECK_PROD=1 bun scripts/verify-sitemap-links.ts   # also fetch live URLs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = resolve(ROOT, "public");
const ROBOTS = resolve(PUBLIC_DIR, "robots.txt");
const SITEMAP = resolve(PUBLIC_DIR, "sitemap.xml");
const PAGE = resolve(ROOT, "src/pages/Sitemap.tsx");
const PROD = "https://mallelbostan.com";
const checkProd = process.env.CHECK_PROD === "1";

type Issue = { source: string; url: string; reason: string };
const issues: Issue[] = [];
const checked = new Set<string>();

function pathFromUrl(u: string): string | null {
  try {
    const parsed = new URL(u, PROD);
    if (parsed.origin !== PROD) return null;
    return parsed.pathname;
  } catch {
    return null;
  }
}

function checkLocal(source: string, url: string) {
  const path = url.startsWith("/") ? url : pathFromUrl(url);
  if (!path) return; // external (e.g. supabase fn) — skip local check
  if (checked.has(`${source}|${path}`)) return;
  checked.add(`${source}|${path}`);
  const fp = resolve(PUBLIC_DIR, path.replace(/^\//, ""));
  if (!existsSync(fp)) {
    issues.push({ source, url: path, reason: "missing in /public" });
  }
}

// ── 1. robots.txt ──────────────────────────────────────────────
const robots = readFileSync(ROBOTS, "utf8");
const robotsUrls = Array.from(robots.matchAll(/^Sitemap:\s*(\S+)/gm)).map((m) => m[1]);
console.log(`robots.txt → ${robotsUrls.length} Sitemap entries`);
for (const u of robotsUrls) checkLocal("robots.txt", u);

// ── 2. sitemap.xml index ───────────────────────────────────────
const sitemapXml = readFileSync(SITEMAP, "utf8");
const indexUrls = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
console.log(`sitemap.xml → ${indexUrls.length} <loc> entries`);
for (const u of indexUrls) checkLocal("sitemap.xml", u);

// ── 3. Sitemap React page links ────────────────────────────────
const pageSrc = readFileSync(PAGE, "utf8");
const pageUrls = Array.from(pageSrc.matchAll(/href:\s*"(\/(?:sitemap[^"]*|robots\.txt))"/g)).map((m) => m[1]);
console.log(`Sitemap.tsx → ${pageUrls.length} listed files`);
for (const u of pageUrls) checkLocal("Sitemap.tsx", u);

// ── 4. Production HTTP checks (optional) ───────────────────────
if (checkProd) {
  console.log(`\nFetching from ${PROD} …`);
  const allPaths = Array.from(
    new Set([...robotsUrls, ...indexUrls, ...pageUrls].map((u) => pathFromUrl(u) ?? (u.startsWith("/") ? u : null)).filter((v): v is string => !!v))
  );
  for (const p of allPaths) {
    try {
      const r = await fetch(`${PROD}${p}`, { method: "GET", redirect: "follow" });
      const ct = r.headers.get("content-type") ?? "";
      const ok = r.ok && (p.endsWith(".txt") ? ct.includes("text/plain") : ct.includes("xml") || ct.includes("text"));
      if (!ok) {
        issues.push({ source: "prod", url: p, reason: `HTTP ${r.status} content-type=${ct}` });
      } else {
        console.log(`  ✓ ${p} — ${r.status} ${ct.split(";")[0]}`);
      }
    } catch (e) {
      issues.push({ source: "prod", url: p, reason: `fetch failed: ${(e as Error).message}` });
    }
  }
}

// ── Report ──────────────────────────────────────────────────────
console.log("");
if (issues.length === 0) {
  console.log(`✓ All ${checked.size} unique local paths exist in /public${checkProd ? " and respond OK in production" : ""}.`);
  process.exit(0);
}
console.error(`✖ ${issues.length} issue(s):`);
for (const i of issues) console.error(`  [${i.source}] ${i.url} — ${i.reason}`);
process.exit(1);
