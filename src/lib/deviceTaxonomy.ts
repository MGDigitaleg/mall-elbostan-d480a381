/**
 * Device Taxonomy — مصدر بيانات موحَّد لـ 1000 صفحة فئة جهاز
 *
 * البنية الهرمية:
 *   Pillar (6) → Cluster (~60) → Long-tail (~934)
 *
 * كل entry يصلح لتغذية صفحة `<DevicePage />` الموحَّدة عبر
 * route ديناميكي واحد:
 *   /devices/:pillar/:cluster?/:longtail?
 */

import { CAT, type CategoryValue } from "./deviceCatalog";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type DeviceLevel = "pillar" | "cluster" | "longtail";

export interface DevicePillar {
  slug: string;
  labelAr: string;
  labelEn: string;
  parentCategory: CategoryValue;
  /** Primary copy for hero intro */
  shortIntro: string;
  /** Long intro for SEO body */
  longIntro: string;
  /** Default product keywords inherited by clusters */
  productKeywords: string[];
}

export interface DeviceCluster {
  slug: string;
  pillarSlug: string;
  labelAr: string;
  labelEn: string;
  /** Singular form for templated copy: "لابتوب" instead of "لابتوبات" */
  singularAr: string;
  productKeywords: string[];
  /** Optional spec modifiers specific to this cluster */
  specs?: { slug: string; labelAr: string }[];
  /** Optional sizes (e.g. screen sizes) */
  sizes?: { slug: string; labelAr: string }[];
}

export type ModifierKind = "brand" | "usecase" | "price" | "spec" | "size" | "geo";

export interface DeviceLongTail {
  slug: string;
  pillarSlug: string;
  clusterSlug: string;
  labelAr: string;
  labelEn?: string;
  modifierKind: ModifierKind;
  /** Inherited + modifier-specific keywords */
  productKeywords: string[];
}

export type ResolvedDevice =
  | { level: "pillar"; pillar: DevicePillar }
  | { level: "cluster"; pillar: DevicePillar; cluster: DeviceCluster }
  | { level: "longtail"; pillar: DevicePillar; cluster: DeviceCluster; longtail: DeviceLongTail };

// ─────────────────────────────────────────────────────────────
// Pillars (المستوى 1)
// ─────────────────────────────────────────────────────────────

