import { describe, it, expect, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import {
  SEOHead,
  buildCoreGraphLd,
  buildBranchLd,
  buildOrganizationLd,
  shoppingCenterLd,
} from "@/components/SEOHead";

/**
 * Validates geo + address integrity for any LocalBusiness-like node:
 *  - latitude / longitude must be finite NUMBERS (not strings, not NaN)
 *  - latitude in [-90, 90], longitude in [-180, 180]
 *  - Egypt-specific: latitude ≈ 22..32, longitude ≈ 24..37
 *  - PostalAddress must include addressCountry="EG" and an addressLocality
 *  - Address fields must be non-empty strings (no undefined leakage)
 */

function renderAt(path: string, ui: React.ReactElement) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </HelmetProvider>
  );
}

function getNodes(): Record<string, unknown>[] {
  return Array.from(
    document.head.querySelectorAll('script[type="application/ld+json"]')
  ).map((s) => JSON.parse(s.textContent || "{}"));
}

type GeoNode = {
  "@type"?: string;
  geo?: { "@type"?: string; latitude?: unknown; longitude?: unknown };
  address?: {
    "@type"?: string;
    addressCountry?: unknown;
    addressLocality?: unknown;
    addressRegion?: unknown;
    streetAddress?: unknown;
    postalCode?: unknown;
  };
};

function assertValidGeo(node: GeoNode, label: string) {
  expect(node.geo, `${label} missing geo`).toBeDefined();
  expect(node.geo!["@type"], `${label} geo @type`).toBe("GeoCoordinates");

  const { latitude, longitude } = node.geo!;
  // Must be numbers — guard against accidental string serialization
  expect(typeof latitude, `${label} latitude type`).toBe("number");
  expect(typeof longitude, `${label} longitude type`).toBe("number");
  expect(Number.isFinite(latitude as number), `${label} lat finite`).toBe(true);
  expect(Number.isFinite(longitude as number), `${label} lng finite`).toBe(true);
  // Global geographic range
  expect(latitude as number).toBeGreaterThanOrEqual(-90);
  expect(latitude as number).toBeLessThanOrEqual(90);
  expect(longitude as number).toBeGreaterThanOrEqual(-180);
  expect(longitude as number).toBeLessThanOrEqual(180);
  // Egypt-specific bounding box
  expect(latitude as number).toBeGreaterThan(22);
  expect(latitude as number).toBeLessThan(32);
  expect(longitude as number).toBeGreaterThan(24);
  expect(longitude as number).toBeLessThan(37);
}

function assertValidAddress(node: GeoNode, label: string) {
  expect(node.address, `${label} missing address`).toBeDefined();
  const a = node.address!;
  expect(a["@type"]).toBe("PostalAddress");
  expect(a.addressCountry).toBe("EG");
  expect(typeof a.addressLocality).toBe("string");
  expect((a.addressLocality as string).length).toBeGreaterThan(0);
  // No undefined leakage — every present field must be a non-empty string
  for (const key of ["addressLocality", "addressRegion", "streetAddress", "postalCode"] as const) {
    if (a[key] !== undefined) {
      expect(typeof a[key], `${label}.${key} type`).toBe("string");
      expect((a[key] as string).length).toBeGreaterThan(0);
    }
  }
}

describe("SEOHead — geo & address integrity for LocalBusiness/Branch", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  it("Organization (LocalBusiness) emits valid Egypt geo + address", () => {
    const org = buildOrganizationLd() as unknown as GeoNode;
    assertValidGeo(org, "Organization");
    assertValidAddress(org, "Organization");
  });

  it("ShoppingCenter constant has valid Egypt geo + address", () => {
    assertValidGeo(shoppingCenterLd as unknown as GeoNode, "ShoppingCenter");
    assertValidAddress(shoppingCenterLd as unknown as GeoNode, "ShoppingCenter");
  });

  it("buildBranchLd preserves numeric geo even when called with various input shapes", () => {
    const samples = [
      // canonical
      { lat: 30.05, lng: 31.24 },
      // integer
      { lat: 30, lng: 31 },
      // negative-leaning edge inside Egypt
      { lat: 22.5, lng: 25.1 },
      { lat: 31.9, lng: 36.5 },
    ];

    for (const { lat, lng } of samples) {
      const node = buildBranchLd({
        id: "test",
        nameAr: "فرع",
        url: "/test",
        streetAddress: "شارع",
        addressLocality: "القاهرة",
        latitude: lat,
        longitude: lng,
      }) as unknown as GeoNode;

      assertValidGeo(node, `branch(${lat},${lng})`);
      assertValidAddress(node, `branch(${lat},${lng})`);
      // Verify the supplied numbers survived the build round-trip exactly
      expect(node.geo!.latitude).toBe(lat);
      expect(node.geo!.longitude).toBe(lng);
    }
  });

  it("rendered JSON-LD preserves numeric geo (not stringified) after react-helmet serialization", async () => {
    const branch = buildBranchLd({
      id: "downtown",
      nameAr: "فرع وسط البلد",
      url: "/downtown-branch",
      streetAddress: "شارع 26 يوليو",
      addressLocality: "القاهرة",
      latitude: 30.0476,
      longitude: 31.2336,
    });

    renderAt(
      "/downtown-branch",
      <SEOHead
        title="t"
        description="d"
        jsonLd={[buildCoreGraphLd(), branch]}
      />
    );

    await waitFor(() => {
      const nodes = getNodes();
      // Every node containing a geo block must satisfy the integrity rules.
      const collectGeoNodes = (n: Record<string, unknown>): GeoNode[] => {
        const out: GeoNode[] = [];
        const visit = (v: unknown) => {
          if (!v || typeof v !== "object") return;
          if (Array.isArray(v)) return v.forEach(visit);
          const obj = v as Record<string, unknown>;
          if (obj.geo && typeof obj.geo === "object") out.push(obj as GeoNode);
          Object.values(obj).forEach(visit);
        };
        visit(n);
        return out;
      };

      const geoNodes = nodes.flatMap(collectGeoNodes);
      expect(geoNodes.length).toBeGreaterThan(0);
      geoNodes.forEach((g, i) => {
        assertValidGeo(g, `rendered[${i}]:${g["@type"] ?? "?"}`);
        assertValidAddress(g, `rendered[${i}]:${g["@type"] ?? "?"}`);
      });

      // Specifically locate the downtown branch and confirm exact coordinates
      const downtown = geoNodes.find(
        (g) => Array.isArray(g["@type"]) && (g["@type"] as string[]).includes("ShoppingCenter") && g.address?.addressLocality === "القاهرة" && (g as Record<string, unknown>)["@id"]?.toString().includes("downtown-branch")
      ) ?? geoNodes.find((g) => g.address?.streetAddress === "شارع 26 يوليو");
      expect(downtown).toBeDefined();
      expect(downtown!.geo!.latitude).toBe(30.0476);
      expect(downtown!.geo!.longitude).toBe(31.2336);
    });
  });

  it("rejects out-of-range coordinates by failing assertions (negative test)", () => {
    // Defensive — proves our validator catches invalid data, not just happy paths.
    const bogus: GeoNode = {
      "@type": "Place",
      geo: { "@type": "GeoCoordinates", latitude: 999, longitude: -200 },
    };
    expect(() => assertValidGeo(bogus, "bogus")).toThrow();

    const stringified: GeoNode = {
      "@type": "Place",
      geo: { "@type": "GeoCoordinates", latitude: "30.05", longitude: "31.24" },
    };
    expect(() => assertValidGeo(stringified, "stringified")).toThrow();
  });
});
