import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Compass, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";

import ncHero1 from "@/assets/nc-hero-1.jpg";
import dtHero1 from "@/assets/downtown-hero-1.jpg";
import ncHero3 from "@/assets/nc-hero-3.jpg";
import downtownHeroNight from "@/assets/downtown-hero-night.jpg";

/* 3 slides — each with ONE distinct full-bleed image */
const slides = [
  {
    image: dtHero1,
    alt: "واجهة مول البستان — فرع وسط البلد",
    kicker: "منذ ١٩٩٠",
    headline: "الاسم الذي بناه السوق.",
    sub: "ثلاثة عقود من الثقة في سوق التقنية — من وسط البلد إلى التجمع الخامس.",
    cta: { label: "دليل المحلات", to: "/stores", icon: Compass },
    ctaSecondary: { label: "الخريطة التفاعلية", to: "/map" },
  },
  {
    image: downtownHeroNight,
    alt: "مول البستان — وسط البلد ليلاً",
    kicker: "الأول في مصر",
    headline: "٣٥ سنة والسوق يبدأ من هنا.",
    sub: "أول مول متخصص في الإلكترونيات والتقنية في مصر — منذ ١٩٩٠ من قلب وسط البلد.",
    cta: { label: "اعرف أكثر", to: "/downtown-branch", icon: Compass },
    ctaSecondary: { label: "دليل المحلات", to: "/downtown-directory" },
  },
  {
    image: ncHero1,
    alt: "مدخل مول البستان — فرع القاهرة الجديدة",
    kicker: "التجمع الخامس",
    headline: "فرع جديد، نفس الثقة.",
    sub: "محلات تقنية متخصصة، خريطة تفاعلية، ووحدات متاحة للتأجير.",
    cta: { label: "الخريطة التفاعلية", to: "/map", icon: Compass },
    ctaSecondary: { label: "الوحدات المتاحة", to: "/leasing" },
  },
  {
    image: ncHero3,
    alt: "التصميم الداخلي — مول البستان",
    kicker: "١ مايو ٢٠٢٦",
    headline: "الافتتاح الكبير.",
    sub: "جوائز حقيقية من محلات المول — سجّل الآن وكن من الحاضرين.",
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
    const t = setInterval(next, 3500);
    return () => clearInterval(t);
  }, [isPaused, next]);

  const slide = slides[current];
  const CtaIcon = slide.cta.icon;

  return (
    <section
      className="relative min-h-[520px] md:min-h-[540px] max-h-[620px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Full-bleed single-image background per slide ── */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="h-full w-full object-cover"
            style={{ filter: "saturate(0.85) brightness(1.08) contrast(0.95)", objectPosition: "center 80%" }}
            loading={current === 0 ? "eager" : "lazy"}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Overlay ── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(to top, hsla(218, 55%, 7%, 0.88) 0%, hsla(218, 50%, 10%, 0.55) 45%, hsla(218, 50%, 8%, 0.45) 100%)",
        }}
      />
      {/* RTL side fade for right-side text readability */}
      <div
        className="absolute inset-y-0 right-0 w-[50%] z-[2] hidden md:block"
        style={{ background: "linear-gradient(to left, hsla(218, 55%, 7%, 0.5), transparent)" }}
      />

      {/* ── Subtle ambient accents ── */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        <div className="absolute top-1/4 left-[12%] w-[350px] h-[350px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }} />
        <div className="absolute bottom-[10%] right-[20%] w-[250px] h-[250px] rounded-full opacity-[0.025]" style={{ background: "radial-gradient(circle, #CDBB9A, transparent 70%)" }} />
      </div>

      {/* ── Grid texture ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.012]"
        style={{
          backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex h-full min-h-[520px] md:min-h-[540px] max-h-[620px] max-w-[1440px] items-center px-5 md:px-10 pt-[72px] md:pt-[76px]">
        <div className="flex w-full flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-start gap-6 md:gap-8">
          {/* Text block — right side on desktop, centered on mobile */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[28rem] space-y-3 md:space-y-4"
            >
              <span
                className="inline-block rounded-full px-3.5 py-1.5 text-[0.6rem] md:text-[0.62rem] font-bold tracking-[0.15em] uppercase"
                style={{ background: "#CDBB9A14", color: "#CDBB9A", border: "1px solid #CDBB9A25" }}
              >
                {slide.kicker}
              </span>

              <h1
                className="text-[1.35rem] font-bold leading-[1.15] md:text-[1.85rem]"
                style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}
              >
                {slide.headline}
              </h1>

              <p className="text-[0.78rem] md:text-[0.84rem] leading-[1.75] max-w-[22rem] md:max-w-[24rem] mx-auto md:mx-0" style={{ color: "#B0BEC5" }}>
                {slide.sub}
              </p>

              <div className="flex justify-center md:justify-start gap-2 md:gap-2.5 pt-1">
                <Link to={slide.cta.to}>
                  <Button variant="cta" className="h-9 md:h-10 rounded-xl px-4 md:px-5 text-[0.76rem] md:text-[0.8rem] font-bold shadow-lg shadow-primary/20">
                    <CtaIcon className="ml-1.5 h-3.5 w-3.5 md:h-4 md:w-4" /> {slide.cta.label}
                  </Button>
                </Link>
                <Link to={slide.ctaSecondary.to}>
                  <Button
                    className="h-9 md:h-10 rounded-xl border px-4 md:px-5 text-[0.76rem] md:text-[0.8rem] font-semibold transition-colors hover:bg-white/[0.08]"
                    style={{ borderColor: "#ffffff18", background: "transparent", color: "#CBD5E1" }}
                  >
                    {slide.ctaSecondary.label}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Countdown — inside hero on all screens */}
          <div className="w-full md:w-auto flex justify-center md:block">
            <div
              className="rounded-2xl border px-4 py-3 md:px-6 md:py-5 backdrop-blur-md"
              style={{
                borderColor: "hsla(0, 0%, 100%, 0.08)",
                background: "hsla(220, 45%, 10%, 0.65)",
                boxShadow: "0 8px 32px hsla(220, 60%, 5%, 0.4)",
              }}
            >
              <p className="mb-2 md:mb-3.5 text-center text-[0.6rem] md:text-[0.66rem] font-semibold tracking-[0.14em] uppercase" style={{ color: "#CDBB9A" }}>
                الافتتاح الكبير
              </p>
              <CountdownTimer compact />
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide indicators ── */}
      <div className="absolute bottom-5 md:bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
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
                  transition={{ duration: 3.5, ease: "linear" }}
                />
              </>
            )}
          </button>
        ))}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px z-10" style={{ background: "linear-gradient(90deg, transparent 10%, #2D6BFF20, transparent 90%)" }} />
    </section>
  );
}
