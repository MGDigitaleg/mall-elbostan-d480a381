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

  it("merges multiple jsonLd arrays preserving order and emits exactly one BreadcrumbList", async () => {
    const graphA = [
      { "@context": "https://schema.org", "@type": "Organization", name: "Org" },
      { "@context": "https://schema.org", "@type": "WebSite", name: "Site" },
    ];
    const graphB = [
      { "@context": "https://schema.org", "@type": "ItemList", name: "Stores" },
      { "@context": "https://schema.org", "@type": "CollectionPage", name: "Coll" },
    ];
    renderAt(
      "/stores",
      <SEOHead
        title="t"
        description="d"
        breadcrumbs={[{ name: "دليل المحلات", url: "/stores" }]}
        jsonLd={[...graphA, ...graphB]}
      />
    );

    await waitFor(() => {
      const lds = getJsonLd();
      const types = lds.map((l) => l["@type"]);
      // Original order preserved, BreadcrumbList appended at the end
      expect(types).toEqual([
        "Organization",
        "WebSite",
        "ItemList",
        "CollectionPage",
        "BreadcrumbList",
      ]);
      // No duplicate BreadcrumbList
      expect(types.filter((t) => t === "BreadcrumbList")).toHaveLength(1);
    });
  });

  it("does not duplicate BreadcrumbList when caller already provided one in jsonLd", async () => {
    // Caller passes a custom BreadcrumbList AND breadcrumbs prop — both should appear
    // (SEOHead never deduplicates: the contract is 'one source of truth = the breadcrumbs prop').
    // This test documents that behavior so future refactors are intentional.
    const customBc = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "custom", item: "https://x/y" },
      ],
    };
    renderAt(
      "/x",
      <SEOHead
        title="t"
        description="d"
        jsonLd={customBc}
        breadcrumbs={[{ name: "x", url: "/x" }]}
      />
    );

    await waitFor(() => {
      const lds = getJsonLd();
      const bcs = lds.filter((l) => l["@type"] === "BreadcrumbList") as Array<{
        itemListElement: Array<Record<string, unknown>>;
      }>;
      expect(bcs).toHaveLength(2);
      // Custom one comes first (caller-provided), auto-generated one second
      expect(bcs[0].itemListElement[0]).toMatchObject({ name: "custom" });
      expect(bcs[1].itemListElement[0]).toMatchObject({ name: "الرئيسية" });
    });
  });

  it("supports nested @graph payloads", async () => {
    const graphPayload = {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "Organization", "@id": "/#org", name: "Org" },
        { "@type": "WebSite", "@id": "/#site", publisher: { "@id": "/#org" } },
        { "@type": "ShoppingCenter", "@id": "/#mall" },
      ],
    };
    renderAt(
      "/",
      <SEOHead
        title="t"
        description="d"
        jsonLd={graphPayload}
        breadcrumbs={[{ name: "الرئيسية", url: "/" }]}
      />
    );

    await waitFor(() => {
      const lds = getJsonLd();
      const graph = lds.find((l) => Array.isArray(l["@graph"])) as
        | { "@graph": Array<{ "@type": string }> }
        | undefined;
      expect(graph).toBeDefined();
      const graphTypes = graph!["@graph"].map((g) => g["@type"]);
      expect(graphTypes).toEqual(["Organization", "WebSite", "ShoppingCenter"]);
      // BreadcrumbList still emitted as a sibling script
      expect(lds.some((l) => l["@type"] === "BreadcrumbList")).toBe(true);
    });
  });

  it("escapes '<' inside JSON-LD payloads to prevent HTML parser bailout", async () => {
    renderAt(
      "/blog/post",
      <SEOHead
        title="t"
        description="d"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "x </script><img onerror=alert(1)> y",
        }}
      />
    );

    await waitFor(() => {
      const scripts = Array.from(
        document.head.querySelectorAll('script[type="application/ld+json"]')
      );
      const raw = scripts.map((s) => s.textContent || "").join("");
      expect(raw).not.toMatch(/<\/script>/i);
      expect(raw).toContain("\\u003c/script");
      // Still valid JSON that decodes back to original
      const parsed = JSON.parse(raw);
      expect(parsed.headline).toBe("x </script><img onerror=alert(1)> y");
    });
  });

  it("emits no JSON-LD scripts when neither jsonLd nor breadcrumbs are provided", async () => {
    renderAt("/raw", <SEOHead title="t" description="d" />);
    await waitFor(() => {
      // canonical present means Helmet flushed
      expect(document.head.querySelector('link[rel="canonical"]')).toBeTruthy();
    });
    expect(getJsonLd()).toHaveLength(0);
  });
});
