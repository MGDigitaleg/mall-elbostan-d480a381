# خطة المراجعة قبل النشر — مول البستان

## 1) إيقاف مسابقة "أدر واربح" حالياً

**الإجراء على قاعدة البيانات (migration):**
- تحديث `campaign_settings` للمفتاح `spin_win`:
  - `is_active = false`
  - `paused_title_ar = "المسابقة غير مفعّلة حالياً"`
  - `paused_message_ar = "حملة \"أدر واربح\" متوقفة مؤقتاً. تابعنا لمعرفة موعد إعادة التفعيل."`

> صفحة `/spin-win` تقرأ `useCampaignStatus("spin_win")` وتعرض شاشة "متوقفة" تلقائياً عندما `is_active = false` (موجودة بالفعل في `src/pages/SpinWin.tsx`).

**إخفاء/تهدئة مداخل الدخول للمسابقة (UI):**
- `src/components/layout/Header.tsx` — إزالة زرّي "أدر واربح" (سطور ~249 و ~302) من الهيدر العلوي.
- `src/components/layout/HeaderMenuSheet.tsx` — إزالة عنصر القائمة "أدر واربح" (سطر 64) وبلوك الـCTA (سطور ~168–178).
- `src/components/home/QuickActions.tsx` — إزالة بطاقة "أدر واربح" (سطر 8).
- إبقاء الراوت `/spin-win` يعمل (يعرض رسالة الإيقاف) بدون روابط ظاهرة.

## 2) تخفيف الحديث عن الافتتاح

**القاعدة:** الإبقاء على ذكر الافتتاح في صفحة `/opening-day` فقط + إشارة خفيفة في الفوتر/FAQ. حذف الإلحاح والعدّ التنازلي والـkickers من الواجهات الرئيسية.

**التعديلات:**
- `src/components/home/HeroSlider.tsx` (سطور 44–48، 190): استبدال "الافتتاح الكبير — فرع القاهرة الجديدة" بعنوان مرتكز على الهوية ("وجهتك للتقنية في قلب القاهرة الجديدة")، حذف الـkicker "١٥ مايو ٢٠٢٦"، حذف `ctaSecondary` المؤدي لـ`/opening-day` واستبداله بـ"اكتشف المحلات" → `/stores`. حذف badge "الافتتاح" (سطر 190).
- `src/components/home/HeroSliderMobile.tsx` (سطور 42–92): نفس المعالجة لنسخة الموبايل.
- `src/components/home/FeaturedStores.tsx` (سطر 58): حذف سطر "الافتتاح الرسمي: 15 مايو 2026".
- `src/components/home/HomeContent.tsx`:
  - FAQ سطر 44: تغيير الإجابة لصيغة هادئة ("الافتتاح الرسمي مقرر في مايو 2026 — تابع صفحة يوم الافتتاح للتفاصيل.").
  - سطر 287: تغيير "أبرز الأسئلة حول الموقع والافتتاح والتأجير" → "أبرز الأسئلة حول المحلات والمول والتأجير".
- `src/components/layout/Header.tsx` (سطور 28–29): حذف "يوم الافتتاح" و "عروض الافتتاح" من قائمة الهيدر الرئيسية، وتعويضها بـ"المحلات" / "الخريطة" إن لم تكن موجودة. الإبقاء عليها داخل قائمة الـSheet المنسدلة فقط.
- `src/components/layout/Footer.tsx` (سطور 28–30، 250): الإبقاء على رابط "يوم الافتتاح" بصيغة هادئة وإزالة "عروض الافتتاح" المكررة.
- `src/components/home/SeoIntroFooter.tsx` (سطر 41): إعادة صياغة الجملة لتقلّ تكرار كلمة "افتتاح".
- `src/components/home/DealsTeaser.tsx` (سطور 55، 61، 99): استبدال "عروض الافتتاح" بـ"عروض مختارة" / "معاينات العروض".
- `src/components/home/TechPlanetSection.tsx` (سطر 52): تغيير label "يوم الافتتاح" → "فعاليات".

