

## خطة إنشاء 1000 صفحة فئة لكوكب البستان

### الهدف
بناء شجرة محتوى مكوّنة من **1000 صفحة فئة جهاز** منظَّمة هرمياً (Pillar → Cluster → Long-tail) تدعم SEO المحلي للقاهرة الجديدة وتربط كل صفحة بمحلات/منتجات/أقسام مول البستان.

---

### 1) البنية الهرمية (Topic Cluster Model)

نعتمد 3 مستويات تحت `/devices/`:

```text
/devices/{pillar}                       ← المستوى 1 (Pillar) — 6 صفحات
/devices/{pillar}/{cluster}             ← المستوى 2 (Cluster) — ~60 صفحة
/devices/{pillar}/{cluster}/{longtail}  ← المستوى 3 (Long-tail) — ~934 صفحة
                                         الإجمالي: 1000 صفحة
```

**ملاحظة:** المستوى 1 الستة هم نفس فئات المول الرسمية في `CAT` (لا اختراع تصنيفات جديدة).

---

### 2) المستوى 1 — الـ 6 Pillars (مطابقة لـ `CAT`)

| Slug | الاسم العربي |
|---|---|
| `phones` | الهواتف والإكسسوارات |
| `computers` | الكمبيوتر والأجهزة |
| `gaming` | الألعاب والترفيه |
| `networking` | الشبكات والأنظمة الأمنية |
| `printing` | الطباعة والتصوير |
| `maintenance` | الصيانة والدعم الفني |

---

### 3) المستوى 2 — Clusters (~60 صفحة)

أمثلة موزّعة على الـ 6 pillars (10 clusters لكل pillar تقريباً). كل cluster يقابل صنف منتج رئيسي:

**phones (10):** smartphones · feature-phones · tablets · smartwatches · earbuds · headphones · phone-cases · screen-protectors · chargers · powerbanks

**computers (12):** laptops · macbook · desktops · all-in-one · monitors · keyboards · mice · ram · storage · cooling · pc-components · graphics-cards

**gaming (10):** gaming-laptops · gaming-desktops · gaming-consoles · controllers · gaming-headsets · gaming-monitors · gaming-chairs · vr-gaming · streaming-gear · arcade

**networking (8):** routers · mesh-systems · switches · access-points · nas · servers · security-cameras · intercoms

**printing (10):** inkjet-printers · laser-printers · all-in-one-printers · 3d-printers · scanners · projectors · cameras · webcams · microphones · plotters

**maintenance (10):** screen-repair · battery-replacement · data-recovery · software-installation · virus-removal · upgrades · cleaning · warranty-service · diagnostics · pickup-delivery

---

### 4) المستوى 3 — Long-tail (~934 صفحة)

كل cluster يولّد ~15 صفحة long-tail عبر **مصفوفات modifiers**:

**أنماط التوليد (templates):**

| النمط | مثال slug | مثال عنوان |
|---|---|---|
| **حسب الاستخدام** | `/devices/computers/laptops/for-students` | لابتوبات للطلاب |
| **حسب الفئة السعرية** | `/devices/computers/laptops/under-15000-egp` | لابتوبات تحت 15,000 جنيه |
| **حسب العلامة التجارية** | `/devices/phones/smartphones/iphone` | آيفون في مول البستان |
| **حسب المواصفة التقنية** | `/devices/computers/monitors/4k-144hz` | شاشات 4K بمعدل 144Hz |
| **حسب الحجم** | `/devices/computers/laptops/14-inch` | لابتوبات 14 بوصة |
| **حسب الموقع** | `/devices/phones/smartphones/new-cairo` | هواتف ذكية في القاهرة الجديدة |
| **حسب نوع المستخدم** | `/devices/gaming/gaming-laptops/for-streamers` | لابتوبات جيمنج لصُنّاع المحتوى |

**Modifiers المستخدمة (مكتبات قابلة لإعادة الاستخدام):**
- **Brands:** Apple, Samsung, Asus, Dell, HP, Lenovo, MSI, Acer, Xiaomi, Huawei, Oppo, Realme, LG, Sony, Microsoft, Razer, Logitech, JBL, Anker, Canon, Epson, Brother (22 علامة)
- **Use cases:** للطلاب · للأعمال · للجيمنج · للتصميم · للسفر · للمنزل · للشركات · للمونتاج · للبرمجة · للهندسة (10)
- **Price tiers:** اقتصادي (تحت 10,000) · متوسط (10–25,000) · بريميوم (25–60,000) · فاخر (فوق 60,000) (4)
- **Specs:** أحجام شاشات · سعات تخزين · معالجات · معدلات تحديث (متغيرة حسب cluster)

---

### 5) خريطة توزيع الـ 1000 صفحة

| المستوى | عدد الصفحات | نمط الـ slug |
|---|---|---|
| Pillars | 6 | `/devices/{pillar}` |
| Clusters | 60 | `/devices/{pillar}/{cluster}` |
| Long-tail (use-case) | 200 | `/devices/.../for-{usecase}` |
| Long-tail (price) | 180 | `/devices/.../under-{price}-egp` |
| Long-tail (brand) | 350 | `/devices/.../{brand}` |
| Long-tail (spec) | 150 | `/devices/.../{spec}` |
| Long-tail (geo) | 54 | `/devices/.../new-cairo` و `/downtown` |
| **الإجمالي** | **1000** | — |

