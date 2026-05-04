/**
 * Validates that the build-time generated `public/sitemap.xml` is:
 *   1. Well-formed XML
 *   2. A <sitemapindex> with the correct namespace
 *   3. Every <sitemap> entry has a valid <loc> (http(s) URL) and a
 *      <lastmod> in ISO YYYY-MM-DD form representing a real date.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";

const SITEMAP_PATH = resolve(process.cwd(), "public/sitemap.xml");
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe("public/sitemap.xml validity", () => {
  let xml: string;
  let doc: Document;

  beforeAll(() => {
    expect(existsSync(SITEMAP_PATH), "public/sitemap.xml must exist").toBe(true);
    xml = readFileSync(SITEMAP_PATH, "utf8");
    const dom = new JSDOM(xml, { contentType: "text/xml" });
    doc = dom.window.document;
  });

  it("is well-formed XML (no parser errors)", () => {
    expect(doc.getElementsByTagName("parsererror").length).toBe(0);
  });

  it("has a <sitemapindex> root with the sitemaps.org namespace", () => {
    const root = doc.documentElement;
    expect(root.nodeName).toBe("sitemapindex");
    expect(root.getAttribute("xmlns")).toBe(
      "http://www.sitemaps.org/schemas/sitemap/0.9"
    );
  });

  it("contains at least one <sitemap> entry", () => {
    expect(doc.getElementsByTagName("sitemap").length).toBeGreaterThan(0);
  });

  it("every <sitemap> has a valid <loc> URL and a valid <lastmod> date", () => {
    const entries = Array.from(doc.getElementsByTagName("sitemap"));
    for (const entry of entries) {
      const loc = entry.getElementsByTagName("loc")[0]?.textContent?.trim();
      const lastmod = entry.getElementsByTagName("lastmod")[0]?.textContent?.trim();

      expect(loc, "<loc> must exist").toBeTruthy();
      expect(() => new URL(loc!)).not.toThrow();
      expect(/^https?:\/\//.test(loc!)).toBe(true);

      expect(lastmod, "<lastmod> must exist").toBeTruthy();
      expect(ISO_DATE.test(lastmod!)).toBe(true);
      const d = new Date(lastmod!);
      expect(Number.isNaN(d.getTime())).toBe(false);
    }
  });

  it("has unique <loc> values across all sitemap entries", () => {
    const locs = Array.from(doc.getElementsByTagName("loc")).map(
      (n) => n.textContent?.trim() ?? ""
    );
    expect(new Set(locs).size).toBe(locs.length);
  });
});
