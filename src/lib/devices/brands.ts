/**
 * Brand registry per device family.
 * Each brand has a slug-safe key and an Arabic display label.
 * Series text is woven into the generated intro for unique, credible content.
 */

export interface BrandInfo {
  key: string;       // slug-safe (lowercase a-z, dashes)
  labelEn: string;   // "Dell"
  labelAr: string;   // "ديل"
  series?: string;   // freeform Arabic prose listing notable series/models
}

const B = (key: string, labelEn: string, labelAr: string, series?: string): BrandInfo => ({
  key, labelEn, labelAr, series,
});

/** Major laptop brands (≈ 10) */
export const LAPTOP_BRANDS: BrandInfo[] = [
  B("dell", "Dell", "ديل", "تشمل سلاسل XPS الفاخرة و Latitude للأعمال و Inspiron العائلية و Vostro للشركات الناشئة و Alienware للجيمنج المتقدم و Precision لمحطات العمل."),
  B("hp", "HP", "اتش بي", "تشمل سلاسل EliteBook للأعمال و ProBook للشركات و Pavilion العائلية و Omen و Victus للجيمنج و ZBook لمحطات العمل."),
  B("lenovo", "Lenovo", "لينوفو", "تشمل سلاسل ThinkPad الأسطورية للأعمال و IdeaPad للاستخدام اليومي و Legion للجيمنج و Yoga القابلة للتحويل و ThinkBook للشركات."),
  B("asus", "Asus", "اسوس", "تشمل سلاسل ZenBook الأنيقة و VivoBook العملية و ROG و TUF للجيمنج و ProArt لمحترفي الإبداع و ExpertBook للأعمال."),
  B("acer", "Acer", "ايسر", "تشمل سلاسل Aspire الاقتصادية و Swift النحيفة و Predator و Nitro للجيمنج و TravelMate للأعمال و ConceptD للمصممين."),
  B("msi", "MSI", "إم إس آي", "تشمل سلاسل GE و GP و GS و Stealth للجيمنج المتقدم و Modern للأعمال و Creator لمحترفي الفيديو."),
  B("apple", "Apple", "آبل", "تشمل MacBook Air بمعالجات M2 و M3 و MacBook Pro 14 و 16 بوصة بمعالجات M3 Pro و M3 Max لمحترفي التصميم والفيديو."),
  B("huawei", "Huawei", "هواوي", "تشمل سلسلة MateBook X Pro و MateBook D و MateBook 14 بتصميم نحيف وأداء مكتبي قوي."),
  B("samsung", "Samsung", "سامسونج", "تشمل سلسلة Galaxy Book Pro و Galaxy Book Flex بشاشات AMOLED وتكامل ممتاز مع هواتف Galaxy."),
  B("microsoft", "Microsoft", "مايكروسوفت", "تشمل سلسلة Surface Laptop و Surface Pro القابلة للتحويل و Surface Book بتصميم احترافي."),
];