---

### 6) بنية كل صفحة (Page Template موحَّد)

كل صفحة من الـ 1000 تحتوي:
1. **SEOHead** كامل (title فريد، description فريد، keywords، canonical، breadcrumbs JSON-LD، ItemList schema).
2. **Breadcrumb مرئي**: الرئيسية ← {pillar} ← {cluster} ← {long-tail}.
3. **H1 فريد** + فقرة مقدمة 120–180 كلمة (Fusha).
4. **شريط محلات المول** المرتبطة بالفئة (filter من `stores.category`).
5. **شبكة منتجات** (filter من `products` عبر `productKeywords`) — حد أدنى 6، أقصى 24.
6. **قسم "أسئلة شائعة"** (3–5 FAQ) مع FAQ schema.
7. **بطاقات "صفحات ذات صلة"** (6 long-tail siblings + parent cluster).
8. **CTA ثابت**: زيارة المحل في المول + اتصال موحَّد.

---

### 7) آلية التوليد (Tech Approach)

- **مصدر بيانات واحد**: `src/lib/deviceTaxonomy.ts` (جديد) يحوي:
  - `pillars[]` — 6 entries
  - `clusters[]` — ~60 entries (مع `pillarSlug` parent)
  - `longTailGenerators[]` — دوال تولّد long-tail entries بالدمج بين clusters و modifiers
- **route ديناميكي واحد**: `/devices/:pillar/:cluster?/:longtail?` في `src/App.tsx` يعرض component موحَّد `<DevicePage />`.
- **lookup function**: `resolveDevicePath(params)` يرجع `DeviceEntry` من الـ taxonomy، مع fallback إلى 404.
- **Sitemap توليدي**: يتم إنشاء `public/sitemap-devices.xml` تلقائياً من الـ taxonomy عند الـ build (script في `scripts/`).
- **لا تكرار محتوى**: كل long-tail يحصل على intro/FAQ من template مع `{cluster.label}` و `{modifier.label}` و `{mall.tag}` لإنتاج محتوى فريد قابل للفهرسة.

---

### 8) الملفات المطلوب إنشاؤها/تعديلها

| النوع | الملف | الغرض |
|---|---|---|
| ✨ جديد | `src/lib/deviceTaxonomy.ts` | المصدر الموحَّد للـ 1000 entry |
| ✨ جديد | `src/lib/deviceTaxonomyGenerators.ts` | دوال توليد long-tail + templates |
| ✨ جديد | `src/pages/DevicePage.tsx` | Component موحَّد للمستويات الثلاثة |
| ✨ جديد | `src/components/devices/DeviceBreadcrumb.tsx` | breadcrumb موحَّد |
| ✨ جديد | `src/components/devices/DeviceRelatedGrid.tsx` | شبكة الصفحات الشقيقة |
| ✨ جديد | `scripts/generate-device-sitemap.ts` | توليد sitemap الـ 1000 صفحة |
| ✏️ تعديل | `src/App.tsx` | إضافة route `/devices/:pillar/:cluster?/:longtail?` |
| ✏️ تعديل | `src/pages/DeviceCategory.tsx` | redirect إلى البنية الجديدة |
| ✏️ تعديل | `src/components/home/TechPlanetSection.tsx` | تحديث slugs المدارات للبنية الجديدة |
| ✏️ تعديل | `public/sitemap.xml` | يستورد `sitemap-devices.xml` |
| ✏️ تعديل | `supabase/functions/sitemap/index.ts` | يبني الـ XML من الـ taxonomy |

---

### 9) المنهجية ضد محتوى المنخفض الجودة (Thin Content Guard)

- كل صفحة long-tail **يجب** أن تحتوي على واحد على الأقل من:
  - محل واحد فعلي مرتبط، أو
  - منتج واحد فعلي مطابق للـ keywords، أو
  - 3 صفحات شقيقة قابلة للربط.
- الصفحات بدون أي ربط = **noindex** تلقائياً (يتم حسابها وقت التوليد).
- هذا يحافظ على معيار "لا صفحات فارغة تبدو منتهية" من قواعد المشروع.

---

### 10) خطة التنفيذ على دفعات

| الدفعة | المحتوى | عدد الصفحات |
|---|---|---|
| **Phase 1** | Pillars + Clusters + DevicePage + routing | 66 |
| **Phase 2** | Long-tail: brands (350) | 416 |
| **Phase 3** | Long-tail: use-cases + price + specs (530) | 946 |
| **Phase 4** | Geo long-tail + sitemap + QA | 1000 |

التنفيذ يبدأ بـ Phase 1 فور الموافقة، والباقي على دفعات منفصلة لضمان جودة كل دفعة قبل الانتقال للتالية.

---

### النتيجة
- **1000 صفحة فهرسة** ضمن بنية هرمية نظيفة وSEO قوي.
- **محتوى فريد** لكل صفحة عبر templates + بيانات مول حقيقية (محلات/منتجات).
- **كود واحد** يخدم الجميع — لا 1000 ملف، فقط taxonomy + page component واحد.
- **حماية ضد thin content** عبر noindex تلقائي للصفحات الفارغة.

