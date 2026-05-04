# خطة شاملة: Sitemaps + Schema.org لمول البستان

## ١) الوضع الحالي (تدقيق سريع)

**Sitemaps موجودة:**
- `public/sitemap.xml` (ثابت احتياطي) + `sitemap-main.xml` + `sitemap-devices.xml`
- Edge function `/functions/v1/sitemap` ديناميكي يدعم: index، أو flat، أو أقسام (`?section=pages|devices|stores|products|blog`)
- `robots.txt` يشير لكل السايت ماب الفرعية + يحجب AI crawlers

**Schema.org موجودة في `SEOHead.tsx`:**
Organization, LocalBusiness/ElectronicsStore, ShoppingCenter, WebSite (+SearchAction), BreadcrumbList, FAQPage, Event, Store/ComputerStore, ItemList (stores/products/categories), Product, BlogPosting, CollectionPage, WebPage, ContactPage, AboutPage, Branch (LocalBusiness+ShoppingCenter), RealEstateListing, Offer, Service, SiteNavigationElement, SpeakableSpecification, SearchResultsPage, KZ Product (مع condition), PromoEvent, JobPosting، @graph bundler.

**الفجوات الفعلية** التي تستحق إضافات (وما عداها مكرر/غير مفيد):

| فئة | فجوة | الأثر |
|---|---|---|
| Sitemap | لا يوجد **image sitemap** للمنتجات/المحلات/الدليل | فقدان فهرسة Google Images |
| Sitemap | لا يوجد **video sitemap** (لو هناك فيديوهات هيرو/تشويق) | فقدان فهرسة Video |
| Sitemap | لا يوجد **news sitemap** للمدونة | عدم ظهور Top Stories |
| Sitemap | `sitemap.xml` على الجذر ثابت — لا يعكس آخر lastmod | تأخير اكتشاف التحديثات |
| Sitemap | لا يوجد **hreflang ar-EG / x-default** في عناصر URL (موجود في HTML فقط) | إشارات لغة أضعف لـ Bing |
| Sitemap | لا يوجد قسم **offers** (DailyDeals، OfferDetail) | غياب صفحات العروض من السايت ماب |
| Sitemap | لا يوجد قسم **categories** (`/stores?category=…`) كصفحات قابلة للفهرسة (محجوبة بـ `?*` في robots — قرار صحيح، لكن نريد URLs نظيفة) | فقدان صفحات هبوط للفئات |
| Schema | لا يوجد **ImageObject** على المنتجات (caption/license) | تعزيز Google Images |
| Schema | لا يوجد **VideoObject** للهيرو/تيزر الافتتاح | rich result للفيديو |
| Schema | لا يوجد **MerchantReturnPolicy / shippingDetails** على Product | تحذيرات Search Console |
| Schema | لا يوجد **QAPage** لصفحة FAQ على مستوى الصفحة (FAQPage موجود لكن QAPage مختلف) | تغطية صفحات السؤال الواحد |
| Schema | لا يوجد **HowTo** (مثلاً "كيف توصل للمول") | rich snippet |
| Schema | لا يوجد **Brand** schema منفصل (Apple, Samsung, …) في صفحات الفئات/المنتجات | تجميع علامات |
| Schema | لا يوجد **OfferCatalog** يجمع عروض كل محل | عرض مجمّع |
| Schema | لا يوجد **Place + amenityFeature** (مواقف، Wi-Fi، مصاعد، حمامات) | إثراء Local pack |
| Schema | لا يوجد **PaymentMethod / acceptedPaymentMethod** بشكل صريح كقائمة | ميزات Shopping |
| Schema | لا يوجد **Person** لفريق القيادة (اختياري) | ProfilePage |
| Schema | `Event` للافتتاح موجود لكن بدون `performer/sponsor/offers` كاملة | تفاصيل أعمق |
| Schema | لا يوجد **NewsArticle** لمقالات المدونة الإخبارية | Top Stories |
| Schema | لا يوجد **Map** schema لصفحة `/map` | فهرسة الميزة |
| Schema | لا يوجد **DataFeed** أو **Dataset** للكتالوج العام (للـ Merchant Center لاحقاً) | تكامل تجاري |

---

## ٢) خطة Sitemaps الكاملة

### أ) إعادة هيكلة `sitemap-index` كنقطة دخول واحدة

