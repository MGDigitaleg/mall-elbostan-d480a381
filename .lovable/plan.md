

## ضبط زر "الرجوع لأعلى" ليتجنّب StickyCTA على الموبايل

### الوضع الحالي
- صفحة `/products` **لا تستخدم** `StickyCTA` إطلاقاً، إذن لا يوجد تعارض فعلي عليها — زر BackToTop يظهر فقط فوق `MobileBottomNav` (56px) ويُحسب له offset = 72px وهو سليم.
- لكن `StickyCTA` يُستخدم فعلياً في صفحتين: `/leasing` و `/spin-win`. وهناك يحدث التعارض الحقيقي:
  - `MobileBottomNav` ≈ 56px
  - `StickyCTA` فوقها بكارت ارتفاعه ~70-95px (زر h-12 + padding + hint اختياري)
  - `BackToTop` حالياً عند `bottom: 72px` → يقع **داخل** كارت الـ StickyCTA ويغطّيه.

### الحل
جعل `BackToTop` ذكياً: يكتشف وجود `StickyCTA` على الصفحة ويرفع نفسه فوقها على الموبايل.

#### التغييرات

**1. `src/components/layout/StickyCTA.tsx`**
- إضافة `data-sticky-cta="true"` كسمة على الـ wrapper الخارجي حتى يمكن اكتشافه من الـ DOM.

**2. `src/components/BackToTop.tsx`**
- إضافة `useEffect` يرصد وجود عنصر `[data-sticky-cta]` في الـ DOM (مع `MutationObserver` خفيف لرصد ظهوره/اختفائه الديناميكي).
- إذا وُجد StickyCTA على الموبايل: قياس `offsetHeight` الفعلي للكارت + 12px فجوة + `env(safe-area-inset-bottom)` بدل القيمة الثابتة 72px.
- إذا لم يوجد: نُبقي السلوك الحالي (`72px + safe-area`).

**منطق الحساب:**
```ts
// mobile only
const stickyEl = document.querySelector('[data-sticky-cta]');
const offset = stickyEl
  ? stickyEl.getBoundingClientRect().height + 56 + 12  // sticky height + bottom-nav + gap
  : 72;
```

(56 لأن StickyCTA نفسها مرفوعة عن أسفل الشاشة بمقدار ارتفاع MobileBottomNav.)

**3. التحقق على `/products`**
- لا حاجة لتغيير في `Products.tsx` — لا StickyCTA هناك، السلوك الحالي صحيح.
- البلاغ النهائي للمستخدم سيوضّح أن `/products` لا تحتوي StickyCTA أصلاً، وأن التحسين الفعلي يخدم `/leasing` و `/spin-win` (حيث التعارض حقيقي).

### الملفات المتأثرة
| ملف | تغيير |
|------|-------|
| `src/components/layout/StickyCTA.tsx` | إضافة `data-sticky-cta` للـ wrapper |
| `src/components/BackToTop.tsx` | اكتشاف StickyCTA ديناميكياً وضبط `bottom` تلقائياً |

### النتيجة
- على `/products`: لا تغيير في السلوك (لا يوجد StickyCTA).
- على `/leasing` و `/spin-win`: زر BackToTop يرتفع تلقائياً فوق كارت الـ StickyCTA بفجوة 12px واضحة، بدون أي تداخل.

