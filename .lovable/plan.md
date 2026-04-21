

# خطة تحميل اللوجوهات الحقيقية من المواقع الرسمية

## ملخص
استبدال اللوجوهات المُنشأة بالذكاء الاصطناعي بالشعارات الحقيقية المحملة مباشرة من المواقع الرسمية للمحلات وصفحاتهم على السوشيال ميديا.

## المصادر المحددة للوجوهات

### المحلات التي لها مواقع رسمية (سيتم تحميل اللوجو مباشرة)

| المحل | مصدر اللوجو | الرابط |
|---|---|---|
| **2B** | موقع رسمي - هيدر | `2b.com.eg` |
| **Sharaf DG** | موقع رسمي - SVG | `sharafdg.com` |
| **Compu Marts** | Shopify store - هيدر | `compumarts.com` |
| **Games 2 Egypt** | موقع رسمي - هيدر | `games2egypt.com/Images/Regions/1/1` |
| **El Badr** | متجر OpenCart - هيدر | `elbadrgroupeg.store` |
| **Digital Plus** | موقع رسمي - هيدر | `dpsy.com` |
| **Kasr Zero** | موقع رسمي | `kasrzero.net` |

### المحلات بدون موقع رسمي (بحث في فيسبوك وجوجل)

| المحل | طريقة البحث |
|---|---|
| Static, Infinity, Info Max, Prime Technology | بحث عبر Google Images + Facebook |
| Go Plus, HK, WiFi, Kareem Store, Spark | بحث عبر Facebook pages |
| Express Home, Time Tech, Mix & Apex | بحث عبر Facebook pages |
| Al Hoda, Al Sahaba, Red Line, Print Show, XPRS | بحث عبر Facebook + Google Maps |
| i7, Quick Fix, Egypt Laptop | بحث عبر Facebook + Google Maps |

## خطوات التنفيذ

### 1. تحميل اللوجوهات من المواقع الرسمية
- زيارة كل موقع عبر أدوات المتصفح (browser tools)
- التقاط screenshot لكل موقع لتحديد اللوجو
- تحميل ملف اللوجو الأصلي (PNG/SVG/WebP) من المصدر مباشرة
- المحلات المستهدفة: 2B, Sharaf DG, Compu Marts, Games2Egypt, El Badr, Digital Plus, Kasr Zero

### 2. البحث عن لوجوهات المحلات بدون موقع
- البحث في Google Images عن كل محل + "logo"
- البحث في صفحات Facebook عن profile picture
- البحث في Google Maps listings
- تحميل أفضل نسخة متاحة

### 3. معالجة الصور
- تحويل كل لوجو إلى WebP بجودة عالية
- توحيد الأبعاد (مربع ~200x200px مع padding)
- ضمان خلفية شفافة
- حفظ بنفس أسماء الملفات الحالية في `public/logos/tenants/`

### 4. المحلات التي لا يوجد لها لوجو متاح
- الاحتفاظ باللوجو الحالي مؤقتا
- توثيق قائمة المحلات التي تحتاج لوجو رسمي من المالك

## التفاصيل التقنية
- **الملفات**: `public/logos/tenants/*.webp` فقط
- **الأدوات**: browser tools لزيارة المواقع + curl لتحميل الصور + ImageMagick/Python للتحويل
- **لا تعديل في الكود**: نفس المسارات والأسماء

