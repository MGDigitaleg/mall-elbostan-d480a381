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

// ── Status-based fill colors — refined, premium palette ──
const statusFill: Record<MallUnitStatus, { base: string; hover: string; selected: string }> = {
  occupied:    { base: "#DDD8D0", hover: "#D0CBC3", selected: "#C4BFB7" },
  available:   { base: "#FDE4C4", hover: "#FCD5A0", selected: "#FBC680" },
  coming_soon: { base: "#C8E8F4", hover: "#ADD8EE", selected: "#92C8E8" },
};

const statusStroke: Record<MallUnitStatus, string> = {
  occupied: "#9B9488",
  available: "#E8740E",
  coming_soon: "#0A9AB8",
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
    <div className={cn("relative overflow-hidden rounded-2xl", className)} style={{ background: "#F0EBE3", border: "1px solid #D4CFC6" }}>
      {/* Zoom controls — refined, compact */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {[
          { action: handleZoomIn, disabled: zoom >= MAX_ZOOM, icon: ZoomIn, label: "تكبير" },
          { action: handleZoomOut, disabled: zoom <= MIN_ZOOM, icon: ZoomOut, label: "تصغير" },
          { action: handleReset, disabled: zoom === 1 && pan.x === 0 && pan.y === 0, icon: RotateCcw, label: "إعادة ضبط" },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            disabled={btn.disabled}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition disabled:opacity-30"
            style={{ background: "hsl(0 0% 100% / 0.85)", border: "1px solid #D4CFC6", boxShadow: "0 1px 3px hsl(0 0% 0% / 0.06)" }}
            aria-label={btn.label}
          >
            <btn.icon className="h-3.5 w-3.5" style={{ color: "#4A4540" }} />
          </button>
        ))}
      </div>

      {/* Zoom level badge */}
      {zoom > 1 && (
        <div className="absolute top-3 right-3 z-10 rounded-md px-2 py-0.5 text-[0.65rem] font-bold" style={{ background: "hsl(0 0% 100% / 0.85)", border: "1px solid #D4CFC6", color: "#4A4540" }}>
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
        className={cn("touch-none p-2 md:p-3", zoom > 1 && "cursor-grab active:cursor-grabbing")}
        style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transformOrigin: "center center", transition: isPanning.current ? "none" : "transform 0.25s ease-out" }}
      >
      <svg
        viewBox="-20 -20 1040 1040"
        className="h-full w-full"
        role="img"
        aria-label="خريطة الطابق التفاعلية لمول البستان"
      >
        <defs>
          <linearGradient id="floorGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EAE4DA" />
            <stop offset="100%" stopColor="#E0D8CC" />
          </linearGradient>

          <linearGradient id="corridorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4CFC6" />
            <stop offset="100%" stopColor="#CCC6BC" />
          </linearGradient>

          <radialGradient id="atriumGlass" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#E8F2F8" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#DCE8F0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C8DCE8" stopOpacity="0.5" />
          </radialGradient>

          <filter id="buildingShadow" x="-5%" y="-5%" width="115%" height="115%">
            <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.12" />
          </filter>

          <filter id="selectedGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#E8740E" floodOpacity="0.45" />
          </filter>

          <filter id="unitShadow" x="-2%" y="-2%" width="104%" height="104%">
            <feDropShadow dx="0.5" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.06" />
          </filter>

          <pattern id="glassHatch" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="20" stroke="#B0D4E8" strokeWidth="0.4" strokeOpacity="0.2" />
          </pattern>

          {/* Label background for tenant names */}
          <filter id="labelBg" x="-4" y="-2" width="108%" height="140%">
            <feFlood floodColor="#F5F2ED" floodOpacity="0.8" result="bg" />
            <feMerge>
              <feMergeNode in="bg" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Building shadow ── */}
        <polygon points={OUTER_SHELL} fill="#555" opacity="0.08" transform="translate(4,5)" />

        {/* ── Floor surface ── */}
        <polygon points={OUTER_SHELL} fill="url(#floorGrad)" stroke="#7A7468" strokeWidth="2.5" filter="url(#buildingShadow)" />

        {/* ── Wall lines (double stroke) ── */}
        <polygon points={OUTER_SHELL} fill="none" stroke="#5A5550" strokeWidth="4" />
        <polygon points={OUTER_SHELL} fill="none" stroke="#A09888" strokeWidth="1" />

        {/* ── Corridor ── */}
        <polygon points={CORRIDOR_BOUNDARY} fill="url(#corridorGrad)" stroke="#9B9488" strokeWidth="1.2" />

        {/* ── Central atrium — toned down ── */}
        <AtriumInteractiveLayer
          mode={atriumMode}
          customColor={pulseColor}
          customLabel={atriumLabel}
          onClick={() => onAtriumClick?.()}
        />

        {/* ── Elevator ── */}
        <rect x={ELEVATOR_RECT.x} y={ELEVATOR_RECT.y} width={ELEVATOR_RECT.w} height={ELEVATOR_RECT.h} rx="5" fill="#CCC6BC" stroke="#9B9488" strokeWidth="1" />
        <text x={ELEVATOR_RECT.x + ELEVATOR_RECT.w / 2} y={ELEVATOR_RECT.y + ELEVATOR_RECT.h / 2 + 4} textAnchor="middle" className="text-[11px] font-semibold" fill="#6B6358">مصاعد</text>

        {/* ── Stairs ── */}
        {STAIR_RECTS.map((stair, i) => (
          <g key={`stair-${i}`}>
            <rect x={stair.x} y={stair.y} width={stair.w} height={stair.h} rx="3" fill="#D8D3CA" stroke="#9B9488" strokeWidth="0.8" />
            {[0.25, 0.5, 0.75].map((frac) => (
              <line key={frac} x1={stair.x + 3} y1={stair.y + stair.h * frac} x2={stair.x + stair.w - 3} y2={stair.y + stair.h * frac} stroke="#9B9488" strokeWidth="0.5" opacity="0.4" />
            ))}
            <text x={stair.x + stair.w / 2} y={stair.y + stair.h / 2 + 3} textAnchor="middle" className="text-[9px]" fill="#7A7468">{stair.label}</text>
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
                  opacity: isMuted ? 0.18 : 1,
                  fillOpacity: isMuted ? 0.25 : 1,
                }}
                transition={{ duration: 0.2 }}
                fill={isSelected ? colors.selected : isHovered ? colors.hover : colors.base}
                stroke={isHighlighted ? "#2563EB" : isSelected ? "#E8740E" : stroke}
                strokeWidth={isHighlighted ? 2.5 : isSelected ? 3 : isHovered ? 2 : 1.2}
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

        {/* ── Structural columns — subtle ── */}
        {COLUMN_POSITIONS.map(([cx, cy], i) => (
          <g key={`col-${i}`}>
            <circle cx={cx} cy={cy} r="7" fill="#7A7468" />
            <circle cx={cx} cy={cy} r="4.5" fill="#9B9488" />
            <circle cx={cx} cy={cy} r="2" fill="#B5AC9D" opacity="0.5" />
          </g>
        ))}

        {/* ── Unit labels — improved readability ── */}
        <g id="labels-layer" pointerEvents="none">
          {floor.units.map((unit) => {
            const isMuted = mutedUnitIds.has(unit.id);
            const tenantName = TENANT_NAMES[unit.id];
            const hasName = unit.status === "occupied" && tenantName;
            const isSelected = selectedUnitId === unit.id;

            return (
              <g key={`label-${unit.id}`} opacity={isMuted ? 0.2 : 1}>
                {hasName ? (
                  <>
                    {/* Tenant name — bold, clear */}
                    <text
                      x={unit.labelX}
                      y={unit.labelY - 5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[11px] font-bold"
                      fill={isSelected ? "#7A3A00" : "#2D2926"}
                    >
                      {tenantName}
                    </text>
                    {/* Unit code below — smaller, subdued */}
                    <text
                      x={unit.labelX}
                      y={unit.labelY + 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[8px] font-medium"
                      fill="#8B8478"
                    >
                      {unit.code}
                    </text>
                  </>
                ) : (
                  <>
                    {/* Unit code — primary label */}
                    <text
                      x={unit.labelX}
                      y={unit.labelY - 3}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[13px] font-bold"
                      fill={isSelected ? "#7A3A00" : "#2D2926"}
                    >
                      {unit.code}
                    </text>
                    {/* Area below */}
                    <text
                      x={unit.labelX}
                      y={unit.labelY + 12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[9px]"
                      fill="#6B6358"
                    >
                      {unit.area} م²
                    </text>
                  </>
                )}

                {/* Status indicator — small colored dot for non-occupied */}
                {unit.status !== "occupied" && (
                  <circle
                    cx={unit.labelX + 18}
                    cy={unit.labelY - 14}
                    r="4"
                    fill={unit.status === "available" ? "#E8740E" : "#0A9AB8"}
                    opacity={0.9}
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* ── Entrance ── */}
        <g id="entrance">
          <rect
            x={ENTRANCE_MARKER.x - 46}
            y={ENTRANCE_MARKER.y - 9}
            width="92"
            height="18"
            rx="4"
            fill="#5A5550"
            opacity="0.85"
          />
          <text
            x={ENTRANCE_MARKER.x}
            y={ENTRANCE_MARKER.y + 2}
            textAnchor="middle"
            className="text-[9px] font-semibold"
            fill="#F4F0EA"
          >
            {ENTRANCE_MARKER.label}
          </text>
        </g>

        {/* ── Hover tooltip — refined ── */}
        {hoveredId && (() => {
          const unit = floor.units.find((u) => u.id === hoveredId);
          if (!unit) return null;
          const tx = Math.min(Math.max(unit.labelX, 120), 880);
          const ty = unit.labelY - 34;
          const tenantName = TENANT_NAMES[unit.id];
          const tooltipText = tenantName ? `${tenantName} | ${unit.code}` : `${unit.code} | ${unit.area} م²`;
          const textLen = tooltipText.length * 6.5 + 24;
          return (
            <g pointerEvents="none">
              <rect
                x={tx - textLen / 2}
                y={ty - 14}
                width={textLen}
                height="26"
                rx="6"
                fill="hsl(222 36% 11%)"
                opacity="0.94"
              />
              <polygon
                points={`${tx - 4},${ty + 12} ${tx + 4},${ty + 12} ${tx},${ty + 18}`}
                fill="hsl(222 36% 11%)"
                opacity="0.94"
              />
              <text
                x={tx}
                y={ty + 2}
                textAnchor="middle"
                className="text-[10px] font-semibold"
                fill="#F4F0EA"
              >
                {tooltipText}
              </text>
            </g>
          );
        })()}
      </svg>
      </div>
    </div>
  );
}
