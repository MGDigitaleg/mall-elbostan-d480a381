import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MallFloorMap } from "@/components/map/MallFloorMap";
import {
  mallFloors,
  floorLabelsAr,
  statusLabelsAr,
  type MallUnit,
} from "@/lib/mallFloorGeometry";

/**
 * Homepage map teaser — strict 2-column layout.
 * Right: contained map preview. Left: all supporting content.
 */
export function MapTeaserPreview() {
  const floor = mallFloors[0];
  const defaultUnit = useMemo(
    () => floor.units.find((u) => u.status === "available") ?? floor.units[0],
    [floor.units],
  );
  const [selectedUnit, setSelectedUnit] = useState<MallUnit | null>(defaultUnit);
  const activeUnit = selectedUnit ?? defaultUnit;

  const mutedUnitIds = useMemo(
    () => new Set(floor.units.filter((u) => u.id !== activeUnit.id).map((u) => u.id)),
    [activeUnit.id, floor.units],
  );

  const availableCount = useMemo(
    () => floor.units.filter((u) => u.status === "available").length,
    [floor.units],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr]">
        {/* ── RIGHT (RTL): Map preview ── */}
        <div className="relative border-b border-border bg-muted/30 md:border-b-0 md:border-l">
          <MallFloorMap
            floor={floor}
            selectedUnitId={activeUnit.id}
            mutedUnitIds={mutedUnitIds}
            onSelectUnit={setSelectedUnit}
            className="aspect-square max-h-[220px] min-h-[180px] md:max-h-[280px] md:min-h-[260px]"
          />
        </div>

        {/* ── LEFT (RTL): Supporting content ── */}
        <div className="flex flex-col justify-between gap-4 px-4 py-4 md:px-5 md:py-5">
          {/* Header */}
          <div className="space-y-1.5">
            <p className="section-kicker">الدليل التفاعلي</p>
            <h2 className="text-[1rem] font-bold leading-snug text-foreground md:text-[1.1rem]">
              اكتشف المول قبل زيارتك.
            </h2>
            <p className="max-w-[22rem] text-[0.78rem] leading-relaxed text-muted-foreground">
              تصفّح الخريطة التفاعلية واعرف حالة كل وحدة مباشرة.
            </p>
          </div>

          {/* Featured unit card */}
          <div className="rounded-lg border border-border bg-background px-3 py-2.5">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[0.65rem] font-bold text-foreground">
                {activeUnit.code}
              </span>
              <span className="text-[0.65rem] text-muted-foreground">
                {floorLabelsAr[activeUnit.floor]} · {activeUnit.area} م²
              </span>
            </div>
            <p className="text-[0.7rem] font-medium" style={{ color: activeUnit.status === "available" ? "#E8740E" : "#4A4540" }}>
              {statusLabelsAr[activeUnit.status]}
            </p>
          </div>

          {/* Value points */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[0.68rem] text-muted-foreground">
            {[
              { icon: MapPin, label: `${floor.units.length} وحدة` },
              { icon: Store, label: `${availableCount} متاحة` },
              { icon: Compass, label: "٣ أدوار" },
            ].map((p) => (
              <span key={p.label} className="flex items-center gap-1">
                <p.icon className="h-3 w-3 shrink-0" />
                {p.label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Link to="/map">
              <Button variant="cta" className="h-8 rounded-md px-4 text-[0.72rem] font-bold">
                افتح الدليل الكامل
              </Button>
            </Link>
            <Link to="/leasing">
              <Button variant="outline-blue" className="h-8 rounded-md px-4 text-[0.72rem]">
                استفسر عن وحدة
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
