import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "../..");
const robots = readFileSync(resolve(root, "public/robots.txt"), "utf8");
const sitemapIndex = readFileSync(resolve(root, "public/sitemap.xml"), "utf8");
const sitemapEdgeSrc = readFileSync(
  resolve(root, "supabase/functions/sitemap/index.ts"),
  "utf8"
);
const robotsEdgeSrc = readFileSync(
  resolve(root, "supabase/functions/robots/index.ts"),
  "utf8"
);
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
  
  "/market-echo",
  "/tech-planet",
  "/kz",
  "/privacy",
  "/terms",
  "/reward-terms",
];

// Routes that must be excluded from public crawling
const PRIVATE_ROUTES = ["/admin", "/spin-win/claim", "/spin-win/account", "/kz/cart"];

const REQUIRED_SECTIONS = [
  "pages",
  "stores",
  "products",
  "blog",
];

function extractRoutePaths(src: string): string[] {
  const re = /<Route\s+path="([^"]+)"/g;
  const out: string[] = [];
  let m;
  while ((m = re.exec(src))) out.push(m[1]);
  return out;
}

function extractStaticRoutes(src: string): string[] {
  // Pull `loc: "/..."` tokens from STATIC_ROUTES array
  const block = src.match(/STATIC_ROUTES\s*=\s*\[([\s\S]*?)\];/);
  if (!block) return [];
  return [...block[1].matchAll(/loc:\s*"([^"]+)"/g)].map((m) => m[1]);
}

const declaredRoutes = extractRoutePaths(appTsx);
const staticRoutes = extractStaticRoutes(sitemapEdgeSrc);

function routeMatches(declared: string[], path: string): boolean {
  if (path === "/") return declared.includes("/");
  return declared.some((r) => {
    if (r === path) return true;
    if (!r.includes(":")) return false;
    const pattern = "^" + r.replace(/:[^/]+/g, "[^/]+") + "$";
    return new RegExp(pattern).test(path);
  });
}

describe("robots.txt (static)", () => {
  it("declares User-agent and Sitemap directives", () => {
    expect(robots).toMatch(/User-agent:\s*\*/);
    expect(robots).toMatch(/Sitemap:\s*https?:\/\/\S+sitemap\.xml/i);
  });

  it("allows all core public routes", () => {
    for (const r of CORE_PUBLIC_ROUTES) {
      expect(robots, `robots.txt missing Allow for ${r}`).toMatch(
        new RegExp(`Allow:\\s*${r.replace(/\//g, "\\/")}\\b`)
      );
    }
  });

  it("disallows admin and internal routes", () => {
    for (const r of PRIVATE_ROUTES) {
      expect(robots.includes(`Disallow: ${r}`)).toBe(true);
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
      const normalized = path === "/" ? "/" : path.replace(/\/$/, "");
      const matches =
        normalized === "/"
          ? declaredRoutes.includes("/")
          : declaredRoutes.some(
              (r) =>
                r === normalized ||
                r.startsWith(normalized + "/") ||
                r.startsWith(normalized + ":")
            );
      expect(matches, `robots Allow ${path} has no matching route in App.tsx`).toBe(true);
    }
  });
});

describe("robots edge function", () => {
  it("references the same core routes as the static fallback", () => {
    for (const r of CORE_PUBLIC_ROUTES) {
      expect(robotsEdgeSrc, `edge robots missing ${r}`).toMatch(
        new RegExp(`["']${r.replace(/\//g, "\\/")}["']`)
      );
    }
  });

  it("emits a Sitemap directive", () => {
    expect(robotsEdgeSrc).toMatch(/Sitemap:\s*\$\{/);
  });
});

describe("sitemap.xml index (static)", () => {
  it("is a valid sitemap index", () => {
    expect(sitemapIndex).toMatch(/<\?xml/);
    expect(sitemapIndex).toMatch(/<sitemapindex/);
  });

  it("references all required dynamic sub-sitemap sections", () => {
    for (const section of REQUIRED_SECTIONS) {
      expect(
        sitemapIndex.includes(`section=${section}`),
        `sitemap.xml missing reference to section=${section}`
      ).toBe(true);
    }
  });

  it("points to the dynamic edge function", () => {
    expect(sitemapIndex).toContain("functions/v1/sitemap");
  });
});

describe("sitemap edge function STATIC_ROUTES", () => {
  it("has been parsed", () => {
    expect(staticRoutes.length).toBeGreaterThan(10);
  });

  it("contains every core public route", () => {
    for (const r of CORE_PUBLIC_ROUTES) {
      expect(staticRoutes.includes(r), `STATIC_ROUTES missing ${r}`).toBe(true);
    }
  });

  it("does not expose admin or private routes", () => {
    for (const r of PRIVATE_ROUTES) {
      expect(staticRoutes.some((p) => p.startsWith(r))).toBe(false);
    }
  });

  it("every STATIC_ROUTES entry maps to a real route in App.tsx", () => {
    for (const p of staticRoutes) {
      expect(routeMatches(declaredRoutes, p), `sitemap path ${p} has no matching route`).toBe(true);
    }
  });
});
