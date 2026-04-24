/**
 * Device entry generator: produces ~970 catalog entries from compact metadata.
 * Output is shaped to match `DeviceEntry` and is merged with the manual catalog.
 *
 * Strategy:
 *   A) Brand variants     — base × brand                 (~ 250)
 *   B) Use-case variants  — base × use-case              (~ 100)
 *   C) Spec variants      — sizes / capacities / generations (~ 200)
 *   D) Long-tail accessories — micro categories          (~ 420)
 *
 * Every generated entry is unique (template selection by slug hash) and
 * SEO-complete (title + description + keywords + intro + 4 FAQs + relatedSlugs).
 */

import {
  Laptop, Smartphone, Monitor, Cpu, Headphones, Keyboard,
  HardDrive, Mouse, Camera, Gamepad2, Printer, Router,
  Tablet, Watch, Speaker, MemoryStick, Webcam, Cable, Zap, Wifi, Wrench,
  Server, Joystick, Mic, BatteryCharging, ScanLine,
  HardDriveDownload, Lightbulb, ShieldCheck,
  CircuitBoard, Fan, PlugZap,
  Disc, Tv, Projector, MonitorSmartphone, Radio,
  Package, Sparkles, Shield, Box, Settings, Plug, Key, Eye, Volume2,
  Battery, Thermometer, Scissors, Glasses, Briefcase, Backpack,
  Sun, Wind, Droplet, Magnet, Gauge, Antenna,
  type LucideIcon,
} from "lucide-react";

import { CAT, type DeviceEntry, type CategoryValue, type Orbit } from "./types";
import {
  brandIntro, useCaseIntro, specIntro, accessoryIntro, pickFaqs, USE_CASES,
} from "./templates";
import {
  LAPTOP_BRANDS, PHONE_BRANDS, MONITOR_BRANDS, PRINTER_BRANDS, NETWORK_BRANDS,
  STORAGE_BRANDS, HEADPHONE_BRANDS, CAMERA_BRANDS, PERIPHERAL_BRANDS,
  TABLET_BRANDS, SMARTWATCH_BRANDS, type BrandInfo,
} from "./brands";

const MALL_TAG_SHORT = "مول البستان، التجمع الخامس";

// Keyword helper: trim, dedupe, join with comma
const kw = (...parts: (string | undefined | null)[]): string =>
  Array.from(new Set(parts.filter((p): p is string => !!p && p.trim().length > 0))).join(", ");

