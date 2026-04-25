import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw, Layers, X } from "lucide-react";
import { AtriumInteractiveLayer } from "./AtriumInteractiveLayer";
import { cn } from "@/lib/utils";
import type { MallFloor, MallUnit, MallUnitStatus } from "@/lib/mallFloorGeometry";
import { categoryLabelsAr, statusLabelsAr, floorLabelsAr } from "@/lib/mallFloorGeometry";

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
  activeMarkerUnitId?: string | null;
  hideControls?: boolean;
  className?: string;
  floorLabel?: string;
  onClearSelection?: () => void;
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

export function MallFloorMap({ floor, selectedUnitId, mutedUnitIds, onSelectUnit, onAtriumClick, atriumConfig, highlightedUnitIds, activeMarkerUnitId, hideControls, className, floorLabel, onClearSelection }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredBadgeId, setHoveredBadgeId] = useState<string | null>(null);
  // Tap-to-confirm: first tap shows a confirmation tooltip; second tap (or ✓) opens details.
  // Prevents accidental selections while panning/zooming on touch devices.
  const [pendingUnitId, setPendingUnitId] = useState<string | null>(null);
  const didPanRef = useRef(false);
  const atriumMode = atriumConfig?.mode ?? "spin";
  const pulseColor = atriumConfig?.pulseColor;
  const atriumLabel = atriumConfig?.label;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const isAnimatingReset = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const prevSize = useRef({ w: 0, h: 0 });

  // ResizeObserver: animated reset of zoom/pan when card resizes or device rotates
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const w = Math.round(width);
      const h = Math.round(height);
      // Skip the initial measurement and trivial changes (< 8px)
      const prev = prevSize.current;
      const significant = prev.w > 0 && (Math.abs(w - prev.w) > 8 || Math.abs(h - prev.h) > 8);
      prevSize.current = { w, h };
      setContainerSize({ w, h });
      if (significant) {
        // Animate back via the existing CSS transition
        isAnimatingReset.current = true;
        requestAnimationFrame(() => {
          setZoom(1);
          setPan({ x: 0, y: 0 });
          setTimeout(() => { isAnimatingReset.current = false; }, 350);
        });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);


  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.4;
  const PAN_STEP = 40;

  const handleZoomIn = () => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM));
  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(z - ZOOM_STEP, MIN_ZOOM);
      if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const handleBackToOverview = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    onClearSelection?.();
  };
  const isOverviewActive = zoom === 1 && pan.x === 0 && pan.y === 0 && !selectedUnitId;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    didPanRef.current = false;
    if (zoom <= 1) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [zoom, pan]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      didPanRef.current = true;
      // Cancel any pending tap-confirm tooltip when the user starts panning.
      setPendingUnitId((id) => (id ? null : id));
    }
    setPan({ x: panStart.current.panX + dx, y: panStart.current.panY + dy });
  }, []);

  const handlePointerUp = useCallback(() => { isPanning.current = false; }, []);

  // Tap-to-confirm logic: first tap on a unit shows a confirmation tooltip,
  // second tap on the same unit (or on the ✓ button) opens the details panel.
  const handleUnitTap = useCallback((unit: MallUnit) => {
    if (didPanRef.current) {
      didPanRef.current = false;
      return;
    }
    if (pendingUnitId === unit.id) {
      setPendingUnitId(null);
      onSelectUnit(unit);
      return;
    }
    setPendingUnitId(unit.id);
  }, [pendingUnitId, onSelectUnit]);

  // Clear pending confirmation when the underlying selection changes from outside
  // (e.g., URL highlight, search), or when the floor changes.
  useEffect(() => { setPendingUnitId(null); }, [floor.id, selectedUnitId]);

  /**
   * Spatial keyboard navigation between units.
   * - Enter / Space: select the unit
   * - Arrow keys: move focus to the spatially-nearest unit in that screen direction.
   *   In RTL, ArrowRight = previous (moves toward "earlier" unit on screen),
   *   ArrowLeft = next. Up/Down work in screen coordinates as expected.
   */
  const moveFocusToUnit = useCallback((unitId: string) => {
    const el = containerRef.current?.querySelector<SVGElement>(`[data-unit-id="${unitId}"]`);
    el?.focus();
  }, []);

  const findNeighbor = useCallback((from: MallUnit, dir: "up" | "down" | "left" | "right"): MallUnit | null => {
    const candidates = floor.units.filter((u) => u.id !== from.id && !mutedUnitIds.has(u.id));
    if (!candidates.length) return null;
    const fx = from.labelX;
    const fy = from.labelY;
    let best: { unit: MallUnit; score: number } | null = null;
    for (const u of candidates) {
      const dx = u.labelX - fx;
      const dy = u.labelY - fy;
      // Directional gate
      const aligned =
        dir === "up" ? dy < -1 :
        dir === "down" ? dy > 1 :
        dir === "left" ? dx < -1 :
        /* right */ dx > 1;
      if (!aligned) continue;
      // Penalize off-axis distance more than on-axis distance
      const onAxis = (dir === "up" || dir === "down") ? Math.abs(dy) : Math.abs(dx);
      const offAxis = (dir === "up" || dir === "down") ? Math.abs(dx) : Math.abs(dy);
      const score = onAxis + offAxis * 2.2;
      if (!best || score < best.score) best = { unit: u, score };
    }
    return best?.unit ?? null;
  }, [floor.units, mutedUnitIds]);

  const handleUnitKeyDown = useCallback(
    (e: React.KeyboardEvent, unit: MallUnit) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelectUnit(unit);
        return;
      }
      // Map RTL arrow semantics: ArrowRight = visual-left in LTR sense -> use as "previous"
      // For a 2D mall map we navigate spatially regardless of RTL.
      let dir: "up" | "down" | "left" | "right" | null = null;
      if (e.key === "ArrowUp") dir = "up";
      else if (e.key === "ArrowDown") dir = "down";
      else if (e.key === "ArrowLeft") dir = "left";
      else if (e.key === "ArrowRight") dir = "right";
      if (!dir) return;
      const next = findNeighbor(unit, dir);
      if (next) {
        e.preventDefault();
        e.stopPropagation();
        moveFocusToUnit(next.id);
      }
    },
    [onSelectUnit, findNeighbor, moveFocusToUnit],
  );

  const handleContainerKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case "+":
      case "=":
        e.preventDefault();
        handleZoomIn();
        break;
      case "-":
      case "_":
        e.preventDefault();
        handleZoomOut();
        break;
      case "0":
        e.preventDefault();
        handleReset();
        break;
      case "ArrowUp":
        e.preventDefault();
        if (zoom > 1) setPan((p) => ({ ...p, y: p.y + PAN_STEP }));
        break;
      case "ArrowDown":
        e.preventDefault();
        if (zoom > 1) setPan((p) => ({ ...p, y: p.y - PAN_STEP }));
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (zoom > 1) setPan((p) => ({ ...p, x: p.x + PAN_STEP }));
        break;
      case "ArrowRight":
        e.preventDefault();
        if (zoom > 1) setPan((p) => ({ ...p, x: p.x - PAN_STEP }));
        break;
      case "Escape":
        // Dismiss pending tap-confirm tooltip without leaving the map.
        if (pendingUnitId) {
          e.preventDefault();
          setPendingUnitId(null);
        }
        break;
    }
  }, [zoom, pendingUnitId]);

  const activeMarkerUnit = activeMarkerUnitId
    ? floor.units.find((unit) => unit.id === activeMarkerUnitId) ?? null
    : null;

  return (
    <div
      className={cn("relative overflow-hidden rounded-2xl border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary", className)}
      style={{ background: "hsl(var(--card))", boxShadow: "0 2px 8px hsl(0 0% 0% / 0.05), 0 12px 36px hsl(0 0% 0% / 0.04)" }}
      tabIndex={0}
      role="application"
      dir="rtl"
      aria-label={`خريطة تفاعلية لـ${floorLabel ? ` ${floorLabel}` : "مول البستان"}. استخدم Tab للتنقل بين الوحدات، الأسهم للانتقال بين الوحدات المجاورة، Enter لاختيار وحدة، + و - للتكبير والتصغير، 0 لإعادة الضبط.`}
      aria-roledescription="خريطة طوابق تفاعلية"
      onKeyDown={handleContainerKeyDown}
    >
      {/* Live region — announces selection + tap-confirm changes to screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {pendingUnitId
          ? (() => {
              const u = floor.units.find((x) => x.id === pendingUnitId);
              if (!u) return "";
              const tenant = TENANT_NAMES[u.id];
              const namePart = u.status === "occupied" && tenant ? ` ${tenant}` : "";
              return `تم تظليل وحدة ${u.code}${namePart} في ${floorLabelsAr[u.floor]}. اضغط مجدداً لفتح التفاصيل أو Escape للإلغاء.`;
            })()
          : selectedUnitId
            ? (() => {
                const u = floor.units.find((x) => x.id === selectedUnitId);
                if (!u) return "";
                const tenant = TENANT_NAMES[u.id];
                const namePart = u.status === "occupied" && tenant ? ` ${tenant}` : "";
                return `تم اختيار وحدة ${u.code}${namePart} في ${floorLabelsAr[u.floor]}، ${categoryLabelsAr[u.category]}، ${statusLabelsAr[u.status]}.`;
              })()
            : ""}
      </div>
      {/* Zoom controls */}
      {!hideControls && (
        <div className="absolute top-3 start-3 z-10 flex flex-col gap-1">
          {[
            { action: handleZoomIn, disabled: zoom >= MAX_ZOOM, icon: ZoomIn, label: "تكبير الخريطة", shortcut: "+" },
            { action: handleZoomOut, disabled: zoom <= MIN_ZOOM, icon: ZoomOut, label: "تصغير الخريطة", shortcut: "-" },
            { action: handleReset, disabled: zoom === 1 && pan.x === 0 && pan.y === 0, icon: RotateCcw, label: "إعادة ضبط التكبير والتمرير", shortcut: "0" },
          ].map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={btn.action}
              disabled={btn.disabled}
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-all disabled:opacity-25 bg-card/95 border border-border shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card hover:border-primary/40"
              aria-label={btn.label}
              aria-keyshortcuts={btn.shortcut}
              title={btn.label}
            >
              <btn.icon className="h-4 w-4 text-foreground/70" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom badge */}
      {zoom > 1 && (
        <div className="absolute top-3 end-3 z-10 rounded-lg px-2.5 py-1 text-[0.68rem] font-bold bg-card/95 border border-border text-foreground">
          {Math.round(zoom * 100)}%
        </div>
      )}

      {/* Current floor + back-to-overview pills (top center).
          On mobile we use a min-h of 40px and bumped padding so the targets
          comfortably exceed the 44px thumb-friendly hit area (with implicit
          touch padding) and avoid mis-clicks while panning/zooming. */}
      {!hideControls && (floorLabel || onClearSelection) && (
        <div className="pointer-events-none absolute top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 sm:gap-2">
          {floorLabel && (
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`الدور الحالي: ${floorLabel}`}
              className="pointer-events-auto inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-border bg-card/95 px-3.5 py-1.5 text-[0.74rem] font-bold text-foreground shadow-sm backdrop-blur-sm sm:min-h-0 sm:px-3 sm:py-1 sm:text-[0.68rem]"
            >
              <Layers className="h-3.5 w-3.5 text-primary sm:h-3 sm:w-3" aria-hidden="true" />
              <span>{floorLabel}</span>
            </div>
          )}
          {!isOverviewActive && (
            <button
              type="button"
              onClick={handleBackToOverview}
              className="pointer-events-auto inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-orange/30 bg-orange/10 px-4 py-2 text-[0.78rem] font-bold text-orange shadow-sm backdrop-blur-sm transition-colors hover:bg-orange/20 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-card dark:text-orange-foreground sm:min-h-0 sm:gap-1 sm:px-3 sm:py-1 sm:text-[0.68rem]"
              style={{ touchAction: "manipulation" }}
              aria-label={
                selectedUnitId
                  ? "إلغاء اختيار الوحدة وإعادة التكبير إلى نظرة عامة على الخريطة"
                  : "إعادة الخريطة إلى نظرة عامة"
              }
              aria-keyshortcuts="0"
              title="نظرة عامة"
            >
              <X className="h-4 w-4 sm:h-3 sm:w-3" aria-hidden="true" />
              <span>نظرة عامة</span>
            </button>
          )}
        </div>
      )}

      <div
        ref={containerRef}
        
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn("touch-none", zoom > 1 && "cursor-grab active:cursor-grabbing")}
        style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transformOrigin: "center center", transition: isPanning.current ? "none" : isAnimatingReset.current ? "transform 0.35s cubic-bezier(0.4,0,0.2,1)" : "transform 0.25s ease-out" }}
      >
      <svg
        viewBox="-20 -20 1040 1040"
        preserveAspectRatio="xMidYMid meet"
        className="block h-auto w-full"
        role="img"
        aria-label="خريطة الطابق التفاعلية لمول البستان"
        onClick={(e) => {
          // Clear pending confirmation when tapping empty floor / corridor area.
          const target = e.target as Element | null;
          if (!target?.closest("[data-unit-id]") && !target?.closest("[data-tap-confirm]")) {
            setPendingUnitId(null);
          }
        }}
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
          <style>{`
            @keyframes badgeBounceIn {
              0% { transform: scale(0); opacity: 0; }
              60% { transform: scale(1.08); opacity: 1; }
              80% { transform: scale(0.96); }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes availablePulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.55; }
            }
            @keyframes comingSoonPulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.6; }
            }
            @keyframes selectedMarkerPulse {
              0% { transform: scale(0.82); opacity: 0.82; }
              70% { transform: scale(1.65); opacity: 0; }
              100% { transform: scale(1.65); opacity: 0; }
            }
            @keyframes tapConfirmIn {
              0% { opacity: 0; transform: translateY(6px) scale(0.92); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            @media (prefers-reduced-motion: reduce) {
              [data-tap-confirm] { animation: none !important; }
            }
            @keyframes selectedMarkerFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-5px); }
            }
            /* Keyboard focus rings for SVG interactive elements (unit polygons
               and the in-map tap-confirm action buttons). High contrast against
               both the cream floor and the dark tooltip card. */
            #units-layer [data-unit-id]:focus { outline: none; }
            #units-layer [data-unit-id]:focus-visible {
              stroke: #2563EB;
              stroke-width: 4;
              stroke-dasharray: 6 3;
              filter: drop-shadow(0 0 4px rgba(37,99,235,0.55));
            }
            [data-tap-confirm] [data-confirm-action]:focus { outline: none; }
            [data-tap-confirm] [data-confirm-action]:focus-visible rect {
              stroke: #FFFFFF;
              stroke-width: 2;
            }
          `}</style>
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

            const isPending = pendingUnitId === unit.id;
            const tenantName = TENANT_NAMES[unit.id];
            const namePart = unit.status === "occupied" && tenantName ? ` — ${tenantName}` : "";
            const statePart = isSelected
              ? "، مُختارة حالياً"
              : isPending
                ? "، بانتظار التأكيد، اضغط مجدداً للفتح"
                : "";
            const ariaLabel = `وحدة ${unit.code}${namePart}، ${categoryLabelsAr[unit.category]}، ${statusLabelsAr[unit.status]}، ${unit.area} متر مربع، ${floorLabelsAr[unit.floor]}${statePart}`;

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
                  animation: !isMuted ? (unit.status === "available" ? "availablePulse 2.5s ease-in-out infinite" : unit.status === "coming_soon" ? "comingSoonPulse 3s ease-in-out infinite" : undefined) : undefined,
                  // High-contrast focus ring — visible on keyboard focus only.
                  outline: "none",
                }}
                onClick={() => handleUnitTap(unit)}
                onMouseEnter={() => setHoveredId(unit.id)}
                onMouseLeave={() => setHoveredId(null)}
                onKeyDown={(e) => handleUnitKeyDown(e, unit)}
                onFocus={() => setHoveredId(unit.id)}
                onBlur={() => setHoveredId((id) => (id === unit.id ? null : id))}
                tabIndex={isMuted ? -1 : 0}
                role="button"
                aria-pressed={isSelected}
                aria-disabled={isMuted || undefined}
                aria-keyshortcuts="Enter Space"
                data-unit-id={unit.id}
                aria-label={ariaLabel}
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
          {floor.units.map((unit, idx) => {
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
                    /* Badge is a visual duplicate of the unit polygon's tap
                       target. Hide it from assistive tech to avoid two tab
                       stops/announcements per unit; the polygon already exposes
                       the full accessible name and selection state. */
                    aria-hidden="true"
                    focusable={false as unknown as boolean}
                    style={{
                      cursor: "pointer",
                      transformOrigin: `${unit.labelX}px ${badgeY + badgeH / 2}px`,
                      transform: hoveredBadgeId === unit.id ? "scale(1.12)" : "scale(1)",
                      transition: "transform 0.2s ease-out",
                      animation: `badgeBounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${idx * 0.04}s both`,
                    }}
                    filter="url(#badgeShadow)"
                    onMouseEnter={() => setHoveredBadgeId(unit.id)}
                    onMouseLeave={() => setHoveredBadgeId(null)}
                    onClick={() => handleUnitTap(unit)}
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

        {activeMarkerUnit && (
          <g
            id="active-marker"
            pointerEvents="none"
            style={{
              transformOrigin: `${activeMarkerUnit.labelX}px ${activeMarkerUnit.labelY - 44}px`,
              animation: "selectedMarkerFloat 1.9s ease-in-out infinite",
            }}
          >
            <line
              x1={activeMarkerUnit.labelX}
              y1={activeMarkerUnit.labelY - 34}
              x2={activeMarkerUnit.labelX}
              y2={activeMarkerUnit.labelY - 10}
              stroke="#2563EB"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.65"
            />
            <circle
              cx={activeMarkerUnit.labelX}
              cy={activeMarkerUnit.labelY - 44}
              r="13"
              fill="#2563EB"
              opacity="0.18"
              style={{ transformOrigin: `${activeMarkerUnit.labelX}px ${activeMarkerUnit.labelY - 44}px`, animation: "selectedMarkerPulse 1.7s ease-out infinite" }}
            />
            <circle
              cx={activeMarkerUnit.labelX}
              cy={activeMarkerUnit.labelY - 44}
              r="8"
              fill="#2563EB"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              filter="url(#highlightGlow)"
            />
            <circle
              cx={activeMarkerUnit.labelX}
              cy={activeMarkerUnit.labelY - 44}
              r="2.5"
              fill="#FFFFFF"
            />
          </g>
        )}

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

        {/* ── Tap-to-confirm tooltip — appears on first tap, opens details on second tap ── */}
        {pendingUnitId && (() => {
          const unit = floor.units.find((u) => u.id === pendingUnitId);
          if (!unit) return null;
          const tenantName = TENANT_NAMES[unit.id];
          const titleText =
            unit.status === "occupied" && tenantName
              ? tenantName
              : unit.status === "available"
                ? `${unit.code} — متاح للإيجار`
                : `${unit.code} — قريباً`;
          const subText = `${floorLabelsAr[unit.floor]} · وحدة ${unit.code}`;
          const hintText = "اضغط مجدداً للفتح";

          // Sizing
          const titleLen = Math.min(titleText.length, 28) * 8.5 + 28;
          const subLen = subText.length * 5.8 + 28;
          const hintLen = hintText.length * 6 + 60; // includes ✓ button width
          const tooltipW = Math.max(titleLen, subLen, hintLen, 168);
          const tooltipH = 78;
          const tx = Math.min(Math.max(unit.labelX, 20 + tooltipW / 2), 1000 - tooltipW / 2);
          const ty = Math.max(unit.labelY - tooltipH / 2 - 32, tooltipH / 2 + 4);

          const accentColor = TENANT_BG[unit.id]
            || (unit.status === "available" ? "#F97316" : unit.status === "coming_soon" ? "#06B6D4" : "#2563EB");

          const confirmBtnW = 28;
          const closeBtnW = 22;
          const btnY = ty + tooltipH / 2 - 22;
          const confirmBtnX = tx + tooltipW / 2 - confirmBtnW - 8;
          const closeBtnX = tx - tooltipW / 2 + 8;

          return (
            <g
              data-tap-confirm="true"
              style={{
                filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.45))",
                animation: "tapConfirmIn 180ms cubic-bezier(0.34,1.56,0.64,1) both",
                transformOrigin: `${tx}px ${ty + tooltipH / 2}px`,
              }}
            >
              {/* Background card */}
              <rect
                x={tx - tooltipW / 2}
                y={ty - tooltipH / 2}
                width={tooltipW}
                height={tooltipH}
                rx="12"
                fill="#0B1220"
                opacity="0.98"
              />
              {/* Brand accent strip */}
              <rect
                x={tx - tooltipW / 2}
                y={ty - tooltipH / 2}
                width={tooltipW}
                height="4"
                rx="12"
                fill={accentColor}
              />
              {/* Pointer arrow */}
              <polygon
                points={`${tx - 7},${ty + tooltipH / 2} ${tx + 7},${ty + tooltipH / 2} ${tx},${ty + tooltipH / 2 + 8}`}
                fill="#0B1220"
                opacity="0.98"
              />
              {/* Title (tenant or status name) */}
              <text
                x={tx}
                y={ty - tooltipH / 2 + 22}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[12px] font-bold"
                fill="#FFFFFF"
              >
                {titleText.length > 28 ? `${titleText.slice(0, 27)}…` : titleText}
              </text>
              {/* Floor + unit code */}
              <text
                x={tx}
                y={ty - tooltipH / 2 + 38}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[9px] font-medium"
                fill="#94A3B8"
              >
                {subText}
              </text>

              {/* Close (×) button */}
              <g
                style={{ cursor: "pointer" }}
                onClick={(e) => { e.stopPropagation(); setPendingUnitId(null); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    setPendingUnitId(null);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`إلغاء اختيار وحدة ${unit.code}`}
                data-confirm-action="cancel"
              >
                <rect
                  x={closeBtnX}
                  y={btnY}
                  width={closeBtnW}
                  height={20}
                  rx="6"
                  fill="#1E293B"
                  stroke="#334155"
                  strokeWidth="0.8"
                />
                <text
                  x={closeBtnX + closeBtnW / 2}
                  y={btnY + 11}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[12px] font-bold"
                  fill="#CBD5E1"
                >×</text>
              </g>

              {/* Hint label */}
              <text
                x={tx - 6}
                y={btnY + 11}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[9.5px] font-semibold"
                fill="#E2E8F0"
              >
                {hintText}
              </text>

              {/* Confirm (✓) button — opens the details panel */}
              <g
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingUnitId(null);
                  onSelectUnit(unit);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    setPendingUnitId(null);
                    onSelectUnit(unit);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`تأكيد وفتح تفاصيل وحدة ${unit.code}${
                  TENANT_NAMES[unit.id] && unit.status === "occupied" ? ` — ${TENANT_NAMES[unit.id]}` : ""
                }`}
                data-confirm-action="confirm"
              >
                <rect
                  x={confirmBtnX}
                  y={btnY}
                  width={confirmBtnW}
                  height={20}
                  rx="6"
                  fill={accentColor}
                />
                <text
                  x={confirmBtnX + confirmBtnW / 2}
                  y={btnY + 11}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[11px] font-bold"
                  fill="#FFFFFF"
                >✓</text>
              </g>
            </g>
          );
        })()}
      </svg>
      </div>
    </div>
  );
}
