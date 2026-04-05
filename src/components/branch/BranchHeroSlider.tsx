import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface HeroSlide {
  src: string;
  alt: string;
}

interface BranchHeroSliderProps {
  slides: HeroSlide[];
  kicker: string;
  title: React.ReactNode;
  subtitle: string;
  children?: React.ReactNode;
}

export function BranchHeroSlider({ slides, kicker, title, subtitle, children }: BranchHeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [isPaused, next]);

  return (
    <section
      className="relative flex min-h-[480px] items-end overflow-hidden md:min-h-[520px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
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
            src={slides[current].src}
            alt={slides[current].alt}
            className="h-full w-full object-cover"
            style={{ filter: "saturate(0.85) brightness(1.08) contrast(0.95)" }}
            loading={current === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={current === 0 ? "high" : "auto"}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(to top, hsla(218, 55%, 7%, 0.88) 0%, hsla(218, 50%, 10%, 0.5) 45%, hsla(218, 50%, 8%, 0.4) 100%)" }} />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        <div className="absolute bottom-0 left-[15%] h-[400px] w-[400px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }} />
        <div className="absolute top-1/3 right-[10%] h-[300px] w-[300px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #CDBB9A, transparent 70%)" }} />
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.02]"
        style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "80px 80px" }}
      />

      {/* Content */}
      <div className="container relative z-10 max-w-6xl pb-12 pt-[80px] md:pt-36 md:pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span
            className="mb-4 inline-block rounded-full px-3.5 py-1.5 text-[0.62rem] font-bold tracking-[0.15em] uppercase"
            style={{ background: "#CDBB9A14", color: "#CDBB9A", border: "1px solid #CDBB9A25" }}
          >
            {kicker}
          </span>
          <h1
            className="max-w-[30rem] text-[1.6rem] font-bold leading-[1.15] md:text-[2.2rem]"
            style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}
          >
            {title}
          </h1>
          <p className="mt-3 max-w-[28rem] text-[0.88rem] leading-[1.85]" style={{ color: "#94A3B8" }}>
            {subtitle}
          </p>
          {children}
        </motion.div>
      </div>

      {/* Progress indicators */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
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
                  transition={{ duration: 6, ease: "linear" }}
                />
              </>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
