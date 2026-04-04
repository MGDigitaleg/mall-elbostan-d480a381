import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EchoFragment } from "./echoData";

/* Simplified motion — removed expensive blur() filter animations */
const motionVariants = {
  float: {
    opacity: [0, 0.5, 0.35, 0.5, 0.25],
    y: [16, 0, -5, -10, -14],
  },
  drift: {
    opacity: [0, 0.45, 0.3, 0.45, 0.15],
    x: [20, 0, -8, 4, -12],
    y: [0, -4, -8, -6, -12],
  },
  pulse: {
    opacity: [0, 0.5, 0.15, 0.5, 0.15],
    scale: [0.94, 1.03, 0.98, 1.03, 0.96],
  },
  wave: {
    opacity: [0, 0.45, 0.3, 0.48, 0.2],
    y: [12, -2, 4, -6, -14],
    x: [0, 6, -4, 8, 0],
  },
};

/* Layer-based opacity multiplier */
const layerOpacityScale: Record<number, number> = { 1: 1, 2: 0.65, 3: 0.4, 4: 0.2 };
const layerDurations: Record<number, number> = { 1: 12, 2: 14, 3: 16, 4: 18 };

const layerGlow: Record<number, React.CSSProperties> = {
  1: { textShadow: "0 0 30px rgba(205,187,154,0.15)" },
  2: { textShadow: "0 0 20px rgba(205,187,154,0.08)" },
  3: {},
  4: {},
};

export function EchoPhrase({
  frag,
  isVisible,
}: {
  frag: EchoFragment;
  isVisible: boolean;
}) {
  const { text, x, y, size, delay, layer, motion: motionType = "float" } = frag;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setShow(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [isVisible, delay]);

  const baseAnim = motionVariants[motionType];
  const opacityMul = layerOpacityScale[layer] ?? 0.3;

  // Scale opacity values by layer
  const anim = {
    ...baseAnim,
    opacity: baseAnim.opacity.map((v) => v * opacityMul),
  };

  const duration = layerDurations[layer] ?? 14;

  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={anim}
          transition={{
            duration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 3,
          }}
          className="absolute select-none font-bold whitespace-nowrap pointer-events-none will-change-transform"
          style={{
            left: x,
            top: y,
            fontSize: size,
            fontFamily: "var(--font-arabic-display)",
            color: "#CDBB9A",
            ...layerGlow[layer],
          }}
          aria-hidden="true"
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
