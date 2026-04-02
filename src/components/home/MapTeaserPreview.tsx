import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MallFloorMap } from "@/components/map/MallFloorMap";
import { MapLegend } from "@/components/map/MapLegend";
import {
  mallFloors,
  floorLabelsAr,
  statusLabelsAr,
  type MallFloorId,
  type MallUnit,
  type MallUnitStatus,
} from "@/lib/mallFloorGeometry";

const statusDot: Record<MallUnitStatus, string> = {
  occupied: "#9B9488",
  available: "#E8740E",
  coming_soon: "#0A9AB8",
};

/**
 * Compact homepage map teaser — a small preview that invites users
 * into the full interactive guide. NOT a mini map page.
 */
export function MapTeaserPreview() {
  const floor = mallFloors[0]; // ground floor only
  const defaultUnit = useMemo(
    () => floor.units.find((u) => u.status === "available") ?? floor.units[0],
    [floor.units],
  );

  const [selectedUnit, setSelectedUnit] = useState<MallUnit | null>(defaultUnit);
  const activeUnit = selectedUnit ?? defaultUnit;
  const mutedUnitIds = useMemo(() => new Set<string>(), []);

  const availableCount = mallFloors.reduce(
    (sum, f) => sum + f.units.filter((u) => u.status === "available").length,
    0,
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border" style={{ background: "#F0EBE3" }}>
      {/* Thin control strip */}
      <div
        className="flex items-center justify-between gap-2 border-b border-border px-3 py-1"
        style={{ background: "hsl(var(--card))" }}
      >
        <div className="flex items-center gap-2 text-[0.62rem]">
          <span className="font-bold text-foreground">{floorLabelsAr[floor.id as MallFloorId]}</span>
          <span className="h-3 w-px bg-border" />
          <span style={{ color: "#E8740E" }} className="font-bold">{availableCount}</span>
          <span className="text-muted-foreground">وحدة متاحة</span>
        </div>
        <MapLegend />
      </div>

      {/* Compact map — constrained height */}
      <MallFloorMap
        floor={floor}
        selectedUnitId={activeUnit.id}
        mutedUnitIds={mutedUnitIds}
        onSelectUnit={setSelectedUnit}
        className="max-h-[220px] min-h-[160px] md:max-h-[260px]"
      />

      {/* Thin info bar — selected unit + CTAs */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2"
        style={{ background: "hsl(var(--card))" }}
      >
        {/* Selected unit chip */}
        <div className="flex items-center gap-2 text-[0.68rem]">
          <span
            className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-bold"
            style={{
              borderColor: statusDot[activeUnit.status] + "40",
              background: statusDot[activeUnit.status] + "14",
              color: statusDot[activeUnit.status],
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusDot[activeUnit.status] }} />
            {activeUnit.code}
          </span>
          <span className="text-muted-foreground">
            {activeUnit.area} م² · {statusLabelsAr[activeUnit.status]}
          </span>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-1.5">
          <Link to="/map">
            <Button variant="cta" className="h-7 rounded-md px-3 text-[0.66rem] font-bold">
              <Compass className="ml-1 h-3 w-3" />
              افتح الدليل
            </Button>
          </Link>
          {activeUnit.status === "available" && (
            <Link to="/leasing">
              <Button variant="outline-blue" className="h-7 rounded-md px-3 text-[0.66rem]">
                <Phone className="ml-1 h-3 w-3" />
                استفسر
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
