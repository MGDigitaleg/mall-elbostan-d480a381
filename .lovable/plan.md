

# خطة شاملة لتحسين SEO — مول البستان

## الوضع الحالي

الموقع يحتوي بالفعل على أساسيات جيدة: `SEOHead` component مع canonical URLs، Open Graph، Twitter Cards، JSON-LD schemas (LocalBusiness, FAQPage, Event, Store, Product, JobPosting, BlogPosting)، sitemap.xml، robots.txt، وhreflang. لكن هناك فجوات كبيرة تمنع الموقع من المنافسة بقوة في السوق المصري.

---

## المرحلة 1: إصلاح الأساسيات الناقصة

### 1.1 — صفحة 404 بدون SEO أو تجربة مستخدم
- إضافة `SEOHead` مع `noIndex` لصفحة NotFound
- تعريب النصوص بالكامل ("الصفحة غير موجودة" بدلاً من "Page not found")
- إضافة روابط مفيدة (الرئيسية، المحلات، الخريطة)

### 1.2 — تحسين `index.html` الثابت
- إضافة `hreflang="ar-EG"` و `hreflang="en"` (x-default) في `<head>`
- إضافة `<meta name="geo.region" content="EG-C" />` و `<meta name="geo.placename" content="New Cairo" />`
- إضافة `<meta name="google" content="notranslate" />` لمنع ترجمة المحتوى العربي تلقائياً

### 1.3 — تحسين SEOHead Component
- إضافة `article:published_time` و `article:modified_time` لصفحات المدونة
- إضافة `og:locale:alternate` للإنجليزية
- إضافة `keywords` meta tag لكل صفحة (مهم للسوق المصري)
- دعم `og:image:width` و `og:image:height` لتحسين معاينة المشاركات
- إضافة `author` meta tag ديناميكي

---

## المرحلة 2: تعزيز Structured Data (JSON-LD)

### 2.1 — تحسين LocalBusiness Schema
- إضافة `telephone`، `email`، `priceRange`
- إضافة `openingHoursSpecification` (عند توفر بيانات الافتتاح)
- إضافة `image` (صورة المول)
- ملء مصفوفة `sameAs` بروابط السوشيال ميديا الفعلية (فيسبوك، انستغرام، تويتر)
- إضافة `areaServed` (القاهرة الجديدة، مدينتي، الرحاب)
- إضافة `hasMap` رابط Google Maps

### 2.2 — إضافة ShoppingCenter Schema جديد
- Schema مخصص للمول ككل يتضمن عدد المحلات، المساحة، التخصصات
- ربطه بالـ LocalBusiness الحالي

### 2.3 — تحسين Product Schema
- إضافة `brand`، `sku`، `availability`، `condition`
- إضافة `aggregateRating` عند توفر التقييمات
- إضافة `seller` (المحل المعروض فيه المنتج)

### 2.4 — إضافة WebSite Schema مع SearchAction
- Schema يدعم sitelinks search box في نتائج Google:
```json
{
  "@type": "WebSite",
  "url": "https://mallelbostan.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://mallelbostan.com/products?q={search_term}",
    "query-input": "required name=search_term"
  }
}
```

### 2.5 — إضافة BreadcrumbList لكل الصفحات الناقصة
- التأكد من أن كل صفحة فرعية تمرر `breadcrumbs` لـ SEOHead
- صفحات ناقصة حالياً: InteractiveMap، SpinWin، DailyDeals، Countdown، DowntownBranch، NewCairoBranch، JoinMarketplace، Careers

---

## المرحلة 3: تحسين المحتوى لكل صفحة

### 3.1 — Meta descriptions محسّنة بالكلمات المفتاحية المصرية
كل صفحة تحتاج وصف يستهدف عبارات البحث الفعلية في مصر:

| الصفحة | الكلمات المستهدفة |
|--------|-------------------|
| الرئيسية | مول البستان، مول تكنولوجيا القاهرة الجديدة، محلات الكترونيات |
| المحلات | دليل محلات مول البستان، محلات موبايلات القاهرة الجديدة |
| المنتجات | اسعار الموبايلات، لابتوب، اكسسوارات تقنية |
| التأجير | وحدات تجارية للايجار القاهرة الجديدة، ايجار محل مول |
| الخريطة | خريطة مول البستان، دليل الطوابق |
| الافتتاح | افتتاح مول البستان 2026 |
| Spin & Win | جوائز مول البستان، عروض الافتتاح |

### 3.2 — إضافة Keywords Meta لكل صفحة
- مصفوفة كلمات مفتاحية عربية وإنجليزية مخصصة لكل صفحة
- إضافة prop `keywords` جديد لـ SEOHead

---

