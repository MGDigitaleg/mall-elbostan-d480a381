/**
 * SEO derivation for the TechPlanetCatalog filter state on /tech-planet.
 *
 * The catalog uses query params (?tp=inner&q=laptop) which search engines
 * normally collapse to the canonical /tech-planet URL. We still enrich the
 * <title>, <meta description>, breadcrumbs and JSON-LD per active state so
 * that:
 *   - Users sharing a filtered URL see meaningful previews.
 *   - The page advertises its full taxonomic surface to crawlers via
 *     ItemList JSON-LD that mirrors the visible results.
 *   - Internal navigation breadcrumbs always reflect "where am I now".
 *
 * The canonical (set by SEOHead from location.pathname) intentionally
 * excludes the query string — Google treats /tech-planet as the single
 * indexable URL while we vary the on-page experience.
 */

import { tokenizeQuery, scoreDevice } from "./deviceSearchIndex";
import { resolveDeviceHref } from "./deviceHref";

// Public site origin — overridable per environment via VITE_PUBLIC_SITE_URL.
const BASE_URL = (import.meta.env.VITE_PUBLIC_SITE_URL ?? "https://mallelbostan.com").replace(/\/+$/, "");

export type OrbitKey = "all" | "inner" | "middle" | "outer";

export const ORBIT_LABELS_AR: Record<OrbitKey, string> = {
  all: "كل الفئات",
  inner: "المدار الداخلي",
  middle: "المدار الأوسط",
  outer: "المدار الخارجي",
};

const ORBIT_INTRO_AR: Record<OrbitKey, string> = {
  all: "كل فئات الأجهزة في مول البستان منظَّمة في كوكب تفاعلي واحد.",
  inner: "الفئات الأكثر طلباً: لابتوبات، هواتف، شاشات، سماعات وملحقات أساسية.",
  middle: "فئات متخصصة: تخزين، تجميع PC، شبكات منزلية، طابعات، وكاميرات.",
  outer: "فئات احترافية: سيرفرات، مراقبة، بروجكتورات، صيانة، وحلول الشركات.",
};

export interface CatalogDeviceLite {
  slug: string;
  label: string;
  ring: Exclude<OrbitKey, "all">;
}

export interface TechPlanetSeoState {
  orbit: OrbitKey;
  query: string;
  /** All devices currently visible (already filtered + ranked by the catalog). */
  results: CatalogDeviceLite[];
  /** Total devices in the catalog (used in counts). */
  totalCount: number;
}

export interface TechPlanetSeoOutput {
  title: string;
  description: string;
  keywords: string;
  /** Visible H1 / sub-title on the page (mirrors title intent). */
  h1: string;
  /** Breadcrumb crumbs in the SEOHead format (relative URLs). */
  breadcrumbs: { name: string; url: string }[];
  /** Visible breadcrumb pieces beyond "Home › كوكب البستان". */
  visibleCrumbs: { label: string; href?: string }[];
  /** Combined JSON-LD payload (ItemList + WebPage + optional SearchResultsPage). */
  jsonLd: Record<string, unknown>[];
  /**
   * Canonical override. We always point to the bare /tech-planet to
   * consolidate ranking signals — never the filtered URL.
   */
  canonicalPath: string;
}

const orbitLabel = (k: OrbitKey) => ORBIT_LABELS_AR[k];