/** Major smartphone brands (≈ 12) */
export const PHONE_BRANDS: BrandInfo[] = [
  B("apple", "Apple", "آبل", "تشمل أحدث إصدارات iPhone 15 و iPhone 15 Pro و iPhone 15 Pro Max وإصدارات iPhone 14 و iPhone SE."),
  B("samsung", "Samsung", "سامسونج", "تشمل سلاسل Galaxy S24 Ultra و S24+ و Galaxy Z Fold5 و Z Flip5 القابلة للطي و Galaxy A لفئة المتوسطة."),
  B("xiaomi", "Xiaomi", "شاومي", "تشمل سلاسل Xiaomi 14 و 14 Pro و Redmi Note 13 Pro و POCO X6 و POCO F6 بمواصفات قوية وأسعار تنافسية."),
  B("oppo", "Oppo", "أوبو", "تشمل سلسلة Find X7 الفاخرة و Reno 11 الأنيقة و A-series للفئة الاقتصادية بتصميم أنيق وكاميرات احترافية."),
  B("realme", "Realme", "ريلمي", "تشمل سلاسل GT 5 Pro و Realme 12 و Narzo بأداء قوي وأسعار في المتناول للشباب."),
  B("honor", "Honor", "هونر", "تشمل سلسلة Magic 6 Pro الفاخرة و Honor 90 و X9b بكاميرات متقدمة وشاشات AMOLED."),
  B("vivo", "Vivo", "فيفو", "تشمل سلاسل X100 Pro الفاخرة و V30 و Y-series بكاميرات احترافية بتعاون ZEISS."),
  B("infinix", "Infinix", "إنفينكس", "تشمل سلاسل Note 40 Pro و Hot 40 و Zero 30 5G بأسعار اقتصادية ومواصفات جيدة للفئة المتوسطة."),
  B("tecno", "Tecno", "تكنو", "تشمل سلاسل Camon 30 و Spark 20 و Pova 6 بكاميرات قوية وبطاريات تدوم طويلاً."),
  B("nokia", "Nokia", "نوكيا", "تشمل سلسلة G و C الاقتصادية و XR للفئة الاحترافية بتصميم متين وعمر بطارية ممتاز."),
  B("huawei", "Huawei", "هواوي", "تشمل سلاسل P60 Pro و Mate 60 Pro و Nova 12 بتصميم متميز وكاميرات Leica احترافية."),
  B("google", "Google", "جوجل", "تشمل Pixel 8 و Pixel 8 Pro بمعالج Tensor G3 وكاميرات تعتمد على الذكاء الاصطناعي."),
];

/** Monitor brands */
export const MONITOR_BRANDS: BrandInfo[] = [
  B("lg", "LG", "إل جي", "شاشات UltraGear للجيمنج و UltraFine للمحترفين بدقة 4K و 5K."),
  B("samsung", "Samsung", "سامسونج", "شاشات Odyssey للجيمنج و ViewFinity للأعمال و Smart Monitor متعددة الاستخدامات."),
  B("dell", "Dell", "ديل", "شاشات UltraSharp للمحترفين و Alienware للجيمنج التنافسي."),
  B("asus", "Asus", "اسوس", "شاشات ROG Swift للجيمنج و ProArt للمصممين و TUF Gaming الاقتصادية."),
  B("benq", "BenQ", "بن كيو", "شاشات PD للمصممين و EX للجيمنج و SW للمصورين بمعايرة ألوان دقيقة."),
  B("msi", "MSI", "إم إس آي", "شاشات MAG و MPG للجيمنج بمعدلات تحديث عالية حتى 240Hz."),
  B("aoc", "AOC", "إيه أو سي", "شاشات Agon للجيمنج وشاشات منحنية بأسعار اقتصادية."),
  B("philips", "Philips", "فيليبس", "شاشات Brilliance للأعمال و Momentum للجيمنج و Evnia المنحنية."),
];

/** Printer brands */
export const PRINTER_BRANDS: BrandInfo[] = [
  B("hp", "HP", "اتش بي", "تشمل سلاسل LaserJet Pro و OfficeJet و DeskJet و Smart Tank بأنظمة حبر اقتصادية."),
  B("canon", "Canon", "كانون", "تشمل سلاسل PIXMA و imageCLASS و MAXIFY للأعمال و SELPHY للصور."),
  B("epson", "Epson", "إبسون", "تشمل سلاسل EcoTank بخزانات حبر كبيرة و WorkForce للأعمال و SureColor للطباعة الاحترافية."),
  B("brother", "Brother", "براذر", "تشمل سلاسل HL و MFC الليزرية متعددة المهام للمكاتب الصغيرة."),
  B("samsung", "Samsung", "سامسونج", "تشمل سلسلة Xpress الليزرية و ProXpress للأعمال."),
  B("xerox", "Xerox", "زيروكس", "تشمل سلسلة Phaser و WorkCentre لطباعة المؤسسات بكميات كبيرة."),
];

