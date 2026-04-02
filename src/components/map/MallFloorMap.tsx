import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { AtriumInteractiveLayer } from "./AtriumInteractiveLayer";
import { cn } from "@/lib/utils";
import type { MallFloor, MallUnit, MallUnitStatus } from "@/lib/mallFloorGeometry";

// ── Confirmed tenant names per unit ──
const TENANT_NAMES: Record<string, string> = {
  "G-01": "ستاتيك",
  "G-02": "شرف",
  "G-03": "2B",
  "G-05": "Go Plus",
  "G-07": "الهدى",
  "G-08": "الصحابة",
  "G-09": "ريد لاين",
  "G-11": "Egypt Laptop",
  "G-13": "HK",
  "G-14": "WiFi",
  "G-16": "Kareem Store",
  "G-17": "كسر زيرو",
  "F-06": "Express Home",
  "F-07": "El Badr",
  "F-08": "El Badr",
  "F-09": "El Badr",
  "F-10": "Time Tech",
  "F-11": "Prime Technology",
  "F-13": "Digital Plus",
  "F-14": "سبارك",
  "S-05": "Mix & Apex",
  "S-10": "Quick Fix",
  "S-07": "Compu Marts",
  "S-08": "Compu Marts",
  "S-09": "Compu Marts",
};
import {
  OUTER_SHELL,
  CORRIDOR_BOUNDARY,
  COLUMN_POSITIONS,
  ELEVATOR_RECT,
  STAIR_RECTS,
  ENTRANCE_MARKER,
} from "@/lib/mallFloorGeometry";

import type { AtriumConfig } from "./AtriumHubModal";

type Props = {
  floor: MallFloor;
  selectedUnitId: string | null;
  mutedUnitIds: Set<string>;
  onSelectUnit: (unit: MallUnit) => void;
  onAtriumClick?: () => void;
  atriumConfig?: AtriumConfig;
  highlightedUnitIds?: Set<string>;
  className?: string;
};

// ── Status-based fill colors — stronger distinction ──
const statusFill: Record<MallUnitStatus, { base: string; hover: string; selected: string }> = {
  occupied:    { base: "#D6D0C6", hover: "#C8C2B8", selected: "#BBB5AB" },
  available:   { base: "#FDDBB5", hover: "#FCC98A", selected: "#FBBA6A" },
  coming_soon: { base: "#BFE3F2", hover: "#A6D8ED", selected: "#8DCDE8" },
};

const statusStroke: Record<MallUnitStatus, string> = {
  occupied: "#8B8174",
  available: "#F97316",
  coming_soon: "#06B6D4",
};

