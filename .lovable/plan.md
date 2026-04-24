

## خطة: صفحات هبوط مخصصة لكل رمز في "كوكب التقنية" + توسيع عدد الرموز

سأحوّل كل رمز جهاز (Laptop, Smartphone, …) من مجرد رابط فلتر `/stores?category=…` إلى **صفحة هبوط مستقلة** غنية بالمحتوى ومحسّنة جداً للـ SEO، مع ربط المحلات والمنتجات والمحتوى التعريفي بكل صفحة، وزيادة عدد الرموز في الكوكب.

### 1) المسار والبنية

- مسار جديد موحّد: `/devices/:slug` (مثال: `/devices/laptops`, `/devices/smartphones`, `/devices/gaming-consoles` …).
- صفحة واحدة ديناميكية `src/pages/DeviceCategory.tsx` تقرأ `slug` وتعرض المحتوى المناسب من سجل مركزي.
- سجل مركزي جديد `src/lib/deviceCatalog.ts` يحتوي على كل الرموز:  
  `slug, labelAr, labelEn, Icon, parentCategory (من CAT الحالية), seo {title, description, keywords}, intro (فقرة Fusha), faq[], relatedSlugs[], orbit ('inner'|'middle'|'outer')`.
- Route تُضاف في `src/App.tsx`: `<Route path="/devices/:slug" element={<DeviceCategory />} />`.

### 2) محتوى صفحة الجهاز (الترتيب)

```text
Hero: أيقونة + H1 (مثال: "لابتوبات في مول البستان")
       جملة وصفية قصيرة بالفصحى + Breadcrumbs (الرئيسية ▸ الأجهزة ▸ لابتوبات)
─────────────────────────────────────────────────
بلوك "نبذة" (200–280 كلمة Fusha) — قيمة المول لهذه الفئة
─────────────────────────────────────────────────
"المحلات المتخصصة" — شبكة محلات من جدول stores حيث category = parentCategory
                     باستخدام TenantLogo + رابط /stores/:slug
─────────────────────────────────────────────────
"منتجات مختارة" — من جدول products (status=published, image_url ليس null)
                  مفلترة بـ category_id الموافق (أو نص في name_ar/brand)
─────────────────────────────────────────────────
"على الخريطة التفاعلية" — زر CTA إلى /map?category=<parentCategory>
─────────────────────────────────────────────────
"فئات قريبة" — روابط داخلية لـ relatedSlugs (لتقوية الـ internal linking)
─────────────────────────────────────────────────
"عن مول البستان" — فقرة موجزة + رابط /about و /new-cairo-branch
─────────────────────────────────────────────────
FAQ (3–5 أسئلة لكل جهاز) — مع JSON-LD FAQPage
```

### 3) تحسين SEO (قوي ومُتعمَّد)

- `SEOHead` لكل صفحة: عنوان فريد + وصف فريد + `canonical` لـ `https://www.mallelbostan.com/devices/<slug>` + `keywords` عربية/إنجليزية.
- **Structured data** عبر `<script type="application/ld+json">`:
  - `BreadcrumbList`
  - `CollectionPage` + `about: Product/Category`
  - `ItemList` للمنتجات المختارة
  - `FAQPage` لأسئلة الصفحة
  - `LocalBusiness` (مرجع لمول البستان)
- H1 واحد فقط، H2 لكل قسم، alt نصي عربي للصور، روابط داخلية لمحلات/منتجات/خريطة.
- إضافة كل المسارات الجديدة إلى `public/sitemap.xml` و edge function `supabase/functions/sitemap/index.ts`.
- لا تقييم وهمي ولا حقول schema كاذبة.

### 4) توسيع رموز كوكب التقنية

أضيف رموز جديدة (Lucide) لزيادة الكثافة البصرية وتغطية فئات أوسع:

- جديد للداخلي/الأوسط/الخارجي:  
  `Tv` (تلفزيونات), `Projector` (بروجكتر), `Server` (سيرفرات), `Disc` (تخزين خارجي), `Joystick` (أذرع تحكم), `Mic` (ميكروفونات), `BatteryCharging` (UPS/طاقة), `ScanLine` (سكانر), `MonitorSmartphone` (أكسسوارات), `HardDriveDownload` (NAS), `Radio` (أنتركم), `Lightbulb` (إضاءة ذكية), `ShieldCheck` (كاميرات مراقبة), `CircuitBoard` (مكونات), `Fan` (تبريد), `PlugZap` (محولات).

النتيجة: ~16 رمز إضافي → الإجمالي يقفز من 20 إلى **~36 رمزاً**، موزعة:
- Inner orbit: 8 (بدلاً من 6)
- Middle orbit: 10 (بدلاً من 6)
- Outer orbit: 12 (بدلاً من 8)
- Mobile curated: 10 (بدلاً من 8)

كل رمز يُربط بصفحته الجديدة `/devices/:slug` بدلاً من `/stores?category=…`.

### 5) الملفات المتأثرة

| الملف | التغيير |
|---|---|
| `src/lib/deviceCatalog.ts` | جديد — السجل المركزي لكل الأجهزة + SEO + FAQ |
| `src/pages/DeviceCategory.tsx` | جديد — صفحة الهبوط الديناميكية |
| `src/components/home/TechPlanetSection.tsx` | تحديث القوائم + روابط `to={/devices/${slug}}` + رموز إضافية |
| `src/App.tsx` | إضافة Route `/devices/:slug` |
| `public/sitemap.xml` + `supabase/functions/sitemap/index.ts` | إضافة كل المسارات الجديدة |
| `mem://features/store-categories` (تحديث) | توثيق نظام صفحات الأجهزة الجديدة |

### 6) ملاحظات تقنية

- البيانات تُجلب من `stores` و `products` عبر `supabase` client مباشرة داخل الصفحة باستخدام `useQuery`.
- ربط المنتجات بكل جهاز: مرحلة أولى عبر مطابقة نصية على `name_ar/brand` بكلمات مفتاحية محددة في `deviceCatalog`، ولاحقاً يمكن الانتقال إلى ربط رسمي عبر `category_id` في جدول `product_categories`.
- يُحترم prefer-reduced-motion والثيم الداكن المعتمد للسكشن.
- لا يتم تغيير منطق الـ intensity/menu الحالي.