/** Build the SEO payload for the current filter state. */
export function buildTechPlanetSeo(state: TechPlanetSeoState): TechPlanetSeoOutput {
  const { orbit, query, results, totalCount } = state;
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const isFiltered = orbit !== "all" || hasQuery;

  // ── Title / description / H1 ────────────────────────────────────────────
  let title: string;
  let description: string;
  let h1: string;

  if (hasQuery && orbit !== "all") {
    title = `نتائج "${trimmedQuery}" في ${orbitLabel(orbit)} — كوكب البستان`;
    description = `نتائج البحث عن "${trimmedQuery}" داخل ${orbitLabel(orbit)} في كوكب البستان: ${results.length} جهاز وفئة مرتبطة في مول البستان، التجمع الخامس، القاهرة الجديدة.`;
    h1 = `"${trimmedQuery}" في ${orbitLabel(orbit)}`;
  } else if (hasQuery) {
    title = `بحث "${trimmedQuery}" — كوكب البستان`;
    description = `${results.length} نتيجة لـ "${trimmedQuery}" في كوكب البستان: لابتوبات، هواتف، جيمنج، شبكات، طباعة وصيانة في مول البستان بالقاهرة الجديدة.`;
    h1 = `نتائج البحث عن "${trimmedQuery}"`;
  } else if (orbit !== "all") {
    title = `${orbitLabel(orbit)} — كوكب البستان`;
    description = `${ORBIT_INTRO_AR[orbit]} استعرض ${results.length} فئة جهاز في كوكب البستان داخل مول البستان، التجمع الخامس.`;
    h1 = orbitLabel(orbit);
  } else {
    title = "كوكب البستان — كل التقنية في مدار واحد";
    description = `كوكب البستان: ${totalCount} فئة جهاز موزّعة على ثلاثة مدارات تفاعلية، تربطك بكل محلات التقنية في مول البستان بالقاهرة الجديدة.`;
    h1 = "كوكب البستان";
  }

  // ── Keywords (light, derived from active state) ─────────────────────────
  const keywordPool = [
    "كوكب البستان",
    "مول البستان",
    "التجمع الخامس",
    "القاهرة الجديدة",
    isFiltered ? orbitLabel(orbit) : "أجهزة تقنية",
    ...results.slice(0, 8).map((d) => d.label),
    ...(hasQuery ? [trimmedQuery] : []),
  ];
  const keywords = Array.from(new Set(keywordPool)).filter(Boolean).join(", ");

  // ── Breadcrumbs ─────────────────────────────────────────────────────────
  // SEOHead automatically prepends "الرئيسية", so we only add the rest.
  const breadcrumbs: { name: string; url: string }[] = [
    { name: "كوكب البستان", url: "/tech-planet" },
  ];
  const visibleCrumbs: { label: string; href?: string }[] = [];

  if (orbit !== "all") {
    const orbitPath = `/tech-planet?tp=${orbit}`;
    breadcrumbs.push({ name: orbitLabel(orbit), url: orbitPath });
    visibleCrumbs.push({ label: orbitLabel(orbit), href: hasQuery ? orbitPath : undefined });
  }
  if (hasQuery) {
    visibleCrumbs.push({ label: `بحث: ${trimmedQuery}` });
  }

  // ── JSON-LD ─────────────────────────────────────────────────────────────
  const canonicalPath = "/tech-planet"; // never the filtered URL
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;

  const itemListLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description,
    numberOfItems: results.length,
    inLanguage: "ar-EG",
    itemListOrder: hasQuery ? "https://schema.org/ItemListOrderDescending" : "https://schema.org/ItemListUnordered",
    itemListElement: results.slice(0, 30).map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}${resolveDeviceHref(d.slug)}`,
      name: d.label,
    })),
  };

  // CollectionPage anchors the SEO entity for the filtered view.
  const collectionLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: canonicalUrl, // canonical, not filtered
    inLanguage: "ar-EG",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: {
      "@type": "Thing",
      name: isFiltered ? h1 : "كوكب البستان — فئات الأجهزة",
    },
    mainEntity: { "@id": `${canonicalUrl}#device-list` },
  };
  itemListLd["@id"] = `${canonicalUrl}#device-list`;

  const jsonLd: Record<string, unknown>[] = [collectionLd, itemListLd];

  // SearchAction-style payload for query state — describes the search surface
  // to crawlers (Google's sitelinks search box).
  if (hasQuery) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "SearchResultsPage",
      url: canonicalUrl,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: results.length,
        itemListElement: results.slice(0, 10).map((d, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: d.label,
          url: `${BASE_URL}${resolveDeviceHref(d.slug)}`,
        })),
      },
    });
  }

  return {
    title,
    description,
    keywords,
    h1,
    breadcrumbs,
    visibleCrumbs,
    jsonLd,
    canonicalPath,
  };
}

// Re-exports so consumers can compute a fast tokenized score without an extra import.
export { tokenizeQuery, scoreDevice };
