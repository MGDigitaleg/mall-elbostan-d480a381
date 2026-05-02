# خطة: توسيع Schema.org وتسريع الفهرسة

## الوضع الحالي

النظام يحتوي على بنية SEO قوية بالفعل عبر `src/components/SEOHead.tsx`:
- Organization / LocalBusiness / ElectronicsStore
- ShoppingCenter, WebSite + SearchAction
- Store, Product, BlogPosting, JobPosting, FAQPage, Event
- BreadcrumbList تلقائي + ItemList للقوائم
- Sitemap ديناميكي عبر edge function + IndexNow ping يدوي

**الفجوات المُكتشفة:**
1. صفحات كثيرة بدون JSON-LD مخصص: `Leasing`, `Contact`, `Privacy`, `Terms`, `RewardTerms`, `InteractiveMap`, `MarketEcho`, `DowntownBranch`, `NewCairoBranch`, `DowntownDirectory`, `DeviceCategory`, `DevicePage`, `TechPlanet`, `OfferDetail`, `JoinMarketplace`, `SpinWin`, `kz/*`.
2. لا يوجد schema لـ: `Offer/Discount` (للعروض), `RealEstateListing` (لوحدات الإيجار), `ContactPage`, `AboutPage`, `WebPage` افتراضي, `SiteNavigationElement` (للهيدر), `Speakable` (للصوت), `VideoObject` (للسلايدر), `ImageObject`, `ProfilePage` (للمتاجر), `Review/AggregateRating` (متروك عمداً — لا تقييمات وهمية).
3. `aggregateRating` غير مفعّل (وهذا صحيح حسب القواعد — لا نضيف تقييمات وهمية).
4. الفهرسة: `ping-indexing` يعمل يدوياً فقط — لا triggers تلقائية عند نشر متجر/منتج/مدوّنة جديدة.
5. لا يوجد `@graph` يربط Organization + ShoppingCenter + WebSite في كائن واحد (يقلل ازدواجية).
6. لا يوجد lastmod ديناميكي في sitemap الثابت (`/sitemap-main.xml`).

## الهدف

1. تغطية 100% من الصفحات العامة بـ JSON-LD صحيح ومناسب لنوع كل صفحة.
2. توحيد الكيانات الرئيسية في `@graph` لتقوية ربط Knowledge Graph.
3. أتمتة فهرسة الصفحات الجديدة فور إنشائها.

---

## الخطوات

### 1. توسيع `SEOHead.tsx` ببناة Schema جديدة

إضافة الدوال التالية:

- `buildContactPageLd()` — `ContactPage` + `ContactPoint` متعدد (مبيعات، تأجير، دعم).
- `buildAboutPageLd()` — `AboutPage` يربط بـ Organization.
- `buildWebPageLd(name, description)` — `WebPage` افتراضي للصفحات العامة (Privacy/Terms/Reward).
- `buildLeasingListingLd(units)` — مصفوفة `RealEstateListing` لوحدات الإيجار المتاحة (مساحة، طابق، حالة).
- `buildOfferLd(offer)` — `Offer` كامل لصفحات العروض (priceValidUntil, eligibleRegion, seller).
- `buildOffersListLd(offers)` — `ItemList` من `Offer`.
- `buildPlaceLd(branch)` — `Place`/`LocalBusiness` لصفحات الفروع (Downtown / New Cairo) مع geo و openingHours خاصة بالفرع.
- `buildBranchCollectionLd()` — `ItemList` يربط الفرعين.
- `buildSpeakableLd(selectors)` — `SpeakableSpecification` للهيرو (Google Assistant / صوت).
- `buildSiteNavLd()` — `SiteNavigationElement` للروابط الرئيسية (يُضاف مرة واحدة في الهيدر/الفوتر).
- `buildCollectionPageLd(name, items)` — للصفحات التجميعية مثل `DowntownDirectory`, `DeviceCategory`, `TechPlanet`.
- `buildVideoObjectLd(video)` — لأي فيديو في الهيرو/الـ MarketEcho إن وُجد.
- `buildKzProductLd()` — Product مخصص لـ Kasr Zero مع `seller` ثابت.

### 2. توحيد الكيانات في `@graph`

تعديل `Index.tsx` لاستخدام كائن `@graph` واحد بدل 3 كائنات منفصلة:
```ts
{ "@context": "https://schema.org", "@graph": [organizationLd, shoppingCenterLd, websiteLd, faqLd] }
```
يقلل التكرار ويوضح العلاقات لجوجل (`@id` مرجعي بين الكيانات موجود مسبقاً).

### 3. إضافة JSON-LD للصفحات الناقصة

| الصفحة | Schema المضاف |
|--------|---------------|
| `Leasing.tsx` | `RealEstateListing[]` + `WebPage` + `Offer` للوحدات المتاحة |
| `Contact.tsx` | `ContactPage` + `ContactPoint` متعدد |
| `About.tsx` | `AboutPage` (موجود جزئياً — يُحسّن) |
| `Privacy/Terms/RewardTerms` | `WebPage` بسيط |
| `InteractiveMap.tsx` | `Map` + `Place` + `ItemList` للطوابق |
| `MarketEcho.tsx` | `Article` + `Speakable` |
| `DowntownBranch/NewCairoBranch` | `Place`/`LocalBusiness` فرعي بـ geo و openingHours خاصة |
| `DowntownDirectory.tsx` | `CollectionPage` + `ItemList` |
| `DeviceCategory/DevicePage/TechPlanet` | `CollectionPage` + `ItemList` للمنتجات المرتبطة |
| `OfferDetail.tsx` | `Offer` + `Product` (إن وُجد) |
| `JoinMarketplace.tsx` | `WebPage` + `Service` |
| `SpinWin.tsx` | `Event` (Promotional) + `WebPage` |
| `kz/*` | `Store` لـ Kasr Zero + `Product` + `ItemList` |

