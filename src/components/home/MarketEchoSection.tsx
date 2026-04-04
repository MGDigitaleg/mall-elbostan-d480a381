import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Store, Map, ShoppingBag, ArrowLeft } from "lucide-react";

/* ── Floating echo phrases — expanded set ── */
const echoFragments = [
  // Primary phrases — larger, more prominent
  { text: "انزل البستان", x: "6%", y: "10%", size: "1.25rem", delay: 0, layer: 1 },
  { text: "لف البستان الأول", x: "58%", y: "6%", size: "1.1rem", delay: 1.0, layer: 1 },
  { text: "اسأل في البستان", x: "76%", y: "34%", size: "1.15rem", delay: 2.4, layer: 1 },
  { text: "البستان فيه كل حاجة", x: "12%", y: "50%", size: "1.05rem", delay: 0.6, layer: 1 },
  { text: "أسعار البستان", x: "35%", y: "38%", size: "1rem", delay: 2.8, layer: 1 },

  // Secondary phrases — medium
  { text: "اسم يعرفه السوق", x: "42%", y: "70%", size: "0.95rem", delay: 3.2, layer: 2 },
  { text: "مكان للمقارنة", x: "80%", y: "62%", size: "0.92rem", delay: 1.8, layer: 2 },
  { text: "خبرة ممتدة", x: "24%", y: "80%", size: "0.9rem", delay: 3.8, layer: 2 },
  { text: "الثقة أولًا", x: "52%", y: "24%", size: "0.95rem", delay: 1.4, layer: 2 },
  { text: "جودة مضمونة", x: "88%", y: "18%", size: "0.88rem", delay: 4.0, layer: 2 },
  { text: "سوق التقنية", x: "68%", y: "78%", size: "0.92rem", delay: 2.2, layer: 2 },

  // Tertiary phrases — subtle, atmospheric
  { text: "منذ ١٩٩٠", x: "18%", y: "28%", size: "0.82rem", delay: 4.5, layer: 3 },
  { text: "وجهة واحدة", x: "90%", y: "48%", size: "0.8rem", delay: 3.5, layer: 3 },
  { text: "قارن واختار", x: "5%", y: "72%", size: "0.78rem", delay: 5.0, layer: 3 },
  { text: "كل الماركات", x: "48%", y: "88%", size: "0.8rem", delay: 4.8, layer: 3 },
  { text: "اللي يعرف يعرف", x: "72%", y: "12%", size: "0.78rem", delay: 5.5, layer: 3 },
  { text: "ضمان وخدمة", x: "30%", y: "58%", size: "0.82rem", delay: 3.0, layer: 3 },
  { text: "أكبر تشكيلة", x: "62%", y: "50%", size: "0.8rem", delay: 5.2, layer: 3 },
];

/* ── Feature points ── */
const features = [
  { icon: Store, label: "دليل محلات أوضح", desc: "كل محل بتفاصيله الكاملة في مكان واحد." },
  { icon: Map, label: "خريطة تفاعلية أدق", desc: "تصفّح كل دور واعرف مكان كل وحدة." },
  { icon: ShoppingBag, label: "منتجات تصل بك أسرع", desc: "تصفّح منتجات المحلات واطلب مباشرة." },
];

/* ── Animation variants per layer ── */
const layerAnimations = {
  1: {
    opacity: [0, 0.55, 0.4, 0.55, 0.35, 0.5, 0.25],
    filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(1px)", "blur(0px)", "blur(0px)", "blur(6px)"],
    y: [16, 0, -3, -5, -8, -10, -14],
    scale: [0.96, 1, 1.01, 1, 0.99, 1, 0.98],
  },
  2: {
    opacity: [0, 0.35, 0.25, 0.38, 0.2, 0.3, 0.12],
    filter: ["blur(8px)", "blur(0px)", "blur(1px)", "blur(0px)", "blur(0px)", "blur(2px)", "blur(6px)"],
    y: [12, 0, -5, -8, -12, -14, -18],
    x: [0, 2, -2, 1, -1, 2, 0],
  },
  3: {
    opacity: [0, 0.2, 0.14, 0.22, 0.1, 0.18, 0.06],
    filter: ["blur(6px)", "blur(2px)", "blur(0px)", "blur(1px)", "blur(0px)", "blur(3px)", "blur(8px)"],
    y: [8, 0, -6, -10, -16, -20, -24],
  },
};

const layerDurations = { 1: 10, 2: 12, 3: 14 };
const layerRepeatDelays = { 1: 1.5, 2: 2.5, 3: 3 };

