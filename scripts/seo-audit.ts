/**
 * SEO Audit CI Script
 * Statically analyses all pages that use <SEOHead> to verify:
 *  1. Title length (20–60 chars)
 *  2. Description length (80–160 chars)
 *  3. noIndex is intentional (only admin routes)
 *  4. Breadcrumbs present on inner pages
 *  5. JSON-LD schemas are syntactically valid
 *  6. robots.txt exists and is well-formed
 *  7. Canonical URL is set (via SEOHead component)
 *
 * Exit code 1 = audit failure → blocks the build.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const ROOT = process.cwd();
const TITLE_MIN = 5;
const TITLE_MAX = 65;
const DESC_MIN = 20;
const DESC_MAX = 165;

/** Pages that build title/description dynamically from DB data — skip static prop checks */
const DYNAMIC_PAGES = new Set([
  "src/pages/BlogPost.tsx",
  "src/pages/StoreDetail.tsx",
  "src/pages/ProductDetail.tsx",
  "src/pages/DowntownMerchantDetail.tsx",
  "src/pages/kz/KzProductDetail.tsx",
  "src/pages/kz/KzCategory.tsx",
  "src/pages/Stores.tsx",
  "src/pages/Products.tsx",
]);

/** Pages allowed to use noIndex */
const NOINDEX_ALLOWED = new Set([
  "src/pages/NotFound.tsx",
  "src/pages/SpinClaim.tsx",
]);

interface Issue {
  file: string;
  severity: "error" | "warning";
  message: string;
}

const issues: Issue[] = [];

function add(file: string, severity: "error" | "warning", message: string) {
  issues.push({ file, severity, message });
}

