import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin, Ruler, Tag } from "lucide-react";
import { MallFloorMap } from "@/components/map/MallFloorMap";
import { FloorTabs } from "@/components/map/FloorTabs";
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

/**
 * A rich hero map preview that reuses the exact same rendering system,
 * color palette, floor tabs, and unit detail format as the real /map page.
 * This is the hero's primary visual element — not a thumbnail.
 */
export function HeroMiniMap() {
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
  const emptySet = useMemo(() => new Set<string>(), []);
  const badge = statusBadge[activeUnit.status];
  const availCount = floor.units.filter((u) => u.status === "available").length;

  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{ border: "1px solid #1E293B", background: "#0C1424" }}
    >
      {/* ── Control bar — same visual language as /map ── */}
      <div
        className="flex items-center justify-between gap-2 px-3 py-1.5"
        style={{ borderBottom: "1px solid #1E293B", background: "#0F1A2E" }}
      >
        <FloorTabs selected={selectedFloor} onChange={setSelectedFloor} />
        <div className="flex items-center gap-2 text-[0.56rem]">
          <span className="font-bold" style={{ color: "#E8740E" }}>{availCount}</span>
          <span style={{ color: "#64748B" }}>متاحة</span>
          <span className="h-2.5 w-px" style={{ background: "#1E293B" }} />
          <span className="font-bold" style={{ color: "#94A3B8" }}>{floor.units.length}</span>
          <span style={{ color: "#64748B" }}>وحدة</span>
        </div>
      </div>

      {/* ── Map + mini detail panel ── */}
      <div className="grid lg:grid-cols-[1fr_200px]">
        {/* Map canvas */}
        <div className="p-2">
          <MallFloorMap
            floor={floor}
            selectedUnitId={activeUnit.id}
            mutedUnitIds={emptySet}
            onSelectUnit={setSelectedUnit}
            className="min-h-[200px] md:min-h-[240px]"
          />
        </div>

        {/* Mini unit details — mirrors the real side panel */}
        <div
          className="hidden border-r p-2 lg:block"
          style={{ borderColor: "#1E293B", background: "#0F1A2E" }}
        >
          <div
            className="rounded-lg border"
            style={{
              borderColor: badge.dot + "40",
              background: "#141E30",
              boxShadow: `0 0 0 1px ${badge.dot}15`,
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-1.5 border-b px-2.5 py-1" style={{ borderColor: badge.dot + "20" }}>
              <div className="h-[2px] w-2 rounded-full" style={{ background: badge.dot }} />
              <span className="text-[0.5rem] font-bold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
                تفاصيل الوحدة
              </span>
            </div>

            <div className="space-y-2 p-2.5">
              {/* Code + status */}
              <div className="flex items-start justify-between gap-1">
                <div>
                  <p className="text-[0.95rem] font-extrabold" style={{ color: "#F8FAFC" }}>{activeUnit.code}</p>
                  <p className="text-[0.52rem] font-medium" style={{ color: "#64748B" }}>{floorLabelsAr[activeUnit.floor]}</p>
                </div>
                <span
                  className="flex items-center gap-0.5 shrink-0 rounded px-1 py-0.5 text-[0.5rem] font-bold"
                  style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text }}
                >
                  <span className="h-1 w-1 rounded-full" style={{ background: badge.dot }} />
                  {statusLabelsAr[activeUnit.status]}
                </span>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-1">
                {[
                  { icon: Ruler, label: "المساحة", value: `${activeUnit.area} م²` },
                  { icon: Building2, label: "الدور", value: floorLabelsAr[activeUnit.floor] },
                  { icon: Tag, label: "الفئة", value: categoryLabelsAr[activeUnit.category] },
                  { icon: MapPin, label: "الموقع", value: activeUnit.code },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded p-1"
                    style={{ background: "#0C1424", border: "1px solid #1E293B" }}
                  >
                    <div className="flex items-center gap-0.5">
                      <item.icon className="h-2 w-2" style={{ color: "#64748B" }} />
                      <span className="text-[0.44rem] font-semibold" style={{ color: "#475569" }}>{item.label}</span>
                    </div>
                    <p className="mt-0.5 text-[0.58rem] font-bold" style={{ color: "#E2E8F0" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link to="/map" className="block">
                <div
                  className="flex items-center justify-center gap-1 rounded-md py-1.5 text-[0.6rem] font-bold transition-colors hover:opacity-90"
                  style={{ background: "#2563EB", color: "#FFFFFF" }}
                >
                  افتح الدليل الكامل
                  <span className="text-[0.55rem]">←</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