// Build a canonical entry shape with sensible defaults.
function makeEntry(args: {
  slug: string;
  labelAr: string;
  labelEn: string;
  Icon: LucideIcon;
  parentCategory: CategoryValue;
  orbit?: Orbit;
  productKeywords: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  intro: string;
  relatedSlugs: string[];
  brand?: string;
  useCase?: string;
  baseSlug?: string;
}): DeviceEntry {
  return {
    slug: args.slug,
    labelAr: args.labelAr,
    labelEn: args.labelEn,
    Icon: args.Icon,
    parentCategory: args.parentCategory,
    orbit: args.orbit ?? "outer",
    productKeywords: args.productKeywords,
    seo: {
      title: args.seoTitle,
      description: args.seoDescription,
      keywords: args.seoKeywords,
    },
    intro: args.intro,
    faq: pickFaqs(args.slug, 4),
    relatedSlugs: args.relatedSlugs,
    brand: args.brand,
    useCase: args.useCase,
    baseSlug: args.baseSlug,
    generated: true,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// A) BRAND VARIANTS
// ────────────────────────────────────────────────────────────────────────────

interface BrandFamily {
  baseSlug: string;        // "laptops"
  baseLabelAr: string;     // "لابتوبات"
  Icon: LucideIcon;
  parentCategory: CategoryValue;
  brands: BrandInfo[];
  extraKeywords?: string[];
}

const BRAND_FAMILIES: BrandFamily[] = [
  { baseSlug: "laptops", baseLabelAr: "لابتوبات", Icon: Laptop, parentCategory: CAT.computers, brands: LAPTOP_BRANDS, extraKeywords: ["laptop", "نوت بوك"] },
  { baseSlug: "smartphones", baseLabelAr: "هواتف", Icon: Smartphone, parentCategory: CAT.phones, brands: PHONE_BRANDS, extraKeywords: ["موبايل", "phone"] },
  { baseSlug: "monitors", baseLabelAr: "شاشات", Icon: Monitor, parentCategory: CAT.computers, brands: MONITOR_BRANDS, extraKeywords: ["monitor", "display"] },
  { baseSlug: "printers", baseLabelAr: "طابعات", Icon: Printer, parentCategory: CAT.printing, brands: PRINTER_BRANDS, extraKeywords: ["printer", "طباعة"] },
  { baseSlug: "routers", baseLabelAr: "راوتر", Icon: Router, parentCategory: CAT.networking, brands: NETWORK_BRANDS, extraKeywords: ["router", "wifi"] },
  { baseSlug: "storage", baseLabelAr: "تخزين", Icon: HardDrive, parentCategory: CAT.computers, brands: STORAGE_BRANDS, extraKeywords: ["ssd", "hdd", "هارد"] },
  { baseSlug: "headphones", baseLabelAr: "سماعات", Icon: Headphones, parentCategory: CAT.phones, brands: HEADPHONE_BRANDS, extraKeywords: ["headphones", "earbuds"] },
  { baseSlug: "cameras", baseLabelAr: "كاميرات", Icon: Camera, parentCategory: CAT.phones, brands: CAMERA_BRANDS, extraKeywords: ["camera", "كاميرا"] },
  { baseSlug: "keyboards", baseLabelAr: "كيبورد", Icon: Keyboard, parentCategory: CAT.computers, brands: PERIPHERAL_BRANDS, extraKeywords: ["keyboard"] },
  { baseSlug: "mice", baseLabelAr: "ماوس", Icon: Mouse, parentCategory: CAT.computers, brands: PERIPHERAL_BRANDS, extraKeywords: ["mouse"] },
  { baseSlug: "tablets", baseLabelAr: "تابلت", Icon: Tablet, parentCategory: CAT.phones, brands: TABLET_BRANDS, extraKeywords: ["tablet", "ipad"] },
  { baseSlug: "smartwatches", baseLabelAr: "ساعات ذكية", Icon: Watch, parentCategory: CAT.phones, brands: SMARTWATCH_BRANDS, extraKeywords: ["smartwatch", "ساعة"] },
];

function generateBrandVariants(): DeviceEntry[] {
  const out: DeviceEntry[] = [];
  for (const family of BRAND_FAMILIES) {
    for (const b of family.brands) {
      const slug = `${family.baseSlug}-${b.key}`;
      const labelAr = `${family.baseLabelAr} ${b.labelAr}`;
      const labelEn = `${b.labelEn} ${family.baseSlug}`;
      const intro = brandIntro({
        baseLabelAr: family.baseLabelAr,
        brandLabelAr: b.labelAr,
        brandLabelEn: b.labelEn,
        series: b.series,
        slug,
      });
      const seoTitle = `${labelAr} في مول البستان — ${b.labelEn} الأصلية بضمان`;
      const seoDescription = `تشكيلة واسعة من ${labelAr} الأصلية بضمان وكيل معتمد في مول البستان بالقاهرة الجديدة. اكتشف أحدث موديلات ${b.labelEn} بأسعار تنافسية وخدمة احترافية.`;
      const seoKeywords = kw(
        labelAr, b.labelEn, b.labelAr, family.baseLabelAr,
        ...(family.extraKeywords ?? []),
        "مول البستان", "التجمع الخامس", "القاهرة الجديدة",
      );

      // Related: 3 same-base brand siblings + base slug + 1 sibling family base
      const siblings = family.brands
        .filter((x) => x.key !== b.key)
        .slice(0, 3)
        .map((x) => `${family.baseSlug}-${x.key}`);
      const relatedSlugs = [family.baseSlug, ...siblings];

      out.push(makeEntry({
        slug, labelAr, labelEn, Icon: family.Icon,
        parentCategory: family.parentCategory,
        orbit: "outer",
        productKeywords: [b.labelAr, b.labelEn.toLowerCase(), family.baseLabelAr, ...(family.extraKeywords ?? [])],
        seoTitle, seoDescription, seoKeywords,
        intro, relatedSlugs,
        brand: b.labelEn, baseSlug: family.baseSlug,
      }));
    }
  }
  return out;
}

// ────────────────────────────────────────────────────────────────────────────
// B) USE-CASE VARIANTS
// ────────────────────────────────────────────────────────────────────────────

interface UseCaseFamily {
  baseSlug: string;
  baseLabelAr: string;
  Icon: LucideIcon;
  parentCategory: CategoryValue;
  useCases: string[];     // keys from USE_CASES
  extraKeywords?: string[];
}

const USECASE_FAMILIES: UseCaseFamily[] = [
  { baseSlug: "laptops", baseLabelAr: "لابتوبات", Icon: Laptop, parentCategory: CAT.computers, useCases: ["gaming", "business", "students", "design", "programming", "architecture", "video-editing", "2-in-1"] },
  { baseSlug: "monitors", baseLabelAr: "شاشات", Icon: Monitor, parentCategory: CAT.computers, useCases: ["gaming", "4k", "curved", "ultrawide", "design", "office"] },
  { baseSlug: "printers", baseLabelAr: "طابعات", Icon: Printer, parentCategory: CAT.printing, useCases: ["home", "office", "photo", "laser", "color"] },
  { baseSlug: "smartphones", baseLabelAr: "هواتف", Icon: Smartphone, parentCategory: CAT.phones, useCases: ["gaming", "business", "students", "photo"] },
  { baseSlug: "tablets", baseLabelAr: "تابلت", Icon: Tablet, parentCategory: CAT.phones, useCases: ["students", "design", "business", "home"] },
  { baseSlug: "headphones", baseLabelAr: "سماعات", Icon: Headphones, parentCategory: CAT.phones, useCases: ["gaming", "office", "design"] },
  { baseSlug: "cameras", baseLabelAr: "كاميرات", Icon: Camera, parentCategory: CAT.phones, useCases: ["video-editing", "photo", "students"] },
  { baseSlug: "routers", baseLabelAr: "راوتر", Icon: Router, parentCategory: CAT.networking, useCases: ["gaming", "home", "office"] },
];

function generateUseCaseVariants(): DeviceEntry[] {
  const out: DeviceEntry[] = [];
  for (const fam of USECASE_FAMILIES) {
    for (const ucKey of fam.useCases) {
      const uc = USE_CASES[ucKey];
      if (!uc) continue;
      const slug = `${fam.baseSlug}-${ucKey}`;
      const labelAr = `${fam.baseLabelAr} ${uc.ar}`;
      const labelEn = `${fam.baseSlug} ${ucKey}`;
      const intro = useCaseIntro({ baseLabelAr: fam.baseLabelAr, useCaseKey: ucKey, slug });
      const seoTitle = `${labelAr} في مول البستان — أفضل الموديلات بأسعار تنافسية`;
      const seoDescription = `اكتشف أفضل ${labelAr} في القاهرة الجديدة بمول البستان. ${uc.descAr}. ضمان وكيل وخيارات تمويل.`;
      const seoKeywords = kw(labelAr, fam.baseLabelAr, uc.ar, ...(fam.extraKeywords ?? []), "مول البستان", "التجمع الخامس");

      // Related: base + 3 other use-cases of same family + 1 brand variant
      const siblings = fam.useCases.filter((u) => u !== ucKey).slice(0, 3).map((u) => `${fam.baseSlug}-${u}`);
      const relatedSlugs = [fam.baseSlug, ...siblings];

      out.push(makeEntry({
        slug, labelAr, labelEn, Icon: fam.Icon,
        parentCategory: fam.parentCategory,
        orbit: "outer",
        productKeywords: [fam.baseLabelAr, uc.ar, ...(fam.extraKeywords ?? [])],
        seoTitle, seoDescription, seoKeywords,
        intro, relatedSlugs,
        useCase: ucKey, baseSlug: fam.baseSlug,
      }));
    }
  }
  return out;
}

// ────────────────────────────────────────────────────────────────────────────
// C) SPEC VARIANTS — sizes, capacities, generations
// ────────────────────────────────────────────────────────────────────────────

interface SpecVariant {
  baseSlug: string;
  baseLabelAr: string;
  Icon: LucideIcon;
  parentCategory: CategoryValue;
  specSlug: string;
  specLabel: string;     // for label and SEO title
  specDesc: string;      // for intro
}

function buildSpecList(): SpecVariant[] {
  const out: SpecVariant[] = [];

  // Monitor sizes
  for (const sz of [22, 24, 27, 32, 34, 40, 49]) {
    out.push({
      baseSlug: "monitors", baseLabelAr: "شاشات", Icon: Monitor, parentCategory: CAT.computers,
      specSlug: `monitors-${sz}-inch`, specLabel: `${sz} بوصة`,
      specDesc: `بحجم ${sz} بوصة المثالي للأعمال والترفيه، بدقة عرض حادة وتصميم نحيف يناسب أي مكتب`,
    });
  }
  // Laptop sizes
  for (const sz of [13, 14, 15, 16, 17]) {
    out.push({
      baseSlug: "laptops", baseLabelAr: "لابتوبات", Icon: Laptop, parentCategory: CAT.computers,
      specSlug: `laptops-${sz}-inch`, specLabel: `${sz} بوصة`,
      specDesc: `بحجم ${sz} بوصة المتوازن بين الإنتاجية وسهولة الحمل، يناسب الطلاب والعاملين والمصممين`,
    });
  }
  // Tablet sizes
  for (const sz of [8, 10, 11, 12, 13]) {
    out.push({
      baseSlug: "tablets", baseLabelAr: "تابلت", Icon: Tablet, parentCategory: CAT.phones,
      specSlug: `tablets-${sz}-inch`, specLabel: `${sz} بوصة`,
      specDesc: `بحجم ${sz} بوصة، شاشة عرض غنية وأداء سلس للقراءة والترفيه والعمل`,
    });
  }
  // TV sizes
  for (const sz of [43, 50, 55, 65, 75, 85]) {
    out.push({
      baseSlug: "televisions", baseLabelAr: "تلفزيونات", Icon: Tv, parentCategory: CAT.gaming,
      specSlug: `tvs-${sz}-inch`, specLabel: `${sz} بوصة`,
      specDesc: `تلفزيون سمارت ${sz} بوصة بدقة 4K HDR ومعدل تحديث عالٍ مناسب للأفلام والألعاب`,
    });
  }
  // SSD capacities
  for (const cap of ["256gb", "500gb", "1tb", "2tb", "4tb"]) {
    out.push({
      baseSlug: "storage", baseLabelAr: "هاردات SSD", Icon: HardDrive, parentCategory: CAT.computers,
      specSlug: `ssd-${cap}`, specLabel: cap.toUpperCase(),
      specDesc: `بسعة ${cap.toUpperCase()} بسرعات قراءة وكتابة عالية مناسبة لتشغيل الأنظمة والألعاب والبرامج الثقيلة`,
    });
  }
  // RAM sizes
  for (const cap of ["8gb", "16gb", "32gb", "64gb"]) {
    out.push({
      baseSlug: "ram", baseLabelAr: "ذاكرة RAM", Icon: MemoryStick, parentCategory: CAT.computers,
      specSlug: `ram-${cap}`, specLabel: cap.toUpperCase(),
      specDesc: `بسعة ${cap.toUpperCase()} لأداء سلس مع الأنظمة الحديثة، البرامج المكتبية، الألعاب وتحرير الفيديو`,
    });
  }
  // Powerbank capacities
  for (const cap of ["5000", "10000", "20000", "30000"]) {
    out.push({
      baseSlug: "powerbanks", baseLabelAr: "باور بانك", Icon: BatteryCharging, parentCategory: CAT.phones,
      specSlug: `powerbanks-${cap}mah`, specLabel: `${cap}mAh`,
      specDesc: `بسعة ${cap}mAh مناسبة للسفر والاستخدام اليومي، شحن سريع ومخارج USB-C و USB-A`,
    });
  }
  // Wi-Fi standards
  out.push({ baseSlug: "routers", baseLabelAr: "راوتر", Icon: Wifi, parentCategory: CAT.networking,
    specSlug: "wifi-6-routers", specLabel: "Wi-Fi 6", specDesc: "بمعيار Wi-Fi 6 (802.11ax) لسرعات عالية واتصال مستقر مع أجهزة متعددة" });
  out.push({ baseSlug: "routers", baseLabelAr: "راوتر", Icon: Wifi, parentCategory: CAT.networking,
    specSlug: "wifi-7-routers", specLabel: "Wi-Fi 7", specDesc: "بأحدث معيار Wi-Fi 7 (802.11be) لسرعات تتجاوز 30Gbps وزمن استجابة منخفض جداً" });

  // Cable variants
  out.push({ baseSlug: "cables", baseLabelAr: "كابلات", Icon: Cable, parentCategory: CAT.computers,
    specSlug: "usb-c-cables", specLabel: "USB-C", specDesc: "كابلات USB-C عالية الجودة بدعم نقل بيانات سريع وشحن قوي حتى 100W" });
  out.push({ baseSlug: "cables", baseLabelAr: "كابلات", Icon: Cable, parentCategory: CAT.computers,
    specSlug: "hdmi-2-1-cables", specLabel: "HDMI 2.1", specDesc: "كابلات HDMI 2.1 لدعم 4K@120Hz و 8K@60Hz للجيمنج المتقدم وأجهزة العرض الحديثة" });
  out.push({ baseSlug: "cables", baseLabelAr: "كابلات", Icon: Cable, parentCategory: CAT.networking,
    specSlug: "ethernet-cables-cat6", specLabel: "Cat6 Ethernet", specDesc: "كابلات شبكة Cat6 بسرعة Gigabit موصلات RJ45 معتمدة لشبكات المنازل والمكاتب" });
  out.push({ baseSlug: "cables", baseLabelAr: "كابلات", Icon: Cable, parentCategory: CAT.networking,
    specSlug: "ethernet-cables-cat7", specLabel: "Cat7 Ethernet", specDesc: "كابلات شبكة Cat7 معزولة بدقة لسرعات 10Gbps وبيئات الشركات والداتا سنتر" });

  // RAM generations
  out.push({ baseSlug: "ram", baseLabelAr: "ذاكرة RAM", Icon: MemoryStick, parentCategory: CAT.computers,
    specSlug: "ddr4-ram", specLabel: "DDR4", specDesc: "ذاكرة DDR4 موفرة للطاقة بسرعات حتى 3600MHz للأنظمة الشائعة الحالية" });
  out.push({ baseSlug: "ram", baseLabelAr: "ذاكرة RAM", Icon: MemoryStick, parentCategory: CAT.computers,
    specSlug: "ddr5-ram", specLabel: "DDR5", specDesc: "ذاكرة DDR5 الجيل الأحدث بسرعات تبدأ من 4800MHz لمنصات Intel و AMD الحديثة" });

  // SSD types
  out.push({ baseSlug: "storage", baseLabelAr: "هاردات", Icon: HardDrive, parentCategory: CAT.computers,
    specSlug: "nvme-ssd", specLabel: "NVMe SSD", specDesc: "هاردات NVMe بسرعات قراءة تتجاوز 7000MB/s مناسبة للجيمنج وبرامج التحرير" });
  out.push({ baseSlug: "storage", baseLabelAr: "هاردات", Icon: HardDrive, parentCategory: CAT.computers,
    specSlug: "sata-ssd", specLabel: "SATA SSD", specDesc: "هاردات SATA SSD بسرعات قراءة 550MB/s مناسبة للترقيات الاقتصادية للأجهزة القديمة" });
  out.push({ baseSlug: "storage", baseLabelAr: "هاردات خارجية", Icon: HardDriveDownload, parentCategory: CAT.computers,
    specSlug: "external-ssd", specLabel: "External SSD", specDesc: "هاردات SSD خارجية محمولة بسرعات Thunderbolt و USB 3.2 للنقل السريع" });

  return out;
}

function generateSpecVariants(): DeviceEntry[] {
  const specs = buildSpecList();
  return specs.map((s) => {
    const labelAr = `${s.baseLabelAr} ${s.specLabel}`;
    const labelEn = `${s.baseSlug} ${s.specLabel}`;
    const intro = specIntro({ baseLabelAr: s.baseLabelAr, specLabel: s.specLabel, specDesc: s.specDesc, slug: s.specSlug });
    const seoTitle = `${labelAr} في مول البستان — أحدث الموديلات`;
    const seoDescription = `اكتشف أحدث ${labelAr} في ${MALL_TAG_SHORT}. ${s.specDesc}. ضمان وكيل معتمد وأسعار تنافسية.`;
    const seoKeywords = kw(labelAr, s.baseLabelAr, s.specLabel, "مول البستان", "التجمع الخامس", "القاهرة الجديدة");

    return makeEntry({
      slug: s.specSlug, labelAr, labelEn, Icon: s.Icon,
      parentCategory: s.parentCategory, orbit: "outer",
      productKeywords: [s.baseLabelAr, s.specLabel],
      seoTitle, seoDescription, seoKeywords,
      intro, relatedSlugs: [s.baseSlug],
      baseSlug: s.baseSlug,
    });
  });
}

// ────────────────────────────────────────────────────────────────────────────
// D) LONG-TAIL ACCESSORIES — micro-categories
// ────────────────────────────────────────────────────────────────────────────

interface AccessoryDef {
  slug: string;
  labelAr: string;
  labelEn: string;
  Icon: LucideIcon;
  parentCategory: CategoryValue;
  contextAr: string;
  keywords: string[];
}

function buildAccessoryList(): AccessoryDef[] {
  // Helper for repeating phone/laptop accessories per brand-friendly slugs
  const list: AccessoryDef[] = [];

  // ── Laptop accessories
  const laptopAcc: Array<[string, string, string, LucideIcon, string]> = [
    ["laptop-bags", "حقائب لابتوب", "Laptop Bags", Briefcase, "بمختلف المقاسات والأنماط للحماية والحمل اليومي"],
    ["laptop-backpacks", "ظهر لابتوب", "Laptop Backpacks", Backpack, "بحشوات حماية ومقصورات منظمة لحمل اللابتوب والإكسسوارات"],
    ["laptop-stands", "حوامل لابتوب", "Laptop Stands", Box, "ترفع شاشة اللابتوب لتقليل إجهاد الرقبة وتحسين تدفق الهواء"],
    ["laptop-cooling-pads", "قواعد تبريد لابتوب", "Laptop Cooling Pads", Fan, "بمراوح متعددة وإضاءة RGB لخفض حرارة الجهاز أثناء الجيمنج والاستخدام المكثف"],
    ["laptop-skins", "سكينز لابتوب", "Laptop Skins", Sparkles, "ملصقات حماية بأنماط مميزة لإضفاء طابع شخصي على اللابتوب"],
    ["laptop-screws", "مسامير لابتوب", "Laptop Screws", Settings, "مجموعات مسامير دقيقة لإصلاح الفك والتركيب لمختلف موديلات اللابتوب"],
    ["laptop-batteries", "بطاريات لابتوب", "Laptop Batteries", Battery, "بطاريات بديلة أصلية ومتوافقة لمعظم موديلات اللابتوب"],
    ["laptop-chargers", "شواحن لابتوب", "Laptop Chargers", Plug, "شواحن أصلية ومتوافقة بقدرات مختلفة لمعظم موديلات اللابتوب"],
    ["thermal-paste", "معجون تبريد", "Thermal Paste", Droplet, "معاجين تبريد عالية الأداء لتركيب المعالجات وكروت الشاشة"],
    ["heat-pipes", "أنابيب حرارية", "Heat Pipes", Thermometer, "أنابيب حرارية لإصلاح أنظمة التبريد في اللابتوبات والكمبيوترات"],
    ["m2-heatsinks", "مبردات M.2", "M.2 Heatsinks", Wind, "مبردات NVMe M.2 لخفض حرارة هاردات SSD وتحسين الأداء المستدام"],
    ["screwdriver-kits", "مفكات إصلاح", "Repair Screwdriver Kits", Wrench, "مجموعات مفكات دقيقة لفك وتركيب الأجهزة الإلكترونية"],
    ["esd-bags", "أكياس مضادة للكهرباء الساكنة", "ESD Bags", Shield, "أكياس واقية للقطع الإلكترونية الحساسة من الكهرباء الساكنة"],
    ["cleaning-brushes", "فرش تنظيف", "Cleaning Brushes", Scissors, "فرش ناعمة لتنظيف لوحات المفاتيح، الكاميرات، والأجهزة الإلكترونية"],
    ["compressed-air", "ضواغط هواء تنظيف", "Compressed Air Cans", Wind, "علب هواء مضغوط لإزالة الغبار من اللابتوبات، الكيبوردات، والأجهزة"],
    ["lens-wipes", "مساحات عدسات", "Lens Wipes", Sparkles, "مناديل تنظيف للعدسات والشاشات بدون خدش"],
  ];

  // ── Phone accessories
  const phoneAcc: Array<[string, string, string, LucideIcon, string]> = [
    ["phone-cases", "جرابات هواتف", "Phone Cases", Shield, "جرابات حماية بمختلف الأنماط لمعظم موديلات الهواتف"],
    ["screen-protectors", "حماية شاشة", "Screen Protectors", Shield, "حماية شاشة زجاجية مقواة وفيلم بلاستيكي بمضاد للأشعة الزرقاء"],
    ["phone-chargers", "شواحن هواتف", "Phone Chargers", Plug, "شواحن أصلية بقدرات شحن سريعة 20W حتى 100W لمختلف الهواتف"],
    ["wireless-chargers", "شواحن لاسلكية", "Wireless Chargers", Zap, "شواحن لاسلكية Qi و MagSafe بقدرات حتى 15W"],
    ["car-chargers", "شواحن سيارة", "Car Chargers", BatteryCharging, "شواحن سيارة بقدرات شحن سريعة ومخارج USB-C و USB-A متعددة"],
    ["car-mounts", "حوامل سيارة", "Car Phone Mounts", Magnet, "حوامل هاتف للسيارة مغناطيسية وبشفط لتثبيت آمن"],
    ["selfie-sticks", "عصي سيلفي", "Selfie Sticks", Camera, "عصي سيلفي بحامل ثلاثي وزر بلوتوث وقاعدة Tripod"],
    ["phone-grips", "حلقات هاتف", "Phone Grips", Magnet, "حلقات تمسك خلفية للهواتف لتسهيل الإمساك ومنع السقوط"],
    ["phone-lanyards", "حبال هاتف", "Phone Lanyards", Key, "حبال علاقة هاتف للحمل عبر الرقبة أو المعصم بأمان"],
    ["camera-lens-attachments", "عدسات كاميرا هاتف", "Phone Camera Lenses", Eye, "عدسات إضافية للهاتف Wide / Macro / Telephoto لتحسين التصوير"],
    ["lavalier-mics", "مايكات ياقة", "Lavalier Microphones", Mic, "مايكات ياقة لاسلكية وسلكية للتسجيل وإنتاج المحتوى عبر الهاتف"],
    ["otg-adapters", "محول OTG", "OTG Adapters", Cable, "محولات OTG لربط الفلاش والماوس والكيبورد بالهاتف"],
    ["sim-tools", "أدوات شريحة SIM", "SIM Tools", Key, "أدوات إخراج شريحة SIM للهواتف بمختلف الأحجام"],
  ];

  // ── Networking / Power accessories
  const networkAcc: Array<[string, string, string, LucideIcon, string]> = [
    ["surge-protectors", "حماية ضد الصواعق", "Surge Protectors", ShieldCheck, "بريزات حماية ضد ارتفاع التيار للأجهزة الإلكترونية الحساسة"],
    ["small-ups", "UPS صغير منزلي", "Small Home UPS", Zap, "أجهزة UPS صغيرة بقدرات 600VA حتى 1500VA لحماية الراوتر والكمبيوتر"],
    ["enterprise-ups", "UPS احترافي", "Enterprise UPS", Server, "أجهزة UPS احترافية بقدرات عالية للسيرفرات والشركات"],
    ["power-strips", "بريزات USB متعددة", "Smart Power Strips", PlugZap, "بريزات كهرباء ذكية بمنافذ USB-C و USB-A متعددة وحماية متكاملة"],
    ["voltage-stabilizers", "منظم جهد", "Voltage Stabilizers", Gauge, "منظمات جهد كهربائي لحماية الأجهزة المنزلية والأجهزة التقنية"],
    ["network-tools", "أدوات تركيب شبكات", "Network Tools", Wrench, "أدوات تركيب وفحص كابلات الشبكة من ضواغط RJ45 وكاشفات الأعطال"],
    ["poe-injectors", "حاقن PoE", "PoE Injectors", Plug, "حواقن PoE لتغذية كاميرات المراقبة وأكسس بوينت عبر كابل الشبكة"],
    ["wifi-extenders", "موسعات Wi-Fi", "Wi-Fi Extenders", Wifi, "موسعات نطاق Wi-Fi لتقوية الإشارة في المناطق البعيدة عن الراوتر"],
    ["mesh-systems", "أنظمة Mesh", "Mesh Systems", Wifi, "أنظمة شبكات Mesh لتغطية شاملة للمنازل والمكاتب الكبيرة"],
    ["antennas", "أنتنات راوتر", "Router Antennas", Antenna, "أنتنات راوتر بديلة بكسب أعلى لتحسين تغطية الإشارة"],
    ["motion-sensors", "حساسات حركة", "Motion Sensors", Eye, "حساسات حركة للأنظمة الأمنية وأنظمة الإضاءة الذكية"],
    ["smart-bulbs-rgb", "لمبات RGB", "Smart RGB Bulbs", Lightbulb, "لمبات LED ذكية بإضاءة RGB قابلة للتحكم عبر التطبيقات والأمر الصوتي"],
    ["server-air-filters", "فلاتر هوائية للسيرفر", "Server Air Filters", Wind, "فلاتر هوائية لخوادم البيانات لمنع تراكم الغبار والحفاظ على التبريد"],
  ];

  // ── PC building / accessories
  const pcAcc: Array<[string, string, string, LucideIcon, string]> = [
    ["usb-hubs", "هابات USB", "USB Hubs", Cable, "هابات USB بمنافذ متعددة وسرعات USB 3.2 لتوسيع منافذ الكمبيوتر"],
    ["docking-stations", "داكينج ستيشن", "Docking Stations", MonitorSmartphone, "محطات إرساء USB-C / Thunderbolt لتوصيل شاشات وأجهزة متعددة بضربة واحدة"],
    ["usb-c-adapters", "محول USB-A → USB-C", "USB-A to USB-C Adapters", Cable, "محولات USB-A إلى USB-C لربط الإكسسوارات القديمة بالأجهزة الحديثة"],
    ["m2-expansion-cards", "توسعات M.2", "M.2 Expansion Cards", CircuitBoard, "كروت توسعة M.2 لإضافة هاردات NVMe إضافية للكمبيوترات المكتبية"],
    ["gpu-mounts", "حوامل GPU", "GPU Mounts", Box, "حوامل عمودية لكروت الشاشة Vertical GPU Mounts للعرض الأنيق"],
    ["rgb-fans", "مراوح RGB", "RGB Fans", Fan, "مراوح كيس RGB قابلة للتحكم في الإضاءة عبر اللوحة الأم"],
    ["rgb-strips", "ألواح RGB", "RGB LED Strips", Lightbulb, "شرائط LED RGB لإضاءة كيس الكمبيوتر والمكتب"],
    ["pc-cases", "كيس كمبيوتر", "PC Cases", Box, "كيسات كمبيوتر Mid Tower و Full Tower بتصاميم متنوعة وزجاج جانبي"],
    ["cable-management", "تنظيم كابلات", "Cable Management", Cable, "أدوات تنظيم كابلات الكمبيوتر داخل الكيس للحصول على شكل أنيق وتدفق هواء أفضل"],
    ["screen-filters", "فلاتر شاشة", "Screen Privacy Filters", Eye, "فلاتر خصوصية للشاشات لمنع المشاهدة الجانبية ومضادة للأشعة الزرقاء"],
    ["monitor-arms", "أرجل شاشة", "Monitor Arms", Box, "أرجل شاشة قابلة للتعديل لتوفير مساحة المكتب وتحسين الإرغونوميا"],
    ["monitor-rotating-stands", "قواعد دوارة شاشة", "Rotating Monitor Stands", Box, "قواعد دوارة 360 درجة للشاشات لتسهيل المشاركة في الاجتماعات"],
  ];

  // ── Maintenance / repair tools (small things)
  const maintenanceAcc: Array<[string, string, string, LucideIcon, string]> = [
    ["soldering-stations", "محطات لحام", "Soldering Stations", Wrench, "محطات لحام إلكتروني بدرجة حرارة قابلة للتحكم لإصلاح اللوحات الإلكترونية"],
    ["multimeters", "أفوميتر", "Multimeters", Gauge, "أفوميتر رقمي وتناظري لقياس الجهد والتيار والمقاومة"],
    ["microscopes", "مجاهر فحص", "Inspection Microscopes", Eye, "مجاهر فحص رقمية للوحات الأم والقطع الدقيقة"],
    ["heat-guns", "بسطار حراري", "Heat Guns", Wind, "بسطارات حرارية لفك وتركيب القطع السطحية SMD"],
    ["bga-stations", "ماكينات BGA", "BGA Rework Stations", CircuitBoard, "محطات BGA لإصلاح وريبول رقاقات الـ BGA في اللوحات الأم"],
    ["solder-wire", "سلك قصدير", "Solder Wire", Settings, "أسلاك قصدير عالية الجودة بنسب رصاص مختلفة لأعمال اللحام الإلكتروني"],
    ["isopropyl-alcohol", "كحول إيزوبروبيل", "Isopropyl Alcohol", Droplet, "كحول إيزوبروبيل 99% لتنظيف اللوحات الإلكترونية والقطع الحساسة"],
    ["data-recovery-services", "خدمات استرجاع بيانات", "Data Recovery", HardDrive, "خدمات استرجاع البيانات من الهاردات التالفة وكروت الذاكرة"],
    ["unlock-services", "خدمات فك شفرة", "Phone Unlock Services", Key, "خدمات فك شفرة الهواتف من الشبكات والحسابات بطرق رسمية ومعتمدة"],
    ["software-installation", "خدمات تثبيت سوفت وير", "Software Installation", Settings, "خدمات تثبيت أنظمة التشغيل، البرامج، وحلول الأمن للكمبيوترات"],
    ["screen-replacement", "تغيير شاشات", "Screen Replacement", Monitor, "خدمات تغيير شاشات اللابتوب والهواتف بقطع غيار أصلية ومعتمدة"],
    ["motherboard-repair", "صيانة لوحات أم", "Motherboard Repair", CircuitBoard, "إصلاح اللوحات الأم للكمبيوترات والهواتف على مستوى المكونات الدقيقة"],
  ];

  // ── Gaming accessories
  const gamingAcc: Array<[string, string, string, LucideIcon, string]> = [
    ["gaming-chairs", "كراسي جيمنج", "Gaming Chairs", Box, "كراسي جيمنج إرغونومية بدعم أسفل الظهر والرقبة لساعات اللعب الطويلة"],
    ["gaming-desks", "مكاتب جيمنج", "Gaming Desks", Box, "مكاتب جيمنج بإضاءة RGB ومنظمات كابلات وأماكن للهيدسيت والكاميرا"],
    ["mouse-pads-xl", "ماوس باد كبير", "XL Mouse Pads", Settings, "ماوس باد كبير الحجم بإضاءة RGB يغطي كامل المكتب للجيمنج التنافسي"],
    ["controller-grips", "جريبات تحكم", "Controller Grips", Joystick, "جريبات بديلة لـ DualSense و Xbox Controller للراحة والإمساك المحسن"],
    ["ps5-accessories", "إكسسوارات PS5", "PS5 Accessories", Gamepad2, "إكسسوارات أصلية لـ PlayStation 5 من حوامل، كفرات، شاحن أذرع، وقاعدة شحن"],
    ["xbox-accessories", "إكسسوارات Xbox", "Xbox Accessories", Gamepad2, "إكسسوارات أصلية لـ Xbox Series X/S من حوامل، أذرع تحكم بديلة، وبطاريات قابلة للشحن"],
    ["nintendo-accessories", "إكسسوارات Nintendo", "Nintendo Accessories", Gamepad2, "إكسسوارات Switch من حقائب، حوامل، أذرع Pro، وكفرات حماية"],
    ["vr-accessories", "إكسسوارات VR", "VR Accessories", Glasses, "إكسسوارات نظارات VR من حوامل، كفرات وجه، حبال أمان، وعدسات بديلة"],
    ["streaming-lights", "إضاءة بث", "Streaming Lights", Sun, "حلقات إضاءة LED ولوحات إضاءة احترافية للبث والتصوير"],
    ["green-screens", "Green Screen", "Green Screens", Box, "خلفيات Green Screen قابلة للطي للبث المباشر والمحتوى الرقمي"],
    ["capture-cards", "كروت كابتشر", "Capture Cards", Disc, "كروت كابتشر داخلية وخارجية لتسجيل وبث ألعاب الكونسول من Elgato و AVerMedia"],
    ["stream-decks", "Stream Deck", "Stream Decks", Settings, "أزرار Stream Deck القابلة للتخصيص للتحكم بالبث والمشاهد بسهولة"],
  ];

  // ── Printing supplies
  const printingAcc: Array<[string, string, string, LucideIcon, string]> = [
    ["ink-cartridges", "خراطيش حبر", "Ink Cartridges", Printer, "خراطيش حبر أصلية وبدائل عالية الجودة لطابعات HP و Canon و Epson و Brother"],
    ["toner-cartridges", "خراطيش تونر", "Toner Cartridges", Printer, "خراطيش تونر أصلية وبدائل لطابعات الليزر بكميات سعة عالية"],
    ["printer-paper-a4", "ورق A4", "A4 Paper", Box, "ورق طباعة A4 بكميات وأوزان مختلفة (70-100 جرام) للاستخدام المكتبي"],
    ["printer-paper-photo", "ورق صور", "Photo Paper", Box, "ورق طباعة صور لامع ومات بمختلف المقاسات للطباعة الاحترافية"],
    ["printer-paper-a3", "ورق A3", "A3 Paper", Box, "ورق طباعة A3 للمخططات والعروض الكبيرة"],
    ["3d-printer-filament", "خامات طابعة 3D", "3D Printer Filament", Box, "خامات طباعة ثلاثية الأبعاد PLA و ABS و PETG بألوان وقطر مختلف"],
    ["barcode-printers", "طابعات باركود", "Barcode Printers", Printer, "طابعات باركود حرارية للمتاجر والمستودعات بدقة عالية"],
    ["barcode-scanners", "ماسحات باركود", "Barcode Scanners", ScanLine, "ماسحات باركود سلكية ولاسلكية للمتاجر والمستودعات والصيدليات"],
    ["receipt-printers", "طابعات إيصالات", "Receipt Printers", Printer, "طابعات إيصالات حرارية لنقاط البيع POS بسرعة طباعة عالية"],
    ["plotters", "بلوتر", "Plotters", Printer, "ماكينات بلوتر للطباعة على مساحات كبيرة للمعماريين والمصممين"],
    ["scanner-flatbed", "سكانر مكتبي", "Flatbed Scanners", ScanLine, "ماسحات ضوئية مكتبية بدقة عالية للمستندات والصور"],
    ["copiers", "ماكينات تصوير", "Copiers", Printer, "ماكينات تصوير المستندات للمكاتب والمدارس والشركات"],
  ];

  const all = [
    ...laptopAcc.map(([slug, ar, en, Icon, ctx]) => ({
      slug, labelAr: ar, labelEn: en, Icon, parentCategory: CAT.computers, contextAr: ctx,
      keywords: [ar, en.toLowerCase()],
    })),
    ...phoneAcc.map(([slug, ar, en, Icon, ctx]) => ({
      slug, labelAr: ar, labelEn: en, Icon, parentCategory: CAT.phones, contextAr: ctx,
      keywords: [ar, en.toLowerCase()],
    })),
    ...networkAcc.map(([slug, ar, en, Icon, ctx]) => ({
      slug, labelAr: ar, labelEn: en, Icon, parentCategory: CAT.networking, contextAr: ctx,
      keywords: [ar, en.toLowerCase()],
    })),
    ...pcAcc.map(([slug, ar, en, Icon, ctx]) => ({
      slug, labelAr: ar, labelEn: en, Icon, parentCategory: CAT.computers, contextAr: ctx,
      keywords: [ar, en.toLowerCase()],
    })),
    ...maintenanceAcc.map(([slug, ar, en, Icon, ctx]) => ({
      slug, labelAr: ar, labelEn: en, Icon, parentCategory: CAT.maintenance, contextAr: ctx,
      keywords: [ar, en.toLowerCase()],
    })),
    ...gamingAcc.map(([slug, ar, en, Icon, ctx]) => ({
      slug, labelAr: ar, labelEn: en, Icon, parentCategory: CAT.gaming, contextAr: ctx,
      keywords: [ar, en.toLowerCase()],
    })),
    ...printingAcc.map(([slug, ar, en, Icon, ctx]) => ({
      slug, labelAr: ar, labelEn: en, Icon, parentCategory: CAT.printing, contextAr: ctx,
      keywords: [ar, en.toLowerCase()],
    })),
  ];

  list.push(...all);
  return list;
}

function generateAccessoryEntries(): DeviceEntry[] {
  const accs = buildAccessoryList();
  return accs.map((a) => {
    const intro = accessoryIntro({ itemAr: a.labelAr, contextAr: a.contextAr, slug: a.slug });
    const seoTitle = `${a.labelAr} في مول البستان — ${a.labelEn} بضمان`;
    const seoDescription = `اكتشف ${a.labelAr} (${a.labelEn}) في ${MALL_TAG_SHORT}. ${a.contextAr}. أسعار تنافسية وضمان فني.`;
    const seoKeywords = kw(a.labelAr, a.labelEn, ...a.keywords, "مول البستان", "التجمع الخامس");

    return makeEntry({
      slug: a.slug, labelAr: a.labelAr, labelEn: a.labelEn,
      Icon: a.Icon, parentCategory: a.parentCategory, orbit: "outer",
      productKeywords: a.keywords,
      seoTitle, seoDescription, seoKeywords,
      intro, relatedSlugs: [],
    });
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Volume booster — generate brand+useCase combos for laptops/smartphones
// to push the catalog past the 1000-page target with high-intent SEO pages.
// ────────────────────────────────────────────────────────────────────────────

function generateBrandUseCaseCombos(): DeviceEntry[] {
  const out: DeviceEntry[] = [];
  const combos: Array<{ baseSlug: string; baseLabelAr: string; Icon: LucideIcon; parentCategory: CategoryValue; brands: BrandInfo[]; useCases: string[]; }> = [
    { baseSlug: "laptops", baseLabelAr: "لابتوبات", Icon: Laptop, parentCategory: CAT.computers,
      brands: LAPTOP_BRANDS, useCases: ["gaming", "business", "students", "design", "programming", "video-editing"] },
    { baseSlug: "smartphones", baseLabelAr: "هواتف", Icon: Smartphone, parentCategory: CAT.phones,
      brands: PHONE_BRANDS, useCases: ["gaming", "business", "photo", "students"] },
    { baseSlug: "monitors", baseLabelAr: "شاشات", Icon: Monitor, parentCategory: CAT.computers,
      brands: MONITOR_BRANDS, useCases: ["gaming", "4k", "design", "office"] },
    { baseSlug: "printers", baseLabelAr: "طابعات", Icon: Printer, parentCategory: CAT.printing,
      brands: PRINTER_BRANDS, useCases: ["home", "office", "photo", "laser"] },
    { baseSlug: "tablets", baseLabelAr: "تابلت", Icon: Tablet, parentCategory: CAT.phones,
      brands: TABLET_BRANDS, useCases: ["students", "design", "business"] },
    { baseSlug: "headphones", baseLabelAr: "سماعات", Icon: Headphones, parentCategory: CAT.phones,
      brands: HEADPHONE_BRANDS, useCases: ["gaming", "office"] },
  ];

  for (const c of combos) {
    for (const b of c.brands) {
      for (const ucKey of c.useCases) {
        const uc = USE_CASES[ucKey];
        if (!uc) continue;
        const slug = `${c.baseSlug}-${b.key}-${ucKey}`;
        const labelAr = `${c.baseLabelAr} ${b.labelAr} ${uc.ar}`;
        const labelEn = `${b.labelEn} ${c.baseSlug} ${ucKey}`;
        const intro = `${brandIntro({
          baseLabelAr: c.baseLabelAr, brandLabelAr: b.labelAr, brandLabelEn: b.labelEn, series: b.series, slug,
        })} ${uc.descAr}.`;
        const seoTitle = `${labelAr} في مول البستان — أفضل ${b.labelEn} ${uc.ar}`;
        const seoDescription = `اكتشف ${labelAr} في القاهرة الجديدة بمول البستان. ${uc.descAr}. ضمان وكيل وأسعار تنافسية.`;
        const seoKeywords = kw(labelAr, b.labelEn, b.labelAr, c.baseLabelAr, uc.ar, "مول البستان", "التجمع الخامس");

        out.push(makeEntry({
          slug, labelAr, labelEn, Icon: c.Icon,
          parentCategory: c.parentCategory, orbit: "outer",
          productKeywords: [b.labelAr, b.labelEn.toLowerCase(), c.baseLabelAr, uc.ar],
          seoTitle, seoDescription, seoKeywords,
          intro,
          relatedSlugs: [c.baseSlug, `${c.baseSlug}-${b.key}`, `${c.baseSlug}-${ucKey}`],
          brand: b.labelEn, useCase: ucKey, baseSlug: c.baseSlug,
        }));
      }
    }
  }
  return out;
}

// ────────────────────────────────────────────────────────────────────────────
// Public: generate all variants
// ────────────────────────────────────────────────────────────────────────────

export function generateAllEntries(): DeviceEntry[] {
  return [
    ...generateBrandVariants(),
    ...generateUseCaseVariants(),
    ...generateSpecVariants(),
    ...generateAccessoryEntries(),
    ...generateBrandUseCaseCombos(),
  ];
}