export const pillars: DevicePillar[] = [
  {
    slug: "phones",
    labelAr: "الهواتف والإكسسوارات",
    labelEn: "Phones & Accessories",
    parentCategory: CAT.phones,
    shortIntro: "أكبر تجمّع لمحلات الهواتف الذكية والإكسسوارات في القاهرة الجديدة.",
    longIntro:
      "يضم مول البستان أكبر تجمّع متخصص في الهواتف والإكسسوارات في القاهرة الجديدة، حيث تجد أحدث الموديلات من العلامات التجارية الكبرى، إلى جانب ملحقات أصلية تشمل الشواحن والسماعات والكفرات وحماية الشاشات. تتميز محلات المول بضمان الوكيل الرسمي، وتنوع الفئات السعرية، وفِرق بيع متخصصة لمساعدتك في الاختيار.",
    productKeywords: ["هاتف", "موبايل", "phone", "smartphone"],
  },
  {
    slug: "computers",
    labelAr: "الكمبيوتر والأجهزة",
    labelEn: "Computers & Devices",
    parentCategory: CAT.computers,
    shortIntro: "لابتوبات وحواسيب مكتبية وشاشات وملحقات متكاملة في مكان واحد.",
    longIntro:
      "قسم الكمبيوتر والأجهزة في مول البستان وجهة متكاملة لمحترفي العمل والطلاب والمصممين. يضم لابتوبات الأعمال والإنتاجية، الحواسيب المكتبية، الشاشات الاحترافية، الكيبوردات والماوسات، وحدات التخزين والذاكرة، ومكوّنات تجميع الكمبيوتر، إلى جانب خدمات الترقية والصيانة المعتمدة.",
    productKeywords: ["لابتوب", "laptop", "كمبيوتر", "pc"],
  },
  {
    slug: "gaming",
    labelAr: "الألعاب والترفيه",
    labelEn: "Gaming & Entertainment",
    parentCategory: CAT.gaming,
    shortIntro: "كل ما يخص الجيمنج: أجهزة، إكسسوارات، شاشات، وأكسسوارات بث.",
    longIntro:
      "قسم الألعاب والترفيه في مول البستان منصّة متكاملة لعشّاق الجيمنج: لابتوبات وحواسيب جيمنج عالية الأداء، أجهزة كونسول، يداتت تحكم، سماعات احترافية، شاشات بمعدلات تحديث عالية، كراسي جيمنج، ومعدّات بث المحتوى. كل ذلك من علامات تجارية موثوقة بضمان معتمد.",
    productKeywords: ["gaming", "جيمنج", "كونسول", "playstation", "xbox"],
  },
  {
    slug: "networking",
    labelAr: "الشبكات والأنظمة الأمنية",
    labelEn: "Networking & Security",
    parentCategory: CAT.networking,
    shortIntro: "حلول شبكات وكاميرات مراقبة احترافية للمنازل والشركات.",
    longIntro:
      "قسم الشبكات والأنظمة الأمنية في مول البستان يقدّم حلولاً متكاملة للمنازل والمكاتب والشركات: راوترات، أنظمة Mesh، سويتشات، نقاط وصول، خوادم تخزين شبكية، كاميرات مراقبة، وأنظمة إنتركوم. مع فِرق دعم فني لتصميم وتركيب الشبكة المناسبة لاحتياجك.",
    productKeywords: ["router", "راوتر", "switch", "كاميرا مراقبة"],
  },
  {
    slug: "printing",
    labelAr: "الطباعة والتصوير",
    labelEn: "Printing & Imaging",
    parentCategory: CAT.printing,
    shortIntro: "طابعات منزلية ومكتبية، ماسحات، بروجكتورات، وكاميرات احترافية.",
    longIntro:
      "قسم الطباعة والتصوير في مول البستان يضم طابعات نفث الحبر والليزر متعددة الوظائف، طابعات ثلاثية الأبعاد، ماسحات ضوئية، بروجكتورات اجتماعات وعرض سينمائي، كاميرات تصوير وفيديو احترافية، ميكروفونات، وكاميرات ويب. حلول كاملة للأفراد والشركات.",
    productKeywords: ["طابعة", "printer", "كاميرا", "camera"],
  },
  {
    slug: "maintenance",
    labelAr: "الصيانة والدعم الفني",
    labelEn: "Maintenance & Support",
    parentCategory: CAT.maintenance,
    shortIntro: "صيانة معتمدة لكل الأجهزة وخدمات استرداد بيانات وترقية.",
    longIntro:
      "قسم الصيانة والدعم الفني في مول البستان يقدّم خدمات إصلاح الشاشات، استبدال البطاريات، استرداد البيانات، تثبيت البرمجيات، إزالة الفيروسات، الترقيات الفنية، التنظيف العميق، وخدمات الضمان. كل ذلك على يد فنيين معتمدين بضمان عمل مكتوب.",
    productKeywords: ["صيانة", "إصلاح", "repair"],
  },
];

// ─────────────────────────────────────────────────────────────
// Clusters (المستوى 2) — ~60 entry
// ─────────────────────────────────────────────────────────────

