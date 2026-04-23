/**
 * Rich Results JSON-LD validator for Mall Elbostan.
 *
 * Fetches a curated set of public URLs (homepage + sample store pages),
 * extracts every <script type="application/ld+json"> block, parses it,
 * and validates against a minimum subset of schema.org Rich Results rules:
 *
 *   - Each block is valid JSON
 *   - Each block has @context = "https://schema.org" and a known @type
 *   - Type-specific required fields are present (Organization.name + url,
 *     Product.name + offers.price + offers.priceCurrency, etc.)
 *   - URLs use absolute https:// where required
 *   - BreadcrumbList items are sequential and well-formed
 *
 * Note: This is a static-fetch validator. SPA pages render JSON-LD via
 *       react-helmet-async on the client, so for those routes we only see
 *       the static fallback in index.html. To validate per-page dynamic
 *       JSON-LD, run against the deployed production URLs (which is what
 *       Google's Rich Results Test does too).
 *
 * Usage:
 *   bun run scripts/validate-rich-results.ts
 *   bun run scripts/validate-rich-results.ts --base=https://mallelbostan.com
 */

const args = process.argv.slice(2);
const baseArg = args.find((a) => a.startsWith("--base="));
const BASE = (baseArg ? baseArg.split("=")[1] : "https://mallelbostan.com").replace(/\/$/, "");

const ROUTES = [
  "/",
  "/about",
  "/contact",
  "/faq",
  "/stores",
  "/stores/kasr-zero", // sample store detail
  "/products",
];

interface Issue {
  url: string;
  blockIndex: number;
  type: string;
  severity: "error" | "warning";
  message: string;
}

const issues: Issue[] = [];
const summary: { url: string; blocks: number; types: string[] }[] = [];

function addIssue(i: Issue) { issues.push(i); }

function isAbsoluteHttps(v: unknown): v is string {
  return typeof v === "string" && /^https:\/\//.test(v);
}

function validateBlock(url: string, idx: number, ld: Record<string, unknown>) {
  const ctx = ld["@context"];
  const type = ld["@type"];
  const typeStr = Array.isArray(type) ? type.join(",") : String(type ?? "Unknown");

  if (ctx !== "https://schema.org") {
    addIssue({ url, blockIndex: idx, type: typeStr, severity: "error",
      message: `@context must be "https://schema.org" (got: ${JSON.stringify(ctx)})` });
  }
  if (!type) {
    addIssue({ url, blockIndex: idx, type: "Unknown", severity: "error", message: "Missing @type" });
    return typeStr;
  }

  const types = Array.isArray(type) ? type as string[] : [type as string];

  // ── Type-specific checks ──
  for (const t of types) {
    switch (t) {
      case "Organization":
      case "LocalBusiness":
      case "ElectronicsStore":
      case "ShoppingCenter":
      case "Store":
      case "ComputerStore": {
        if (!ld.name) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: `${t}: missing required "name"` });
        if (!isAbsoluteHttps(ld.url)) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: `${t}: "url" must be absolute https://` });
        if (ld.telephone && typeof ld.telephone !== "string") addIssue({ url, blockIndex: idx, type: t, severity: "warning", message: `${t}: "telephone" should be a string` });
        if (ld.address && typeof ld.address !== "object") addIssue({ url, blockIndex: idx, type: t, severity: "error", message: `${t}: "address" must be a PostalAddress object` });
        if (ld.sameAs) {
          const arr = Array.isArray(ld.sameAs) ? ld.sameAs : [ld.sameAs];
          arr.forEach((u, i2) => {
            if (!isAbsoluteHttps(u)) addIssue({ url, blockIndex: idx, type: t, severity: "warning", message: `${t}: sameAs[${i2}] not absolute https://` });
          });
        }
        break;
      }
      case "WebSite": {
        if (!ld.name) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: "WebSite: missing name" });
        if (!isAbsoluteHttps(ld.url)) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: "WebSite: url must be absolute https://" });
        if (ld.potentialAction) {
          const pa = ld.potentialAction as Record<string, unknown>;
          if (pa["@type"] !== "SearchAction") addIssue({ url, blockIndex: idx, type: t, severity: "warning", message: "WebSite.potentialAction should be SearchAction" });
        }
        break;
      }
      case "Product": {
        if (!ld.name) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: "Product: missing name" });
        if (!ld.image) addIssue({ url, blockIndex: idx, type: t, severity: "warning", message: "Product: missing image (recommended for Rich Results)" });
        const offers = ld.offers as Record<string, unknown> | undefined;
        if (offers) {
          if (offers.price === undefined) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: "Product.offers: missing price" });
          if (!offers.priceCurrency) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: "Product.offers: missing priceCurrency" });
        }
        break;
      }
      case "FAQPage": {
        const me = ld.mainEntity as unknown[] | undefined;
        if (!Array.isArray(me) || me.length === 0) {
          addIssue({ url, blockIndex: idx, type: t, severity: "error", message: "FAQPage: mainEntity must be a non-empty array of Question" });
        } else {
          me.forEach((q, qi) => {
            const qq = q as Record<string, unknown>;
            if (qq["@type"] !== "Question") addIssue({ url, blockIndex: idx, type: t, severity: "error", message: `FAQPage.mainEntity[${qi}]: must be type Question` });
            if (!qq.name) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: `FAQPage.mainEntity[${qi}]: missing name` });
            const ans = qq.acceptedAnswer as Record<string, unknown> | undefined;
            if (!ans || ans["@type"] !== "Answer" || !ans.text) {
              addIssue({ url, blockIndex: idx, type: t, severity: "error", message: `FAQPage.mainEntity[${qi}]: missing acceptedAnswer.text` });
            }
          });
        }
        break;
      }
      case "BreadcrumbList": {
        const items = ld.itemListElement as unknown[] | undefined;
        if (!Array.isArray(items) || items.length === 0) {
          addIssue({ url, blockIndex: idx, type: t, severity: "error", message: "BreadcrumbList: itemListElement must be a non-empty array" });
        } else {
          items.forEach((it, ii) => {
            const item = it as Record<string, unknown>;
            if (item["@type"] !== "ListItem") addIssue({ url, blockIndex: idx, type: t, severity: "error", message: `BreadcrumbList[${ii}]: must be ListItem` });
            if (item.position !== ii + 1) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: `BreadcrumbList[${ii}]: position ${item.position} should be ${ii + 1}` });
            if (!item.name) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: `BreadcrumbList[${ii}]: missing name` });
            if (!isAbsoluteHttps(item.item)) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: `BreadcrumbList[${ii}]: "item" must be absolute https:// URL` });
          });
        }
        break;
      }
      case "Event": {
        if (!ld.name) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: "Event: missing name" });
        if (!ld.startDate) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: "Event: missing startDate" });
        if (!ld.location) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: "Event: missing location" });
        break;
      }
      case "ItemList": {
        const els = ld.itemListElement as unknown[] | undefined;
        if (!Array.isArray(els) || els.length === 0) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: "ItemList: itemListElement empty" });
        break;
      }
      case "BlogPosting":
      case "Article": {
        if (!ld.headline) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: `${t}: missing headline` });
        if (!ld.author) addIssue({ url, blockIndex: idx, type: t, severity: "warning", message: `${t}: missing author` });
        break;
      }
      case "JobPosting": {
        if (!ld.title) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: "JobPosting: missing title" });
        if (!ld.hiringOrganization) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: "JobPosting: missing hiringOrganization" });
        if (!ld.jobLocation) addIssue({ url, blockIndex: idx, type: t, severity: "error", message: "JobPosting: missing jobLocation" });
        break;
      }
    }
  }

  return typeStr;
}

