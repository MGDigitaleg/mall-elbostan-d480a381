import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";
import heroImage from "@/assets/mall-exterior.jpg";
import interiorImage from "@/assets/mall-interior.jpg";
import facadeImage from "@/assets/mall-facade.jpg";

const OPENING_DATE = new Date("2026-05-01T00:00:00+02:00");

const slides = [
  {
    image: heroImage,
    kicker: "الإرث",
    headline: "بداية بنت السمعة.",
    sub: "أكثر من عقد في خدمة سوق التقنية.",
  },
  {
    image: interiorImage,
    kicker: "الفرع الجديد",
    headline: "وجهة جاهزة للسوق.",
    sub: "محلات متخصصة، خريطة تفاعلية، وعلامات معروفة.",
  },
  {
    image: facadeImage,
    kicker: "الافتتاح",
    headline: "١ مايو ٢٠٢٦.",
    sub: "جوائز وعروض حصرية يوم الافتتاح الكبير.",
  },
];

function MiniCountdown() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(OPENING_DATE);
  if (isExpired) return null;

  const blocks = [
    { v: days, l: "يوم" },
    { v: hours, l: "ساعة" },
    { v: minutes, l: "دقيقة" },
    { v: seconds, l: "ثانية" },
  ];

  return (
    <div className="flex gap-2" dir="ltr">
      {blocks.map((b) => (
        <div key={b.l} className="flex flex-col items-center">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg font-poppins text-[1rem] font-bold md:h-11 md:w-11 md:text-[1.1rem]"
            style={{ background: "#ffffff10", border: "1px solid #ffffff15", color: "#F8FAFC" }}
          >
            {String(b.v).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[0.55rem] font-medium" style={{ color: "#94A3B8" }}>{b.l}</span>
        </div>
      ))}
    </div>
  );
}

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-[52vh] min-h-[380px] max-h-[520px] overflow-hidden" style={{ background: "#071326" }}>
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.22 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
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
      <div className="absolute inset-0" style={{ background: "linear-gradient(to left, #071326 25%, #07132680 65%, #07132640)" }} />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-5 md:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            className="max-w-[30rem] space-y-4"
          >
            <span className="inline-block rounded-full px-3 py-1 text-[0.62rem] font-bold tracking-[0.15em] uppercase" style={{ background: "#CDBB9A20", color: "#CDBB9A", border: "1px solid #CDBB9A30" }}>
              {slide.kicker}
            </span>
            <h1 className="text-[1.6rem] font-bold leading-[1.12] md:text-[2rem]" style={{ color: "#F8FAFC" }}>
              {slide.headline}
            </h1>
            <p className="text-[0.85rem] leading-[1.65]" style={{ color: "#94A3B8" }}>
              {slide.sub}
            </p>

            {/* Integrated countdown */}
            <div className="pt-1">
              <MiniCountdown />
            </div>

            <div className="flex gap-2.5 pt-1">
              <Link to="/map">
                <Button variant="cta" className="h-10 rounded-lg px-5 text-[0.82rem] font-bold">
                  <Compass className="ml-1 h-3.5 w-3.5" /> استكشف الدليل
                </Button>
              </Link>
              <Link to="/stores">
                <Button className="h-10 rounded-lg border px-5 text-[0.82rem] font-semibold" style={{ borderColor: "#1E293B", background: "transparent", color: "#CBD5E1" }}>
                  تصفّح المحلات
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === current ? 28 : 8,
              background: i === current ? "#CDBB9A" : "#ffffff30",
            }}
          />
        ))}
      </div>
    </section>
  );
}