/* ── Single floating phrase component ── */
function EchoPhrase({
  text, x, y, size, delay, layer, isVisible,
}: {
  text: string; x: string; y: string; size: string; delay: number; layer: number; isVisible: boolean;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setShow(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [isVisible, delay]);

  const anim = layerAnimations[layer as 1 | 2 | 3];
  const duration = layerDurations[layer as 1 | 2 | 3];
  const repeatDelay = layerRepeatDelays[layer as 1 | 2 | 3];

  // Layer 1 gets a subtle text-shadow glow
  const glowStyle = layer === 1
    ? { textShadow: "0 0 30px rgba(205,187,154,0.15), 0 0 60px rgba(205,187,154,0.05)" }
    : layer === 2
      ? { textShadow: "0 0 20px rgba(205,187,154,0.08)" }
      : {};

  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, filter: "blur(10px)", y: 16 }}
          animate={anim}
          transition={{
            duration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay,
          }}
          className="absolute select-none font-bold whitespace-nowrap pointer-events-none"
          style={{
            left: x,
            top: y,
            fontSize: size,
            fontFamily: "var(--font-arabic-display)",
            color: "#CDBB9A",
            ...glowStyle,
          }}
          aria-hidden="true"
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/* ── Orbiting particle dots ── */
function FloatingParticles({ isVisible }: { isVisible: boolean }) {
  const particles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: `${8 + Math.random() * 84}%`,
      y: `${5 + Math.random() * 90}%`,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 4,
      duration: 6 + Math.random() * 8,
    })), []
  );

  if (!isVisible) return null;

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: "radial-gradient(circle, #CDBB9A, transparent)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.3, 0.15, 0.25, 0],
            scale: [0, 1, 1.2, 0.8, 0],
            y: [0, -20, -40, -60, -80],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

/* ── Animated connecting lines ── */
function ConnectingLines({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <>
      {/* Horizontal sweep line */}
      <motion.div
        className="absolute h-px w-full top-[35%] hidden lg:block"
        style={{ background: "linear-gradient(90deg, transparent, #CDBB9A08, #2563EB08, transparent)" }}
        initial={{ scaleX: 0, transformOrigin: "right" }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Diagonal accent */}
      <motion.div
        className="absolute hidden lg:block"
        style={{
          width: "200px",
          height: "1px",
          top: "60%",
          left: "10%",
          background: "linear-gradient(90deg, transparent, #CDBB9A0C, transparent)",
          transform: "rotate(-15deg)",
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 2, delay: 2, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute hidden lg:block"
        style={{
          width: "150px",
          height: "1px",
          top: "25%",
          right: "15%",
          background: "linear-gradient(90deg, transparent, #2563EB0A, transparent)",
          transform: "rotate(12deg)",
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.8, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}

/* ── Oversized quotation mark ── */
function QuoteMark({ isVisible }: { isVisible: boolean }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none hidden lg:block"
      style={{
        top: "8%",
        right: "8%",
        fontSize: "12rem",
        lineHeight: 1,
        fontFamily: "Georgia, serif",
        color: "#CDBB9A",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isVisible ? { opacity: 0.04, scale: 1 } : {}}
      transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      &ldquo;
    </motion.div>
  );
}

export function MarketEchoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
      style={{
        background: "linear-gradient(160deg, #060E1C 0%, #0A1628 40%, #071326 100%)",
        minHeight: "85vh",
      }}
    >
      {/* ── Decorative background ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Ambient glows — enhanced */}
        <div
          className="absolute top-[15%] left-[10%] h-[600px] w-[600px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[10%] right-[8%] h-[500px] w-[500px] rounded-full opacity-[0.025]"
          style={{ background: "radial-gradient(circle, #CDBB9A, transparent 70%)" }}
        />
        <div
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full opacity-[0.015]"
          style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)" }}
        />

        {/* Central vertical line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="absolute left-1/2 top-[5%] h-[90%] w-px origin-top hidden lg:block"
          style={{
            background: "linear-gradient(to bottom, transparent, #CDBB9A20, #CDBB9A10, #CDBB9A20, transparent)",
          }}
        />

        {/* Connecting lines */}
        <ConnectingLines isVisible={isInView} />
      </div>

      {/* ── Oversized quotation mark ── */}
      <QuoteMark isVisible={isInView} />

      {/* ── Layer 1: Floating echo phrases ── */}
      <div className="pointer-events-none absolute inset-0">
        {echoFragments.map((frag, i) => (
          <EchoPhrase key={i} {...frag} isVisible={isInView} />
        ))}
        <FloatingParticles isVisible={isInView} />
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
              initial={{ opacity: 0, x: 10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
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
              className="text-[1.5rem] md:text-[2rem] font-bold leading-[1.1]"
              style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}
            >
              الاسم الذي ظل يتردد
              <br />
              <motion.span
                style={{ color: "#CDBB9A" }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.4 }}
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
              initial={{ opacity: 0, width: 0 }}
              animate={isInView ? { opacity: 1, width: "auto" } : {}}
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
              <p className="text-[0.82rem] font-bold" style={{ color: "#CDBB9A", fontFamily: "var(--font-arabic-display)" }}>
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
            {/* Feature items */}
            <div className="space-y-4">
              {features.map((feat, i) => (
                <motion.div
                  key={feat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 2.4 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
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
                    style={{
                      background: "#2563EB10",
                      border: "1px solid #2563EB22",
                    }}
                  >
                    <feat.icon className="h-4 w-4 transition-colors" style={{ color: "#60A5FA" }} />
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

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        style={{ background: "linear-gradient(90deg, transparent 10%, #CDBB9A18, transparent 90%)" }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </section>
  );
}