export const clusters: DeviceCluster[] = [
  // phones (10)
  { slug: "smartphones", pillarSlug: "phones", labelAr: "هواتف ذكية", labelEn: "Smartphones", singularAr: "هاتف ذكي", productKeywords: ["هاتف", "موبايل", "smartphone", "iphone", "galaxy", "redmi", "honor"] },
  { slug: "feature-phones", pillarSlug: "phones", labelAr: "هواتف عادية", labelEn: "Feature Phones", singularAr: "هاتف عادي", productKeywords: ["nokia", "feature phone", "هاتف عادي"] },
  { slug: "tablets", pillarSlug: "phones", labelAr: "تابلت", labelEn: "Tablets", singularAr: "تابلت", productKeywords: ["تابلت", "ipad", "galaxy tab", "tablet"] },
  { slug: "smartwatches", pillarSlug: "phones", labelAr: "ساعات ذكية", labelEn: "Smartwatches", singularAr: "ساعة ذكية", productKeywords: ["ساعة ذكية", "smartwatch", "apple watch", "galaxy watch"] },
  { slug: "earbuds", pillarSlug: "phones", labelAr: "سماعات لاسلكية", labelEn: "Earbuds", singularAr: "سماعة لاسلكية", productKeywords: ["earbuds", "airpods", "سماعة لاسلكية", "tws"] },
  { slug: "headphones", pillarSlug: "phones", labelAr: "سماعات رأس", labelEn: "Headphones", singularAr: "سماعة رأس", productKeywords: ["سماعة", "headphone", "headset"] },
  { slug: "phone-cases", pillarSlug: "phones", labelAr: "كفرات هواتف", labelEn: "Phone Cases", singularAr: "كفر هاتف", productKeywords: ["كفر", "case", "cover"] },
  { slug: "screen-protectors", pillarSlug: "phones", labelAr: "حمايات شاشة", labelEn: "Screen Protectors", singularAr: "حماية شاشة", productKeywords: ["حماية شاشة", "screen protector", "tempered"] },
  { slug: "chargers", pillarSlug: "phones", labelAr: "شواحن", labelEn: "Chargers", singularAr: "شاحن", productKeywords: ["شاحن", "charger", "كابل", "cable"] },
  { slug: "powerbanks", pillarSlug: "phones", labelAr: "باور بانك", labelEn: "Powerbanks", singularAr: "باور بانك", productKeywords: ["باور بانك", "powerbank", "battery pack"] },

  // computers (12)
  { slug: "laptops", pillarSlug: "computers", labelAr: "لابتوبات", labelEn: "Laptops", singularAr: "لابتوب", productKeywords: ["لابتوب", "laptop", "notebook", "vivobook", "ideapad", "victus"] },
  { slug: "macbook", pillarSlug: "computers", labelAr: "ماك بوك", labelEn: "MacBook", singularAr: "ماك بوك", productKeywords: ["macbook", "ماك بوك", "apple"] },
  { slug: "desktops", pillarSlug: "computers", labelAr: "حواسيب مكتبية", labelEn: "Desktops", singularAr: "حاسوب مكتبي", productKeywords: ["desktop", "حاسوب مكتبي", "tower"] },
  { slug: "all-in-one", pillarSlug: "computers", labelAr: "حواسيب All-in-One", labelEn: "All-in-One", singularAr: "حاسوب All-in-One", productKeywords: ["all-in-one", "aio", "imac"] },
  { slug: "monitors", pillarSlug: "computers", labelAr: "شاشات", labelEn: "Monitors", singularAr: "شاشة", productKeywords: ["شاشة", "monitor", "display", "4k", "144hz"] },
  { slug: "keyboards", pillarSlug: "computers", labelAr: "كيبوردات", labelEn: "Keyboards", singularAr: "كيبورد", productKeywords: ["كيبورد", "keyboard", "mechanical"] },
  { slug: "mice", pillarSlug: "computers", labelAr: "ماوسات", labelEn: "Mice", singularAr: "ماوس", productKeywords: ["ماوس", "mouse"] },
  { slug: "ram", pillarSlug: "computers", labelAr: "ذواكر RAM", labelEn: "RAM", singularAr: "وحدة RAM", productKeywords: ["ram", "ذاكرة", "ddr4", "ddr5"] },
  { slug: "storage", pillarSlug: "computers", labelAr: "وحدات تخزين", labelEn: "Storage", singularAr: "وحدة تخزين", productKeywords: ["ssd", "hdd", "تخزين", "nvme"] },
  { slug: "cooling", pillarSlug: "computers", labelAr: "تبريد", labelEn: "Cooling", singularAr: "نظام تبريد", productKeywords: ["تبريد", "cooler", "fan", "aio cooler"] },
  { slug: "pc-components", pillarSlug: "computers", labelAr: "مكونات PC", labelEn: "PC Components", singularAr: "مكون PC", productKeywords: ["motherboard", "cpu", "psu", "case"] },
  { slug: "graphics-cards", pillarSlug: "computers", labelAr: "كروت شاشة", labelEn: "Graphics Cards", singularAr: "كرت شاشة", productKeywords: ["gpu", "rtx", "rx", "كرت شاشة"] },

  // gaming (10)
  { slug: "gaming-laptops", pillarSlug: "gaming", labelAr: "لابتوبات جيمنج", labelEn: "Gaming Laptops", singularAr: "لابتوب جيمنج", productKeywords: ["gaming laptop", "rog", "predator", "nitro", "victus"] },
  { slug: "gaming-desktops", pillarSlug: "gaming", labelAr: "حواسيب جيمنج", labelEn: "Gaming Desktops", singularAr: "حاسوب جيمنج", productKeywords: ["gaming pc", "tower", "rgb"] },
  { slug: "gaming-consoles", pillarSlug: "gaming", labelAr: "أجهزة كونسول", labelEn: "Consoles", singularAr: "كونسول", productKeywords: ["playstation", "ps5", "xbox", "nintendo", "كونسول"] },
  { slug: "controllers", pillarSlug: "gaming", labelAr: "يدات تحكم", labelEn: "Controllers", singularAr: "يد تحكم", productKeywords: ["controller", "gamepad", "dualsense"] },
  { slug: "gaming-headsets", pillarSlug: "gaming", labelAr: "سماعات جيمنج", labelEn: "Gaming Headsets", singularAr: "سماعة جيمنج", productKeywords: ["gaming headset", "هايبر اكس", "razer"] },
  { slug: "gaming-monitors", pillarSlug: "gaming", labelAr: "شاشات جيمنج", labelEn: "Gaming Monitors", singularAr: "شاشة جيمنج", productKeywords: ["gaming monitor", "144hz", "240hz", "1ms"] },
  { slug: "gaming-chairs", pillarSlug: "gaming", labelAr: "كراسي جيمنج", labelEn: "Gaming Chairs", singularAr: "كرسي جيمنج", productKeywords: ["gaming chair", "كرسي جيمنج"] },
  { slug: "vr-gaming", pillarSlug: "gaming", labelAr: "VR للألعاب", labelEn: "VR Gaming", singularAr: "نظارة VR", productKeywords: ["vr", "oculus", "quest", "نظارة واقع"] },
  { slug: "streaming-gear", pillarSlug: "gaming", labelAr: "معدات بث", labelEn: "Streaming Gear", singularAr: "معدة بث", productKeywords: ["stream", "elgato", "بث"] },
  { slug: "arcade", pillarSlug: "gaming", labelAr: "أركيد", labelEn: "Arcade", singularAr: "جهاز أركيد", productKeywords: ["arcade", "joystick", "أركيد"] },

  // networking (8)
  { slug: "routers", pillarSlug: "networking", labelAr: "راوترات", labelEn: "Routers", singularAr: "راوتر", productKeywords: ["router", "راوتر", "wifi 6"] },
  { slug: "mesh-systems", pillarSlug: "networking", labelAr: "أنظمة Mesh", labelEn: "Mesh Systems", singularAr: "نظام Mesh", productKeywords: ["mesh", "deco", "eero"] },
  { slug: "switches", pillarSlug: "networking", labelAr: "سويتشات", labelEn: "Switches", singularAr: "سويتش", productKeywords: ["switch", "سويتش", "poe"] },
  { slug: "access-points", pillarSlug: "networking", labelAr: "نقاط وصول", labelEn: "Access Points", singularAr: "نقطة وصول", productKeywords: ["access point", "ap", "ubiquiti"] },
  { slug: "nas", pillarSlug: "networking", labelAr: "خوادم تخزين NAS", labelEn: "NAS", singularAr: "جهاز NAS", productKeywords: ["nas", "synology", "qnap"] },
  { slug: "servers", pillarSlug: "networking", labelAr: "سيرفرات", labelEn: "Servers", singularAr: "سيرفر", productKeywords: ["server", "سيرفر", "rack"] },
  { slug: "security-cameras", pillarSlug: "networking", labelAr: "كاميرات مراقبة", labelEn: "Security Cameras", singularAr: "كاميرا مراقبة", productKeywords: ["كاميرا مراقبة", "cctv", "hikvision", "dahua"] },
  { slug: "intercoms", pillarSlug: "networking", labelAr: "إنتركوم", labelEn: "Intercoms", singularAr: "إنتركوم", productKeywords: ["intercom", "إنتركوم", "doorbell"] },

  // printing (10)
  { slug: "inkjet-printers", pillarSlug: "printing", labelAr: "طابعات نفث الحبر", labelEn: "Inkjet Printers", singularAr: "طابعة نفث حبر", productKeywords: ["inkjet", "طابعة حبر", "ecotank"] },
  { slug: "laser-printers", pillarSlug: "printing", labelAr: "طابعات ليزر", labelEn: "Laser Printers", singularAr: "طابعة ليزر", productKeywords: ["laser printer", "طابعة ليزر"] },
  { slug: "all-in-one-printers", pillarSlug: "printing", labelAr: "طابعات متعددة الوظائف", labelEn: "All-in-One Printers", singularAr: "طابعة متعددة", productKeywords: ["all-in-one printer", "طابعة متعددة"] },
  { slug: "3d-printers", pillarSlug: "printing", labelAr: "طابعات 3D", labelEn: "3D Printers", singularAr: "طابعة 3D", productKeywords: ["3d printer", "طابعة ثلاثية", "creality"] },
  { slug: "scanners", pillarSlug: "printing", labelAr: "ماسحات ضوئية", labelEn: "Scanners", singularAr: "ماسحة ضوئية", productKeywords: ["scanner", "ماسحة"] },
  { slug: "projectors", pillarSlug: "printing", labelAr: "بروجكتورات", labelEn: "Projectors", singularAr: "بروجكتور", productKeywords: ["projector", "بروجكتور", "epson"] },
  { slug: "cameras", pillarSlug: "printing", labelAr: "كاميرات احترافية", labelEn: "Cameras", singularAr: "كاميرا", productKeywords: ["camera", "كاميرا", "canon", "sony", "nikon"] },
  { slug: "webcams", pillarSlug: "printing", labelAr: "كاميرات ويب", labelEn: "Webcams", singularAr: "كاميرا ويب", productKeywords: ["webcam", "كاميرا ويب", "logitech"] },
  { slug: "microphones", pillarSlug: "printing", labelAr: "ميكروفونات", labelEn: "Microphones", singularAr: "ميكروفون", productKeywords: ["microphone", "ميكروفون", "shure"] },
  { slug: "plotters", pillarSlug: "printing", labelAr: "بلوترات", labelEn: "Plotters", singularAr: "بلوتر", productKeywords: ["plotter", "بلوتر"] },

  // maintenance (10)
  { slug: "screen-repair", pillarSlug: "maintenance", labelAr: "إصلاح الشاشات", labelEn: "Screen Repair", singularAr: "خدمة إصلاح شاشة", productKeywords: ["إصلاح شاشة"] },
  { slug: "battery-replacement", pillarSlug: "maintenance", labelAr: "استبدال البطاريات", labelEn: "Battery Replacement", singularAr: "خدمة استبدال بطارية", productKeywords: ["بطارية"] },
  { slug: "data-recovery", pillarSlug: "maintenance", labelAr: "استرداد البيانات", labelEn: "Data Recovery", singularAr: "خدمة استرداد بيانات", productKeywords: ["data recovery", "استرداد بيانات"] },
  { slug: "software-installation", pillarSlug: "maintenance", labelAr: "تثبيت البرمجيات", labelEn: "Software Installation", singularAr: "خدمة تثبيت برمجيات", productKeywords: ["software", "windows"] },
  { slug: "virus-removal", pillarSlug: "maintenance", labelAr: "إزالة الفيروسات", labelEn: "Virus Removal", singularAr: "خدمة إزالة فيروسات", productKeywords: ["virus", "antivirus"] },
  { slug: "upgrades", pillarSlug: "maintenance", labelAr: "ترقيات الأجهزة", labelEn: "Upgrades", singularAr: "خدمة ترقية", productKeywords: ["upgrade", "ترقية"] },
  { slug: "cleaning", pillarSlug: "maintenance", labelAr: "تنظيف الأجهزة", labelEn: "Device Cleaning", singularAr: "خدمة تنظيف", productKeywords: ["cleaning", "تنظيف"] },
  { slug: "warranty-service", pillarSlug: "maintenance", labelAr: "خدمة الضمان", labelEn: "Warranty Service", singularAr: "خدمة ضمان", productKeywords: ["warranty", "ضمان"] },
  { slug: "diagnostics", pillarSlug: "maintenance", labelAr: "تشخيص الأعطال", labelEn: "Diagnostics", singularAr: "خدمة تشخيص", productKeywords: ["diagnostics", "تشخيص"] },
  { slug: "pickup-delivery", pillarSlug: "maintenance", labelAr: "استلام وتوصيل", labelEn: "Pickup & Delivery", singularAr: "خدمة استلام", productKeywords: ["pickup", "delivery"] },
];

