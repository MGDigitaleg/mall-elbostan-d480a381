

## مول البستان كموسوعة تقنية: توسيع كتالوج الأجهزة إلى 1000+ صفحة

### الهدف
تحويل `/devices/:slug` إلى موسوعة شاملة لكل ما يُباع في المول — من أصغر كابل إلى أكبر سيرفر — بـ **1000+ صفحة SEO حقيقية**، كل صفحة بمحتوى عربي فريد ومُهيكل، بدون تضخيم ملف واحد لـ 33 ألف سطر.

---

### 1) المعمارية: من ملف واحد إلى نظام معياري

**المشكلة الحالية**: `src/lib/deviceCatalog.ts` = 1075 سطراً لـ33 جهازاً (≈32 سطر/إدخال). 1000 إدخال يدوي = 32,000+ سطر = بطء HMR، صعوبة صيانة، وتكرار محتوى.

**الحل**: تقسيم + توليد هجين:

```
src/lib/devices/
├── index.ts                  ← يجمّع كل شيء + يصدّر deviceCatalog
├── types.ts                  ← الأنواع المشتركة (DeviceEntry, FAQ, إلخ)
├── taxonomy.ts               ← التصنيفات الـ 6 الرئيسية + الفرعية
├── brands.ts                 ← قاموس العلامات (Dell, HP, Asus, Apple, ...) لكل فئة
├── templates.ts              ← قوالب SEO/intro/FAQ بمعاملات (يولّد محتوى فريد)
├── manual/                   ← الإدخالات المختارة يدوياً (الـ 33 الحالية + إضافات استراتيجية)
│   ├── computers.ts          (laptops, monitors, cpus, …)
│   ├── phones.ts
│   ├── gaming.ts
│   ├── networking.ts
│   ├── printing.ts
│   └── maintenance.ts
└── generated.ts              ← إخراج المولّد (variants × brands × sub-types)
```

**ضمانات**: `deviceCatalog` يبقى نفس الـ API الحالي (`Record<string, DeviceEntry>`) — لا تغييرات في `DeviceCategory.tsx` أو `TechPlanetSection`.

---

### 2) توسيع التصنيف (Taxonomy) إلى 6 مستويات × 18 فئة فرعية × عشرات الأنواع

**6 فئات أم** (موجودة): الهواتف، الكمبيوتر، الجيمنج، الشبكات، الطباعة، الصيانة.

**18 فئة فرعية جديدة** تتفرع منها (أمثلة):
| الفئة الأم | الفئات الفرعية |
|---|---|
| كمبيوتر | لابتوبات · ديسكتوب · MacBook · شاشات · ورك ستيشن · سيرفرات · مكونات داخلية · تخزين · تبريد · إكسسوارات |
| هواتف | سمارت فون · إكسسوارات · شواحن · كفرات · سكرينات · ساعات ذكية · تابلت · سماعات بلوتوث · باور بانك |
| جيمنج | كونسولات · لابتوبات جيمنج · ديسكتوب جيمنج · ماوس · كيبورد · هيدسيت · كراسي · ستريمنج · VR · أجهزة تحكم |
| شبكات | راوتر · سويتش · أكسس بوينت · كابلات شبكة · NAS · UPS · كاميرات مراقبة · أنتركم · إنذار · بصمة |
| طباعة | طابعات ليزر · إنك جت · 3D · سكانر · ماكينات تصوير · كارتردج · حبر · ورق · بلوتر · باركود |
| صيانة | صيانة لابتوب · موبايل · ألواح أم · شاشات · باور سبلاي · داتا ريكفري · سوفت وير · فك شفرة |

**كل فئة فرعية** تتفرّع لأنواع ودرجات وعلامات تجارية → يولّد المئات.

---

### 3) المولّد الذكي: كيف نصل إلى 1000 صفحة بمحتوى فريد

نستخدم **3 أنماط توليد**:

#### أ) Brand variants (≈ 350 صفحة)
كل جهاز رئيسي × أبرز 5–12 علامة:
- `laptops-dell`, `laptops-hp`, `laptops-lenovo`, `laptops-asus`, `laptops-acer`, `laptops-msi`, `laptops-apple`, `laptops-huawei`, `laptops-samsung`
- `smartphones-samsung`, `smartphones-apple`, `smartphones-xiaomi`, `smartphones-oppo`, `smartphones-realme`, `smartphones-honor`, `smartphones-vivo`, `smartphones-infinix`, `smartphones-tecno`, `smartphones-nokia`
- نفس النمط لـ: monitors, printers, routers, headphones, cameras, keyboards, mice, speakers, ssd, gpu, cpu…

