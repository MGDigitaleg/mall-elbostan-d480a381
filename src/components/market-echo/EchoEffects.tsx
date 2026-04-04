import { useMemo } from "react";
import { motion } from "framer-motion";

/* ── Floating luminous particles (reduced from 18 to 10) ── */
export function FloatingParticles({ isVisible }: { isVisible: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: `${5 + Math.random() * 90}%`,
        y: `${3 + Math.random() * 94}%`,
        size: 1.5 + Math.random() * 3,
        delay: Math.random() * 6,
        duration: 10 + Math.random() * 10,
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
          className="absolute rounded-full pointer-events-none will-change-transform"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${p.color}, transparent)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.3, 0.15, 0.25, 0],
            scale: [0, 1, 1.3, 0.6, 0],
            y: [0, -30, -60, -90, -120],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

/* ── Concentric pulse rings (reduced from 3 to 2) ── */
export function PulseRings({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  const rings = [
    { size: 280, delay: 2, duration: 10, x: "20%", y: "30%", color: "#2563EB" },
    { size: 230, delay: 5, duration: 12, x: "70%", y: "60%", color: "#CDBB9A" },
  ];

  return (
    <>
      {rings.map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none will-change-transform"
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
            opacity: [0, 0.05, 0.02, 0],
            scale: [0.3, 1, 1.8, 2.5],
          }}
          transition={{
            duration: r.duration,
            delay: r.delay,
            repeat: Infinity,
            repeatDelay: 6,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

/* ── Animated connecting lines (simplified) ── */
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
        initial={{ opacity: 0, scale: 0.7 }}
        animate={isVisible ? { opacity: 0.04, scale: 1 } : {}}
        transition={{ duration: 2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
        initial={{ opacity: 0, scale: 0.7 }}
        animate={isVisible ? { opacity: 0.03, scale: 1 } : {}}
        transition={{ duration: 2, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        &rdquo;
      </motion.div>
    </>
  );
}

/* ── Scanning light beam — REMOVED for performance ── */
export function ScanBeam({ isVisible: _isVisible }: { isVisible: boolean }) {
  return null;
}