// ─────────────────────────────────────────────────────────────
// Modifier libraries (used by long-tail generators)
// ─────────────────────────────────────────────────────────────

export const brands = [
  { slug: "apple", labelAr: "Apple" },
  { slug: "samsung", labelAr: "Samsung" },
  { slug: "asus", labelAr: "Asus" },
  { slug: "dell", labelAr: "Dell" },
  { slug: "hp", labelAr: "HP" },
  { slug: "lenovo", labelAr: "Lenovo" },
  { slug: "msi", labelAr: "MSI" },
  { slug: "acer", labelAr: "Acer" },
  { slug: "xiaomi", labelAr: "Xiaomi" },
  { slug: "huawei", labelAr: "Huawei" },
  { slug: "oppo", labelAr: "Oppo" },
  { slug: "realme", labelAr: "Realme" },
  { slug: "lg", labelAr: "LG" },
  { slug: "sony", labelAr: "Sony" },
  { slug: "microsoft", labelAr: "Microsoft" },
  { slug: "razer", labelAr: "Razer" },
  { slug: "logitech", labelAr: "Logitech" },
  { slug: "jbl", labelAr: "JBL" },
  { slug: "anker", labelAr: "Anker" },
  { slug: "canon", labelAr: "Canon" },
  { slug: "epson", labelAr: "Epson" },
  { slug: "brother", labelAr: "Brother" },
];

