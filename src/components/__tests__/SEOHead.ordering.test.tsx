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
} from "@/components/SEOHead";

/**
 * Locks the canonical ordering of JSON-LD <script> blocks inside <head>.
 *
 * Crawlers don't strictly require an order, but the existing rendering
 * pipeline (and `prioritizeSeoTags` from react-helmet-async) places:
 *
 *   1. Every entry from `jsonLd` prop, in the exact order passed.
 *      - When `buildCoreGraphLd(...)` is first, its single @graph payload
 *        emits Organization -> ShoppingCenter -> WebSite -> ...extra in
 *        that exact order inside @graph[].
 *   2. The auto-generated BreadcrumbList (from the `breadcrumbs` prop)
 *      ALWAYS comes last.
 *
 * If anyone reshuffles SEOHead in the future this test fails loudly.
 */

function renderAt(path: string, ui: React.ReactElement) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </HelmetProvider>
  );
}

function getJsonLdNodes(): Record<string, unknown>[] {
  return Array.from(
    document.head.querySelectorAll('script[type="application/ld+json"]')
  ).map((s) => JSON.parse(s.textContent || "{}"));
}

function topType(node: Record<string, unknown>): string {
  if (Array.isArray(node["@graph"])) return "@graph";
  const t = node["@type"];
  if (Array.isArray(t)) return t.join("+");
  return String(t ?? "");
}

describe("SEOHead — JSON-LD script ordering", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  it("emits jsonLd entries in the exact order passed, then BreadcrumbList last", async () => {
    renderAt(
      "/stores/example",
      <SEOHead
        title="t"
        description="d"
        jsonLd={[
          buildCoreGraphLd(undefined, [
            buildFaqLd([{ question_ar: "س؟", answer_ar: "ج." }]),
            buildSiteNavLd(),
            buildSpeakableLd(["h1"]),
          ]),
          buildStoreLd({ name_ar: "محل", slug: "example" }),
        ]}
        breadcrumbs={[
          { name: "المحلات", url: "/stores" },
          { name: "محل", url: "/stores/example" },
        ]}
      />
    );

    await waitFor(() => {
      const nodes = getJsonLdNodes();
      const order = nodes.map(topType);
      // 1: core @graph bundle, 2: Store, 3: auto BreadcrumbList (last)
      expect(order).toEqual(["@graph", "Store", "BreadcrumbList"]);
    });
  });

  it("@graph entries follow Organization → ShoppingCenter → WebSite → ...extras", async () => {
    renderAt(
      "/",
      <SEOHead
        title="t"
        description="d"
        jsonLd={buildCoreGraphLd(undefined, [
          buildFaqLd([{ question_ar: "س؟", answer_ar: "ج." }]),
          buildSiteNavLd(),
          buildSpeakableLd(["h1"]),
        ])}
      />
    );

    await waitFor(() => {
      const nodes = getJsonLdNodes();
      const graphNode = nodes.find((n) => Array.isArray(n["@graph"]));
      expect(graphNode).toBeDefined();
      const graph = graphNode!["@graph"] as Record<string, unknown>[];

      const types = graph.map((g) => {
        const t = g["@type"];
        return Array.isArray(t) ? t.join("+") : String(t);
      });

      expect(types[0]).toBe("LocalBusiness+ElectronicsStore"); // Organization
      expect(types[1]).toBe("ShoppingCenter");
      expect(types[2]).toBe("WebSite");
      // extras follow in their passed order
      expect(types[3]).toBe("FAQPage");
      expect(types[4]).toBe("SiteNavigationElement");
      // buildSpeakableLd wraps a SpeakableSpecification inside a WebPage node
      expect(types[5]).toBe("WebPage");
      expect((graph[5] as { speakable?: { "@type"?: string } }).speakable?.["@type"]).toBe(
        "SpeakableSpecification"
      );
    });
  });

  it("BreadcrumbList is always emitted last, never interleaved with user JSON-LD", async () => {
    renderAt(
      "/products/x",
      <SEOHead
        title="t"
        description="d"
        jsonLd={[
          buildSiteNavLd(),
          buildStoreLd({ name_ar: "محل", slug: "x" }),
          buildFaqLd([{ question_ar: "س؟", answer_ar: "ج." }]),
        ]}
        breadcrumbs={[{ name: "المنتجات", url: "/products" }]}
      />
    );

    await waitFor(() => {
      const order = getJsonLdNodes().map(topType);
      expect(order).toEqual([
        "SiteNavigationElement",
        "Store",
        "FAQPage",
        "BreadcrumbList",
      ]);
      // And the breadcrumb is the very last <script> in head — not just last among LD
      const allScripts = Array.from(
        document.head.querySelectorAll('script[type="application/ld+json"]')
      );
      const lastJson = JSON.parse(allScripts[allScripts.length - 1].textContent || "{}");
      expect(lastJson["@type"]).toBe("BreadcrumbList");
    });
  });

  it("renders no BreadcrumbList script when no breadcrumbs prop is passed", async () => {
    renderAt(
      "/about",
      <SEOHead title="t" description="d" jsonLd={buildSiteNavLd()} />
    );
    await waitFor(() => {
      const order = getJsonLdNodes().map(topType);
      expect(order).toEqual(["SiteNavigationElement"]);
      expect(order).not.toContain("BreadcrumbList");
    });
  });

  it("preserves a single jsonLd object's identity (no array auto-wrapping reorders it)", async () => {
    const single = buildStoreLd({ name_ar: "محل وحيد", slug: "solo" });
    renderAt(
      "/stores/solo",
      <SEOHead
        title="t"
        description="d"
        jsonLd={single}
        breadcrumbs={[{ name: "المحلات", url: "/stores" }]}
      />
    );
    await waitFor(() => {
      const nodes = getJsonLdNodes();
      expect(nodes).toHaveLength(2);
      expect(nodes[0]).toMatchObject({ "@type": "Store", name: "محل وحيد" });
      expect(nodes[1]["@type"]).toBe("BreadcrumbList");
    });
  });
});
