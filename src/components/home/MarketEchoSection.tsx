import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Store, Map, ShoppingBag, ArrowLeft } from "lucide-react";

/* ── Floating echo phrases ── */
const echoFragments = [
  { text: "انزل البستان", x: "8%", y: "12%", size: "1.1rem", delay: 0 },
  { text: "لف البستان الأول", x: "62%", y: "8%", size: "0.95rem", delay: 1.2 },
  { text: "اسأل في البستان", x: "78%", y: "38%", size: "1rem", delay: 2.8 },
  { text: "البستان فيه كل حاجة", x: "15%", y: "55%", size: "0.88rem", delay: 0.8 },
  { text: "اسم يعرفه السوق", x: "45%", y: "72%", size: "0.92rem", delay: 3.5 },
  { text: "مكان للمقارنة", x: "82%", y: "65%", size: "0.85rem", delay: 2.0 },
  { text: "خبرة ممتدة", x: "28%", y: "82%", size: "0.82rem", delay: 4.2 },
  { text: "الثقة أولًا", x: "55%", y: "28%", size: "0.9rem", delay: 1.6 },
  { text: "أسعار البستان", x: "38%", y: "42%", size: "0.86rem", delay: 3.0 },
];

/* ── Feature points ── */
const features = [
  { icon: Store, label: "دليل محلات أوضح", desc: "كل محل بتفاصيله الكاملة في مكان واحد." },
  { icon: Map, label: "خريطة تفاعلية أدق", desc: "تصفّح كل دور واعرف مكان كل وحدة." },
  { icon: ShoppingBag, label: "منتجات تصل بك أسرع", desc: "تصفّح منتجات المحلات واطلب مباشرة." },
];

/* ── Single floating phrase component ── */
function EchoPhrase({
  text, x, y, size, delay, isVisible,
}: {
  text: string; x: string; y: string; size: string; delay: number; isVisible: boolean;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setShow(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [isVisible, delay]);

  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          animate={{
            opacity: [0, 0.45, 0.3, 0.45, 0.2],
            filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(4px)"],
            y: [12, 0, -4, -6, -10],
          }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
          className="absolute select-none font-bold whitespace-nowrap pointer-events-none"
          style={{
            left: x,
            top: y,
            fontSize: size,
            fontFamily: "var(--font-arabic-display)",
            color: "#CDBB9A",
          }}
          aria-hidden="true"
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function MarketEchoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        background: "linear-gradient(160deg, #060E1C 0%, #0A1628 40%, #071326 100%)",
      }}
    >
      {/* ── Decorative background ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Ambient glows */}
        <div
          className="absolute top-[20%] left-[15%] h-[500px] w-[500px] rounded-full opacity-[0.025]"
          style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[15%] right-[10%] h-[400px] w-[400px] rounded-full opacity-[0.02]"
          style={{ background: "radial-gradient(circle, #CDBB9A, transparent 70%)" }}
        />
        {/* Central vertical line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="absolute left-1/2 top-[10%] h-[80%] w-px origin-top hidden lg:block"
          style={{
            background: "linear-gradient(to bottom, transparent, #CDBB9A18, #CDBB9A08, transparent)",
          }}
        />
      </div>

      {/* ── Layer 1: Floating echo phrases ── */}
      <div className="pointer-events-none absolute inset-0">
        {echoFragments.map((frag, i) => (
          <EchoPhrase key={i} {...frag} isVisible={isInView} />
        ))}
      </div>

      {/* ── Layer 2: Main content ── */}
      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:items-center">
          {/* Right column (RTL): Heading area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Section label */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mb-5 inline-block rounded-full px-4 py-1.5 text-[0.6rem] font-bold tracking-[0.15em] uppercase"
              style={{ background: "#CDBB9A10", color: "#CDBB9A", border: "1px solid #CDBB9A20" }}
            >
              صدى السوق
            </motion.span>

            {/* Heading with reveal */}
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="text-[1.4rem] md:text-[1.75rem] font-bold leading-[1.1]"
              style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}
            >
              الاسم الذي ظل يتردد
              <br />
              <span style={{ color: "#CDBB9A" }}>في السوق.</span>
            </motion.h2>

            {/* Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 text-[0.84rem] leading-[1.9] max-w-md"
              style={{ color: "#94A3B8" }}
            >
              على مدار سنوات، ارتبط اسم مول البستان بالبحث والمقارنة والثقة.
              لم يكن مجرد اسم لمبنى، بل اسمًا يعرفه من يبحث عن الخيارات المناسبة في عالم التقنية.
            </motion.p>

            {/* Bridge line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="mt-5 flex items-center gap-3"
            >
              <div className="h-px w-8 shrink-0" style={{ background: "linear-gradient(to left, #CDBB9A40, transparent)" }} />
              <p className="text-[0.8rem] font-bold" style={{ color: "#CDBB9A", fontFamily: "var(--font-arabic-display)" }}>
                واليوم، تتحول هذه الذاكرة إلى تجربة رقمية أوضح.
              </p>
            </motion.div>
          </motion.div>

          {/* Left column (RTL): Features + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 lg:mt-0"
          >
            {/* Feature items */}
            <div className="space-y-4">
              {features.map((feat, i) => (
                <motion.div
                  key={feat.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 2.0 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex items-start gap-4 rounded-xl p-4 transition-all duration-300 hover:bg-white/[0.03]"
                  style={{ border: "1px solid transparent" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ffffff0D")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
                >
                  <div
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
                    style={{ background: "#2563EB10", border: "1px solid #2563EB22" }}
                  >
                    <feat.icon className="h-4 w-4" style={{ color: "#60A5FA" }} />
                  </div>
                  <div>
                    <p className="text-[0.9rem] font-bold" style={{ color: "#F1F5F9" }}>
                      {feat.label}
                    </p>
                    <p className="mt-1 text-[0.78rem] leading-[1.7]" style={{ color: "#7C8BA1" }}>
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Closing line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 2.8 }}
              className="mt-6 text-[0.78rem] leading-[1.85] pr-4"
              style={{ color: "#64748B" }}
            >
              ما كان الناس يرددونه قديمًا، نترجمه اليوم إلى تجربة أسهل وأوضح داخل الموقع.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 3.0 }}
              className="mt-6"
            >
              <Link to="/stores">
                <Button
                  variant="cta"
                  className="h-11 rounded-xl px-7 text-[0.84rem] font-bold gap-2 shadow-lg shadow-primary/20"
                >
                  <Store className="h-3.5 w-3.5" />
                  استكشف دليل المحلات
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        style={{ background: "linear-gradient(90deg, transparent 10%, #CDBB9A12, transparent 90%)" }}
      />
    </section>
  );
}