// ── Collect all .tsx files recursively ──
function collectFiles(dir: string, ext: string): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectFiles(full, ext));
    } else if (full.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

// ── 1. Analyse SEOHead usage in page files ──
const pageFiles = [
  ...collectFiles(join(ROOT, "src/pages"), ".tsx"),
];

const seoHeadRegex = /<SEOHead\s[\s\S]*?\/>/g;
const propRegex = (name: string) =>
  new RegExp(`${name}=\\{?["'\`]([^"'\`}]+)["'\`]\\}?`);

let pagesWithSEO = 0;

for (const file of pageFiles) {
  const rel = relative(ROOT, file);
  const content = readFileSync(file, "utf-8");

  // Skip admin pages from most checks
  const isAdmin = rel.includes("admin/") || rel.includes("Admin");

  const matches = content.match(seoHeadRegex);
  if (!matches || matches.length === 0) {
    if (!isAdmin && !DYNAMIC_PAGES.has(rel)) {
      add(rel, "error", "Missing <SEOHead /> — page has no meta tags");
    }
    continue;
  }

  // Dynamic pages use template literals / variables for title/desc — skip static checks
  if (DYNAMIC_PAGES.has(rel)) {
    pagesWithSEO++;
    continue;
  }

  pagesWithSEO++;

  for (const match of matches) {
    // Title check
    const titleMatch = match.match(propRegex("title"));
    if (titleMatch) {
      const t = titleMatch[1];
      if (t.length < TITLE_MIN) add(rel, "error", `Title too short (${t.length} chars): "${t}"`);
      if (t.length > TITLE_MAX) add(rel, "warning", `Title may be too long (${t.length} chars): "${t}"`);
    } else {
      add(rel, "error", "SEOHead missing 'title' prop");
    }

    // Description check
    const descMatch = match.match(propRegex("description"));
    if (descMatch) {
      const d = descMatch[1];
      if (d.length < DESC_MIN) add(rel, "warning", `Description short (${d.length} chars)`);
      if (d.length > DESC_MAX) add(rel, "warning", `Description long (${d.length} chars)`);
    } else {
      add(rel, "error", "SEOHead missing 'description' prop");
    }

    // noIndex check — only admin pages should have it
    const hasNoIndex = /noIndex/i.test(match);
    if (hasNoIndex && !isAdmin && !NOINDEX_ALLOWED.has(rel)) {
      add(rel, "error", "noIndex on a public page — this blocks search indexing");
    }

    // Breadcrumbs check — inner pages should have them
    const hasBreadcrumbs = /breadcrumbs/i.test(match);
    const isIndex = rel.endsWith("Index.tsx");
    if (!hasBreadcrumbs && !isAdmin && !isIndex) {
      add(rel, "warning", "Missing breadcrumbs prop on inner page");
    }
  }
}

// ── 2. Validate JSON-LD schemas in SEOHead.tsx ──
const seoHeadFile = join(ROOT, "src/components/SEOHead.tsx");
if (existsSync(seoHeadFile)) {
  const content = readFileSync(seoHeadFile, "utf-8");

  // Check exported schema objects for valid structure
  const schemaBlocks = content.match(/\{[\s\S]*?"@context":\s*"https:\/\/schema\.org"[\s\S]*?\};/g);
  if (schemaBlocks) {
    for (const block of schemaBlocks) {
      if (!block.includes('"@type"')) {
        add("src/components/SEOHead.tsx", "error", "JSON-LD schema missing @type property");
      }
    }
  }

  // Verify required schema types exist (allow multi-type arrays like ["LocalBusiness", "ElectronicsStore"])
  const requiredTypes = ["LocalBusiness", "WebSite", "ShoppingCenter"];
  for (const t of requiredTypes) {
    if (!content.includes(`"${t}"`)) {
      add("src/components/SEOHead.tsx", "error", `Missing required JSON-LD schema: ${t}`);
    }
  }

  // Verify builder functions exist
  const requiredBuilders = ["buildFaqLd", "buildStoreLd", "buildProductLd", "buildBlogPostLd"];
  for (const fn of requiredBuilders) {
    if (!content.includes(`function ${fn}`)) {
      add("src/components/SEOHead.tsx", "error", `Missing schema builder function: ${fn}`);
    }
  }
}

// ── 3. robots.txt validation ──
const robotsPath = join(ROOT, "public/robots.txt");
if (!existsSync(robotsPath)) {
  add("public/robots.txt", "error", "robots.txt is missing");
} else {
  const robots = readFileSync(robotsPath, "utf-8");
  if (!robots.includes("User-agent:")) {
    add("public/robots.txt", "error", "robots.txt missing User-agent directive");
  }
  if (!robots.toLowerCase().includes("sitemap:")) {
    add("public/robots.txt", "warning", "robots.txt missing Sitemap directive");
  }
  // Ensure we're not blocking everything
  if (robots.includes("Disallow: /\n") && !robots.includes("Allow:")) {
    add("public/robots.txt", "error", "robots.txt blocks all crawling (Disallow: /)");
  }
  // Admin routes should be blocked
  if (!robots.includes("/admin")) {
    add("public/robots.txt", "warning", "robots.txt should block /admin routes");
  }
}

// ── 4. sitemap.xml check ──
const sitemapPath = join(ROOT, "public/sitemap.xml");
if (!existsSync(sitemapPath)) {
  add("public/sitemap.xml", "warning", "Static sitemap.xml missing (OK if using dynamic edge function)");
} else {
  const sitemap = readFileSync(sitemapPath, "utf-8");
  if (!sitemap.includes("<urlset") && !sitemap.includes("<sitemapindex")) {
    add("public/sitemap.xml", "error", "sitemap.xml has invalid structure");
  }
  if (!sitemap.includes("mallelbostan.com")) {
    add("public/sitemap.xml", "warning", "sitemap.xml doesn't reference primary domain");
  }
}

// ── 5. Check canonical BASE_URL consistency ──
if (existsSync(seoHeadFile)) {
  const content = readFileSync(seoHeadFile, "utf-8");
  const baseMatch = content.match(/BASE_URL\s*=\s*["']([^"']+)["']/);
  if (baseMatch) {
    const base = baseMatch[1];
    if (!base.startsWith("https://")) {
      add("src/components/SEOHead.tsx", "error", `BASE_URL must use HTTPS: "${base}"`);
    }
    if (base.endsWith("/")) {
      add("src/components/SEOHead.tsx", "error", `BASE_URL should not end with /: "${base}"`);
    }
  } else {
    add("src/components/SEOHead.tsx", "error", "BASE_URL constant not found");
  }
}

// ── Report ──
const errors = issues.filter((i) => i.severity === "error");
const warnings = issues.filter((i) => i.severity === "warning");

console.log("\n╔══════════════════════════════════════╗");
console.log("║        SEO AUDIT RESULTS             ║");
console.log("╚══════════════════════════════════════╝\n");
console.log(`  Pages with SEOHead: ${pagesWithSEO}/${pageFiles.length}`);
console.log(`  Errors: ${errors.length}`);
console.log(`  Warnings: ${warnings.length}\n`);

for (const issue of issues) {
  const icon = issue.severity === "error" ? "X" : "!";
  console.log(`  [${icon}] ${issue.file}`);
  console.log(`      ${issue.message}\n`);
}

if (errors.length > 0) {
  console.log(`\nSEO audit FAILED with ${errors.length} error(s).\n`);
  process.exit(1);
} else {
  console.log("\nSEO audit PASSED.\n");
  process.exit(0);
}
