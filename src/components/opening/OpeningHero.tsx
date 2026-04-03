import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Gift, MapPin, Sparkles, Clock, ChevronLeft } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const featureItems = [
  { icon: Calendar, text: "جدول فعاليات كامل" },
  { icon: Gift, text: "مكافآت مرتبطة بالحضور" },
  { icon: MapPin, text: "خطّط زيارتك مسبقًا" },
];

export function OpeningHero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(165deg, #050E1C 0%, #0B1B34 40%, #0D1F3C 70%, #071326 100%)" }}>
      {/* Layered ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-full w-2/5 opacity-[0.04]"
             style={{ background: "linear-gradient(180deg, hsl(222 58% 42%), transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 h-3/5 w-1/2 opacity-[0.03]"
             style={{ background: "radial-gradient(ellipse at bottom left, hsl(25 80% 50%), transparent 65%)" }} />
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.012]"
             style={{ backgroundImage: "radial-gradient(circle, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Primary accent glow */}
        <div className="absolute right-1/4 top-1/4 h-[350px] w-[350px] rounded-full opacity-[0.06]"
             style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }} />
      </div>

      <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-14">
        <div className="grid min-h-[56vh] items-center gap-8 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-4">
          {/* Text block */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-6"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
                   style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span className="font-poppins text-[0.65rem] font-bold tracking-[0.2em] uppercase text-primary">
                  1 مايو 2026
                </span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} className="max-w-[28rem] text-[1.8rem] font-extrabold leading-[1.12] md:text-[2.3rem] lg:text-[2.65rem]" style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}>
              الافتتاح الكبير
              <span className="block mt-1" style={{ color: "hsl(var(--primary))" }}>من الترقب إلى الحضور</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-[32rem] text-[0.92rem] leading-[2]" style={{ color: "hsl(220 14% 65%)" }}>
              الموعد، الفعاليات، وآلية المشاركة في المكافآت — كل ما تحتاج معرفته قبل يوم الافتتاح.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-1">
              <Link to="/spin-win">
                <Button variant="cta" size="lg" className="h-12 gap-2 rounded-xl px-8 font-bold shadow-lg shadow-primary/20">
                  <Sparkles className="h-4 w-4" /> أدر واربح الآن
                </Button>
              </Link>
              <Link to="/map">
                <Button
                  size="lg"
                  className="h-12 gap-2 rounded-xl border px-8 font-semibold transition-all hover:bg-white/[0.08]"
                  style={{ borderColor: "hsl(0 0% 100% / 0.12)", background: "hsl(0 0% 100% / 0.04)", color: "#F8FAFC" }}
                >
                  <MapPin className="h-4 w-4" /> خريطة المول
                </Button>
              </Link>
            </motion.div>

            {/* Feature bar */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 border-t pt-5" style={{ borderColor: "hsl(0 0% 100% / 0.06)" }}>
              {featureItems.map((item, i) => (
                <div key={item.text} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "hsl(var(--primary) / 0.08)" }}>
                      <item.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-[0.78rem] font-semibold" style={{ color: "hsl(220 14% 68%)" }}>{item.text}</span>
                  </div>
                  {i < featureItems.length - 1 && <div className="hidden h-5 w-px sm:block" style={{ background: "hsl(0 0% 100% / 0.06)" }} />}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Countdown panel — premium glass card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-2xl p-1" style={{ background: "linear-gradient(135deg, hsl(222 60% 30% / 0.4), hsl(220 40% 18% / 0.3))" }}>
              <div className="rounded-[14px] p-6 md:p-8" style={{ background: "linear-gradient(145deg, hsl(220 45% 12% / 0.95), hsl(222 50% 10% / 0.9))", backdropFilter: "blur(20px)", border: "1px solid hsl(220 40% 25% / 0.3)" }}>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "hsl(var(--primary) / 0.1)" }}>
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-poppins text-[0.6rem] font-bold tracking-[0.2em] uppercase" style={{ color: "hsl(220 14% 50%)" }}>
                        العد التنازلي
                      </p>
                      <p className="text-[0.82rem] font-bold" style={{ color: "#F8FAFC" }}>حتى الافتتاح</p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: "hsl(var(--primary))" }} />
                </div>

                <CountdownTimer />

                {/* Mini info strip */}
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <Link to="/spin-win" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all hover:bg-white/[0.04]"
                        style={{ background: "hsl(0 0% 100% / 0.02)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
                    <div className="flex items-center gap-2">
                      <Gift className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[0.7rem] font-bold" style={{ color: "hsl(220 14% 72%)" }}>أدر واربح</span>
                    </div>
                    <ChevronLeft className="h-3 w-3" style={{ color: "hsl(220 14% 45%)" }} />
                  </Link>
                  <Link to="/map" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all hover:bg-white/[0.04]"
                        style={{ background: "hsl(0 0% 100% / 0.02)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[0.7rem] font-bold" style={{ color: "hsl(220 14% 72%)" }}>الخريطة</span>
                    </div>
                    <ChevronLeft className="h-3 w-3" style={{ color: "hsl(220 14% 45%)" }} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(to left, transparent 5%, hsl(var(--primary) / 0.3) 30%, hsl(25 95% 55% / 0.15) 70%, transparent 95%)" }} />
    </section>
  );
}
