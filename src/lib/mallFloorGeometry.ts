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
  coming_soon: "قريباً",
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
  if (status === "coming_soon") return "وحدة قيد التجهيز وستكون متاحة قريباً.";
  return "وحدة مشغولة حالياً.";
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
// Same octagonal perimeter. Different area distributions require different boundaries.
// Top edge: x=394, x=534 (same areas as ground)
// Right edge: y=427, y=495, y=562 (F-04/S-04 larger)
// Bottom edge (4 units): x=406, x=510, x=595
// Left edge: y=397, y=493, y=589 (F-15/S-15 larger)

const upperRaw: RawUnit[] = [
  // ── Top edge ──
  { key: "11", polygon: "225,48 394,48 394,158 285,158",   lx: 322, ly: 103, area: 27.48 },
  { key: "10", polygon: "394,48 534,48 534,158 394,158",   lx: 464, ly: 103, area: 27.52 },
  { key: "09", polygon: "534,48 775,48 715,158 534,158",   lx: 640, ly: 103, area: 41.68 },
  // ── Top-right diagonal ──
  { key: "08", polygon: "775,48 952,225 842,285 715,158",  lx: 821, ly: 179, area: 28.48 },
  // ── Right edge ──
  { key: "07", polygon: "952,225 952,427 842,427 842,285", lx: 897, ly: 356, area: 42.03 },
  { key: "06", polygon: "952,427 952,495 842,495 842,427", lx: 897, ly: 461, area: 20.03 },
  { key: "05", polygon: "952,495 952,562 842,562 842,495", lx: 897, ly: 529, area: 19.82 },
  { key: "04", polygon: "952,562 952,775 842,715 842,562", lx: 897, ly: 639, area: 45.28 },
  // ── Bottom-right diagonal ──
  { key: "03", polygon: "952,775 775,952 715,842 842,715", lx: 821, ly: 821, area: 33.85 },
  // ── Bottom edge (4 units) ──
  { key: "02", polygon: "775,952 595,952 595,842 715,842", lx: 670, ly: 897, area: 56.18 },
  { key: "01", polygon: "595,952 510,952 510,842 595,842", lx: 553, ly: 897, area: 31.66 },
  { key: "18", polygon: "510,952 406,952 406,842 510,842", lx: 458, ly: 897, area: 38.95 },
  { key: "17", polygon: "406,952 225,952 285,842 406,842", lx: 330, ly: 897, area: 56.18 },
  // ── Bottom-left diagonal ──
  { key: "16", polygon: "225,952 48,775 158,715 285,842",  lx: 179, ly: 821, area: 33.85 },
  // ── Left edge ──
  { key: "15", polygon: "48,775 48,589 158,589 158,715",   lx: 103, ly: 652, area: 45.21 },
  { key: "14", polygon: "48,589 48,493 158,493 158,589",   lx: 103, ly: 541, area: 27.62 },
  { key: "13", polygon: "48,493 48,397 158,397 158,493",   lx: 103, ly: 445, area: 27.62 },
  { key: "12", polygon: "48,397 48,225 158,285 158,397",   lx: 103, ly: 341, area: 41.00 },
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
