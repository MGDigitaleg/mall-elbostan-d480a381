import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass, Layers, MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MallFloorMap } from "@/components/map/MallFloorMap";
import {
  mallFloors,
  floorLabelsAr,
  statusLabelsAr,
  type MallUnit,
} from "@/lib/mallFloorGeometry";

/**
 * Homepage map teaser — premium 2-column layout with enhanced visual hierarchy.
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

  const totalUnits = useMemo(
    () => mallFloors.reduce((sum, f) => sum + f.units.length, 0),
    [],
  );
  const availableCount = useMemo(
    () => mallFloors.reduce((sum, f) => sum + f.units.filter((u) => u.status === "available").length, 0),
    [],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card dark:bg-secondary shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
      {/* ── Section header bar ── */}
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-3 md:px-6"
        style={{ background: "linear-gradient(135deg, hsl(var(--navy) / 0.03) 0%, transparent 100%)" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.15)" }}>
            <Compass className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-[0.88rem] font-bold text-foreground">الدليل التفاعلي</h2>
            <p className="text-[0.64rem] text-muted-foreground">اكتشف المول قبل زيارتك</p>
          </div>
        </div>
        <Link to="/map" className="hidden sm:inline-flex">
          <Button variant="ghost" size="sm" className="gap-1 text-[0.72rem] font-bold text-primary hover:text-primary/80">
            الدليل الكامل <ArrowLeft className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr]">
        {/* ── RIGHT (RTL): Map preview ── */}
        <div className="relative border-b border-border/50 md:border-b-0 md:border-l overflow-hidden flex items-center justify-center p-3 md:p-4 bg-muted/30 dark:bg-background/50">
          {/* Floor indicator badge */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full border border-border/60 bg-card/90 px-2.5 py-1 shadow-sm backdrop-blur-sm">
            <Layers className="h-3 w-3 text-primary/70" />
            <span className="font-poppins text-[0.6rem] font-bold text-foreground/80">{floorLabelsAr[floor.id]}</span>
          </div>

          <MallFloorMap
            floor={floor}
            selectedUnitId={activeUnit.id}
            mutedUnitIds={mutedUnitIds}
            onSelectUnit={setSelectedUnit}
            className="w-full max-w-full"
            hideControls
          />
        </div>

        {/* ── LEFT (RTL): Supporting content ── */}
        <div className="flex flex-col justify-between gap-4 px-5 py-5 md:px-6 md:py-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: MapPin, value: `${totalUnits}`, label: "وحدة", color: "hsl(var(--primary))" },
              { icon: Store, value: `${availableCount}`, label: "متاحة", color: "#E8740E" },
              { icon: Layers, value: "٣", label: "أدوار", color: "hsl(var(--accent-cyan, 6 182 212))" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border/50 bg-background px-2.5 py-2 text-center">
                <s.icon className="mx-auto mb-1 h-3.5 w-3.5" style={{ color: s.color }} />
                <p className="font-poppins text-[0.92rem] font-bold text-foreground leading-none">{s.value}</p>
                <p className="mt-0.5 text-[0.6rem] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Featured unit card */}
          <div className={`rounded-lg border p-3 ${activeUnit.status === "available" ? "border-orange/30 bg-orange/5" : "border-border bg-background"}`}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-border bg-muted px-2 py-0.5 font-poppins text-[0.68rem] font-bold text-foreground">
                  {activeUnit.code}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[0.6rem] font-bold"
                  style={{
                    color: activeUnit.status === "available" ? "#E8740E" : "#4A4540",
                    background: activeUnit.status === "available" ? "#E8740E12" : "#4A454010",
                  }}
                >
                  {statusLabelsAr[activeUnit.status]}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[0.68rem] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Layers className="h-3 w-3" />
                {floorLabelsAr[activeUnit.floor]}
              </span>
              <span>{activeUnit.area} م²</span>
              {activeUnit.category && (
                <span className="rounded-full bg-primary/5 px-2 py-0.5 text-[0.6rem] text-primary/80">
                  {activeUnit.category}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-[0.76rem] leading-relaxed text-muted-foreground">
            تصفّح الخريطة التفاعلية واعرف حالة كل وحدة بالتفصيل — مساحتها، موقعها، وحالة التأجير.
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-[0.62rem]">
            {[
              { color: "#E8740E", label: "متاحة" },
              { color: "#4A4540", label: "مؤجّرة" },
              { color: "#93C5FD", label: "قريباً" },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                <span className="text-muted-foreground">{item.label}</span>
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2.5">
            <Link to="/map" className="flex-1">
              <Button variant="cta" className="h-9 w-full rounded-lg px-5 text-[0.76rem] font-bold">
                <Compass className="ml-1.5 h-3.5 w-3.5" />
                افتح الدليل الكامل
              </Button>
            </Link>
            <Link to="/leasing">
              <Button variant="outline-blue" className="h-9 rounded-lg px-4 text-[0.76rem]">
                استفسر
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
