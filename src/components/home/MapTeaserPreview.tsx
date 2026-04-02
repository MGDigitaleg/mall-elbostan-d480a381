import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin, Phone, Ruler, Tag } from "lucide-react";
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
  occupied: { bg: "#EDEBEA", border: "#C8C4BF", text: "#4A4540", dot: "#9B9488" },
  available: { bg: "#FDE4C4", border: "#E8740E40", text: "#B85C08", dot: "#E8740E" },
  coming_soon: { bg: "#C8E8F4", border: "#0A9AB840", text: "#0A7A96", dot: "#0A9AB8" },
};

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
  const floorOccupied = floor.units.filter((u) => u.status === "occupied").length;

  return (
    <div className="overflow-hidden rounded-xl" style={{ border: "1px solid #D8DEE8", boxShadow: "var(--shadow-card)" }}>
      {/* Control bar — matches real map page exactly */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3.5 py-2" style={{ background: "#FAFAF8", borderColor: "#D8DEE8" }}>
        <FloorTabs selected={selectedFloor} onChange={setSelectedFloor} />
        <div className="flex items-center gap-3">
          <MapLegend />
          <div className="hidden items-center gap-1.5 text-[0.68rem] md:flex" style={{ borderRight: "1px solid #D8DEE8", paddingRight: "8px" }}>
            <span className="font-bold" style={{ color: "#0F172A" }}>{floor.units.length}</span>
            <span style={{ color: "#64748B" }}>وحدة</span>
            <span className="mx-0.5 h-3 w-px" style={{ background: "#D8DEE8" }} />
            <span className="font-bold" style={{ color: "#E8740E" }}>{floorAvailable}</span>
            <span style={{ color: "#64748B" }}>متاحة</span>
            <span className="mx-0.5 h-3 w-px" style={{ background: "#D8DEE8" }} />
            <span className="font-bold" style={{ color: "#0F172A" }}>{floorOccupied}</span>
            <span style={{ color: "#64748B" }}>مشغولة</span>
          </div>
        </div>
      </div>

      {/* Map + details — same grid as /map page */}
      <div className="grid lg:grid-cols-[1fr_300px]" style={{ background: "#F5F2EC" }}>
        <div className="p-2">
          <MallFloorMap
            floor={floor}
            selectedUnitId={activeUnit.id}
            mutedUnitIds={mutedUnitIds}
            onSelectUnit={setSelectedUnit}
            className="min-h-[280px] md:min-h-[360px]"
          />
        </div>

        {/* Details panel — pixel-matched to UnitDetailsCard */}
        <div className="border-t p-2 lg:border-t-0 lg:border-r" style={{ borderColor: "#D8DEE8", background: "#FAFAF8" }}>
          <div
            className="rounded-xl border transition-all"
            style={{
              borderColor: badge.dot + "50",
              background: "#FFFFFF",
              boxShadow: `0 0 0 1px ${badge.dot}20, 0 4px 16px hsl(0 0% 0% / 0.05)`,
            }}
          >
            <div className="flex items-center gap-2 border-b px-3.5 py-1.5" style={{ borderColor: badge.dot + "20" }}>
              <div className="h-[3px] w-3 rounded-full" style={{ background: badge.dot }} />
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em]" style={{ color: "#64748B" }}>تفاصيل الوحدة</span>
            </div>

            <div className="space-y-2.5 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[1.15rem] font-extrabold" style={{ color: "#0F172A" }}>{activeUnit.code}</p>
                  <p className="mt-0.5 text-[0.66rem] font-medium" style={{ color: "#64748B" }}>{floorLabelsAr[activeUnit.floor]}</p>
                </div>
                <span
                  className="flex items-center gap-1 shrink-0 rounded-md px-1.5 py-0.5 text-[0.62rem] font-bold"
                  style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: badge.dot }} />
                  {statusLabelsAr[activeUnit.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1">
                {[
                  { icon: Ruler, label: "المساحة", value: `${activeUnit.area} م²` },
                  { icon: Building2, label: "الدور", value: floorLabelsAr[activeUnit.floor] },
                  { icon: Tag, label: "الفئة", value: categoryLabelsAr[activeUnit.category] },
                  { icon: MapPin, label: "الموقع", value: activeUnit.code },
                ].map((item) => (
                  <div key={item.label} className="rounded-md p-1.5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <div className="flex items-center gap-1">
                      <item.icon className="h-2.5 w-2.5" style={{ color: "#64748B" }} />
                      <span className="text-[0.56rem] font-semibold" style={{ color: "#94A3B8" }}>{item.label}</span>
                    </div>
                    <p className="mt-0.5 text-[0.74rem] font-bold" style={{ color: "#0F172A" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-0.5">
                <Link to="/map" className="block">
                  <Button variant="cta" className="h-8 w-full rounded-lg text-[0.76rem] font-bold">افتح الدليل الكامل</Button>
                </Link>
                {activeUnit.status === "available" && (
                  <Link to="/leasing" className="block">
                    <Button variant="outline-blue" className="h-8 w-full rounded-lg text-[0.74rem]">
                      <Phone className="ml-1 h-3 w-3" /> استفسر عن الوحدة
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
