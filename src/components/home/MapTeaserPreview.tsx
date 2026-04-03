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
 * Right: larger contained map preview. Left: minimal supporting content.
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
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr]">
        {/* ── RIGHT (RTL): Map preview — main visual ── */}
        <div className="relative border-b border-border bg-muted/30 md:border-b-0 md:border-l overflow-hidden">
          <MallFloorMap
            floor={floor}
            selectedUnitId={activeUnit.id}
            mutedUnitIds={mutedUnitIds}
            onSelectUnit={setSelectedUnit}
            className="aspect-[4/3] min-h-[260px] md:min-h-[360px]"
            hideControls
          />
        </div>

        {/* ── LEFT (RTL): Supporting content ── */}
        <div className="flex flex-col justify-between gap-4 px-5 py-5 md:px-6 md:py-6">
          {/* Header */}
          <div className="space-y-1.5">
            <p className="section-kicker">الدليل التفاعلي</p>
            <h2 className="text-[1.05rem] font-bold leading-snug text-foreground md:text-[1.15rem]">
              اكتشف المول قبل زيارتك.
            </h2>
            <p className="max-w-[20rem] text-[0.8rem] leading-relaxed text-muted-foreground">
              تصفّح الخريطة التفاعلية واعرف حالة كل وحدة مباشرة.
            </p>
          </div>

          {/* Featured unit card */}
          <div className="rounded-lg border border-border bg-background px-3.5 py-3">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[0.7rem] font-bold text-foreground">
                {activeUnit.code}
              </span>
              <span
                className="text-[0.68rem] font-medium"
                style={{ color: activeUnit.status === "available" ? "#E8740E" : "#4A4540" }}
              >
                {statusLabelsAr[activeUnit.status]}
              </span>
            </div>
            <p className="text-[0.72rem] text-muted-foreground">
              {floorLabelsAr[activeUnit.floor]} · {activeUnit.area} م²
              {activeUnit.category ? ` · ${activeUnit.category}` : ""}
            </p>
          </div>

          {/* Value points */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[0.72rem] text-muted-foreground">
            {[
              { icon: MapPin, label: `${floor.units.length} وحدة` },
              { icon: Store, label: `${availableCount} متاحة` },
              { icon: Compass, label: "٣ أدوار" },
            ].map((p) => (
              <span key={p.label} className="flex items-center gap-1.5">
                <p.icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                {p.label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2.5">
            <Link to="/map">
              <Button variant="cta" className="h-9 rounded-md px-5 text-[0.76rem] font-bold">
                افتح الدليل الكامل
              </Button>
            </Link>
            <Link to="/leasing">
              <Button variant="outline-blue" className="h-9 rounded-md px-5 text-[0.76rem]">
                استفسر عن وحدة
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
