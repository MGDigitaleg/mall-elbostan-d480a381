import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  mallFloors as staticMallFloors,
  type MallFloor,
  type MallFloorId,
  type MallUnit,
  type MallUnitStatus,
  type MallCategory,
} from "@/lib/mallFloorGeometry";

const FLOOR_LABELS: Record<MallFloorId, string> = {
  ground: "الدور الأرضي",
  first: "الدور الأول",
  second: "الدور الثاني",
};

const SORT_TO_FLOOR: Record<number, MallFloorId> = {
  0: "ground",
  1: "first",
  2: "second",
};

const VALID_STATUS = new Set<MallUnitStatus>(["available", "occupied", "coming_soon"]);
const VALID_CATEGORY = new Set<MallCategory>([
  "Accessories",
  "Laptops",
  "Components",
  "Networking",
  "Maintenance",
  "Security Systems",
]);

type FloorRow = {
  id: string;
  name_ar: string | null;
  sort_order: number | null;
};

type UnitRow = {
  id: string;
  floor_id: string;
  unit_code: string;
  status: string | null;
  area_sqm: number | null;
  polygon: string | null;
  label_x: number | null;
  label_y: number | null;
  category: string | null;
  name_ar: string | null;
  description_ar: string | null;
  visibility: boolean | null;
  is_featured: boolean | null;
  sort_order: number | null;
};

function buildFloorsFromDb(floors: FloorRow[], units: UnitRow[]): MallFloor[] {
  const ordered = [...floors].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return ordered
    .map((f) => {
      const floorId = SORT_TO_FLOOR[f.sort_order ?? 0];
      if (!floorId) return null;

      const floorUnits: MallUnit[] = units
        .filter((u) => u.floor_id === f.id && u.visibility !== false && u.polygon)
        .filter((u) => VALID_STATUS.has((u.status ?? "") as MallUnitStatus))
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((u) => {
          const status = u.status as MallUnitStatus;
          const category: MallCategory = VALID_CATEGORY.has((u.category ?? "") as MallCategory)
            ? (u.category as MallCategory)
            : "Accessories";
          return {
            id: u.unit_code,
            code: u.unit_code,
            floor: floorId,
            name: u.name_ar ?? `وحدة ${u.unit_code}`,
            area: u.area_sqm ?? 0,
            status,
            category,
            polygon: u.polygon ?? "",
            labelX: u.label_x ?? 0,
            labelY: u.label_y ?? 0,
            description: u.description_ar ?? "",
          } satisfies MallUnit;
        });

      return {
        id: floorId,
        label: f.name_ar ?? FLOOR_LABELS[floorId],
        units: floorUnits,
      } satisfies MallFloor;
    })
    .filter((f): f is MallFloor => f !== null && f.units.length > 0);
}

async function fetchMapData(): Promise<MallFloor[]> {
  const [floorsRes, unitsRes] = await Promise.all([
    supabase.from("floors").select("id, name_ar, sort_order"),
    supabase
      .from("units")
      .select(
        "id, floor_id, unit_code, status, area_sqm, polygon, label_x, label_y, category, name_ar, description_ar, visibility, is_featured, sort_order",
      ),
  ]);

  if (floorsRes.error) throw floorsRes.error;
  if (unitsRes.error) throw unitsRes.error;

  const built = buildFloorsFromDb(
    (floorsRes.data ?? []) as FloorRow[],
    (unitsRes.data ?? []) as UnitRow[],
  );

  // Zero-regression fallback: if the DB has no usable geometry yet, keep the
  // hardcoded floor plan so the public map is never empty.
  return built.length > 0 ? built : staticMallFloors;
}

/**
 * Loads the interactive map floors/units from the database, falling back to the
 * hardcoded geometry while data loads or if the DB is empty.
 */
export function useMapData() {
  const query = useQuery({
    queryKey: ["map-data"],
    queryFn: fetchMapData,
    staleTime: 5 * 60 * 1000,
  });

  const floors = query.data ?? staticMallFloors;
  const allUnits = floors.flatMap((f) => f.units);
  const availableUnits = allUnits.filter((u) => u.status === "available");

  return {
    floors,
    allUnits,
    availableUnits,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
