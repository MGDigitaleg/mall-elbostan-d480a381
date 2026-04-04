import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Store, ArrowLeft } from "lucide-react";

import { echoFragments } from "@/components/market-echo/echoData";
import { EchoPhrase } from "@/components/market-echo/EchoPhrase";
import {
  FloatingParticles,
  PulseRings,
  ConnectingLines,
  QuoteMarks,
  ScanBeam,
} from "@/components/market-echo/EchoEffects";
import { EchoTimeline } from "@/components/market-echo/EchoTimeline";
import { EchoStats } from "@/components/market-echo/EchoStats";

const quoteCards = [
  {
    phrase: "انزل البستان",
    meaning: "العبارة الأشهر بين رواد السوق. كلما احتاج أحدهم لجهاز أو قطعة تقنية، كان الرد الجاهز: انزل البستان. لم تكن نصيحة، بل بداية كل رحلة شراء.",
  },
  {
    phrase: "لف البستان الأول",
    meaning: "قبل أي قرار شراء، كان التعارف يبدأ بجولة في البستان. المقارنة بين المحلات والأسعار والتشكيلات كانت طقسًا ثابتًا لكل مشتري ذكي.",
  },
  {
    phrase: "اسأل في البستان",
    meaning: "المكان الذي يثق الناس في معلوماته. سواء كنت تبحث عن رأي تقني أو مقارنة بين منتجات، البستان كان المرجع الأول للإجابة.",
  },
  {
    phrase: "أسعار البستان",
    meaning: "اسم أصبح مقياسًا للسعر العادل في السوق. حين يقول أحدهم: سعر البستان كام؟ فهو يسأل عن المعيار الذي يقيس عليه بقية الأسعار.",
  },
];