## المرحلة 4: تحسينات تقنية متقدمة

### 4.1 — Dynamic Sitemap (Edge Function)
- إنشاء edge function تولّد sitemap ديناميكي من قاعدة البيانات
- تضمين كل المحلات `/stores/:slug`، المنتجات `/products/:slug`، مقالات المدونة `/blog/:slug`، وتجار وسط البلد `/downtown-directory/:slug`
- إضافة `<lastmod>` حقيقي من `updated_at` في قاعدة البيانات
- تقسيم إلى sitemap index إذا تجاوز 500 URL

### 4.2 — Canonical URL Improvements
- التأكد من أن صفحات المنتجات مع query parameters (مثل `?shop_name=kasr-zero`) تستخدم canonical بدون parameters
- معالجة الـ redirects في Kasr Zero routes

### 4.3 — Performance Meta
- إضافة `<link rel="preload">` للصور الحرجة (hero images)
- إضافة `fetchpriority="high"` للصور فوق الطي

### 4.4 — robots.txt تحديث
- إضافة `Disallow: /spin-win/claim` (صفحات خاصة)
- إضافة `Disallow: /kz/cart`
- إضافة `Crawl-delay: 1` للبوتات

---

## المرحلة 5: Open Graph و Social Sharing

### 5.1 — صور OG مخصصة لكل قسم
- إضافة prop لتمرير OG image مختلف لكل صفحة رئيسية
- الصفحات التجارية (محلات، منتجات، تأجير) تستخدم صور مختلفة عن الصفحات المعلوماتية
- صفحات المنتجات الفردية تستخدم صورة المنتج كـ OG image
- صفحات المحلات تستخدم logo أو cover image

### 5.2 — Twitter Card تحسينات
- إضافة `twitter:site` بحساب المول الرسمي (عند توفره)
- استخدام `summary` بدلاً من `summary_large_image` للصفحات القانونية

---

## المرحلة 6: صفحة SEO Admin Audit تحسينات

### 6.1 — تحسين لوحة تدقيق SEO الموجودة
- إضافة فحص للصفحات الناقصة breadcrumbs
- إضافة فحص لطول meta description (مثالي: 120-160 حرف)
- إضافة فحص لوجود keywords
- تنبيه على المحلات والمنتجات بدون وصف عربي

---

## الملفات المتأثرة

| الملف | نوع التغيير |
|-------|-------------|
| `src/components/SEOHead.tsx` | تحسين: keywords، og dimensions، article meta، WebSite schema |
| `index.html` | إضافة: geo meta، hreflang، notranslate |
| `src/pages/NotFound.tsx` | إعادة بناء: تعريب + SEOHead |
| `src/pages/InteractiveMap.tsx` | إضافة: breadcrumbs، keywords |
| `src/pages/SpinWin.tsx` | إضافة: breadcrumbs، keywords |
| `src/pages/DailyDeals.tsx` | إضافة: breadcrumbs، keywords |
| `src/pages/Careers.tsx` | إضافة: breadcrumbs، keywords |
| `src/pages/Countdown.tsx` | إضافة: breadcrumbs، keywords |
| `src/pages/DowntownBranch.tsx` | إضافة: breadcrumbs، keywords |
| `src/pages/NewCairoBranch.tsx` | إضافة: breadcrumbs، keywords |
| `src/pages/JoinMarketplace.tsx` | إضافة: breadcrumbs، keywords |
| `src/pages/Leasing.tsx` | تحسين: meta description، keywords |
| `src/pages/Contact.tsx` | تحسين: meta description، keywords |
| `src/pages/Index.tsx` | تحسين: WebSite schema، keywords |
| `src/pages/StoreDetail.tsx` | تحسين: Product OG image، enhanced schema |
| `src/pages/ProductDetail.tsx` | تحسين: Product OG image، enhanced schema |
| `src/pages/kz/KzHome.tsx` | إضافة: breadcrumbs، keywords |
| `public/robots.txt` | تحديث: disallow claim/cart، crawl-delay |
| `public/sitemap.xml` | تحديث مؤقت حتى يتم بناء الديناميكي |
| `supabase/functions/sitemap/index.ts` | جديد: dynamic sitemap generation |

---

## النتيجة المتوقعة
- كل صفحة عامة تحتوي على: title + description + keywords + canonical + breadcrumbs + OG + Twitter + JSON-LD مناسب
- Structured data متكامل يدعم rich results في Google (FAQ، Events، Products، Jobs، Stores)
- Sitemap ديناميكي يتحدث تلقائياً مع كل منتج أو محل جديد
- استهداف واضح للكلمات المفتاحية المصرية في مجال التكنولوجيا والإلكترونيات