### 4. إضافة `SiteNavigationElement` عالمياً

إضافة JSON-LD واحد في `MainLayout.tsx` يحتوي روابط التنقل الأساسية — يساعد جوجل في فهم بنية الموقع وإظهار sitelinks في نتائج البحث.

### 5. إثراء الـ meta tags

في `SEOHead.tsx` إضافة:
- `<meta name="geo.region" content="EG-C">`
- `<meta name="geo.placename" content="القاهرة الجديدة">`
- `<meta name="geo.position" content="30.03;31.46">`
- `<meta name="ICBM" content="30.03, 31.46">`
- `<meta name="theme-color" content="#0B1220">` (إن لم يكن موجوداً)
- `<meta property="business:contact_data:*">` لـ Facebook
- `<link rel="alternate" type="application/rss+xml">` للمدونة (إن أُضيف لاحقاً RSS)

### 6. تسريع الفهرسة (Indexing Acceleration)

أ. **Trigger تلقائي على قاعدة البيانات:**
إنشاء database webhook (أو trigger + http extension) عند:
- INSERT/UPDATE في `tenants` (متجر جديد/محدّث)
- INSERT/UPDATE في `products`
- INSERT/UPDATE في `blog_posts`
- INSERT في `offers`
يستدعي تلقائياً edge function `ping-indexing` بالـ URL الجديد فقط.

ب. **تحسين `ping-indexing`:**
- إضافة دفعات (batch) — IndexNow يقبل حتى 10,000 URL في طلب واحد.
- إضافة Bing webmaster ping (`https://www.bing.com/ping?sitemap=...`).
- إضافة Yandex IndexNow (نفس API، endpoint مختلف).

ج. **lastmod ديناميكي في sitemap-main.xml:**
تحويل `public/sitemap-main.xml` إلى ديناميكي عبر edge function (مثل sitemap الموجود) ليعكس آخر تحديث فعلي لكل صفحة من DB، بدل تاريخ ثابت `2026-04-24`.

د. **ping تلقائي عند publish/deploy:**
إضافة خطوة في GitHub Action (`.github/workflows/seo-audit.yml`) لاستدعاء `ping-indexing` بعد كل deploy ناجح.

هـ. **prerendering hint:**
إضافة `<link rel="preconnect">` لـ Google/Bing CDN في `index.html` لتسريع robot fetching.

### 7. تحديث `seo-audit.ts`

توسيع نطاق التحقق ليشمل الصفحات الجديدة في `DYNAMIC_PAGES` ويتأكد من وجود JSON-LD مخصص لكل نوع صفحة (وليس فقط breadcrumbs).

---

## الملفات المتأثرة

**تعديل:**
- `src/components/SEOHead.tsx` — +12 builder جديد + meta tags
- `src/components/layout/MainLayout.tsx` — SiteNavigation LD
- `src/pages/Index.tsx` — تحويل لـ @graph
- `src/pages/{Leasing,Contact,Privacy,Terms,RewardTerms,InteractiveMap,MarketEcho,DowntownBranch,NewCairoBranch,DowntownDirectory,DeviceCategory,DevicePage,TechPlanet,OfferDetail,JoinMarketplace,SpinWin}.tsx`
- `src/pages/kz/{KzHome,KzCategory,KzProducts,KzProductDetail}.tsx`
- `supabase/functions/ping-indexing/index.ts` — Bing + Yandex + batches
- `scripts/seo-audit.ts`
- `index.html` — preconnect + theme-color

**إنشاء:**
- `supabase/functions/sitemap-main/index.ts` — sitemap-main ديناميكي
- `supabase/migrations/<timestamp>_indexing_triggers.sql` — Database triggers تستدعي `ping-indexing` تلقائياً
- `.github/workflows` — خطوة post-deploy ping (اختياري)

---

## ملاحظات مهمة (NON-NEGOTIABLES)

- **لا** سنضيف `aggregateRating` أو `Review` وهمية — يبقى الموقع نظيفاً من البيانات المضللة.
- **لا** سنبالغ في schema تتسبب في تحذيرات Rich Results (مثل Product بدون price/availability).
- جميع الـ schema الجديدة ستمر عبر `validate-rich-results.ts` للتحقق.
- البنية تبقى Mall-first: ShoppingCenter يبقى الكيان الجذر، والمتاجر/المنتجات تابعة له عبر `containedInPlace`.

## التحقق بعد التنفيذ

1. تشغيل `bun run scripts/seo-audit.ts` — يجب أن يمر بدون errors.
2. تشغيل `bun run scripts/validate-rich-results.ts` على عينة من كل نوع صفحة.
3. اختبار يدوي عبر Google Rich Results Test و Schema.org Validator.
4. مراقبة Google Search Console لمدة أسبوع للتحقق من ارتفاع معدل الفهرسة.
