import { AdminCrudPage } from "./AdminCrudPage";

export const AdminDowntownMerchants = () => (
  <AdminCrudPage
    table="downtown_merchants"
    title="محلات وسط البلد"
    nameField="name_ar"
    fields={[
      { key: "name_ar", label: "الاسم بالعربية" },
      { key: "name_en", label: "الاسم بالإنجليزية" },
      { key: "category", label: "الفئة" },
      { key: "floor", label: "الدور" },
      { key: "unit_number", label: "رقم الوحدة" },
      { key: "phone", label: "الهاتف" },
      { key: "address", label: "العنوان" },
      { key: "logo_url", label: "رابط الشعار" },
      { key: "website", label: "الموقع" },
      { key: "social_url", label: "رابط السوشيال" },
      { key: "verification_status", label: "حالة التوثيق (verified/official_source_linked/needs_review)" },
      { key: "source_url", label: "رابط المصدر" },
      { key: "source_notes", label: "ملاحظات المصدر", type: "textarea" as const },
      { key: "sort_order", label: "الترتيب", type: "number" as const },
      { key: "is_active", label: "نشط (true/false)" },
    ]}
  />
);
