import { useState, useEffect, useCallback, useRef, useLayoutEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Compass, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";

import ncHero1 from "@/assets/nc-hero-1-enhanced.webp";
import dtHero1 from "@/assets/downtown-hero-1.webp";
import ncHero3 from "@/assets/nc-hero-3-enhanced.webp";
import downtownHeroNight from "@/assets/downtown-hero-night-clean2.webp";

const slides = [
  {
    image: ncHero1,
    alt: "مول البستان — أكبر مول كمبيوتر وموبايلات في القاهرة الجديدة، التجمع الخامس",
    kicker: "أكبر مول تكنولوجيا",
    headline: "محلات كمبيوتر، موبايلات، وإلكترونيات في مكان واحد.",
    sub: "أكثر من 150 محل متخصص في اللابتوبات، الهواتف، الجيمنج، والإكسسوارات — في قلب التجمع الخامس بالقاهرة الجديدة.",
    cta: { label: "اكتشف المحلات", to: "/stores", icon: Compass },
    ctaSecondary: { label: "الخريطة التفاعلية", to: "/map" },
  },
  {
    image: dtHero1,
    alt: "مول البستان وسط البلد — أقدم مول إلكترونيات في مصر",
    kicker: "منذ ١٩٩٠",
    headline: "الاسم الذي يثق فيه سوق التقنية.",
    sub: "ثلاثة عقود من الخبرة في بيع الكمبيوتر والإلكترونيات — من وسط البلد إلى التجمع الخامس.",
    cta: { label: "دليل المحلات", to: "/stores", icon: Compass },
    ctaSecondary: { label: "فرع وسط البلد", to: "/downtown-branch" },
  },
  {
    image: downtownHeroNight,
    alt: "مول البستان ليلاً — أول مول متخصص في الإلكترونيات بمصر",
    kicker: "الأول في مصر",
    headline: "أول مول متخصص في الإلكترونيات بمصر.",
    sub: "منذ عام 1990 ونحن الوجهة الأولى لمحلات الكمبيوتر والموبايلات في القاهرة.",
    cta: { label: "اعرف أكثر", to: "/downtown-branch", icon: Compass },
    ctaSecondary: { label: "دليل المحلات", to: "/downtown-directory" },
  },
  {
    image: ncHero3,
    alt: "التصميم الداخلي لمول البستان — فرع القاهرة الجديدة، وحدات تجارية متاحة",
    kicker: "فرع القاهرة الجديدة",
    headline: "وجهتك للتقنية في قلب القاهرة الجديدة.",
    sub: "محلات متخصصة، وحدات تجارية متاحة للإيجار، وتجربة تسوّق منظمة في التجمع الخامس.",
    cta: { label: "الوحدات المتاحة", to: "/leasing", icon: MapPin },
    ctaSecondary: { label: "اكتشف المحلات", to: "/stores" },
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const touchStart = useRef<number | null>(null);

  useLayoutEffect(() => {
    const firstImage = slides[0].image;
    if (typeof firstImage === "string" && !document.querySelector(`link[href="${firstImage}"]`)) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = firstImage;
      link.fetchPriority = "high";
      document.head.appendChild(link);
    }
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrent((prev) => {
      setDirection(index > prev ? 1 : -1);
      return index;
    });
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [isPaused, next]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { setDirection(-1); setCurrent((c) => (c + 1) % slides.length); }
      else { setDirection(1); setCurrent((c) => (c - 1 + slides.length) % slides.length); }
    }
    touchStart.current = null;
  }, []);

  const slide = slides[current];
  const CtaIcon = slide.cta.icon;

  const imageVariants = useMemo(() => ({
    enter: { opacity: 0, scale: 1.05 },
    center: { opacity: 1, scale: 1, transition: { opacity: { duration: 0.8, ease: "easeOut" }, scale: { duration: 6, ease: "easeOut" } } },
    exit: { opacity: 0, transition: { duration: 0.6, ease: "easeIn" } },
  }), []);

  const textVariants = useMemo(() => ({
    enter: (d: number) => ({ opacity: 0, x: d * 30 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 } },
    exit: (d: number) => ({ opacity: 0, x: d * -20, transition: { duration: 0.3 } }),
  }), []);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ contain: "layout style", background: "#0a1628" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background */}
      <AnimatePresence initial={false}>
        <motion.div key={current} className="absolute inset-0 will-change-[opacity,transform]" variants={imageVariants} initial="enter" animate="center" exit="exit">
          <img
            src={slide.image} alt={slide.alt} width={1376} height={768}
            className="h-full w-full object-cover"
            style={{ filter: "saturate(0.85) brightness(1.08) contrast(0.95)", objectPosition: "center 40%" }}
            loading={current === 0 ? "eager" : "lazy"}
            decoding={current === 0 ? "sync" : "async"}
            fetchPriority={current === 0 ? "high" : "low"}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(to top, hsla(218, 55%, 7%, 0.92) 0%, hsla(218, 50%, 10%, 0.6) 45%, hsla(218, 50%, 8%, 0.5) 100%)" }} />
      <div className="absolute inset-y-0 right-0 w-[50%] z-[2] hidden md:block" style={{ background: "linear-gradient(to left, hsla(218, 55%, 7%, 0.5), transparent)" }} />

      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        <div className="absolute top-1/4 left-[12%] w-[350px] h-[350px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full min-h-[460px] md:min-h-[480px] max-w-[1440px] flex-col justify-center px-5 md:px-10 pt-[64px] md:pt-[68px] pb-7">
        <div className="flex w-full flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-start gap-6 md:gap-8">
          {/* Text */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={current} custom={direction} variants={textVariants} initial="enter" animate="center" exit="exit" className="max-w-[32rem] space-y-3 md:space-y-4">
              <span className="inline-block rounded-full px-3.5 py-1.5 text-[0.6rem] md:text-[0.62rem] font-bold tracking-[0.15em] uppercase" style={{ background: "#CDBB9A14", color: "#CDBB9A", border: "1px solid #CDBB9A25" }}>
                {slide.kicker}
              </span>

              <h1 className="text-[1.5rem] font-bold leading-[1.2] md:text-[2rem]" style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}>
                {slide.headline}
              </h1>

              <p className="text-[0.82rem] md:text-[0.88rem] leading-[1.75] max-w-[26rem] mx-auto md:mx-0" style={{ color: "#B0BEC5" }}>
                {slide.sub}
              </p>

              <div className="flex justify-center md:justify-start gap-2.5 pt-1">
                <Link to={slide.cta.to}>
                  <Button variant="cta" className="h-10 md:h-11 rounded-xl px-5 md:px-6 text-[0.82rem] md:text-[0.86rem] font-bold shadow-lg shadow-primary/20">
                    <CtaIcon className="ml-1.5 h-4 w-4" /> {slide.cta.label}
                  </Button>
                </Link>
                <Link to={slide.ctaSecondary.to}>
                  <Button className="h-10 md:h-11 rounded-xl border px-5 md:px-6 text-[0.82rem] md:text-[0.86rem] font-semibold transition-colors hover:bg-white/[0.08]" style={{ borderColor: "#ffffff18", background: "transparent", color: "#CBD5E1" }}>
                    {slide.ctaSecondary.label}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Countdown removed pre-launch — focus on destination identity */}
        </div>

        {/* Trust bar — slimmer */}
        <div className="mt-auto rounded-lg border backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 flex items-center justify-center gap-4 md:gap-7" style={{ borderColor: "hsla(0, 0%, 100%, 0.05)", background: "hsla(220, 45%, 10%, 0.4)" }}>
          {[
            { value: "+150", label: "محل متخصص" },
            { value: "3", label: "أدوار" },
            { value: "1990", label: "التأسيس" },
            { value: "2", label: "فرعين" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className="font-poppins text-[0.74rem] md:text-[0.84rem] font-extrabold leading-none" style={{ color: "#F8FAFC" }}>{s.value}</span>
              <span className="text-[0.52rem] md:text-[0.58rem] font-medium" style={{ color: "#94A3B8" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <button onClick={prev} className="group absolute top-1/2 right-4 z-10 hidden md:flex -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110" style={{ borderColor: "hsla(0,0%,100%,0.12)", background: "hsla(220,45%,10%,0.5)", color: "#CBD5E1" }} aria-label="الشريحة التالية">
        <ChevronRight className="h-5 w-5 transition-colors group-hover:text-[#CDBB9A]" />
      </button>
      <button onClick={next} className="group absolute top-1/2 left-4 z-10 hidden md:flex -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110" style={{ borderColor: "hsla(0,0%,100%,0.12)", background: "hsla(220,45%,10%,0.5)", color: "#CBD5E1" }} aria-label="الشريحة السابقة">
        <ChevronLeft className="h-5 w-5 transition-colors group-hover:text-[#CDBB9A]" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className="relative flex items-center justify-center transition-all duration-500" style={{ width: i === current ? 40 : 24, height: 24, padding: "9px 0" }} aria-label={`شريحة ${i + 1}`}>
            <span className="block w-full rounded-full overflow-hidden relative" style={{ height: 6, background: i === current ? "transparent" : "#ffffff20" }}>
              {i === current && (
                <>
                  <div className="absolute inset-0 rounded-full" style={{ background: "#CDBB9A40" }} />
                  <motion.div className="absolute inset-0 rounded-full origin-right" style={{ background: "#CDBB9A" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5, ease: "linear" }} />
                </>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
