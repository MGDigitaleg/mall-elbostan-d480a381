// Centralized lifecycle status taxonomy for stores (Phase 2 Batch B).
// Keep in sync with the validate_store_lifecycle_status trigger.

export type Lifecycle =
  | "draft" | "pending" | "opening_soon" | "active" | "inactive" | "archived";

export const LIFECYCLE_VALUES: Lifecycle[] = [
  "draft", "pending", "opening_soon", "active", "inactive", "archived",
];

export const LIFECYCLE_META: Record<Lifecycle, { label: string; tone: "neutral"|"success"|"warning"|"info"|"danger"; hint?: string }> = {
  draft:         { label: "مسودة",         tone: "neutral", hint: "غير منشور — للعمل الداخلي فقط." },
  pending:       { label: "بانتظار المراجعة", tone: "warning", hint: "جاهز للمراجعة قبل التفعيل." },
  opening_soon:  { label: "يُفتتح قريباً",   tone: "info",    hint: "يظهر للزوار كقادم ضمن العروض الافتتاحية." },
  active:        { label: "نشِط",            tone: "success", hint: "ظاهر للزوار وتعمل كل الواجهات." },
  inactive:      { label: "موقوف مؤقتاً",    tone: "neutral", hint: "غير ظاهر للزوار — يمكن تفعيله لاحقاً." },
  archived:      { label: "مؤرشف",           tone: "danger",  hint: "خارج الخدمة — لا يظهر ولا يُعدّل عادةً." },
};

export const PUBLIC_VISIBLE_LIFECYCLES: Lifecycle[] = ["active", "opening_soon"];

export function isLifecycle(v: any): v is Lifecycle {
  return LIFECYCLE_VALUES.includes(v);
}
