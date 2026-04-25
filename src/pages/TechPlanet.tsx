import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { TechPlanetSection } from "@/components/home/TechPlanetSection";
import { deviceCatalog } from "@/lib/deviceCatalog";
import { tokenizeQuery, scoreDevice } from "@/lib/deviceSearchIndex";
import { buildTechPlanetSeo, type OrbitKey, type CatalogDeviceLite } from "@/lib/techPlanetSeo";
import { trackSeoLinkClick } from "@/lib/analytics";

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

      {/* ═══════════ TECH PLANET SEO CONTENT — internal linking footer ═══════════ */}
      <section
        className="border-t"
        style={{
          background: "linear-gradient(180deg, #050E2A 0%, #02060F 100%)",
          borderColor: "rgba(205,187,154,0.10)",
          paddingTop: "clamp(28px, 3.4vw, 48px)",
          paddingBottom: "clamp(28px, 3.4vw, 48px)",
        }}
      >
        <div className="container max-w-4xl">
          <h2
            className="text-[0.96rem] font-bold mb-3"
            style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}
          >
            كوكب البستان — كتالوج التقنية الكامل
          </h2>
          <div className="text-[0.78rem] leading-[2.1] space-y-3" style={{ color: "rgba(226,232,240,0.72)" }}>
            <p>
              <strong style={{ color: "#FCD34D" }}>كوكب البستان</strong>{" "}
              هو العرض الكامل لكل أنواع الأجهزة التقنية المتوفرة في محلات المول — من الحلقة الداخلية للأجهزة الأساسية، إلى الحلقات الأبعد للتخصصات النادرة. تربط هذه الصفحة كل صنف بالمحل المناسب داخل{" "}
              <Link
                to="/map"
                className="font-semibold transition-colors hover:underline"
                style={{ color: "#60A5FA" }}
                onClick={() => trackSeoLinkClick("tech_planet_seo", "page", "الخريطة التفاعلية", "/map")}
              >
                الخريطة التفاعلية
              </Link>{" "}
              للمول.
            </p>
            <p>
              تصفّح المحلات حسب فئة الجهاز:{" "}
              <Link
                to="/stores?category=الكمبيوتر والأجهزة"
                className="font-semibold transition-colors hover:underline"
                style={{ color: "#60A5FA" }}
                onClick={() => trackSeoLinkClick("tech_planet_seo", "category", "الكمبيوتر واللابتوبات", "/stores?category=الكمبيوتر والأجهزة")}
              >
                محلات الكمبيوتر واللابتوبات
              </Link>،{" "}
              <Link
                to="/stores?category=الهواتف والإكسسوارات"
                className="font-semibold transition-colors hover:underline"
                style={{ color: "#60A5FA" }}
                onClick={() => trackSeoLinkClick("tech_planet_seo", "category", "الهواتف والإكسسوارات", "/stores?category=الهواتف والإكسسوارات")}
              >
                محلات الهواتف والإكسسوارات
              </Link>،{" "}
              <Link
                to="/stores?category=الألعاب والترفيه"
                className="font-semibold transition-colors hover:underline"
                style={{ color: "#60A5FA" }}
                onClick={() => trackSeoLinkClick("tech_planet_seo", "category", "الجيمنج والألعاب", "/stores?category=الألعاب والترفيه")}
              >
                محلات الجيمنج والألعاب
              </Link>،{" "}
              <Link
                to="/stores?category=الطباعة والتصوير"
                className="font-semibold transition-colors hover:underline"
                style={{ color: "#60A5FA" }}
                onClick={() => trackSeoLinkClick("tech_planet_seo", "category", "الطباعة والتصوير", "/stores?category=الطباعة والتصوير")}
              >
                الطباعة والتصوير
              </Link>،{" "}
              <Link
                to="/stores?category=الشبكات والأنظمة الأمنية"
                className="font-semibold transition-colors hover:underline"
                style={{ color: "#60A5FA" }}
                onClick={() => trackSeoLinkClick("tech_planet_seo", "category", "الشبكات والأمن", "/stores?category=الشبكات والأنظمة الأمنية")}
              >
                الشبكات والأنظمة الأمنية
              </Link>، أو{" "}
              <Link
                to="/stores?category=الصيانة والدعم الفني"
                className="font-semibold transition-colors hover:underline"
                style={{ color: "#60A5FA" }}
                onClick={() => trackSeoLinkClick("tech_planet_seo", "category", "الصيانة والدعم الفني", "/stores?category=الصيانة والدعم الفني")}
              >
                مراكز الصيانة والدعم الفني
              </Link>.
            </p>
            <p>
              قارن المواصفات والأسعار من{" "}
              <Link
                to="/products"
                className="font-semibold transition-colors hover:underline"
                style={{ color: "#60A5FA" }}
                onClick={() => trackSeoLinkClick("tech_planet_seo", "page", "كتالوج المنتجات", "/products")}
              >
                كتالوج المنتجات
              </Link>،{" "}
              تصفّح{" "}
              <Link
                to="/stores"
                className="font-semibold transition-colors hover:underline"
                style={{ color: "#60A5FA" }}
                onClick={() => trackSeoLinkClick("tech_planet_seo", "page", "دليل المحلات", "/stores")}
              >
                دليل المحلات
              </Link>{" "}
              الكامل، أو تابع{" "}
              <Link
                to="/daily-deals"
                className="font-semibold transition-colors hover:underline"
                style={{ color: "#60A5FA" }}
                onClick={() => trackSeoLinkClick("tech_planet_seo", "page", "عروض الافتتاح", "/daily-deals")}
              >
                عروض الافتتاح
              </Link>{" "}
              من المحلات الجديدة. للمزيد عن المنظومة،{" "}
              <Link
                to="/about"
                className="font-semibold transition-colors hover:underline"
                style={{ color: "#60A5FA" }}
                onClick={() => trackSeoLinkClick("tech_planet_seo", "page", "عن المول", "/about")}
              >
                اعرف المزيد عن مول البستان
              </Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default TechPlanet;
