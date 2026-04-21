

# اصلاح جذري لتوسيط العجلة داخل حلقة اللوجوهات

## المشكلة الجذرية

الحاوية الأب (السطر 351 في `SpinWin.tsx`) ليس لها أبعاد صريحة. الـ `StoreRing` موضوع بـ `absolute inset-0` لكن حجم الحاوية يتحدد فقط من الـ `PrizeWheel` (الذي هو أصغر). النتيجة: اللوجوهات تخرج عن الحاوية وتظهر غير متوسطة.

```text
الحالي:
┌─ container (حجمه = wheelSize فقط) ──┐
│  StoreRing (absolute, total > container) → يتسرب خارج الحاوية
│  PrizeWheel (relative, wheelSize)
└─────────────────────────────────────┘

المطلوب:
┌─ container (حجمه = wheelSize + ringThickness*2) ─┐
│  ┌─ StoreRing (absolute inset-0, يناسب الحاوية) ─┐│
│  │  ┌─ PrizeWheel (centered inside) ─┐           ││
│  │  └────────────────────────────────┘           ││
│  └───────────────────────────────────────────────┘│
└───────────────────────────────────────────────────┘
```

## الحل

### ملف: `src/pages/SpinWin.tsx`

**تغيير واحد في حاوية العجلة (السطر 351):**

اعطاء الحاوية أبعاد صريحة تساوي الحجم الكلي للحلقة (`wheelSize + ringThickness * 2`) بدلاً من ترك الحجم يتحدد تلقائياً من الـ PrizeWheel فقط.

```tsx
// حساب الحجم الكلي
const totalRingSize = wheelSize + ringThickness * 2;

// الحاوية بأبعاد صريحة
<div 
  className="relative mx-auto"
  style={{ width: totalRingSize, height: totalRingSize }}
>
  {/* StoreRing — absolute inset-0 يملأ الحاوية بالكامل */}
  <div className="absolute inset-0">
    <StoreRing floorId={floorId} innerSize={wheelSize} ringThickness={ringThickness} />
  </div>
  {/* PrizeWheel — centered inside */}
  <div className="absolute inset-0 flex items-center justify-center z-10">
    <PrizeWheel ... size={wheelSize} />
  </div>
</div>
```

هذا يضمن:
1. الحاوية بالضبط بحجم الحلقة الخارجية
2. الـ StoreRing يتطابق مع أبعاد الحاوية (لأنه يحسب `total = innerSize + ringThickness * 2` داخلياً)
3. الـ PrizeWheel متوسط تماماً داخل الحاوية

### الملفات المتأثرة
- `src/pages/SpinWin.tsx` — تغيير هيكل حاوية العجلة فقط (السطور 350-364)

لا حاجة لتعديل `StoreRing.tsx` أو `PrizeWheel.tsx` — المشكلة كانت فقط في طريقة تركيب الحاوية.

