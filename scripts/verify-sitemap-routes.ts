/**
 * Verify every <loc> URL inside public/sitemap-*.xml maps to a real React
 * Router path declared in src/App.tsx — guarantees no 404s after deploy.
 *
 * A sitemap URL matches a route if:
 *   1. Exact match against a static path, OR
 *   2. Matches a dynamic route pattern (e.g. /stores/:slug ↔ /stores/foo)
 *
 * Optional: with CHECK_PROD=1, additionally HEAD-checks each URL against
 * https://mallelbostan.com and asserts HTTP 200.
 *
 * Run locally:
 *   bun scripts/verify-sitemap-routes.ts
 *   CHECK_PROD=1 bun scripts/verify-sitemap-routes.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = resolve(ROOT, "public");
const APP_TSX = resolve(ROOT, "src/App.tsx");
const PROD = "https://mallelbostan.com";
const checkProd = process.env.CHECK_PROD === "1";

// ── 1. Extract React Router routes ──────────────────────────────────────
const appSrc = readFileSync(APP_TSX, "utf8");
const routes = Array.from(appSrc.matchAll(/<Route\s+path="([^"]+)"/g))
  .map((m) => m[1])
  .filter((p) => p !== "*");

// Convert React Router pattern to a regex: /stores/:slug → ^/stores/[^/]+$
function patternToRegex(pattern: string): RegExp {
  const body = pattern
    .split("/")
    .map((seg) => (seg.startsWith(":") ? "[^/]+" : seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
    .join("/");
  return new RegExp(`^${body}$`);
}
const matchers = routes.map((r) => ({ pattern: r, re: patternToRegex(r) }));

function matchesRoute(path: string): string | null {
  for (const m of matchers) if (m.re.test(path)) return m.pattern;
  return null;
}

// ── 2. Walk every public/sitemap-*.xml and collect <loc> URLs ───────────
// Exclude sitemap-main.xml — legacy shim that intentionally points at the
// edge function for backwards compatibility with old external links.
const files = readdirSync(PUBLIC_DIR).filter(
  (f) => /^sitemap-[a-z0-9-]+\.xml$/i.test(f) && f !== "sitemap-main.xml"
);
type Loc = { file: string; url: string; path: string };
const locs: Loc[] = [];
for (const f of files) {
  const xml = readFileSync(resolve(PUBLIC_DIR, f), "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = m[1].trim();
    let path: string;
    try {
      path = new URL(url).pathname;
    } catch {
      console.error(`  ✖ ${f}: unparseable URL: ${url}`);
      process.exit(1);
    }
    locs.push({ file: f, url, path });
  }
}
console.log(`Scanned ${files.length} sitemap files → ${locs.length} URLs`);

// ── 3. Validate each path against React Router ──────────────────────────
const unmatched: Loc[] = [];
for (const l of locs) if (!matchesRoute(l.path)) unmatched.push(l);

if (unmatched.length) {
  console.error(`\n✖ ${unmatched.length} sitemap URL(s) do NOT match any React Router path:`);
  for (const u of unmatched.slice(0, 20)) console.error(`  [${u.file}] ${u.path}`);
  if (unmatched.length > 20) console.error(`  … and ${unmatched.length - 20} more`);
  process.exit(1);
}
console.log(`✓ All ${locs.length} URLs match a route in src/App.tsx`);

// ── 4. Optional production HTTP check ───────────────────────────────────
if (checkProd) {
  console.log(`\nChecking HTTP 200 against ${PROD} …`);
  const uniquePaths = Array.from(new Set(locs.map((l) => l.path)));
  const failures: { path: string; status: number }[] = [];
  // limit concurrency
  const queue = [...uniquePaths];
  const workers = Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const p = queue.shift()!;
      try {
        const r = await fetch(`${PROD}${p}`, { method: "GET", redirect: "follow" });
        if (!r.ok) failures.push({ path: p, status: r.status });
        await r.text();
      } catch (e) {
        failures.push({ path: p, status: 0 });
      }
    }
  });
  await Promise.all(workers);
  if (failures.length) {
    console.error(`\n✖ ${failures.length} URL(s) returned non-200 in production:`);
    for (const f of failures.slice(0, 30)) console.error(`  [${f.status}] ${f.path}`);
    process.exit(1);
  }
  console.log(`✓ All ${uniquePaths.length} unique paths return HTTP 200 from ${PROD}`);
}