function extractJsonLd(html: string): unknown[] {
  const blocks: unknown[] = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    try {
      blocks.push(JSON.parse(raw));
    } catch (e) {
      blocks.push({ __parseError: (e as Error).message, __raw: raw.slice(0, 200) });
    }
  }
  return blocks;
}

async function validateUrl(path: string) {
  const url = `${BASE}${path}`;
  process.stdout.write(`▸ ${url} ... `);
  let html: string;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "MallElbostan-RichResults-Validator/1.0" } });
    if (!res.ok) {
      console.log(`HTTP ${res.status}`);
      addIssue({ url, blockIndex: -1, type: "—", severity: "error", message: `HTTP ${res.status}` });
      summary.push({ url, blocks: 0, types: [] });
      return;
    }
    html = await res.text();
  } catch (e) {
    console.log(`fetch failed: ${(e as Error).message}`);
    addIssue({ url, blockIndex: -1, type: "—", severity: "error", message: `Fetch failed: ${(e as Error).message}` });
    summary.push({ url, blocks: 0, types: [] });
    return;
  }

  const blocks = extractJsonLd(html);
  const types: string[] = [];

  if (blocks.length === 0) {
    addIssue({ url, blockIndex: -1, type: "—", severity: "warning", message: "No JSON-LD blocks found in static HTML (SPA routes render via react-helmet-async on the client; this is expected for non-prerendered URLs)" });
  }

  blocks.forEach((b, i) => {
    if (b && typeof b === "object" && "__parseError" in b) {
      addIssue({ url, blockIndex: i, type: "—", severity: "error", message: `Invalid JSON: ${(b as { __parseError: string }).__parseError}` });
      return;
    }
    const t = validateBlock(url, i, b as Record<string, unknown>);
    types.push(t);
  });

  console.log(`${blocks.length} block(s) [${types.join(", ") || "—"}]`);
  summary.push({ url, blocks: blocks.length, types });
}

async function main() {
  console.log(`\n🔍 Rich Results JSON-LD validation`);
  console.log(`   Base: ${BASE}\n`);

  for (const r of ROUTES) await validateUrl(r);

  console.log(`\n${"─".repeat(70)}\nSUMMARY\n${"─".repeat(70)}`);
  for (const s of summary) {
    console.log(`  ${s.url}\n    blocks: ${s.blocks}  types: ${s.types.join(", ") || "—"}`);
  }

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  console.log(`\n${"─".repeat(70)}\nISSUES: ${errors.length} error(s), ${warnings.length} warning(s)\n${"─".repeat(70)}`);

  if (errors.length === 0 && warnings.length === 0) {
    console.log("✅ All validated JSON-LD blocks pass Rich Results basic checks.\n");
  } else {
    for (const i of [...errors, ...warnings]) {
      const tag = i.severity === "error" ? "❌ ERROR  " : "⚠️  WARN   ";
      console.log(`${tag} ${i.url}\n           [block #${i.blockIndex} · ${i.type}] ${i.message}`);
    }
    console.log("");
  }

  console.log(`💡 For dynamic per-page JSON-LD that's injected by react-helmet-async,`);
  console.log(`   also test live URLs with Google's Rich Results Test:`);
  console.log(`   https://search.google.com/test/rich-results\n`);

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
