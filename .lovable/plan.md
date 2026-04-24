

## كوكب البستان — صفحة كاملة + ربط شامل للأجهزة + CTA في الهوم

### الهدف
نقل تجربة "كوكب البستان" إلى صفحة مستقلة ثرية، وربط كل أيقونة (مدارات، أقمار، نجوم) بصفحة جهاز فعلية، مع إبقاء كتلة CTA أنيقة في الصفحة الرئيسية تقود إلى الكوكب.

---

### 1) صفحة جديدة: `/tech-planet`

ملف جديد: `src/pages/TechPlanet.tsx`
- يستخدم `SEOHead` (عنوان: "كوكب البستان — كل التقنية في مدار واحد"، وصف عربي قصير).
- يعرض `<TechPlanetSection />` بكامله (الكوكب + الكتالوج + الدليل).
- تسجيل المسار في `src/App.tsx` ضمن قائمة `darkHeroPages` لخلفية داكنة بدون padding علوي.

### 2) ربط كل أيقونة بصفحتها (تأكيد + تعميم)

في `src/components/home/TechPlanetSection.tsx`:
- **تغطية كاملة للكتالوج**: حالياً 34 جهازاً في `deviceCatalog` لكن المدارات تذكر 44 slug (تكرار + slugs غير موجودة مثل `gaming-consoles`, `gaming-laptops`, `graphics-cards`, `vr-gaming`, `smart-lighting`, `security-cameras`, `external-storage`, `pc-components`, `power-adapters`, `office-supplies`). سيتم:
  - تنظيف المصفوفات لتطابق slugs الفعلية في `deviceCatalog`.
  - توزيع كل الـ34 جهازاً عبر inner/middle/outer وفق الحقل `orbit` في كل entry تلقائياً.
- كل أيقونة تستخدم بالفعل `<Link to={\`/devices/${slug}\`}>` — يبقى كما هو.

### 3) طبقة "أقمار صناعية" قابلة للنقر

إضافة مدار رابع خارجي (Satellites) داخل `TechPlanetSection`:
- 6–8 أيقونات أصغر تدور على نصف قطر أكبر (≈ 410px) ببطء (60s).
- كل قمر يمثّل **تجربة/قسم في المول** ويحمل أيقونة Lucide ولون مميّز:
  | القمر | الوجهة |
  |---|---|
  | الخريطة التفاعلية | `/map` |
  | المتاجر | `/stores` |
  | المنتجات | `/products` |
  | عروض اليوم | `/daily-deals` |
  | اربح بدورة | `/spin-win` |
  | يوم الافتتاح | `/opening-day` |
  | فرع وسط البلد | `/downtown-directory` |
  | كسر زيرو | `/kz` |
- نفس نمط الـ Tooltip والـ counter-rotation كباقي الأيقونات.
- على الموبايل: تظهر ككارت أفقي تمريري أسفل الكوكب (بدلاً من المدار) لتجنّب التزاحم.

### 4) نجوم قابلة للنقر (Constellation Links)

في طبقة الـ stars (90 نجمة حالياً):
- اختيار **8 نجوم بارزة** (الأكبر r=1.6) وتحويلها إلى `<Link>` يلف عنصر `<circle>` داخل `<g>` مع `cursor-pointer`.
- كل نجمة بارزة ترتبط بصفحة:
  - About, Leasing, Contact, FAQ, Blog, Careers, Market Echo, Join Marketplace.
- عند الـ hover: توهّج ذهبي خفيف + `<title>` SVG للوصف (يعمل كـ tooltip أصلي ويُحسّن الـ a11y).
- باقي الـ82 نجمة تبقى زخرفية.

### 5) الصفحة الرئيسية: استبدال السكشن بـ CTA مدمج

في `src/components/home/HomeContent.tsx` (السطر 164–169):
- إزالة استيراد ومونت `TechPlanetSection`.
- استبداله بـ **مكوّن CTA جديد** `src/components/home/TechPlanetCTA.tsx`:
  - ارتفاع منخفض (≈ 280–340px)، خلفية ليلية cosmic مصغّرة (نفس الـ gradient + 30 نجمة فقط + كوكب صغير ساكن في الزاوية).
  - عنوان: "كوكب البستان" / "كل التقنية تدور حولك في مدار واحد".
  - فقرة قصيرة (سطر واحد): "اكتشف 34 فئة جهاز، 6 أقسام رئيسية، وتجارب المول كاملة من نقطة واحدة."
  - زرّان:
    - زر أساسي ذهبي → `/tech-planet` ("ادخل كوكب البستان")
    - زر ثانوي شفاف → `/stores` ("تصفّح المحلات")
  - Lazy-loaded عبر `LazySection` للحفاظ على أداء الهوم.

### 6) تفاصيل تقنية

- لا تغييرات في `deviceCatalog` نفسه — فقط تنظيف مصفوفات الـ orbit في `TechPlanetSection`.
- إعادة استخدام كامل لمكوّن `TechPlanetCatalog` و `TechPlanetDirectory` داخل الصفحة الجديدة (لا تكرار).
- إضافة Breadcrumb بسيط في رأس صفحة `/tech-planet`: الرئيسية ← كوكب البستان.
- تحديث `public/sitemap.xml` لإضافة `/tech-planet`.
- تحديث الـ navigation لو الكوكب يستحق إدراجه: لا — يبقى الوصول من الهوم/الفوتر فقط (يمكن إضافته لاحقاً للـ Header إن طلب المستخدم).

### 7) ملفات ستُعدَّل/تُنشأ

| النوع | الملف |
|---|---|
| ✨ جديد | `src/pages/TechPlanet.tsx` |
| ✨ جديد | `src/components/home/TechPlanetCTA.tsx` |
| ✏️ تعديل | `src/App.tsx` (route + darkHeroPages) |
| ✏️ تعديل | `src/components/home/HomeContent.tsx` (استبدال السكشن بـ CTA) |
| ✏️ تعديل | `src/components/home/TechPlanetSection.tsx` (تنظيف orbits + أقمار + نجوم قابلة للنقر) |
| ✏️ تعديل | `public/sitemap.xml` |

### النتيجة
- الهوم يبقى خفيفاً ومركّزاً على هوية المول، مع CTA راقٍ يدعو لتجربة الكوكب.
- صفحة `/tech-planet` تصبح وجهة قائمة بذاتها: كوكب + مدارات + أقمار صناعية + نجوم، كلها بوابات حقيقية لصفحات داخل الموقع — لا زخرفة بلا قيمة.

