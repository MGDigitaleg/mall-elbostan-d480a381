

## خطة تحسين أداء الموبايل — من 72 إلى 85+

### ملخص المشكلات الرئيسية

| مشكلة | التأثير | الخطورة |
|-------|---------|---------|
| LCP = 5.1 ثانية | الصورة الأولى للهيرو تحمّل ببطء | حرجة |
| CLS = 0.114 | انزياحات بصرية من الفوتر والـ CategoryStrip | عالية |
| Unused JS = 98 KiB | Supabase client وframer-motion محمّلة كاملة مبكراً | متوسطة |
| Unused CSS = 19 KiB | CSS غير مستخدم في الصفحة الرئيسية | متوسطة |
| صور بدون ضغط كافٍ | Hero images كبيرة (161KB, 120KB) | عالية |
| صور بدون أبعاد | لوجو الهيدر بدون width/height | منخفضة |
| Forced Reflow | من ProductRail وaccordion (Radix UI) | متوسطة |
| Cache TTL = 0 | كل الأصول بدون تخزين مؤقت | متوسطة (خارج السيطرة جزئياً) |

---

### الخطة التفصيلية

#### 1. تحسين LCP — تسريع ظهور صورة الهيرو

**المشكلة**: صورة الهيرو الأولى (dtHero1) تأخذ 5.1 ثانية للظهور لأن:
- `HeroSliderMobile` يحمّل **كل** الـ 4 صور في DOM مرة واحدة
- الصورة الأولى تُحمّل عبر JS (lazy component) بدل أن تكون في HTML مباشرة

**الحل**:
- في `HeroSliderMobile`: تغيير منطق العرض بحيث يتم عرض الصورة الحالية فقط + الصورة التالية (بدلاً من الأربعة)
- إضافة `<link rel="preload">` للصورة الأولى مباشرة في `index.html` (بدلاً من إنشائه عبر JS في `useLayoutEffect`)
- تقليل حجم صور الهيرو عبر ضغطها (حالياً 161KB و120KB للـ webp — يمكن تقليلها 40-50%)

**الملفات**: `index.html`, `src/components/home/HeroSliderMobile.tsx`

---

#### 2. إصلاح CLS — منع الانزياحات البصرية

**المشكلة**: 3 عناصر تسبب انزياح بصري:
- **Footer**: ارتفاعه 746px ويتحرك عند تحميل المحتوى (score: 0.078)
- **CategoryStrip**: تظهر فجأة بعد الهيرو (score: 0.027)
- **Body**: انزياح عام (score: 0.01)

**الحل**:
- **Footer**: لديه بالفعل `containIntrinsicSize: "720px"` و`contentVisibility: auto` — المشكلة أن الـ `min-h-[720px]` لا تُطابق المحتوى الفعلي. تثبيت ارتفاع أدق باستخدام `containIntrinsicBlockSize` مع ضبط `min-h` بالنسبة لموبايل
- **CategoryStrip**: تحويلها من lazy (framer-motion `whileInView`) إلى SSR-ready بإزالة `motion.div` واستخدام CSS animation بدلاً منها، وإضافة `min-height` ثابت للـ section wrapper
- **Hero section wrapper**: إضافة `min-height` ثابت يتطابق مع `HeroSliderMobile` (520px)

**الملفات**: `src/components/layout/Footer.tsx`, `src/components/home/CategoryStrip.tsx`, `src/components/home/HomeContent.tsx`

---

#### 3. تقليل JavaScript غير المستخدم

**المشكلة**: 
- `client-DRoVsQPD.js` (Supabase): 41KB wasted — يُحمّل كاملاً رغم استخدام جزء صغير
- `index-BoxRvds1.js` (React core): 38KB wasted
- `proxy-Dv4QjUbG.js` (framer-motion): 20KB wasted

**الحل**:
- **CategoryStrip**: استبدال `motion.div` بـ CSS-only animation (مثل ما فعلنا في `HeroSliderMobile`) — يلغي تحميل framer-motion في critical path
- **ProductRail**: استبدال `motion` animations بـ CSS transitions حيث يكون ممكناً
- لف أقسام الصفحة الرئيسية (5-16) في `LazySection` إضافية لتأخير تحميل JS المرتبط بها

**الملفات**: `src/components/home/CategoryStrip.tsx`, `src/components/home/ProductRail.tsx`, `src/components/home/HomeContent.tsx`

---

#### 4. تحسين تسليم الصور

**المشكلة**: 204 KiB يمكن توفيرها:
- صور الهيرو غير الظاهرة تُحمّل بأحجام أكبر من اللازم
- لوجو الفوتر (600x349) يُعرض بحجم 207x91 — يهدر 27KB
- صور Unsplash تُحمّل بعرض 600px وتُعرض أصغر

**الحل**:
- **لوجو الهيدر**: إضافة `width` و`height` attributes صريحة (يحل مشكلة `unsized-images` أيضاً)
- **لوجو الفوتر**: تقليل حجم العرض المطلوب أو إنشاء نسخة أصغر
- **صور Unsplash في ProductRail**: تقليل `w=600` إلى `w=400` في `optimizeImageUrl` لأن العرض الفعلي على الموبايل أصغر

**الملفات**: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/lib/imageUtils.ts`

---

#### 5. تقليل Forced Reflow

**المشكلة**: 185ms+ من forced reflows ناتجة عن:
- `ProductRail` يقرأ `offsetWidth` أثناء التمرير
- `accordion` (Radix UI) يقيس ارتفاع المحتوى

**الحل**:
- **ProductRail**: تأجيل قراءة الأبعاد باستخدام `requestAnimationFrame` أو `ResizeObserver` بدلاً من القراءة المباشرة
- **Accordion**: هذا سلوك من Radix UI ولا يمكن تغييره بسهولة — يُترك كما هو (يتوافق مع سياسة تجاهل forced reflow من Radix)

**الملفات**: `src/components/home/ProductRail.tsx`

---

#### 6. إزالة preconnect غير مستخدم

**المشكلة**: `wrheltmgquyqqhscrpds.storage.supabase.co` مُضاف كـ preconnect لكن لا يُستخدم في الصفحة الرئيسية.

**الحل**: تحويله من `preconnect` إلى `dns-prefetch` فقط.

**الملفات**: `index.html`

---

### النتيجة المتوقعة

| مقياس | الحالي | المتوقع |
|-------|--------|---------|
| Performance Score | 72 | 82-88 |
| LCP | 5.1s | ~2.5-3s |
| CLS | 0.114 | < 0.05 |
| TBT | 220ms | ~150ms |
| TTI | 5.9s | ~4.5s |

### ملاحظات
- مشكلة Cache TTL = 0 مرتبطة بإعدادات الاستضافة (Lovable hosting) وليست تحت سيطرة الكود مباشرة
- Unused CSS (19KB) ناتج عن Tailwind — يمكن تحسينه بـ PurgeCSS لكن Vite يفعل ذلك تلقائياً؛ المتبقي هو CSS مستخدم في صفحات أخرى

