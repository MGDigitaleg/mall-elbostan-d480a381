import { describe, it, expect } from "vitest";

const SITEMAP_URL =
  "https://wrheltmgquyqqhscrpds.supabase.co/functions/v1/sitemap?section=images";

const PUBLIC_BASE = "https://mallelbostan.com";
const FETCH_TIMEOUT_MS = 15_000;
const IMAGE_TIMEOUT_MS = 10_000;
const MAX_CONCURRENCY = 8;

function resolveUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${PUBLIC_BASE}${value}`;
  return value;
}

function isValidHttpsUrl(value: string): boolean {
  try {
    const u = new URL(resolveUrl(value));
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeout = IMAGE_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal, redirect: "follow" });
  } finally {
    clearTimeout(t);
  }
}

async function checkImage(url: string): Promise<{ url: string; status: number; ok: boolean }> {
  try {
    let res = await fetchWithTimeout(url, { method: "HEAD" });
    // Some CDNs (Unsplash, Supabase Storage) reject HEAD or return 405/403 — fall back to a tiny GET
    if (res.status === 405 || res.status === 403 || res.status === 400) {
      res = await fetchWithTimeout(url, { method: "GET", headers: { Range: "bytes=0-0" } });
    }
    return { url, status: res.status, ok: res.status >= 200 && res.status < 400 };
  } catch {
    return { url, status: 0, ok: false };
  }
}

async function runWithConcurrency<T, R>(items: T[], limit: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return results;
}

function extractImageLocs(xml: string): string[] {
  const out: string[] = [];
  const re = /<image:loc>([^<]+)<\/image:loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) out.push(m[1].trim());
  return out;
}

describe("sitemap images section — URL validity & HTTP reachability", () => {
  it(
    "returns 200 with image entries containing valid URLs that resolve successfully",
    async () => {
      const res = await fetchWithTimeout(SITEMAP_URL, { method: "GET" }, FETCH_TIMEOUT_MS);
      expect(res.status).toBe(200);
      const xml = await res.text();

      // Sanity: correct namespace + structure
      expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
      expect(xml).toContain("<urlset");
      expect(xml).toContain("<image:image>");

      const imageUrls = extractImageLocs(xml);
      expect(imageUrls.length).toBeGreaterThan(0);

      // 1) Every image URL must be syntactically valid http(s) and not contain raw whitespace/entities-broken
      const invalid = imageUrls.filter((u) => !isValidHttpsUrl(u));
      expect(invalid, `Invalid image URLs: ${invalid.join(", ")}`).toEqual([]);

      // 2) No duplicates within the images sitemap section
      const dupes = imageUrls.filter((u, idx) => imageUrls.indexOf(u) !== idx);
      expect(dupes, `Duplicate image URLs: ${[...new Set(dupes)].join(", ")}`).toEqual([]);

      // 3) Every image URL must respond with 2xx/3xx (no 404/500)
      const checks = await runWithConcurrency(imageUrls, MAX_CONCURRENCY, checkImage);
      const failures = checks.filter((c) => !c.ok);
      expect(
        failures,
        `Unreachable image URLs:\n${failures.map((f) => `  ${f.status} ${f.url}`).join("\n")}`
      ).toEqual([]);
    },
    120_000
  );
});
