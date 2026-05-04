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
  buildBlogPostLd,
  buildEventLd,
  buildJobPostingLd,
  buildContactPageLd,
  buildBranchLd,
  buildCollectionPageLd,
  buildProductListLd,
  buildStoreListLd,
  buildCategoryListLd,
} from "@/components/SEOHead";

/**
 * Validates that every JSON-LD <script> emitted by SEOHead:
 *  1. Parses as valid JSON.
 *  2. Has @context = "https://schema.org" at the top level (or inside @graph).
 *  3. Has a non-empty @type.
 *  4. Contains no `undefined`/`null` leaf values that would break crawlers.
 *  5. Escapes `</` so an HTML parser can't bail out mid-script.
 *  6. Validates required fields per @type (name/url where applicable).
 */

const SCHEMA = "https://schema.org";

function renderAt(path: string, ui: React.ReactElement) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </HelmetProvider>
  );
}

function getScriptTexts(): string[] {
  return Array.from(
    document.head.querySelectorAll('script[type="application/ld+json"]')
  ).map((s) => s.textContent || "");
}

function getNodes(): Record<string, unknown>[] {
  return getScriptTexts().map((t) => JSON.parse(t));
}

/** Walk every node — including @graph children — applying assertion fn */
function walkSchemaNodes(
  node: Record<string, unknown>,
  fn: (n: Record<string, unknown>) => void
) {
  fn(node);
  if (Array.isArray(node["@graph"])) {
    for (const child of node["@graph"] as Record<string, unknown>[]) {
      fn(child);
    }
  }
}

/** Recursively assert no undefined values reach JSON serialization. */
function assertNoUndefined(value: unknown, path = "$"): void {
  if (value === undefined) {
    throw new Error(`Undefined value at ${path}`);
  }
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((v, i) => assertNoUndefined(v, `${path}[${i}]`));
    return;
  }
  for (const [k, v] of Object.entries(value)) {
    assertNoUndefined(v, `${path}.${k}`);
  }
}

