import {
  Laptop, Smartphone, Monitor, Cpu, Headphones, Keyboard,
  HardDrive, Mouse, Camera, Gamepad2, Printer, Router,
  Tablet, Watch, Speaker, MemoryStick, Webcam, Cable, Zap, Wifi, Wrench,
  Tv, Projector, Server, Disc, Joystick, Mic, BatteryCharging, ScanLine,
  MonitorSmartphone, HardDriveDownload, Radio, Lightbulb, ShieldCheck,
  CircuitBoard, Fan, PlugZap,
  type LucideIcon,
} from "lucide-react";

/** Mall-wide store categories (must match `stores.category` Arabic values). */
export const CAT = {
  phones: "الهواتف والإكسسوارات",
  computers: "الكمبيوتر والأجهزة",
  gaming: "الألعاب والترفيه",
  networking: "الشبكات والأنظمة الأمنية",
  printing: "الطباعة والتصوير",
  maintenance: "الصيانة والدعم الفني",
} as const;

export type CategoryValue = typeof CAT[keyof typeof CAT];
export type Orbit = "inner" | "middle" | "outer";

export interface DeviceFAQ { q: string; a: string; }

export interface DeviceEntry {
  slug: string;
  labelAr: string;
  labelEn: string;
  Icon: LucideIcon;
  parentCategory: CategoryValue;
  orbit: Orbit;
  /** Keywords used to match products by name/brand for the related products section */
  productKeywords: string[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  /** Long-form intro paragraph (Fusha) — 200–280 words target */
  intro: string;
  faq: DeviceFAQ[];
  /** Slugs of related device pages for internal linking */
  relatedSlugs: string[];
}

const mallTag = "في مول البستان — التجمع الخامس، القاهرة الجديدة";

export const deviceCatalog: Record<string, DeviceEntry> = {
  laptops: {
    slug: "laptops",
    labelAr: "لابتوبات",
    labelEn: "Laptops",
    Icon: Laptop,
    parentCategory: CAT.computers,
    orbit: "inner",
    productKeywords: ["لابتوب", "laptop", "macbook", "notebook", "ديل", "اسوس", "xps", "vivobook", "ideapad", "victus", "اتش بي"],
    seo: {
      title: "لابتوبات في مول البستان — أحدث موديلات اللابتوب",
      description: "اكتشف أكبر تجمّع لمحلات اللابتوبات في القاهرة الجديدة: لابتوبات أعمال، جيمنج، طلاب، وشركات بأفضل الأسعار وضمان معتمد في مول البستان بالتجمع الخامس.",
      keywords: "لابتوب, لابتوبات, laptop, macbook, لابتوب جيمنج, لابتوب أعمال, مول البستان, التجمع الخامس",
    },
    intro:
      "يضم مول البستان أكبر تجمّع متخصص في اللابتوبات في القاهرة الجديدة، حيث تجد محلات معتمدة تعرض أحدث موديلات لابتوبات الأعمال والإنتاجية، ولابتوبات الجيمنج عالية الأداء، ولابتوبات الطلاب الاقتصادية، وأجهزة الـ MacBook الأصلية. تتميز محلات اللابتوبات في المول بتنوع العلامات التجارية الكبرى وتوفر الموديلات الجديدة فور إطلاقها، مع خيارات تمويل وضمان معتمد من الوكيل. يستطيع الزائر مقارنة المواصفات والأسعار والتجربة المباشرة قبل الشراء، إلى جانب الحصول على نصائح متخصصة من فرق البيع. كما تتوفر خدمات الصيانة وترقية الذاكرة والتخزين، وملحقات اللابتوب من شواحن وحقائب وستاندات وقواعد تبريد، كل ذلك في مكان واحد.",
    faq: [
      { q: "ما أنواع اللابتوبات المتوفرة في مول البستان؟", a: "تتوفر لابتوبات أعمال، لابتوبات جيمنج، لابتوبات طلاب وأجهزة MacBook، بمختلف الفئات السعرية ومن أبرز العلامات التجارية." },
      { q: "هل يوجد ضمان وكيل على اللابتوبات؟", a: "نعم، تلتزم محلات المول ببيع لابتوبات أصلية بضمان معتمد من الوكيل الرسمي، مع توضيح مدة الضمان قبل الشراء." },
      { q: "هل يمكنني مقارنة الأسعار في أكثر من محل؟", a: "بالتأكيد، تعدد المحلات المتخصصة في المول يتيح للزائر مقارنة المواصفات والأسعار في زيارة واحدة." },
      { q: "هل تتوفر خدمات صيانة وترقية اللابتوبات؟", a: "نعم، تضم المنظومة محلات صيانة معتمدة لترقية الذاكرة والتخزين وإصلاح الأعطال البرمجية والمادية." },
    ],
    relatedSlugs: ["monitors", "keyboards", "ram", "storage", "laptops", "macbook"],
  },

  smartphones: {
    slug: "smartphones",
    labelAr: "هواتف ذكية",
    labelEn: "Smartphones",
    Icon: Smartphone,
    parentCategory: CAT.phones,
    orbit: "inner",
    productKeywords: ["موبايل", "هاتف", "phone", "iphone", "آيفون", "samsung", "سامسونج", "جالاكسي", "galaxy s", "galaxy z", "xiaomi", "شاومي", "redmi", "pixel", "oppo"],
    seo: {
      title: "هواتف ذكية في مول البستان — موبايلات أصلية بضمان",
      description: "تشكيلة واسعة من الهواتف الذكية الأصلية في مول البستان: iPhone و Samsung و Xiaomi و Oppo و Huawei بضمان معتمد وأسعار تنافسية في التجمع الخامس.",
      keywords: "موبايل, هواتف ذكية, iphone, samsung, xiaomi, oppo, huawei, مول البستان",
    },
    intro:
      "تقدم محلات الهواتف الذكية في مول البستان أكبر تشكيلة من الموبايلات الأصلية في القاهرة الجديدة، شاملةً أحدث إصدارات iPhone و Samsung Galaxy و Xiaomi و Oppo و Huawei و realme. يحرص المول على ضمان أصالة الأجهزة عبر محلات معتمدة تعتمد بضمان الوكيل الرسمي، مع شرح وافٍ للفروق بين الموديلات والمواصفات. يتميز المول بسرعة وصول الإصدارات الجديدة بعد إطلاقها عالمياً، كما تتوفر خيارات الموبايلات المستعملة المفحوصة بحالة ممتازة. إلى جانب الأجهزة، تجد قسماً غنياً بإكسسوارات الموبايل الأصلية من جرابات وشواحن وسماعات لاسلكية وستاندات شحن، مما يجعل المول الوجهة المتكاملة لكل ما يخص الموبايل في مكان واحد.",
    faq: [
      { q: "هل الموبايلات في مول البستان أصلية؟", a: "جميع المحلات المعتمدة بالمول تبيع موبايلات أصلية بضمان الوكيل، مع إمكانية التحقق من السيريال والباركود." },
      { q: "هل تتوفر هواتف مستعملة بحالة ممتازة؟", a: "نعم، عدد من المحلات يقدم موبايلات مستعملة مفحوصة فنياً وبضمان فحص قصير المدى." },
      { q: "متى تصل الإصدارات الجديدة إلى المول؟", a: "عادةً تصل الإصدارات الكبرى مثل iPhone و Galaxy خلال أيام من الإطلاق الرسمي." },
      { q: "هل يوجد إكسسوارات أصلية للموبايل؟", a: "نعم، يضم المول محلات إكسسوارات تقدم سماعات وشواحن وجرابات أصلية وحماية شاشة معتمدة." },
    ],
    relatedSlugs: ["smartwatches", "headphones", "tablets", "chargers", "powerbanks", "earbuds"],
  },

  monitors: {
    slug: "monitors",
    labelAr: "شاشات",
    labelEn: "Monitors",
    Icon: Monitor,
    parentCategory: CAT.computers,
    orbit: "inner",
    productKeywords: ["شاشة", "monitor", "display", "4k", "ips"],
    seo: {
      title: "شاشات كمبيوتر في مول البستان — شاشات احترافية وجيمنج",
      description: "شاشات IPS و OLED ودقة 4K للجيمنج والأعمال والتصميم في مول البستان، التجمع الخامس. أحجام من 24″ حتى 49″ وضمان معتمد.",
      keywords: "شاشات, شاشة كمبيوتر, شاشة جيمنج, monitor, 4k, ips, oled, مول البستان",
    },
    intro:
      "توفر محلات الشاشات في مول البستان مجموعة شاملة من الشاشات للأعمال والتصميم والجيمنج، بأحجام متنوعة من 24 حتى 49 بوصة. تشمل التشكيلة شاشات IPS وVA ولوحات OLED بمعدلات تحديث تصل إلى 240Hz وزمن استجابة منخفض يناسب الألعاب التنافسية، إلى جانب شاشات بدقة 4K و5K لمحرري الفيديو والمصممين. تتعاون المحلات مع علامات تجارية كبرى مثل LG و Samsung و ASUS و Dell و MSI و BenQ، مع تقديم نصائح فنية حول معايرة الألوان وزوايا الرؤية وتوصيلات HDMI و DisplayPort و USB-C. كما تتوفر شاشات منحنية فائقة العرض وشاشات بورتابل احترافية تناسب بيئات العمل المتعددة.",
    faq: [
      { q: "ما هي أفضل شاشة للجيمنج؟", a: "للجيمنج التنافسي يُنصح بشاشة بمعدل تحديث 144Hz فأعلى وزمن استجابة 1ms، مع لوحة IPS أو OLED حسب الميزانية." },
      { q: "هل تتوفر شاشات 4K بأسعار اقتصادية؟", a: "نعم، توجد شاشات 4K بأسعار تبدأ من فئة الأعمال للمستخدم العادي وحتى الفئات الاحترافية للتصميم." },
      { q: "هل يمكن توصيل شاشة بلابتوب MacBook؟", a: "نعم، تدعم الشاشات الحديثة منفذ USB-C/Thunderbolt المتوافق مع أجهزة MacBook." },
    ],
    relatedSlugs: ["laptops", "cpus", "keyboards", "mice"],
  },

  cpus: {
    slug: "cpus",
    labelAr: "معالجات",
    labelEn: "Processors / CPUs",
    Icon: Cpu,
    parentCategory: CAT.computers,
    orbit: "inner",
    productKeywords: ["معالج", "cpu", "intel", "amd", "ryzen", "core i"],
    seo: {
      title: "معالجات Intel و AMD في مول البستان — أحدث المعالجات",
      description: "معالجات Intel Core و AMD Ryzen بمختلف الأجيال والفئات السعرية في مول البستان، التجمع الخامس. أصلية بضمان الوكيل لتجميع الكمبيوتر.",
      keywords: "معالج, cpu, intel, amd, ryzen, core i9, مول البستان, تجميع كمبيوتر",
    },
    intro:
      "تجد في مول البستان متخصصين في معالجات الكمبيوتر بأحدث أجيال Intel Core و AMD Ryzen، بدءاً من معالجات الفئة الاقتصادية المناسبة لأعمال المكتب والمتصفح، وحتى معالجات الفئة العليا للجيمنج المتقدم وتحرير الفيديو والـ 3D Rendering. تقدم المحلات استشارات فنية لاختيار المعالج الأنسب وفق نوع الاستخدام واللوحة الأم المتوافقة معه (LGA1700, AM5 ...)، مع توضيح فروق عدد الأنوية وسرعات الـ Boost والذاكرة المؤقتة. كما توفر خدمات تجميع الكمبيوتر بالكامل، بما في ذلك معجون التبريد وحلول التبريد المائي والهوائي المناسبة لكل معالج.",
    faq: [
      { q: "أيهما أفضل Intel أم AMD للجيمنج؟", a: "كلاهما يقدم أداءً ممتازاً للجيمنج؛ يعتمد القرار على الميزانية واللوحة الأم وكارت الشاشة المختار." },
      { q: "هل يقدم المول خدمة تجميع كمبيوتر؟", a: "نعم، توجد محلات متخصصة في تجميع الأجهزة المكتبية وفق متطلبات العميل بكامل المكونات." },
      { q: "كيف أعرف أن المعالج متوافق مع اللوحة الأم؟", a: "يحدد ذلك نوع السوكِت والـ Chipset؛ يقدم فنيو المحلات الإرشاد المناسب أثناء الشراء." },
    ],
    relatedSlugs: ["cpus", "ram", "storage", "cooling", "laptops"],
  },

  headphones: {
    slug: "headphones",
    labelAr: "سماعات",
    labelEn: "Headphones",
    Icon: Headphones,
    parentCategory: CAT.phones,
    orbit: "inner",
    productKeywords: ["سماعة", "سماعات", "headphone", "headphones", "earbuds", "airpods", "ايربودز", "wh-1000", "بادز", "buds"],
    seo: {
      title: "سماعات أصلية في مول البستان — سماعات بلوتوث وسلكية",
      description: "تشكيلة واسعة من السماعات اللاسلكية والسلكية في مول البستان: AirPods و Galaxy Buds و JBL و Sony مع ضمان وكيل معتمد.",
      keywords: "سماعات, سماعة بلوتوث, airpods, galaxy buds, jbl, sony, headphones, مول البستان",
    },
    intro:
      "تتوفر في مول البستان مجموعة كبيرة من السماعات لتلبية كافة الاحتياجات: سماعات أذن لاسلكية مدمجة (TWS) للاستخدام اليومي، وسماعات Over-Ear فاخرة بعزل ضوضاء نشط للسفر والعمل، وسماعات احترافية للمنتجين والمصممين الصوتيين، وسماعات جيمنج مزودة بميكروفون للاتصال داخل اللعبة. تشمل العلامات التجارية AirPods من Apple و Galaxy Buds من Samsung و WH-1000XM من Sony و JBL و Anker و HyperX. تقدم المحلات تجربة استماع مباشرة قبل الشراء وضمان وكيل أصلي، إلى جانب توفر إكسسوارات السماعات وقطع الغيار.",
    faq: [
      { q: "هل تدعم السماعات اللاسلكية أجهزة iPhone و Android؟", a: "معظم سماعات Bluetooth الحديثة متوافقة مع كلا النظامين عبر اتصال Bluetooth قياسي." },
      { q: "ما الفرق بين عزل الضوضاء النشط والسلبي؟", a: "العزل النشط يلغي ضوضاء البيئة إلكترونياً، بينما السلبي يعتمد على تصميم السماعة فقط." },
      { q: "هل يوجد ضمان على السماعات اللاسلكية؟", a: "نعم، السماعات الأصلية تأتي بضمان وكيل معتمد، مع توضيح المدة عند الشراء." },
    ],
    relatedSlugs: ["earbuds", "smartphones", "speakers", "microphones", "smartwatches"],
  },

  keyboards: {
    slug: "keyboards",
    labelAr: "لوحات مفاتيح",
    labelEn: "Keyboards",
    Icon: Keyboard,
    parentCategory: CAT.computers,
    orbit: "inner",
    productKeywords: ["كيبورد", "keyboard", "mechanical"],
    seo: {
      title: "كيبورد ميكانيكي وعربي في مول البستان",
      description: "لوحات مفاتيح ميكانيكية ولاسلكية بأحرف عربية للجيمنج والمكاتب في مول البستان، التجمع الخامس. سويتشات Cherry MX و Razer و Logitech.",
      keywords: "كيبورد, لوحة مفاتيح, keyboard, mechanical, ميكانيكي, جيمنج, مول البستان",
    },
    intro:
      "يقدم مول البستان مجموعة متنوعة من لوحات المفاتيح للأعمال والجيمنج، تشمل اللوحات الميكانيكية بسويتشات Cherry MX الأصلية، واللوحات اللاسلكية الهادئة المناسبة للمكاتب، ولوحات المفاتيح المضاءة RGB المخصصة لمحبي الجيمنج. جميع اللوحات تأتي بأحرف عربية وإنجليزية مطبوعة بليزر للحفاظ على وضوحها، مع توفر التخطيطات الكاملة Full-Size والمدمجة TKL و60%. يضم المول علامات Logitech و Razer و Corsair و SteelSeries و Keychron و HyperX، مع إكسسوارات داعمة مثل مساند المعصم والكيبكابس البديلة.",
    faq: [
      { q: "هل اللوحات بأحرف عربية مطبوعة بشكل دائم؟", a: "نعم، اللوحات المتوفرة في المول مطبوعة بليزر لتدوم سنوات دون تآكل." },
      { q: "ما الفرق بين سويتشات Red و Brown و Blue؟", a: "Red للجيمنج بضغطة خفيفة، Brown متعدد الاستخدامات، Blue صوتي ومناسب للكتابة." },
      { q: "هل تتوفر كيبوردات لاسلكية بشحن USB-C؟", a: "نعم، أغلب اللوحات اللاسلكية الحديثة تدعم الشحن السريع عبر منفذ USB-C." },
    ],
    relatedSlugs: ["mice", "monitors", "laptops", "cpus"],
  },

  storage: {
    slug: "storage",
    labelAr: "تخزين",
    labelEn: "Storage / SSD / HDD",
    Icon: HardDrive,
    parentCategory: CAT.computers,
    orbit: "middle",
    productKeywords: ["ssd", "hdd", "تخزين", "هارد", "nvme"],
    seo: {
      title: "هاردات SSD و HDD في مول البستان — تخزين عالي السرعة",
      description: "هاردات SSD NVMe و SATA وأقراص HDD داخلية وخارجية بسعات تخزين مختلفة في مول البستان، التجمع الخامس. ضمان وكيل وأسعار تنافسية.",
      keywords: "ssd, nvme, هارد, تخزين, hdd, samsung evo, wd, seagate, مول البستان",
    },
    intro:
      "تتوفر في مول البستان حلول تخزين شاملة لمختلف الاحتياجات: هاردات SSD NVMe بسرعات تتجاوز 7000 ميجابايت/ثانية للجيمنج وتحرير الفيديو، وهاردات SSD SATA الاقتصادية لترقية أجهزة اللابتوب والمكاتب، وأقراص HDD داخلية بسعات حتى 20 تيرابايت للأرشفة، وحلول التخزين الخارجية المحمولة والمكتبية. تشمل العلامات Samsung 990 PRO و WD Black و Seagate و Crucial و Kingston و SanDisk، مع خدمة تركيب فوري للأجهزة المحمولة وأنظمة سطح المكتب.",
    faq: [
      { q: "هل تركيب الـ SSD يحتاج إلى فني متخصص؟", a: "تركيب الـ SSD سهل في معظم الأجهزة، وتقدم محلات المول خدمة التركيب ونقل البيانات." },
      { q: "ما الفرق بين NVMe و SATA؟", a: "NVMe أسرع بعدة أضعاف ومتصل عبر منفذ M.2، بينما SATA أبطأ ولكن متوفر بأسعار أقل." },
      { q: "هل يمكن استرجاع البيانات من هارد تالف؟", a: "بعض محلات الصيانة المتخصصة في المول تقدم خدمة استرجاع البيانات حسب نوع التلف." },
    ],
    relatedSlugs: ["ram", "storage", "nas", "laptops", "cpus"],
  },

  mice: {
    slug: "mice",
    labelAr: "ماوس",
    labelEn: "Mice",
    Icon: Mouse,
    parentCategory: CAT.computers,
    orbit: "middle",
    productKeywords: ["ماوس", "mouse", "logitech", "لوجيتك", "razer", "mx master"],
    seo: {
      title: "ماوس جيمنج ولاسلكي في مول البستان",
      description: "ماوس جيمنج بدقة عالية وماوس لاسلكي للمكاتب من Logitech و Razer و SteelSeries في مول البستان، التجمع الخامس.",
      keywords: "ماوس, ماوس جيمنج, mouse, logitech, razer, lasلكي, مول البستان",
    },
    intro:
      "يحتوي مول البستان على تشكيلة متنوعة من أجهزة الماوس لتناسب كافة المستخدمين: ماوس جيمنج بدقة تصل إلى 26000 DPI ومستشعرات بصرية متقدمة، وماوس لاسلكي مكتبي هادئ مع شحن USB-C، وماوس Trackball للمستخدمين المحترفين. تشمل العلامات التجارية Logitech و Razer و SteelSeries و Corsair و HyperX و Glorious. تتميز الأجهزة بقابلية التخصيص الكاملة عبر برمجيات الشركات المصنعة، مع توفر إعدادات الـ macros وأذرع جانبية قابلة للتغيير.",
    faq: [
      { q: "ما أفضل ماوس للأعمال المكتبية؟", a: "ماوس لاسلكي خفيف من Logitech أو HP يقدم تجربة مريحة وعمر بطارية طويل." },
      { q: "هل ماوس الجيمنج اللاسلكي يماثل أداء السلكي؟", a: "نعم، الموديلات الحديثة بتقنية Lightspeed و HyperPolling لا فرق ملحوظاً عن السلكي." },
      { q: "هل تتوفر ماوس Pads كبيرة؟", a: "نعم، تجد ماوس باد بمقاسات كبيرة وللجيمنج بحواف مخيطة في محلات الإكسسوارات." },
    ],
    relatedSlugs: ["keyboards", "monitors", "laptops", "controllers"],
  },

  cameras: {
    slug: "cameras",
    labelAr: "كاميرات",
    labelEn: "Cameras",
    Icon: Camera,
    parentCategory: CAT.printing,
    orbit: "middle",
    productKeywords: ["كاميرا", "camera", "canon", "sony", "nikon", "dslr"],
    seo: {
      title: "كاميرات تصوير احترافية في مول البستان",
      description: "كاميرات DSLR و Mirrorless و Action Cam من Canon و Sony و Nikon و GoPro في مول البستان، التجمع الخامس، مع عدسات وإكسسوارات تصوير.",
      keywords: "كاميرا, تصوير, canon, sony, nikon, gopro, mirrorless, dslr, مول البستان",
    },
    intro:
      "تقدم محلات التصوير في مول البستان حلولاً متكاملة للمصورين المحترفين والهواة على حد سواء، شاملةً كاميرات DSLR و Mirrorless من Canon و Sony و Nikon و Fujifilm، وكاميرات Action Cameras مثل GoPro و DJI Osmo، وكاميرات Vlogging مدمجة. تتوفر تشكيلة واسعة من العدسات والفلاتر والترايبودات وحقائب الحماية وبطاقات الذاكرة، إلى جانب إضاءات الاستوديو وأجهزة التسجيل الصوتي. تتميز المحلات بتقديم نصائح متخصصة لاختيار المعدات المناسبة لكل نوع تصوير من البورتريه إلى التصوير الرياضي والوثائقي.",
    faq: [
      { q: "ما الفرق بين DSLR و Mirrorless؟", a: "Mirrorless أخف وأكثر حداثة بعدسات أصغر، بينما DSLR يقدم عمر بطارية أطول." },
      { q: "هل تتوفر عدسات أصلية بضمان وكيل؟", a: "نعم، تباع العدسات الأصلية بضمان وكيل معتمد مع شرح مواصفاتها وفتحاتها." },
      { q: "هل يقدم المول خدمة صيانة الكاميرات؟", a: "بعض المحلات المعتمدة تقدم خدمات تنظيف المستشعر وصيانة العدسات." },
    ],
    relatedSlugs: ["printers", "scanners", "webcams", "cameras", "microphones"],
  },

  "gaming-consoles": {
    slug: "gaming-consoles",
    labelAr: "أجهزة الجيمنج",
    labelEn: "Gaming Consoles",
    Icon: Gamepad2,
    parentCategory: CAT.gaming,
    orbit: "middle",
    productKeywords: ["playstation", "بلايستيشن", "xbox", "اكس بوكس", "nintendo", "ps5", "ps4", "جيمنج", "سيريس اكس"],
    seo: {
      title: "أجهزة جيمنج PlayStation و Xbox في مول البستان",
      description: "أجهزة PlayStation 5 و Xbox Series X|S و Nintendo Switch مع ألعاب وإكسسوارات أصلية بضمان معتمد في مول البستان، التجمع الخامس.",
      keywords: "playstation, ps5, xbox, nintendo switch, جيمنج, ألعاب, مول البستان",
    },
    intro:
      "يضم مول البستان قسماً مخصصاً للجيمنج يقدم أحدث أجهزة الكونسول من PlayStation 5 و Xbox Series X|S و Nintendo Switch بإصداراتها المختلفة، إلى جانب مكتبة واسعة من الألعاب الأصلية على أقراص أو رصيد رقمي. تتوفر إكسسوارات احترافية من أذرع تحكم بديلة وسماعات خاصة بالجيمنج وحوامل لشحن الذراع، فضلاً عن خدمات تركيب SSD داخلي للـ PS5 وترقيات تخزين الـ Xbox. كما يقدم المول استشارات لاختيار الجهاز الأنسب وفق نوعية الألعاب المفضلة، وعروض حزم Bundle شاملة للجهاز مع لعبتين أو أكثر.",
    faq: [
      { q: "هل أجهزة الكونسول أصلية بضمان؟", a: "نعم، جميع الأجهزة المتوفرة أصلية بضمان وكيل معتمد لمدة سنة." },
      { q: "هل تتوفر ألعاب أصلية؟", a: "نعم، تتوفر الألعاب على أقراص فعلية أو ككود تفعيل رقمي للحساب." },
      { q: "هل يمكن ترقية تخزين PlayStation 5؟", a: "نعم، عبر تركيب SSD NVMe متوافق مع Spec الـ PS5، وتقدم المحلات هذه الخدمة." },
    ],
    relatedSlugs: ["controllers", "laptops", "monitors", "headphones"],
  },

  printers: {
    slug: "printers",
    labelAr: "طابعات",
    labelEn: "Printers",
    Icon: Printer,
    parentCategory: CAT.printing,
    orbit: "middle",
    productKeywords: ["طابعة", "printer", "hp", "canon", "epson", "pixma", "laserjet"],
    seo: {
      title: "طابعات ليزر و Inkjet في مول البستان",
      description: "طابعات ليزر و Inkjet للمنزل والمكتب من HP و Canon و Epson و Brother مع ضمان وكيل وأحبار أصلية في مول البستان، التجمع الخامس.",
      keywords: "طابعة, طابعات, printer, hp, canon, epson, ليزر, inkjet, مول البستان",
    },
    intro:
      "توفر محلات الطابعات في مول البستان تشكيلة شاملة من الطابعات للاستخدامات المختلفة: طابعات ليزر للمكاتب والشركات بسرعات طباعة عالية، وطابعات Inkjet للمنزل بجودة صور احترافية، وطابعات All-in-One متعددة الوظائف للنسخ والمسح والفاكس، وطابعات الصور المتخصصة. تشمل العلامات HP و Canon و Epson و Brother و Xerox، مع توفر الأحبار الأصلية وكروت Toner للصيانة الدورية. تقدم المحلات خدمات الإعداد والربط بشبكة الواي فاي وتدريب المستخدمين، فضلاً عن خدمات الصيانة وإعادة التعبئة المعتمدة.",
    faq: [
      { q: "أيهما أوفر للمنزل: ليزر أم Inkjet؟", a: "الليزر أوفر للنصوص الكثيفة، بينما Inkjet أفضل للصور والاستخدام المتقطع." },
      { q: "هل تتوفر أحبار أصلية بضمان؟", a: "نعم، تباع الأحبار الأصلية والكروت بضمان جودة الطباعة." },
      { q: "هل يقدم المول خدمة صيانة الطابعات؟", a: "نعم، توجد محلات صيانة معتمدة لتنظيف الرؤوس وإعادة التعبئة وإصلاح الأعطال." },
    ],
    relatedSlugs: ["scanners", "cameras", "projectors", "printers", "laptops"],
  },

  routers: {
    slug: "routers",
    labelAr: "راوترات",
    labelEn: "Routers",
    Icon: Router,
    parentCategory: CAT.networking,
    orbit: "middle",
    productKeywords: ["راوتر", "router", "wifi", "tp-link", "tplink", "archer", "asus"],
    seo: {
      title: "راوترات Wi-Fi 6 وأنظمة Mesh في مول البستان",
      description: "راوترات Wi-Fi 6 و Wi-Fi 6E وأنظمة Mesh من TP-Link و ASUS و Mercusys في مول البستان، التجمع الخامس، مع خدمة الإعداد المنزلي.",
      keywords: "راوتر, wifi 6, mesh, tp-link, asus, شبكات, مول البستان",
    },
    intro:
      "تقدم محلات الشبكات في مول البستان أحدث الراوترات لتوفير اتصال إنترنت سريع ومستقر للمنازل والشركات. تشمل التشكيلة راوترات Wi-Fi 6 و Wi-Fi 6E بدعم سرعات تتجاوز 10 جيجابت، وأنظمة Mesh متعددة النقاط لتغطية المنازل الكبيرة، وراوترات الجيمنج بميزة QoS وتقليل زمن الاستجابة. تشمل العلامات TP-Link و ASUS و Tenda و Mercusys و Xiaomi، مع إمكانية الإعداد الفوري في المحل أو حجز خدمة منزلية. كما تتوفر مقويات الإشارة والـ Access Points للأماكن الواسعة.",
    faq: [
      { q: "هل أحتاج Wi-Fi 6 لو سرعتي 100 ميجا؟", a: "Wi-Fi 6 يحسن استقرار الإشارة وعدد الأجهزة المتصلة حتى مع سرعات أقل." },
      { q: "ما الفرق بين Mesh والمقوي العادي؟", a: "Mesh يستخدم شبكة موحدة بنفس اسم الواي فاي، بينما المقوي ينشئ شبكة منفصلة." },
      { q: "هل يقدم المول خدمة إعداد الراوتر منزلياً؟", a: "نعم، عدد من المحلات يقدم خدمة الإعداد والتركيب وتأمين الشبكة منزلياً." },
    ],
    relatedSlugs: ["networking", "cameras", "accessories", "intercoms", "ups"],
  },

  tablets: {
    slug: "tablets",
    labelAr: "تابلت",
    labelEn: "Tablets",
    Icon: Tablet,
    parentCategory: CAT.phones,
    orbit: "outer",
    productKeywords: ["تابلت", "tablets", "tablet", "galaxy tab"],
    seo: {
      title: "تابلت iPad و Galaxy Tab في مول البستان",
      description: "أحدث أجهزة iPad و Samsung Galaxy Tab و Huawei MatePad للدراسة والعمل والترفيه في مول البستان، التجمع الخامس.",
      keywords: "تابلت, ipad, galaxy tab, matepad, tablet, مول البستان",
    },
    intro:
      "تتوفر في مول البستان مجموعة متكاملة من أجهزة التابلت لتناسب احتياجات الدراسة والعمل والترفيه. تشمل التشكيلة أجهزة iPad بإصداراتها (Pro, Air, Mini) المدعومة بقلم Apple Pencil، وأجهزة Samsung Galaxy Tab مع قلم S Pen، وتابلت Huawei MatePad و Lenovo و Xiaomi Pad. مناسبة للطلاب لقراءة الكتب والمذاكرة، وللمصممين لرسم الإسكتشات الرقمية، وللمحترفين لتدوين الملاحظات في الاجتماعات. تتوفر إكسسوارات داعمة من حافظات حماية وأقلام بديلة ولوحات مفاتيح متوافقة.",
    faq: [
      { q: "هل التابلت بديل عن اللابتوب؟", a: "للأعمال البسيطة والدراسة نعم، وللأعمال المتقدمة يبقى اللابتوب أفضل خياراً." },
      { q: "هل قلم Apple Pencil أصلي؟", a: "نعم، يباع القلم الأصلي مع ضمان وكيل معتمد." },
      { q: "ما الفرق بين iPad Pro و Air؟", a: "Pro يقدم معالج M-series وشاشة ProMotion للاستخدام الاحترافي." },
    ],
    relatedSlugs: ["laptops", "smartphones", "smartwatches", "earbuds", "macbook"],
  },

  smartwatches: {
    slug: "smartwatches",
    labelAr: "ساعات ذكية",
    labelEn: "Smart Watches",
    Icon: Watch,
    parentCategory: CAT.phones,
    orbit: "outer",
    productKeywords: ["ساعة ذكية", "ساعة", "smartwatch", "apple watch", "galaxy watch", "watch ultra"],
    seo: {
      title: "ساعات ذكية Apple Watch و Galaxy Watch في مول البستان",
      description: "Apple Watch و Samsung Galaxy Watch و Huawei Watch وأجهزة تتبع اللياقة في مول البستان، التجمع الخامس، بضمان وكيل أصلي.",
      keywords: "ساعة ذكية, smartwatch, apple watch, galaxy watch, fitness tracker, مول البستان",
    },
    intro:
      "تجد في مول البستان مجموعة متنوعة من الساعات الذكية وأجهزة تتبع اللياقة البدنية، تشمل Apple Watch بإصداراتها (Series, Ultra, SE) و Samsung Galaxy Watch و Huawei Watch GT و Xiaomi Mi Band و Amazfit. تقدم هذه الأجهزة ميزات متقدمة مثل قياس النبض ومستوى الأكسجين في الدم وتخطيط القلب ECG، وتتبع النوم والتمارين الرياضية، والاتصال LTE. تتوفر أساور بديلة بألوان وخامات متعددة (سيليكون، جلد، معدن) لتخصيص مظهر الساعة.",
    faq: [
      { q: "هل Apple Watch تعمل مع Android؟", a: "لا، Apple Watch تعمل حصرياً مع iPhone، أما Galaxy Watch فمتوافقة مع كلاهما." },
      { q: "هل الساعات الذكية مقاومة للماء؟", a: "معظم الموديلات الحديثة مقاومة للماء حتى عمق 50 متراً وتصلح للسباحة." },
      { q: "كم تدوم بطارية الساعة الذكية؟", a: "تتراوح بين يوم واحد لـ Apple Watch وحتى أسبوعين لساعات Huawei و Amazfit." },
    ],
    relatedSlugs: ["smartphones", "earbuds", "headphones", "tablets"],
  },

  speakers: {
    slug: "speakers",
    labelAr: "سبيكر",
    labelEn: "Speakers",
    Icon: Speaker,
    parentCategory: CAT.phones,
    orbit: "outer",
    productKeywords: ["سبيكر", "speaker", "jbl", "bluetooth", "سماعة"],
    seo: {
      title: "سبيكر بلوتوث وأنظمة صوت في مول البستان",
      description: "سماعات بلوتوث محمولة وأنظمة Sound Bar من JBL و Sony و Bose و Anker في مول البستان، التجمع الخامس.",
      keywords: "سبيكر, سماعة بلوتوث, jbl, sony, bose, sound bar, مول البستان",
    },
    intro:
      "تتوفر في مول البستان تشكيلة واسعة من السماعات الصوتية المتنقلة والمنزلية، شاملةً سماعات Bluetooth محمولة بمقاومة للماء IPX7 من JBL و Anker و Bose، وسماعات Sound Bar للتلفزيون بنظام Dolby Atmos، وسماعات احترافية للحفلات والمناسبات. تقدم المحلات أنظمة صوتية متكاملة 2.1 و 5.1 للسينما المنزلية، إلى جانب سماعات الكمبيوتر المدمجة. تتميز المنتجات بتجربة استماع مباشرة قبل الشراء وضمان وكيل أصلي.",
    faq: [
      { q: "هل السبيكر مقاوم للماء؟", a: "نعم، أغلب موديلات الـ Bluetooth الحديثة بتصنيف IPX7 وتتحمل الرذاذ والغمر القصير." },
      { q: "هل يمكن توصيل أكثر من سبيكر معاً؟", a: "نعم، تدعم الموديلات الحديثة وضع Stereo Pairing لتوصيل سبيكرين بنفس النوع." },
      { q: "ما أفضل سبيكر للسيارة؟", a: "يُنصح بسبيكر Bluetooth محمول بحجم متوسط مع بطارية 12+ ساعة." },
    ],
    relatedSlugs: ["headphones", "earbuds", "microphones", "accessories"],
  },

  ram: {
    slug: "ram",
    labelAr: "رامات",
    labelEn: "RAM Memory",
    Icon: MemoryStick,
    parentCategory: CAT.computers,
    orbit: "outer",
    productKeywords: ["رامات", "ram", "ddr4", "ddr5", "memory"],
    seo: {
      title: "رامات DDR4 و DDR5 في مول البستان",
      description: "ذواكر RAM للابتوب وأجهزة المكتب من Corsair و G.Skill و Kingston بسعات وسرعات متنوعة في مول البستان، التجمع الخامس.",
      keywords: "رامات, ram, ddr4, ddr5, corsair, kingston, مول البستان",
    },
    intro:
      "تقدم محلات مول البستان رامات الكمبيوتر بمختلف الأنواع والسرعات، شاملةً DDR4 بسرعات 2666 إلى 3600 ميجاهرتز، و DDR5 بسرعات تتجاوز 6000 ميجاهرتز للأنظمة الحديثة، إلى جانب رامات اللابتوب SO-DIMM. تتوفر سعات من 8GB حتى 64GB لكل قطعة، مع إمكانية شراء مجموعات ثنائية أو رباعية لتفعيل تقنية Dual/Quad Channel. تتميز المنتجات بإضاءة RGB قابلة للتخصيص ومشتتات حرارية مدمجة لمحبي الجيمنج، من علامات Corsair و G.Skill و Kingston Fury و Crucial و TeamGroup.",
    faq: [
      { q: "كم رام أحتاج للجيمنج؟", a: "16GB يكفي لمعظم الألعاب، و 32GB مثالي للجيمنج وتحرير الفيديو." },
      { q: "هل يمكن خلط رامات بسرعات مختلفة؟", a: "تعمل لكن بسرعة أبطأ قطعة، ويُنصح بشراء طقم متطابق." },
      { q: "ما الفرق بين DDR4 و DDR5؟", a: "DDR5 أسرع وأكفأ في استهلاك الطاقة، لكن يحتاج لوحة أم متوافقة." },
    ],
    relatedSlugs: ["storage", "cpus", "laptops"],
  },

  webcams: {
    slug: "webcams",
    labelAr: "ويب كام",
    labelEn: "Webcams",
    Icon: Webcam,
    parentCategory: CAT.printing,
    orbit: "outer",
    productKeywords: ["ويب كام", "webcam", "logitech"],
    seo: {
      title: "كاميرات ويب كام للبث والاجتماعات في مول البستان",
      description: "كاميرات Webcam بدقة 1080p و 4K للبث المباشر واجتماعات الفيديو من Logitech و Razer في مول البستان، التجمع الخامس.",
      keywords: "ويب كام, webcam, logitech, streaming, مول البستان",
    },
    intro:
      "تقدم محلات مول البستان مجموعة من كاميرات الويب كام لاحتياجات العمل عن بعد والبث المباشر. تشمل كاميرات بدقة Full HD 1080p للاجتماعات اليومية، وكاميرات بدقة 4K للبث الاحترافي على Twitch و YouTube، وكاميرات بمستشعر AI لتتبع الوجه والإضاءة الذكية. تتوفر علامات Logitech و Razer و Anker و OBSBOT، مع إكسسوارات داعمة من حلقات إضاءة LED وميكروفونات وحوامل ترايبود.",
    faq: [
      { q: "هل تعمل الويب كام تلقائياً عند توصيلها؟", a: "نعم، أغلب الموديلات Plug-and-Play وتعمل فوراً على Windows و macOS." },
      { q: "هل تتوفر كاميرات بمستشعر AI؟", a: "نعم، بعض الموديلات تدعم تتبع الوجه والإطار التلقائي." },
      { q: "ما الفرق بين 1080p و 4K؟", a: "4K يقدم جودة أعلى بكثير لكن يستهلك معالجة أكبر، 1080p يكفي لمعظم الاستخدامات." },
    ],
    relatedSlugs: ["cameras", "microphones", "monitors"],
  },

  cables: {
    slug: "cables",
    labelAr: "كابلات",
    labelEn: "Cables",
    Icon: Cable,
    parentCategory: CAT.phones,
    orbit: "outer",
    productKeywords: ["كابل", "cable", "usb", "hdmi", "type-c"],
    seo: {
      title: "كابلات USB و HDMI و Type-C في مول البستان",
      description: "كابلات شحن وبيانات أصلية USB-C و Lightning و HDMI 2.1 و DisplayPort في مول البستان، التجمع الخامس.",
      keywords: "كابلات, usb, hdmi, type-c, lightning, displayport, مول البستان",
    },
    intro:
      "تتوفر في مول البستان تشكيلة شاملة من الكابلات الأصلية لتلبية كل احتياجات التوصيل. تشمل كابلات USB-C عالية الجودة لشحن الموبايل والابتوب بسرعات تتجاوز 100W، وكابلات Lightning أصلية معتمدة من Apple، وكابلات HDMI 2.1 لدعم 4K@120Hz للتلفزيونات وأجهزة الجيمنج، وكابلات DisplayPort للشاشات الاحترافية، إلى جانب كابلات الشبكة Cat 6 و Cat 7. تتميز المنتجات بمتانة عالية وحماية لرأس التوصيل من علامات Anker و Baseus و UGREEN و Belkin.",
    faq: [
      { q: "هل الكابلات الأصلية تختلف فعلاً؟", a: "نعم، الكابلات الأصلية أكثر أماناً وتدعم سرعات الشحن والنقل المعلنة." },
      { q: "ما الفرق بين USB 2.0 و 3.0؟", a: "USB 3.0 أسرع بعشرات المرات في نقل البيانات." },
      { q: "هل HDMI 2.1 يدعم 4K 120Hz؟", a: "نعم، HDMI 2.1 يدعم دقة 4K بمعدل 120Hz و 8K بمعدل 60Hz." },
    ],
    relatedSlugs: ["chargers", "powerbanks", "smartphones", "laptops"],
  },

  chargers: {
    slug: "chargers",
    labelAr: "شواحن",
    labelEn: "Chargers",
    Icon: Zap,
    parentCategory: CAT.phones,
    orbit: "outer",
    productKeywords: ["شاحن", "charger", "fast charging"],
    seo: {
      title: "شواحن سريعة Type-C في مول البستان",
      description: "شواحن سريعة GaN و Quick Charge بقدرات حتى 240W من Anker و Baseus و UGREEN في مول البستان، التجمع الخامس.",
      keywords: "شاحن, شاحن سريع, gan, type-c, quick charge, anker, مول البستان",
    },
    intro:
      "تجد في مول البستان أحدث شواحن الأجهزة بتقنية GaN التي تقدم قدرات شحن عالية في حجم صغير، بقدرات تتراوح من 20W لشحن الموبايل وحتى 240W لشحن اللابتوبات الاحترافية. تشمل التشكيلة شواحن سريعة معتمدة من Apple و Samsung للموبايلات، وشواحن متعددة المنافذ USB-C و USB-A لشحن عدة أجهزة في نفس الوقت، وشواحن السيارة، والشواحن اللاسلكية MagSafe و Qi. تتوفر العلامات الموثوقة Anker و Baseus و UGREEN و Belkin مع ضمان معتمد.",
    faq: [
      { q: "ما تقنية GaN؟", a: "تقنية حديثة لأشباه الموصلات تتيح شحن أسرع بحجم أصغر وحرارة أقل." },
      { q: "هل الشاحن السريع يضر البطارية؟", a: "لا، الشواحن المعتمدة بمعايير الأمان لا تؤثر على عمر البطارية." },
      { q: "هل شاحن MagSafe يصلح لكل iPhone؟", a: "MagSafe يعمل بالشحن المغناطيسي مع iPhone 12 وأحدث." },
    ],
    relatedSlugs: ["cables", "powerbanks", "smartphones", "laptops"],
  },

  networking: {
    slug: "networking",
    labelAr: "شبكات",
    labelEn: "Networking",
    Icon: Wifi,
    parentCategory: CAT.networking,
    orbit: "outer",
    productKeywords: ["شبكة", "network", "switch", "access point"],
    seo: {
      title: "معدات شبكات احترافية في مول البستان",
      description: "أجهزة Switch و Access Points و Patch Panels و كابلات شبكة من Cisco و TP-Link و Mikrotik في مول البستان، التجمع الخامس.",
      keywords: "شبكات, switch, access point, شبكة, مول البستان",
    },
    intro:
      "تقدم محلات الشبكات في مول البستان حلولاً متكاملة للمنشآت والشركات والمنازل الكبيرة. تشمل التشكيلة أجهزة Switch بمنافذ من 5 إلى 48 منفذ مع دعم PoE، و Access Points احترافية لتغطية المساحات الواسعة، وأنظمة الكابلات والتركيبات في الـ Racks، و Patch Panels و RJ45. تشمل العلامات Cisco و TP-Link و Mikrotik و Ubiquiti و Aruba، مع تقديم استشارات تصميم الشبكة وخدمات التركيب الميداني للمكاتب والشركات.",
    faq: [
      { q: "هل تقدمون خدمة تصميم شبكة لشركة؟", a: "نعم، توجد محلات متخصصة في تخطيط وتنفيذ الشبكات السلكية واللاسلكية." },
      { q: "ما الفرق بين Cat 6 و Cat 6a؟", a: "Cat 6a يدعم سرعات 10 جيجابت لمسافات أطول مع حماية تداخل أفضل." },
      { q: "هل تتوفر معدات Mikrotik؟", a: "نعم، تتوفر تشكيلة كاملة من راوترات وسويتشات Mikrotik بضمان." },
    ],
    relatedSlugs: ["routers", "cameras", "intercoms", "ups", "servers"],
  },

  // ─── Newly added expansion (16 more) ───

  televisions: {
    slug: "televisions",
    labelAr: "تلفزيونات",
    labelEn: "Televisions",
    Icon: Tv,
    parentCategory: CAT.gaming,
    orbit: "outer",
    productKeywords: ["تلفزيون", "tv", "smart tv", "oled", "qled"],
    seo: {
      title: "تلفزيونات OLED و QLED في مول البستان",
      description: "تلفزيونات Smart TV بدقة 4K و 8K من Samsung و LG و Sony بأحجام تصل إلى 85 بوصة في مول البستان، التجمع الخامس.",
      keywords: "تلفزيون, smart tv, oled, qled, 4k, samsung, lg, مول البستان",
    },
    intro:
      "يضم مول البستان تشكيلة فاخرة من التلفزيونات الذكية بأحدث التقنيات، بأحجام تتراوح من 32 وحتى 85 بوصة. تشمل التشكيلة تلفزيونات OLED بألوان مثالية وزوايا رؤية واسعة من LG و Sony، وتلفزيونات QLED بإضاءة عالية وألوان ساطعة من Samsung، وتلفزيونات Mini-LED للأداء التنافسي، إلى جانب موديلات HDR و Dolby Vision. تدعم منصات البث Netflix و YouTube و Shahid، مع توفر تركيب احترافي على الحائط وضبط الإعدادات.",
    faq: [
      { q: "ما الفرق بين OLED و QLED؟", a: "OLED يقدم اللون الأسود الأعمق، QLED يتميز بالسطوع العالي والمتانة." },
      { q: "هل التلفزيونات تدعم تطبيقات البث العربية؟", a: "نعم، تدعم Shahid و Watch It وغيرها من التطبيقات." },
      { q: "هل يقدم المول خدمة التركيب؟", a: "نعم، تقدم محلات مختصة خدمة التركيب على الحائط بمستويات ومعالقات معتمدة." },
    ],
    relatedSlugs: ["projectors", "speakers", "controllers", "accessories"],
  },

  projectors: {
    slug: "projectors",
    labelAr: "بروجكتر",
    labelEn: "Projectors",
    Icon: Projector,
    parentCategory: CAT.printing,
    orbit: "outer",
    productKeywords: ["بروجكتر", "projector"],
    seo: {
      title: "بروجكتر للسينما المنزلية والشركات في مول البستان",
      description: "أجهزة عرض Projector بدقة Full HD و 4K للسينما المنزلية والمؤتمرات في مول البستان، التجمع الخامس.",
      keywords: "بروجكتر, projector, سينما منزلية, مؤتمرات, مول البستان",
    },
    intro:
      "تتوفر في مول البستان أجهزة عرض احترافية تناسب الاستخدام المنزلي والمكتبي والتعليمي. تشمل التشكيلة بروجكتر LED محمول صغير الحجم، وبروجكتر Laser بسطوع عالٍ للقاعات، وبروجكتر 4K UHD للسينما المنزلية بدعم HDR و Dolby. تشمل العلامات Epson و BenQ و Optoma و Xiaomi، إلى جانب شاشات العرض القماشية الثابتة والمتحركة وحوامل التركيب. تقدم المحلات استشارات لاختيار الجهاز المناسب وفق المساحة ومستوى الإضاءة.",
    faq: [
      { q: "ما السطوع المناسب للمنزل؟", a: "2500-3500 لومن مناسب للغرف المظلمة، و4000+ للقاعات المضاءة." },
      { q: "هل البروجكتر يحل محل التلفزيون؟", a: "للسينما الأسبوعية نعم، لكن التلفزيون أنسب للاستخدام اليومي المضيء." },
      { q: "هل يدعم Netflix و YouTube؟", a: "البروجكترات الذكية الحديثة تدعم منصات البث مباشرة." },
    ],
    relatedSlugs: ["televisions", "speakers", "monitors", "printers"],
  },

  servers: {
    slug: "servers",
    labelAr: "سيرفرات",
    labelEn: "Servers",
    Icon: Server,
    parentCategory: CAT.networking,
    orbit: "outer",
    productKeywords: ["سيرفر", "server"],
    seo: {
      title: "سيرفرات وأجهزة Workstation في مول البستان",
      description: "سيرفرات Rack وأجهزة Workstation للشركات من Dell و HP و Lenovo بمعالجات Xeon في مول البستان، التجمع الخامس.",
      keywords: "سيرفر, server, workstation, rack, dell, hp, مول البستان",
    },
    intro:
      "تقدم محلات مول البستان حلول السيرفرات وأجهزة Workstation للشركات المتوسطة والكبيرة. تشمل التشكيلة سيرفرات Rack 1U/2U/4U بمعالجات Xeon و EPYC وسعات تخزين عالية، وأجهزة Tower Server للشركات الناشئة، وأجهزة Workstation للمصممين ومهندسي 3D Rendering. تتوفر علامات Dell PowerEdge و HP ProLiant و Lenovo ThinkSystem، مع خدمات التركيب والإعداد والصيانة. كما تتوفر إكسسوارات الـ Racks وأنظمة التبريد والـ UPS.",
    faq: [
      { q: "هل تقدمون استشارات لاختيار السيرفر؟", a: "نعم، توجد فرق فنية متخصصة لتحديد السيرفر المناسب لطبيعة عمل الشركة." },
      { q: "هل تشمل خدمة التركيب؟", a: "نعم، خدمة التركيب والإعداد والـ Configuration متاحة بحسب الاحتياج." },
      { q: "ما عمر السيرفر الافتراضي؟", a: "عادة 5-7 سنوات مع صيانة دورية وضمان مؤسسي." },
    ],
    relatedSlugs: ["nas", "ups", "networking", "storage", "cpus"],
  },

  "external-storage": {
    slug: "external-storage",
    labelAr: "تخزين خارجي",
    labelEn: "External Storage",
    Icon: Disc,
    parentCategory: CAT.computers,
    orbit: "outer",
    productKeywords: ["external", "هارد خارجي", "ssd خارجي"],
    seo: {
      title: "هاردات خارجية SSD و HDD في مول البستان",
      description: "هاردات خارجية محمولة SSD NVMe و HDD بسعات تصل إلى 20TB من WD و Seagate و Samsung في مول البستان، التجمع الخامس.",
      keywords: "هارد خارجي, ssd خارجي, external storage, wd, seagate, مول البستان",
    },
    intro:
      "تتوفر في مول البستان حلول التخزين الخارجي بمختلف السعات والسرعات. تشمل التشكيلة هاردات SSD خارجية محمولة بسرعات تتجاوز 1000 ميجابايت/ثانية وأحجام جيب صغيرة، وهاردات HDD محمولة بسعات حتى 5TB، وأقراص التخزين المكتبية الكبيرة بسعات حتى 20TB للأرشفة والاحتياطي. تدعم المنتجات منافذ USB-C و Thunderbolt مع تشفير AES 256-bit للحماية، من علامات Samsung T7 و WD My Passport و Seagate Backup Plus.",
    faq: [
      { q: "ما الفرق بين SSD و HDD الخارجي؟", a: "SSD أسرع وأخف وزناً وأكثر متانة، HDD أرخص بسعات أكبر." },
      { q: "هل تتوفر هاردات بحماية بكلمة سر؟", a: "نعم، عدد من الموديلات يدعم التشفير وكلمة المرور للحماية." },
      { q: "هل تدعم الهاردات منفذ USB-C؟", a: "نعم، أغلب الموديلات الحديثة تدعم USB-C و Thunderbolt." },
    ],
    relatedSlugs: ["storage", "nas", "laptops", "macbook"],
  },

  controllers: {
    slug: "controllers",
    labelAr: "أذرع تحكم",
    labelEn: "Game Controllers",
    Icon: Joystick,
    parentCategory: CAT.gaming,
    orbit: "outer",
    productKeywords: ["ذراع", "يد تحكم", "controller", "joystick", "gamepad", "dualsense", "دوال سينس"],
    seo: {
      title: "أذرع تحكم Xbox و PlayStation و Nintendo في مول البستان",
      description: "أذرع تحكم أصلية لأجهزة Xbox و PlayStation و Nintendo Switch وعجلات سباق احترافية في مول البستان، التجمع الخامس.",
      keywords: "ذراع تحكم, controller, xbox, playstation, nintendo, gamepad, مول البستان",
    },
    intro:
      "يضم مول البستان قسماً متخصصاً في إكسسوارات الجيمنج، شاملاً أذرع التحكم الأصلية لأجهزة الكونسول من Xbox و PlayStation 5 و Nintendo Switch، وأذرع تحكم خاصة للكمبيوتر مثل Xbox Wireless و Razer Wolverine. تشمل التشكيلة أيضاً عجلات السباق الاحترافية من Logitech G و Thrustmaster، وأذرع طيران للمحاكيات، وأذرع Arcade. تقدم الأذرع الحديثة ميزات Haptic Feedback و Adaptive Triggers لتجربة لعب غامرة.",
    faq: [
      { q: "هل ذراع PlayStation 5 يعمل على الكمبيوتر؟", a: "نعم، DualSense يعمل على PC عبر Bluetooth أو USB-C." },
      { q: "هل تتوفر عجلات سباق احترافية؟", a: "نعم، توجد عجلات Logitech G و Thrustmaster مع دواسات للسباقات." },
      { q: "هل الأذرع أصلية بضمان؟", a: "نعم، جميع الأذرع المتوفرة أصلية بضمان وكيل معتمد." },
    ],
    relatedSlugs: ["controllers", "laptops", "monitors", "headphones"],
  },

  microphones: {
    slug: "microphones",
    labelAr: "ميكروفونات",
    labelEn: "Microphones",
    Icon: Mic,
    parentCategory: CAT.printing,
    orbit: "outer",
    productKeywords: ["ميكروفون", "microphone", "mic"],
    seo: {
      title: "ميكروفونات احترافية للبث والتسجيل في مول البستان",
      description: "ميكروفونات USB و XLR للبث المباشر والبودكاست والتسجيل من Blue و Rode و Shure في مول البستان، التجمع الخامس.",
      keywords: "ميكروفون, microphone, podcast, streaming, blue yeti, مول البستان",
    },
    intro:
      "تقدم محلات مول البستان مجموعة احترافية من الميكروفونات لاحتياجات البث المباشر والبودكاست والتسجيل الصوتي. تشمل التشكيلة ميكروفونات USB سهلة التوصيل للمبتدئين مثل Blue Yeti و HyperX QuadCast، وميكروفونات XLR احترافية مع واجهات صوت من Shure و Rode، وميكروفونات Lavalier اللاسلكية للمذيعين. تتوفر إكسسوارات داعمة من حوامل Boom Arm وعوازل صوت Pop Filter وحوامل صدمات Shock Mount.",
    faq: [
      { q: "أيهما أفضل للبدء USB أم XLR؟", a: "USB أسهل وأرخص للمبتدئين، XLR يقدم جودة أعلى للمحترفين." },
      { q: "هل تتوفر ميكروفونات لاسلكية؟", a: "نعم، تتوفر ميكروفونات Lavalier وميكروفونات يد لاسلكية." },
      { q: "هل أحتاج عازل صوت؟", a: "نعم، الـ Pop Filter يحسن جودة الصوت ويقلل الضوضاء البلاستيكية." },
    ],
    relatedSlugs: ["webcams", "headphones", "cameras", "speakers", "microphones"],
  },

  ups: {
    slug: "ups",
    labelAr: "UPS وأنظمة طاقة",
    labelEn: "UPS / Power Backup",
    Icon: BatteryCharging,
    parentCategory: CAT.networking,
    orbit: "outer",
    productKeywords: ["ups", "بطارية احتياطية", "stabilizer"],
    seo: {
      title: "أجهزة UPS وحماية الطاقة في مول البستان",
      description: "أجهزة UPS و Stabilizer لحماية الكمبيوتر والسيرفرات وأجهزة الشبكة من APC و Eaton في مول البستان، التجمع الخامس.",
      keywords: "ups, بطارية احتياطية, stabilizer, apc, eaton, مول البستان",
    },
    intro:
      "تتوفر في مول البستان أنظمة طاقة احتياطية وحماية كهربائية متكاملة لأجهزة الكمبيوتر والسيرفرات وأجهزة الشبكة. تشمل التشكيلة أجهزة UPS بقدرات من 600VA حتى 10KVA، وأجهزة Stabilizer لتنظيم الجهد، وأجهزة Online UPS للمؤسسات. تتوفر العلامات الموثوقة APC و Eaton و CyberPower، مع خدمات تركيب البطاريات الإضافية وصيانة وتجديد البطاريات. تساعد هذه الأجهزة في حماية البيانات من الانقطاع المفاجئ وإطالة عمر الأجهزة.",
    faq: [
      { q: "كم مدة تشغيل UPS عند انقطاع الكهرباء؟", a: "تختلف بحسب الحمل والقدرة، عادة من 5 إلى 30 دقيقة." },
      { q: "هل أحتاج UPS أم Stabilizer؟", a: "UPS يوفر طاقة احتياطية، Stabilizer يحمي من تذبذب الجهد فقط." },
      { q: "هل تشمل خدمة تركيب الـ UPS؟", a: "نعم، تقدم بعض المحلات خدمة التركيب وتوصيل الأجهزة المحمية." },
    ],
    relatedSlugs: ["servers", "networking", "routers", "laptops"],
  },

  scanners: {
    slug: "scanners",
    labelAr: "سكانر",
    labelEn: "Scanners",
    Icon: ScanLine,
    parentCategory: CAT.printing,
    orbit: "outer",
    productKeywords: ["سكانر", "scanner"],
    seo: {
      title: "سكانر مستندات وصور في مول البستان",
      description: "أجهزة سكانر مستندات Flatbed و Sheet-Fed و Document Scanner للشركات من Epson و Canon و Brother في مول البستان، التجمع الخامس.",
      keywords: "سكانر, scanner, document scanner, مسح ضوئي, مول البستان",
    },
    intro:
      "تقدم محلات مول البستان حلول المسح الضوئي للمنازل والمكاتب والشركات. تشمل التشكيلة سكانر Flatbed للوثائق والصور، وسكانر سحب أوراق Sheet-Fed لمعالجة كميات كبيرة، وسكانر مستندات احترافي بقدرات OCR لتحويل النصوص الممسوحة. تشمل العلامات Epson و Canon و Brother و Fujitsu، مع دعم WiFi وتطبيقات الموبايل لإرسال الملفات مباشرة. تقدم المحلات استشارات لاختيار الجهاز المناسب لحجم العمل ونوع المستندات.",
    faq: [
      { q: "هل تتوفر تقنية OCR لتحويل النص؟", a: "نعم، الموديلات الاحترافية تدعم OCR للعربية والإنجليزية." },
      { q: "هل يقوم السكانر بمسح الكتب؟", a: "نعم، Flatbed مناسب لمسح الكتب دون تلف." },
      { q: "هل تشمل خدمة التدريب؟", a: "بعض المحلات تقدم خدمة التركيب والتدريب على البرامج." },
    ],
    relatedSlugs: ["printers", "cameras"],
  },

  accessories: {
    slug: "accessories",
    labelAr: "إكسسوارات",
    labelEn: "Tech Accessories",
    Icon: MonitorSmartphone,
    parentCategory: CAT.phones,
    orbit: "outer",
    productKeywords: ["إكسسوار", "حافظة", "غطاء"],
    seo: {
      title: "إكسسوارات الأجهزة والموبايلات في مول البستان",
      description: "إكسسوارات أصلية للموبايل واللابتوب: حافظات وحماية شاشة وستاندات وحوامل سيارة في مول البستان، التجمع الخامس.",
      keywords: "إكسسوارات, حافظة, ستاند, حماية شاشة, مول البستان",
    },
    intro:
      "يضم مول البستان قسماً واسعاً من إكسسوارات الأجهزة لجميع العلامات التجارية. تشمل التشكيلة حافظات الموبايل الأصلية بمختلف التصميمات، وحماية الشاشة بزجاج مقوى Tempered Glass، وحوامل السيارة المغناطيسية، وحوامل المكتب القابلة للتعديل، وستاندات اللابتوب التي تحسن وضعية العمل، وحقائب اللابتوب والمتنقلة. كل ذلك بأسعار تنافسية وضمان جودة من المحلات المعتمدة.",
    faq: [
      { q: "هل الحافظات أصلية؟", a: "تتوفر حافظات أصلية وأخرى بدائل بجودة عالية حسب الميزانية." },
      { q: "هل يقدم المول خدمة تركيب حماية الشاشة؟", a: "نعم، أغلب المحلات تقدم خدمة التركيب الفوري بدون فقاعات." },
      { q: "هل تتوفر حوامل لاسلكية للسيارة؟", a: "نعم، تتوفر حوامل MagSafe ولاسلكية مع شاحن مدمج." },
    ],
    relatedSlugs: ["chargers", "cables", "powerbanks", "smartphones"],
  },

  nas: {
    slug: "nas",
    labelAr: "NAS وتخزين شبكي",
    labelEn: "NAS Storage",
    Icon: HardDriveDownload,
    parentCategory: CAT.computers,
    orbit: "outer",
    productKeywords: ["nas", "synology", "qnap"],
    seo: {
      title: "أنظمة NAS للتخزين الشبكي في مول البستان",
      description: "أجهزة NAS من Synology و QNAP و Asustor للتخزين السحابي الخاص للمنازل والشركات في مول البستان، التجمع الخامس.",
      keywords: "nas, synology, qnap, تخزين شبكي, مول البستان",
    },
    intro:
      "تتوفر في مول البستان حلول التخزين الشبكي NAS لمن يحتاج سحابة خاصة آمنة. تشمل التشكيلة أجهزة Synology و QNAP و Asustor بحجرات تتراوح من 2 حتى 16 قرص صلب، مع دعم RAID لحماية البيانات وتنظيم الصور والفيديوهات والملفات تلقائياً. تخدم المنازل لحفظ الصور المركزي، والشركات لإدارة المستندات والنسخ الاحتياطي. تقدم المحلات خدمات الإعداد الكامل والتوصيل بالشبكة وتفعيل تطبيقات الـ NAS.",
    faq: [
      { q: "ما الفرق بين NAS و External Drive؟", a: "NAS متصل بالشبكة ويصله عدة مستخدمين، External متصل بجهاز واحد." },
      { q: "هل يدعم النسخ الاحتياطي التلقائي للموبايل؟", a: "نعم، تطبيقات Synology و QNAP تنسخ الصور والفيديو من الموبايل تلقائياً." },
      { q: "هل تشمل خدمة التركيب والإعداد؟", a: "نعم، توجد محلات متخصصة في تركيب وإعداد أنظمة NAS." },
    ],
    relatedSlugs: ["servers", "storage", "networking"],
  },

  intercoms: {
    slug: "intercoms",
    labelAr: "أنتركم",
    labelEn: "Intercoms",
    Icon: Radio,
    parentCategory: CAT.networking,
    orbit: "outer",
    productKeywords: ["انتركم", "intercom"],
    seo: {
      title: "أجهزة أنتركم للشركات والمباني في مول البستان",
      description: "أنظمة أنتركم سلكية ولاسلكية وأنتركم بالفيديو IP للمباني والشركات والفيلات في مول البستان، التجمع الخامس.",
      keywords: "انتركم, intercom, ip intercom, video door phone, مول البستان",
    },
    intro:
      "تقدم محلات الأنظمة الأمنية في مول البستان أنظمة الأنتركم السلكية واللاسلكية وأنتركم الفيديو IP للمنازل والشركات والمباني السكنية. تشمل التشكيلة وحدات أنتركم بشاشات تعمل باللمس، وأنظمة الوصول بالكارت وبصمة الإصبع، وكاميرات الباب الذكية المتصلة بالواي فاي مع تطبيقات الموبايل. تشمل علامات Hikvision و Dahua و Aiphone، مع خدمات التركيب الميداني والصيانة الدورية.",
    faq: [
      { q: "هل تتوفر أنتركم بالفيديو يعمل عبر الموبايل؟", a: "نعم، أنظمة IP الحديثة تتيح الرد من الموبايل عبر تطبيق مخصص." },
      { q: "هل يمكن ربط الأنتركم بنظام الكاميرات؟", a: "نعم، يمكن دمج الأنتركم مع كاميرات المراقبة في نظام موحد." },
      { q: "هل يقدم المول خدمة التركيب؟", a: "نعم، توجد فرق متخصصة في تركيب الأنظمة الأمنية والتدريب على استخدامها." },
    ],
    relatedSlugs: ["cameras", "accessories", "networking", "routers"],
  },

  "smart-lighting": {
    slug: "smart-lighting",
    labelAr: "إضاءة ذكية",
    labelEn: "Smart Lighting",
    Icon: Lightbulb,
    parentCategory: CAT.networking,
    orbit: "outer",
    productKeywords: ["إضاءة ذكية", "smart bulb", "philips hue"],
    seo: {
      title: "إضاءة ذكية وأجهزة منزل ذكي في مول البستان",
      description: "لمبات ذكية وشرائح LED وأنظمة منزل ذكي من Philips Hue و Xiaomi و Yeelight في مول البستان، التجمع الخامس.",
      keywords: "إضاءة ذكية, smart home, philips hue, xiaomi, yeelight, مول البستان",
    },
    intro:
      "يقدم مول البستان حلول الإضاءة الذكية والمنزل الذكي لتحويل المنزل التقليدي إلى منزل عصري مؤتمت. تشمل التشكيلة لمبات ذكية بألوان RGB قابلة للتحكم بالموبايل والصوت، وشرائح LED لإضاءة المحيط، وأنظمة Philips Hue الكاملة، ومفاتيح ذكية وأجهزة استشعار. تتكامل الأجهزة مع المساعدات الصوتية Google Assistant و Alexa و Siri، مع توفر مراكز تحكم Hub لإدارة المنظومة. تخدم المنازل والمكاتب والمحلات والمطاعم.",
    faq: [
      { q: "هل تحتاج للمبات ذكية إنترنت؟", a: "نعم، تعمل عبر الواي فاي، وبعضها يدعم Bluetooth بدون إنترنت." },
      { q: "هل يمكن التحكم بالصوت؟", a: "نعم، تدعم Google Assistant و Alexa و Siri." },
      { q: "هل تستهلك كهرباء أكثر؟", a: "لا، الـ LED أكفأ بكثير من اللمبات التقليدية وأطول عمراً." },
    ],
    relatedSlugs: ["cameras", "intercoms", "speakers", "televisions"],
  },

  "security-cameras": {
    slug: "security-cameras",
    labelAr: "كاميرات مراقبة",
    labelEn: "Security Cameras",
    Icon: ShieldCheck,
    parentCategory: CAT.networking,
    orbit: "outer",
    productKeywords: ["كاميرا مراقبة", "cctv", "security camera"],
    seo: {
      title: "كاميرات مراقبة CCTV و IP في مول البستان",
      description: "كاميرات مراقبة IP و CCTV وأنظمة DVR/NVR من Hikvision و Dahua و Imou في مول البستان، التجمع الخامس، مع خدمة التركيب.",
      keywords: "كاميرات مراقبة, cctv, ip camera, hikvision, dahua, مول البستان",
    },
    intro:
      "تقدم محلات الأنظمة الأمنية في مول البستان حلول مراقبة شاملة للمنازل والمحلات والشركات والمصانع. تشمل التشكيلة كاميرات IP بدقة 4K وكاميرات Bullet للأماكن الخارجية بمقاومة المياه IP67، وكاميرات Dome للأماكن الداخلية، وكاميرات PTZ المتحركة، وكاميرات الواي فاي اللاسلكية للمنازل. تشمل العلامات Hikvision و Dahua و Imou و Reolink. تشمل المنظومة أنظمة التسجيل DVR/NVR والشاشات وكابلات التركيب، مع خدمة تركيب احترافية.",
    faq: [
      { q: "كم كاميرا أحتاج للمنزل؟", a: "عادة 4-8 كاميرات تكفي لتغطية الواجهات والمداخل الرئيسية." },
      { q: "هل تعمل الكاميرات في الظلام؟", a: "نعم، الكاميرات الحديثة تدعم الرؤية الليلية والـ Color Night Vision." },
      { q: "هل يمكن المتابعة من الموبايل؟", a: "نعم، جميع الكاميرات الحديثة تدعم تطبيقات الموبايل عن بعد." },
    ],
    relatedSlugs: ["intercoms", "networking", "accessories", "ups"],
  },

  "pc-components": {
    slug: "pc-components",
    labelAr: "مكونات الكمبيوتر",
    labelEn: "PC Components",
    Icon: CircuitBoard,
    parentCategory: CAT.computers,
    orbit: "outer",
    productKeywords: ["لوحة أم", "motherboard", "psu", "case"],
    seo: {
      title: "مكونات الكمبيوتر — لوحات أم و Cases في مول البستان",
      description: "لوحات أم Motherboards و Power Supplies و Cases و Cooling من ASUS و MSI و Gigabyte في مول البستان، التجمع الخامس.",
      keywords: "لوحة أم, motherboard, psu, case, مكونات كمبيوتر, مول البستان",
    },
    intro:
      "يضم مول البستان أكبر تجمّع لمكونات الكمبيوتر في القاهرة الجديدة، حيث يجد المحترفون والمحبون كل ما يحتاجونه لتجميع جهاز كمبيوتر مخصص. تشمل التشكيلة اللوحات الأم لمعالجات Intel و AMD بمختلف الـ Chipsets، وكروت الشاشة GPU من NVIDIA و AMD، ووحدات الطاقة PSU بقدرات 500W حتى 1600W من Corsair و EVGA و Seasonic، وكيسات الكمبيوتر بتصميمات RGB من NZXT و Lian Li و Cooler Master. تقدم المحلات خدمة تجميع كاملة مع اختبار الأداء.",
    faq: [
      { q: "هل تقدمون خدمة تجميع كمبيوتر مخصص؟", a: "نعم، خدمة كاملة من اختيار المكونات إلى التجميع والاختبار." },
      { q: "ما الفرق بين Motherboards بـ Z و B؟", a: "Z يدعم Overclocking، B أرخص ويناسب الاستخدام العادي." },
      { q: "كم وات أحتاج للجهاز؟", a: "يعتمد على المعالج والكارت، عادة 650-850W تكفي لمعظم الأنظمة." },
    ],
    relatedSlugs: ["cpus", "ram", "storage", "cooling"],
  },

  cooling: {
    slug: "cooling",
    labelAr: "تبريد",
    labelEn: "Cooling Systems",
    Icon: Fan,
    parentCategory: CAT.computers,
    orbit: "outer",
    productKeywords: ["تبريد", "cooling", "aio", "fan"],
    seo: {
      title: "أنظمة تبريد هواء ومائي في مول البستان",
      description: "مبردات معالج هواء و AIO Liquid Cooler ومراوح Case RGB من Corsair و NZXT و Noctua في مول البستان، التجمع الخامس.",
      keywords: "تبريد, cooling, aio, liquid cooling, fans, مول البستان",
    },
    intro:
      "تقدم محلات مول البستان حلول التبريد الشاملة لأجهزة الكمبيوتر، شاملةً مبردات الهواء التقليدية بمراوح ومشتتات حرارية بأحجام متنوعة من Noctua و Cooler Master و be quiet!، وأنظمة التبريد المائي AIO بأحجام رادياتير 240/280/360 ملم من Corsair و NZXT و EK، إلى جانب مراوح الـ Case بإضاءة RGB قابلة للتخصيص. تتوفر معاجين التبريد الحرارية وأطقم التركيب لمختلف السوكتات. تقدم المحلات خدمة التركيب والصيانة الدورية لأنظمة التبريد.",
    faq: [
      { q: "هل التبريد المائي أفضل؟", a: "نعم، يوفر تبريد أكفأ للمعالجات عالية الأداء، لكن أعلى تكلفة." },
      { q: "هل أحتاج تغيير معجون التبريد دورياً؟", a: "كل 2-3 سنوات لضمان أفضل أداء حراري." },
      { q: "ما عدد المراوح المثالي للـ Case؟", a: "عادة 3-5 مراوح، 2-3 لإدخال الهواء و 2 للإخراج." },
    ],
    relatedSlugs: ["cpus", "ram"],
  },

  "power-adapters": {
    slug: "power-adapters",
    labelAr: "محولات وموزعات",
    labelEn: "Power Adapters",
    Icon: PlugZap,
    parentCategory: CAT.phones,
    orbit: "outer",
    productKeywords: ["محول", "adapter", "موزع", "extension"],
    seo: {
      title: "محولات كهرباء وموزعات احترافية في مول البستان",
      description: "محولات كهرباء وموزعات Surge Protector وأسلاك تطويل من APC و UGREEN في مول البستان، التجمع الخامس.",
      keywords: "محولات, موزعات, surge protector, مول البستان",
    },
    intro:
      "تتوفر في مول البستان محولات الكهرباء والموزعات للاستخدام المنزلي والمكتبي. تشمل التشكيلة محولات الفيش الأجنبي إلى المصري والعكس، وموزعات Surge Protector لحماية الأجهزة من ارتفاع الجهد، وأسلاك تطويل بأطوال مختلفة، ومحولات USB للسيارة. تتوفر علامات APC و UGREEN و Anker مع ضمان جودة وحماية ضد الحريق.",
    faq: [
      { q: "ما فائدة Surge Protector؟", a: "يحمي الأجهزة من تذبذب الجهد المفاجئ والصواعق." },
      { q: "هل المحولات آمنة للأجهزة الحساسة؟", a: "نعم، المعتمدة منها بمعايير الأمان آمنة لكل الأجهزة." },
      { q: "هل تتوفر موزعات USB؟", a: "نعم، تتوفر موزعات بمنافذ USB-A و USB-C مدمجة." },
    ],
    relatedSlugs: ["chargers", "cables", "ups", "powerbanks"],
  },

  // ─── Curated extras (commonly searched) ───

  "gaming-laptops": {
    slug: "gaming-laptops",
    labelAr: "لابتوبات جيمنج",
    labelEn: "Gaming Laptops",
    Icon: Laptop,
    parentCategory: CAT.computers,
    orbit: "inner",
    productKeywords: ["gaming", "rog", "ستريكس", "strix", "predator", "legion", "tuf", "victus", "اتش بي فيكتوس", "للألعاب"],
    seo: {
      title: "لابتوبات جيمنج في مول البستان — أداء عالٍ بضمان",
      description: "لابتوبات جيمنج RTX 40 Series من ASUS ROG و MSI و Lenovo Legion و Acer Predator في مول البستان، التجمع الخامس.",
      keywords: "لابتوب جيمنج, gaming laptop, rog, predator, legion, rtx, مول البستان",
    },
    intro:
      "يضم مول البستان متخصصين في لابتوبات الجيمنج عالية الأداء، حيث تتوفر أحدث الموديلات بمعالجات Intel Core الجيل 13 و 14 و AMD Ryzen 7000، وكروت شاشة NVIDIA RTX 40 Series. تشمل العلامات الرائدة ASUS ROG و MSI Raider و Lenovo Legion و Acer Predator و HP OMEN و Razer Blade. تتميز هذه الأجهزة بشاشات عالية معدل التحديث 144Hz فأعلى، وأنظمة تبريد متقدمة، ولوحات مفاتيح RGB. تقدم المحلات استشارات لاختيار الجهاز المناسب لميزانية كل لاعب ونوع الألعاب المفضلة.",
    faq: [
      { q: "ما الفرق بين RTX 4060 و 4070؟", a: "4070 أقوى بنسبة 25-30% للألعاب بدقة عالية، لكن أعلى سعراً." },
      { q: "هل اللابتوبات قابلة للترقية؟", a: "نعم، الرام والتخزين قابلان للترقية في معظم الموديلات." },
      { q: "كم عمر بطارية لابتوب الجيمنج؟", a: "عادة 4-7 ساعات للأعمال العادية، أقل بكثير أثناء الجيمنج." },
    ],
    relatedSlugs: ["laptops", "monitors", "cpus", "controllers", "cooling"],
  },

  macbook: {
    slug: "macbook",
    labelAr: "أجهزة MacBook",
    labelEn: "MacBook",
    Icon: Laptop,
    parentCategory: CAT.computers,
    orbit: "inner",
    productKeywords: ["macbook", "apple", " mac ", "ماك بوك", "macbook air", "macbook pro"],
    seo: {
      title: "MacBook Pro و Air أصلية بضمان في مول البستان",
      description: "أجهزة MacBook Air و MacBook Pro بمعالج M2 و M3 أصلية بضمان Apple معتمد في مول البستان، التجمع الخامس.",
      keywords: "macbook, macbook pro, macbook air, apple, m2, m3, مول البستان",
    },
    intro:
      "تتوفر في مول البستان أجهزة MacBook الأصلية بأحدث معالجات Apple M-Series. تشمل التشكيلة MacBook Air بمعالج M2 و M3 المثالي للطلاب والمحترفين، و MacBook Pro 14 و 16 بوصة بمعالج M3 Pro و Max للمصممين ومحرري الفيديو. جميع الأجهزة بضمان Apple معتمد دولياً، مع توفر إكسسوارات MagSafe والشواحن الأصلية، وأقلام Apple Pencil والـ Magic Keyboard. تقدم المحلات استشارات لاختيار الفئة المناسبة وفق نوع العمل وحجم الذاكرة.",
    faq: [
      { q: "ما الفرق بين Air و Pro؟", a: "Air أخف وأرخص للأعمال اليومية، Pro للأعمال الاحترافية الثقيلة." },
      { q: "هل ضمان Apple معتمد في مصر؟", a: "نعم، الأجهزة الأصلية بضمان دولي معتمد." },
      { q: "هل يمكن ترقية الذاكرة لاحقاً؟", a: "لا، يجب اختيار الذاكرة عند الشراء لأنها مدمجة بالمعالج." },
    ],
    relatedSlugs: ["laptops", "monitors", "tablets", "smartphones"],
  },

  "graphics-cards": {
    slug: "graphics-cards",
    labelAr: "كروت الشاشة",
    labelEn: "Graphics Cards",
    Icon: CircuitBoard,
    parentCategory: CAT.computers,
    orbit: "middle",
    productKeywords: ["كارت شاشة", "gpu", "rtx", "rx", "geforce"],
    seo: {
      title: "كروت شاشة NVIDIA RTX و AMD Radeon في مول البستان",
      description: "كروت شاشة NVIDIA RTX 40 Series و AMD Radeon RX 7000 للجيمنج وتحرير الفيديو في مول البستان، التجمع الخامس.",
      keywords: "كارت شاشة, gpu, rtx 4090, rtx 4080, radeon, مول البستان",
    },
    intro:
      "تجد في مول البستان أحدث كروت الشاشة من NVIDIA GeForce RTX 40 Series و AMD Radeon RX 7000 Series، بمختلف الفئات والإصدارات من الشركات المصنعة ASUS ROG و MSI Gaming و Gigabyte AORUS و Sapphire و PowerColor. تشمل التشكيلة كروت الفئة المتوسطة المناسبة لجيمنج 1080p/1440p مثل RTX 4060 و RX 7600، والفئة العليا للجيمنج 4K والـ Ray Tracing مثل RTX 4080 و 4090 و RX 7900 XTX. تقدم المحلات خدمة التركيب وضبط الـ BIOS والاختبار.",
    faq: [
      { q: "هل أحتاج كارت شاشة لأعمال التصميم؟", a: "نعم، خاصة لتحرير الفيديو والـ 3D Rendering و Machine Learning." },
      { q: "ما الفرق بين Ti و Super؟", a: "Ti أقوى من العادي، Super بين العادي والـ Ti في الأداء." },
      { q: "هل تشمل خدمة التركيب؟", a: "نعم، خدمة التركيب وضبط البرامج والـ Drivers مشمولة." },
    ],
    relatedSlugs: ["cpus", "ram", "monitors", "laptops"],
  },

  earbuds: {
    slug: "earbuds",
    labelAr: "سماعات أذن لاسلكية",
    labelEn: "Wireless Earbuds",
    Icon: Headphones,
    parentCategory: CAT.phones,
    orbit: "outer",
    productKeywords: ["airpods", "ايربودز", "earbuds", "buds", "بادز", "galaxy buds"],
    seo: {
      title: "سماعات أذن لاسلكية AirPods و Galaxy Buds في مول البستان",
      description: "AirPods Pro و Galaxy Buds و Anker و JBL و Sony WF-1000XM لاسلكية بعزل ضوضاء في مول البستان، التجمع الخامس.",
      keywords: "earbuds, airpods, galaxy buds, anker, jbl, مول البستان",
    },
    intro:
      "تتوفر في مول البستان مجموعة كبيرة من سماعات الأذن اللاسلكية TWS لجميع الأذواق والميزانيات. تشمل التشكيلة AirPods Pro و AirPods 3 من Apple، و Galaxy Buds Pro من Samsung، و Sony WF-1000XM5، و Anker Soundcore، و JBL Tune. تقدم هذه السماعات ميزات متقدمة مثل عزل الضوضاء النشط ANC، وعلبة شحن لاسلكية، ومقاومة للماء والعرق IPX4-IPX7، ودعم Spatial Audio. تتميز بخفة الوزن وعمر بطارية يصل إلى 8 ساعات بدون العلبة.",
    faq: [
      { q: "هل AirPods تعمل على Android؟", a: "تعمل لكن بعض الميزات مثل Find My ستكون محدودة." },
      { q: "ما الفرق بين Pro والإصدار العادي؟", a: "Pro يدعم عزل الضوضاء النشط ودعم أفضل للصوت." },
      { q: "هل تتحمل العرق أثناء الرياضة؟", a: "نعم، أغلب الموديلات بمقاومة IPX4 فأكثر تتحمل العرق." },
    ],
    relatedSlugs: ["headphones", "smartphones", "smartwatches", "speakers"],
  },

  powerbanks: {
    slug: "powerbanks",
    labelAr: "باور بانك",
    labelEn: "Power Banks",
    Icon: BatteryCharging,
    parentCategory: CAT.phones,
    orbit: "outer",
    productKeywords: ["باور بانك", "power bank", "بطارية محمولة"],
    seo: {
      title: "باور بانك بطاريات محمولة سريعة في مول البستان",
      description: "باور بانك بسعات 10000-30000mAh مع شحن سريع PD و Quick Charge من Anker و Baseus في مول البستان، التجمع الخامس.",
      keywords: "باور بانك, power bank, بطارية محمولة, anker, baseus, مول البستان",
    },
    intro:
      "يضم مول البستان مجموعة شاملة من البطاريات المحمولة Power Banks لشحن الأجهزة في أي مكان. تشمل التشكيلة باور بانك خفيف 10000mAh للاستخدام اليومي، وبطاريات 20000mAh متوسطة الحجم للسفر، وبطاريات كبيرة 30000mAh للرحلات الطويلة، وبطاريات MagSafe لاسلكية لأجهزة iPhone. تدعم تقنيات الشحن السريع PD 100W و Quick Charge 5، مع شاشات OLED لعرض البطارية المتبقية. تشمل العلامات Anker و Baseus و UGREEN و Xiaomi.",
    faq: [
      { q: "هل يمكن أخذ Power Bank في الطائرة؟", a: "نعم، حتى 27000mAh مسموح في الحقيبة المحمولة." },
      { q: "ما تقنية PD؟", a: "Power Delivery تقنية شحن سريع تصل حتى 240W." },
      { q: "كم مرة يشحن الموبايل من باور 20000؟", a: "عادة 4-5 مرات للموبايلات بسعة بطارية 4000-5000mAh." },
    ],
    relatedSlugs: ["chargers", "cables", "smartphones", "tablets"],
  },

  "vr-gaming": {
    slug: "vr-gaming",
    labelAr: "نظارات الواقع الافتراضي",
    labelEn: "VR Gaming",
    Icon: Joystick,
    parentCategory: CAT.gaming,
    orbit: "outer",
    productKeywords: ["vr", "meta quest", "oculus"],
    seo: {
      title: "نظارات الواقع الافتراضي VR في مول البستان",
      description: "نظارات Meta Quest 3 و PlayStation VR2 و HTC Vive للواقع الافتراضي في مول البستان، التجمع الخامس.",
      keywords: "vr, واقع افتراضي, meta quest, oculus, psvr, مول البستان",
    },
    intro:
      "تتوفر في مول البستان أحدث نظارات الواقع الافتراضي للجيمنج والترفيه. تشمل التشكيلة Meta Quest 3 المستقلة بدون كمبيوتر، و PlayStation VR2 لأجهزة PS5، و HTC Vive Pro 2 للاستخدام مع الكمبيوتر. تقدم تجربة غامرة في الألعاب والمحاكيات وحتى التطبيقات التعليمية. تتوفر إكسسوارات داعمة من أحزمة الرأس المحسنة وحقائب الحمل.",
    faq: [
      { q: "هل أحتاج كمبيوتر قوي للـ VR؟", a: "Meta Quest مستقلة، أما PCVR يحتاج كمبيوتر بكارت RTX 3060 فأعلى." },
      { q: "هل تسبب دوار؟", a: "في البداية قد يحدث، لكن يقل مع الاعتياد على الألعاب." },
      { q: "هل تتوفر ألعاب عربية؟", a: "تطبيقات قليلة مدبلجة، لكن الواجهات تدعم العربية." },
    ],
    relatedSlugs: ["controllers", "laptops", "headphones"],
  },

  "office-supplies": {
    slug: "office-supplies",
    labelAr: "مستلزمات مكاتب",
    labelEn: "Office Supplies",
    Icon: ScanLine,
    parentCategory: CAT.printing,
    orbit: "outer",
    productKeywords: ["مكتب", "office", "stationery"],
    seo: {
      title: "مستلزمات مكاتب في مول البستان",
      description: "ورق طباعة ومستلزمات مكتبية وأحبار وكروت Toner أصلية للمكاتب والشركات في مول البستان، التجمع الخامس.",
      keywords: "مستلزمات مكتب, ورق طباعة, أحبار, toner, مول البستان",
    },
    intro:
      "تقدم محلات مول البستان مستلزمات المكاتب والشركات بأسعار جملة. تشمل التشكيلة ورق الطباعة بأنواعه (A4, A3) وأحبار الطابعات الأصلية وكروت الـ Toner، إلى جانب كراسات وأقلام ودفاتر مذكرات احترافية، وأرفف ومنظمات مكتبية، وحوامل شاشات وستاندات لابتوب لتحسين بيئة العمل. خدمة توصيل للشركات الكبيرة متاحة عند الطلب بكميات.",
    faq: [
      { q: "هل تتوفر خدمة توصيل للشركات؟", a: "نعم، عند الطلب بكميات كبيرة تتوفر خدمة توصيل مجاني." },
      { q: "هل الأحبار أصلية؟", a: "نعم، الأحبار وكروت Toner أصلية بضمان جودة طباعة." },
      { q: "هل تتوفر كراسات بشعار الشركة؟", a: "نعم، خدمة الطباعة المخصصة متوفرة بحد أدنى للكميات." },
    ],
    relatedSlugs: ["printers", "scanners", "accessories"],
  },

  "streaming-gear": {
    slug: "streaming-gear",
    labelAr: "معدات البث المباشر",
    labelEn: "Streaming Gear",
    Icon: Webcam,
    parentCategory: CAT.printing,
    orbit: "outer",
    productKeywords: ["streaming", "elgato", "stream deck"],
    seo: {
      title: "معدات البث المباشر للستريمر في مول البستان",
      description: "كاميرات بث وميكروفونات Stream Deck و Capture Card من Elgato و Razer في مول البستان، التجمع الخامس.",
      keywords: "streaming, elgato, stream deck, capture card, مول البستان",
    },
    intro:
      "تتوفر في مول البستان معدات احترافية للبث المباشر على Twitch و YouTube و Facebook. تشمل التشكيلة Capture Cards لبث ألعاب الكونسول من Elgato و AVerMedia، و Stream Deck لتنظيم البث وإدارة المشاهد، وكاميرات بث 4K، وحلقات إضاءة LED، وميكروفونات احترافية، وخلفيات Green Screen. تقدم المحلات استشارات لإعداد استوديو بث متكامل من الصفر.",
    faq: [
      { q: "هل أحتاج Capture Card لبث الكونسول؟", a: "نعم، لربط PS5 و Xbox بالكمبيوتر للبث." },
      { q: "ما فائدة Stream Deck؟", a: "يسرع التحكم بالمشاهد والمؤثرات بزر واحد." },
      { q: "ما حلقة الإضاءة المناسبة؟", a: "حلقة LED 18 بوصة بثلاث درجات حرارة لون مناسبة لمعظم الاستخدامات." },
    ],
    relatedSlugs: ["webcams", "microphones", "cameras", "monitors"],
  },
};

/** Convenience: ordered slug list for sitemap and navigation generators. */
export const allDeviceSlugs = Object.keys(deviceCatalog);

/** Lookup by slug; returns undefined when not found. */
export function getDeviceBySlug(slug: string): DeviceEntry | undefined {
  return deviceCatalog[slug];
}
