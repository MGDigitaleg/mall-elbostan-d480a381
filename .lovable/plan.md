

# خطة شاملة لتحسين أداء الموبايل وتجربة الموبايل

الهدف: تقليل وقت التحميل الأول على الموبايل (LCP < 2.5s)، تقليل JS المرسل، وتحسين تجربة اللمس والتنقل لتكون "نسخة موبايل" حقيقية مش مجرد تصغير للديسكتوب.

## المحاور الستة

### 1) تخفيف الـ Hero والـ Above-the-fold (الأولوية القصوى)
- `HeroSlider` يتحمّل حالياً مباشرة (eager). على الموبايل: استبداله بنسخة خفيفة `HeroSliderMobile` بصورة واحدة ثابتة + `fetchpriority="high"` و `loading="eager"`، بدون animations / framer-motion.
- صور الـ Hero: تقديمها بصيغة WebP بأبعاد موبايل (640w / 828w) عبر `optimizeImageUrl` مع `srcset` و `sizes="100vw"`.
- إزالة `backdrop-filter: blur(20px) saturate(1.3)` من الهيدر على الموبايل (مكلف على GPU) — استبدال بخلفية صلبة شبه شفافة.

### 2) تقليل الأقسام المعروضة على الموبايل
الـ HomeContent فيه 14 قسم. على الموبايل نعرض 7 فقط فوق الـ fold ونكسل الباقي:
- **يظهر eager**: Hero, CategoryStrip, LatestProducts (6 منتجات بدل 12), DealsTeaser
- **lazy + IntersectionObserver**: FeaturedStores, Trending, Featured, Phones, Computers, Gaming, MerchantWall, MapTeaser, SpinWin, MarketEcho, Downtown, FAQ
- استخدام `react-intersection-observer` أو `loading="lazy"` على الصور + Suspense fallback بارتفاع ثابت لمنع CLS.

### 3) Code-splitting أعمق + تخفيف الـ bundle
- `framer-motion` ثقيل (~60KB gzipped). على الموبايل نستبدله بـ CSS transitions بسيطة في الأقسام الرئيسية (Hero, ProductRail). نحتفظ به فقط في الصفحات الإيمرسيف (MarketEcho).
- إنشاء `useIsMobile()` على مستوى التطبيق وتمريره لتجنّب رندر مكونات desktop-only (مثل dropdown الفروع في الهيدر, HeroMiniMap).
- Lazy-load `HeroSlider` و `CategoryStrip` و `ProductRail` بدل الاستيراد المباشر.

### 4) تحسين الصور (أكبر مكسب أداء)
- مراجعة `src/lib/imageUtils.ts` للتأكد من توليد `srcset` متعدد الأحجام (320/640/828/1080).
- كل صور المنتجات: `loading="lazy"` ما عدا أول 4 منتجات في الـ LCP rail.
- تحويل صور الـ Hero واللوجوهات لـ AVIF/WebP عبر Supabase image transform.
- إضافة `width` و `height` صريحين على كل `<img>` لمنع CLS.

### 5) تجربة موبايل حقيقية (UX)
- **Bottom Navigation Bar ثابت** على الموبايل (الرئيسية / المحلات / الخريطة / السلة / القائمة) بدل الاعتماد على الهامبرغر فقط.
- **Sticky CTA** أسفل الشاشة في صفحات: التأجير, Spin & Win, Product Detail.
- زيادة touch targets لـ 44×44px كحد أدنى.
- تكبير حجم الخط الأساسي على الموبايل من `0.8rem` إلى `0.875rem` لقابلية القراءة.
- `ProductRail` على الموبايل: snap-scroll أفقي بدل grid 4 أعمدة مضغوط.
- إخفاء الأقسام الديكورية الثقيلة (radial gradients, grid overlays) على الموبايل.

### 6) قياسات تقنية إضافية
- `<link rel="preconnect">` لـ Supabase storage و GA4.
- `<link rel="preload" as="image">` لصورة الـ Hero الأولى.
- React Query: `staleTime: 5min` للـ home queries لتفادي refetch عند العودة للصفحة.
- إزالة `min-height: 100vh` المضاعفة في `Index.tsx` و `AppLayout` (تسبب double layout).
- ضغط الـ `MerchantLogoWall` على الموبايل: عرض 8 لوجوهات بدل كل اللوجوهات.

## الملفات المتأثرة (تقديري)

```text
src/components/home/HeroSlider.tsx           → نسخة موبايل خفيفة
src/components/home/HomeContent.tsx          → lazy sections + isMobile gating
src/components/home/ProductRail.tsx          → snap-scroll موبايل
src/components/home/CategoryStrip.tsx        → تبسيط
src/components/layout/Header.tsx             → إزالة blur على الموبايل
src/components/layout/MobileBottomNav.tsx    → جديد
src/components/layout/StickyCTA.tsx          → جديد
src/lib/imageUtils.ts                        → srcset متعدد الأحجام
src/hooks/use-mobile.tsx                     → استخدام موسّع
src/index.css                                → media queries موبايل
index.html                                   → preconnect / preload
```

## التنفيذ على مراحل

**المرحلة 1 (أكبر أثر — LCP)**: Hero موبايل + preload + srcset + إزالة blur من الهيدر + lazy للأقسام تحت الـ fold.

**المرحلة 2 (UX موبايل)**: Bottom Nav + Sticky CTA + snap-scroll للـ ProductRail + touch targets.

**المرحلة 3 (تنظيف وتقليل JS)**: استبدال framer-motion بـ CSS في الصفحات العامة, تقليل الـ home queries data, ضغط MerchantLogoWall.

**المرحلة 4 (قياس وتأكيد)**: تشغيل Lighthouse mobile قبل/بعد، استهداف: Performance ≥ 85, LCP < 2.5s, CLS < 0.1, TBT < 300ms.

## المخرجات المتوقعة
- تقليل JS المُرسل على الموبايل بحوالي 40-50%.
- LCP من ~4s إلى < 2.5s على شبكة 4G.
- شعور "نسخة موبايل أصلية" مع bottom nav و sticky CTA و scroll أفقي للمنتجات.

