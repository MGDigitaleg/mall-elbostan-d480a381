import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Sparkles, Store } from "lucide-react";

/**
 * Compact, lightweight cosmic CTA that replaces the full TechPlanetSection
 * on the homepage. Links into the dedicated /tech-planet experience.
 */
export const TechPlanetCTA = () => {
  const reduce = useReducedMotion() ?? false;

  return (
    <section
      aria-labelledby="tech-planet-cta-title"
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 70% 80% at 50% 50%, #1B3470 0%, #0B1E48 30%, #050E2A 65%, #02060F 100%)",
        paddingTop: "clamp(22px, 2.8vw, 40px)",
        paddingBottom: "clamp(22px, 2.8vw, 40px)",
        minHeight: 180,
      }}
    >
      {/* Star field — 30 stars only */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {Array.from({ length: 30 }).map((_, i) => {
          const cx = (i * 53.7) % 100;
          const cy = (i * 31.3) % 100;
          const r = i % 5 === 0 ? 1.4 : 0.7;
          const op = i % 3 === 0 ? 0.85 : 0.45;
          const fill =
            i % 7 === 0 ? "#FCD34D" : i % 4 === 0 ? "#A78BFA" : i % 2 === 0 ? "#7DD3FC" : "#E0F2FE";
          return <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r={r} fill={fill} opacity={op} />;
        })}
      </svg>

      {/* Static mini-planet in the corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          insetInlineEnd: "6%",
          top: "50%",
          width: 110,
          height: 110,
          transform: "translateY(-50%)",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(125,211,252,0.45) 0%, rgba(167,139,250,0.25) 40%, transparent 70%)",
            filter: "blur(8px)",
          }}
          animate={!reduce ? { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] } : { scale: 1, opacity: 0.85 }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
        <svg viewBox="0 0 100 100" className="relative h-full w-full">
          <defs>
            <linearGradient id="cta-bldg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1F61FF" />
              <stop offset="100%" stopColor="#0D1F3C" />
            </linearGradient>
          </defs>
          <polygon
            points="30,12 70,12 88,30 88,70 70,88 30,88 12,70 12,30"
            fill="url(#cta-bldg)"
            stroke="#CDBB9A"
            strokeOpacity="0.45"
            strokeWidth="1"
          />
          {[28, 44, 60, 72].map((y) =>
            [28, 42, 56, 70].map((x) => (
              <rect
                key={`w-${x}-${y}`}
                x={x}
                y={y}
                width="5"
                height="3"
                fill="#CDBB9A"
                opacity={(x + y) % 7 === 0 ? 0.85 : 0.4}
              />
            ))
          )}
        </svg>
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-[40rem] text-center md:text-start md:max-w-none md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-10">
          <div>
            <p
              className="font-arabic text-[0.7rem] uppercase tracking-[0.4em]"
              style={{ color: "#CDBB9A" }}
            >
              <Sparkles className="me-1.5 inline h-3 w-3" />
              تجربة جديدة
            </p>
            <h2
              id="tech-planet-cta-title"
              className="mt-2 font-arabic-display text-[clamp(1.05rem,2.2vw,1.5rem)] font-semibold leading-tight text-white"
            >
              كوكب البستان — كل التقنية تدور حولك
            </h2>
            <p
              className="mx-auto mt-1.5 max-w-[34rem] font-arabic text-[0.76rem] leading-relaxed md:mx-0"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              33 فئة جهاز و6 أقسام رئيسية في نقطة واحدة.
            </p>

            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <Link to="/tech-planet">
                <button
                  className="inline-flex h-9 items-center gap-2 rounded-full px-5 font-arabic text-[0.78rem] font-bold transition-transform hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)",
                    color: "#071326",
                    boxShadow: "0 8px 24px rgba(252,211,77,0.25)",
                  }}
                >
                  ادخل كوكب البستان
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </Link>
              <Link to="/stores">
                <button
                  className="inline-flex h-9 items-center gap-2 rounded-full border px-4 font-arabic text-[0.78rem] font-semibold backdrop-blur-sm transition-colors hover:bg-white/10"
                  style={{
                    borderColor: "rgba(205,187,154,0.4)",
                    color: "#E0F2FE",
                    background: "rgba(7,19,38,0.4)",
                  }}
                >
                  <Store className="h-4 w-4" />
                  تصفّح المحلات
                </button>
              </Link>
            </div>
          </div>

          {/* Spacer for the planet on desktop */}
          <div className="hidden md:block" style={{ width: 140 }} aria-hidden />
        </div>
      </div>
    </section>
  );
};

export default TechPlanetCTA;
