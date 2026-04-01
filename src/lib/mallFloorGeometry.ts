// Mall Elbostan – Floor plan geometry data
// Traced from architectural reference plans (3D isometric + PDF base pack)

export type MallUnitStatus = "available" | "occupied" | "coming_soon";
export type MallFloorId = "ground" | "first" | "second";
export type MallCategory =
  | "Accessories"
  | "Laptops"
  | "Components"
  | "Networking"
  | "Maintenance"
  | "Security Systems";

export type MallUnit = {
  id: string;
  code: string;
  floor: MallFloorId;
  name: string;
  area: number;
  status: MallUnitStatus;
  category: MallCategory;
  polygon: string;
  labelX: number;
  labelY: number;
  description: string;
};

export type MallFloor = {
  id: MallFloorId;
  label: string;
  units: MallUnit[];
};

// ── Structural geometry (viewBox 0 0 1000 1000) ──────────────────────────
export const OUTER_SHELL = "225,48 775,48 952,225 952,775 775,952 225,952 48,775 48,225";
export const CORRIDOR_BOUNDARY = "285,158 715,158 842,285 842,715 715,842 285,842 158,715 158,285";
export const ATRIUM_OCTAGON = "390,340 610,340 660,390 660,610 610,660 390,660 340,610 340,390";
export const ATRIUM_INNER = "430,380 570,380 600,430 600,570 570,600 430,600 400,570 400,430";

export const ATRIUM_CENTER = { x: 500, y: 500 };

export const ATRIUM_VERTICES = [
  [390, 340], [610, 340], [660, 390], [660, 610],
  [610, 660], [390, 660], [340, 610], [340, 390],
] as const;

export const COLUMN_POSITIONS = [
  [390, 340], [610, 340], [660, 390], [660, 610],
  [610, 660], [390, 660], [340, 610], [340, 390],
] as const;

export const ELEVATOR_RECT = { x: 390, y: 158, w: 140, h: 95 };
export const STAIR_RECTS = [
  { x: 195, y: 170, w: 75, h: 95, label: "سلالم" },
  { x: 740, y: 740, w: 80, h: 80, label: "سلالم" },
];

export const ENTRANCE_MARKER = { x: 500, y: 965, label: "المدخل الرئيسي" };

// ── Categories ───────────────────────────────────────────────────────────
const categories: MallCategory[] = [
  "Accessories", "Laptops", "Components", "Networking", "Maintenance", "Security Systems",
];

export const categoryLabelsAr: Record<MallCategory, string> = {
  Accessories: "الإكسسوارات والملحقات",
  Laptops: "أجهزة الكمبيوتر",
  Components: "المكوّنات والتجميع",
  Networking: "الشبكات والطباعة",
  Maintenance: "الصيانة والدعم",
  "Security Systems": "الأنظمة الأمنية",
};

export const floorLabelsAr: Record<MallFloorId, string> = {
  ground: "الدور الأرضي",
  first: "الدور الأول",
  second: "الدور الثاني",
};

export const statusLabelsAr: Record<MallUnitStatus, string> = {
  occupied: "مشغولة",
  available: "متاحة",
  coming_soon: "قريبًا",
};

// ── Availability (from PDF directory base pack) ──────────────────────────
const availableSet = new Set([
  "G-12", "G-15",
  "F-04", "F-07", "F-09", "F-11", "F-12", "F-15", "F-16", "F-17", "F-18",
  "S-01", "S-02", "S-03", "S-04", "S-05", "S-07", "S-08", "S-09",
  "S-11", "S-12", "S-13", "S-14", "S-15", "S-16", "S-17", "S-18",
]);
const comingSoonSet = new Set(["G-10", "F-03", "S-06"]);

const getStatus = (id: string): MallUnitStatus =>
  availableSet.has(id) ? "available" : comingSoonSet.has(id) ? "coming_soon" : "occupied";

const getDescription = (status: MallUnitStatus): string => {
  if (status === "available") return "وحدة تجارية جاهزة للتأجير بموقع مميز داخل مول البستان.";
  if (status === "coming_soon") return "وحدة قيد التجهيز وستكون متاحة قريبًا.";
  return "وحدة مشغولة حاليًا.";
};

// ── Ground floor unit polygons (17 units) ────────────────────────────────
// Traced clockwise from top-left, matching the octagonal perimeter.
// Outer wall boundary → inner corridor boundary forms each unit's depth.

type RawUnit = {
  key: string;
  polygon: string;
  lx: number;
  ly: number;
  area: number;
};