export function MarketEchoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  // Parallax scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const echoY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.1, 0.95]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.02, 0.06, 0.04, 0.02]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #060E1C 0%, #0A1628 40%, #071326 100%)",
        minHeight: "100vh",
      }}
    >
      {/* ── Decorative background with parallax ── */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ y: bgY }}>
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Ambient glows with parallax scale */}
        <motion.div
          className="absolute top-[12%] left-[8%] h-[650px] w-[650px] rounded-full"
          style={{
            background: "radial-gradient(circle, #2563EB, transparent 70%)",
            scale: glowScale,
            opacity: glowOpacity,
          }}
        />
        <motion.div
          className="absolute bottom-[8%] right-[6%] h-[550px] w-[550px] rounded-full"
          style={{
            background: "radial-gradient(circle, #CDBB9A, transparent 70%)",
            scale: glowScale,
            opacity: glowOpacity,
          }}
        />
        <motion.div
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, #06B6D4, transparent 70%)",
            scale: glowScale,
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.01, 0.03, 0.01]),
          }}
        />
        <div
          className="absolute top-[70%] left-[25%] h-[400px] w-[400px] rounded-full opacity-[0.02]"
          style={{ background: "radial-gradient(circle, #F97316, transparent 70%)" }}
        />

        {/* Central vertical line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="absolute left-1/2 top-[3%] h-[94%] w-px origin-top hidden lg:block"
          style={{
            background: "linear-gradient(to bottom, transparent, #CDBB9A22, #CDBB9A0C, #CDBB9A18, transparent)",
          }}
        />

        <ConnectingLines isVisible={isInView} />
        <PulseRings isVisible={isInView} />
        <ScanBeam isVisible={isInView} />
      </motion.div>

      {/* ── Quotation marks ── */}
      <QuoteMarks isVisible={isInView} />

      {/* ── Layer 1: Floating echo phrases with parallax ── */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ y: echoY }}>
        {echoFragments.map((frag, i) => (
          <EchoPhrase key={i} frag={frag} isVisible={isInView} />
        ))}
        <FloatingParticles isVisible={isInView} />
      </motion.div>

      {/* ── Main content area — fills viewport ── */}
      <motion.div
        className="relative z-10 flex min-h-screen flex-col justify-center"
        style={{
          y: contentY,
          paddingTop: "clamp(5rem, 12vh, 8rem)",
          paddingBottom: "clamp(4rem, 10vh, 7rem)",
        }}
      >
        {/* ── Layer 2: Main content ── */}
        <div className="container">
          <div className="mx-auto max-w-4xl lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:items-center">
            {/* Right column (RTL): Heading area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Section label */}
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mb-5 inline-block rounded-full px-4 py-1.5 text-[0.6rem] font-bold tracking-[0.15em] uppercase"
                style={{ background: "#CDBB9A10", color: "#CDBB9A", border: "1px solid #CDBB9A20" }}
              >
                صدى السوق
              </motion.span>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                className="text-[1.5rem] md:text-[2rem] font-bold leading-[1.1]"
                style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}
              >
                الاسم الذي ظل يتردد
                <br />
                <motion.span
                  style={{ color: "#CDBB9A" }}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={isInView ? { opacity: 1, filter: "blur(0px)" } : {}}
                  transition={{ duration: 1, delay: 1.4 }}
                >
                  في السوق.
                </motion.span>
              </motion.h2>

              {/* Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 text-[0.88rem] leading-[1.95] max-w-md"
                style={{ color: "#94A3B8" }}
              >
                على مدار سنوات، ارتبط اسم مول البستان بالبحث والمقارنة والثقة.
                لم يكن مجرد اسم لمبنى، بل اسمًا يعرفه من يبحث عن الخيارات المناسبة في عالم التقنية.
              </motion.p>

              {/* Bridge line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.9 }}
                className="mt-6 flex items-center gap-3"
              >
                <motion.div
                  className="h-px shrink-0"
                  style={{ background: "linear-gradient(to left, #CDBB9A60, transparent)" }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: 32 } : {}}
                  transition={{ duration: 0.6, delay: 2.0 }}
                />
                <p
                  className="text-[0.82rem] font-bold"
                  style={{ color: "#CDBB9A", fontFamily: "var(--font-arabic-display)" }}
                >
                  واليوم، تتحول هذه الذاكرة إلى تجربة رقمية أوضح.
                </p>
              </motion.div>
            </motion.div>

            {/* Left column (RTL): Features + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 lg:mt-0"
            >
              <div className="space-y-4">
                {features.map((feat, i) => (
                  <motion.div
                    key={feat.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: 2.4 + i * 0.25,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group flex items-start gap-4 rounded-xl p-4 transition-all duration-300 hover:bg-white/[0.03]"
                    style={{ border: "1px solid transparent" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#ffffff0D";
                      e.currentTarget.style.transform = "translateX(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:shadow-lg"
                      style={{ background: "#2563EB10", border: "1px solid #2563EB22" }}
                    >
                      <feat.icon
                        className="h-4 w-4 transition-colors"
                        style={{ color: "#60A5FA" }}
                      />
                    </div>
                    <div>
                      <p className="text-[0.9rem] font-bold" style={{ color: "#F1F5F9" }}>
                        {feat.label}
                      </p>
                      <p
                        className="mt-1 text-[0.78rem] leading-[1.7]"
                        style={{ color: "#7C8BA1" }}
                      >
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
                transition={{ duration: 0.5, delay: 3.2 }}
                className="mt-6 text-[0.78rem] leading-[1.85] pr-4"
                style={{ color: "#64748B" }}
              >
                ما كان الناس يرددونه قديمًا، نترجمه اليوم إلى تجربة أسهل وأوضح داخل الموقع.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 3.4 }}
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

        {/* ── Quote Cards ── */}
        <div className="container mt-16 lg:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-5xl"
          >
            <div className="mb-8 flex items-center justify-center gap-3">
              <div className="h-px w-10" style={{ background: "linear-gradient(to left, #CDBB9A40, transparent)" }} />
              <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase" style={{ color: "#CDBB9A" }}>
                عبارات بنت الاسم
              </p>
              <div className="h-px w-10" style={{ background: "linear-gradient(to right, #CDBB9A40, transparent)" }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quoteCards.map((card, i) => (
                <motion.div
                  key={card.phrase}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative rounded-2xl p-5 transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#CDBB9A22";
                    e.currentTarget.style.background = "rgba(205,187,154,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  }}
                >
                  <span
                    className="absolute top-3 left-4 text-[2rem] leading-none font-serif select-none"
                    style={{ color: "#CDBB9A18" }}
                  >
                    &ldquo;
                  </span>
                  <p
                    className="text-[1.05rem] font-bold mb-2"
                    style={{ color: "#F1F5F9", fontFamily: "var(--font-arabic-display)" }}
                  >
                    {card.phrase}
                  </p>
                  <p className="text-[0.78rem] leading-[1.85]" style={{ color: "#7C8BA1" }}>
                    {card.meaning}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Historical Timeline ── */}
        <EchoTimeline />

        {/* ── Stats ── */}
        <EchoStats />
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        style={{
          background: "linear-gradient(90deg, transparent 10%, #CDBB9A18, transparent 90%)",
        }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </section>
  );
}
