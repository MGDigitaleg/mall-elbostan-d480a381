import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FloorPlanSvg } from "@/components/map/FloorPlanSvg";
import { floorLabelAr, floorMapData, needCategoryLabels, type FloorId, type MapUnitDefinition } from "@/lib/floorMapData";

export function MapTeaserPreview() {
  const [selectedFloor, setSelectedFloor] = useState<FloorId>("ground");

  const floor = useMemo(
    () => floorMapData.find((item) => item.id === selectedFloor) ?? floorMapData[0],
    [selectedFloor],
  );

  const defaultUnit = useMemo(
    () => floor.units.find((unit) => unit.status === "available") ?? floor.units[0],
    [floor.units],
  );

  const [selectedUnit, setSelectedUnit] = useState<MapUnitDefinition | null>(defaultUnit);

  useEffect(() => {
    setSelectedUnit(defaultUnit);
  }, [defaultUnit]);

  const activeUnit = selectedUnit && selectedUnit.floor_id === selectedFloor ? selectedUnit : defaultUnit;

  const visibleUnitIds = useMemo(
    () =>
      new Set([
        activeUnit.unit_id,
        ...floor.units
          .filter((unit) => unit.status === "available")
          .slice(0, 4)
          .map((unit) => unit.unit_id),
      ]),
    [activeUnit.unit_id, floor.units],
  );

  const mutedUnitIds = useMemo(
    () => new Set(floor.units.filter((unit) => !visibleUnitIds.has(unit.unit_id)).map((unit) => unit.unit_id)),
    [floor.units, visibleUnitIds],
  );

  return (
    <div className="rounded-[1.85rem] md:brand-shell md:p-4">
      <div className="grid gap-2.5 xl:grid-cols-[1.38fr_0.62fr] xl:items-start">
        <div className="order-1 space-y-2.5">
          <div className="grid grid-cols-3 gap-1.5">
            {floorMapData.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedFloor(item.id)}
                className={`inline-flex h-10 items-center justify-center rounded-[1rem] px-2 text-sm font-semibold transition-colors ${
                  selectedFloor === item.id
                    ? "bg-secondary text-foreground"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <FloorPlanSvg
            className="min-h-[29rem] rounded-[1.45rem] border border-border/80 p-2 md:min-h-[24.5rem] md:p-4 lg:min-h-[28rem] lg:p-4"
            floorId={selectedFloor}
            units={floor.units}
            selectedUnitId={activeUnit.unit_id}
            mutedUnitIds={mutedUnitIds}
            onSelectUnit={setSelectedUnit}
          />
        </div>

        <div className="order-2 space-y-2.5 xl:order-none">
          <div className="editorial-panel rounded-[1.25rem] p-4 md:rounded-[1.45rem] md:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-muted-foreground">معاينة مباشرة من الدليل</p>
              <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[0.68rem] font-semibold text-muted-foreground">منتج حي</span>
            </div>
            <h3 className="mt-1 text-[1.45rem] font-bold text-foreground md:mt-1.5 md:text-2xl">وحدة {activeUnit.unit_id}</h3>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">اختر الدور ثم راجع بيانات الوحدة من نفس المعاينة.</p>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 xl:grid-cols-1">
              <div className="flex items-center justify-between rounded-[1rem] border border-border bg-card px-4 py-3">
                <span className="text-muted-foreground">الدور</span>
                <span className="font-semibold text-foreground">{floorLabelAr[activeUnit.floor_id]}</span>
              </div>
              <div className="flex items-center justify-between rounded-[1rem] border border-border bg-card px-4 py-3">
                <span className="text-muted-foreground">المساحة</span>
                <span className="font-semibold text-foreground">{activeUnit.area_m2} م²</span>
              </div>
              <div className="flex items-center justify-between rounded-[1rem] border border-border bg-card px-4 py-3">
                <span className="text-muted-foreground">الفئة</span>
                <span className="font-semibold text-foreground">{needCategoryLabels[activeUnit.category]}</span>
              </div>
              <div className="flex items-center justify-between rounded-[1rem] border border-border bg-card px-4 py-3">
                <span className="text-muted-foreground">الحالة</span>
                <span className={`font-semibold ${activeUnit.status === "available" ? "text-orange" : activeUnit.status === "coming_soon" ? "text-accent" : "text-foreground"}`}>
                  {activeUnit.status === "available" ? "متاحة" : activeUnit.status === "coming_soon" ? "قريبًا" : "مشغولة"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 xl:grid-cols-1">
            <div className="rounded-[1rem] border border-orange/35 bg-card px-4 py-3 text-sm font-semibold text-orange">متاح الآن</div>
            <div className="rounded-[1rem] border border-accent/35 bg-card px-4 py-3 text-sm font-semibold text-accent">قريبًا</div>
            <div className="rounded-[1rem] border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground">مشغول</div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <Link to="/map"><Button variant="outline-blue" className="h-11 w-full rounded-[1rem] px-5">افتح الدليل</Button></Link>
            <Link to="/leasing"><Button variant="orange" className="h-11 w-full rounded-[1rem] px-5">استفسر عن الوحدة</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}