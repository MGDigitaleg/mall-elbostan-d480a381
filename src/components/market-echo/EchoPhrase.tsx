import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EchoFragment } from "./echoData";

/* ── Motion variant definitions ── */
const motionVariants = {
  float: {
    1: {
      opacity: [0, 0.6, 0.45, 0.6, 0.4, 0.55, 0.25],
      filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(1px)", "blur(0px)", "blur(0px)", "blur(6px)"],
      y: [16, 0, -3, -5, -8, -10, -14],
      scale: [0.96, 1, 1.02, 1, 0.99, 1.01, 0.97],
    },
    2: {
      opacity: [0, 0.4, 0.28, 0.42, 0.22, 0.35, 0.12],
      filter: ["blur(8px)", "blur(0px)", "blur(1px)", "blur(0px)", "blur(0px)", "blur(2px)", "blur(6px)"],
      y: [12, 0, -5, -8, -12, -14, -18],
    },
    3: {
      opacity: [0, 0.25, 0.16, 0.26, 0.12, 0.2, 0.06],
      filter: ["blur(6px)", "blur(2px)", "blur(0px)", "blur(1px)", "blur(0px)", "blur(3px)", "blur(8px)"],
      y: [8, 0, -6, -10, -16, -20, -24],
    },
    4: {
      opacity: [0, 0.12, 0.08, 0.14, 0.06, 0.1, 0.03],
      filter: ["blur(4px)", "blur(2px)", "blur(0px)", "blur(2px)", "blur(0px)", "blur(3px)", "blur(6px)"],
      y: [6, 0, -4, -8, -12, -16, -20],
    },
  },

  drift: {
    1: {
      opacity: [0, 0.55, 0.4, 0.55, 0.3],
      filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(1px)", "blur(8px)"],
      x: [20, 0, -8, 4, -12],
      y: [0, -4, -8, -6, -12],
      rotate: [0, -1, 0.5, -0.5, 0],
    },
    2: {
      opacity: [0, 0.38, 0.25, 0.4, 0.15],
      filter: ["blur(8px)", "blur(0px)", "blur(1px)", "blur(0px)", "blur(6px)"],
      x: [14, 0, -6, 3, -10],
      y: [0, -3, -6, -4, -10],
    },
    3: {
      opacity: [0, 0.22, 0.14, 0.24, 0.08],
      filter: ["blur(6px)", "blur(1px)", "blur(0px)", "blur(2px)", "blur(6px)"],
      x: [10, 0, -5, 2, -8],
      y: [0, -4, -8, -6, -12],
    },
    4: {
      opacity: [0, 0.1, 0.06, 0.12, 0.03],
      filter: ["blur(4px)", "blur(2px)", "blur(0px)", "blur(2px)", "blur(5px)"],
      x: [8, 0, -4, 2, -6],
      y: [0, -3, -6, -5, -8],
    },
  },

  pulse: {
    1: {
      opacity: [0, 0.6, 0.2, 0.6, 0.15, 0.55, 0.2],
      filter: ["blur(8px)", "blur(0px)", "blur(2px)", "blur(0px)", "blur(2px)", "blur(0px)", "blur(6px)"],
      scale: [0.92, 1.04, 0.98, 1.05, 0.97, 1.02, 0.96],
    },
    2: {
      opacity: [0, 0.4, 0.12, 0.42, 0.1, 0.35, 0.1],
      filter: ["blur(6px)", "blur(0px)", "blur(2px)", "blur(0px)", "blur(2px)", "blur(1px)", "blur(5px)"],
      scale: [0.94, 1.03, 0.97, 1.04, 0.96, 1.01, 0.95],
    },
    3: {
      opacity: [0, 0.22, 0.08, 0.24, 0.06, 0.18, 0.04],
      filter: ["blur(5px)", "blur(1px)", "blur(2px)", "blur(0px)", "blur(2px)", "blur(2px)", "blur(5px)"],
      scale: [0.95, 1.02, 0.97, 1.03, 0.96, 1.01, 0.95],
    },
    4: {
      opacity: [0, 0.1, 0.04, 0.12, 0.03, 0.08, 0.02],
      filter: ["blur(4px)", "blur(1px)", "blur(2px)", "blur(1px)", "blur(2px)", "blur(2px)", "blur(4px)"],
      scale: [0.96, 1.02, 0.98, 1.02, 0.97, 1.01, 0.96],
    },
  },

  wave: {
    1: {
      opacity: [0, 0.55, 0.4, 0.58, 0.35, 0.5, 0.2],
      filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(1px)", "blur(0px)", "blur(8px)"],
      y: [12, -2, 4, -6, 2, -8, -14],
      x: [0, 6, -4, 8, -6, 4, 0],
    },
    2: {
      opacity: [0, 0.38, 0.25, 0.4, 0.2, 0.32, 0.1],
      filter: ["blur(8px)", "blur(0px)", "blur(1px)", "blur(0px)", "blur(1px)", "blur(1px)", "blur(6px)"],
      y: [10, -2, 3, -5, 2, -6, -12],
      x: [0, 5, -3, 6, -4, 3, 0],
    },
    3: {
      opacity: [0, 0.22, 0.14, 0.24, 0.1, 0.18, 0.05],
      filter: ["blur(6px)", "blur(1px)", "blur(0px)", "blur(1px)", "blur(0px)", "blur(2px)", "blur(6px)"],
      y: [8, -1, 3, -4, 1, -5, -10],
      x: [0, 4, -2, 5, -3, 2, 0],
    },
    4: {
      opacity: [0, 0.1, 0.06, 0.12, 0.05, 0.08, 0.02],
      filter: ["blur(4px)", "blur(1px)", "blur(0px)", "blur(1px)", "blur(0px)", "blur(2px)", "blur(5px)"],
      y: [6, -1, 2, -3, 1, -4, -8],
      x: [0, 3, -2, 4, -2, 2, 0],
    },
  },
};

const layerDurations: Record<number, number> = { 1: 10, 2: 12, 3: 14, 4: 16 };
const layerRepeatDelays: Record<number, number> = { 1: 1.5, 2: 2.5, 3: 3, 4: 4 };

const layerGlow: Record<number, React.CSSProperties> = {
  1: { textShadow: "0 0 40px rgba(205,187,154,0.2), 0 0 80px rgba(205,187,154,0.06)" },
  2: { textShadow: "0 0 24px rgba(205,187,154,0.1)" },
  3: { textShadow: "0 0 16px rgba(205,187,154,0.05)" },
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

  const variants = motionVariants[motionType];
  const anim = variants[layer as 1 | 2 | 3 | 4] ?? variants[3];
  const duration = layerDurations[layer] ?? 14;
  const repeatDelay = layerRepeatDelays[layer] ?? 3;

  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, filter: "blur(10px)", y: 16, scale: 0.95 }}
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
