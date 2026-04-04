import { useMemo } from "react";
import { motion } from "framer-motion";

/* ── Floating luminous particles ── */
export function FloatingParticles({ isVisible }: { isVisible: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: `${5 + Math.random() * 90}%`,
        y: `${3 + Math.random() * 94}%`,
        size: 1.5 + Math.random() * 3.5,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 10,
        color: i % 3 === 0 ? "#CDBB9A" : i % 3 === 1 ? "#60A5FA" : "#06B6D4",
      })),
    []
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
            background: `radial-gradient(circle, ${p.color}, transparent)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.35, 0.18, 0.3, 0],
            scale: [0, 1, 1.4, 0.6, 0],
            y: [0, -25, -50, -75, -100],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

/* ── Concentric pulse rings ── */
export function PulseRings({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  const rings = [
    { size: 300, delay: 2, duration: 8, x: "20%", y: "30%", color: "#2563EB" },
    { size: 250, delay: 4, duration: 10, x: "70%", y: "60%", color: "#CDBB9A" },
    { size: 200, delay: 6, duration: 9, x: "50%", y: "80%", color: "#06B6D4" },
  ];

  return (
    <>
      {rings.map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            border: `1px solid ${r.color}`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{
            opacity: [0, 0.06, 0.03, 0.05, 0],
            scale: [0.3, 1, 1.5, 2, 2.5],
          }}
          transition={{
            duration: r.duration,
            delay: r.delay,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

/* ── Animated connecting lines ── */
export function ConnectingLines({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="absolute h-px w-full top-[35%] hidden lg:block"
        style={{ background: "linear-gradient(90deg, transparent, #CDBB9A0A, #2563EB0A, transparent)" }}
        initial={{ scaleX: 0, transformOrigin: "right" }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute h-px w-full top-[65%] hidden lg:block"
        style={{ background: "linear-gradient(90deg, transparent, #06B6D406, #CDBB9A06, transparent)" }}
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 3, delay: 2.0, ease: [0.22, 1, 0.36, 1] }}
      />
      {[
        { w: "220px", top: "55%", left: "8%", bg: "#CDBB9A0C", rot: "-12deg", d: 2.2 },
        { w: "180px", top: "22%", left: "72%", bg: "#2563EB0A", rot: "10deg", d: 2.8 },
        { w: "140px", top: "78%", left: "45%", bg: "#06B6D408", rot: "-8deg", d: 3.2 },
      ].map((line, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:block"
          style={{
            width: line.w,
            height: "1px",
            top: line.top,
            left: line.left,
            background: `linear-gradient(90deg, transparent, ${line.bg}, transparent)`,
            transform: `rotate(${line.rot})`,
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 2, delay: line.d, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </>
  );
}

/* ── Oversized quotation marks ── */
export function QuoteMarks({ isVisible }: { isVisible: boolean }) {
  return (
    <>
      <motion.div
        className="absolute pointer-events-none select-none hidden lg:block"
        style={{
          top: "6%",
          right: "6%",
          fontSize: "14rem",
          lineHeight: 1,
          fontFamily: "Georgia, serif",
          color: "#CDBB9A",
        }}
        initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
        animate={isVisible ? { opacity: 0.045, scale: 1, rotate: 0 } : {}}
        transition={{ duration: 2.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        &ldquo;
      </motion.div>
      <motion.div
        className="absolute pointer-events-none select-none hidden lg:block"
        style={{
          bottom: "8%",
          left: "6%",
          fontSize: "10rem",
          lineHeight: 1,
          fontFamily: "Georgia, serif",
          color: "#2563EB",
        }}
        initial={{ opacity: 0, scale: 0.7, rotate: 5 }}
        animate={isVisible ? { opacity: 0.03, scale: 1, rotate: 0 } : {}}
        transition={{ duration: 2.5, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        &rdquo;
      </motion.div>
    </>
  );
}

/* ── Scanning light beam ── */
export function ScanBeam({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute top-0 h-full w-[1px] pointer-events-none hidden lg:block"
      style={{
        background: "linear-gradient(to bottom, transparent 20%, #CDBB9A15 50%, transparent 80%)",
        boxShadow: "0 0 20px 4px rgba(205,187,154,0.03)",
      }}
      initial={{ left: "0%", opacity: 0 }}
      animate={{
        left: ["0%", "100%", "0%"],
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration: 20,
        delay: 3,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
