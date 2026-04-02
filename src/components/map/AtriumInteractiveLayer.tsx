/**
 * AtriumInteractiveLayer – toned-down, architecturally integrated atrium zone.
 * Subtle presence, not visually dominant over surrounding commercial units.
 */
import { useState, useCallback } from "react";
import { ATRIUM_CENTER, ATRIUM_OCTAGON, ATRIUM_INNER, ATRIUM_VERTICES } from "@/lib/mallFloorGeometry";
import type { AtriumMode } from "./AtriumHubModal";

const MODE_VISUALS: Record<AtriumMode, { color: string; label: string; icon: string }> = {
  spin:       { color: "#2563EB", label: "أدر واربح",      icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
  offers:     { color: "#F57C20", label: "عروض اليوم",      icon: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01" },
  featured:   { color: "#18B6D9", label: "متاجر مميّزة",    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
  events:     { color: "#7C3AED", label: "فعاليات قادمة",   icon: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
  categories: { color: "#18B6D9", label: "اكتشف الفئات",   icon: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" },
  campaign:   { color: "#2563EB", label: "حملة الافتتاح",  icon: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" },
};

type Props = {
  mode: AtriumMode;
  customColor?: string;
  customLabel?: string;
  onClick: () => void;
};

export function AtriumInteractiveLayer({ mode, customColor, customLabel, onClick }: Props) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const vis = MODE_VISUALS[mode];
  const color = customColor ?? vis.color;
  const label = customLabel ?? vis.label;

  const cx = ATRIUM_CENTER.x;
  const cy = ATRIUM_CENTER.y;

  const handleClick = useCallback(() => {
    setPressed(true);
    onClick();
    setTimeout(() => setPressed(false), 600);
  }, [onClick]);

  return (
    <g id="atrium-interactive-layer">
      {/* Octagon glass — subtle, architectural */}
      <polygon points={ATRIUM_OCTAGON} fill="url(#atriumGlass)" stroke="#9BB8C8" strokeWidth="1.5" />
      <polygon points={ATRIUM_OCTAGON} fill="url(#glassHatch)" opacity="0.2" />
      <polygon points={ATRIUM_INNER} fill="none" stroke="#9BB8C8" strokeWidth="0.8" opacity="0.3" />

      {/* Radial lines — very subtle */}
      {ATRIUM_VERTICES.map(([vx, vy], i) => (
        <line key={`ray-${i}`} x1={cx} y1={cy} x2={vx} y2={vy} stroke="#9BB8C8" strokeWidth="0.5" opacity="0.2" />
      ))}

      {/* Single subtle pulse — NOT dominant */}
      <circle cx={cx} cy={cy} r="32" fill="none" stroke={color} strokeWidth="0.8" opacity="0.08">
        <animate attributeName="r" values="32;42;32" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.02;0.08" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* Press feedback */}
      {pressed && (
        <circle cx={cx} cy={cy} r="40" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3">
          <animate attributeName="r" values="25;50" dur="0.4s" fill="freeze" />
          <animate attributeName="opacity" values="0.3;0" dur="0.4s" fill="freeze" />
        </circle>
      )}

      {/* Hit area */}
      <g
        className="cursor-pointer"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="button"
        tabIndex={0}
        aria-label={label}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
      >
        <circle cx={cx} cy={cy} r="50" fill="transparent" />

        {/* Hover ring */}
        <circle
          cx={cx} cy={cy} r="40"
          fill="none"
          stroke={color}
          strokeWidth={hovered ? "1.5" : "0"}
          opacity={hovered ? 0.3 : 0}
          style={{ transition: "stroke-width 0.3s, opacity 0.3s" }}
        />

        {/* Center dot — small, subtle */}
        <circle
          cx={cx} cy={cy}
          r={hovered ? "5" : "3"}
          fill={color}
          opacity={hovered ? 0.5 : 0.25}
          style={{ transition: "r 0.3s, opacity 0.3s" }}
        />

        {/* Mode icon on hover */}
        <g
          transform={`translate(${cx - 8}, ${cy - 8}) scale(0.67)`}
          opacity={hovered ? 0.5 : 0}
          style={{ transition: "opacity 0.3s" }}
        >
          <path d={vis.icon} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* Tooltip on hover */}
      {hovered && (
        <g pointerEvents="none">
          <rect x={cx - 50} y={cy - 62} width="100" height="24" rx="6" fill="hsl(222 36% 11%)" opacity="0.9" />
          <polygon points={`${cx - 4},${cy - 38} ${cx + 4},${cy - 38} ${cx},${cy - 33}`} fill="hsl(222 36% 11%)" opacity="0.9" />
          <text x={cx} y={cy - 47} textAnchor="middle" className="text-[10px] font-bold" fill="#F4F0EA">{label}</text>
        </g>
      )}
    </g>
  );
}
