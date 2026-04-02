import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

import heroImage from "@/assets/mall-exterior.jpg";
import entranceImage from "@/assets/mall-entrance.jpg";
import interiorImage from "@/assets/mall-interior.jpg";
import facadeImage from "@/assets/mall-facade.jpg";

const slides = [
  { src: heroImage, alt: "الواجهة الرئيسية لمول البستان", label: "الواجهة الخارجية" },
  { src: entranceImage, alt: "مدخل مول البستان", label: "المدخل الرئيسي" },
  { src: interiorImage, alt: "الأتريوم الداخلي", label: "التصميم الداخلي" },
  { src: facadeImage, alt: "زاوية معمارية", label: "تفاصيل معمارية" },
];

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [paused, next]);

  const goTo = (i: number) => {
    setActive(i);
    setPaused(true);
    setTimeout(() => setPaused(false), 8000);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* ── Main slide ── */}
      <div
        className="relative overflow-hidden rounded-xl"
        style={{ border: "1px solid hsl(var(--border))", aspectRatio: "16/10" }}
      >
        {slides.map((slide, i) => (
          <img
            key={slide.label}
            src={slide.src}
            alt={slide.alt}
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-[center_35%] img-grade-dark transition-opacity duration-700 ease-in-out",
              i === active ? "opacity-100" : "opacity-0",
            )}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}

        {/* Active label */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-md px-2 py-1" style={{ background: "#0009", backdropFilter: "blur(6px)" }}>
          <div className="h-1 w-1 rounded-full" style={{ background: "hsl(var(--accent-gold))" }} />
          <span className="text-[0.52rem] font-bold" style={{ color: "#CBD5E1" }}>
            {slides[active].label}
          </span>
        </div>
      </div>

      {/* ── Thumbnail rail ── */}
      <div className="flex gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.label}
            onClick={() => goTo(i)}
            className={cn(
              "relative flex-1 overflow-hidden rounded-lg transition-all duration-300",
              i === active
                ? "ring-1 ring-[hsl(var(--accent-gold))] opacity-100"
                : "opacity-50 hover:opacity-75",
            )}
            style={{ border: "1px solid hsl(var(--border))", aspectRatio: "16/9" }}
            aria-label={slide.label}
          >
            <img
              src={slide.src}
              alt=""
              className="h-full w-full object-cover object-[center_35%] img-grade-dark"
              loading="lazy"
            />
            {/* Progress bar on active */}
            {i === active && !paused && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "#ffffff15" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    background: "hsl(var(--accent-gold))",
                    animation: "hero-progress 5.5s linear",
                  }}
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
