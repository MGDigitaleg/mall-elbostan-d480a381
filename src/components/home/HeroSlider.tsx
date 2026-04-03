import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/mall-exterior.jpg";
import interiorImage from "@/assets/mall-interior.jpg";
import facadeImage from "@/assets/mall-facade.jpg";

const slides = [
  {
    image: heroImage,
    kicker: "الإرث",
    headline: "بداية بنت السمعة.",
    sub: "أكثر من عقد في خدمة سوق التقنية — من وسط البلد إلى القاهرة الجديدة.",
  },
  {
    image: interiorImage,
    kicker: "الفرع الجديد",
    headline: "وجهة جاهزة للسوق.",
    sub: "٥٣+ وحدة تجارية متخصصة، خريطة تفاعلية، ومتاجر معروفة.",
  },
  {
    image: facadeImage,
    kicker: "الافتتاح",
    headline: "١ مايو ٢٠٢٦.",
    sub: "جوائز، عروض حصرية، ومفاجآت يوم الافتتاح الكبير.",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-[44vh] min-h-[320px] max-h-[420px] overflow-hidden" style={{ background: "#071326" }}>
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
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
      <div className="absolute inset-0" style={{ background: "linear-gradient(to left, #071326 30%, #07132690 70%, #07132650)" }} />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-5 md:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="max-w-[28rem] space-y-3"
          >
            <span className="inline-block rounded-full px-3 py-1 text-[0.62rem] font-bold tracking-[0.15em] uppercase" style={{ background: "#CDBB9A20", color: "#CDBB9A", border: "1px solid #CDBB9A30" }}>
              {slide.kicker}
            </span>
            <h1 className="text-[1.4rem] font-bold leading-[1.15] md:text-[1.7rem]" style={{ color: "#F8FAFC" }}>
              {slide.headline}
            </h1>
            <p className="text-[0.82rem] leading-[1.7]" style={{ color: "#94A3B8" }}>
              {slide.sub}
            </p>
            <div className="flex gap-2.5 pt-1">
              <Link to="/map">
                <Button variant="cta" className="h-9 rounded-lg px-4 text-[0.78rem] font-bold">
                  <Compass className="ml-1 h-3.5 w-3.5" /> استكشف الدليل
                </Button>
              </Link>
              <Link to="/stores">
                <Button className="h-9 rounded-lg border px-4 text-[0.78rem] font-semibold" style={{ borderColor: "#1E293B", background: "transparent", color: "#CBD5E1" }}>
                  تصفّح المتاجر
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === current ? 24 : 8,
              background: i === current ? "#CDBB9A" : "#ffffff30",
            }}
          />
        ))}
      </div>
    </section>
  );
}