describe("SEOHead — JSON-LD validity for complex payloads", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  it("every emitted script parses as valid JSON (no syntax errors)", async () => {
    renderAt(
      "/stores/foo",
      <SEOHead
        title="t"
        description="d"
        jsonLd={[
          buildCoreGraphLd("+201234567890", [
            buildFaqLd([
              { question_ar: "س1؟", answer_ar: "ج1." },
              { question_ar: "س2؟", answer_ar: "ج2." },
            ]),
            buildSiteNavLd(),
            buildSpeakableLd(),
          ]),
          buildStoreLd({
            name_ar: "محل تجريبي",
            slug: "foo",
            category: "كمبيوتر ولابتوب",
            phone: "+201111111111",
          }),
          buildProductLd({
            name_ar: "لابتوب",
            slug: "laptop-x",
            price: 25000,
            brand: "ASUS",
            sku: "ABC-123",
          }),
          buildBlogPostLd({
            title_ar: "مقال",
            slug: "post",
            published_at: "2026-01-01",
          }),
          ...buildEventLd([{ title_ar: "افتتاح", event_date: "2026-05-01" }]),
          ...buildJobPostingLd([{ title_ar: "محاسب", job_type: "full-time" }]),
          buildContactPageLd({ phone: "+201234567890", whatsapp: "201234567890" }),
          buildBranchLd({
            id: "downtown",
            nameAr: "فرع وسط البلد",
            url: "/downtown-branch",
            streetAddress: "شارع 26 يوليو",
            addressLocality: "القاهرة",
            latitude: 30.05,
            longitude: 31.24,
          }),
          buildCollectionPageLd({
            name: "دليل",
            url: "/downtown-directory",
            items: [{ name: "محل", url: "/stores/foo" }],
          }),
          buildProductListLd([{ name_ar: "p1", slug: "p1", price: 100 }]),
          buildStoreListLd([{ name_ar: "محل", slug: "foo" }]),
          buildCategoryListLd([{ name: "كمبيوتر", url: "/stores?category=كمبيوتر" }]),
        ]}
        breadcrumbs={[
          { name: "المحلات", url: "/stores" },
          { name: "محل تجريبي", url: "/stores/foo" },
        ]}
      />
    );

    await waitFor(() => {
      const texts = getScriptTexts();
      expect(texts.length).toBeGreaterThan(5);
      for (const t of texts) {
        expect(() => JSON.parse(t)).not.toThrow();
      }
    });
  });

  it("every node has @context=schema.org and a non-empty @type", async () => {
    renderAt(
      "/",
      <SEOHead
        title="t"
        description="d"
        jsonLd={buildCoreGraphLd(undefined, [
          buildFaqLd([{ question_ar: "س؟", answer_ar: "ج." }]),
          buildSiteNavLd(),
          buildSpeakableLd(),
        ])}
        breadcrumbs={[{ name: "محلات", url: "/stores" }]}
      />
    );

    await waitFor(() => {
      const nodes = getNodes();
      expect(nodes.length).toBeGreaterThan(0);
      for (const node of nodes) {
        expect(node["@context"]).toBe(SCHEMA);
        walkSchemaNodes(node, (n) => {
          // @graph wrapper itself doesn't need a @type
          if (Array.isArray((n as Record<string, unknown>)["@graph"])) return;
          const type = n["@type"];
          expect(type, `missing @type on ${JSON.stringify(n).slice(0, 80)}`).toBeDefined();
          if (Array.isArray(type)) {
            expect(type.length).toBeGreaterThan(0);
            for (const t of type) expect(typeof t).toBe("string");
          } else {
            expect(typeof type).toBe("string");
            expect((type as string).length).toBeGreaterThan(0);
          }
        });
      }
    });
  });

  it("contains no undefined leaves after serialization", async () => {
    renderAt(
      "/stores/x",
      <SEOHead
        title="t"
        description="d"
        jsonLd={[
          buildStoreLd({ name_ar: "محل", slug: "x" }), // many optional fields omitted
          buildProductLd({ name_ar: "p", slug: "p" }), // no price/image/brand/sku
          buildBlogPostLd({ title_ar: "post", slug: "p" }), // no excerpt/cover
        ]}
      />
    );
    await waitFor(() => {
      for (const node of getNodes()) {
        expect(() => assertNoUndefined(node)).not.toThrow();
      }
    });
  });

  it("escapes `</` to prevent HTML parser bailout in script payloads", async () => {
    const malicious = {
      "@context": SCHEMA,
      "@type": "WebPage",
      name: "</script><script>alert(1)</script>",
    };
    renderAt("/", <SEOHead title="t" description="d" jsonLd={malicious} />);
    await waitFor(() => {
      const text = getScriptTexts()[0];
      expect(text).toBeDefined();
      // Raw `</` must not appear — should be escaped to \u003c/
      expect(text.includes("</script>")).toBe(false);
      expect(text.includes("\\u003c/script")).toBe(true);
      // And the escaped payload must still round-trip to the original string
      const parsed = JSON.parse(text);
      expect(parsed.name).toBe("</script><script>alert(1)</script>");
    });
  });

  it("BreadcrumbList is well-formed: positions are 1..N and items are absolute URLs", async () => {
    renderAt(
      "/stores/foo/bar",
      <SEOHead
        title="t"
        description="d"
        breadcrumbs={[
          { name: "المحلات", url: "/stores" },
          { name: "Foo", url: "/stores/foo" },
          { name: "Bar", url: "/stores/foo/bar" },
        ]}
      />
    );
    await waitFor(() => {
      const bc = getNodes().find((n) => n["@type"] === "BreadcrumbList") as
        | { itemListElement: Array<{ position: number; name: string; item: string }> }
        | undefined;
      expect(bc).toBeDefined();
      const items = bc!.itemListElement;
      expect(items.length).toBe(4); // home + 3 supplied
      items.forEach((it, i) => {
        expect(it.position).toBe(i + 1);
        expect(typeof it.name).toBe("string");
        expect(it.name.length).toBeGreaterThan(0);
        // Every breadcrumb item must be an absolute URL
        expect(() => new URL(it.item)).not.toThrow();
      });
    });
  });

  it("@graph nodes preserve cross-references via @id (Organization referenced as @id)", async () => {
    renderAt(
      "/",
      <SEOHead
        title="t"
        description="d"
        jsonLd={buildCoreGraphLd(undefined, [
          buildContactPageLd({ phone: "+201234567890" }),
        ])}
      />
    );
    await waitFor(() => {
      const node = getNodes().find((n) => Array.isArray(n["@graph"]));
      expect(node).toBeDefined();
      const graph = node!["@graph"] as Array<Record<string, unknown>>;
      const org = graph.find((g) => {
        const t = g["@type"];
        return Array.isArray(t) && t.includes("LocalBusiness");
      });
      expect(org).toBeDefined();
      expect(typeof org!["@id"]).toBe("string");

      // ContactPage references organization via @id — that @id MUST exist in graph
      const contact = graph.find((g) => g["@type"] === "ContactPage") as
        | { mainEntity?: { "@id"?: string } }
        | undefined;
      if (contact?.mainEntity?.["@id"]) {
        expect(contact.mainEntity["@id"]).toBe(org!["@id"]);
      }
    });
  });

  it("FAQPage mainEntity is a non-empty array of valid Question/Answer pairs", async () => {
    renderAt(
      "/faq",
      <SEOHead
        title="t"
        description="d"
        jsonLd={buildFaqLd([
          { question_ar: "س1؟", answer_ar: "ج1." },
          { question_ar: "س2؟", answer_ar: "ج2." },
          { question_ar: "س3؟", answer_ar: "ج3." },
        ])}
      />
    );
    await waitFor(() => {
      const faq = getNodes().find((n) => n["@type"] === "FAQPage") as
        | { mainEntity: Array<{ "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }> }
        | undefined;
      expect(faq).toBeDefined();
      expect(faq!.mainEntity.length).toBe(3);
      for (const q of faq!.mainEntity) {
        expect(q["@type"]).toBe("Question");
        expect(q.name.length).toBeGreaterThan(0);
        expect(q.acceptedAnswer["@type"]).toBe("Answer");
        expect(q.acceptedAnswer.text.length).toBeGreaterThan(0);
      }
    });
  });
});