export const useCases = [
  { slug: "for-students", labelAr: "للطلاب" },
  { slug: "for-business", labelAr: "للأعمال" },
  { slug: "for-gaming", labelAr: "للجيمنج" },
  { slug: "for-design", labelAr: "للتصميم" },
  { slug: "for-travel", labelAr: "للسفر" },
  { slug: "for-home", labelAr: "للمنزل" },
  { slug: "for-companies", labelAr: "للشركات" },
  { slug: "for-editing", labelAr: "للمونتاج" },
  { slug: "for-programming", labelAr: "للبرمجة" },
  { slug: "for-engineering", labelAr: "للهندسة" },
];

export const priceTiers = [
  { slug: "under-10000-egp", labelAr: "تحت 10,000 جنيه", upperBound: 10000 },
  { slug: "under-25000-egp", labelAr: "تحت 25,000 جنيه", upperBound: 25000 },
  { slug: "under-60000-egp", labelAr: "تحت 60,000 جنيه", upperBound: 60000 },
  { slug: "premium", labelAr: "بريميوم", upperBound: Infinity },
];

export const geoModifiers = [
  { slug: "new-cairo", labelAr: "في القاهرة الجديدة" },
  { slug: "downtown", labelAr: "في وسط البلد" },
];

// ─────────────────────────────────────────────────────────────
// Long-tail generator
// ─────────────────────────────────────────────────────────────

