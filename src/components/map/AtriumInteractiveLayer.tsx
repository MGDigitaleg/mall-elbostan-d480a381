/**
 * AtriumInteractiveLayer – premium branded hub at the architectural center.
 * Always-visible label, subtle but confident presence.
 * Not dominant over commercial units, but clearly the interactive heart.
 */
import { useState, useCallback } from "react";
import { ATRIUM_CENTER, ATRIUM_OCTAGON, ATRIUM_INNER, ATRIUM_VERTICES } from "@/lib/mallFloorGeometry";
import type { AtriumMode } from "./AtriumHubModal";

const MODE_VISUALS: Record<AtriumMode, { color: string; label: string; icon: string }> = {
  spin:       { color: "#2563EB", label: "مركز التفاعل", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
  offers:     { color: "#2563EB", label: "مركز التفاعل", icon: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01" },
  featured:   { color: "#2563EB", label: "مركز التفاعل", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
  events:     { color: "#2563EB", label: "مركز التفاعل", icon: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
  categories: { color: "#2563EB", label: "مركز التفاعل", icon: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" },
  campaign:   { color: "#2563EB", label: "مركز التفاعل", icon: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" },
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
      {/* Octagon glass — architectural, subtle */}
      <polygon points={ATRIUM_OCTAGON} fill="url(#atriumGlass)" stroke="#9BB8C8" strokeWidth="1.5" />
      <polygon points={ATRIUM_OCTAGON} fill="url(#glassHatch)" opacity="0.15" />
      <polygon points={ATRIUM_INNER} fill="none" stroke="#9BB8C8" strokeWidth="0.6" opacity="0.25" />

      {/* Radial lines — very subtle structural detail */}
      {ATRIUM_VERTICES.map(([vx, vy], i) => (
        <line key={`ray-${i}`} x1={cx} y1={cy} x2={vx} y2={vy} stroke="#9BB8C8" strokeWidth="0.4" opacity="0.15" />
      ))}

      {/* Single slow pulse — ambient, not attention-grabbing */}
      <circle cx={cx} cy={cy} r="28" fill="none" stroke={color} strokeWidth="0.6" opacity="0.06">
        <animate attributeName="r" values="28;38;28" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.02;0.06" dur="6s" repeatCount="indefinite" />
      </circle>

      {/* Press feedback */}
      {pressed && (
        <circle cx={cx} cy={cy} r="38" fill="none" stroke={color} strokeWidth="1.2" opacity="0.25">
          <animate attributeName="r" values="20;45" dur="0.4s" fill="freeze" />
          <animate attributeName="opacity" values="0.25;0" dur="0.4s" fill="freeze" />
        </circle>
      )}

      {/* ── Always-visible center label — branded, not generic ── */}
      <g pointerEvents="none">
        {/* Background pill */}
        <rect
          x={cx - 38}
          y={cy - 10}
          width="76"
          height="20"
          rx="5"
          fill={hovered ? "#1A2A44" : "#2A3A54"}
          opacity={hovered ? 0.92 : 0.65}
          style={{ transition: "fill 0.3s, opacity 0.3s" }}
        />
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          className="text-[9px] font-bold"
          fill="#E8ECF2"
          opacity={hovered ? 1 : 0.85}
          style={{ transition: "opacity 0.3s" }}
        >
          {label}
        </text>
      </g>

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
        <circle cx={cx} cy={cy} r="48" fill="transparent" />

        {/* Hover ring — refined, single */}
        <circle
          cx={cx} cy={cy} r="38"
          fill="none"
          stroke={color}
          strokeWidth={hovered ? "1.2" : "0"}
          opacity={hovered ? 0.25 : 0}
          style={{ transition: "stroke-width 0.3s, opacity 0.3s" }}
        />
      </g>

      {/* Expanded tooltip on hover */}
      {hovered && (
        <g pointerEvents="none">
          <rect x={cx - 56} y={cy - 36} width="112" height="18" rx="5" fill="#1A2A44" opacity="0.92" />
          <text x={cx} y={cy - 24.5} textAnchor="middle" className="text-[8px] font-semibold" fill="#9BB8C8">
            اضغط لاستكشاف العروض والمتاجر
          </text>
        </g>
      )}
    </g>
  );
}
