export type UnitStatus = "occupied" | "available" | "coming_soon";

export type LabelMode = "logo" | "text" | "number";

export type NeedCategory =
  | "Accessories"
  | "Laptops"
  | "Components"
  | "Networking"
  | "Maintenance"
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
  label_box_width: number;
  label_box_height: number;
  label_mode: LabelMode;
  visibility: boolean;
};

export type TenantImportRow = {
  floor_id: FloorId;
  unit_id: string;
  store_name_ar: string;
  store_name_en: string;
  category: NeedCategory;
  status: UnitStatus;
  area_m2: number;
  logo_filename: string;
  short_description_ar: string;
  short_description_en: string;
  phone: string;
  whatsapp: string;
  website: string;
};

export type FloorMapDefinition = {
  id: FloorId;
  label: string;
  units: MapUnitDefinition[];
};

import { floorPolygonConfigs } from "@/lib/floorPolygonData";


const categories: NeedCategory[] = [
  "Accessories",
  "Laptops",
  "Components",
  "Networking",
  "Maintenance",
  "Security Systems",
];

const groundAreas: Record<string, number> = {
  "01": 24.67,
  "02": 41.54,
  "03": 41.54,
  "04": 45.58,
  "05": 19.82,
  "06": 26.03,
  "07": 42.05,
  "08": 42.46,
  "09": 41.66,
  "10": 27.52,
  "11": 27.48,
  "12": 41.00,
  "13": 27.22,
  "14": 27.62,
  "15": 45.21,
  "16": 33.55,
  "17": 41.49,
  "18": 28.95,
};

const upperAreas: Record<string, number> = {
  "01": 31.65,
  "02": 56.18,
  "03": 33.85,
  "04": 45.28,
  "05": 19.82,
  "06": 20.03,
  "07": 42.03,
  "08": 38.65,
  "09": 41.68,
  "10": 27.52,
  "11": 27.48,
  "12": 41.00,
  "13": 27.62,
  "14": 27.62,
  "15": 45.21,
  "16": 33.85,
  "17": 56.18,
  "18": 38.95,
};

const availableUnits = new Set(["G-04", "G-08", "F-05", "F-11", "S-02", "S-14"]);
const comingSoonUnits = new Set(["G-10", "F-09", "S-07"]);

const tenantImportColumns: Array<keyof TenantImportRow> = [
  "floor_id",
  "unit_id",
  "store_name_ar",
  "store_name_en",
  "category",
  "status",
  "area_m2",
  "logo_filename",
  "short_description_ar",
  "short_description_en",
  "phone",
  "whatsapp",
  "website",
];

const getPolygonBounds = (polygon: string) => {
  const points = polygon
    .split(" ")
    .map((pair) => pair.split(",").map(Number))
    .filter((pair) => pair.length === 2 && Number.isFinite(pair[0]) && Number.isFinite(pair[1])) as Array<[number, number]>;

  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
  };
};

const resolveLabelMode = (row: Pick<TenantImportRow, "logo_filename" | "store_name_ar">, labelBoxWidth: number, labelBoxHeight: number): LabelMode => {
  const hasLogo = row.logo_filename.trim().length > 0;
  const hasText = row.store_name_ar.trim().length > 0;

  if (hasLogo && labelBoxWidth >= 44 && labelBoxHeight >= 22) return "logo";
  if (hasText) return "text";
  return "number";
};

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
        store_name_ar: "",
        store_name_en: "",
        description_ar: status === "occupied" ? "" : "وحدة جاهزة للتأجير داخل مول البستان.",
        description_en: status === "occupied" ? "" : "Leasing-ready unit in Mall Elbostan.",
        phone: null,
        whatsapp: null,
        website: null,
        logo: null,
        cover_image: null,
        is_featured: status === "available",
        sort_order: index + 1,
        x: unit.x,
        y: unit.y,
        label_box_width: Math.max(34, getPolygonBounds(unit.points).width * 0.65 - 16),
        label_box_height: Math.max(18, getPolygonBounds(unit.points).height * 0.35 - 16),
        label_mode: "number",
        visibility: true,
      };
    }),
});

export const applyTenantImportRows = (
  baseFloors: FloorMapDefinition[],
  rows: TenantImportRow[],
  logoBasePath = "/tenant-logos",
): FloorMapDefinition[] => {
  const rowMap = new Map(rows.map((row) => [`${row.floor_id}:${row.unit_id}`, row]));

  return baseFloors.map((floor) => ({
    ...floor,
    units: floor.units.map((unit) => {
      const row = rowMap.get(`${unit.floor_id}:${unit.unit_id}`);
      if (!row) return unit;

      const safeLogo = row.logo_filename.trim();
      const label_mode = resolveLabelMode(row, unit.label_box_width, unit.label_box_height);

      return {
        ...unit,
        store_name_ar: row.store_name_ar.trim(),
        store_name_en: row.store_name_en.trim(),
        category: row.category,
        status: row.status,
        area_m2: row.area_m2,
        description_ar: row.short_description_ar.trim(),
        description_en: row.short_description_en.trim(),
        phone: row.phone.trim() || null,
        whatsapp: row.whatsapp.trim() || null,
        website: row.website.trim() || null,
        logo: safeLogo ? `${logoBasePath}/${safeLogo}` : null,
        label_mode,
      };
    }),
  }));
};

export const floorMapData: FloorMapDefinition[] = [
  buildFloor("ground", "G", "الدور الأرضي", groundAreas),
  buildFloor("first", "F", "الدور الأول", upperAreas),
  buildFloor("second", "S", "الدور الثاني", upperAreas),
];

const floorOrder: Record<FloorId, number> = {
  ground: 0,
  first: 1,
  second: 2,
};

export const allMapUnits = floorMapData.flatMap((floor) => floor.units);

export const availableMapUnits = allMapUnits
  .filter((unit) => unit.status === "available")
  .sort((a, b) => {
    const floorDifference = floorOrder[a.floor_id] - floorOrder[b.floor_id];
    if (floorDifference !== 0) return floorDifference;
    return a.sort_order - b.sort_order;
  });

export const homepageLeasingUnits = availableMapUnits.slice(0, 4);

export const floorLabelAr: Record<FloorId, string> = {
  ground: "الدور الأرضي",
  first: "الدور الأول",
  second: "الدور الثاني",
};

export const needCategoryLabels: Record<NeedCategory, string> = {
  Accessories: "الإكسسوارات والملحقات",
  Laptops: "أجهزة الكمبيوتر",
  Components: "المكوّنات والتجميع",
  Networking: "الشبكات والطباعة",
  Maintenance: "الصيانة والدعم",
  "Security Systems": "الأنظمة الأمنية",
};

export const needCategoryDescriptions: Record<NeedCategory, string> = {
  Accessories: "ملحقات واستخدامات يومية ضمن مسار سريع وواضح.",
  Laptops: "أجهزة موجهة للدراسة والعمل والاحتياج العملي المباشر.",
  Components: "مكوّنات وتجميعات أداء ضمن تصنيف تقني واضح.",
  Networking: "حلول شبكات وطباعة لاحتياج مهني منفصل وغير متداخل.",
  Maintenance: "خدمات صيانة ودعم تساعد على القرار والإنجاز بسرعة.",
  "Security Systems": "أنظمة أمنية وحلول مراقبة ضمن فئة مستقلة ومباشرة.",
};

export const exploreNeeds: NeedCategory[] = categories;

export const expectedTenantImportColumns = tenantImportColumns;
