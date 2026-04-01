// Mall Elbostan – Floor plan geometry data
// Traced from architectural reference plans (PDF base pack)
// Polygon boundaries are area-proportional to real unit footprints

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
// Boundaries computed to be area-proportional along each edge.
// Top edge boundaries: x=394, x=534
// Right edge boundaries: y=431, y=501, y=570
// Bottom edge boundaries: x=444, x=556
// Left edge boundaries: y=401, y=499, y=597

type RawUnit = {
  key: string;
  polygon: string;
  lx: number;
  ly: number;
  area: number;
};

const groundRaw: RawUnit[] = [
  // ── Top edge (left→right): G-11, G-10, G-09 ──
  { key: "11", polygon: "225,48 394,48 394,158 285,158",   lx: 322, ly: 103, area: 27.48 },
  { key: "10", polygon: "394,48 534,48 534,158 394,158",   lx: 464, ly: 103, area: 27.52 },
  { key: "09", polygon: "534,48 775,48 715,158 534,158",   lx: 640, ly: 103, area: 41.68 },
  // ── Top-right diagonal: G-08 ──
  { key: "08", polygon: "775,48 952,225 842,285 715,158",  lx: 821, ly: 179, area: 28.48 },
  // ── Right edge (top→bottom): G-07, G-06, G-05, G-04 ──
  { key: "07", polygon: "952,225 952,431 842,431 842,285", lx: 897, ly: 358, area: 42.03 },
  { key: "06", polygon: "952,431 952,501 842,501 842,431", lx: 897, ly: 466, area: 20.03 },
  { key: "05", polygon: "952,501 952,570 842,570 842,501", lx: 897, ly: 536, area: 19.82 },
  { key: "04", polygon: "952,570 952,775 842,715 842,570", lx: 897, ly: 643, area: 41.69 },
  // ── Bottom-right diagonal: G-03 ──
  { key: "03", polygon: "952,775 775,952 715,842 842,715", lx: 821, ly: 821, area: 28.42 },
  // ── Bottom edge (right→left): G-02, G-01, G-17 ──
  { key: "02", polygon: "775,952 556,952 556,842 715,842", lx: 650, ly: 897, area: 41.54 },
  { key: "01", polygon: "556,952 444,952 444,842 556,842", lx: 500, ly: 897, area: 24.67 },
  { key: "17", polygon: "444,952 225,952 285,842 444,842", lx: 349, ly: 897, area: 41.49 },
  // ── Bottom-left diagonal: G-16 ──
  { key: "16", polygon: "225,952 48,775 158,715 285,842",  lx: 179, ly: 821, area: 28.23 },
  // ── Left edge (bottom→top): G-15, G-14, G-13, G-12 ──
  { key: "15", polygon: "48,775 48,597 158,597 158,715",   lx: 103, ly: 656, area: 41.78 },
  { key: "14", polygon: "48,597 48,499 158,499 158,597",   lx: 103, ly: 548, area: 27.62 },
  { key: "13", polygon: "48,499 48,401 158,401 158,499",   lx: 103, ly: 450, area: 27.62 },
  { key: "12", polygon: "48,401 48,225 158,285 158,401",   lx: 103, ly: 343, area: 41.00 },
];

// ── Upper floor unit polygons (18 units) ─────────────────────────────────
// Traced from the reference HTML interactive map (viewBox 0 0 1985 2048),
// then normalised to our 48–952 coordinate space.

const upperRaw: RawUnit[] = [
  // ── Top edge (left→right): 11, 10, 09 ──
  { key: "11", polygon: "381,48 466,48 466,183 402,183 370,136",  lx: 417, ly: 120, area: 27.48 },
  { key: "10", polygon: "466,48 566,48 566,183 466,183",          lx: 516, ly: 116, area: 27.52 },
  { key: "09", polygon: "566,48 735,48 661,183 566,183",          lx: 632, ly: 116, area: 41.68 },
  // ── Top-right diagonal: 08 ──
  { key: "08", polygon: "735,48 902,124 815,312 661,183",         lx: 778, ly: 167, area: 38.46 },
  // ── Right edge (top→bottom): 07, 06, 05 ──
  { key: "07", polygon: "870,312 952,312 952,509 870,509",        lx: 911, ly: 410, area: 42.03 },
  { key: "06", polygon: "870,509 952,509 952,620 870,620",        lx: 911, ly: 564, area: 20.03 },
  { key: "05", polygon: "870,620 952,620 952,735 870,735",        lx: 911, ly: 678, area: 19.82 },
  // ── Bottom-right corner: 04 ──
  { key: "04", polygon: "775,814 894,732 952,732 952,952 873,952", lx: 889, ly: 836, area: 45.28 },
  // ── Bottom-right diagonal: 03 ──
  { key: "03", polygon: "693,882 775,814 873,952 748,952",        lx: 772, ly: 900, area: 33.85 },
  // ── Bottom edge (right→left): 02, 01, 18, 17 ──
  { key: "02", polygon: "635,952 748,952 693,882 600,882",        lx: 669, ly: 917, area: 56.18 },
  { key: "01", polygon: "513,952 600,952 600,882 513,882",        lx: 556, ly: 917, area: 31.66 },
  { key: "18", polygon: "423,952 513,952 513,882 423,882",        lx: 468, ly: 917, area: 33.85 },
  { key: "17", polygon: "307,952 423,952 423,882 333,882",        lx: 372, ly: 917, area: 56.18 },
  // ── Bottom-left diagonal: 16 ──
  { key: "16", polygon: "191,811 333,882 307,952 180,952 138,893", lx: 230, ly: 898, area: 38.95 },
  // ── Left edge (bottom→top): 15, 14, 13, 12 ──
  { key: "15", polygon: "48,741 138,811 180,952 48,952",          lx: 104, ly: 864, area: 45.21 },
  { key: "14", polygon: "48,606 138,606 138,741 48,741",          lx: 93, ly: 674, area: 27.62 },
  { key: "13", polygon: "48,465 138,465 138,606 48,606",          lx: 93, ly: 536, area: 27.62 },
  { key: "12", polygon: "48,312 138,312 138,465 48,465",          lx: 93, ly: 388, area: 41.00 },
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
