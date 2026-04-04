import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";

import dt1 from "@/assets/downtown-hero-1.jpg";
import dt2 from "@/assets/downtown-hero-2.jpg";
import dt3 from "@/assets/downtown-hero-3.jpg";
import dt4 from "@/assets/downtown-hero-4.jpg";
import dt5 from "@/assets/downtown-hero-5.jpg";
import nc1 from "@/assets/nc-hero-1.jpg";
import nc2 from "@/assets/nc-hero-2.jpg";
import nc3 from "@/assets/nc-hero-3.jpg";
import nc4 from "@/assets/nc-hero-4.jpg";

const slides = [
  {
    kicker: "الإرث",
    headline: "بداية بنت السمعة.",
    sub: "أكثر من عقد في سوق التقنية المصري — من وسط البلد إلى القاهرة الجديدة.",
    cta: { label: "استكشف الدليل", to: "/map", icon: Compass },
    ctaSecondary: { label: "تصفّح المحلات", to: "/stores" },
    photos: [dt1, dt2, dt3, dt4, dt5],
  },
  {
    kicker: "الفرع الجديد",
    headline: "وجهة تقنية جاهزة.",
    sub: "٥٣+ وحدة تجارية، خريطة تفاعلية، ومحلات تقنية معروفة.",
    cta: { label: "الخريطة التفاعلية", to: "/map", icon: Compass },
    ctaSecondary: { label: "الوحدات المتاحة", to: "/leasing" },
    photos: [nc1, nc2, nc3, nc4, dt5],
  },
  {
    kicker: "١ مايو ٢٠٢٦",
    headline: "الافتتاح الكبير.",
    sub: "جوائز وعروض حصرية يوم الافتتاح — سجّل الآن.",
    cta: { label: "أدر واربح", to: "/spin-win", icon: Gift },
    ctaSecondary: { label: "تفاصيل الافتتاح", to: "/opening-day" },
    photos: [nc1, dt1, nc3, dt3, nc4],
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
      style={{ background: "#071326" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Photo mosaic background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-5 grid-rows-2 gap-[2px] opacity-[0.2]">
            {slide.photos.map((src, i) => (
              <div
                key={i}
                className={`relative overflow-hidden ${
                  i === 0 ? "col-span-2 row-span-2" :
                  i === 3 ? "hidden md:block col-span-1 row-span-2" : ""
                }`}
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  loading={current === 0 && i < 3 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #071326 12%, #07132680 50%, #07132650)" }} />
      <div className="absolute inset-0 hidden md:block" style={{ background: "linear-gradient(to left, #071326 18%, #07132660 55%, #07132630)" }} />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-[15%] w-[500px] h-[500px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }} />
        <div className="absolute bottom-0 right-[20%] w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #CDBB9A, transparent 70%)" }} />
      </div>

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]"
           style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full min-h-[440px] md:min-h-[500px] max-h-[580px] max-w-[1440px] items-center px-5 md:px-10">
        <div className="flex w-full flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-start gap-8">
          {/* Text block */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[28rem] space-y-4"
            >
              <span className="inline-block rounded-full px-3.5 py-1.5 text-[0.62rem] font-bold tracking-[0.15em] uppercase"
                    style={{ background: "#CDBB9A14", color: "#CDBB9A", border: "1px solid #CDBB9A25" }}>
                {slide.kicker}
              </span>

              <h1 className="text-[1.4rem] font-bold leading-[1.12] md:text-[1.7rem]"
                  style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}>
                {slide.headline}
              </h1>

              <p className="text-[0.82rem] leading-[1.75] max-w-[24rem]" style={{ color: "#94A3B8" }}>
                {slide.sub}
              </p>

              <div className="flex justify-center md:justify-start gap-2.5 pt-1">
                <Link to={slide.cta.to}>
                  <Button variant="cta" className="h-10 rounded-xl px-5 text-[0.8rem] font-bold shadow-lg shadow-primary/20">
                    <CtaIcon className="ml-1.5 h-4 w-4" /> {slide.cta.label}
                  </Button>
                </Link>
                <Link to={slide.ctaSecondary.to}>
                  <Button className="h-10 rounded-xl border px-5 text-[0.8rem] font-semibold transition-colors hover:bg-white/8"
                          style={{ borderColor: "#ffffff18", background: "transparent", color: "#CBD5E1" }}>
                    {slide.ctaSecondary.label}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right side: Countdown + mini photo strip */}
          <div className="hidden lg:flex flex-col items-center gap-5">
            {/* Countdown */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-6 py-5 backdrop-blur-sm"
                 style={{ boxShadow: "0 8px 32px hsl(220 60% 5% / 0.4)" }}>
              <p className="mb-3.5 text-center text-[0.66rem] font-semibold tracking-[0.14em] uppercase" style={{ color: "#CDBB9A" }}>
                الافتتاح الكبير
              </p>
              <CountdownTimer compact />
            </div>

            {/* Mini photo strip */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex gap-2"
              >
                {slide.photos.slice(0, 4).map((src, i) => (
                  <div key={i} className="h-[56px] w-[76px] overflow-hidden rounded-lg border border-white/10"
                       style={{ boxShadow: "0 4px 12px hsl(220 60% 5% / 0.3)" }}>
                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide indicators — enhanced */}
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
    </section>
  );
}
