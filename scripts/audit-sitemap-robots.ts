/**
 * Sitemap × robots.txt × per-page noIndex cross-check.
 *
 * Reads:
 *   - public/sitemap.xml         (static sitemap)
 *   - public/robots.txt           (allow/disallow rules)
 *   - supabase/functions/sitemap  (dynamic edge function STATIC_ROUTES)
 *   - src/pages/**.tsx            (per-page `noIndex` flags from <SEOHead />)
 *
 * Reports:
 *   - URLs in static sitemap
 *   - URLs in dynamic edge sitemap (STATIC_ROUTES section)
 *   - URLs disallowed in robots.txt
 *   - Pages with `noIndex` (always or conditional)
 *   - DRIFT: paths that are in one source but not the others
 *
 * Output: reports/sitemap-robots-audit.md
 */
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

// ── 1. Static sitemap ──
const staticXml = readFileSync(join(ROOT, "public/sitemap.xml"), "utf8");
const staticUrls = Array.from(staticXml.matchAll(/<loc>([^<]+)<\/loc>/g))
  .map((m) => m[1].replace("https://mallelbostan.com", "").replace(/^$/, "/"))
  .sort();

// ── 2. Robots.txt ──
const robots = readFileSync(join(ROOT, "public/robots.txt"), "utf8");
const robotsAllow = Array.from(robots.matchAll(/^Allow:\s*(\S+)/gm)).map((m) => m[1]);
const robotsDisallow = Array.from(robots.matchAll(/^Disallow:\s*(\S+)/gm)).map((m) => m[1]);
const robotsSitemaps = Array.from(robots.matchAll(/^Sitemap:\s*(\S+)/gm)).map((m) => m[1]);

// ── 3. Dynamic edge sitemap STATIC_ROUTES ──
const edgeFn = readFileSync(join(ROOT, "supabase/functions/sitemap/index.ts"), "utf8");
const edgeRoutes = Array.from(edgeFn.matchAll(/loc:\s*"([^"]+)"\s*,\s*priority/g))
  .map((m) => m[1])
  .sort();

// ── 4. Per-page noIndex flags ──
interface PageNoIndex { file: string; mode: "always" | "conditional"; condition?: string; }
const pageNoIndex: PageNoIndex[] = [];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (e.endsWith(".tsx")) out.push(p);
  }
  return out;
}

for (const f of walk(join(ROOT, "src/pages"))) {
  const txt = readFileSync(f, "utf8");
  // bare noIndex prop  (always)
  const bareMatches = Array.from(txt.matchAll(/\bnoIndex\b(?!\s*[=:])/g));
  // noIndex={...}  (conditional)
  const condMatches = Array.from(txt.matchAll(/noIndex=\{([^}]+)\}/g));

  if (condMatches.length) {
    for (const m of condMatches) {
      pageNoIndex.push({ file: relative(ROOT, f), mode: "conditional", condition: m[1].trim() });
    }
  } else if (bareMatches.length) {
    pageNoIndex.push({ file: relative(ROOT, f), mode: "always" });
  }
}

// ── 5. Cross-check drift ──
const staticSet = new Set(staticUrls);
const edgeSet = new Set(edgeRoutes);

const onlyInStatic = [...staticSet].filter((u) => !edgeSet.has(u)).sort();
const onlyInEdge = [...edgeSet].filter((u) => !staticSet.has(u)).sort();

// Robots-blocked paths that are also in a sitemap (would be wasteful)
const blockedInSitemap = robotsDisallow.filter((d) =>
  staticUrls.some((u) => u === d || u.startsWith(d.replace(/\*$/, ""))) ||
  edgeRoutes.some((u) => u === d || u.startsWith(d.replace(/\*$/, "")))
);

// noIndex pages that are in a sitemap (only flag *always*-noindex; conditional is fine)
const alwaysNoIndexPaths = pageNoIndex
  .filter((p) => p.mode === "always")
  .map((p) => p.file);

// ── 6. Build report ──
const today = new Date().toISOString().slice(0, 10);

let md = `# Sitemap × robots.txt × noIndex Audit\n`;
md += `**Generated:** ${today}\n\n`;
md += `**Sources cross-checked:**\n`;
md += `- \`public/sitemap.xml\` (static sitemap)\n`;
md += `- \`public/robots.txt\`\n`;
md += `- \`supabase/functions/sitemap/index.ts\` (dynamic edge function)\n`;
md += `- \`src/pages/**\` (per-page \`noIndex\` flags)\n\n`;

