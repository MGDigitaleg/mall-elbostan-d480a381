import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "٣٥+", label: "سنة في السوق", suffix: "" },
  { value: "٢٠٠+", label: "محل ومتجر", suffix: "" },
  { value: "٤", label: "أدوار تجارية", suffix: "" },
  { value: "١٠٠٠+", label: "منتج متاح", suffix: "" },
];

export function EchoStats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="container mt-20 lg:mt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-4xl"
      >
        {/* Header */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <div
            className="h-px w-10"
            style={{ background: "linear-gradient(to left, #CDBB9A40, transparent)" }}
          />
          <p
            className="text-[0.7rem] font-bold tracking-[0.15em] uppercase"
            style={{ color: "#CDBB9A" }}
          >
            البستان بالأرقام
          </p>
          <div
            className="h-px w-10"
            style={{ background: "linear-gradient(to right, #CDBB9A40, transparent)" }}
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.15 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative rounded-2xl p-6 text-center transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563EB30";
                e.currentTarget.style.background = "rgba(37,99,235,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              }}
            >
              {/* Glow dot */}
              <div
                className="absolute top-3 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full opacity-40 transition-opacity duration-300 group-hover:opacity-70"
                style={{
                  background: "linear-gradient(90deg, transparent, #2563EB, transparent)",
                }}
              />

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
                className="text-[1.8rem] md:text-[2.2rem] font-bold leading-none"
                style={{
                  color: "#F8FAFC",
                  fontFamily: "var(--font-arabic-display)",
                }}
              >
                {stat.value}
              </motion.p>
              <p
                className="mt-2 text-[0.75rem] font-medium"
                style={{ color: "#7C8BA1" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
