# خطة استغلال المساحات وإزالة الفراغات بين أقسام الصفحة الرئيسية

## التشخيص

من اللقطات الثلاث يظهر فراغ أبيض كبير في 3 مواضع على الموبايل:

1. **بين شبكة الفئات (CategoryStrip) و"منتجات مختارة"** — فراغ ~140px.
2. **بين زر "عرض كل المنتجات" وقسم "عروض مختارة"** — فراغ ~280px.
3. **بين بطاقة "كوكب البستان" وقسم "تعرّف على المحلات"** — فراغ ~180px.

**السبب الجذري** في `HomeContent.tsx`: قيم `minHeight` و`containIntrinsicSize` المحجوزة لأقسام متعددة أكبر من الارتفاع الفعلي للمحتوى بعد التحميل، فيظل الفرق فراغاً مرئياً:

| القسم | المحجوز حالياً | الواقعي على الموبايل |
|---|---|---|
| CategoryStrip | `minHeight: 360` | ~480px (أكبر، آمن) |
| Featured Products | `minHeight: 700` + `containIntrinsicSize 700` | الفعلي يتوسع تلقائياً — `minHeight` يخلق فراغ سفلي عند تحميل أبطأ |
| DealsTeaser | `minHeight: 620` + `containIntrinsicSize 640` | ~560px → فراغ ~60-80px |
| Latest Picks | `minHeight: 560` + `containIntrinsicSize 560` | يتوسع تلقائياً |
| Map Teaser | `containIntrinsicSize 180` | جيد |
| TechPlanetCTA | `containIntrinsicSize 200` + `LazySection minHeight 180` | الفعلي ~120px |
| MerchantLogoWall | `containIntrinsicSize 240` + `LazySection minHeight 240` | الفعلي ~520px (أصغر بكثير من المحجوز يسبب قفزة، الأكبر آمن) |

السبب الإضافي: استخدام `minHeight` ثابت **بالإضافة إلى** `contentVisibility:auto + containIntrinsicSize` يضاعف الحجز — يكفي واحد منهما.

---

## الإصلاحات

### 1) إزالة `minHeight` الزائد من الأقسام التي تستخدم `contentVisibility`

الاكتفاء بـ `containIntrinsicSize` كمقاس أولي، ثم يتقلص لحجم المحتوى الفعلي تلقائياً بعد render. التغييرات في `src/components/home/HomeContent.tsx`:

- **Featured Products**: حذف `minHeight: 700`؛ الإبقاء فقط على `display: none` عند < 3 منتجات.
- **DealsTeaser**: تقليل `minHeight` من 620 إلى 0 (إزالة)، وتقليل `containIntrinsicSize` من 640 إلى 540.
- **Latest Picks**: حذف `minHeight: 560`، تقليل `containIntrinsicSize` إلى 480.
- **TechPlanetCTA**: تقليل `LazySection minHeight` من 180 إلى 120، و`containIntrinsicSize` من 200 إلى 140.
- **CategoryStrip**: رفع `minHeight` من 360 إلى الأقرب للواقع (440 على الموبايل) لإزالة قفزة CLS مع تجنّب الفراغ.

### 2) تقليص padding بين الأقسام الموبايلية

القيم الحالية `clamp(12px, 2.2vw, 36px)` على الموبايل ≈ 14-16px لكل جانب — مقبولة لكن يمكن تكثيفها:

- توحيد `paddingTop/Bottom` في الأقسام التجارية المتتالية إلى `clamp(10px, 1.6vw, 28px)` لتقصير الانتقال بين Featured → Deals → Latest.
- إزالة spacing مزدوج بين أقسام متتالية بنفس الخلفية الفاتحة.

### 3) معالجة الفراغ تحت "كوكب البستان" → "محلات المول"

تقليل padding سفلي لقسم TechPlanet، وتقليل `containIntrinsicSize` لـ MerchantLogoWall إلى قيمة قريبة من الواقع (نحو 480) بدلاً من 240 الحالية (تسبب قفزة عكسية).

### 4) تقليل ارتفاع `LazySection` الافتراضي

التحقق من `LazySection.tsx` للتأكد أن `minHeight` يُلغى بعد ظهور المحتوى (يستبدله ارتفاع المحتوى الفعلي). إن لم يكن، تعديله ليكون `minHeight` مبدئياً فقط ثم يصبح `auto` بعد التحميل.

---

## النتيجة المتوقعة

- اختفاء الفراغات الـ3 الكبيرة في اللقطات.
- تدفق بصري متماسك بين الأقسام التجارية.
- الحفاظ على CLS ≤ 0.08 (قيمة "good") لأن الحجز سيظل أقرب لارتفاع المحتوى الحقيقي.
- لا تأثير على الأداء أو حساب LCP (الأقسام الأبعد عن الـviewport تظل خلف `contentVisibility:auto`).

---

## الملفات المعدَّلة

- `src/components/home/HomeContent.tsx` — معظم التغييرات.
- `src/components/home/LazySection.tsx` — تعديل بسيط إن لزم لإلغاء minHeight بعد التحميل.

لا تغييرات في تصميم البطاقات، النصوص، أو سلوك التحميل — فقط إصلاح أحجام الحجز.
