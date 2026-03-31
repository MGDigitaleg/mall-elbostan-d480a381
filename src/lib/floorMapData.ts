export type UnitStatus = "occupied" | "available" | "coming_soon";

export type LabelMode = "logo" | "text" | "number";

export type NeedCategory =
  | "Laptops"
  | "Maintenance"
  | "Networking"
  | "Accessories"
  | "Components"
  | "Security Systems";

export type FloorId = "ground" | "first" | "second";

export type MapUnitDefinition = {
  floor_id: FloorId;
  unit_id: string;
  area_m2: number;
  polygon: string;
  status: UnitStatus;
  category: NeedCategory;
  store_name_ar: string;
  store_name_en: string;
  description_ar: string;
  description_en: string;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  logo: string | null;
  cover_image: string | null;
  is_featured: boolean;
  sort_order: number;
  x: number;
  y: number;
  label_mode: LabelMode;
  visibility: boolean;
};

export type FloorMapDefinition = {
  id: FloorId;
  label: string;
  units: MapUnitDefinition[];
};

const baseUnitPolygons = [
  { key: "01", points: "560,880 670,880 670,980 560,980", x: 615, y: 930 },
  { key: "02", points: "670,880 830,880 900,950 670,980", x: 760, y: 930 },
  { key: "03", points: "830,740 940,780 900,950 790,840", x: 865, y: 850 },
  { key: "04", points: "900,580 1020,580 1020,760 940,780", x: 975, y: 670 },
  { key: "05", points: "900,500 1020,500 1020,580 900,580", x: 960, y: 540 },
  { key: "06", points: "900,410 1020,410 1020,500 900,500", x: 960, y: 455 },
  { key: "07", points: "860,260 1020,260 1020,410 900,410", x: 950, y: 335 },
  { key: "08", points: "760,220 860,160 940,260 860,340", x: 860, y: 250 },
  { key: "09", points: "650,120 880,120 860,260 760,220", x: 770, y: 175 },
  { key: "10", points: "520,120 650,120 640,220 520,220", x: 585, y: 170 },
  { key: "11", points: "400,120 520,120 520,220 400,220", x: 460, y: 170 },
  { key: "12", points: "200,260 360,200 420,300 300,400", x: 315, y: 320 },
  { key: "13", points: "120,420 300,420 300,520 120,520", x: 210, y: 470 },
  { key: "14", points: "120,520 300,520 300,620 120,620", x: 210, y: 570 },
  { key: "15", points: "120,620 280,620 220,820 120,820", x: 195, y: 725 },
  { key: "16", points: "220,780 320,720 400,820 300,900", x: 320, y: 820 },
  { key: "17", points: "300,900 560,900 560,980 360,980", x: 450, y: 940 },
  { key: "18", points: "460,880 560,880 560,980 460,980", x: 510, y: 930 },
] as const;

const categories: NeedCategory[] = [
  "Laptops",
  "Maintenance",
  "Networking",
  "Accessories",
  "Components",
  "Security Systems",
];

const groundAreas: Record<string, number> = {
  "01": 24.67,
  "02": 41.54,
  "03": 28.42,
  "04": 41.69,
  "05": 19.82,
  "06": 20.03,
  "07": 42.03,
  "08": 28.48,
  "09": 41.68,
  "10": 27.52,
  "11": 27.48,
  "12": 41,
  "13": 27.62,
  "14": 27.62,
  "15": 41.78,
  "16": 28.23,
  "17": 41.49,
};

const upperAreas: Record<string, number> = {
  "01": 31.66,
  "02": 56.18,
  "03": 33.85,
  "04": 45.28,
  "05": 19.82,
  "06": 20.03,
  "07": 42.03,
  "08": 28.48,
  "09": 41.68,
  "10": 27.52,
  "11": 27.48,
  "12": 41,
  "13": 27.62,
  "14": 27.62,
  "15": 45.21,
  "16": 33.85,
  "17": 56.18,
  "18": 38.95,
};

const availableUnits = new Set(["G-04", "G-08", "F-05", "F-11", "S-02", "S-14"]);
const comingSoonUnits = new Set(["G-10", "F-09", "S-07"]);

const buildFloor = (
  floor_id: FloorId,
  prefix: "G" | "F" | "S",
  label: string,
  areas: Record<string, number>,
): FloorMapDefinition => ({
  id: floor_id,
  label,
  units: baseUnitPolygons
    .filter((unit) => areas[unit.key] !== undefined)
    .map((unit, index) => {
      const unit_id = `${prefix}-${unit.key}`;
      const status: UnitStatus = availableUnits.has(unit_id)
        ? "available"
        : comingSoonUnits.has(unit_id)
          ? "coming_soon"
          : "occupied";

      return {
        floor_id,
        unit_id,
        area_m2: areas[unit.key],
        polygon: unit.points,
        status,
        category: categories[index % categories.length],
        store_name_ar: status === "occupied" ? `متجر ${unit_id}` : "وحدة متاحة",
        store_name_en: status === "occupied" ? `Store ${unit_id}` : "Available Unit",
        description_ar: status === "occupied" ? "بيانات المتجر تضاف من لوحة الإدارة." : "وحدة جاهزة للتأجير داخل مول البستان.",
        description_en: status === "occupied" ? "Store details will be managed in admin." : "Leasing-ready unit in Mall Elbostan.",
        phone: null,
        whatsapp: null,
        website: null,
        logo: null,
        cover_image: null,
        is_featured: status === "available",
        sort_order: index + 1,
        x: unit.x,
        y: unit.y,
        label_mode: "number",
        visibility: true,
      };
    }),
});

export const floorMapData: FloorMapDefinition[] = [
  buildFloor("ground", "G", "Ground Floor", groundAreas),
  buildFloor("first", "F", "First Floor", upperAreas),
  buildFloor("second", "S", "Second Floor", upperAreas),
];

export const floorLabelAr: Record<FloorId, string> = {
  ground: "الدور الأرضي",
  first: "الدور الأول",
  second: "الدور الثاني",
};

export const exploreNeeds: NeedCategory[] = categories;