تعديل `supabase/functions/sitemap/index.ts` ليُرجع دائماً **sitemap index** على المسار الجذري (بدون threshold)، يحتوي على هذه الملفات الفرعية:

```text
/sitemap.xml  (root, served by edge — أو يبقى static index بسيط يشير للـ edge)
├── ?section=pages           — صفحات ثابتة + downtown directory
├── ?section=stores          — كل المحلات
├── ?section=products        — كل المنتجات (mall + KZ)
├── ?section=devices         — صفحات فئات الأجهزة
├── ?section=categories      — صفحات /stores/category/<slug> (URLs نظيفة، تتطلب route)
├── ?section=offers          — DailyDeals + OfferDetail
├── ?section=blog            — مقالات المدونة
├── ?section=images          — image sitemap منفصل (Google يحبه مستقلاً)
├── ?section=video           — video sitemap (لو هناك فيديو)
└── ?section=news            — news sitemap (آخر 48 ساعة فقط)
```

### ب) Image Sitemap

لكل URL في products/stores/blog/downtown، إضافة عناصر `<image:image>` داخل عنصر URL:
```xml
<url>
  <loc>https://mallelbostan.com/products/iphone-15</loc>
  <image:image>
    <image:loc>https://.../iphone-15.webp</image:loc>
    <image:title>iPhone 15 — مول البستان</image:title>
    <image:caption>...</image:caption>
  </image:image>
</url>
```
namespace: `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`

### ج) Video Sitemap

لو يوجد `hero_videos` أو فيديو افتتاح على Cloudflare Stream/YouTube، إنشاء قسم منفصل بعناصر `<video:video>` يحوي `thumbnail_loc, title, description, content_loc, duration, publication_date, family_friendly, requires_subscription=no, live=no`.

### د) News Sitemap للمدونة

namespace: `xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"`. شامل فقط آخر 48 ساعة من `blog_posts.published_at`. كل URL يحوي `<news:news>` بـ `publication.name=مول البستان, language=ar, publication_date, title`.

### هـ) Categories Sitemap (URLs نظيفة)

إنشاء routes جديدة `/stores/category/:slug` تعيد توجيه أو render مباشر (للسماح بفهرسة)، ثم إدراجها في `?section=categories` بقيم priority 0.7 و changefreq weekly. سيتطلب:
- إضافة route في React Router
- صفحة `StoresCategoryPage.tsx` تستخدم نفس مكوّنات `Stores.tsx` مع filter pre-applied
- canonical للصفحة الجديدة بدون query string
- تحديث `robots.txt` للسماح بـ `/stores/category/`

### و) Offers Sitemap

قسم جديد `?section=offers` يضم:
- `/daily-deals` (أساسي)
- `/offers/<slug>` لكل عرض من `offers` table حيث `valid_to >= now()` و `is_active=true`

### ز) دعم hreflang داخل عناصر URL

استخدام `xmlns:xhtml="http://www.w3.org/1999/xhtml"` مع `<xhtml:link rel="alternate" hreflang="ar-EG" href="..."/>` و`x-default` لكل URL — يحسّن إشارات Bing/Yandex.

### ح) جعل `/sitemap.xml` على الجذر يعكس آخر تحديث

خياران (يُختار خيار واحد):
- **A (مفضّل)**: استبدال `public/sitemap.xml` بإعادة توجيه عبر `public/_headers` أو Cloudflare Worker → edge function. أبسط: تعديل `public/sitemap.xml` ليكون **sitemap index ثابت** يشير فقط لعناوين `?section=…` على الـ edge، فيظل ثابتاً لكن أطفاله ديناميكيون.
- **B**: نشر edge function على دومين فرعي أو via rewrite في `_headers` ليصبح `/sitemap.xml` يعيد محتوى الـ edge مباشرة (يتطلب Cloudflare).

### ط) ping للمحركات بعد كل تحديث محتوى

إضافة Edge function أو DB trigger يستدعي `https://www.google.com/ping?sitemap=…` و`https://www.bing.com/ping?sitemap=…` بعد كل insert/update على products/stores/blog (مع debounce). موجود جزئياً في `ping-indexing` — توسيعه للسايت ماب الجديدة.

### ي) Audit script

تحديث `scripts/audit-sitemap-robots.ts` ليتحقق من:
- كل URL في كل sitemap يعيد 200
- canonical في الصفحة == loc في sitemap
- لا تكرار بين sitemap-index و sub-sitemaps
- `noindex` لا يظهر في أي sitemap
- لا URLs محجوبة بـ robots داخل sitemap

