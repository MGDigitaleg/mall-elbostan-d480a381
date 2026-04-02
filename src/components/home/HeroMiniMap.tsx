import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MallFloorMap } from "@/components/map/MallFloorMap";
import {
  mallFloors,
  type MallFloorId,
  type MallUnit,
} from "@/lib/mallFloorGeometry";

/**
 * A compact, read-only mini-map that reuses the exact same SVG rendering
 * and color system as the full /map page — embedded inside the hero.
 */
export function HeroMiniMap() {
  const [floor] = useState<MallFloorId>("ground");

  const floorData = useMemo(
    () => mallFloors.find((f) => f.id === floor) ?? mallFloors[0],
    [floor],
  );

  const highlightUnit = useMemo(
    () => floorData.units.find((u) => u.status === "available") ?? floorData.units[0],
    [floorData.units],
  );

  const [selected, setSelected] = useState<MallUnit | null>(highlightUnit);
  const activeUnit = selected && selected.floor === floor ? selected : highlightUnit;
  const emptySet = useMemo(() => new Set<string>(), []);

  return (
    <Link to="/map" className="group block">
      <div
        className="overflow-hidden rounded-lg transition-shadow group-hover:shadow-lg"
        style={{
          border: "1px solid #1E293B",
          background: "#0F1A2E",
        }}
      >
        {/* Floor label bar */}
        <div
          className="flex items-center justify-between px-2.5 py-1"
          style={{ borderBottom: "1px solid #1E293B" }}
        >
          <span
            className="font-poppins text-[0.5rem] font-bold uppercase tracking-[0.2em]"
            style={{ color: "#64748B" }}
          >
            Ground Floor
          </span>
          <span
            className="text-[0.5rem] font-bold"
            style={{ color: "#E8740E" }}
          >
            {floorData.units.filter((u) => u.status === "available").length} متاحة
          </span>
        </div>

        {/* Map canvas */}
        <div className="p-1.5">
          <MallFloorMap
            floor={floorData}
            selectedUnitId={activeUnit.id}
            mutedUnitIds={emptySet}
            onSelectUnit={setSelected}
            className="min-h-[140px] max-h-[160px]"
          />
        </div>

        {/* CTA hint */}
        <div
          className="flex items-center justify-center gap-1.5 py-1.5"
          style={{ borderTop: "1px solid #1E293B" }}
        >
          <span className="text-[0.58rem] font-bold" style={{ color: "#94A3B8" }}>
            افتح الخريطة التفاعلية
          </span>
          <span className="text-[0.58rem]" style={{ color: "#64748B" }}>←</span>
        </div>
      </div>
    </Link>
  );
}
