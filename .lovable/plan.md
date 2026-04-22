

# تعديل حجم الخريطة وإلغاء زوم السكرول

## ملخص
تصغير الخريطة التفاعلية لتناسب شاشة الديسكتوب بالكامل بدون سكرول، مع إلغاء خاصية الزوم عبر السكرول (scroll wheel zoom) والإبقاء على أزرار الزوم فقط.

---

## التغييرات

### 1. إلغاء زوم السكرول — `src/components/map/MallFloorMap.tsx`
- حذف دالة `handleWheel` بالكامل وإزالة `onWheel` من الـ container div
- هذا يلغي الزوم المزعج عند تمرير الصفحة فوق الخريطة ويترك السكرول العادي للصفحة يعمل بشكل طبيعي
- أزرار الزوم (+ / - / reset) تبقى كما هي للاستخدام الاختياري

### 2. تصغير حجم الخريطة على الديسكتوب — `src/pages/InteractiveMap.tsx`
- إضافة `max-height` للخريطة على الديسكتوب (حوالي `calc(100vh - 260px)`) بحيث تظهر بالكامل ضمن الشاشة مع الهيدر وشريط التحكم
- ضبط الـ aspect ratio أو الـ container ليكون أكثر انضباطاً بدون سكرول داخلي

### 3. تعديل HeroMiniMap — `src/components/home/HeroMiniMap.tsx`
- إلغاء `onWheel` إن كان يستخدم نفس المكوّن (MallFloorMap يمرر الزوم تلقائياً)

---

## التفاصيل التقنية

**الملفات المتأثرة:**
- `src/components/map/MallFloorMap.tsx` — إزالة `handleWheel` و `onWheel`
- `src/pages/InteractiveMap.tsx` — إضافة `max-h-[calc(100vh-260px)]` على container الخريطة في الديسكتوب

