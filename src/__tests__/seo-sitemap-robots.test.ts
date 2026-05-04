import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "../..");
const robots = readFileSync(resolve(root, "public/robots.txt"), "utf8");
const sitemapIndex = readFileSync(resolve(root, "public/sitemap.xml"), "utf8");
const sitemapMain = readFileSync(resolve(root, "public/sitemap-main.xml"), "utf8");
const sitemapDevices = readFileSync(resolve(root, "public/sitemap-devices.xml"), "utf8");
const appTsx = readFileSync(resolve(root, "src/App.tsx"), "utf8");

// Core public routes that MUST be discoverable
const CORE_PUBLIC_ROUTES = [
  "/",
  "/stores",
  "/products",
  "/map",
  "/leasing",
  "/about",
  "/contact",
  "/blog",
  "/faq",
  "/join-marketplace",
  "/opening-day",
  "/spin-win",
  "/daily-deals",
  "/new-cairo-branch",
  "/downtown-branch",
  "/downtown-directory",
  "/devices",
  "/market-echo",
  "/tech-planet",
  "/kz",
  "/privacy",
  "/terms",
  "/reward-terms",
];

// Routes that must be excluded from public crawling
const PRIVATE_ROUTES = ["/admin", "/spin-win/claim", "/spin-win/account", "/kz/cart"];

function extractRoutePaths(src: string): string[] {
  const re = /<Route\s+path="([^"]+)"/g;
  const out: string[] = [];
  let m;
  while ((m = re.exec(src))) out.push(m[1]);
  return out;
}

const declaredRoutes = extractRoutePaths(appTsx);

describe("robots.txt", () => {
  it("declares User-agent and Sitemap directives", () => {
    expect(robots).toMatch(/User-agent:\s*\*/);
    expect(robots).toMatch(/Sitemap:\s*https?:\/\/\S+sitemap\.xml/i);
  });

  it("allows all core public routes", () => {
    for (const r of CORE_PUBLIC_ROUTES) {
      expect(
        robots.includes(`Allow: ${r}\n`) || robots.includes(`Allow: ${r}\r`),
        `robots.txt missing Allow for ${r}`
      ).toBe(true);
    }
  });

  it("disallows admin and internal routes", () => {
    for (const r of PRIVATE_ROUTES) {
      expect(robots.includes(`Disallow: ${r}`), `robots.txt missing Disallow for ${r}`).toBe(true);
    }
  });

  it("blocks AI training crawlers", () => {
    for (const bot of ["GPTBot", "CCBot", "anthropic-ai", "Google-Extended"]) {
      expect(robots).toContain(`User-agent: ${bot}`);
    }
  });

  it("only references Allow paths that exist as routes in App.tsx", () => {
    const allowed = [...robots.matchAll(/^Allow:\s*(\S+)/gm)].map((m) => m[1]);
    for (const path of allowed) {
      if (path === "/") {
        expect(declaredRoutes).toContain("/");
        continue;
      }
      // Strip trailing slash for prefix matches like /stores/category/
      const normalized = path.replace(/\/$/, "");
      const matches = declaredRoutes.some(
        (r) => r === normalized || r.startsWith(normalized + "/") || r.startsWith(normalized + ":")
      );
      expect(matches, `robots Allow ${path} has no matching route in App.tsx`).toBe(true);
    }
  });
});

describe("sitemap.xml (static)", () => {
  it("is a valid sitemap index or urlset", () => {
    expect(sitemapIndex).toMatch(/<\?xml/);
    expect(sitemapIndex).toMatch(/<(sitemapindex|urlset)/);
  });

  it("references the main and devices sub-sitemaps", () => {
    expect(sitemapIndex).toContain("sitemap-main.xml");
    expect(sitemapIndex).toContain("sitemap-devices.xml");
  });
});

describe("sitemap-main.xml content", () => {
  const locs = [...sitemapMain.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const paths = locs
    .map((u) => {
      try {
        return new URL(u).pathname;
      } catch {
        return u;
      }
    });

  it("contains all core public routes", () => {
    for (const r of CORE_PUBLIC_ROUTES) {
      const expected = r === "/" ? "/" : r;
      expect(paths.includes(expected), `sitemap-main missing ${r}`).toBe(true);
    }
  });

  it("does not expose admin or private routes", () => {
    for (const r of PRIVATE_ROUTES) {
      expect(paths.some((p) => p.startsWith(r))).toBe(false);
    }
  });

  it("every URL maps to a real route in App.tsx", () => {
    for (const p of paths) {
      if (p === "/") {
        expect(declaredRoutes).toContain("/");
        continue;
      }
      const matches = declaredRoutes.some((r) => {
        if (r === p) return true;
        // Match dynamic segments: /stores/:slug matches /stores/anything
        const pattern = "^" + r.replace(/:[^/]+/g, "[^/]+") + "$";
        return new RegExp(pattern).test(p);
      });
      expect(matches, `sitemap path ${p} has no matching route`).toBe(true);
    }
  });
});

describe("sitemap-devices.xml", () => {
  it("contains device pillar entries under /devices/", () => {
    const locs = [...sitemapDevices.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(0);
    expect(locs.every((u) => u.includes("/devices/"))).toBe(true);
  });
});
