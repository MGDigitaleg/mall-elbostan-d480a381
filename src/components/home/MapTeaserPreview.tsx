import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MallFloorMap } from "@/components/map/MallFloorMap";
import {
  mallFloors,
  floorLabelsAr,
  statusLabelsAr,
  type MallUnit,
} from "@/lib/mallFloorGeometry";

/**
 * Homepage map teaser — deliberately light.
 * One compact preview, one selected unit line, two CTAs max.
 */
export function MapTeaserPreview() {
  const floor = mallFloors[0];
  const defaultUnit = useMemo(
    () => floor.units.find((unit) => unit.status === "available") ?? floor.units[0],
    [floor.units],
  );
  const [selectedUnit, setSelectedUnit] = useState<MallUnit | null>(defaultUnit);
  const activeUnit = selectedUnit ?? defaultUnit;

  const mutedUnitIds = useMemo(
    () => new Set(floor.units.filter((unit) => unit.id !== activeUnit.id).map((unit) => unit.id)),
    [activeUnit.id, floor.units],
  );

  return (
    <div className="mx-auto max-w-[34rem] overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <MallFloorMap
        floor={floor}
        selectedUnitId={activeUnit.id}
        mutedUnitIds={mutedUnitIds}
        onSelectUnit={setSelectedUnit}
        className="max-h-[180px] min-h-[145px] md:max-h-[200px]"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1 text-[0.66rem] text-muted-foreground">
          <span className="rounded-full border border-border bg-background px-2 py-0.5 font-bold text-foreground">
            {activeUnit.code}
          </span>
          <span>
            {floorLabelsAr[activeUnit.floor]} · {activeUnit.area} م² · {statusLabelsAr[activeUnit.status]}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Link to="/map">
            <Button variant="cta" className="h-7 rounded-md px-3 text-[0.66rem] font-bold">
              افتح الدليل
            </Button>
          </Link>
          <Link to="/stores">
            <Button variant="outline-blue" className="h-7 rounded-md px-3 text-[0.66rem]">
              المتاجر
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