> صفحة `/opening-day` نفسها تبقى كاملة بدون تغيير (الجمهور المهتم سيصلها من الفوتر/الخريطة).

## 3) مراجعة SEO قبل النشر

**فحوصات أؤكد سلامتها (قراءة فقط):**
- ✅ `public/robots.txt` صحيح، يحجب `/admin` و `/spin-win/claim` و `/countdown`.
- ✅ `public/sitemap.xml` index سليم ويشير لـ`sitemap-main.xml` و `sitemap-devices.xml` + edge function `sitemap` ديناميكي.
- ✅ `SEOHead.tsx` يبني canonical آمن، JSON-LD لـ`LocalBusiness`/`WebSite`/`ShoppingCenter`/Breadcrumbs.
- ✅ `noIndex` مقيّد على صفحات الإدارة و `Countdown`/`DailyDeals`/`Blog`/`SpinClaim`/`NotFound`.
- ✅ سكربت `scripts/seo-audit.ts` + workflow `.github/workflows/seo-audit.yml` يعمل بوّابة CI.

**تشغيل تحقق نهائي بعد التعديلات:**
- تشغيل `npx tsx scripts/seo-audit.ts` للتأكد من خلوّ التعديلات من أخطاء (طول العنوان/الوصف، breadcrumbs، JSON-LD).
- تشغيل `npx tsx scripts/audit-sitemap-robots.ts` للتأكد من اتساق روابط السايت ماب وعدم وجود 404.

**نقاط بيانات ناقصة (لا أعدّلها — تحتاج قرارك لاحقاً):**
- `src/lib/contactInfo.ts` → `OFFICIAL_PHONE = ""` (الرقم الرسمي غير مضاف).
- `OFFICIAL_WHATSAPP = "201000000000"` (placeholder — يحتاج رقم واتساب فعلي قبل النشر).
- `VITE_GA_MEASUREMENT_ID` غير مؤكد ضمن متغيرات البيئة.
- لا يوجد Google Search Console verification tag في `index.html`.

> هذه ليست أعطالاً تكسر الموقع، لكن من المهم تأكيدها قبل ضغط زر "نشر" حتى تعمل الاتصالات والتحليلات بشكل سليم. سأذكرها لك في رسالة بعد التنفيذ لتزويدنا بالقيم.

## 4) مراجعة الروابط والصفحات

**سأقوم بفحص آلي بعد التعديلات:**
- مسح كل `<Link to="...">` في `src/` ومقارنته بقائمة الـRoutes في `App.tsx` لاكتشاف أي رابط مكسور.
- التأكد من أن الراوتات الـredirect لـ`/kz/*` تعمل وتوجّه لـ`/products` بشكل صحيح.
- فحص صفحة 404 و البريدكرامبس على الصفحات الرئيسية.

## 5) ملفات سيتم تعديلها

```
supabase/migrations/<timestamp>_pause_spin_campaign.sql   (جديد)
src/components/layout/Header.tsx
src/components/layout/HeaderMenuSheet.tsx
src/components/layout/Footer.tsx
src/components/home/QuickActions.tsx
src/components/home/HeroSlider.tsx
src/components/home/HeroSliderMobile.tsx
src/components/home/HomeContent.tsx
src/components/home/FeaturedStores.tsx
src/components/home/DealsTeaser.tsx
src/components/home/SeoIntroFooter.tsx
src/components/home/TechPlanetSection.tsx
```

## 6) ما لن يتغير

- صفحة `/opening-day` بكامل محتواها.
- صفحة `/spin-win` (تعرض رسالة الإيقاف تلقائياً عبر العلم في DB).
- بنية الـSEO، الـsitemap، الـrobots، الـJSON-LD.
- هوية المول البصرية، الهيرو الأساسي، الخريطة، المحلات، الفئات.
- صفحات Kasr Zero والمنتجات.

---

**هل أبدأ التنفيذ؟** عند الموافقة، سأنفّذ التعديلات + الـmigration ثم أشغّل سكربتات الـSEO وأرفع لك تقرير مختصر بالنتائج وأي رابط مكسور إن وُجد + قائمة القيم الناقصة (الهاتف/الواتساب/GA).
