import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FloorId, MapUnitDefinition, UnitStatus } from "@/lib/floorMapData";

type FloorPlanSvgProps = {
  floorId: FloorId;
  units: MapUnitDefinition[];
  selectedUnitId: string | null;
  mutedUnitIds: Set<string>;
  onSelectUnit: (unit: MapUnitDefinition) => void;
};

const statusClass: Record<UnitStatus, string> = {
  occupied: "fill-card stroke-border",
  available: "fill-card stroke-orange",
  coming_soon: "fill-muted stroke-accent",
};

const floorShellById: Record<FloorId, string> = {
  ground: "130,120 940,120 1020,220 1020,840 900,980 300,980 120,840 120,220",
  first: "130,120 940,120 1020,220 1020,840 900,980 300,980 120,840 120,220",
  second: "130,120 940,120 1020,220 1020,840 900,980 300,980 120,840 120,220",
};

export function FloorPlanSvg({ floorId, units, selectedUnitId, mutedUnitIds, onSelectUnit }: FloorPlanSvgProps) {
  return (
    <div className="surface-panel rounded-[1.8rem] p-3 md:p-4">
      <svg viewBox="0 0 1100 1100" className="h-full w-full" role="img" aria-label="خريطة الطابق التفاعلية">
        <g id="floor-shell">
          <polygon points={floorShellById[floorId]} className="fill-background stroke-border stroke-[2]" />
        </g>

        <g id="circulation-corridors">
          <polygon points="380,350 720,350 820,470 820,720 720,820 380,820 280,720 280,470" className="fill-secondary/45 stroke-border stroke-[1.5]" />
          <polygon points="470,440 630,440 700,530 700,650 630,740 470,740 400,650 400,530" className="fill-background stroke-border stroke-[1.5]" />
          <line x1="550" y1="550" x2="550" y2="440" className="stroke-border stroke-[1.2]" />
          <line x1="550" y1="550" x2="700" y2="530" className="stroke-border stroke-[1.2]" />
          <line x1="550" y1="550" x2="700" y2="650" className="stroke-border stroke-[1.2]" />
          <line x1="550" y1="550" x2="550" y2="740" className="stroke-border stroke-[1.2]" />
          <line x1="550" y1="550" x2="400" y2="650" className="stroke-border stroke-[1.2]" />
          <line x1="550" y1="550" x2="400" y2="530" className="stroke-border stroke-[1.2]" />
        </g>

        <g id="stairs">
          <rect x="360" y="280" width="96" height="70" className="fill-accent/20 stroke-accent stroke-[1.5]" />
          <line x1="372" y1="292" x2="442" y2="338" className="stroke-accent stroke-[1.2]" />
          <line x1="378" y1="286" x2="448" y2="332" className="stroke-accent stroke-[1.2]" />
        </g>

        <g id="elevators">
          <rect x="470" y="220" width="160" height="66" className="fill-secondary/55 stroke-border stroke-[1.5]" rx="10" />
          <text x="550" y="258" textAnchor="middle" className="fill-muted-foreground text-[15px] font-semibold">مصاعد</text>
        </g>

        <g id="unit-polygons">
          {units.map((unit) => {
            const isSelected = selectedUnitId === unit.unit_id;
            const isMuted = mutedUnitIds.has(unit.unit_id);

            return (
              <motion.g
                key={unit.unit_id}
                id={`unit-${unit.unit_id}`}
                initial={{ opacity: 0.9 }}
                animate={{ opacity: isMuted ? 0.24 : 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <polygon
                  points={unit.polygon}
                  onClick={() => onSelectUnit(unit)}
                  className={cn(
                    "cursor-pointer stroke-[1.6] transition-all duration-200 hover:fill-secondary",
                    statusClass[unit.status],
                    isSelected && "stroke-primary stroke-[2.5]",
                  )}
                />
                {unit.status === "available" && (
                  <circle cx={unit.x - 34} cy={unit.y - 22} r="7" className="fill-orange" />
                )}
                {unit.status === "coming_soon" && (
                  <circle cx={unit.x - 34} cy={unit.y - 22} r="7" className="fill-accent" />
                )}
              </motion.g>
            );
          })}
        </g>

        <g id="unit-numbers">
          {units.map((unit) => (
            <text
              key={`${unit.unit_id}-number`}
              x={unit.x}
              y={unit.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-[14px] font-semibold"
            >
              {unit.unit_id}
            </text>
          ))}
        </g>

        <g id="labels-layer">
          {units.map((unit) => (
            <text
              key={`${unit.unit_id}-label`}
              x={unit.x}
              y={unit.y + 21}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[11px]"
            >
              {unit.area_m2} م²
            </text>
          ))}
        </g>

        <g id="interactive-hotspots" />
      </svg>
    </div>
  );
}
