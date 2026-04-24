/**
 * Device search index for TechPlanetCatalog.
 *
 * For each catalog slug we precompute a weighted bag of searchable terms
 * pulled from:
 *   - device label (Ar + En)
 *   - parent category
 *   - cluster productKeywords (from taxonomy)
 *   - cluster specs / sizes (from taxonomy)
 *   - global brand list (filtered by relevance to the cluster keywords)
 *   - global use-case list (always available; ranked low so they don't dominate)
 *
 * `scoreDevice(slug, normalizedQuery)` returns a numeric relevance score.
 * Tokens are matched independently — multi-word queries (e.g. "لابتوب asus")
 * accumulate score across both a brand and a cluster.
 */

import { deviceCatalog } from "./deviceCatalog";
import { brands, clusters, useCases, getCluster } from "./deviceTaxonomy";
import { resolveDeviceHref } from "./deviceHref";

// Match the same normalization used inside TechPlanetCatalog.
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[-_]/g, " ")
    .trim();

type Weight = number;
type WeightedTerm = { term: string; weight: Weight };

/**
 * Field weights — higher weight wins ties when scoring.
 *  label   : strongest, the human-facing card title
 *  category: solid, broad bucket match
 *  brand   : strong when user types a brand name
 *  product : moderate (productKeywords from taxonomy)
 *  spec    : moderate (e.g. "144Hz", "RGB")
 *  size    : light (e.g. "15.6", "27")
 *  usecase : light, generic
 */
const W = {
  label: 12,
  labelEn: 9,
  category: 6,
  brand: 8,
  product: 5,
  spec: 4,
  size: 3,
  usecase: 3,
} as const;

// Map each catalog slug to its best-matching taxonomy cluster (mirrors deviceHref logic).
const ALIASES: Record<string, string> = {
  cpus: "pc-components",
  speakers: "headphones",
  cables: "chargers",
  "external-storage": "storage",
  "power-adapters": "chargers",
  accessories: "phone-cases",
  "smart-lighting": "intercoms",
  "office-supplies": "scanners",
  earbuds: "earbuds",
  printers: "all-in-one-printers",
  networking: "routers",
  televisions: "monitors",
  ups: "pc-components",
};

const clusterBySlug = new Map<string, ReturnType<typeof getCluster>>();
for (const c of clusters) clusterBySlug.set(c.slug, c);

function findClusterFor(slug: string) {
  const direct = clusterBySlug.get(slug);
  if (direct) return direct;
  const alias = ALIASES[slug];
  if (alias) return clusterBySlug.get(alias);
  return undefined;
}

interface DeviceSearchEntry {
  slug: string;
  /** Pre-normalized weighted terms — small, deduped per device. */
  terms: WeightedTerm[];
  /** Pre-normalized full label (for prefix boost). */
  labelN: string;
  /** Quick-access href to avoid recomputing per render. */
  href: string;
}

// Brand aliases (Arabic transliterations) — bridge English brand names with
// the Arabic spellings users actually type and that catalog keywords use.
const BRAND_ALIASES: Record<string, string[]> = {
  apple: ["ابل", "أبل", "ايفون", "ماك"],
  samsung: ["سامسونج", "سامسونغ", "جالاكسي"],
  asus: ["اسوس", "أسوس"],
  dell: ["ديل"],
  hp: ["اتش بي", "إتش بي"],
  lenovo: ["لينوفو"],
  msi: ["ام اس اي"],
  acer: ["ايسر", "أيسر"],
  xiaomi: ["شاومي", "ريدمي"],
  huawei: ["هواوي"],
  oppo: ["اوبو", "أوبو"],
  realme: ["ريلمي"],
  lg: ["ال جي"],
  sony: ["سوني"],
  microsoft: ["مايكروسوفت"],
  razer: ["ريزر"],
  logitech: ["لوجيتك"],
  jbl: ["جي بي ال"],
  anker: ["انكر", "أنكر"],
  canon: ["كانون"],
  epson: ["ابسون", "إبسون"],
  brother: ["برذر"],
};

const NORMALIZED_BRANDS = brands.map((b) => ({
  ...b,
  // All searchable forms for this brand: English label + Arabic aliases.
  forms: [normalize(b.labelAr), ...(BRAND_ALIASES[b.slug] ?? []).map(normalize)],
}));
const NORMALIZED_USECASES = useCases.map((u) => ({ ...u, n: normalize(u.labelAr) }));

