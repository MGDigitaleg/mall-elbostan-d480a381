

# تحسين بار الفلاتر فوق الخريطة + ربط مركز التفاعل بـ Spin & Win

## المشكلة
1. على الموبايل البار العلوي (Floor Tabs + Legend + Filter Bar كاملاً) sticky وياخد ~360px من الشاشة، مما يخفي الخريطة تماماً تحت الـ fold.
2. "مركز التفاعل" (الذرّة المركزية على الخريطة) يفتح `AtriumHubModal` فقط — مفيش رابط مباشر واضح يقول "هنا تلعب Spin & Win" ولا تكامل مع صفحة `/spin-win` المستقلة.

## الحل

### 1) ضغط بار الفلاتر على الموبايل (`InteractiveMap.tsx`)

**الوضع الحالي**: الـ section.sticky يحوي:
- صف 1: FloorTabs + MapLegend + stats strip (~56px)
- صف 2: MapFilters (search + category + status + toggle) في كرت مستقل بـ padding 12px (~140px على الموبايل)
- المجموع: ~200px + margins → كثير على شاشة 390px.

**التعديلات**:
- **جعل الفلاتر قابلة للطي على الموبايل**: في الحالة الافتراضية يظهر فقط:
  - FloorTabs (سطر مضغوط)
  - زر "فلترة وبحث" بأيقونة `SlidersHorizontal` + badge بعدد الفلاتر النشطة
  - الـ MapLegend يتحول لـ chip صغير أفقي scrollable
- عند الضغط: يفتح Sheet/Drawer من الأسفل يحتوي على كامل MapFilters.
- على الديسكتوب (`md:` وفوق): يظل كل شيء ظاهر زي ما هو دلوقتي.

**تأثير**: ارتفاع البار على الموبايل ينزل من ~200px إلى ~52px فقط → الخريطة تظهر مباشرة تحت الهيدر.

### 2) ربط "مركز التفاعل" مع Spin & Win بشكل واضح

**حالياً**: AtriumHubModal فيه تاب "المكافآت" يفتح `AtriumSpinModal` (نسخة خفيفة inline). بس الكثير من المستخدمين يحتاجون التجربة الكاملة في `/spin-win`.

**التعديلات في `AtriumHubModal.tsx`**:
- في تاب "spin": إضافة **زرين متجاورين**:
  1. زر رئيسي: **"أدر واربح الآن"** → ينقل لصفحة `/spin-win` المستقلة (تجربة كاملة).
  2. زر ثانوي: **"تسجيل سريع هنا"** → يفتح AtriumSpinModal الحالي (للمستخدمين اللي مش عايزين يغيروا الصفحة).
- إضافة شريط معلوماتي صغير في الـ header يعرض حالة الحملة (`useCampaignStatus("spin_win")`):
  - لو نشطة: "الحملة جارية الآن — جوائز حقيقية في انتظارك"
  - لو موقوفة: تعطيل الزر مع رسالة "الحملة ستفتح قريباً"

**التعديلات في `MallFloorMap.tsx` / `AtriumInteractiveLayer`**:
- إضافة **badge صغير "Spin & Win"** فوق الذرّة المركزية على الخريطة نفسها (مع pulse) ليكون visual cue واضح أن هذا المكان للعب.
- tooltip عند hover: "اضغط للوصول إلى مركز المكافآت".

### 3) إصلاح صغير على الـ sticky header

- البار حالياً `top-[56px]` على الموبايل ويسبب overlap مع الـ MobileBottomNav أحياناً عند scroll.
- تقليل padding الـ section من `py-2.5` → `py-1.5` على الموبايل + `pb-2.5` → `pb-1.5`.

## الملفات المعدّلة

1. **`src/pages/InteractiveMap.tsx`**: 
   - استبدال بار الفلاتر بنسخة مضغوطة على الموبايل (mobile collapse + Sheet trigger).
   - تمرير `onCampaignActive` للـ AtriumHubModal لو احتجنا.

2. **`src/components/map/MapFilters.tsx`**: 
   - إضافة prop `compact?: boolean` لعرض نسخة inline compact.
   - أو إنشاء wrapper `MapFiltersSheet.tsx` جديد يستخدم Sheet من Radix.

3. **`src/components/map/AtriumHubModal.tsx`**:
   - تاب "spin": زر رئيسي يقود لـ `/spin-win` + زر ثانوي للتسجيل السريع.
   - إضافة `useCampaignStatus` لعرض حالة الحملة.

4. **`src/components/map/AtriumInteractiveLayer.tsx`** (تعديل بسيط):
   - badge "Spin & Win" واضح على الذرّة + pulse animation.

## النتيجة المتوقعة

- **موبايل**: الخريطة تظهر مباشرة بمجرد الـ scroll للـ map section. البار العلوي ~52px فقط بدلاً من ~200px.
- **مركز التفاعل**: واضح بصرياً أنه نقطة الدخول لـ Spin & Win، مع خيارين (التجربة الكاملة في `/spin-win` أو التسجيل السريع inline).
- **الديسكتوب**: لا تغيير في التجربة الحالية.

