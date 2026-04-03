import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Handshake, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function OpeningSponsors() {
  return (
    <section className="relative overflow-hidden py-12 md:py-16" style={{ background: "linear-gradient(165deg, #050E1C 0%, #0B1B34 50%, #071326 100%)" }}>
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[500px] rounded-full opacity-[0.04]"
             style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 65%)" }} />
      </div>

      <div className="relative container max-w-[900px] text-center">
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
               style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
            <Award className="h-7 w-7 text-primary" />
          </div>
          <p className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.25em] text-primary/70">شراكات</p>
          <h2 className="mt-1.5 text-[1.15rem] font-bold md:text-[1.4rem] mx-auto max-w-[22rem]" style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}>
            الرعاة والشركاء
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[0.88rem] leading-[1.8]" style={{ color: "hsl(220 15% 62%)" }}>
            تفاصيل الرعاة قيد التأكيد — ستُحدّث هذه المنطقة مع اقتراب موعد الافتتاح.
          </p>

          {/* Partnership CTA cards */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-md mx-auto">
            <Link to="/contact" className="flex items-center justify-between rounded-xl px-5 py-4 transition-all hover:shadow-lg"
                  style={{ background: "hsl(0 0% 100% / 0.03)", border: "1px solid hsl(0 0% 100% / 0.08)" }}>
              <div className="flex items-center gap-3">
                <Handshake className="h-5 w-5 text-primary" />
                <span className="text-[0.82rem] font-bold" style={{ color: "#F8FAFC" }}>كن شريكًا</span>
              </div>
              <ArrowLeft className="h-4 w-4" style={{ color: "hsl(220 14% 45%)" }} />
            </Link>
            <Link to="/contact" className="flex items-center justify-between rounded-xl px-5 py-4 transition-all hover:shadow-lg"
                  style={{ background: "hsl(0 0% 100% / 0.03)", border: "1px solid hsl(0 0% 100% / 0.08)" }}>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-[0.82rem] font-bold" style={{ color: "#F8FAFC" }}>رعاية الافتتاح</span>
              </div>
              <ArrowLeft className="h-4 w-4" style={{ color: "hsl(220 14% 45%)" }} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
