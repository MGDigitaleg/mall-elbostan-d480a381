import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

/**
 * Compact promo strip for Tech Planet — homepage teaser only.
 * Full experience lives at /tech-planet.
 */
export const TechPlanetCTA = () => {
  return (
    <section
      aria-labelledby="tech-planet-cta-title"
      className="relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 80% 100% at 50% 50%, #1B3470 0%, #0B1E48 50%, #050E2A 100%)",
        paddingTop: "clamp(14px, 1.8vw, 22px)",
        paddingBottom: "clamp(14px, 1.8vw, 22px)",
      }}
    >
      <div className="container relative">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 md:px-4 md:py-3" style={{ borderColor: "rgba(205,187,154,0.18)", background: "rgba(7,19,38,0.4)" }}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(252,211,77,0.12)", border: "1px solid rgba(252,211,77,0.25)" }}>
              <Sparkles className="h-4 w-4" style={{ color: "#FCD34D" }} />
            </span>
            <div className="min-w-0">
              <p className="text-[0.56rem] font-semibold tracking-[0.2em] uppercase truncate" style={{ color: "#CDBB9A" }}>
                تجربة جديدة
              </p>
              <h2
                id="tech-planet-cta-title"
                className="text-[0.84rem] md:text-[0.92rem] font-bold leading-tight truncate"
                style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}
              >
                كوكب البستان — كل التقنية تدور حولك.
              </h2>
            </div>
          </div>

          <Link to="/tech-planet" className="shrink-0">
            <button
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3.5 text-[0.72rem] font-bold transition-transform hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)",
                color: "#071326",
              }}
            >
              ادخل كوكب البستان
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TechPlanetCTA;
