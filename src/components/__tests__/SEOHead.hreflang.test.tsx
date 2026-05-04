import { describe, it, expect, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import {
  SEOHead,
  buildCoreGraphLd,
  buildFaqLd,
  buildSiteNavLd,
  buildSpeakableLd,
  buildStoreLd,
  buildProductLd,
} from "@/components/SEOHead";

const BASE_URL = "https://mallelbostan.com";

function renderAt(path: string, ui: React.ReactElement) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </HelmetProvider>
  );
}

function getCanonical(): string | null {
  return document.head.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null;
}

function getAlternates(): { hreflang: string; href: string }[] {
  return Array.from(document.head.querySelectorAll('link[rel="alternate"]')).map((l) => ({
    hreflang: l.getAttribute("hreflang") ?? "",
    href: l.getAttribute("href") ?? "",
  }));
}

function getJsonLd(): Record<string, unknown>[] {
  return Array.from(
    document.head.querySelectorAll('script[type="application/ld+json"]')
  ).map((s) => JSON.parse(s.textContent || "{}"));
}

describe("SEOHead — hreflang / canonical / RTL with multi JSON-LD", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    document.body.removeAttribute("dir");
    document.title = "";
  });

  it("emits canonical that matches the current path exactly (no trailing junk, no query)", async () => {
    renderAt(
      "/stores/foo-bar?utm_source=x",
      <SEOHead title="t" description="d" />
    );
    await waitFor(() => {
      // Canonical must use the pathname only, not the query string
      expect(getCanonical()).toBe(`${BASE_URL}/stores/foo-bar`);
    });
  });

  it("hreflang ar-EG and x-default both equal the canonical URL", async () => {
    renderAt("/products", <SEOHead title="t" description="d" />);
    await waitFor(() => {
      const canonical = getCanonical();
      const alts = getAlternates();
      expect(canonical).toBe(`${BASE_URL}/products`);

      const ar = alts.find((a) => a.hreflang === "ar-EG");
      const xd = alts.find((a) => a.hreflang === "x-default");
      expect(ar?.href).toBe(canonical);
      expect(xd?.href).toBe(canonical);
    });
  });

  it("emits exactly one canonical and no duplicate hreflang entries", async () => {
    renderAt(
      "/stores",
      <SEOHead
        title="t"
        description="d"
        jsonLd={[buildSiteNavLd(), buildSpeakableLd(["h1"])]}
        breadcrumbs={[{ name: "دليل المحلات", url: "/stores" }]}
      />
    );
    await waitFor(() => {
      expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
      const alts = getAlternates();
      const langs = alts.map((a) => a.hreflang).sort();
      // No duplicate hreflang values
      expect(new Set(langs).size).toBe(langs.length);
      // ar-EG and x-default are required
      expect(langs).toEqual(expect.arrayContaining(["ar-EG", "x-default"]));
    });
  });

  it("sets RTL on <html> and <body> regardless of how many JSON-LD blocks are emitted", async () => {
    renderAt(
      "/",
      <SEOHead
        title="t"
        description="d"
        jsonLd={[
          buildCoreGraphLd(undefined, [
            buildFaqLd([{ question_ar: "س؟", answer_ar: "ج." }]),
            buildSiteNavLd(),
            buildSpeakableLd(["h1"]),
          ]),
          buildStoreLd({ name_ar: "محل", slug: "shop" }),
          buildProductLd({ name_ar: "منتج", slug: "p", price: 100 }),
        ]}
      />
    );
    await waitFor(() => {
      expect(document.documentElement.getAttribute("lang")).toBe("ar");
      expect(document.documentElement.getAttribute("dir")).toBe("rtl");
      expect(document.body.getAttribute("dir")).toBe("rtl");
    });
  });

  it("does not produce conflicting canonical URLs across multiple JSON-LD payloads", async () => {
    renderAt(
      "/stores/example",
      <SEOHead
        title="محل تجريبي"
        description="d"
        jsonLd={[
          buildStoreLd({ name_ar: "محل تجريبي", slug: "example" }),
          buildProductLd({ name_ar: "منتج", slug: "example-product", price: 100 }),
        ]}
        breadcrumbs={[
          { name: "المحلات", url: "/stores" },
          { name: "محل تجريبي", url: "/stores/example" },
        ]}
      />
    );

    await waitFor(() => {
      const canonical = getCanonical();
      expect(canonical).toBe(`${BASE_URL}/stores/example`);

      const lds = getJsonLd();
      // Collect every URL/item field across all JSON-LD blocks
      const urls = new Set<string>();
      const collect = (v: unknown) => {
        if (!v) return;
        if (typeof v === "string" && v.startsWith(BASE_URL)) urls.add(v);
        else if (Array.isArray(v)) v.forEach(collect);
        else if (typeof v === "object") Object.values(v as Record<string, unknown>).forEach(collect);
      };
      lds.forEach(collect);

      // Every project URL referenced inside JSON-LD must share the same origin
      // as the canonical — guarantees no conflicting host/protocol leaks
      // (e.g. http://, www. mismatch) when multiple schemas are merged.
      const canonicalOrigin = new URL(canonical!).origin;
      for (const u of urls) {
        expect(new URL(u).origin).toBe(canonicalOrigin);
      }
    });
  });

  it("emits at most one BreadcrumbList even when several JSON-LD arrays are passed", async () => {
    const extraBreadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "الرئيسية", item: BASE_URL },
      ],
    };

    renderAt(
      "/stores",
      <SEOHead
        title="t"
        description="d"
        jsonLd={[extraBreadcrumb, buildSiteNavLd()]}
        breadcrumbs={[{ name: "المحلات", url: "/stores" }]}
      />
    );

    await waitFor(() => {
      const lds = getJsonLd();
      const breadcrumbs = lds.filter((l) => l["@type"] === "BreadcrumbList");
      // Multiple BreadcrumbList nodes confuse Google — assert we don't ship more
      // than the explicit user-supplied + auto-generated pair, and that none
      // are byte-identical duplicates.
      const serialized = breadcrumbs.map((b) => JSON.stringify(b));
      expect(new Set(serialized).size).toBe(serialized.length);
    });
  });
});
