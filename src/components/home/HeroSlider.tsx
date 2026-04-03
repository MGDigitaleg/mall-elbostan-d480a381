import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
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
    photos: [dt1, dt2, dt3, dt4, dt5],
  },
  {
    kicker: "الفرع الجديد",
    headline: "وجهة تقنية جاهزة.",
    sub: "٥٣+ وحدة تجارية، خريطة تفاعلية، ومحلات تقنية معروفة.",
    photos: [nc1, nc2, nc3, nc4, dt5],
  },
  {
    kicker: "١ مايو ٢٠٢٦",
    headline: "الافتتاح الكبير.",
    sub: "جوائز وعروض حصرية يوم الافتتاح.",
    photos: [nc1, dt1, nc3, dt3, nc4],
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
    <section className="relative min-h-[420px] md:min-h-[480px] max-h-[560px] overflow-hidden" style={{ background: "#071326" }}>
      {/* Photo mosaic background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Mosaic grid — visible as subtle background texture */}
          <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-5 grid-rows-2 gap-[2px] opacity-[0.18]">
            {slide.photos.map((src, i) => (
              <div
                key={i}
                className={`relative overflow-hidden ${
                  i === 0 ? "col-span-2 row-span-2" :
                  i === 3 ? "hidden md:block col-span-1 row-span-2" :
                  ""
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
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #071326 15%, #07132680 50%, #07132640)" }} />
      <div className="absolute inset-0 hidden md:block" style={{ background: "linear-gradient(to left, #071326 20%, #07132660 55%, #07132630)" }} />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: "radial-gradient(ellipse 40% 60% at 20% 60%, hsl(222 100% 59% / 0.08), transparent)" }} />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full min-h-[420px] md:min-h-[480px] max-h-[560px] max-w-[1440px] items-center px-5 md:px-10">
        <div className="flex w-full flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-start gap-8">
          {/* Text block */}
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

          {/* Right side: Countdown + mini photo strip */}
          <div className="hidden lg:flex flex-col items-center gap-4">
            {/* Countdown */}
            <div className="rounded-xl border border-white/8 bg-white/[0.04] px-5 py-4 backdrop-blur-sm">
              <p className="mb-3 text-center text-[0.65rem] font-semibold tracking-[0.12em] uppercase" style={{ color: "#CDBB9A" }}>
                الافتتاح الكبير
              </p>
              <CountdownTimer compact />
            </div>

            {/* Mini photo strip */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-1.5"
              >
                {slide.photos.slice(0, 4).map((src, i) => (
                  <div
                    key={i}
                    className="h-[52px] w-[72px] overflow-hidden rounded-md border border-white/10"
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
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
