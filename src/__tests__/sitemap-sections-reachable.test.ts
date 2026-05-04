/**
 * For every <sitemap><loc> entry in public/sitemap.xml, fetch the URL
 * and assert HTTP 200 with valid XML (no parser errors).
 */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";

const SITEMAP_PATH = resolve(process.cwd(), "public/sitemap.xml");

function extractLocs(xml: string): string[] {
  const dom = new JSDOM(xml, { contentType: "text/xml" });
  const nodes = Array.from(dom.window.document.getElementsByTagName("loc")) as Element[];
  return nodes.map((n) => n.textContent?.trim() ?? "").filter(Boolean);
}

describe("edge sitemap section URLs (from public/sitemap.xml)", () => {
  let urls: string[] = [];

  beforeAll(() => {
    urls = extractLocs(readFileSync(SITEMAP_PATH, "utf8"));
    expect(urls.length).toBeGreaterThan(0);
  });

  it("each section returns HTTP 200 with valid XML", async () => {
    const results = await Promise.all(
      urls.map(async (url) => {
        const res = await fetch(url, { headers: { Accept: "application/xml" } });
        const body = await res.text();
        const dom = new JSDOM(body, { contentType: "text/xml" });
        const parserErrors = dom.window.document.getElementsByTagName("parsererror").length;
        return { url, status: res.status, parserErrors, length: body.length };
      })
    );

    const failures = results.filter(
      (r) => r.status !== 200 || r.parserErrors > 0 || r.length === 0
    );
    expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
  }, 60_000);
});
