import { useMemo } from "react";
import { mallFloors, type MallFloorId } from "@/lib/mallFloorGeometry";

type Props = {
  floorId: MallFloorId;
  innerSize: number; // diameter of the inner wheel in px
  ringThickness?: number; // px
};

/**
 * Decorative outer ring of mall tenants for the selected floor.
 * Pure visual: surrounds the prize wheel and connects the game to the mall.
 * Stores are NOT prizes — they are presented as the participating venue context.
 */
export function StoreRing({ floorId, innerSize, ringThickness = 92 }: Props) {
  const floor = useMemo(() => mallFloors.find((f) => f.id === floorId), [floorId]);
  const units = floor?.units ?? [];

  const total = innerSize + ringThickness * 2;
  const center = total / 2;
  const trackRadius = innerSize / 2 + ringThickness / 2;

  // Limit to 14 visible badges max for clarity
  const visible = units.slice(0, 14);
  const count = Math.max(visible.length, 1);
  const angleStep = 360 / count;

  return (
    <div
      className="relative mx-auto"
      style={{ width: total, height: total }}
      aria-hidden="true"
    >
      {/* Subtle dashed track */}
      <svg
        width={total}
        height={total}
        className="absolute inset-0"
        viewBox={`0 0 ${total} ${total}`}
      >
        <circle
          cx={center}
          cy={center}
          r={trackRadius}
          fill="none"
          stroke="hsl(var(--primary) / 0.18)"
          strokeWidth={1}
          strokeDasharray="4 6"
        />
      </svg>

      {/* Tenant badges */}
      {visible.map((unit, i) => {
        const angle = (i * angleStep - 90) * (Math.PI / 180);
        const x = center + trackRadius * Math.cos(angle);
        const y = center + trackRadius * Math.sin(angle);
        return (
          <div
            key={unit.id}
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              width: 64,
            }}
          >
            <div className="h-9 w-9 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-[9px] font-bold text-foreground/80 overflow-hidden">
              {unit.code}
            </div>
            <span className="text-[9px] font-semibold text-muted-foreground text-center leading-tight line-clamp-1 max-w-[64px]">
              {unit.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