---

## ٣) خطة Schema.org الكاملة

### Builders جديدة في `src/components/SEOHead.tsx`

| Builder | الاستخدام | الصفحات المستهدفة |
|---|---|---|
| `buildImageObjectLd` | ImageObject مع contentUrl, width, height, caption, license | منتجات، صور هيرو |
| `buildVideoObjectLd` | VideoObject مع thumbnailUrl, uploadDate, duration (ISO 8601), embedUrl | هيرو، صفحة الافتتاح |
| `buildMerchantReturnPolicyLd` | سياسة الاسترجاع (returnPolicyCategory, merchantReturnDays, returnMethod) | كل Product |
| `buildShippingDetailsLd` | OfferShippingDetails (deliveryTime, shippingRate, shippingDestination=EG) | كل Offer |
| `buildQAPageLd` | QAPage مع mainEntity=Question + acceptedAnswer + suggestedAnswer | صفحات سؤال واحد (لو وُجدت) |
| `buildHowToLd` | HowTo (steps, totalTime, estimatedCost) | "كيف تصل للمول"، "كيف تختار لابتوب" |
| `buildBrandLd` | Brand مع logo + sameAs | صفحات /brands/<brand> (لو أُضيفت) |
| `buildOfferCatalogLd` | OfferCatalog لكل محل (يجمع منتجاته كـ Offers) | StoreDetail |
| `buildAmenityFeaturesLd` | LocationFeatureSpecification (Parking, WiFi, Elevator, Restrooms, ATM, Mosque) | Mall + Branches |
| `buildPaymentAcceptedLd` | acceptedPaymentMethod كـ array (Cash, Visa, MasterCard, Mastercard, MeezaCard, InstaPay, Vodafone Cash) | Organization |
| `buildPersonLd` | Person + ProfilePage للقيادة (اختياري) | /about/team |
| `buildEventEnhancedLd` | تحديث Event الحالي بـ performer, sponsor, offers, eventStatus, isAccessibleForFree | OpeningDay, SpinWin |
| `buildNewsArticleLd` | NewsArticle بدلاً من BlogPosting لمقالات إخبارية | Blog (مع flag `is_news`) |
| `buildMapLd` | Map schema (hasMap, name, url, mapType=VenueMap) | /map |
| `buildDatasetLd` | Dataset للكتالوج (مفيد للمستقبل: Merchant Center، LLM crawlers) | /products (sitewide footer LD) |
| `buildAggregateOfferLd` | AggregateOffer لقوائم منتجات بنفس الـ SKU عبر محلات (lowPrice, highPrice, offerCount) | StoreDetail/ProductDetail |
| `buildPlaceLd` | Place محسّن مع photo, publicAccess, smokingAllowed, maximumAttendeeCapacity | /map, branches |

### تطبيق على الصفحات

```text
/                    → Organization, ShoppingCenter, WebSite (موجود)
                       + SiteNavigationElement, Speakable, Map (نقص)
/stores              → CollectionPage + ItemList (موجود) + AggregateOffer (إضافة)
/stores/<slug>       → Store/ElectronicsStore (موجود) + OfferCatalog + AmenityFeatures (إضافة)
/stores/category/<slug> → CollectionPage + Brand (جديد route + schema)
/products            → CollectionPage + ItemList (موجود)
/products/<slug>     → Product (موجود) + MerchantReturnPolicy + ShippingDetails + ImageObject + AggregateOffer (لو متاح)
/devices             → CollectionPage + ItemList
/devices/<slug>      → CollectionPage مع Brand[]
/map                 → WebPage + Map + Place + AmenityFeatures
/leasing             → Service (موجود) + RealEstateListing (موجود) + AggregateRating (تجنّب)
/about               → AboutPage (موجود) + Organization (موجود) + Person[] (اختياري)
/contact             → ContactPage (موجود) + multiple ContactPoint
/blog                → CollectionPage (موجود) + Blog
/blog/<slug>         → BlogPosting (موجود) أو NewsArticle (لو is_news)
/faq                 → FAQPage (موجود) + Speakable
/opening-day         → Event محسّن + VideoObject + ImageGallery
/spin-win            → PromoEvent (موجود) + Game (اختياري)
/daily-deals         → CollectionPage + ItemList of Offer
/offers/<slug>       → Offer (موجود) + ShippingDetails + MerchantReturnPolicy
/new-cairo-branch    → Branch (موجود) + AmenityFeatures
/downtown-branch     → Branch (موجود) + AmenityFeatures + foundingDate=1990
/downtown-directory  → CollectionPage + ItemList
/downtown-directory/<slug> → Store + Place
/join-marketplace    → Service (موجود)
/careers             → CollectionPage + JobPosting[] (موجود)
/kz                  → CollectionPage + OnlineStore
/kz/products/<slug>  → Product (موجود) + Return/Shipping
/kz/cart, /kz/search → noindex (لا schema)
/privacy, /terms     → WebPage (موجود)
```

