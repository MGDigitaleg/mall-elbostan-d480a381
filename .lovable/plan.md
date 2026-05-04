## المشكلة الفعلية

فحصت ملفات `/public/sitemap-*.xml` ووجدت خطأ بنيوي يفسر تماماً لماذا جوجل لا يستطيع قراءة الصفحات:

### البنية الحالية (خاطئة)

```text
sitemap.xml                      ← <sitemapindex>
  └─ sitemap-stores.xml          ← <sitemapindex>  ⚠️ تشعّب غير مسموح
       └─ edge function          ← <urlset>
```

كل ملف من `sitemap-stores.xml`, `sitemap-products.xml`, `sitemap-blog.xml` … إلخ هو **`<sitemapindex>` داخل `<sitemapindex>`**. هذا مخالف لمواصفات بروتوكول Sitemaps (sitemaps.org) — جوجل يقبل sitemapindex على مستوى واحد فقط، ثم يتوقع `<urlset>` بداخله مباشرة.

النتيجة في Search Console: السايت ماب يُقرأ كصيغة صحيحة لكن **0 صفحة مكتشفة**، لأن الزحف يتوقف عند المستوى الثاني المتشعّب.

سبب ثانوي محتمل: جوجل قد يرفض `<loc>` يشير إلى دومين خارجي (`*.supabase.co`) من داخل sitemap منشور على `mallelbostan.com` (cross-domain sitemap).

## الحل

استبدال "shim files" المتشعّبة بـ **proxy حقيقي** يُرجع `<urlset>` مباشرة من نفس الدومين. خياران، أوصي بالأول:

### الخيار A — Edge proxy على Cloudflare/Lovable (الأفضل، ديناميكي)

ليس ممكناً بدون SSR، لكن البديل العملي:

### الخيار B — تحويل ملفات `/public/sitemap-*.xml` إلى نسخ ثابتة من `<urlset>` تُولَّد وقت البناء

تعديل `scripts/build-sitemap.ts` ليقوم بـ:

1. **استدعاء** edge function وقت `prebuild` لكل قسم: `GET /functions/v1/sitemap?section=<key>`
2. **حفظ** الـ XML الناتج (وهو `<urlset>` صحيح) كما هو في `public/sitemap-<key>.xml`
3. **إعادة كتابة** أي `<loc>` يشير إلى دومين supabase داخل النتيجة (لا يحدث هنا لأن edge function تُنتج روابط mallelbostan.com)
4. الإبقاء على `sitemap.xml` كـ `<sitemapindex>` يشير إلى الملفات المحلية (هذا صحيح — مستوى واحد فقط)

البنية الجديدة:

```text
sitemap.xml                      ← <sitemapindex>
  ├─ sitemap-stores.xml          ← <urlset> (27 محل)  ✅
  ├─ sitemap-products.xml        ← <urlset> (18 منتج) ✅
  ├─ sitemap-pages.xml           ← <urlset> (85 صفحة) ✅
  └─ … (باقي الأقسام)
```

## التغييرات المطلوبة

1. **`scripts/build-sitemap.ts`** — استبدال `shimFor()` بدالة `fetchSection()` تجلب XML الحقيقي من edge function وتكتبه كاملاً. fallback: لو فشل الجلب وقت البناء (مثلاً بدون إنترنت)، احتفظ بالـ shim القديم كحل بديل مع تحذير في الكونسول.
2. **سكربت تحقق جديد** يفحص أن كل `/public/sitemap-*.xml` يبدأ بـ `<urlset` وليس `<sitemapindex` (parity guard).
3. **اختبار vitest** يقرأ كل ملف محلياً ويتأكد من أنه `<urlset>` صالح يحتوي على ≥1 `<url>`.
4. لا تغيير على `robots.txt` ولا على edge function — البنية تبقى كما هي.

## ما الذي سيراه جوجل بعد النشر

- `sitemap.xml` → 9 ملفات فرعية كلها urlset صالح على نفس الدومين
- مجموع ~194 رابط قابل للزحف (مطابق لما يُرجعه `?format=summary`)
- لا cross-domain، لا تشعّب، لا redirect

بعد النشر يحتاج المستخدم **إعادة إرسال** السايت ماب من Search Console لإعادة قراءته.

## ملاحظة على المعاينة

في صفحة `/sitemap` العامة سيظل العرض كما هو — الروابط لا تتغير، فقط محتوى الملفات أصبح مباشراً بدلاً من تغليف.
