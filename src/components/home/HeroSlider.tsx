import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Compass, Gift, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";

import nc1 from "@/assets/nc-hero-1.jpg";
import nc2 from "@/assets/nc-hero-2.jpg";
import dt1 from "@/assets/downtown-hero-1.jpg";
import dt2 from "@/assets/downtown-exterior.jpg";

/* 4 curated images: 2 new cairo + 2 downtown */
const heroImages = [nc1, nc2, dt1, dt2];

const slides = [
  {
    kicker: "الإرث",
    headline: "بداية بنت السمعة.",
    sub: "أكثر من عقد في سوق التقنية المصري — من وسط البلد إلى القاهرة الجديدة.",
    cta: { label: "استكشف الدليل", to: "/map", icon: Compass },
    ctaSecondary: { label: "تصفّح المحلات", to: "/stores" },
  },
  {
    kicker: "الفرع الجديد",
    headline: "وجهة تقنية جاهزة.",
    sub: "٥٣+ وحدة تجارية، خريطة تفاعلية، ومحلات تقنية معروفة.",
    cta: { label: "الخريطة التفاعلية", to: "/map", icon: Compass },
    ctaSecondary: { label: "الوحدات المتاحة", to: "/leasing" },
  },
  {
    kicker: "١ مايو ٢٠٢٦",
    headline: "الافتتاح الكبير.",
    sub: "جوائز وعروض حصرية يوم الافتتاح — سجّل الآن.",
    cta: { label: "أدر واربح", to: "/spin-win", icon: Gift },
    ctaSecondary: { label: "تفاصيل الافتتاح", to: "/opening-day" },
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(next, 6500);
    return () => clearInterval(t);
  }, [isPaused, next]);

  const slide = slides[current];
  const CtaIcon = slide.cta.icon;

  return (
    <section
      className="relative min-h-[440px] md:min-h-[500px] max-h-[580px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── 4-image architectural collage background ── */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 grid-rows-1">
        {heroImages.map((src, i) => (
          <div key={i} className="relative overflow-hidden">
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              style={{ filter: "saturate(0.75) contrast(0.95)" }}
              loading={i < 2 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* ── Overlay: lighter navy, allows architecture to show ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(165deg, hsla(218, 50%, 8%, 0.78) 0%, hsla(218, 45%, 10%, 0.72) 40%, hsla(218, 50%, 8%, 0.80) 100%)",
        }}
      />
      {/* Bottom fade for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: "linear-gradient(to top, hsla(218, 50%, 7%, 0.95), transparent)" }} />
      {/* RTL side fade for right-side text */}
      <div className="absolute inset-y-0 right-0 w-2/5 hidden md:block" style={{ background: "linear-gradient(to left, hsla(218, 50%, 7%, 0.5), transparent)" }} />

      {/* ── Subtle ambient accents ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-[15%] w-[400px] h-[400px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }} />
        <div className="absolute bottom-0 right-[25%] w-[300px] h-[300px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #CDBB9A, transparent 70%)" }} />
      </div>

      {/* ── Grid texture ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex h-full min-h-[440px] md:min-h-[500px] max-h-[580px] max-w-[1440px] items-center px-5 md:px-10">
        <div className="flex w-full flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-start gap-8">
          {/* Text block — right side */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[28rem] space-y-4"
            >
              <span
                className="inline-block rounded-full px-3.5 py-1.5 text-[0.62rem] font-bold tracking-[0.15em] uppercase"
                style={{ background: "#CDBB9A14", color: "#CDBB9A", border: "1px solid #CDBB9A25" }}
              >
                {slide.kicker}
              </span>

              <h1
                className="text-[1.4rem] font-bold leading-[1.12] md:text-[1.7rem]"
                style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}
              >
                {slide.headline}
              </h1>

              <p className="text-[0.82rem] leading-[1.75] max-w-[24rem]" style={{ color: "#B0BEC5" }}>
                {slide.sub}
              </p>

              <div className="flex justify-center md:justify-start gap-2.5 pt-1">
                <Link to={slide.cta.to}>
                  <Button variant="cta" className="h-10 rounded-xl px-5 text-[0.8rem] font-bold shadow-lg shadow-primary/20">
                    <CtaIcon className="ml-1.5 h-4 w-4" /> {slide.cta.label}
                  </Button>
                </Link>
                <Link to={slide.ctaSecondary.to}>
                  <Button
                    className="h-10 rounded-xl border px-5 text-[0.8rem] font-semibold transition-colors hover:bg-white/[0.08]"
                    style={{ borderColor: "#ffffff18", background: "transparent", color: "#CBD5E1" }}
                  >
                    {slide.ctaSecondary.label}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Countdown — secondary elegant element */}
          <div className="hidden lg:block">
            <div
              className="rounded-2xl border px-6 py-5 backdrop-blur-md"
              style={{
                borderColor: "hsla(0, 0%, 100%, 0.08)",
                background: "hsla(220, 45%, 10%, 0.65)",
                boxShadow: "0 8px 32px hsla(220, 60%, 5%, 0.4)",
              }}
            >
              <p className="mb-3.5 text-center text-[0.66rem] font-semibold tracking-[0.14em] uppercase" style={{ color: "#CDBB9A" }}>
                الافتتاح الكبير
              </p>
              <CountdownTimer compact />
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide indicators ── */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="relative h-1.5 rounded-full transition-all duration-500 overflow-hidden"
            style={{ width: i === current ? 28 : 8, background: i === current ? "transparent" : "#ffffff20" }}
            aria-label={`شريحة ${i + 1}`}
          >
            {i === current && (
              <>
                <div className="absolute inset-0 rounded-full" style={{ background: "#CDBB9A40" }} />
                <motion.div
                  className="absolute inset-0 rounded-full origin-right"
                  style={{ background: "#CDBB9A" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 6.5, ease: "linear" }}
                />
              </>
            )}
          </button>
        ))}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 10%, #2D6BFF20, transparent 90%)" }} />
    </section>
  );
}
