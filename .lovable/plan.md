
# مراجعة SEO شاملة — هيكل العناوين والعوامل المرتبطة

## 1. ملخص نتائج المراجعة (Audit)

### مشاكل H1 المكتشفة

**صفحات بدون H1 على الإطلاق (يجب إضافة):**
- `Sitemap.tsx`, `Rss.tsx` — تستخدم `PageHero` لكن `PageHero` يصدر H1 من خاصية `title` ✅ (سليمة فعلياً)
- `OpeningDay.tsx` — تستخدم `OpeningHero` التي تستخدم `PageHero` ✅ (سليمة)

**صفحات H1 ضعيف أو سياقي فقط:**
- `Index.tsx` (HomeContent): H1 بنص ضعيف "وجهتك للكمبيوتر…" ومخفي بـ `sr-only` على الموبايل بنفس النص — جيد لكن النص يمكن تقويته بكلمات مفتاحية أقوى.
- `FAQ.tsx`: H1 = "أسئلة الزوار والتجار" — عام جداً، لا يحتوي "مول البستان".
- `Privacy.tsx`, `Terms.tsx`, `RewardTerms.tsx`, `Blog.tsx`, `Careers.tsx`: H1 موجود لكن قصير جداً بدون السياق.
- `BlogPost.tsx`, `StoreDetail.tsx`, `OfferDetail.tsx`, `ProductDetail.tsx`: H1 ديناميكي جيد ✅.
- `DowntownDirectory.tsx`, `DowntownMerchantDetail.tsx`, `DailyDeals.tsx`, `JoinMarketplace.tsx`, `DeviceCategory.tsx`, `DevicePage.tsx`, `kz/KzSearch.tsx`, `SpinWin.tsx`, `Countdown.tsx`, `InteractiveMap.tsx` ✅.

**صفحات بـ H1 متعدد (انتهاك قاعدة H1 واحد):**
- `Index.tsx`: يحتوي **H1 مرئي للديسكتوب** + **H1 آخر sr-only للموبايل** — بنفس الوقت، مما ينتج H1 مكرر في DOM. الحل: استخدم نفس العنصر مع class مرن (block على ديسكتوب، sr-only على موبايل).
- `OfferDetail.tsx`, `StoreDetail.tsx`: حالة "غير موجود" تستخدم H1 إضافي — مقبول لأنه render بديل وليس متزامن.
- `MarketEcho.tsx` (`MarketEchoImmersive`): يحتوي H1 + `ScenePhraseReveal` يحتوي H1 آخر — **انتهاك حقيقي**. يجب تحويل H1 الثاني إلى H2 أو role="presentation".

**ترقيات H2 → H1 مطلوبة (صفحات بدون H1 صريح):**
- لا توجد بعد ترقيات إذ كل الصفحات الرئيسية تستخدم `PageHero`/`BranchHeroSlider`/`OpeningHero` التي توفر H1.

### مشاكل تسلسل العناوين (heading hierarchy)

- `Stores.tsx`, `Contact.tsx`, `About.tsx`, `Leasing.tsx`, `Products.tsx`: تنتقل من H1 (PageHero) مباشرة إلى عناصر H2 ✅ — سليم.
- `StoreDetail.tsx`, `ProductDetail.tsx`, `OfferDetail.tsx`: H3 أحياناً يسبق H2 في نفس القسم — مشكلة تسلسل.
- `DowntownMerchantDetail.tsx`, `DailyDeals.tsx`, `InteractiveMap.tsx`, `Countdown.tsx`: تسلسل سليم ✅.
- `RewardTerms.tsx`, `Privacy.tsx`, `Terms.tsx`: H1 → H2 ✅.

### مشاكل SEO أخرى مرصودة

1. **Hreflang ناقص**: `SEOHead` يصدر `ar-EG` و `x-default` فقط، لا يصدر `en` رغم وجود `titleEn`/`descriptionEn`. عدم وجود مسار `/en/` يجعل هذا مقبولاً لكن يجب تأكيد.
2. **Meta description**: بعض الصفحات تعرّف `description` طويل (>160 char) — مثل `Index.tsx`. يحتاج اختصار.
3. **Internal anchors**: صفحات `Stores`, `Products`, `DailyDeals`, `Index` تستخدم روابط `#hash` بدون عنصر هدف يحمل نفس `id` في كل الحالات — يجب التحقق.
4. **Image alt**: شعارات المتاجر داخل `TenantLogo` تعتمد `alt` ديناميكي ✅، لكن بعض الـ hero images في `BranchHeroSlider` تستخدم `alt` من قائمة slides — تحقق من جودة النصوص.
5. **Canonical**: ✅ موجود في `SEOHead` لكل الصفحات.
6. **JSON-LD**: غني وحديث ✅ (تمت إضافات كثيرة في الجلسات السابقة).
7. **Breadcrumb visual**: موجود في `TechPlanet`, لكن مفقود في `StoresCategory`, `DeviceCategory`, `DevicePage` كعنصر مرئي (موجود في schema فقط).
8. **`H2` يحمل `section-title` لكن H1 مفقود في بعض المكونات الفرعية**: غير مشكلة، لأن الصفحة الأم توفر H1.
9. **العناوين كصور أو span فقط**: لا توجد مشاكل ✅.
10. **Skip-to-content link**: لم أتحقق — قد يكون مفقوداً.
11. **`<title>` بطول مناسب**: ✅ بفضل template "| مول البستان".

