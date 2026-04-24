import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { TechPlanetSection } from "@/components/home/TechPlanetSection";
import { deviceCatalog } from "@/lib/deviceCatalog";
import { tokenizeQuery, scoreDevice } from "@/lib/deviceSearchIndex";
import { buildTechPlanetSeo, type OrbitKey, type CatalogDeviceLite } from "@/lib/techPlanetSeo";

const isOrbitKey = (v: string | null): v is OrbitKey =>
  v === "all" || v === "inner" || v === "middle" || v === "outer";

/**
 * Derive the same filtered+ranked result set the catalog renders, purely
 * from URL state. Keeps SEO and visible UI in lockstep without prop drilling.
 */
function useDerivedCatalogState() {
  const [params] = useSearchParams();
  const orbit: OrbitKey = isOrbitKey(params.get("tp")) ? (params.get("tp") as OrbitKey) : "all";
  const query = params.get("q") ?? "";

  const allDevices = useMemo<CatalogDeviceLite[]>(
    () =>
      Object.values(deviceCatalog)
        .filter((d) => d && d.orbit && d.orbit !== undefined)
        .map((d) => ({ slug: d.slug, label: d.labelAr, ring: d.orbit as Exclude<OrbitKey, "all"> })),
    [],
  );

  const results = useMemo(() => {
    const tokens = tokenizeQuery(query);
    return allDevices
      .filter((d) => orbit === "all" || d.ring === orbit)
      .map((d) => ({ d, score: tokens.length === 0 ? 1 : scoreDevice(d.slug, tokens) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => (tokens.length === 0 ? 0 : b.score - a.score))
      .map((r) => r.d);
  }, [allDevices, orbit, query]);

  return { orbit, query, results, totalCount: allDevices.length };
}

const TechPlanet = () => {
  const state = useDerivedCatalogState();
  const seo = useMemo(() => buildTechPlanetSeo(state), [state]);

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        breadcrumbs={seo.breadcrumbs}
        jsonLd={seo.jsonLd}
      />

      {/* Breadcrumb strip — sits over the dark cosmic background */}
      <div
        className="relative z-10"
        style={{
          background: "linear-gradient(to bottom, #02060F 0%, #050E2A 100%)",
          paddingTop: "clamp(72px, 8vw, 96px)",
          paddingBottom: "clamp(8px, 1vw, 16px)",
        }}
      >
        <div className="container">
          <nav
            aria-label="مسار التنقّل"
            className="flex flex-wrap items-center gap-1.5 font-arabic text-[0.78rem]"
            style={{ color: "rgba(205,187,154,0.75)" }}
          >
            <Link to="/" className="transition-colors hover:text-white">
              الرئيسية
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 opacity-60" />
            {seo.visibleCrumbs.length === 0 ? (
              <span className="font-semibold" style={{ color: "#FCD34D" }}>
                كوكب البستان
              </span>
            ) : (
              <Link
                to="/tech-planet"
                className="transition-colors hover:text-white"
              >
                كوكب البستان
              </Link>
            )}
            {seo.visibleCrumbs.map((c, i) => {
              const isLast = i === seo.visibleCrumbs.length - 1;
              return (
                <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
                  <ChevronLeft className="h-3.5 w-3.5 opacity-60" />
                  {isLast || !c.href ? (
                    <span className="font-semibold" style={{ color: "#FCD34D" }}>
                      {c.label}
                    </span>
                  ) : (
                    <Link to={c.href} className="transition-colors hover:text-white">
                      {c.label}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>
        </div>
      </div>

      <TechPlanetSection />
    </>
  );
};

export default TechPlanet;