export function MallFloorMap({ floor, selectedUnitId, mutedUnitIds, onSelectUnit, onAtriumClick, atriumConfig, highlightedUnitIds, className }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const atriumMode = atriumConfig?.mode ?? "spin";
  const pulseColor = atriumConfig?.pulseColor;
  const atriumLabel = atriumConfig?.label;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.4;

  const handleZoomIn = () => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM));
  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(z - ZOOM_STEP, MIN_ZOOM);
      if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP * 0.5 : ZOOM_STEP * 0.5;
    setZoom((z) => {
      const next = Math.min(Math.max(z + delta, MIN_ZOOM), MAX_ZOOM);
      if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (zoom <= 1) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [zoom, pan]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setPan({ x: panStart.current.panX + dx, y: panStart.current.panY + dy });
  }, []);

  const handlePointerUp = useCallback(() => { isPanning.current = false; }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, unit: MallUnit) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelectUnit(unit);
      }
    },
    [onSelectUnit],
  );

  return (
    <div className={cn("relative overflow-hidden rounded-[1.5rem] border border-border bg-[#F4F0EA] p-3 md:p-4", className)}>
      {/* Zoom controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          disabled={zoom >= MAX_ZOOM}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 shadow-md border border-border backdrop-blur-sm transition hover:bg-white disabled:opacity-40"
          aria-label="تكبير"
        >
          <ZoomIn className="h-4 w-4 text-foreground" />
        </button>
        <button
          onClick={handleZoomOut}
          disabled={zoom <= MIN_ZOOM}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 shadow-md border border-border backdrop-blur-sm transition hover:bg-white disabled:opacity-40"
          aria-label="تصغير"
        >
          <ZoomOut className="h-4 w-4 text-foreground" />
        </button>
        <button
          onClick={handleReset}
          disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 shadow-md border border-border backdrop-blur-sm transition hover:bg-white disabled:opacity-40"
          aria-label="إعادة ضبط"
        >
          <RotateCcw className="h-4 w-4 text-foreground" />
        </button>
      </div>

      {/* Zoom level indicator */}
      {zoom > 1 && (
        <div className="absolute top-4 right-4 z-10 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold shadow-md border border-border backdrop-blur-sm text-foreground">
          {Math.round(zoom * 100)}%
        </div>
      )}

      <div
        ref={containerRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn("touch-none", zoom > 1 && "cursor-grab active:cursor-grabbing")}
        style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transformOrigin: "center center", transition: isPanning.current ? "none" : "transform 0.25s ease-out" }}
      >
      <svg
        viewBox="-20 -20 1040 1040"
        className="h-full w-full"
        role="img"
        aria-label="خريطة الطابق التفاعلية لمول البستان"
      >
        <defs>
          {/* Floor surface gradient */}
          <linearGradient id="floorGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8E0D4" />
            <stop offset="100%" stopColor="#DDD5C8" />
          </linearGradient>

          {/* Corridor surface */}
          <linearGradient id="corridorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D0C8BA" />
            <stop offset="100%" stopColor="#C8C0B2" />
          </linearGradient>

          {/* Atrium glass */}
          <radialGradient id="atriumGlass" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#E0F0FA" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#D0E8F4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#B8D8EC" stopOpacity="0.6" />
          </radialGradient>

          {/* Building drop shadow */}
          <filter id="buildingShadow" x="-5%" y="-5%" width="115%" height="115%">
            <feDropShadow dx="3" dy="5" stdDeviation="8" floodColor="#000" floodOpacity="0.18" />
          </filter>

          {/* Selected unit glow */}
          <filter id="selectedGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#F97316" floodOpacity="0.5" />
          </filter>

          {/* Subtle unit shadow */}
          <filter id="unitShadow" x="-2%" y="-2%" width="104%" height="104%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.08" />
          </filter>

          {/* Glass pattern */}
          <pattern id="glassHatch" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="20" stroke="#B0D4E8" strokeWidth="0.5" strokeOpacity="0.3" />
          </pattern>
        </defs>

        {/* ── Building outer shadow ── */}
        <polygon
          points={OUTER_SHELL}
          fill="#333"
          opacity="0.12"
          transform="translate(5,6)"
        />

        {/* ── Building floor surface ── */}
        <polygon
          points={OUTER_SHELL}
          fill="url(#floorGrad)"
          stroke="#6B6358"
          strokeWidth="3"
          filter="url(#buildingShadow)"
        />

        {/* ── Outer wall thickness (double stroke effect) ── */}
        <polygon
          points={OUTER_SHELL}
          fill="none"
          stroke="#4A4540"
          strokeWidth="5"
        />
        <polygon
          points={OUTER_SHELL}
          fill="none"
          stroke="#9B9488"
          strokeWidth="1.5"
        />

        {/* ── Corridor ring ── */}
        <polygon
          points={CORRIDOR_BOUNDARY}
          fill="url(#corridorGrad)"
          stroke="#8B8478"
          strokeWidth="1.5"
        />

        {/* ── Central atrium interactive layer ── */}
        <AtriumInteractiveLayer
          mode={atriumMode}
          customColor={pulseColor}
          customLabel={atriumLabel}
          onClick={() => onAtriumClick?.()}
        />

        {/* ── Elevator area ── */}
        <rect
          x={ELEVATOR_RECT.x}
          y={ELEVATOR_RECT.y}
          width={ELEVATOR_RECT.w}
          height={ELEVATOR_RECT.h}
          rx="6"
          fill="#C4BDB0"
          stroke="#8B8478"
          strokeWidth="1.5"
        />
        <text
          x={ELEVATOR_RECT.x + ELEVATOR_RECT.w / 2}
          y={ELEVATOR_RECT.y + ELEVATOR_RECT.h / 2 + 5}
          textAnchor="middle"
          className="text-[13px] font-semibold"
          fill="#5A5348"
        >
          مصاعد
        </text>

        {/* ── Stairs ── */}
        {STAIR_RECTS.map((stair, i) => (
          <g key={`stair-${i}`}>
            <rect
              x={stair.x}
              y={stair.y}
              width={stair.w}
              height={stair.h}
              rx="4"
              fill="#D4CFC6"
              stroke="#8B8478"
              strokeWidth="1"
            />
            {/* Step lines */}
            {[0.25, 0.5, 0.75].map((frac) => (
              <line
                key={frac}
                x1={stair.x + 4}
                y1={stair.y + stair.h * frac}
                x2={stair.x + stair.w - 4}
                y2={stair.y + stair.h * frac}
                stroke="#8B8478"
                strokeWidth="0.8"
                opacity="0.5"
              />
            ))}
            <text
              x={stair.x + stair.w / 2}
              y={stair.y + stair.h / 2 + 4}
              textAnchor="middle"
              className="text-[10px]"
              fill="#6B6358"
            >
              {stair.label}
            </text>
          </g>
        ))}

        {/* ── Unit polygons ── */}
        <g id="units-layer">
          {floor.units.map((unit) => {
            const isSelected = selectedUnitId === unit.id;
            const isHovered = hoveredId === unit.id;
            const isMuted = mutedUnitIds.has(unit.id);
            const isHighlighted = highlightedUnitIds?.has(unit.id) ?? false;
            const colors = statusFill[unit.status];
            const stroke = statusStroke[unit.status];

            return (
              <motion.polygon
                key={unit.id}
                points={unit.polygon}
                initial={false}
                animate={{
                  opacity: isMuted ? 0.2 : 1,
                  fillOpacity: isMuted ? 0.3 : 1,
                }}
                transition={{ duration: 0.2 }}
                fill={isSelected ? colors.selected : isHovered ? colors.hover : colors.base}
                stroke={isHighlighted ? "#2563EB" : isSelected ? "#F97316" : stroke}
                strokeWidth={isHighlighted ? 3 : isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                filter={isSelected ? "url(#selectedGlow)" : "url(#unitShadow)"}
                className="cursor-pointer outline-none"
                style={{ transition: "fill 0.2s, stroke 0.2s, stroke-width 0.2s" }}
                onClick={() => onSelectUnit(unit)}
                onMouseEnter={() => setHoveredId(unit.id)}
                onMouseLeave={() => setHoveredId(null)}
                onKeyDown={(e) => handleKeyDown(e, unit)}
                tabIndex={0}
                role="button"
                aria-label={`وحدة ${unit.code} - ${unit.area} متر مربع`}
              />
            );
          })}
        </g>

        {/* ── Red columns ── */}
        {COLUMN_POSITIONS.map(([cx, cy], i) => (
          <g key={`col-${i}`}>
            <circle cx={cx} cy={cy} r="9" fill="#8B1A1A" />
            <circle cx={cx} cy={cy} r="6" fill="#B71C1C" />
            <circle cx={cx} cy={cy} r="3" fill="#D32F2F" opacity="0.6" />
          </g>
        ))}

        {/* ── Unit labels ── */}
        <g id="labels-layer" pointerEvents="none">
          {floor.units.map((unit) => {
            const isMuted = mutedUnitIds.has(unit.id);
            const tenantName = TENANT_NAMES[unit.id];
            const hasName = unit.status === "occupied" && tenantName;
            const showArea = !hasName && unit.area > 30;

            return (
              <g key={`label-${unit.id}`} opacity={isMuted ? 0.25 : 1}>
                {hasName ? (
                  <>
                    <text
                      x={unit.labelX}
                      y={unit.labelY - 6}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] font-bold"
                      fill="#2D2926"
                    >
                      {tenantName}
                    </text>
                    <text
                      x={unit.labelX}
                      y={unit.labelY + 9}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[8px]"
                      fill="#6B6358"
                    >
                      {unit.code}
                    </text>
                  </>
                ) : (
                  <>
                    <text
                      x={unit.labelX}
                      y={unit.labelY - (showArea ? 5 : 0)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[12px] font-bold"
                      fill="#2D2926"
                    >
                      {unit.code}
                    </text>
                    {showArea && (
                      <text
                        x={unit.labelX}
                        y={unit.labelY + 11}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-[9px]"
                        fill="#5A5348"
                      >
                        {unit.area} م²
                      </text>
                    )}
                  </>
                )}
              </g>
            );
          })}
        </g>

        {/* ── Status indicator dots ── */}
        <g id="status-dots" pointerEvents="none">
          {floor.units.map((unit) => {
            if (unit.status === "occupied") return null;
            const isMuted = mutedUnitIds.has(unit.id);
            return (
              <circle
                key={`dot-${unit.id}`}
                cx={unit.labelX + 20}
                cy={unit.labelY - 14}
                r="5"
                fill={unit.status === "available" ? "#F97316" : "#06B6D4"}
                opacity={isMuted ? 0.2 : 0.85}
              />
            );
          })}
        </g>

        {/* ── Entrance marker ── */}
        <g id="entrance">
          <rect
            x={ENTRANCE_MARKER.x - 50}
            y={ENTRANCE_MARKER.y - 10}
            width="100"
            height="20"
            rx="4"
            fill="#4A4540"
            opacity="0.8"
          />
          <text
            x={ENTRANCE_MARKER.x}
            y={ENTRANCE_MARKER.y + 3}
            textAnchor="middle"
            className="text-[10px] font-semibold"
            fill="#F4F0EA"
          >
            {ENTRANCE_MARKER.label}
          </text>
        </g>

        {/* ── Hover tooltip ── */}
        {hoveredId && (() => {
          const unit = floor.units.find((u) => u.id === hoveredId);
          if (!unit) return null;
          const tx = Math.min(Math.max(unit.labelX, 120), 880);
          const ty = unit.labelY - 32;
          return (
            <g pointerEvents="none">
              <rect
                x={tx - 75}
                y={ty - 16}
                width="150"
                height="28"
                rx="6"
                fill="#1A1A2E"
                opacity="0.92"
              />
              <text
                x={tx}
                y={ty + 2}
                textAnchor="middle"
                className="text-[11px] font-semibold"
                fill="#fff"
              >
                {TENANT_NAMES[unit.id] ? `${TENANT_NAMES[unit.id]} | ${unit.code}` : `${unit.code} | ${unit.area} م²`}
              </text>
            </g>
          );
        })()}
      </svg>
      </div>
    </div>
  );
}