function buildEntry(slug: string): DeviceSearchEntry {
  const dev = deviceCatalog[slug];
  const cluster = findClusterFor(slug);

  const terms: WeightedTerm[] = [];
  const seen = new Set<string>();
  const push = (raw: string, weight: Weight) => {
    const t = normalize(raw);
    if (!t) return;
    const key = `${t}|${weight}`;
    if (seen.has(key)) return;
    seen.add(key);
    terms.push({ term: t, weight });
  };

  // Label + category (always present)
  push(dev.labelAr, W.label);
  push(dev.labelEn, W.labelEn);
  push(dev.parentCategory, W.category);

  // Product keywords from the catalog entry (rich, hand-curated)
  for (const kw of dev.productKeywords) push(kw, W.product);

  // Cluster-derived terms
  if (cluster) {
    for (const kw of cluster.productKeywords) push(kw, W.product);
    if (cluster.singularAr) push(cluster.singularAr, W.label * 0.6);
    for (const sp of cluster.specs ?? []) push(sp.labelAr, W.spec);
    for (const sz of cluster.sizes ?? []) push(sz.labelAr, W.size);

    // Brand attachment: if any brand form (English or Arabic alias) appears
    // in cluster/catalog keywords or labels, register all forms of that brand
    // so users can search by either spelling ("asus" or "اسوس").
    const haystack = [
      ...cluster.productKeywords,
      ...dev.productKeywords,
      dev.labelAr,
      dev.labelEn,
    ]
      .map(normalize)
      .join(" ");
    for (const b of NORMALIZED_BRANDS) {
      const matched = b.forms.some((f) => f && haystack.includes(f));
      if (!matched) continue;
      // Register both the canonical English label and every Arabic alias.
      push(b.labelAr, W.brand);
      for (const alias of BRAND_ALIASES[b.slug] ?? []) push(alias, W.brand);
    }
  }

  // Use-cases: only the ones that map naturally to this device (light weight).
  // We tag every device with all use-cases so that "للجيمنج" surfaces sensible
  // hits, then rely on label/category weights to rank inherently gaming-y
  // entries higher.
  for (const u of NORMALIZED_USECASES) push(u.labelAr, W.usecase);

  return {
    slug,
    terms,
    labelN: normalize(dev.labelAr),
    href: resolveDeviceHref(slug),
  };
}

/** Index built once at module load; ~44 entries × ~30 terms each — tiny. */
const INDEX: Record<string, DeviceSearchEntry> = {};
for (const slug of Object.keys(deviceCatalog)) {
  INDEX[slug] = buildEntry(slug);
}

/**
 * Tokenize a normalized query into meaningful tokens.
 * Drops 1-char tokens (too noisy for Arabic search).
 */
export function tokenizeQuery(q: string): string[] {
  const n = normalize(q);
  if (!n) return [];
  return n
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

/**
 * Score a single device against pre-tokenized query tokens.
 * Returns 0 when nothing matches.
 *
 * Scoring model:
 *   - For each token, sum the highest weight of any term that contains it.
 *   - Bonus: exact label match (+25), label prefix match (+10).
 *   - Multi-token coverage bonus: requires ≥2 distinct fields to match
 *     to avoid one-word brand spam dominating unrelated devices.
 */
export function scoreDevice(slug: string, tokens: string[]): number {
  if (tokens.length === 0) return 1; // empty query → keep everything
  const entry = INDEX[slug];
  if (!entry) return 0;

  let total = 0;
  let matchedTokens = 0;

  for (const tok of tokens) {
    let bestForToken = 0;
    for (const { term, weight } of entry.terms) {
      if (!term.includes(tok)) continue;
      // Boost exact term equality
      const hit = term === tok ? weight * 1.4 : weight;
      if (hit > bestForToken) bestForToken = hit;
    }
    if (bestForToken > 0) {
      total += bestForToken;
      matchedTokens += 1;
    }
  }

  if (matchedTokens === 0) return 0;

  // Require all tokens to match for multi-token queries (AND semantics).
  if (matchedTokens < tokens.length) {
    // Allow partial match but heavily penalize so it sinks below full matches.
    total *= matchedTokens / tokens.length;
    total *= 0.4;
  }

  // Label-level boosts on the joined query
  const joined = tokens.join(" ");
  if (entry.labelN === joined) total += 25;
  else if (entry.labelN.startsWith(joined)) total += 10;
  else if (entry.labelN.includes(joined)) total += 4;

  return total;
}

/** Convenience: rank an array of slugs against a query. */
export function rankSlugs(slugs: string[], query: string): { slug: string; score: number }[] {
  const tokens = tokenizeQuery(query);
  return slugs
    .map((slug) => ({ slug, score: scoreDevice(slug, tokens) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
