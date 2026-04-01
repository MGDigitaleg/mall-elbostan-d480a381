import type { FloorId } from "@/lib/floorMapData";

/**
 * Per-floor polygon hotspot coordinates mapped to the 3D isometric
 * architectural renders. Each floor has its own viewBox matching
 * the source image dimensions, and polygon coordinates traced
 * to the unit boundaries visible in the render.
 */

export type FloorPolygonUnit = {
  key: string;
  polygon: string;
  x: number;
  y: number;
};

export type FloorPolygonConfig = {
  viewBox: string;
  units: FloorPolygonUnit[];
};

/* ------------------------------------------------------------------ */
/*  Ground Floor — 992 × 1083 px                                      */
/* ------------------------------------------------------------------ */
const groundPolygons: FloorPolygonUnit[] = [
  // Back wall (top of image, behind entrance sign)
  { key: "11", polygon: "310,155 475,155 475,275 310,275", x: 392, y: 215 },
  { key: "10", polygon: "475,155 610,155 610,275 475,275", x: 542, y: 215 },
  { key: "09", polygon: "660,145 815,145 815,280 660,280", x: 737, y: 213 },

  // Right wing — top to bottom
  { key: "08", polygon: "700,280 815,280 825,405 715,395", x: 764, y: 340 },
  { key: "07", polygon: "800,215 945,215 950,380 830,375", x: 881, y: 296 },
  { key: "06", polygon: "860,380 950,375 950,455 860,455", x: 905, y: 416 },
  { key: "05", polygon: "860,455 952,455 955,525 865,525", x: 908, y: 490 },
  { key: "04", polygon: "835,525 955,525 960,685 850,675", x: 900, y: 602 },
  { key: "03", polygon: "740,665 855,650 870,810 755,830", x: 805, y: 739 },

  // Bottom wall
  { key: "02", polygon: "585,775 740,775 755,895 585,915", x: 666, y: 840 },
  { key: "01", polygon: "440,775 585,775 585,915 440,915", x: 512, y: 845 },
  { key: "18", polygon: "305,775 440,775 440,875 305,875", x: 372, y: 825 },
  { key: "17", polygon: "290,875 445,875 445,968 310,968", x: 372, y: 921 },

  // Left wing — bottom to top
  { key: "16", polygon: "150,745 290,690 345,835 215,875", x: 250, y: 786 },
  { key: "15", polygon: "50,628 190,628 155,795 50,795", x: 111, y: 711 },
  { key: "14", polygon: "50,530 185,530 185,628 50,628", x: 117, y: 579 },
  { key: "13", polygon: "50,405 185,405 185,530 50,530", x: 117, y: 467 },
  { key: "12", polygon: "55,255 215,195 250,405 70,410", x: 148, y: 316 },
];

/* ------------------------------------------------------------------ */
/*  First Floor — 1594 × 1645 px                                      */
/* ------------------------------------------------------------------ */
const firstPolygons: FloorPolygonUnit[] = [
  // Back wall
  { key: "11", polygon: "490,270 730,270 730,430 490,430", x: 610, y: 350 },
  { key: "10", polygon: "730,270 930,270 930,430 730,430", x: 830, y: 350 },
  { key: "09", polygon: "970,255 1200,255 1200,445 970,445", x: 1085, y: 350 },

  // Right wing — top to bottom
  { key: "08", polygon: "1090,445 1240,435 1250,625 1110,625", x: 1172, y: 532 },
  { key: "07", polygon: "1210,340 1420,330 1430,610 1250,605", x: 1328, y: 471 },
  { key: "06", polygon: "1315,610 1445,605 1445,725 1315,725", x: 1380, y: 666 },
  { key: "05", polygon: "1315,725 1445,725 1450,815 1325,815", x: 1384, y: 770 },
  { key: "04", polygon: "1275,815 1440,810 1450,1030 1295,1030", x: 1365, y: 921 },
  { key: "03", polygon: "1095,1000 1285,965 1300,1210 1115,1245", x: 1199, y: 1105 },

  // Bottom wall
  { key: "02", polygon: "900,1200 1100,1200 1115,1370 900,1390", x: 1004, y: 1290 },
  { key: "01", polygon: "685,1200 900,1200 900,1390 685,1390", x: 792, y: 1295 },
  { key: "18", polygon: "485,1200 685,1200 685,1330 485,1330", x: 585, y: 1265 },
  { key: "17", polygon: "440,1330 665,1330 665,1440 465,1440", x: 559, y: 1385 },

  // Left wing — bottom to top
  { key: "16", polygon: "235,1145 440,1065 500,1265 345,1340", x: 380, y: 1204 },
  { key: "15", polygon: "72,955 290,955 245,1200 72,1200", x: 170, y: 1077 },
  { key: "14", polygon: "72,845 290,845 290,955 72,955", x: 181, y: 900 },
  { key: "13", polygon: "72,648 285,648 285,845 72,845", x: 178, y: 746 },
  { key: "12", polygon: "72,405 345,340 385,648 105,655", x: 227, y: 512 },
];

/* ------------------------------------------------------------------ */
/*  Second (Top) Floor — 992 × 1079 px                                */
/*  Layout mirrors ground floor with near-identical dimensions        */
/* ------------------------------------------------------------------ */
const secondPolygons: FloorPolygonUnit[] = [
  // Back wall
  { key: "11", polygon: "310,155 475,155 475,272 310,272", x: 392, y: 213 },
  { key: "10", polygon: "475,155 610,155 610,272 475,272", x: 542, y: 213 },
  { key: "09", polygon: "660,145 815,145 815,278 660,278", x: 737, y: 211 },

  // Right wing
  { key: "08", polygon: "700,278 815,278 825,400 715,390", x: 764, y: 337 },
  { key: "07", polygon: "800,213 945,213 950,377 830,372", x: 881, y: 294 },
  { key: "06", polygon: "860,377 950,372 950,452 860,452", x: 905, y: 413 },
  { key: "05", polygon: "860,452 952,452 955,522 865,522", x: 908, y: 487 },
  { key: "04", polygon: "835,522 955,522 960,680 850,670", x: 900, y: 599 },
  { key: "03", polygon: "740,662 855,647 870,806 755,825", x: 805, y: 735 },

  // Bottom wall
  { key: "02", polygon: "585,770 740,770 755,890 585,910", x: 666, y: 835 },
  { key: "01", polygon: "440,770 585,770 585,910 440,910", x: 512, y: 840 },
  { key: "18", polygon: "305,770 440,770 440,870 305,870", x: 372, y: 820 },
  { key: "17", polygon: "290,870 445,870 445,963 310,963", x: 372, y: 917 },

  // Left wing
  { key: "16", polygon: "150,740 290,685 345,830 215,870", x: 250, y: 781 },
  { key: "15", polygon: "50,625 190,625 155,790 50,790", x: 111, y: 707 },
  { key: "14", polygon: "50,527 185,527 185,625 50,625", x: 117, y: 576 },
  { key: "13", polygon: "50,402 185,402 185,527 50,527", x: 117, y: 465 },
  { key: "12", polygon: "55,253 215,193 250,402 70,407", x: 148, y: 314 },
];

export const floorPolygonConfigs: Record<FloorId, FloorPolygonConfig> = {
  ground: { viewBox: "0 0 992 1083", units: groundPolygons },
  first: { viewBox: "0 0 1594 1645", units: firstPolygons },
  second: { viewBox: "0 0 992 1079", units: secondPolygons },
};
