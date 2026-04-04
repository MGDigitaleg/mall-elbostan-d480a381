import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";

const quotes = [
  {
    phrase: "انزل البستان",
    explanation: "عبارة كانت تختصر بداية البحث عن الخيارات المناسبة في عالم التقنية.",
  },
  {
    phrase: "لف البستان الأول",
    explanation: "لأن المقارنة بين المحلات كانت دائمًا خطوة أساسية قبل اتخاذ القرار.",
  },
  {
    phrase: "البستان هتلاقي فيه كل حاجة",
    explanation: "تعبير ارتبط بتنوع المحلات والخدمات والخيارات داخل المكان.",
  },
  {
    phrase: "اسأل في البستان",
    explanation: "لأن الاسم ارتبط بالخبرة والثقة والمعرفة بالسوق.",
  },
];

const cardReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function MarketMemorySection() {
  return (
    <section
      className="relative overflow-hidden py-16 md:py-20"
      style={{
        background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
      }}
    >
      {/* ── Decorative layers ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
        {/* Ambient glow */}
        <div
          className="absolute top-1/3 left-[8%] h-[450px] w-[450px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[10%] right-[12%] h-[350px] w-[350px] rounded-full opacity-[0.025]"
          style={{ background: "radial-gradient(circle, #CDBB9A, transparent 70%)" }}
        />
        {/* Oversized quotation mark — background accent */}
        <div
          className="absolute top-8 right-[6%] select-none opacity-[0.025] hidden md:block"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(14rem, 22vw, 20rem)",
            lineHeight: 1,
            color: "#CDBB9A",
          }}
          aria-hidden="true"
        >
          &ldquo;
        </div>
      </div>

      <div className="container relative z-10 max-w-5xl">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 md:mb-12 max-w-2xl"
        >
          <span
            className="mb-4 inline-block rounded-full px-3.5 py-1.5 text-[0.6rem] font-bold tracking-[0.15em] uppercase"
            style={{ background: "#CDBB9A14", color: "#CDBB9A", border: "1px solid #CDBB9A25" }}
          >
            من الذاكرة التجارية
          </span>

          <h2
            className="text-[1.35rem] md:text-[1.65rem] font-bold leading-[1.12]"
            style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}
          >
            اسم ارتبط بذاكرة السوق.
          </h2>

          <p
            className="mt-3 text-[0.84rem] leading-[1.85] max-w-xl"
            style={{ color: "#94A3B8" }}
          >
            على مدار سنوات، ارتبط اسم مول البستان بعبارات متداولة بين الناس، لأنها كانت تشير إلى
            مكان معروف في عالم التقنية. لم تكن هذه الجمل مجرد كلام عابر، بل انعكاسًا لثقة حقيقية
            وحضور واضح في السوق.
          </p>
        </motion.div>

        {/* ── Quote cards grid ── */}
        <div className="grid gap-3 sm:grid-cols-2">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="group relative rounded-2xl p-6 md:p-7 transition-all duration-300 hover:bg-white/[0.04]"
              style={{
                background: "#ffffff04",
                border: "1px solid #ffffff0D",
              }}
            >
              {/* Quotation accent */}
              <span
                className="absolute top-4 right-5 select-none opacity-[0.06] transition-opacity duration-300 group-hover:opacity-[0.12]"
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "4rem",
                  lineHeight: 1,
                  color: "#CDBB9A",
                }}
                aria-hidden="true"
              >
                &rdquo;
              </span>

              <p
                className="relative text-[1.05rem] md:text-[1.15rem] font-bold leading-[1.3]"
                style={{ fontFamily: "var(--font-arabic-display)", color: "#F1F5F9" }}
              >
                {q.phrase}
              </p>

              <p
                className="mt-2.5 text-[0.8rem] leading-[1.8] max-w-sm"
                style={{ color: "#7C8BA1" }}
              >
                {q.explanation}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-6 right-6 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(90deg, transparent, #CDBB9A30, transparent)",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* ── Closing line + CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 md:mt-12 max-w-2xl"
        >
          <p className="text-[0.82rem] leading-[1.85]" style={{ color: "#94A3B8" }}>
            ما كان الناس يرددونه قديمًا، يتحول اليوم إلى تجربة أوضح عبر دليل المحلات، والخريطة
            التفاعلية، ومنتجات المحلات في مكان واحد.
          </p>

          <div className="mt-5">
            <Link to="/stores">
              <Button
                variant="cta"
                className="h-10 rounded-xl px-6 text-[0.82rem] font-bold gap-1.5 shadow-lg shadow-primary/20"
              >
                <Store className="h-3.5 w-3.5" /> استكشف الدليل
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        style={{ background: "linear-gradient(90deg, transparent 10%, #CDBB9A15, transparent 90%)" }}
      />
    </section>
  );
}