#### ب) Use-case variants (≈ 250 صفحة)
كل جهاز × استخدام:
- `laptops-gaming`, `laptops-business`, `laptops-students`, `laptops-design`, `laptops-programming`, `laptops-architecture`, `laptops-video-editing`, `laptops-2-in-1`
- `monitors-gaming`, `monitors-4k`, `monitors-curved`, `monitors-ultrawide`, `monitors-design`, `monitors-office`
- `printers-home`, `printers-office`, `printers-photo`, `printers-laser`, `printers-color`

#### ج) Specification variants (≈ 200 صفحة)
- مقاسات/أحجام: `monitors-24-inch`, `monitors-27-inch`, `monitors-32-inch`, `laptops-13-inch`, `laptops-15-inch`, `laptops-17-inch`, `tablets-10-inch`
- سعات: `ssd-500gb`, `ssd-1tb`, `ssd-2tb`, `ram-8gb`, `ram-16gb`, `ram-32gb`, `powerbanks-10000mah`, `powerbanks-20000mah`
- أجيال/معايير: `wifi-6-routers`, `wifi-7-routers`, `usb-c-cables`, `hdmi-2-1-cables`, `ddr5-ram`, `nvme-ssd`

#### د) Long-tail accessories & micro-categories (≈ 200 صفحة)
"كل تفصيلة صغيرة" كما طلب المستخدم:
- مسامير لابتوب · معاجين تبريد · فلاتر شاشة · مساحات هواتف · حوامل تابلت · خوارزميات إضاءة RGB · أنابيب حرارية · توسعات M.2 · بطاريات بديلة · شواحن مغناطيسية · مايكات ياقة · أرجل شاشة · قواعد دوارة · حقائب لابتوب · سكينز · مفكات إصلاح · فرش تنظيف · مساحات عدسات · أكياس مضادة للكهرباء الساكنة · حساسات حركة · لمبات RGB · فيلتر هوائي للسيرفر · كابل OTG · محول USB-A → USB-C · هابات · داكينج ستيشن · بريزة USB متعددة · حماية ضد الصواعق · UPS صغير منزلي · صناديق تبريد فعّال · حوامل GPU · ألواح RGB · ضواغط هواء تنظيف …

**المجموع المستهدف**: 33 يدوي + 967 مولّد = **1000+ صفحة**.

---

### 4) كل صفحة مولّدة = محتوى عربي فريد (ليست تكراراً)

نظام القوالب (`templates.ts`) يولّد محتوى متفاوت حسب:
- **اسم الجهاز/العلامة/الاستخدام** (متغير)
- **3–5 قوالب مقدّمة** مختلفة (200–280 كلمة) يتم اختيارها بالـ hash للسلَج لضمان التنوع
- **بنك أسئلة شائعة** (≈ 40 سؤالاً) يُختار منها 4–6 ذات صلة بالفئة
- **كلمات مفتاحية** ديناميكية: `[الجهاز] [العلامة] [الاستخدام] في القاهرة الجديدة، أسعار، ضمان…`
- **روابط داخلية**: `relatedSlugs` يُحسَب تلقائياً (نفس الـ brand أو نفس الـ use-case أو نفس الـ parentCategory)

**مثال** — `laptops-dell`:
> "يضم مول البستان أكبر تجمّع متخصص في **لابتوبات Dell** بالقاهرة الجديدة، حيث تجد محلات معتمدة تعرض أحدث موديلات سلاسل XPS و Latitude و Inspiron و Vostro و Alienware للجيمنج… ضمان وكيل معتمد، خيارات تمويل، وفروع متعددة داخل المول."

كل برand له فقرة ذكر سلاسل/موديلات حقيقية → محتوى موثوق وفريد لكل صفحة.

---

### 5) الصفحة `/devices/:slug` — لا تغييرات هيكلية

`DeviceCategory.tsx` تبقى كما هي. **تحسينات صغيرة**:
- إضافة breadcrumb موسّع: الرئيسية ← كوكب البستان ← [الفئة الأم] ← [الفئة الفرعية إن وُجدت] ← [الجهاز]
- إضافة **"أجهزة من نفس العلامة"** (إذا كان السلَج مولّداً بعلامة)
- إضافة **"أجهزة بنفس الاستخدام"** (إذا كان مولّداً باستخدام)
- استخدام `productKeywords` المولّدة لربط منتجات Supabase الفعلية

---

### 6) Tech Planet — التكيّف مع 1000 صفحة

