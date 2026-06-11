import { AdminCrudPage } from "./AdminCrudPage";
export const AdminStores = () => <AdminCrudPage table="stores" title="المتاجر" nameField="name_ar" fields={[
  { key: "name_ar", label: "الاسم بالعربية" }, { key: "name_en", label: "الاسم بالإنجليزية" }, { key: "slug", label: "الرابط (slug)" },
  { key: "category", label: "الفئة" }, { key: "unit_code", label: "رمز الوحدة" },
  { key: "status", label: "الحالة (leased/available/hidden)" },
  { key: "short_description_ar", label: "وصف قصير عربي" }, { key: "long_description_ar", label: "وصف تفصيلي عربي", type: "textarea" },
  { key: "logo_url", label: "رابط الشعار" }, { key: "cover_image_url", label: "رابط صورة الغلاف" },
  { key: "phone", label: "الهاتف" }, { key: "whatsapp", label: "واتساب" }, { key: "email", label: "البريد" }, { key: "website", label: "الموقع" },
  { key: "featured", label: "مميز (true/false)" },
]} />;
export const AdminUnits = () => <AdminCrudPage table="units" title="الوحدات" nameField="unit_code" fields={[
  { key: "unit_code", label: "رمز الوحدة" }, { key: "status", label: "الحالة", type: "select", options: ["available", "leased", "reserved", "hidden"] },
  { key: "area_sqm", label: "المساحة م²", type: "number" }, { key: "activity_suggestion", label: "النشاط المقترح" },
  { key: "price_note", label: "ملاحظة السعر" }, { key: "description_ar", label: "وصف عربي" }, { key: "featured", label: "مميز (true/false)" },
]} />;
export const AdminEvents = () => <AdminCrudPage table="events" title="الفعاليات" nameField="title_ar" fields={[
  { key: "title_ar", label: "العنوان بالعربية" }, { key: "title_en", label: "العنوان بالإنجليزية" },
  { key: "description_ar", label: "الوصف", type: "textarea" }, { key: "event_date", label: "التاريخ" },
  { key: "start_time", label: "وقت البدء" }, { key: "end_time", label: "وقت الانتهاء" },
  { key: "category", label: "الفئة" }, { key: "speaker_or_guest", label: "المتحدث/الضيف" },
  { key: "image_url", label: "رابط الصورة" }, { key: "featured", label: "مميز (true/false)" },
]} />;
export const AdminRewards = () => <AdminCrudPage table="rewards" title="المكافآت" nameField="title_ar" fields={[
  { key: "title_ar", label: "العنوان بالعربية" }, { key: "reward_type", label: "النوع (discount/gift/voucher)" },
  { key: "stock", label: "المخزون", type: "number" }, { key: "probability_weight", label: "وزن الاحتمال", type: "number" },
  { key: "claim_rules_ar", label: "قواعد الاستلام", type: "textarea" }, { key: "is_active", label: "نشط (true/false)" },
]} />;
export const AdminDeals = () => <AdminCrudPage table="deals" title="العروض" nameField="title_ar" fields={[
  { key: "title_ar", label: "العنوان" }, { key: "description_ar", label: "الوصف", type: "textarea" },
  { key: "promo_code", label: "كود الخصم" }, { key: "valid_from", label: "صالح من" }, { key: "valid_to", label: "صالح حتى" },
  { key: "featured", label: "مميز (true/false)" }, { key: "is_live", label: "مباشر (true/false)" },
]} />;
export const AdminJobs = () => <AdminCrudPage table="jobs" title="الوظائف" nameField="title_ar" fields={[
  { key: "title_ar", label: "المسمى الوظيفي" }, { key: "company_or_store", label: "الشركة/المتجر" },
  { key: "description_ar", label: "الوصف", type: "textarea" }, { key: "job_type", label: "النوع" },
  { key: "status", label: "الحالة (open/closed/draft)" }, { key: "apply_email", label: "بريد التقديم" },
  { key: "application_deadline", label: "آخر موعد" },
]} />;
export const AdminBlog = () => <AdminCrudPage table="blog_posts" title="المدونة" nameField="title_ar" fields={[
  { key: "title_ar", label: "العنوان" }, { key: "slug", label: "الرابط (slug)" },
  { key: "excerpt_ar", label: "مقتطف", type: "textarea" }, { key: "content_ar", label: "المحتوى", type: "textarea" },
  { key: "cover_image_url", label: "صورة الغلاف" }, { key: "category", label: "الفئة" },
  { key: "published_at", label: "تاريخ النشر" }, { key: "featured", label: "مميز (true/false)" },
  { key: "seo_title_ar", label: "عنوان SEO" }, { key: "seo_description_ar", label: "وصف SEO" },
]} />;
export const AdminFaqs = () => <AdminCrudPage table="faqs" title="الأسئلة الشائعة" nameField="question_ar" fields={[
  { key: "question_ar", label: "السؤال بالعربية" }, { key: "answer_ar", label: "الجواب بالعربية", type: "textarea" },
  { key: "question_en", label: "السؤال بالإنجليزية" }, { key: "answer_en", label: "الجواب بالإنجليزية", type: "textarea" },
  { key: "category", label: "الفئة" }, { key: "sort_order", label: "الترتيب", type: "number" },
]} />;
export const AdminProductCategories = () => <AdminCrudPage table="product_categories" title="فئات المنتجات" nameField="name_ar" fields={[
  { key: "name_ar", label: "الاسم بالعربية" }, { key: "name_en", label: "الاسم بالإنجليزية" },
  { key: "slug", label: "الرابط (slug)" }, { key: "icon", label: "الأيقونة" },
  { key: "sort_order", label: "الترتيب", type: "number" },
]} />;
export const AdminProducts = () => <AdminCrudPage table="products" title="المنتجات" nameField="name_ar" fields={[
  { key: "name_ar", label: "الاسم بالعربية" }, { key: "name_en", label: "الاسم بالإنجليزية" },
  { key: "slug", label: "الرابط (slug)" }, { key: "brand", label: "العلامة التجارية" },
  { key: "store_id", label: "المحل المرتبط", type: "store" },
  { key: "short_description_ar", label: "وصف قصير", type: "textarea" },
  { key: "long_description_ar", label: "وصف تفصيلي", type: "textarea" },
  { key: "price", label: "السعر", type: "number" }, { key: "price_note", label: "ملاحظة السعر" },
  { key: "sku", label: "SKU" }, { key: "image_url", label: "صورة المنتج", type: "image" },
  { key: "external_buy_url", label: "رابط الشراء الخارجي" },
  { key: "status", label: "الحالة (draft/published/hidden)" },
  { key: "featured", label: "مميز (true/false)" },
]} />;