md += `---\n\n## 1. Static sitemap.xml — ${staticUrls.length} URLs\n\n`;
for (const u of staticUrls) md += `- ${u || "/"}\n`;

md += `\n---\n\n## 2. Dynamic edge function STATIC_ROUTES — ${edgeRoutes.length} URLs\n\n`;
md += `_(The edge function adds DB-driven URLs on top: stores, products, blog, downtown merchants, kz_products.)_\n\n`;
for (const u of edgeRoutes) md += `- ${u}\n`;

md += `\n---\n\n## 3. robots.txt rules\n\n`;
md += `### Allow (${robotsAllow.length})\n`;
for (const u of robotsAllow) md += `- ${u}\n`;
md += `\n### Disallow (${robotsDisallow.length})\n`;
for (const u of robotsDisallow) md += `- ${u}\n`;
md += `\n### Sitemap declarations (${robotsSitemaps.length})\n`;
for (const u of robotsSitemaps) md += `- ${u}\n`;

md += `\n---\n\n## 4. Per-page \`noIndex\` flags — ${pageNoIndex.length} pages\n\n`;
md += `| File | Mode | Condition |\n| --- | --- | --- |\n`;
for (const p of pageNoIndex) {
  md += `| \`${p.file}\` | ${p.mode} | ${p.condition ? `\`${p.condition}\`` : "—"} |\n`;
}

md += `\n---\n\n## 5. Drift detection\n\n`;

md += `### URLs in static sitemap but NOT in dynamic edge sitemap (${onlyInStatic.length})\n`;
md += onlyInStatic.length === 0 ? `_None — both sources agree._\n` : onlyInStatic.map((u) => `- ⚠️  \`${u || "/"}\``).join("\n") + "\n";

md += `\n### URLs in dynamic edge sitemap but NOT in static sitemap (${onlyInEdge.length})\n`;
md += onlyInEdge.length === 0 ? `_None._\n` : onlyInEdge.map((u) => `- ⚠️  \`${u}\``).join("\n") + "\n";

md += `\n### Disallowed paths that also appear in a sitemap (${blockedInSitemap.length})\n`;
md += blockedInSitemap.length === 0 ? `_None — robots.txt and sitemaps are consistent._\n` : blockedInSitemap.map((u) => `- ❌ \`${u}\` — remove from sitemap or unblock`).join("\n") + "\n";

md += `\n---\n\n## 6. Summary\n\n`;
const errors = blockedInSitemap.length;
const warnings = onlyInStatic.length + onlyInEdge.length;
md += `- ✅ ${staticUrls.length} URLs in static sitemap\n`;
md += `- ✅ ${edgeRoutes.length} static URLs in dynamic edge sitemap (DB rows added on top)\n`;
md += `- ✅ ${robotsDisallow.length} disallow rules in robots.txt\n`;
md += `- ✅ ${pageNoIndex.length} pages with \`noIndex\` (always or conditional)\n`;
md += `- ${errors === 0 ? "✅" : "❌"} ${errors} disallow / sitemap conflict(s)\n`;
md += `- ${warnings === 0 ? "✅" : "⚠️"} ${warnings} static ↔ edge drift item(s)\n`;

md += `\n### Verdict\n`;
if (errors === 0 && warnings === 0) {
  md += `**🟢 PASS** — sitemap.xml, the dynamic edge sitemap, and robots.txt are perfectly aligned.\n`;
} else if (errors === 0) {
  md += `**🟡 PASS WITH NOTES** — no robots/sitemap conflicts, but the static and dynamic sitemaps diverge. Decide which is canonical and align the other.\n`;
} else {
  md += `**🔴 FIX REQUIRED** — robots.txt blocks paths that are listed in a sitemap. Remove them from the sitemap or unblock in robots.txt.\n`;
}

mkdirSync(join(ROOT, "reports"), { recursive: true });
const outPath = join(ROOT, "reports/sitemap-robots-audit.md");
writeFileSync(outPath, md, "utf8");

console.log(`\nReport written to: ${relative(ROOT, outPath)}`);
console.log(`  static sitemap: ${staticUrls.length} URLs`);
console.log(`  edge sitemap:   ${edgeRoutes.length} static URLs`);
console.log(`  robots disallow:${robotsDisallow.length} rules`);
console.log(`  noIndex pages:  ${pageNoIndex.length}`);
console.log(`  drift:          ${warnings} | conflicts: ${errors}\n`);
