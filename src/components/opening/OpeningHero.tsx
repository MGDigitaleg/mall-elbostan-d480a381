import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Gift, MapPin, Sparkles } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Button } from "@/components/ui/button";

const featureItems = [
  { icon: Calendar, text: "جدول فعاليات كامل" },
  { icon: Gift, text: "مكافآت مرتبطة بالحضور" },
  { icon: MapPin, text: "خطّط زيارتك مسبقًا" },
];

export function OpeningHero() {
  return (
    <section className="heritage-deep relative overflow-hidden">
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 55% 50% at 70% 40%, hsl(222 58% 42% / 0.07), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 40% 45% at 20% 80%, hsl(25 80% 50% / 0.04), transparent 60%)" }}
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-14">
        <div className="grid min-h-[52vh] items-center gap-8 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:py-0">
          {/* Text block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-primary/40" />
              <span className="font-poppins text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-primary/70">
                1 مايو 2026 — الافتتاح الكبير
              </span>
            </div>

            <h1 className="max-w-[26rem] text-[1.7rem] font-extrabold leading-[1.1] md:text-[2.15rem] lg:text-[2.45rem]" style={{ color: "#F8FAFC" }}>
              الافتتاح الكبير — من الترقب إلى الحضور
            </h1>

            <p className="max-w-[30rem] text-[0.92rem] leading-[2]" style={{ color: "hsl(220 14% 70%)" }}>
              الموعد، الفعاليات، وآلية المشاركة في المكافآت — كل ما تحتاج معرفته قبل يوم الافتتاح.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/spin-win">
                <Button variant="cta" size="lg" className="h-12 gap-2 rounded-xl px-7 font-bold">
                  <Sparkles className="h-4 w-4" /> أدر واربح الآن
                </Button>
              </Link>
              <Link to="/map">
                <Button
                  size="lg"
                  className="h-12 gap-2 rounded-xl border px-7 font-semibold"
                  style={{ borderColor: "hsl(0 0% 100% / 0.1)", background: "hsl(0 0% 100% / 0.05)", color: "#F8FAFC" }}
                >
                  <MapPin className="h-4 w-4" /> خريطة المول
                </Button>
              </Link>
            </div>

            {/* Feature bar */}
            <div className="flex flex-wrap items-center gap-4 border-t pt-5" style={{ borderColor: "hsl(0 0% 100% / 0.08)" }}>
              {featureItems.map((item, i) => (
                <div key={item.text} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-[0.78rem] font-semibold" style={{ color: "hsl(220 14% 72%)" }}>{item.text}</span>
                  </div>
                  {i < featureItems.length - 1 && <div className="hidden h-4 w-px sm:block" style={{ background: "hsl(0 0% 100% / 0.08)" }} />}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Countdown panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            <div className="heritage-surface rounded-2xl p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-[2px] w-6 bg-primary/35" />
                <span className="font-poppins text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-primary/60">
                  العد التنازلي
                </span>
              </div>
              <h2 className="mb-5 text-xl font-bold" style={{ color: "#F8FAFC" }}>الوقت المتبقي حتى الافتتاح</h2>
              <CountdownTimer />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