/**
 * Generates the full long-tail set on demand. We don't materialize 1000 entries
 * on import — we resolve them lazily when a route is hit, and only enumerate
 * them for sitemap generation.
 */
function generateLongTailForCluster(cluster: DeviceCluster): DeviceLongTail[] {
  const out: DeviceLongTail[] = [];

  // brands
  for (const b of brands) {
    out.push({
      slug: b.slug,
      pillarSlug: cluster.pillarSlug,
      clusterSlug: cluster.slug,
      labelAr: `${cluster.labelAr} ${b.labelAr}`,
      modifierKind: "brand",
      productKeywords: [...cluster.productKeywords, b.labelAr.toLowerCase()],
    });
  }

  // use-cases
  for (const u of useCases) {
    out.push({
      slug: u.slug,
      pillarSlug: cluster.pillarSlug,
      clusterSlug: cluster.slug,
      labelAr: `${cluster.labelAr} ${u.labelAr}`,
      modifierKind: "usecase",
      productKeywords: cluster.productKeywords,
    });
  }

  // price tiers
  for (const p of priceTiers) {
    out.push({
      slug: p.slug,
      pillarSlug: cluster.pillarSlug,
      clusterSlug: cluster.slug,
      labelAr: `${cluster.labelAr} ${p.labelAr}`,
      modifierKind: "price",
      productKeywords: cluster.productKeywords,
    });
  }

  // specs (cluster-specific, optional)
  for (const s of cluster.specs ?? []) {
    out.push({
      slug: s.slug,
      pillarSlug: cluster.pillarSlug,
      clusterSlug: cluster.slug,
      labelAr: `${cluster.labelAr} ${s.labelAr}`,
      modifierKind: "spec",
      productKeywords: [...cluster.productKeywords, s.labelAr.toLowerCase()],
    });
  }

  // sizes
  for (const sz of cluster.sizes ?? []) {
    out.push({
      slug: sz.slug,
      pillarSlug: cluster.pillarSlug,
      clusterSlug: cluster.slug,
      labelAr: `${cluster.labelAr} ${sz.labelAr}`,
      modifierKind: "size",
      productKeywords: [...cluster.productKeywords, sz.labelAr.toLowerCase()],
    });
  }

  // geo
  for (const g of geoModifiers) {
    out.push({
      slug: g.slug,
      pillarSlug: cluster.pillarSlug,
      clusterSlug: cluster.slug,
      labelAr: `${cluster.labelAr} ${g.labelAr}`,
      modifierKind: "geo",
      productKeywords: cluster.productKeywords,
    });
  }

  return out;
}

