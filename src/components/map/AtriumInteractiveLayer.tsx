/**
 * AtriumInteractiveLayer – self-contained SVG <g> element that renders
 * the branded engagement zone at the centre of the mall floor map.
 *
 * States:
 *   idle    → subtle branded pulse, no label
 *   hover   → soft highlight, tooltip, enlarged rings
 *   active  → ring glow after click (briefly)
 *
 * Modes (visual theming only — content is in AtriumHubModal):
 *   spin | offers | featured | events | categories | campaign
 */
import { useState, useCallback } from "react";
import { ATRIUM_CENTER, ATRIUM_OCTAGON, ATRIUM_INNER, ATRIUM_VERTICES } from "@/lib/mallFloorGeometry";
import type { AtriumMode } from "./AtriumHubModal";

/* ── Mode visual config ── */
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
      {/* ── Architectural atrium base ── */}
      {/* Outer octagon glass */}
      <polygon
        points={ATRIUM_OCTAGON}
        fill="url(#atriumGlass)"
        stroke="#7BAEC4"
        strokeWidth="2"
      />
      <polygon
        points={ATRIUM_OCTAGON}
        fill="url(#glassHatch)"
        opacity="0.35"
      />
      {/* Inner octagon ring */}
      <polygon
        points={ATRIUM_INNER}
        fill="none"
        stroke="#7BAEC4"
        strokeWidth="1"
        opacity="0.45"
      />

      {/* ── Radial web lines ── */}
      {ATRIUM_VERTICES.map(([vx, vy], i) => (
        <line
          key={`ray-${i}`}
          x1={cx} y1={cy} x2={vx} y2={vy}
          stroke="#7BAEC4"
          strokeWidth="0.8"
          opacity="0.35"
        />
      ))}

      {/* ── Branded pulse rings (always visible, subtle) ── */}
      <circle cx={cx} cy={cy} r="42" fill="none" stroke={color} strokeWidth="1.2" opacity="0.12">
        <animate attributeName="r" values="42;54;42" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0.03;0.12" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r="34" fill="none" stroke={color} strokeWidth="0.8" opacity="0.08">
        <animate attributeName="r" values="34;46;34" dur="4s" begin="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.02;0.08" dur="4s" begin="2s" repeatCount="indefinite" />
      </circle>

      {/* ── Active / pressed glow ring ── */}
      {pressed && (
        <circle cx={cx} cy={cy} r="52" fill="none" stroke={color} strokeWidth="2.5" opacity="0.35">
          <animate attributeName="r" values="30;60" dur="0.5s" fill="freeze" />
          <animate attributeName="opacity" values="0.4;0" dur="0.5s" fill="freeze" />
        </circle>
      )}

      {/* ── Interactive hit area ── */}
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
        {/* Invisible hit circle (generous tap target) */}
        <circle cx={cx} cy={cy} r="58" fill="transparent" />

        {/* Hover highlight ring */}
        <circle
          cx={cx} cy={cy} r="48"
          fill="none"
          stroke={color}
          strokeWidth={hovered ? "2" : "0"}
          opacity={hovered ? 0.45 : 0}
          style={{ transition: "stroke-width 0.3s, opacity 0.3s" }}
        />

        {/* Hover fill glow */}
        <circle
          cx={cx} cy={cy} r="36"
          fill={hovered ? `${color}10` : "transparent"}
          style={{ transition: "fill 0.3s" }}
        />

        {/* Center branded dot */}
        <circle
          cx={cx} cy={cy}
          r={hovered ? "6" : "4"}
          fill={color}
          opacity={hovered ? 0.7 : 0.4}
          style={{ transition: "r 0.3s, opacity 0.3s" }}
        />

        {/* Mode icon (scaled SVG path) */}
        <g
          transform={`translate(${cx - 8}, ${cy - 8}) scale(0.67)`}
          opacity={hovered ? 0.7 : 0}
          style={{ transition: "opacity 0.3s" }}
        >
          <path d={vis.icon} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* ── Hover tooltip ── */}
      {hovered && (
        <g pointerEvents="none">
          <rect
            x={cx - 60}
            y={cy - 72}
            width="120"
            height="28"
            rx="8"
            fill="hsl(222 42% 10%)"
            opacity="0.92"
          />
          {/* tooltip arrow */}
          <polygon
            points={`${cx - 5},${cy - 44} ${cx + 5},${cy - 44} ${cx},${cy - 38}`}
            fill="hsl(222 42% 10%)"
            opacity="0.92"
          />
          <text
            x={cx}
            y={cy - 54}
            textAnchor="middle"
            className="text-[11px] font-bold"
            fill="#fff"
          >
            {label}
          </text>
        </g>
      )}

      {/* ── Subtle mode label (always visible, very subtle) ── */}
      <text
        x={cx}
        y={cy + 64}
        textAnchor="middle"
        className="text-[9px] font-semibold"
        fill={color}
        opacity={hovered ? 0.6 : 0.2}
        style={{ transition: "opacity 0.3s" }}
      >
        {label}
      </text>
    </g>
  );
}
