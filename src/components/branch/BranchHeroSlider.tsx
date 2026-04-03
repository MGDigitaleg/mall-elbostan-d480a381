import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="relative flex min-h-[56vh] items-end overflow-hidden md:min-h-[52vh]">
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
            loading={current === 0 ? "eager" : "lazy"}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: "linear-gradient(to top, hsl(var(--navy)) 0%, hsl(var(--navy) / 0.7) 40%, hsl(var(--navy) / 0.4) 100%)" }}
      />

      {/* Content */}
      <div className="container relative z-10 max-w-6xl pb-10 pt-36 md:pb-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[2px] w-8 rounded-full bg-accent" />
            <span className="font-poppins text-[0.58rem] font-bold tracking-[0.22em] uppercase text-accent">
              {kicker}
            </span>
          </div>
          <h1
            className="max-w-[30rem] text-[1.6rem] font-bold leading-[1.15] text-navy-foreground md:text-[2.2rem]"
            style={{ fontFamily: "var(--font-arabic-display)" }}
          >
            {title}
          </h1>
          <p className="mt-3 max-w-[28rem] text-[0.88rem] leading-[1.85] text-navy-foreground/75">
            {subtitle}
          </p>
          {children}
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current ? "w-6 bg-accent" : "w-1.5 bg-navy-foreground/30"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