// ─────────────────────────────────────────────────────────────
// Lookups
// ─────────────────────────────────────────────────────────────

export function getPillar(slug: string): DevicePillar | undefined {
  return pillars.find((p) => p.slug === slug);
}

export function getCluster(pillarSlug: string, clusterSlug: string): DeviceCluster | undefined {
  return clusters.find((c) => c.pillarSlug === pillarSlug && c.slug === clusterSlug);
}

export function getClustersForPillar(pillarSlug: string): DeviceCluster[] {
  return clusters.filter((c) => c.pillarSlug === pillarSlug);
}

export function getLongTail(
  pillarSlug: string,
  clusterSlug: string,
  longtailSlug: string,
): DeviceLongTail | undefined {
  const cluster = getCluster(pillarSlug, clusterSlug);
  if (!cluster) return undefined;
  return generateLongTailForCluster(cluster).find((lt) => lt.slug === longtailSlug);
}

export function getLongTailSiblings(pillarSlug: string, clusterSlug: string): DeviceLongTail[] {
  const cluster = getCluster(pillarSlug, clusterSlug);
  if (!cluster) return [];
  return generateLongTailForCluster(cluster);
}

export function resolveDevicePath(
  pillarSlug?: string,
  clusterSlug?: string,
  longtailSlug?: string,
): ResolvedDevice | null {
  if (!pillarSlug) return null;
  const pillar = getPillar(pillarSlug);
  if (!pillar) return null;
  if (!clusterSlug) return { level: "pillar", pillar };
  const cluster = getCluster(pillarSlug, clusterSlug);
  if (!cluster) return null;
  if (!longtailSlug) return { level: "cluster", pillar, cluster };
  const longtail = getLongTail(pillarSlug, clusterSlug, longtailSlug);
  if (!longtail) return null;
  return { level: "longtail", pillar, cluster, longtail };
}

/** Used by sitemap generator — enumerates all 1000 routes. */
export function enumerateAllRoutes(): string[] {
  const routes: string[] = [];
  for (const p of pillars) routes.push(`/devices/${p.slug}`);
  for (const c of clusters) routes.push(`/devices/${c.pillarSlug}/${c.slug}`);
  for (const c of clusters) {
    for (const lt of generateLongTailForCluster(c)) {
      routes.push(`/devices/${c.pillarSlug}/${c.slug}/${lt.slug}`);
    }
  }
  return routes;
}
