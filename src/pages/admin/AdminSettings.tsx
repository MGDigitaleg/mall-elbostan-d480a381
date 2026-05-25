import { Link } from "react-router-dom";
import { useRequireAdmin } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { Users, Phone, Rocket, Database, Cloud, Activity, Bell, Globe, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Card = { title: string; description: string; to: string; icon: LucideIcon };

const cards: Card[] = [
  { title: "مستخدمو الأدمن", description: "إدارة الأعضاء والصلاحيات.", to: "/admin/users", icon: Users },
  { title: "الأدوار والصلاحيات", description: "مصفوفة الوصول لكل قسم.", to: "/admin/roles", icon: ShieldCheck },
  { title: "إعدادات التواصل", description: "الهاتف، واتساب، البريد.", to: "/admin/contact-settings", icon: Phone },
  { title: "إعدادات أدر واربح", description: "الحملة والجوائز والمتاجر.", to: "/admin/spin-system", icon: ShieldCheck },
  { title: "مراقبة عروض السوشيال", description: "المراجعة والكلمات المفتاحية.", to: "/admin/social-offers", icon: Bell },
  { title: "تدقيق SEO", description: "حالة الصفحات والربط.", to: "/admin/seo-audit", icon: Globe },
  { title: "جاهزية الإطلاق", description: "قائمة التحقق قبل الإطلاق.", to: "/admin/launch-readiness", icon: Rocket },
  { title: "حالة Lovable Cloud", description: "صحة الخدمة.", to: "/admin/cloud-status", icon: Cloud },
  { title: "تشخيص Edge Functions", description: "أخطاء وأداء الدوال.", to: "/admin/edge-logs", icon: Activity },
  { title: "النسخ الاحتياطية", description: "تصدير البيانات.", to: "/admin/backup", icon: Database },
];

export default function AdminSettings() {
  const auth = useRequireAdmin();
  if (!auth.isAdmin) return null;

  return (
    <AdminShell>
      <div className="p-4 md:p-6 space-y-5">
        <AdminPageHeader title="الإعدادات والعمليات" subtitle="مركز التحكم الإداري لمول البستان." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group rounded-lg border border-border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-primary/10 grid place-items-center shrink-0">
                  <c.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-foreground group-hover:text-primary">{c.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.description}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
