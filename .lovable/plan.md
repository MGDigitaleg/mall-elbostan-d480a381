# خطة تحسين أداء الموبايل — مول البستان

التقرير الحالي: **Performance 67** (Mobile)، LCP 5.4s، CLS 0.222، Forced Reflow ~120ms، JS غير مستخدم 103KB، صور غير مُحسّنة 288KB، كاش غير مُستخدم 391KB.

الهدف: الوصول إلى **90+** على الموبايل دون أي تغيير بصري أو وظيفي.

---

## 1) إصلاح Layout Shifts (CLS 0.222 → < 0.05)

السبب الرئيسي: عناصر تتغير ارتفاعاتها بعد التحميل (Hero، Categories، Footer، DealsTeaser).

- **Hero**: تثبيت الارتفاع عبر CSS فقط (تم في الإصلاح السابق — يحتاج نشر).
- **CategoryStrip**: زيادة `minHeight` ليطابق الارتفاع الفعلي على الموبايل (~330px بدل 280px) ومنع `display: none` المؤجل على الفئات.
- **DealsTeaser & ProductRail**: استبدال نمط `display:none` المشروط بـ Skeleton ثابت بنفس الأبعاد بحيث لا يقفز المحتوى عند ظهور البيانات.
- **Footer**: حجز ارتفاع مبدئي (`min-height` على `<footer>`) وتأجيل تحميل صور الفوتر (logo والشركاء) مع `width/height` صريحين.

## 2) إصلاح Forced Reflow (~120ms)

الموجود في `index-*.js` و `ProductRail` و `accordion`.

- استبدال أي قراءة لـ `offsetWidth/getBoundingClientRect` بعد كتابات DOM بنمط مؤجل (`requestAnimationFrame`).
- في `HomeAnchorNav` تستخدم `el.getBoundingClientRect()` داخل onClick — تأجيله داخل rAF.
- في `ProductRail` (Carousel/scroll snap) فحص واستبدال أي قياس متزامن بعد التمرير بـ `IntersectionObserver`.

## 3) تحسين الصور (288KB توفير)

- **`/logos/tenants/infinity.webp`**: المعروض 49×49 لكن الحجم 1058×1058 — إنشاء نسخة مصغّرة (96×96) واستخدامها في بطاقات الخريطة.
- **منتجات Dell Latitude**: المعروض 357×285 بينما الحجم 1000×800 — خفض الجودة وإعادة تصدير عند 600×480.
- **صور الفوتر `logo-brand-white-sm`**: المعروض 144×84 والملف 288×168 — ضبط ولا حاجة لإنشاء نسخ جديدة (ضمن الحد المقبول لشاشات الـRetina).
- إضافة `srcset` و`sizes` لصور الـHero ومنتجات الواجهة (نسخ 480w/768w/1280w).

## 4) كاش HTTP (391KB توفير)

أصول `/logos/tenants/*` و`/images/products/*` و`/hero/*` تأتي حالياً بدون `Cache-Control`.

- إضافة headers عبر ملف `public/_headers` (Lovable يدعمه عند النشر) بحيث:
  - `/assets/*` → `max-age=31536000, immutable` (موجود تلقائياً مع Vite hash).
  - `/logos/*`, `/images/*`, `/hero/*` → `max-age=2592000` (30 يوم).
  - `/~flock.js` → خارج نطاقنا (تابع لـ Lovable analytics).

## 5) تقليل JavaScript غير المستخدم (103KB)

- المشكلة: `index-*.js` ضخم (174KB) — يحوي `framer-motion`، `accordion`، إلخ مدمجين.
- **تأجيل framer-motion على الموبايل**: استخدام `Reveal` بنسخة CSS بسيطة بدل framer للعناصر تحت الطية.
- **Lazy-load `Accordion`**: استخدامه فقط داخل قسم الـFAQ — تحويله إلى `lazy()`.
- **إزالة `proxy-Pl1jXLWZ.js` (37KB)**: يبدو من Supabase realtime/postgrest helpers — التحقق إن كان كل المستوردات مطلوبة في الصفحة الرئيسية.
- مراجعة `manualChunks` في `vite.config.ts` لفصل: `vendor-react`, `vendor-supabase`, `vendor-motion`.

## 6) تسريع LCP (5.4s → < 2.5s)

- صورة الـHero `nc-hero-1.webp` تحمّل بـ `preload` (موجود) لكن تكمل في 700ms+ ثم النص يُرسم بعد framer-motion.
- إزالة animation `motion` على H1 الـHero (استخدام CSS keyframe بدل framer).
- إعادة ضغط `nc-hero-1.webp` بجودة 75 بدل 85 (توفير 15KB إضافي).
- إنشاء نسخة موبايل أصغر `nc-hero-1-mobile.webp` (768×432) واستخدامها عبر `<picture>` في HeroSliderMobile.

## 7) تحسينات إضافية صغيرة

- إزالة `preconnect` لـ `images.unsplash.com` غير مستخدم على الواجهة.
- تأجيل تحميل خط `Inter` (ليس مستخدماً تحت الطية في الموبايل).
- إزالة أي استدعاء `useQuery` غير مفعّل قبل التفاعل (بالفعل `enabled: ready`، التأكد من بقية الصفحات).

---

## التنفيذ على دفعات آمنة

**الدفعة 1 — CLS و Reflow** (خطر صفر، أكبر أثر):
- إصلاحات `HomeContent` و `CategoryStrip` و `Footer` و `HomeAnchorNav`.

**الدفعة 2 — الصور والكاش**:
- إنشاء النسخ المصغرة (`infinity-96.webp`، `dell-latitude-*-600.jpg`).
- إضافة `public/_headers`.
- إضافة `srcset/sizes` على الـHero والمنتجات.

**الدفعة 3 — تقسيم JS**:
- ضبط `manualChunks` في vite config.
- تأجيل framer-motion للأقسام تحت الطية.
- Lazy-load Accordion.

**الدفعة 4 — قياس وتحقق**:
- نشر، تشغيل Lighthouse، مقارنة قبل/بعد.

---

## ضمانات عدم التخريب

- لا تغييرات بصرية: فقط `min-height` و`srcset` و`headers` و`lazy()`.
- لا تغييرات على الـcomponents الأساسية (`ProductRail`, `Hero`) بخلاف استبدال طرق التحميل.
- كل دفعة قابلة للتراجع باستقلال.
- بعد كل دفعة: نشر وتشغيل Lighthouse للتحقق.

## التوقعات

| المقياس | قبل | بعد |
|---|---|---|
| Performance | 67 | 90+ |
| LCP | 5.4s | ~2.0s |
| CLS | 0.222 | < 0.05 |
| Total bytes | ~600KB | ~250KB |