`TechPlanetSection`:
- **المدارات الـ3** (inner/middle/outer) تبقى للأجهزة الرئيسية الـ33 فقط (لا نضع 1000 أيقونة في الفضاء — ستصبح فوضى).
- **الكتالوج المُبحث (`TechPlanetCatalog`)** يصبح الواجهة الرئيسية للوصول للـ1000:
  - يعرض الكل (1000+) مع pagination/virtual scroll (60 لكل صفحة).
  - فلتر بالعلامة + بالاستخدام + بالفئة الأم.
  - بحث instant.
- صفحة `/tech-planet` تعرض إحصائية حقيقية: "1000+ صفحة جهاز · 6 فئات · 50+ علامة".

---

### 7) SEO على نطاق واسع

- **`public/sitemap.xml`** يصبح ديناميكياً عبر **edge function** `supabase/functions/sitemap/index.ts` (موجودة بالفعل — نوسّعها لتشمل كل سلَجات `deviceCatalog`).
- كل صفحة تحافظ على: title فريد، meta description فريد، H1 واحد، JSON-LD (CollectionPage + FAQPage + BreadcrumbList)، canonical.
- روابط داخلية كثيفة (related slugs) → سلطة دومين متماسكة.
- `/devices/index` (صفحة جديدة) = فهرس كامل HTML للـ1000 صفحة، قابل للزحف بسهولة.

---

### 8) الأداء

- `deviceCatalog` يُبنى مرة عند الـ import (Map ثابت)، لا تأثير runtime.
- عند ~1000 entry × ~1KB متوسط = ~1MB ملف JS → **lazy-load** القاموس المولّد:
  - الإدخالات اليدوية الـ33 → bundle رئيسي (للـ orbit).
  - الإدخالات المولّدة الـ967 → chunk منفصل، يُحمَّل فقط عند زيارة `/devices/:slug` غير موجود في اليدوية، أو عند فتح `TechPlanetCatalog`.
- `getDeviceBySlug` async لو لزم.

---

### 9) ملفات ستُعدَّل/تُنشأ

| النوع | الملف |
|---|---|
| ✨ جديد | `src/lib/devices/types.ts` |
| ✨ جديد | `src/lib/devices/taxonomy.ts` |
| ✨ جديد | `src/lib/devices/brands.ts` |
| ✨ جديد | `src/lib/devices/templates.ts` |
| ✨ جديد | `src/lib/devices/manual/{computers,phones,gaming,networking,printing,maintenance}.ts` (نقل + تقسيم الـ33 الحالية) |
| ✨ جديد | `src/lib/devices/generated.ts` (يصدّر دالة تولّد ~970 إدخالاً) |
| ✨ جديد | `src/lib/devices/index.ts` (يجمّع ويصدّر `deviceCatalog`, `getDeviceBySlug`, إلخ) |
| ✨ جديد | `src/pages/DevicesIndex.tsx` (فهرس HTML للـ1000 صفحة + بحث + فلتر) |
| ✏️ تعديل | `src/lib/deviceCatalog.ts` → يصبح re-export من `./devices/index` (للتوافق العكسي) |
| ✏️ تعديل | `src/pages/DeviceCategory.tsx` (breadcrumb موسّع + روابط brand/use-case) |
| ✏️ تعديل | `src/components/home/TechPlanetCatalog.tsx` (pagination + فلاتر brand/use-case) |
| ✏️ تعديل | `src/App.tsx` (route لـ `/devices` فهرس) |
| ✏️ تعديل | `supabase/functions/sitemap/index.ts` (إدراج كل سلَجات الأجهزة) |

---

### 10) المرحلة التنفيذية (مرحلة واحدة، عمل ضخم لكنه آلي)

1. بناء البنية التحتية (`types`, `taxonomy`, `brands`, `templates`).
2. نقل الـ33 الحالية إلى `manual/*` بدون تغيير محتوى.
3. كتابة المولّد + 3–5 قوالب مقدّمة + بنك FAQ ≥40 سؤال.
4. توليد ~970 إدخال موزّعة كما في القسم 3.
5. اختبار: `tsc --noEmit` + console audit يطبع العدد النهائي + توزيع per-category.
6. تحديث الواجهات (DevicesIndex, breadcrumb, sitemap).

### النتيجة المتوقعة
- **1000+ صفحة فعلية** على `/devices/:slug`، كلها مفهرسة في sitemap وقابلة للزحف.
- مول البستان يصبح **الموسوعة التقنية الأولى عربياً** بمحتوى عربي حقيقي وفريد.
- Tech Planet يبقى أنيقاً (33 أيقونة في الفضاء) + كتالوج موسوعي خلفه (1000+).
- بنية معيارية تسمح بإضافة المزيد لاحقاً بسطر واحد.

