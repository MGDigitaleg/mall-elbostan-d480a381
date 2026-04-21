

# خطة: تحديث اللوجوهات المتبقية وترتيب كسر زيرو أولاً

## 1. جعل كسر زيرو أول محل في "أبرز المحلات"

**الملف:** `src/components/home/FeaturedStores.tsx`

- بعد جلب البيانات من Supabase، نعيد ترتيب المصفوفة بحيث يظهر كسر زيرو (slug: `kasr-zero`) دائماً في المركز الأول
- نفس المنطق يُطبق على `MerchantLogoWall.tsx` لضمان ظهوره أولاً في حائط اللوجوهات أيضاً

**الملف:** `src/components/home/MerchantLogoWall.tsx`
- نفس إعادة الترتيب لوضع كسر زيرو في الصدارة

## 2. محاولة جلب اللوجوهات الحقيقية للمحلات المتبقية

سنستخدم browser tools لزيارة صفحات البحث والسوشيال ميديا لاستخراج اللوجوهات الحقيقية للمحلات التالية:

| المحل | طريقة البحث |
|---|---|
| Infinity | infinitystoregypt.com / Facebook |
| Info Max | infomaxstore.com / Facebook |
| Go Plus | Facebook / Google Images |
| HK | Facebook / Google Images |
| WiFi | Facebook / Google Images |
| Kareem Store | Facebook / Google Images |
| Spark | Facebook / Google Images |
| Express Home | Facebook / Google Images |
| Time Tech | Facebook / Google Images |
| Mix & Apex | Facebook / Google Images |
| Al Hoda | Facebook / Google Images |
| Al Sahaba | Facebook / Google Images |
| Red Line | Facebook / Google Images |
| Print Show | Facebook / Google Images |
| XPRS | Facebook / Google Images |
| i7 | Facebook / Google Images |
| Quick Fix | Facebook / Google Images |
| Egypt Laptop | Facebook / Google Images |
| Prime Technology | Facebook / Google Images |

**المعالجة:**
- تحميل اللوجو الحقيقي من المصدر مباشرة (لا إنشاء بالذكاء الاصطناعي)
- تحويل إلى WebP بخلفية شفافة وأبعاد 200x200px
- حفظ بنفس أسماء الملفات في `public/logos/tenants/`
- المحلات التي لا يُعثر لها على لوجو حقيقي تبقى كما هي

## التفاصيل التقنية

- **ملفات الكود المعدلة:** `FeaturedStores.tsx` و `MerchantLogoWall.tsx` (إضافة sort logic لكسر زيرو)
- **ملفات الصور:** `public/logos/tenants/*.webp` (استبدال بالحقيقي فقط)
- **لا تعديل في قاعدة البيانات**