/** Network device brands */
export const NETWORK_BRANDS: BrandInfo[] = [
  B("tp-link", "TP-Link", "تي بي لينك", "تشمل سلاسل Archer للراوتر المنزلي و Deco لشبكات Mesh و Omada للشركات."),
  B("asus", "Asus", "اسوس", "تشمل سلاسل ROG Rapture للجيمنج و RT-AX للمنازل الكبيرة و ZenWiFi للشبكات الموزعة."),
  B("d-link", "D-Link", "دي لينك", "تشمل سلاسل DIR و DSL للراوتر المنزلي و COVR لشبكات Mesh."),
  B("netgear", "Netgear", "نتجير", "تشمل سلاسل Nighthawk للجيمنج و Orbi لشبكات Mesh و Insight للأعمال."),
  B("mikrotik", "MikroTik", "ميكروتيك", "أجهزة احترافية للشبكات السلكية واللاسلكية وحلول ISP المتقدمة."),
  B("cisco", "Cisco", "سيسكو", "أجهزة شبكات للشركات والمؤسسات وسويتشات Catalyst وحلول الأمن المتكاملة."),
  B("ubiquiti", "Ubiquiti", "يوبيكويتي", "تشمل UniFi لشبكات الشركات و AmpliFi للمنازل و EdgeRouter."),
  B("huawei", "Huawei", "هواوي", "أجهزة AX3 و AX6 للراوتر المنزلي وحلول شبكات للأعمال."),
];

/** SSD/HDD storage brands */
export const STORAGE_BRANDS: BrandInfo[] = [
  B("samsung", "Samsung", "سامسونج", "تشمل سلسلة 990 Pro و 980 Pro NVMe و 870 EVO SATA للأداء العالي."),
  B("western-digital", "Western Digital", "ويسترن ديجيتال", "تشمل WD Black للجيمنج و WD Red للنازات و WD Blue للاستخدام العام."),
  B("seagate", "Seagate", "سيجيت", "تشمل Barracuda للأداء و IronWolf للنازات و FireCuda للجيمنج."),
  B("kingston", "Kingston", "كينجستون", "تشمل KC3000 و NV2 NVMe و A400 SATA بأسعار اقتصادية."),
  B("crucial", "Crucial", "كروشال", "تشمل T700 و P3 NVMe و MX500 SATA بضمان طويل."),
  B("sandisk", "SanDisk", "ساندسك", "تشمل Extreme Pro و Ultra للتخزين الخارجي والمحمول."),
];

/** Headphone / audio brands */
export const HEADPHONE_BRANDS: BrandInfo[] = [
  B("sony", "Sony", "سوني", "تشمل WH-1000XM5 الرائدة في عزل الضوضاء و WF-1000XM5 و LinkBuds لاسلكية."),
  B("apple", "Apple", "آبل", "تشمل AirPods Pro 2 و AirPods Max و AirPods 3 بتكامل ممتاز مع iPhone."),
  B("samsung", "Samsung", "سامسونج", "تشمل Galaxy Buds 2 Pro و Galaxy Buds FE بصوت AKG وعزل ضوضاء نشط."),
  B("jbl", "JBL", "جي بي إل", "تشمل سلسلة Tour Pro 2 و Live و Tune بصوت قوي وأسعار متنوعة."),
  B("bose", "Bose", "بوز", "تشمل QuietComfort Ultra و Bose 700 رواد عزل الضوضاء."),
  B("sennheiser", "Sennheiser", "سينهايزر", "تشمل Momentum 4 و HD 660S للمحترفين بصوت طبيعي عالي الدقة."),
  B("anker", "Anker", "أنكر", "تشمل سلسلة Soundcore Liberty و Space One بأسعار اقتصادية وعزل ضوضاء جيد."),
  B("hyperx", "HyperX", "هايبر إكس", "تشمل سلسلة Cloud III و Cloud Alpha لسماعات الجيمنج بميكروفون واضح."),
];

