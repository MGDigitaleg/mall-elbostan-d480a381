import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { AtriumInteractiveLayer } from "./AtriumInteractiveLayer";
import { cn } from "@/lib/utils";
import type { MallFloor, MallUnit, MallUnitStatus } from "@/lib/mallFloorGeometry";

import { UNIT_TENANT_NAMES as TENANT_NAMES, UNIT_TENANT_LOGOS as TENANT_LOGOS, UNIT_TENANT_BG_COLORS as TENANT_BG } from "@/lib/tenantMapLookup";

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
  hideControls?: boolean;
  className?: string;
};

// ── Status fills — refined, high-contrast ──
const statusFill: Record<MallUnitStatus, { base: string; hover: string; selected: string }> = {
  occupied:    { base: "#E2DDD5", hover: "#D5D0C8", selected: "#C8C3BB" },
  available:   { base: "#FDE4C4", hover: "#FCD5A0", selected: "#FBC680" },
  coming_soon: { base: "#C8E8F4", hover: "#ADD8EE", selected: "#92C8E8" },
};

const statusStroke: Record<MallUnitStatus, string> = {
  occupied: "#9B9488",
  available: "#E8740E",
  coming_soon: "#0A9AB8",
};

export function MallFloorMap({ floor, selectedUnitId, mutedUnitIds, onSelectUnit, onAtriumClick, atriumConfig, highlightedUnitIds, hideControls, className }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredBadgeId, setHoveredBadgeId] = useState<string | null>(null);
  const atriumMode = atriumConfig?.mode ?? "spin";
  const pulseColor = atriumConfig?.pulseColor;
  const atriumLabel = atriumConfig?.label;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_ZOOM = 1; // zoom bounds
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
    // Only intercept scroll when zoomed in — at default zoom, let the page scroll normally
    if (zoom <= MIN_ZOOM && e.deltaY > 0) return; // scrolling down at min zoom → page scroll
    if (zoom <= MIN_ZOOM && e.deltaY < 0) {
      // scrolling up at min zoom → allow zoom in but don't block page scroll if already at min
    }
    const delta = e.deltaY > 0 ? -ZOOM_STEP * 0.5 : ZOOM_STEP * 0.5;
    const next = Math.min(Math.max(zoom + delta, MIN_ZOOM), MAX_ZOOM);
    if (next === zoom) return; // no change, let page scroll
    e.preventDefault();
    setZoom(next);
    if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
  }, [zoom]);

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
    <div className={cn("relative overflow-hidden rounded-2xl border border-border", className)} style={{ background: "hsl(var(--card))", boxShadow: "0 2px 8px hsl(0 0% 0% / 0.05), 0 12px 36px hsl(0 0% 0% / 0.04)" }}>
      {/* Zoom controls */}
      {!hideControls && (
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
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-all disabled:opacity-25 bg-card/95 border border-border shadow-sm"
              aria-label={btn.label}
            >
              <btn.icon className="h-4 w-4 text-foreground/70" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom badge */}
      {zoom > 1 && (
        <div className="absolute top-3 right-3 z-10 rounded-lg px-2.5 py-1 text-[0.68rem] font-bold bg-card/95 border border-border text-foreground">
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
        preserveAspectRatio="xMidYMid meet"
        className="block h-auto w-full"
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

          <filter id="selectedGlow" x="-18%" y="-18%" width="136%" height="136%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#E8740E" floodOpacity="0.5" />
          </filter>

          <filter id="highlightGlow" x="-12%" y="-12%" width="124%" height="124%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#2563EB" floodOpacity="0.4" />
          </filter>

          <filter id="unitShadow" x="-2%" y="-2%" width="104%" height="104%">
            <feDropShadow dx="0.5" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.06" />
          </filter>

          <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="3" floodColor="#000" floodOpacity="0.18" />
          </filter>

          <pattern id="glassHatch" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="20" stroke="#B0D4E8" strokeWidth="0.4" strokeOpacity="0.2" />
          </pattern>
        </defs>

        {/* ── Building shadow ── */}
        <polygon points={OUTER_SHELL} fill="#555" opacity="0.08" transform="translate(4,5)" />

        {/* ── Floor surface ── */}
        <polygon points={OUTER_SHELL} fill="url(#floorGrad)" stroke="#7A7468" strokeWidth="2.5" filter="url(#buildingShadow)" />

        {/* ── Wall lines ── */}
        <polygon points={OUTER_SHELL} fill="none" stroke="#5A5550" strokeWidth="4" />
        <polygon points={OUTER_SHELL} fill="none" stroke="#A09888" strokeWidth="1" />

        {/* ── Corridor ── */}
        <polygon points={CORRIDOR_BOUNDARY} fill="url(#corridorGrad)" stroke="#9B9488" strokeWidth="1.2" />

        {/* ── Central atrium ── */}
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

        {/* ── ClipPaths for logo badges ── */}
        <defs>
          {floor.units.map((unit) => {
            const badgeW = 80;
            const badgeH = 56;
            const badgeR = 8;
            const bx = unit.labelX - badgeW / 2;
            const by = unit.labelY - badgeH / 2 - 6;
            return (
              <clipPath key={`clip-${unit.id}`} id={`clip-${unit.id}`}>
                <rect x={bx} y={by} width={badgeW} height={badgeH} rx={badgeR} ry={badgeR} />
              </clipPath>
            );
          })}
        </defs>

        {/* ── Unit polygons ── */}
        <g id="units-layer">
          {floor.units.map((unit) => {
            const isSelected = selectedUnitId === unit.id;
            const isHovered = hoveredId === unit.id;
            const isMuted = mutedUnitIds.has(unit.id);
            const isHighlighted = highlightedUnitIds?.has(unit.id) ?? false;
            const colors = statusFill[unit.status];
            const stroke = statusStroke[unit.status];
            const brandBg = TENANT_BG[unit.id];
            const hasBrand = unit.status === "occupied" && brandBg;

            let appliedFilter = "url(#unitShadow)";
            if (isSelected) appliedFilter = "url(#selectedGlow)";
            else if (isHighlighted) appliedFilter = "url(#highlightGlow)";

            const baseFill = hasBrand
              ? brandBg
              : isSelected ? colors.selected : isHovered ? colors.hover : colors.base;

            const hoverBrightness = hasBrand && isHovered ? "brightness(1.25)" : undefined;

            return (
              <motion.polygon
                key={unit.id}
                points={unit.polygon}
                initial={false}
                animate={{
                  opacity: isMuted ? 0.15 : 1,
                  fillOpacity: isMuted ? 0.2 : 1,
                }}
                transition={{ duration: 0.2 }}
                fill={baseFill}
                stroke={isHighlighted ? "#2563EB" : isSelected ? "#E8740E" : hasBrand ? (isHovered ? "#FFFFFFCC" : "#00000030") : stroke}
                strokeWidth={isHighlighted ? 2.5 : isSelected ? 3.5 : isHovered ? (hasBrand ? 2.8 : 2.2) : 1.2}
                filter={hoverBrightness ? undefined : appliedFilter}
                style={{ 
                  transition: "fill 0.2s, stroke 0.25s, stroke-width 0.25s, filter 0.25s",
                  filter: hoverBrightness || undefined,
                }}
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

        {/* ── Structural columns ── */}
        {COLUMN_POSITIONS.map(([cx, cy], i) => (
          <g key={`col-${i}`}>
            <circle cx={cx} cy={cy} r="7" fill="#7A7468" />
            <circle cx={cx} cy={cy} r="4.5" fill="#9B9488" />
            <circle cx={cx} cy={cy} r="2" fill="#B5AC9D" opacity="0.5" />
          </g>
        ))}

        {/* ── Unit labels — with logos when available ── */}
        <g id="labels-layer">
          {floor.units.map((unit) => {
            const isMuted = mutedUnitIds.has(unit.id);
            const tenantName = TENANT_NAMES[unit.id];
            const tenantLogo = TENANT_LOGOS[unit.id];
            const brandBg = TENANT_BG[unit.id];
            const hasName = unit.status === "occupied" && tenantName;
            const isSelected = selectedUnitId === unit.id;
            const hasBrandBg = !!brandBg;

            const isLightBg = brandBg && (brandBg === "#FFFFFF" || brandBg === "#F5F0E8" || brandBg === "#E8DDD0" || brandBg === "#E8E0D0" || brandBg === "#E0D8C8" || brandBg === "#FDE4C4" || brandBg === "#C8A96E" || brandBg === "#FDD835" || brandBg === "#FF6B00");
            const codeColor = hasBrandBg
              ? (isLightBg ? "#4A4540" : "#FFFFFFA0")
              : (isSelected ? "#9B6520" : "#7A7468");

            // Badge dimensions for logo container
            const badgeW = 80;
            const badgeH = 56;
            const badgeR = 8;
            const badgeX = unit.labelX - badgeW / 2;
            const badgeY = unit.labelY - badgeH / 2 - 6;

            // Logo image with padding inside badge
            const logoPad = 3;
            const logoImgW = badgeW - logoPad * 2;
            const logoImgH = badgeH - logoPad * 2;

            return (
              <g key={`label-${unit.id}`} opacity={isMuted ? 0.15 : 1}>
                {tenantLogo && hasName ? (
                  <g
                    pointerEvents="all"
                    style={{ cursor: "pointer" }}
                    filter="url(#badgeShadow)"
                    onMouseEnter={() => setHoveredBadgeId(unit.id)}
                    onMouseLeave={() => setHoveredBadgeId(null)}
                    onClick={() => onSelectUnit(unit)}
                  >
                    {/* White rounded badge background */}
                    <rect
                      x={badgeX}
                      y={badgeY}
                      width={badgeW}
                      height={badgeH}
                      rx={badgeR}
                      ry={badgeR}
                      fill="#FFFFFF"
                      stroke={hoveredBadgeId === unit.id ? "#2563EB" : (hasBrandBg ? brandBg + "60" : "#00000015")}
                      strokeWidth={hoveredBadgeId === unit.id ? 2 : 1}
                      opacity="0.95"
                      style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
                    />
                    {/* Tenant logo clipped to rounded badge */}
                    <image
                      href={tenantLogo}
                      x={badgeX + logoPad}
                      y={badgeY + logoPad}
                      width={logoImgW}
                      height={logoImgH}
                      preserveAspectRatio="xMidYMid meet"
                      clipPath={`url(#clip-${unit.id})`}
                    />
                    {/* Unit code below badge */}
                    <text
                      x={unit.labelX}
                      y={badgeY + badgeH + 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[8px] font-semibold"
                      fill={codeColor}
                    >
                      {unit.code}
                    </text>
                    {/* Tooltip on hover */}
                    {hoveredBadgeId === unit.id && tenantName && (
                      <g>
                        <rect
                          x={unit.labelX - 55}
                          y={badgeY - 28}
                          width={110}
                          height={22}
                          rx={6}
                          fill="#0B1220"
                          opacity="0.92"
                        />
                        <text
                          x={unit.labelX}
                          y={badgeY - 14}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-[10px] font-bold"
                          fill="#FFFFFF"
                        >
                          {tenantName}
                        </text>
                      </g>
                    )}
                  </g>
                ) : hasName ? (
                  <g pointerEvents="none">
                    <text
                      x={unit.labelX}
                      y={unit.labelY - 5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[11px] font-bold"
                      fill={hasBrandBg ? (isLightBg ? "#1E1C1A" : "#FFFFFF") : (isSelected ? "#7A3A00" : "#1E1C1A")}
                    >
                      {tenantName}
                    </text>
                    <text
                      x={unit.labelX}
                      y={unit.labelY + 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[8px] font-semibold"
                      fill={codeColor}
                    >
                      {unit.code}
                    </text>
                  </g>
                ) : (
                  <g pointerEvents="none">
                    <text
                      x={unit.labelX}
                      y={unit.labelY - 3}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[13px] font-bold"
                      fill={isSelected ? "#7A3A00" : "#1E1C1A"}
                    >
                      {unit.code}
                    </text>
                    <text
                      x={unit.labelX}
                      y={unit.labelY + 12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[9px] font-medium"
                      fill="#5A5550"
                    >
                      {unit.area} م²
                    </text>
                  </g>
                )}

                {/* Status dot for non-occupied */}
                {unit.status !== "occupied" && (
                  <circle
                    cx={unit.labelX + 18}
                    cy={unit.labelY - 14}
                    r="4"
                    fill={unit.status === "available" ? "#E8740E" : "#0A9AB8"}
                    opacity={0.9}
                    stroke="#F0EBE3"
                    strokeWidth="1"
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
            fill="#4A4540"
            opacity="0.9"
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

        {/* ── Hover tooltip — premium with brand accent & details ── */}
        {hoveredId && (() => {
          const unit = floor.units.find((u) => u.id === hoveredId);
          if (!unit) return null;
          const tx = Math.min(Math.max(unit.labelX, 160), 840);
          const ty = unit.labelY - 54;
          const tenantName = TENANT_NAMES[unit.id];
          const brandBg = TENANT_BG[unit.id];
          const isOccupied = unit.status === "occupied" && tenantName;

          const floorLabel = floor.label || "";
          const areaText = `${unit.area} م²`;

          if (isOccupied) {
            // Premium tooltip for occupied stores with details
            const nameLen = tenantName.length * 8.5 + 40;
            const detailText = `${unit.code} · ${floorLabel} · ${areaText}`;
            const detailLen = detailText.length * 5.5 + 24;
            const tooltipW = Math.max(nameLen, detailLen, 120);
            const tooltipH = 48;
            const accentColor = brandBg || "#2563EB";

            return (
              <g pointerEvents="none" style={{ filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.4))" }}>
                {/* Background pill */}
                <rect
                  x={tx - tooltipW / 2}
                  y={ty - tooltipH / 2}
                  width={tooltipW}
                  height={tooltipH}
                  rx="10"
                  fill="#0B1220"
                  opacity="0.97"
                />
                {/* Brand accent bar on top */}
                <rect
                  x={tx - tooltipW / 2}
                  y={ty - tooltipH / 2}
                  width={tooltipW}
                  height="4"
                  rx="10"
                  fill={accentColor}
                />
                {/* Arrow */}
                <polygon
                  points={`${tx - 6},${ty + tooltipH / 2} ${tx + 6},${ty + tooltipH / 2} ${tx},${ty + tooltipH / 2 + 7}`}
                  fill="#0B1220"
                  opacity="0.97"
                />
                {/* Store name */}
                <text
                  x={tx}
                  y={ty - 7}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[11.5px] font-bold"
                  fill="#FFFFFF"
                >
                  {tenantName}
                </text>
                {/* Details row: code · floor · area */}
                <text
                  x={tx}
                  y={ty + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[8px] font-medium"
                  fill="#94A3B8"
                >
                  {detailText}
                </text>
              </g>
            );
          }

          // Tooltip for non-occupied (available / coming soon)
          const statusLabel = unit.status === "available" ? "متاح للإيجار" : "قريباً";
          const statusColor = unit.status === "available" ? "#F97316" : "#06B6D4";
          const detailText = `${unit.code} · ${floorLabel} · ${areaText}`;
          const topLen = statusLabel.length * 8 + 30;
          const bottomLen = detailText.length * 5.5 + 24;
          const tooltipW = Math.max(topLen, bottomLen, 110);
          const tooltipH = 44;

          return (
            <g pointerEvents="none" style={{ filter: "drop-shadow(0 5px 14px rgba(0,0,0,0.35))" }}>
              <rect
                x={tx - tooltipW / 2}
                y={ty - tooltipH / 2}
                width={tooltipW}
                height={tooltipH}
                rx="10"
                fill="#1E1C1A"
                opacity="0.96"
              />
              {/* Status accent bar */}
              <rect
                x={tx - tooltipW / 2}
                y={ty - tooltipH / 2}
                width={tooltipW}
                height="4"
                rx="10"
                fill={statusColor}
              />
              <polygon
                points={`${tx - 6},${ty + tooltipH / 2} ${tx + 6},${ty + tooltipH / 2} ${tx},${ty + tooltipH / 2 + 7}`}
                fill="#1E1C1A"
                opacity="0.96"
              />
              {/* Status label */}
              <text
                x={tx}
                y={ty - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10.5px] font-bold"
                fill={statusColor}
              >
                {statusLabel}
              </text>
              {/* Details row */}
              <text
                x={tx}
                y={ty + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[8px] font-medium"
                fill="#A8A29E"
              >
                {detailText}
              </text>
            </g>
          );
        })()}
      </svg>
      </div>
    </div>
  );
}
