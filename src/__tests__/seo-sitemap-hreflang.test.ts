import { describe, it, expect } from "vitest";

const BASE = "https://wrheltmgquyqqhscrpds.supabase.co/functions/v1/sitemap";
const FETCH_TIMEOUT_MS = 20_000;

// Sections that represent crawlable pages → MUST include hreflang alternates
const PAGE_SECTIONS = ["pages", "categories", "devices", "stores", "products", "blog", "news", "offers"];
// Aggregated image-only section deliberately omits hreflang (media discovery)
const MEDIA_SECTIONS = ["images"];

const HREFLANGS_REQUIRED = ["ar-EG", "x-default"];

async function fetchText(url: string): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    expect(res.status, `Expected 200 from ${url}`).toBe(200);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

interface UrlEntry {
  loc: string;
  alternates: { hreflang: string; href: string }[];
}

function parseUrlEntries(xml: string): UrlEntry[] {
  const entries: UrlEntry[] = [];
  const urlRe = /<url>([\s\S]*?)<\/url>/g;
  let m: RegExpExecArray | null;
  while ((m = urlRe.exec(xml))) {
    const block = m[1];
    const loc = /<loc>([^<]+)<\/loc>/.exec(block)?.[1].trim() ?? "";
    const alternates: UrlEntry["alternates"] = [];
    const altRe = /<xhtml:link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"\s*\/>/g;
    let am: RegExpExecArray | null;
    while ((am = altRe.exec(block))) {
      alternates.push({ hreflang: am[1], href: am[2] });
    }
    entries.push({ loc, alternates });
  }
  return entries;
}

describe("sitemap hreflang — multilingual alternates", () => {
  it.each(PAGE_SECTIONS)(
    "section '%s' includes ar-EG + x-default hreflang matching the page URL",
    async (section) => {
      const xml = await fetchText(`${BASE}?section=${section}`);

      // Namespace must be declared
      expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');

      const entries = parseUrlEntries(xml);
      // section may be empty (e.g., news) — only enforce when entries exist
      if (entries.length === 0) return;

      const violations: string[] = [];
      for (const entry of entries) {
        const tags = entry.alternates.map((a) => a.hreflang);

        for (const required of HREFLANGS_REQUIRED) {
          if (!tags.includes(required)) {
            violations.push(`${entry.loc} missing hreflang="${required}"`);
          }
        }

        // Each alternate href must exactly match the entry's <loc>
        // (project is single-language ar-EG; both alternates point to same URL)
        for (const alt of entry.alternates) {
          if (alt.href !== entry.loc) {
            violations.push(
              `${entry.loc} hreflang="${alt.hreflang}" → href mismatch (${alt.href})`
            );
          }
        }

        // No duplicate hreflang values per URL
        const dup = tags.filter((t, i) => tags.indexOf(t) !== i);
        if (dup.length) violations.push(`${entry.loc} duplicate hreflang: ${dup.join(",")}`);
      }

      expect(violations, `\n  - ${violations.join("\n  - ")}`).toEqual([]);
    },
    60_000
  );

  it.each(MEDIA_SECTIONS)(
    "media-only section '%s' intentionally omits hreflang alternates",
    async (section) => {
      const xml = await fetchText(`${BASE}?section=${section}`);
      const entries = parseUrlEntries(xml);
      if (entries.length === 0) return;
      const withAlt = entries.filter((e) => e.alternates.length > 0);
      expect(withAlt, `Media section '${section}' should not emit hreflang`).toEqual([]);
    },
    60_000
  );
});