/** Camera brands */
export const CAMERA_BRANDS: BrandInfo[] = [
  B("canon", "Canon", "كانون", "تشمل EOS R5 و R6 Mark II و EOS R8 mirrorless و EOS 90D DSLR."),
  B("sony", "Sony", "سوني", "تشمل Alpha A7 IV و A7R V و ZV-E10 للمصورين والـ vloggers."),
  B("nikon", "Nikon", "نيكون", "تشمل Z8 و Z6 II mirrorless و D850 DSLR احترافية."),
  B("fujifilm", "Fujifilm", "فوجي فيلم", "تشمل X-T5 و X-S20 و X100V بمحاكاة الأفلام الكلاسيكية."),
  B("panasonic", "Panasonic", "باناسونيك", "تشمل Lumix S5 II و GH6 لمحترفي الفيديو."),
  B("gopro", "GoPro", "جو برو", "تشمل HERO12 Black و HERO11 Mini كاميرات حركة ضد الماء."),
  B("dji", "DJI", "دي جي آي", "تشمل Osmo Pocket 3 و Osmo Action 4 للمحتوى الرقمي."),
];

/** Mouse/keyboard brands */
export const PERIPHERAL_BRANDS: BrandInfo[] = [
  B("logitech", "Logitech", "لوجيتك", "تشمل MX Master 3S و G Pro X Superlight للجيمنج و MX Keys للكتابة."),
  B("razer", "Razer", "ريزر", "تشمل DeathAdder V3 Pro و BlackWidow V4 و Huntsman للجيمنج التنافسي."),
  B("corsair", "Corsair", "كورسير", "تشمل K70 و K100 RGB للكيبورد و M65 و Scimitar للماوس."),
  B("steelseries", "SteelSeries", "ستيل سيريز", "تشمل Apex Pro و Aerox 9 و Arctis Nova للجيمنج."),
  B("hyperx", "HyperX", "هايبر إكس", "تشمل Alloy Origins و Pulsefire Haste بسويتشات سريعة."),
  B("keychron", "Keychron", "كيكرون", "تشمل Q-series و K-series كيبوردات ميكانيكية بأحرف عربية."),
];

/** Tablet brands */
export const TABLET_BRANDS: BrandInfo[] = [
  B("apple", "Apple", "آبل", "تشمل iPad Pro M2 و iPad Air و iPad mini و iPad للطلاب بأسعار متنوعة."),
  B("samsung", "Samsung", "سامسونج", "تشمل Galaxy Tab S9 Ultra و Tab S9+ و Tab A9 بشاشات AMOLED وقلم S Pen."),
  B("huawei", "Huawei", "هواوي", "تشمل MatePad Pro 13 و MatePad 11 بأداء قوي وقلم M-Pencil."),
  B("xiaomi", "Xiaomi", "شاومي", "تشمل Pad 6 و Redmi Pad SE بأسعار اقتصادية ومواصفات جيدة."),
  B("lenovo", "Lenovo", "لينوفو", "تشمل Tab P12 و Tab M10 للترفيه العائلي بأسعار في المتناول."),
];

/** Smartwatch brands */
export const SMARTWATCH_BRANDS: BrandInfo[] = [
  B("apple", "Apple", "آبل", "تشمل Apple Watch Series 9 و Ultra 2 و SE بقياسات صحية متقدمة."),
  B("samsung", "Samsung", "سامسونج", "تشمل Galaxy Watch 6 و Watch 6 Classic بنظام Wear OS."),
  B("huawei", "Huawei", "هواوي", "تشمل Watch GT 4 و Watch Ultimate بعمر بطارية ممتاز."),
  B("garmin", "Garmin", "جارمين", "تشمل Fenix 7 و Forerunner للرياضيين بدقة GPS عالية."),
  B("xiaomi", "Xiaomi", "شاومي", "تشمل Watch S3 و Redmi Watch بأسعار اقتصادية."),
  B("amazfit", "Amazfit", "أمازفيت", "تشمل GTR 4 و T-Rex بعمر بطارية يصل لشهر."),
];
