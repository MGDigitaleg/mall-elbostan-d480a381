

## استبدال زر "الرجوع لأعلى" المكرر في /products بمكوّن BackToTop المشترك

تنظيف بسيط لإزالة التكرار: مكوّن `BackToTop` المشترك موجود بالفعل في `src/components/BackToTop.tsx` ويُستخدم في الصفحة الرئيسية و `/stores`. سنستبدل الكود المضمَّن داخل `src/pages/Products.tsx` بنفس المكوّن.

---

### التغييرات

**ملف واحد فقط: `src/pages/Products.tsx`**

1. **إضافة import**:
   ```tsx
   import { BackToTop } from "@/components/BackToTop";
   ```

2. **حذف منطق الـ scroll listener المخصص للزر**:
   - حذف `const [showBackToTop, setShowBackToTop] = useState(false);`
   - حذف الـ `useEffect` المسؤول عن مراقبة `window.scrollY > 600` لإظهار/إخفاء الزر.
   - (ملاحظة: نحتفظ بأي `useEffect` آخر متعلق باستعادة موضع التمرير من `sessionStorage` — لن يتأثر).

3. **حذف JSX الخاص بالزر المضمَّن**: إزالة الـ `<button>` الفلوتنج مع كل أنماطه (`fixed bottom-6 left-6 ...` + الأيقونة `ArrowUp` + الـ inline styles).

4. **إضافة المكوّن المشترك** قبل إغلاق `</MainLayout>`:
   ```tsx
   <BackToTop />
   ```

5. **تنظيف imports غير المستخدمة**: إزالة `ArrowUp` من استيراد `lucide-react` إذا لم يعد مستخدماً في الملف.

---

### الفائدة

- إزالة ~25 سطر مكرر من `Products.tsx`.
- مصدر واحد للحقيقة لسلوك زر "الرجوع لأعلى" (نفس threshold، نفس positioning مع mobile bottom nav offset، نفس styling).
- أي تحسينات مستقبلية على المكوّن تنعكس تلقائياً على كل الصفحات.

---

### النتيجة المتوقعة
سلوك الزر على `/products` يبقى مطابقاً تماماً للحالي (ظهور بعد 600px، انتقال سلس للأعلى، عدم تعارض مع bottom nav على الموبايل) — لكن من خلال مكوّن مشترك واحد.

