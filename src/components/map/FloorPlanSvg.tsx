import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FloorId, MapUnitDefinition, UnitStatus } from "@/lib/floorMapData";

import floorGroundImg from "@/assets/floor-ground-3d.png";
import floorFirstImg from "@/assets/floor-first-3d.png";
import floorSecondImg from "@/assets/floor-second-3d.png";

type FloorPlanSvgProps = {
  className?: string;
  floorId: FloorId;
  units: MapUnitDefinition[];
  selectedUnitId: string | null;
  mutedUnitIds: Set<string>;
  onSelectUnit: (unit: MapUnitDefinition) => void;
};

const floorImageById: Record<FloorId, string> = {
  ground: floorGroundImg,
  first: floorFirstImg,
  second: floorSecondImg,
};

const statusStroke: Record<UnitStatus, string> = {
  occupied: "stroke-primary/40",
  available: "stroke-orange",
  coming_soon: "stroke-accent",
};

const statusFillHover: Record<UnitStatus, string> = {
  occupied: "hover:fill-primary/15",
  available: "hover:fill-orange/20",
  coming_soon: "hover:fill-accent/15",
};

export function FloorPlanSvg({
  className,
  floorId,
  units,
  selectedUnitId,
  mutedUnitIds,
  onSelectUnit,
}: FloorPlanSvgProps) {
  return (
    <div
      className={cn(
        "surface-panel relative min-h-[420px] overflow-hidden rounded-[1.75rem] md:min-h-[620px] lg:min-h-[760px]",
        className,
      )}
    >
      {/* 3D Architectural Background Image */}
      <motion.img
        key={floorId}
        src={floorImageById[floorId]}
        alt={`مخطط ${floorId === "ground" ? "الدور الأرضي" : floorId === "first" ? "الدور الأول" : "الدور الأخير"}`}
        className="h-full w-full object-contain"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        loading="eager"
      />

      {/* Interactive SVG Overlay */}
      <svg
        viewBox="0 0 1100 1100"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="خريطة الطابق التفاعلية"
        style={{ pointerEvents: "none" }}
      >
        <g id="unit-hotspots" style={{ pointerEvents: "all" }}>
          {units.map((unit) => {
            const isSelected = selectedUnitId === unit.unit_id;
            const isMuted = mutedUnitIds.has(unit.unit_id);

            return (
              <motion.g
                key={unit.unit_id}
                id={`unit-${unit.unit_id}`}
                initial={{ opacity: 0.85 }}
                animate={{ opacity: isMuted ? 0.15 : 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {/* Clickable hotspot polygon */}
                <polygon
                  points={unit.polygon}
                  onClick={() => onSelectUnit(unit)}
                  className={cn(
                    "cursor-pointer fill-transparent stroke-[1.5] transition-all duration-200",
                    statusStroke[unit.status],
                    statusFillHover[unit.status],
                    isSelected && "fill-primary/20 stroke-primary stroke-[2.5]",
                  )}
                />

                {/* Selected unit glow effect */}
                {isSelected && (
                  <polygon
                    points={unit.polygon}
                    className="pointer-events-none fill-none stroke-primary stroke-[3]"
                    style={{
                      filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.5))",
                    }}
                  />
                )}

                {/* Status indicator dot */}
                {unit.status === "available" && (
                  <circle
                    cx={unit.x}
                    cy={unit.y - 18}
                    r="6"
                    className="pointer-events-none fill-orange"
                    style={{
                      filter: "drop-shadow(0 0 4px hsl(var(--orange) / 0.6))",
                    }}
                  />
                )}
                {unit.status === "coming_soon" && (
                  <circle
                    cx={unit.x}
                    cy={unit.y - 18}
                    r="6"
                    className="pointer-events-none fill-accent"
                    style={{
                      filter: "drop-shadow(0 0 4px hsl(var(--accent) / 0.6))",
                    }}
                  />
                )}
              </motion.g>
            );
          })}
        </g>

        {/* Floating unit ID + area labels */}
        <g id="unit-labels">
          {units.map((unit) => {
            const isMuted = mutedUnitIds.has(unit.unit_id);
            if (isMuted) return null;

            return (
              <g key={`label-${unit.unit_id}`}>
                {/* Background pill for readability */}
                <rect
                  x={unit.x - 30}
                  y={unit.y - 14}
                  width={60}
                  height={30}
                  rx={6}
                  className="pointer-events-none fill-background/80"
                />
                <text
                  x={unit.x}
                  y={unit.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none fill-foreground text-[11px] font-bold"
                  style={{
                    textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                >
                  {unit.unit_id}
                </text>
                <text
                  x={unit.x}
                  y={unit.y + 13}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none fill-muted-foreground text-[9px] font-medium"
                >
                  {unit.area_m2} م²
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
