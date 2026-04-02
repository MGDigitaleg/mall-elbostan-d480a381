import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Compass, MapPin, Phone, Ruler, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MallFloorMap } from "@/components/map/MallFloorMap";
import { FloorTabs } from "@/components/map/FloorTabs";
import { MapLegend } from "@/components/map/MapLegend";
import {
  mallFloors,
  floorLabelsAr,
  categoryLabelsAr,
  statusLabelsAr,
  type MallFloorId,
  type MallUnit,
  type MallUnitStatus,
} from "@/lib/mallFloorGeometry";

const statusBadge: Record<MallUnitStatus, { bg: string; border: string; text: string; dot: string }> = {
  occupied: { bg: "hsl(var(--muted))", border: "hsl(var(--border))", text: "hsl(var(--muted-foreground))", dot: "#9B9488" },
  available: { bg: "#FDE4C4", border: "#E8740E40", text: "#B85C08", dot: "#E8740E" },
  coming_soon: { bg: "#C8E8F4", border: "#0A9AB840", text: "#0A7A96", dot: "#0A9AB8" },
};

/**
 * Homepage map teaser — compact single-section preview.
 * Uses exact same MallFloorMap + FloorTabs as the real /map page.
 */
export function MapTeaserPreview() {
  const [selectedFloor, setSelectedFloor] = useState<MallFloorId>("ground");

  const floor = useMemo(
    () => mallFloors.find((f) => f.id === selectedFloor) ?? mallFloors[0],
    [selectedFloor],
  );

  const defaultUnit = useMemo(
    () => floor.units.find((u) => u.status === "available") ?? floor.units[0],
    [floor.units],
  );

  const [selectedUnit, setSelectedUnit] = useState<MallUnit | null>(defaultUnit);

  useEffect(() => {
    setSelectedUnit(defaultUnit);
  }, [defaultUnit]);

  const activeUnit = selectedUnit && selectedUnit.floor === selectedFloor ? selectedUnit : defaultUnit;
  const mutedUnitIds = useMemo(() => new Set<string>(), []);
  const badge = statusBadge[activeUnit.status];

  const floorAvailable = floor.units.filter((u) => u.status === "available").length;

  return (
    <div className="grid items-start gap-3 lg:grid-cols-[1fr_260px]">
      {/* ── Compact map ── */}
      <div className="overflow-hidden rounded-xl border border-border" style={{ background: "#F0EBE3" }}>
        {/* Control bar — mirrors /map page */}
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5" style={{ background: "hsl(var(--card))" }}>
          <FloorTabs selected={selectedFloor} onChange={(id) => { setSelectedFloor(id); setSelectedUnit(null); }} />
          <div className="hidden items-center gap-1.5 text-[0.64rem] sm:flex">
            <span className="font-bold" style={{ color: "#E8740E" }}>{floorAvailable}</span>
            <span className="text-muted-foreground">متاحة</span>
            <span className="mx-0.5 h-3 w-px bg-border" />
            <span className="font-bold text-foreground">{floor.units.length}</span>
            <span className="text-muted-foreground">وحدة</span>
          </div>
        </div>

        {/* Legend strip */}
        <div className="flex items-center justify-between border-b border-border px-3 py-1" style={{ background: "#F5F2EC" }}>
          <MapLegend />
        </div>

        <MallFloorMap
          floor={floor}
          selectedUnitId={activeUnit.id}
          mutedUnitIds={mutedUnitIds}
          onSelectUnit={setSelectedUnit}
          className="max-h-[320px] min-h-[200px] md:max-h-[360px] md:min-h-[240px]"
        />
      </div>

      {/* ── Side panel — mirrors UnitDetailsCard visual language ── */}
      <div className="space-y-2.5">
        <div
          className="rounded-xl border bg-card transition-all"
          style={{
            borderColor: badge.dot + "50",
            boxShadow: `0 0 0 1px ${badge.dot}20, 0 4px 16px hsl(0 0% 0% / 0.05)`,
          }}
        >
          {/* Panel header — same as UnitDetailsCard */}
          <div className="flex items-center gap-2 border-b px-3 py-1.5" style={{ borderColor: badge.dot + "20" }}>
            <div className="h-[3px] w-3 rounded-full" style={{ background: badge.dot }} />
            <span className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">تفاصيل الوحدة</span>
          </div>

          <div className="space-y-2 p-3">
            {/* Code + status */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[1rem] font-extrabold text-foreground">{activeUnit.code}</p>
                <p className="mt-0.5 text-[0.62rem] font-medium text-muted-foreground">{floorLabelsAr[activeUnit.floor]}</p>
              </div>
              <span
                className="flex items-center gap-1 shrink-0 rounded-md px-1.5 py-0.5 text-[0.58rem] font-bold"
                style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: badge.dot }} />
                {statusLabelsAr[activeUnit.status]}
              </span>
            </div>

            {/* Meta grid — same 2x2 as UnitDetailsCard */}
            <div className="grid grid-cols-2 gap-1">
              {[
                { icon: Ruler, label: "المساحة", value: `${activeUnit.area} م²` },
                { icon: Building2, label: "الدور", value: floorLabelsAr[activeUnit.floor] },
                { icon: Tag, label: "الفئة", value: categoryLabelsAr[activeUnit.category] },
                { icon: MapPin, label: "الموقع", value: activeUnit.code },
              ].map((item) => (
                <div key={item.label} className="rounded-md border border-border bg-secondary/50 p-1.5">
                  <div className="flex items-center gap-1">
                    <item.icon className="h-2.5 w-2.5 text-muted-foreground" />
                    <span className="text-[0.52rem] font-semibold text-muted-foreground">{item.label}</span>
                  </div>
                  <p className="mt-0.5 text-[0.7rem] font-bold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="space-y-1 pt-0.5">
              <Link to="/map" className="block">
                <Button variant="cta" className="h-8 w-full rounded-lg text-[0.72rem] font-bold">
                  <Compass className="ml-1 h-3 w-3" />
                  افتح الدليل الكامل
                </Button>
              </Link>
              {activeUnit.status === "available" && (
                <Link to="/leasing" className="block">
                  <Button variant="outline-blue" className="h-8 w-full rounded-lg text-[0.7rem]">
                    <Phone className="ml-1 h-3 w-3" /> استفسر عن الوحدة
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Floor availability stats — mirrors /map available units strip */}
        <div className="grid grid-cols-3 gap-1.5">
          {mallFloors.map((f) => {
            const avail = f.units.filter((u) => u.status === "available").length;
            return (
              <div key={f.id} className="rounded-lg border border-border bg-card px-2 py-1.5 text-center">
                <p className="font-poppins text-[0.82rem] font-extrabold text-foreground">{avail}</p>
                <p className="text-[0.52rem] font-semibold text-muted-foreground">{f.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
