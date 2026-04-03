import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import heroImage from "@/assets/mall-exterior.jpg";
import interiorImage from "@/assets/mall-interior.jpg";
import facadeImage from "@/assets/mall-facade.jpg";

const slides = [
  {
    image: heroImage,
    kicker: "الإرث",
    headline: "بداية بنت السمعة.",
    sub: "أكثر من عقد في سوق التقنية المصري — من وسط البلد إلى القاهرة الجديدة.",
  },
  {
    image: interiorImage,
    kicker: "الفرع الجديد",
    headline: "وجهة تقنية جاهزة.",
    sub: "٥٣+ وحدة تجارية، خريطة تفاعلية، ومحلات تقنية معروفة.",
  },
  {
    image: facadeImage,
    kicker: "١ مايو ٢٠٢٦",
    headline: "الافتتاح الكبير.",
    sub: "جوائز وعروض حصرية يوم الافتتاح.",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-[50vh] min-h-[380px] max-h-[520px] overflow-hidden" style={{ background: "#071326" }}>
      {/* Background image — subtle */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover"
            loading={current === 0 ? "eager" : "lazy"}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to left, #071326 25%, #07132680 65%, #07132650)" }} />
      
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-40"
           style={{ background: "radial-gradient(ellipse 40% 60% at 20% 60%, hsl(222 100% 59% / 0.08), transparent)" }} />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-5 md:px-10">
        <div className="flex w-full flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-start gap-8">
          {/* Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45 }}
              className="max-w-[26rem] space-y-3.5"
            >
              <span className="inline-block rounded-full px-3 py-1 text-[0.6rem] font-bold tracking-[0.15em] uppercase" style={{ background: "#CDBB9A18", color: "#CDBB9A", border: "1px solid #CDBB9A25" }}>
                {slide.kicker}
              </span>
              <h1 className="text-[1.3rem] font-bold leading-[1.15] md:text-[1.55rem]" style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}>
                {slide.headline}
              </h1>
              <p className="text-[0.8rem] leading-[1.7]" style={{ color: "#94A3B8" }}>
                {slide.sub}
              </p>
              <div className="flex justify-center md:justify-start gap-2.5 pt-1">
                <Link to="/map">
                  <Button variant="cta" className="h-9 rounded-lg px-4 text-[0.76rem] font-bold">
                    <Compass className="ml-1 h-3.5 w-3.5" /> استكشف الدليل
                  </Button>
                </Link>
                <Link to="/stores">
                  <Button className="h-9 rounded-lg border px-4 text-[0.76rem] font-semibold" style={{ borderColor: "#1E293B", background: "transparent", color: "#CBD5E1" }}>
                    تصفّح المحلات
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Countdown — integrated elegantly on desktop */}
          <div className="hidden lg:block">
            <div className="rounded-xl border border-white/8 bg-white/[0.04] px-5 py-4 backdrop-blur-sm">
              <p className="mb-3 text-center text-[0.65rem] font-semibold tracking-[0.12em] uppercase" style={{ color: "#CDBB9A" }}>
                الافتتاح الكبير
              </p>
              <CountdownTimer compact />
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 6,
              background: i === current ? "#CDBB9A" : "#ffffff25",
            }}
          />
        ))}
      </div>
    </section>
  );
}
