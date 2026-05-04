import { describe, it, expect, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SEOHead } from "@/components/SEOHead";

const BASE_URL = "https://mallelbostan.com";

function renderAt(path: string, ui: React.ReactElement) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </HelmetProvider>
  );
}

function getJsonLd(): Record<string, unknown>[] {
  return Array.from(
    document.head.querySelectorAll('script[type="application/ld+json"]')
  ).map((s) => JSON.parse(s.textContent || "{}"));
}

describe("SEOHead", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("auto-generates BreadcrumbList JSON-LD with home as first item", async () => {
    renderAt(
      "/stores",
      <SEOHead
        title="دليل المحلات"
        description="d"
        breadcrumbs={[{ name: "دليل المحلات", url: "/stores" }]}
      />
    );

    await waitFor(() => {
      const lds = getJsonLd();
      const bc = lds.find((l) => l["@type"] === "BreadcrumbList") as
        | { itemListElement: Array<Record<string, unknown>> }
        | undefined;
      expect(bc).toBeDefined();
      expect(bc!.itemListElement).toHaveLength(2);
      expect(bc!.itemListElement[0]).toMatchObject({
        position: 1,
        name: "الرئيسية",
        item: BASE_URL,
      });
      expect(bc!.itemListElement[1]).toMatchObject({
        position: 2,
        name: "دليل المحلات",
        item: `${BASE_URL}/stores`,
      });
    });
  });

  it("supports nested breadcrumbs", async () => {
    renderAt(
      "/stores/foo",
      <SEOHead
        title="t"
        description="d"
        breadcrumbs={[
          { name: "دليل المحلات", url: "/stores" },
          { name: "محل", url: "/stores/foo" },
        ]}
      />
    );

    await waitFor(() => {
      const bc = getJsonLd().find((l) => l["@type"] === "BreadcrumbList") as
        | { itemListElement: Array<Record<string, unknown>> }
        | undefined;
      expect(bc!.itemListElement).toHaveLength(3);
      expect(bc!.itemListElement[2]).toMatchObject({ position: 3, name: "محل" });
    });
  });

  it("merges custom jsonLd with auto BreadcrumbList", async () => {
    const custom = { "@context": "https://schema.org", "@type": "FAQPage" };
    renderAt(
      "/faq",
      <SEOHead
        title="t"
        description="d"
        breadcrumbs={[{ name: "الأسئلة الشائعة", url: "/faq" }]}
        jsonLd={custom}
      />
    );

    await waitFor(() => {
      const lds = getJsonLd();
      const types = lds.map((l) => l["@type"]);
      expect(types).toContain("FAQPage");
      expect(types).toContain("BreadcrumbList");
    });
  });

  it("supports jsonLd as array", async () => {
    renderAt(
      "/blog",
      <SEOHead
        title="t"
        description="d"
        jsonLd={[
          { "@context": "https://schema.org", "@type": "Blog" },
          { "@context": "https://schema.org", "@type": "WebPage" },
        ]}
      />
    );

    await waitFor(() => {
      const types = getJsonLd().map((l) => l["@type"]);
      expect(types).toEqual(expect.arrayContaining(["Blog", "WebPage"]));
    });
  });

  it("emits no BreadcrumbList when breadcrumbs prop is omitted", async () => {
    renderAt(
      "/about",
      <SEOHead title="t" description="d" jsonLd={{ "@type": "AboutPage" }} />
    );

    await waitFor(() => {
      const types = getJsonLd().map((l) => l["@type"]);
      expect(types).toContain("AboutPage");
      expect(types).not.toContain("BreadcrumbList");
    });
  });

  it("sets canonical URL from current location", async () => {
    renderAt(
      "/contact",
      <SEOHead title="t" description="d" />
    );
    await waitFor(() => {
      const link = document.head.querySelector('link[rel="canonical"]');
      expect(link?.getAttribute("href")).toBe(`${BASE_URL}/contact`);
    });
  });
});
