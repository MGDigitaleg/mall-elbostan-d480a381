

# املأ المساحات الفاضية: Auto-Fill Cards حسب كل Device

## المشكلة (من الـ screenshots)

**Screenshot 1 (Featured "منتجات مميزة من المول")**:
- القسم بـ `density="premium"` + `layout="rail"` + 8 منتجات featured فقط.
- على الديسكتوب الـ premium بيدي 4 أعمدة بس بما إن `layout="rail"` فالكروت بتاخد عرض 22vw → 3 كروت ظاهرة فقط ومساحة فاضية كبيرة على الشمال.

**Screenshot 2 (أحدث الهواتف)**:
- `layout="grid" columns={4} maxItems={8}` بس density=standard بيدي **5 أعمدة** على lg و **6 على xl** → 8 منتجات = صف كامل (5/6) + صف ناقص (3 أو 2 كروت) → فراغ واضح.

## الحل: ملء كامل بدون فراغات

### القاعدة: `maxItems` لازم يكون **مضاعف عدد الأعمدة الفعلي للـ tier**

| Section | Tier | عدد الأعمدة | maxItems جديد |
|---|---|---|---|
| Standard grid | Mobile (rail) | — | 10-12 |
| Standard grid | Tablet (3-4) | 4 | **8 أو 12** |
| Standard grid | Desktop (5-6) | 6 | **12 أو 18** |
| Premium grid/rail | Mobile (rail) | — | 8-10 |
| Premium | Tablet (3) | 3 | **6 أو 9** |
| Premium | Desktop (4) | 4 | **8 أو 12** |

### التعديلات الفعلية

#### 1) `src/components/home/ProductRail.tsx` — Auto-fill logic
- إضافة prop `fillMode?: "exact" | "auto"` (default `"auto"`).
- لما `fillMode="auto"` و `layout="grid"`:
  - يحسب `displayCount` ديناميكياً = أكبر مضاعف لعدد الأعمدة الحالي ≤ `products.length`.
  - مثلاً: 8 منتجات + 6 أعمدة → يعرض **6** فقط (مش 8) عشان الصف يبقى كامل، ويظهر زر "عرض الكل" لباقي المنتجات.
  - بديل أفضل: لو عدد المنتجات أقل من صف واحد كامل → يعرض كل اللي عنده.
- التطبيق: في `ProductRail`، احسب `colsPerTier` من `tier` و `density`، وقص `displayed = products.slice(0, Math.floor(products.length / cols) * cols)` لما `tier !== "mobile"` و `layout === "grid"`.
- للـ rail: شيل قيود الـ maxItems أو زوّدها — الـ rail بيتعامل مع scroll أفقي مش محتاج مضاعفات.

#### 2) تحويل قسم "Featured" لـ Grid بدل Rail (Screenshot 1)
في `HomeContent.tsx` السطر 229: غيّر `layout="rail"` → `layout="grid"` للقسم الـ premium الـ dark.
- على الديسكتوب يبقى **4 أعمدة كاملة** = 8 منتجات في صفّين كاملين، لا فراغ.
- على الموبايل برضه يفضل rail (لأن الموبايل دايماً rail بصرف النظر عن الـ prop).
- نفس الشي للقسم 9 (Computers، السطر 291).

#### 3) زيادة عدد المنتجات في الـ data slices (HomeContent.tsx)
- `latestProducts`: 12 → **18** (يملأ 6 أعمدة × 3 صفوف على xl، أو 6×3 على lg).
- `featuredProducts`: 8 → **12** (يملأ 4×3 على premium desktop).
- `phoneProducts` / `computerProducts` / `gamingProducts`: 8 → **12**.
- لو الـ DB ما عندوش 12 منتج featured، الـ auto-fill بيقص لأقرب صف كامل تلقائياً.

#### 4) `maxItems` props تتحدّث في HomeContent.tsx
- Section 3 (Latest, السطر 175): `maxItems={12}` → **`maxItems={18}`**.
- Section 6 (Featured): شيل `maxItems` خالص — يعتمد على auto-fill.
- Section 8/10 (Phones, Gaming, السطر 262, 317): `maxItems={8}` → **`maxItems={12}`**.
- Section 9 (Computers): مفيش maxItems حالياً — يبقى auto-fill.

## النتيجة

- ✅ ولا صف ناقص في أي tier.
- ✅ Featured section بيظهر صفّين كاملين 4×2 على الديسكتوب (8 كروت) بدل 3 كروت ومساحة فاضية.
- ✅ Standard sections بتظهر 12 أو 18 منتج في صفوف كاملة (6×2 أو 6×3).
- ✅ زر "عرض الكل" يفضل ظاهر لمن عاوز يستكشف أكتر.
- ✅ Mobile rail يفضل بنفس السلوك app-like (أهم mobile UX).

## الملفات

- `src/components/home/ProductRail.tsx` — منطق auto-fill حسب tier.
- `src/components/home/HomeContent.tsx` — تحويل sections 6 و 9 لـ grid، زيادة slices و maxItems.

