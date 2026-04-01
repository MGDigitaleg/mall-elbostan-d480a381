import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FloorId, MapUnitDefinition, UnitStatus } from "@/lib/floorMapData";
import { floorPolygonConfigs } from "@/lib/floorPolygonData";

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

export function FloorPlanSvg({
  className,
  floorId,
  units,
  selectedUnitId,
  mutedUnitIds,
  onSelectUnit,
}: FloorPlanSvgProps) {
  const viewBox = floorPolygonConfigs[floorId].viewBox;
  const [, , vbW, vbH] = viewBox.split(" ").map(Number);
  const aspectStyle = { aspectRatio: `${vbW} / ${vbH}` };

  return (
    <div
      className={cn(
        "surface-panel relative overflow-hidden rounded-[1.75rem]",
        className,
      )}
      style={aspectStyle}
    >
      {/* 3D Architectural Background Image */}
      <motion.img
        key={floorId}
        src={floorImageById[floorId]}
        alt={`مخطط ${floorId === "ground" ? "الدور الأرضي" : floorId === "first" ? "الدور الأول" : "الدور الأخير"}`}
        className="absolute inset-0 h-full w-full object-contain"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        loading="eager"
      />

      {/* Interactive SVG Overlay — hotspots only, no labels */}
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="خريطة الطابق التفاعلية"
        style={{ pointerEvents: "none" }}
      >
        {/* Glow filter for selected unit */}
        <defs>
          <filter id="glow-selected" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g id="unit-hotspots" style={{ pointerEvents: "all" }}>
          {units.map((unit) => {
            const isSelected = selectedUnitId === unit.unit_id;
            const isMuted = mutedUnitIds.has(unit.unit_id);

            return (
              <motion.g
                key={unit.unit_id}
                id={`unit-${unit.unit_id}`}
                initial={{ opacity: 0.85 }}
                animate={{ opacity: isMuted ? 0.1 : 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {/* Invisible clickable hotspot — NO fill color ever */}
                <polygon
                  points={unit.polygon}
                  onClick={() => onSelectUnit(unit)}
                  className="cursor-pointer transition-all duration-200"
                  fill="transparent"
                  stroke={isSelected ? "hsl(var(--primary))" : "transparent"}
                  strokeWidth={isSelected ? 2 : 0}
                  filter={isSelected ? "url(#glow-selected)" : undefined}
                  style={{
                    strokeOpacity: isSelected ? 0.7 : 0,
                  }}
                />

                {/* Hover-only outline — separate element to avoid fill issues */}
                <polygon
                  points={unit.polygon}
                  className="pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  fill="transparent"
                  stroke="hsl(var(--primary))"
                  strokeWidth={1}
                  style={{
                    opacity: 0,
                  }}
                />
              </motion.g>
            );
          })}
        </g>
      </svg>

      {/* CSS hover overlay — applied via hover on the container */}
      <style>{`
        #unit-hotspots polygon:first-child:hover {
          stroke: hsl(var(--primary));
          stroke-width: 1.5;
          stroke-opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