### قواعد صارمة (مع الـ project knowledge)

- **ممنوع**: AggregateRating/Review مزيّفة، أسعار وهمية، availability ثابت "InStock" بدون تحقق.
- **مطلوب**: validation عبر `scripts/validate-rich-results.ts` (موجود) — توسيعه ليفحص كل builder الجديد.
- **ميتا**: `@id` لكل entity رئيسية + استخدام `@graph` (عبر `buildCoreGraphLd`) لربط Entities ومنع التكرار.

---

## ٤) ترتيب التنفيذ (مراحل)

**المرحلة 1 — السايت ماب (يوم واحد):**
1. توسيع edge function: image sitemap + offers + news + hreflang
2. تحديث `public/sitemap.xml` ليكون sitemap index ثابت يشير لأقسام الـ edge
3. تحديث `robots.txt` بكل الـ sitemap URLs الجديدة
4. توسيع `audit-sitemap-robots.ts`

**المرحلة 2 — Schema الأساسية المفقودة (يوم واحد):**
1. إضافة كل الـ builders الجديدة في `SEOHead.tsx`
2. تطبيقها على صفحات Product و Offer و StoreDetail (الأهم تجارياً)
3. إضافة Map + AmenityFeatures على `/map` والفروع

**المرحلة 3 — Routes الجديدة (نصف يوم):**
1. `/stores/category/:slug` كصفحة هبوط نظيفة
2. `/brands/:slug` (اختياري — لو لدينا قائمة براندات)

**المرحلة 4 — Video/News/Person (اختياري حسب توفر المحتوى):**
1. Video sitemap لو يوجد فيديو
2. News sitemap للمدونة
3. ProfilePage للقيادة

**المرحلة 5 — التحقق:**
1. تشغيل `scripts/validate-rich-results.ts` على عيّنة من كل نوع صفحة
2. اختبار في [Schema Markup Validator](https://validator.schema.org) و[Rich Results Test](https://search.google.com/test/rich-results)
3. تشغيل audit للسايت ماب يدوياً + رفعها في Google Search Console و Bing Webmaster

---

## ٥) الملفات المتأثرة

- `supabase/functions/sitemap/index.ts` — توسيع شامل
- `supabase/functions/robots/index.ts` + `public/robots.txt` — تحديث Sitemap directives
- `public/sitemap.xml` — تحويله لـ sitemap index ثابت يشير للـ edge
- `src/components/SEOHead.tsx` — ~12 builder جديد
- `src/pages/ProductDetail.tsx`, `StoreDetail.tsx`, `OfferDetail.tsx`, `InteractiveMap.tsx`, `NewCairoBranch.tsx`, `DowntownBranch.tsx`, `OpeningDay.tsx`, `Blog.tsx`, `BlogPost.tsx`, `Stores.tsx`, `DailyDeals.tsx` — استدعاء البيلدرز الجديدة
- `src/App.tsx` — route جديد `/stores/category/:slug` (+`/brands/:slug` اختياري)
- صفحة جديدة `src/pages/StoresCategory.tsx`
- `scripts/audit-sitemap-robots.ts` + `scripts/validate-rich-results.ts` — توسيع الفحص

---

## ٦) النتائج المتوقعة

- تغطية فهرسة كاملة (نص + صورة + فيديو + أخبار + عروض + فئات)
- Rich results محتملة: FAQ، Events، Products بأسعار، Sitelinks، Local pack محسّن، Image pack، Top Stories (للمدونة)
- إشارات قوية لـ Google/Bing/Yandex بأن الموقع كيان تجاري حقيقي (Place + Mall + Stores متعدد المستويات)
- جاهزية مستقبلية لـ Google Merchant Center و Shopping Graph
