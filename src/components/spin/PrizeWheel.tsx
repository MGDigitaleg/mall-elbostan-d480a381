import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

export type WheelSegment = {
  id: string;
  label: string;
  tone: "primary" | "secondary" | "accent";
};

type Props = {
  segments: WheelSegment[];
  spinning: boolean;
  /** 0..segments.length-1 — the index to land on. */
  targetIndex: number | null;
  /** Called once after the spin animation completes. */
  onSettled?: () => void;
  /** Diameter in px. Default 320. */
  size?: number;
};

/**
 * Premium Arabic-first prize wheel.
 * Renders an SVG wheel with N labeled segments. Animation is CSS rotate.
 * Visuals only — outcome is decided server-side and passed as targetIndex.
 */
export function PrizeWheel({ segments, spinning, targetIndex, onSettled, size = 320 }: Props) {
  const radius = size / 2;
  const segCount = segments.length;
  const segAngle = 360 / segCount;
  const [rotation, setRotation] = useState(0);
  const settledRef = useRef(false);

  useEffect(() => {
    if (spinning && targetIndex !== null) {
      settledRef.current = false;
      // Land so that the middle of targetIndex segment aligns with the top pointer (-90deg).
      const landingAngle = -(targetIndex * segAngle + segAngle / 2);
      const fullTurns = 360 * 6; // 6 full spins
      const next = fullTurns + landingAngle;
      setRotation(next);
      const t = setTimeout(() => {
        if (!settledRef.current) {
          settledRef.current = true;
          onSettled?.();
        }
      }, 4200);
      return () => clearTimeout(t);
    }
  }, [spinning, targetIndex, segAngle, onSettled]);

  // Segment paths
  const paths = useMemo(() => {
    return segments.map((_, i) => {
      const startAngle = (i * segAngle - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * segAngle - 90) * (Math.PI / 180);
      const x1 = radius + radius * Math.cos(startAngle);
      const y1 = radius + radius * Math.sin(startAngle);
      const x2 = radius + radius * Math.cos(endAngle);
      const y2 = radius + radius * Math.sin(endAngle);
      const largeArc = segAngle > 180 ? 1 : 0;
      return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    });
  }, [segments, segAngle, radius]);

  const toneColors: Record<WheelSegment["tone"], string> = {
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    accent: "hsl(var(--orange))",
  };

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" aria-hidden />

      {/* Top pointer */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-2 z-20 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-primary drop-shadow" />

      {/* Wheel */}
      <motion.div
        animate={{ rotate: rotation }}
        transition={{
          duration: 4,
          ease: [0.17, 0.67, 0.21, 0.99],
        }}
        style={{ width: size, height: size }}
        className="relative rounded-full shadow-2xl shadow-primary/20 ring-4 ring-card"
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
          {paths.map((d, i) => {
            const seg = segments[i];
            const fill = toneColors[seg.tone];
            const textAngle = i * segAngle + segAngle / 2 - 90;
            const tx = radius + radius * 0.62 * Math.cos(textAngle * (Math.PI / 180));
            const ty = radius + radius * 0.62 * Math.sin(textAngle * (Math.PI / 180));
            return (
              <g key={seg.id}>
                <path d={d} fill={fill} stroke="hsl(var(--card))" strokeWidth={2} />
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                  fill={seg.tone === "secondary" ? "hsl(var(--foreground))" : "hsl(var(--primary-foreground))"}
                  fontSize={11}
                  fontWeight={700}
                  style={{ fontFamily: "inherit" }}
                >
                  {seg.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Center hub */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-card border-4 border-primary/30 shadow-lg flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-primary" />
        </div>
      </motion.div>
    </div>
  );
}
