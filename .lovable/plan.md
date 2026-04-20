

# عرض المنتجات بشكل احترافي حسب كل Device

## المشكلة الحالية

من الصور (iPad ~820px والمنطقة الزرقاء الداكنة):
1. **بطاقات صغيرة جداً**: padding داخلي ضيق (6px×8px)، font 10-12.5px، logo المحل 11px → تبدو "مضغوطة" وغير احترافية على الشاشات المتوسطة والكبيرة.
2. **عرض غير منسجم بين الـ devices**: على الموبايل rail أفقي كويس، على iPad/tablet نفس الـ rail بعرض ثابت `clamp(130px, 13vw, 165px)` → بطاقات صغيرة جداً والمساحة الفاضية واسعة.
3. **القسم الأزرق الداكن (Featured/Computers)**: نفس مقاسات البطاقات → يضيع التميّز البصري للقسم المميز.
4. **Grid على الديسكتوب**: 6 أعمدة = 6 بطاقات صغيرة في الصف. حسب الـ memory `marketplace-density` ده مقصود، بس خلّى البطاقة نفسها تفقد الهوية الاحترافية.
5. **عدم استغلال المساحة على iPad** (768-1024px): البطاقات بتفضل صغيرة بنفس مقاس الموبايل تقريباً.

## الاستراتيجية: Density-Tiered بحسب الـ Device

أعلّق نفس مكوّن `ProductRail` لكن بـ **3 مستويات كثافة محسوبة لكل breakpoint** بدل clamp واحد لكل حاجة:

### Tier A — Mobile (< 640px): "App-like Rail"
- Layout: rail أفقي (موجود).
- عرض البطاقة: **62vw** (max 240px) بدل 47vw → بطاقة واحدة كبيرة + جزء من اللي بعدها (peek) لتشجيع الـ swipe.
- Image aspect: **1/1** (square) بدل 4/3 → أوضح للمنتج (موبايل/لابتوب).
- Padding داخلي: 10px 12px.
- Font: title 13px، store 11px، price 14px.
- Snap: `snap-start` + scroll-padding-inline-start لـ alignment صحيح RTL.

### Tier B — Tablet (640-1024px): "Comfortable Grid"
- Layout: grid **3 أعمدة** (640-768) → **4 أعمدة** (768-1024) ثابتة، مش rail.
- Aspect: 4/3 (موجود).
- Padding: 12px 14px.
- Font: title 13.5px، store 11px، price 14.5px.
- Logo المحل: 14px بدل 11px.

### Tier C — Desktop (≥ 1024px): "Dense Marketplace"
- Layout: grid **5 أعمدة** (1024-1280) → **6 أعمدة** (≥ 1280) — يحترم memory density.
- Aspect: 4/3.
- Padding: 10px 12px (متوسط).
- Font: title 13px، store 10.5px، price 13.5px.
- Hover: lift -2px + shadow أعمق (موجود مع تعزيز).

### Premium tier (Featured Products & Dark sections فقط)
- على كل الـ devices: عدد أعمدة **أقل بـ 1** من العادي (بطاقة أكبر = إحساس "مميّز").
- Mobile rail: عرض بطاقة 70vw (max 280px).
- Tablet: 3 بدل 4 أعمدة.
- Desktop: 4 بدل 5/6 أعمدة.
- Border accent خفيف بلون primary على hover.

## التعديلات الفعلية

### 1) `src/components/home/ProductRail.tsx`
- إضافة hook صغير `useDeviceTier()` يرجع `"mobile" | "tablet" | "desktop"` (matchMedia على 640px و 1024px) — أدق من `useIsMobile` لوحده.
- إضافة prop جديد `density?: "standard" | "premium"` (default `"standard"`).
- `ProductCard` يقبل `tier` و `density` ويطبّق المقاسات المذكورة فوق (aspect ratio، padding، font sizes، logo size).
- شيل clamp() المعقّد واستبدله بقيم ثابتة لكل tier (أوضح + أسرع).
- Grid classes ديناميكي:
  - Standard: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`
  - Premium: `grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4`
- Rail width لكل tier: mobile 62vw/70vw (premium)، tablet/desktop يستخدموا grid مش rail (إلا لو layout="rail" صراحةً → يكون 28vw/22vw).
- Skeleton states محسّنة بنفس الـ tier dimensions.

### 2) `src/components/home/HomeContent.tsx`
- مرّر `density="premium"` على القسمين الـ dark themed (Featured + Computers) — السطور ~223 و ~284.
- باقي الأقسام `density="standard"` (default، مش محتاج تعديل).
- تأكيد `layout="grid"` للـ category sections (Phones/Computers/Gaming) عشان tablet/desktop ياخدوا grid مريح.

### 3) `src/index.css` (إضافة سطر واحد فقط)
- إضافة `.scroll-snap-rtl-start { scroll-padding-inline-start: 16px; }` للـ rail الموبايل لـ alignment صحيح في RTL.

## الملفات المعدّلة
- `src/components/home/ProductRail.tsx` (تعديل رئيسي)
- `src/components/home/HomeContent.tsx` (تعديلين سطريين على القسمين الـ premium)
- `src/index.css` (سطر واحد للـ snap padding)

## النتيجة المتوقعة

| Device | قبل | بعد |
|---|---|---|
| Mobile (< 640) | بطاقة 47vw، صورة 4/3، نص 10px | بطاقة 62vw، صورة 1/1، نص 13px — app-like |
| Tablet (640-1024) | rail بطاقات 130-165px | Grid 3-4 أعمدة، بطاقات مريحة 14px font |
| Desktop (≥ 1024) | Grid 5-6 صغير 12px | نفس الكثافة بس بطاقة أوضح ولوغو محل أكبر |
| Premium sections | نفس الكثافة العادية | عمود أقل = بطاقة أكبر = شعور "مميّز" واضح |

- لا يكسر memory `marketplace-density` (الديسكتوب فيه نفس 5-6 أعمدة).
- لا يكسر memory `product-imagery` (نفس bg `#F1F5F9`، object-contain).
- لا CLS جديد (aspect-ratio محدد في كل tier).
- بدون JS overhead — الـ hook بيستخدم matchMedia listener واحد فقط.

