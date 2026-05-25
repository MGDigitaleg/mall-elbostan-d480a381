import { Link } from "react-router-dom";
import { useRequireContentAccess } from "@/hooks/useAuth";
import { ReportShell } from "@/components/admin/AdminReports";
import {
  Globe, Megaphone, Store, ShoppingBag, Tag, Users, Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Card = { href: string; title: string; desc: string; icon: LucideIcon; adminOnly?: boolean };

const CARDS: Card[] = [
  { href: "/admin/reports/traffic",   title: "حركة الزيارات",    desc: "مصادر التحويلات وتسلسل الزوار اليومي.", icon: Globe },
  { href: "/admin/reports/campaigns", title: "الحملات والـ UTM", desc: "أداء الحملات المُعلَّمة وحملات QR.",      icon: Megaphone },
  { href: "/admin/reports/stores",    title: "أداء المحلات",      desc: "ترتيب المحلات والمنتجات والعروض.",        icon: Store },
  { href: "/admin/reports/products",  title: "أداء المنتجات",     desc: "جودة الكتالوج والمحلات الأنشط.",          icon: ShoppingBag },
  { href: "/admin/reports/offers",    title: "أداء العروض",       desc: "العروض الحية والقريبة من الانتهاء.",      icon: Tag },
  { href: "/admin/reports/leads",     title: "العملاء المحتملون", desc: "تقسيم الرسائل حسب النوع والمصدر والمحل.", icon: Users, adminOnly: true },
  { href: "/admin/reports/spin",      title: "أدر واربح",         desc: "التسجيلات، الفائزون، ومعدلات الاستلام.",  icon: Sparkles, adminOnly: true },
];

export default function AdminReportsIndex() {
  const { loading, user, canManageContent, isAdmin } = useRequireContentAccess();
  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">جاري التحميل...</div>;
  if (!user || !canManageContent) return null;

  const visible = CARDS.filter((c) => (c.adminOnly ? isAdmin : true));

  return (
    <ReportShell
      title="مركز التقارير"
      subtitle="تقارير تفصيلية بفلاتر زمنية لكل منطقة من المنصة. ابدأ من البطاقة المناسبة."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((c) => (
          <Link
            key={c.href}
            to={c.href}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <c.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-foreground">{c.title}</div>
                <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </ReportShell>
  );
}
