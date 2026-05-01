import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Compass, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";


import ncHero1 from "@/assets/nc-hero-1-enhanced.webp";
import dtHero1 from "@/assets/downtown-hero-1.webp";
import ncHero3 from "@/assets/nc-hero-3-enhanced.webp";
import downtownHeroNight from "@/assets/downtown-hero-night-clean2.webp";

const slides = [
  {
    image: ncHero1,
    alt: "مول البستان — القاهرة الجديدة",
    kicker: "وجهتك التقنية",
    headline: "كل ما تحتاجه في التقنية، تحت سقف واحد.",
    sub: "+150 محل متخصص في قلب التجمع الخامس.",
    cta: { label: "اكتشف المحلات", to: "/stores" },
    ctaSecondary: { label: "الخريطة", to: "/map" },
  },
  {
    image: dtHero1,
    alt: "مول البستان — وسط البلد",
    kicker: "منذ ١٩٩٠",
    headline: "الاسم الذي بناه السوق.",
    sub: "ثلاثة عقود من الثقة في سوق التقنية.",
    cta: { label: "دليل المحلات", to: "/stores" },
    ctaSecondary: { label: "وسط البلد", to: "/downtown-branch" },
  },
  {
    image: downtownHeroNight,
    alt: "مول البستان وسط البلد ليلاً",
    kicker: "الأول في مصر",
    headline: "سوق التقنية بدأ من هنا.",
    sub: "أول مول متخصص في الإلكترونيات في مصر.",
    cta: { label: "اعرف أكثر", to: "/downtown-branch" },
    ctaSecondary: { label: "المحلات", to: "/downtown-directory" },
  },
  {
    image: ncHero3,
    alt: "فرع القاهرة الجديدة",
    kicker: "فرع القاهرة الجديدة",
    headline: "وجهتك للتقنية في التجمع الخامس.",
    sub: "محلات متخصصة ووحدات تجارية متاحة.",
    cta: { label: "الوحدات المتاحة", to: "/leasing" },
    ctaSecondary: { label: "المحلات", to: "/stores" },
  },
];

export function HeroSliderMobile() {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef<number | null>(null);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) setCurrent((c) => diff > 0 ? (c + 1) % slides.length : (c - 1 + slides.length) % slides.length);
    touchStart.current = null;
  };

  const slide = slides[current];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ contain: "layout style", background: "#0a1628" }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {slides.map((s, i) => {
        const nextIdx = (current + 1) % slides.length;
        if (i !== current && i !== nextIdx) return null;
        return (
          <img key={i} src={s.image} alt={s.alt} width={1376} height={768}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 70%", opacity: i === current ? 1 : 0, transition: "opacity 600ms ease-in-out", filter: "saturate(0.9) brightness(1.05)" }}
            loading={i === 0 ? "eager" : "lazy"} decoding={i === 0 ? "sync" : "async"} fetchPriority={i === 0 ? "high" : "low"}
          />
        );
      })}

      <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(to top, hsla(218, 55%, 7%, 0.95) 0%, hsla(218, 50%, 10%, 0.65) 50%, hsla(218, 50%, 8%, 0.45) 100%)" }} />

      <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-end px-5 pt-[80px] pb-16" style={{ position: "absolute", inset: 0 }}>
        {/* Countdown removed pre-launch */}

        {/* Text */}
        <div className="text-center space-y-2.5" key={current} style={{ animation: "heroFadeUp 500ms ease-out" }}>
          <span className="inline-block rounded-full px-3 py-1 text-[0.58rem] font-bold tracking-[0.15em] uppercase" style={{ background: "#CDBB9A14", color: "#CDBB9A", border: "1px solid #CDBB9A25" }}>
            {slide.kicker}
          </span>

          <h1 className="text-[1.35rem] font-bold leading-[1.25]" style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}>
            {slide.headline}
          </h1>

          <p className="text-[0.82rem] leading-[1.6] max-w-[20rem] mx-auto" style={{ color: "#B0BEC5" }}>
            {slide.sub}
          </p>

          <div className="flex justify-center gap-2 pt-2">
            <Link to={slide.cta.to}>
              <Button variant="cta" className="h-11 rounded-xl px-5 text-[0.82rem] font-bold shadow-lg shadow-primary/20">
                {slide.cta.to === "/stores" ? <Compass className="ml-1.5 h-4 w-4" /> : <MapPin className="ml-1.5 h-4 w-4" />}
                {slide.cta.label}
              </Button>
            </Link>
            <Link to={slide.ctaSecondary.to}>
              <Button className="h-11 rounded-xl border px-5 text-[0.8rem] font-semibold" style={{ borderColor: "#ffffff20", background: "transparent", color: "#CBD5E1" }}>
                {slide.ctaSecondary.label}
              </Button>
            </Link>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i === current ? 28 : 14, background: i === current ? "#CDBB9A" : "#ffffff30" }} aria-label={`شريحة ${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
