import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { TechPlanetSection } from "@/components/home/TechPlanetSection";

const TechPlanet = () => {
  return (
    <>
      <SEOHead
        title="كوكب البستان — كل التقنية في مدار واحد"
        description="استكشف كوكب البستان: مدارات تفاعلية تربطك بكل فئات الأجهزة، أقمار صناعية لتجارب المول، ودليل كامل للمحلات في القاهرة الجديدة."
        keywords="كوكب البستان, مول البستان, التجمع الخامس, لابتوبات, موبايلات, جيمنج, شاشات, خريطة المول"
        breadcrumbs={[
          { name: "الرئيسية", url: "https://mallelbostan.com/" },
          { name: "كوكب البستان", url: "https://mallelbostan.com/tech-planet" },
        ]}
      />

      {/* Breadcrumb strip — sits over the dark cosmic background */}
      <div
        className="relative z-10"
        style={{
          background:
            "linear-gradient(to bottom, #02060F 0%, #050E2A 100%)",
          paddingTop: "clamp(72px, 8vw, 96px)",
          paddingBottom: "clamp(8px, 1vw, 16px)",
        }}
      >
        <div className="container">
          <nav
            aria-label="مسار التنقّل"
            className="flex items-center gap-1.5 font-arabic text-[0.78rem]"
            style={{ color: "rgba(205,187,154,0.75)" }}
          >
            <Link to="/" className="transition-colors hover:text-white">
              الرئيسية
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 opacity-60" />
            <span className="font-semibold" style={{ color: "#FCD34D" }}>
              كوكب البستان
            </span>
          </nav>
        </div>
      </div>

      <TechPlanetSection />
    </>
  );
};

export default TechPlanet;
