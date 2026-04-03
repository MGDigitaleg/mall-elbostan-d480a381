import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function OpeningSponsors() {
  return (
    <section className="heritage-deep page-section">
      <div className="container max-w-[900px] text-center">
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.15)" }}
          >
            <Award className="h-6 w-6 text-primary" />
          </div>
          <p className="section-kicker">شراكات</p>
          <h2 className="section-title mx-auto max-w-[22rem]" style={{ color: "#F8FAFC" }}>الرعاة والشركاء</h2>
          <p className="mx-auto mt-3 max-w-md text-[0.92rem] leading-7" style={{ color: "hsl(220 15% 68%)" }}>
            تفاصيل الرعاة قيد التأكيد — ستُحدّث هذه المنطقة مع اقتراب موعد الافتتاح.
          </p>
          <Link to="/contact" className="mt-6 inline-block">
            <Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8">تواصل معنا للرعاية</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
