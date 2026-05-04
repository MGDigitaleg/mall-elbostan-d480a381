/**
 * Generate a Markdown report summarising every public/sitemap-*.xml file:
 *   - URL count
 *   - root element (urlset / sitemapindex)
 *   - well-formed status
 *   - whether every <loc> matches a React Router route
 *   - any issues encountered
 *
 * Output: reports/sitemap-report.md  (uploaded as a CI artifact).
 * Exit code is always 0 — this is a *report*, not a gate. The strict gates
 * live in the other validation steps inside .github/workflows/sitemap-parity.yml.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = resolve(ROOT, "public");
const APP_TSX = resolve(ROOT, "src/App.tsx");
const OUT_DIR = resolve(ROOT, "reports");
const OUT_FILE = resolve(OUT_DIR, "sitemap-report.md");

// ── React Router pattern matchers ────────────────────────────────────────
const appSrc = readFileSync(APP_TSX, "utf8");
const routes = Array.from(appSrc.matchAll(/<Route\s+path="([^"]+)"/g))
  .map((m) => m[1])
  .filter((p) => p !== "*");
const matchers = routes.map((r) => ({
  pattern: r,
  re: new RegExp(
    "^" +
      r
        .split("/")
        .map((seg) =>
          seg.startsWith(":") ? "[^/]+" : seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        )
        .join("/") +
      "$"
  ),
}));
const matchesRoute = (path: string) => matchers.some((m) => m.re.test(path));

// ── Walk sitemap files ───────────────────────────────────────────────────
type Row = {
  file: string;
  bytes: number;
  root: string;
  urlCount: number;
  unmatched: number;
  wellFormed: boolean;
  issues: string[];
};
const rows: Row[] = [];

const sitemapFiles = readdirSync(PUBLIC_DIR)
  .filter((f) => /^sitemap.*\.xml$/i.test(f))
  .sort();

for (const f of sitemapFiles) {
  const fp = resolve(PUBLIC_DIR, f);
  const xml = readFileSync(fp, "utf8");
  const bytes = statSync(fp).size;
  const issues: string[] = [];

  let root = "unknown";
  if (/<urlset\b/i.test(xml)) root = "urlset";
  else if (/<sitemapindex\b/i.test(xml)) root = "sitemapindex";
  else issues.push("missing root element");

  const wellFormed =
    /^\s*<\?xml/.test(xml) && /<\/(urlset|sitemapindex)>\s*$/i.test(xml);
  if (!wellFormed) issues.push("not well-formed");

  // Nested sitemapindex inside a section file = the bug Google rejects
  if (f !== "sitemap.xml" && f !== "sitemap-main.xml" && root === "sitemapindex") {
    issues.push("nested <sitemapindex> (Google rejects)");
  }

  const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
  const urlCount = (xml.match(/<url>/g) || []).length;

  // Route-existence check (skip legacy file)
  let unmatched = 0;
  if (root === "urlset" && f !== "sitemap-main.xml") {
    for (const url of locs) {
      try {
        const p = new URL(url).pathname;
        if (!matchesRoute(p)) unmatched++;
      } catch {
        issues.push(`unparseable URL: ${url}`);
      }
    }
    if (unmatched > 0) issues.push(`${unmatched} URL(s) have no matching React Router route`);
  }

  rows.push({ file: f, bytes, root, urlCount, unmatched, wellFormed, issues });
}

// ── Render markdown ──────────────────────────────────────────────────────
const totalUrls = rows.reduce((s, r) => s + r.urlCount, 0);
const totalIssues = rows.reduce((s, r) => s + r.issues.length, 0);
const totalUnmatched = rows.reduce((s, r) => s + r.unmatched, 0);

const lines: string[] = [];
lines.push(`# Sitemap Report`);
lines.push("");
lines.push(`Generated: \`${new Date().toISOString()}\``);
lines.push("");
lines.push(`## Summary`);
lines.push("");
lines.push(`| Metric | Value |`);
lines.push(`|---|---|`);
lines.push(`| Files scanned | ${rows.length} |`);
lines.push(`| Total URLs | **${totalUrls}** |`);
lines.push(`| Files with issues | ${rows.filter((r) => r.issues.length).length} |`);
lines.push(`| URLs without a matching route | ${totalUnmatched} |`);
lines.push(`| Total issues | ${totalIssues} |`);
lines.push("");
lines.push(`## Per-file breakdown`);
lines.push("");
lines.push(`| File | Root | URLs | Size | Well-formed | Issues |`);
lines.push(`|---|---|---:|---:|:---:|---|`);
for (const r of rows) {
  const status = r.issues.length === 0 ? "OK" : r.issues.join("; ");
  lines.push(
    `| \`${r.file}\` | ${r.root} | ${r.urlCount} | ${r.bytes} B | ${
      r.wellFormed ? "yes" : "no"
    } | ${status} |`
  );
}
lines.push("");
if (totalIssues === 0) {
  lines.push(`> All sitemap files are valid.`);
} else {
  lines.push(`> ${totalIssues} issue(s) detected — see breakdown above.`);
}
lines.push("");

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, lines.join("\n"), "utf8");

console.log(`Report written → ${OUT_FILE}`);
console.log(`Files=${rows.length} URLs=${totalUrls} Issues=${totalIssues}`);