const groundRaw: RawUnit[] = [
  // ── Top edge (left→right): G-11, G-10, G-09 ──
  { key: "11", polygon: "225,48 382,48 382,158 285,158",   lx: 318, ly: 103, area: 27.48 },
  { key: "10", polygon: "382,48 540,48 540,158 382,158",   lx: 461, ly: 103, area: 27.52 },
  { key: "09", polygon: "540,48 775,48 715,158 540,158",   lx: 643, ly: 103, area: 41.68 },
  // ── Top-right diagonal: G-08 ──
  { key: "08", polygon: "775,48 952,225 842,285 715,158",  lx: 821, ly: 179, area: 28.48 },
  // ── Right edge (top→bottom): G-07, G-06, G-05, G-04 ──
  { key: "07", polygon: "952,225 952,412 842,412 842,285", lx: 897, ly: 334, area: 42.03 },
  { key: "06", polygon: "952,412 952,501 842,501 842,412", lx: 897, ly: 457, area: 20.03 },
  { key: "05", polygon: "952,501 952,589 842,589 842,501", lx: 897, ly: 545, area: 19.82 },
  { key: "04", polygon: "952,589 952,775 842,715 842,589", lx: 897, ly: 667, area: 41.69 },
  // ── Bottom-right diagonal: G-03 ──
  { key: "03", polygon: "952,775 775,952 715,842 842,715", lx: 821, ly: 821, area: 28.42 },
  // ── Bottom edge (right→left): G-02, G-01, G-17 ──
  { key: "02", polygon: "775,952 563,952 563,842 715,842", lx: 654, ly: 897, area: 41.54 },
  { key: "01", polygon: "563,952 437,952 437,842 563,842", lx: 500, ly: 897, area: 24.67 },
  { key: "17", polygon: "437,952 225,952 285,842 437,842", lx: 346, ly: 897, area: 41.49 },
  // ── Bottom-left diagonal: G-16 ──
  { key: "16", polygon: "225,952 48,775 158,715 285,842",  lx: 179, ly: 821, area: 28.23 },
  // ── Left edge (bottom→top): G-15, G-14, G-13, G-12 ──
  { key: "15", polygon: "48,775 48,609 158,609 158,715",   lx: 103, ly: 677, area: 41.78 },
  { key: "14", polygon: "48,609 48,499 158,499 158,609",   lx: 103, ly: 554, area: 27.62 },
  { key: "13", polygon: "48,499 48,389 158,389 158,499",   lx: 103, ly: 444, area: 27.62 },
  { key: "12", polygon: "48,389 48,225 158,285 158,389",   lx: 103, ly: 322, area: 41.00 },
];

// ── Upper floor unit polygons (18 units) ─────────────────────────────────
// Same as ground except bottom edge has 4 units (17, 18, 01, 02)
const upperRaw: RawUnit[] = [
  // ── Top edge ──
  { key: "11", polygon: "225,48 382,48 382,158 285,158",   lx: 318, ly: 103, area: 27.48 },
  { key: "10", polygon: "382,48 540,48 540,158 382,158",   lx: 461, ly: 103, area: 27.52 },
  { key: "09", polygon: "540,48 775,48 715,158 540,158",   lx: 643, ly: 103, area: 41.68 },
  // ── Top-right diagonal ──
  { key: "08", polygon: "775,48 952,225 842,285 715,158",  lx: 821, ly: 179, area: 28.48 },
  // ── Right edge ──
  { key: "07", polygon: "952,225 952,412 842,412 842,285", lx: 897, ly: 334, area: 42.03 },
  { key: "06", polygon: "952,412 952,501 842,501 842,412", lx: 897, ly: 457, area: 20.03 },
  { key: "05", polygon: "952,501 952,589 842,589 842,501", lx: 897, ly: 545, area: 19.82 },
  { key: "04", polygon: "952,589 952,775 842,715 842,589", lx: 897, ly: 667, area: 45.28 },
  // ── Bottom-right diagonal ──
  { key: "03", polygon: "952,775 775,952 715,842 842,715", lx: 821, ly: 821, area: 33.85 },
  // ── Bottom edge (4 units) ──
  { key: "02", polygon: "775,952 606,952 606,842 715,842", lx: 676, ly: 897, area: 56.18 },
  { key: "01", polygon: "606,952 511,952 511,842 606,842", lx: 559, ly: 897, area: 31.66 },
  { key: "18", polygon: "511,952 394,952 394,842 511,842", lx: 453, ly: 897, area: 38.95 },
  { key: "17", polygon: "394,952 225,952 285,842 394,842", lx: 325, ly: 897, area: 56.18 },
  // ── Bottom-left diagonal ──
  { key: "16", polygon: "225,952 48,775 158,715 285,842",  lx: 179, ly: 821, area: 33.85 },
  // ── Left edge ──
  { key: "15", polygon: "48,775 48,609 158,609 158,715",   lx: 103, ly: 677, area: 45.21 },
  { key: "14", polygon: "48,609 48,499 158,499 158,609",   lx: 103, ly: 554, area: 27.62 },
  { key: "13", polygon: "48,499 48,389 158,389 158,499",   lx: 103, ly: 444, area: 27.62 },
  { key: "12", polygon: "48,389 48,225 158,285 158,389",   lx: 103, ly: 322, area: 41.00 },
];

function buildFloor(
  floorId: MallFloorId,
  prefix: string,
  raw: RawUnit[],
): MallUnit[] {
  return raw.map((u, i) => {
    const id = `${prefix}-${u.key}`;
    const status = getStatus(id);
    return {
      id,
      code: id,
      floor: floorId,
      name: `وحدة ${id}`,
      area: u.area,
      status,
      category: categories[i % categories.length],
      polygon: u.polygon,
      labelX: u.lx,
      labelY: u.ly,
      description: getDescription(status),
    };
  });
}

export const mallFloors: MallFloor[] = [
  { id: "ground", label: "الدور الأرضي", units: buildFloor("ground", "G", groundRaw) },
  { id: "first",  label: "الدور الأول",  units: buildFloor("first",  "F", upperRaw) },
  { id: "second", label: "الدور الثاني", units: buildFloor("second", "S", upperRaw) },
];

export const allMallUnits = mallFloors.flatMap((f) => f.units);
export const availableMallUnits = allMallUnits.filter((u) => u.status === "available");