---

## 2. خطة التنفيذ (التغييرات)

### A — إصلاحات H1 الحرجة

1. **`src/components/home/HomeContent.tsx`**:
   - دمج H1 المزدوج في عنصر واحد بـ class شرطي: `<h1 className="text-center md:text-[1.08rem] sr-only md:not-sr-only md:font-bold ...">`
   - تقوية النص إلى: **"مول البستان — أكبر وجهة للكمبيوتر والإلكترونيات والتقنية في القاهرة الجديدة ووسط البلد"** (أكثر استهدافاً جغرافياً وكلمات مفتاحية).

2. **`src/components/market-echo/scenes/ScenePhraseReveal.tsx`**:
   - تحويل H1 → H2 (لأن `MarketEchoImmersive` يحتوي H1 رئيسي).

3. **`src/pages/FAQ.tsx`**:
   - تقوية H1: **"الأسئلة الشائعة عن مول البستان — للزوار والتجار"**.

4. **`src/pages/Privacy.tsx`, `Terms.tsx`, `RewardTerms.tsx`, `Blog.tsx`, `Careers.tsx`**:
   - تطعيم H1 بالعلامة التجارية والسياق الجغرافي:
     - Privacy: "سياسة الخصوصية — مول البستان"
     - Terms: "الشروط والأحكام — مول البستان"
     - RewardTerms: "شروط مكافآت أدر واربح — مول البستان"
     - Blog: "مدونة مول البستان — أخبار التقنية والمحلات"
     - Careers: "الوظائف والفرص في مول البستان"

### B — إصلاحات تسلسل العناوين

5. **`StoreDetail.tsx`, `ProductDetail.tsx`, `OfferDetail.tsx`**:
   - مراجعة الأقسام التي تستخدم H3 قبل H2 الأقرب وتطبيع التسلسل (H1 → H2 → H3).
   - عناوين البطاقات الصغيرة (مثل اسم منتج داخل grid) → استبدال H3 بـ `<p className="font-bold">` عندما لا تكون عنوان قسم حقيقي.

### C — تحسينات SEO عامة

6. **`src/components/SEOHead.tsx`**:
   - اختصار `description` إلى ≤155 حرف عبر تشذيب تلقائي + تحذير console.dev في وضع التطوير.
   - إضافة `<meta name="theme-color">` ديناميكي لمطابقة theme.
   - إضافة دعم `prev`/`next` للصفحات المرقّمة (`Stores`, `Products`).
   - تأكيد عدم تكرار breadcrumb JSON-LD (يحدث في `Index.tsx` حالياً — يُضاف يدوياً + `buildCoreGraphLd` قد يصدره أيضاً).

7. **`src/pages/Index.tsx`**:
   - تقصير وصف الميتا إلى نسخة 150 حرف.

8. **Breadcrumb مرئي**:
   - إضافة سطر breadcrumb مرئي صغير في `StoresCategory.tsx` و `DeviceCategory.tsx` و `DevicePage.tsx` (روابط: الرئيسية ‹ المحلات ‹ الفئة).

9. **Skip-to-content link**:
   - إضافة `<a href="#main" className="sr-only focus:not-sr-only ...">تخطي إلى المحتوى</a>` في `MainLayout.tsx` + `id="main"` على `<main>`.

10. **Alt للصور البطلة**:
   - مراجعة `BranchHeroSlider` slides لضمان alt واضح يصف المكان (لا "hero image").

### D — توثيق

11. حفظ memory جديدة `mem://style/seo-heading-rules` تلخص:
   - H1 واحد فقط لكل صفحة.
   - استخدام `PageHero`/`BranchHeroSlider`/`OpeningHero` كمصدر H1 الوحيد.
   - عناوين البطاقات داخل grids تستخدم `<p>` لا `<h3>`.
   - نصوص H1 يجب أن تحتوي "مول البستان" أو السياق الجغرافي.

---

## 3. ملفات سيتم تعديلها

```
src/components/home/HomeContent.tsx          (دمج H1 + تقوية النص)
src/components/market-echo/scenes/ScenePhraseReveal.tsx  (H1 → H2)
src/components/SEOHead.tsx                   (طول description + meta إضافية)
src/components/layout/MainLayout.tsx         (skip-to-content + main id)
src/pages/FAQ.tsx                            (تقوية H1)
src/pages/Privacy.tsx                        (تقوية H1)
src/pages/Terms.tsx                          (تقوية H1)
src/pages/RewardTerms.tsx                    (تقوية H1)
src/pages/Blog.tsx                           (تقوية H1)
src/pages/Careers.tsx                        (تقوية H1)
src/pages/Index.tsx                          (تقصير description + إزالة تكرار breadcrumb إن وجد)
src/pages/StoreDetail.tsx                    (تطبيع H2/H3)
src/pages/ProductDetail.tsx                  (تطبيع H2/H3)
src/pages/OfferDetail.tsx                    (تطبيع H2/H3)
src/pages/StoresCategory.tsx                 (breadcrumb مرئي)
src/pages/DeviceCategory.tsx                 (breadcrumb مرئي)
src/pages/DevicePage.tsx                     (breadcrumb مرئي)
mem://style/seo-heading-rules                (memory جديد)
```

النتيجة: هيكل عناوين موحّد ومنظم، H1 واحد قوي لكل صفحة بكلمات مفتاحية، تسلسل تنازلي صحيح، وميتا تاج محسّنة لمحركات البحث.
