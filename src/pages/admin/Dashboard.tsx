import { Link } from "react-router-dom";
import { useRequireContentAccess } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { CampaignStatusBadge } from "@/components/admin/CampaignStatusBadge";
import { Store, Building, Calendar, Gift, Tag, Briefcase, FileText, HelpCircle, Users, Settings, LogOut, FolderTree, ShoppingBag, LayoutGrid, Trophy, Award, BarChart3, Building2, Cpu, Sparkles, Ticket, ScanSearch, Globe, RefreshCw, Rocket, Phone, Bell, Database, Activity, Cloud, Shield } from "lucide-react";

type Section = {
  title: string;
  icon: typeof Store;
  path: string;
  desc: string;
  /** If true, only visible to admins. Otherwise visible to admin + editor. */
  adminOnly?: boolean;
  group: "content" | "spin" | "operations" | "seo" | "system";
};

const adminSections: Section[] = [
  // System / operations — admin only
  { group: "system", adminOnly: true, title: "جاهزية الإطلاق", icon: Rocket, path: "/admin/launch-readiness", desc: "GO/NO-GO · GSC · هاتف · sitemap · schema · noindex" },
  { group: "system", adminOnly: true, title: "حالة Lovable Cloud", icon: Cloud, path: "/admin/cloud-status", desc: "حالة المصادقة والتخزين وقاعدة البيانات وEdge Functions" },
  { group: "system", adminOnly: true, title: "النسخ الاحتياطية", icon: Database, path: "/admin/backup", desc: "تصدير بيانات الجداول بصيغة JSON أو ZIP" },
  { group: "system", adminOnly: true, title: "تشخيص Edge Functions", icon: Activity, path: "/admin/edge-logs", desc: "سجل الاستدعاءات والأخطاء وفحص صحة الدوال الخلفية" },
  { group: "system", adminOnly: true, title: "قاعدة البيانات", icon: Database, path: "/admin/database", desc: "عرض الجداول والحقول وسياسات RLS وسجل التغييرات" },
  { group: "operations", adminOnly: true, title: "العملاء المحتملون", icon: Users, path: "/admin/leads", desc: "طلبات التواصل والتأجير وانضمام التجار" },
  { group: "operations", adminOnly: true, title: "إعدادات التواصل", icon: Phone, path: "/admin/contact-settings", desc: "تحديث رقم الهاتف الرسمي في الفوتر و JSON-LD" },

  // Content — admin + editor
  { group: "content", title: "المتاجر", icon: Store, path: "/admin/stores", desc: "إدارة المتاجر والعلامات التجارية" },
  { group: "content", title: "الوحدات (التأجير)", icon: Building, path: "/admin/units", desc: "إدارة وحدات التأجير وحالاتها" },
  { group: "content", title: "فئات المنتجات", icon: LayoutGrid, path: "/admin/product-categories", desc: "إدارة فئات المنتجات والتصنيفات" },
  { group: "content", title: "المنتجات", icon: ShoppingBag, path: "/admin/products", desc: "إدارة المنتجات والماركتبليس" },
  { group: "content", title: "دليل وسط البلد", icon: Building2, path: "/admin/downtown-merchants", desc: "إدارة دليل محلات فرع وسط البلد والتوثيق" },
  { group: "content", title: "العروض", icon: Tag, path: "/admin/deals", desc: "إدارة العروض اليومية" },
  { group: "content", title: "المدونة", icon: FileText, path: "/admin/blog", desc: "إدارة المقالات والأخبار" },
  { group: "content", title: "الفعاليات", icon: Calendar, path: "/admin/events", desc: "إدارة فعاليات الافتتاح" },
  { group: "content", title: "الوظائف", icon: Briefcase, path: "/admin/jobs", desc: "إدارة الوظائف الشاغرة" },
  { group: "content", title: "الأسئلة الشائعة", icon: HelpCircle, path: "/admin/faqs", desc: "إدارة الأسئلة والأجوبة" },

  // Spin & Win — admin + editor
  { group: "spin", title: "نظام أدر واربح", icon: Sparkles, path: "/admin/spin-system", desc: "إعدادات الحملة · مخزون الجوائز · الحالة" },
  { group: "spin", title: "متاجر المسابقة", icon: Trophy, path: "/admin/competition-stores", desc: "إدارة المتاجر المشاركة في أدر واربح" },
  { group: "spin", title: "مكافآت المتاجر", icon: Award, path: "/admin/store-prizes", desc: "إدارة مكافآت كل متجر" },
  { group: "spin", title: "المكافآت القديمة", icon: Gift, path: "/admin/rewards", desc: "نظام المكافآت القديم" },
  { group: "spin", adminOnly: true, title: "أكواد الزوار", icon: Ticket, path: "/admin/visitor-tokens", desc: "إنشاء/تعطيل/تتبع أكواد التحقق" },
  { group: "spin", adminOnly: true, title: "الفائزون", icon: Users, path: "/admin/spin-winners", desc: "عرض المشاركات والتحقق من الأكواد" },
  { group: "spin", adminOnly: true, title: "تقارير المسابقة", icon: BarChart3, path: "/admin/spin-reports", desc: "إحصائيات وتحليلات أدر واربح" },

  // KZ + branding
  { group: "content", title: "منتجات Kasr Zero", icon: Cpu, path: "/admin/kz-products", desc: "إدارة منتجات ومتغيرات وصور متجر Kasr Zero" },
  { group: "content", adminOnly: true, title: "أصول المستأجرين", icon: FolderTree, path: "/admin/tenant-assets", desc: "إدارة قائمة الشعارات والمطابقة والتصدير النهائي" },
  { group: "content", adminOnly: true, title: "تدقيق اللوجوهات", icon: ScanSearch, path: "/admin/logo-audit", desc: "مراجعة حالة التحقق من شعارات المتاجر" },
  { group: "content", adminOnly: true, title: "تدقيق شعارات المحلات", icon: ScanSearch, path: "/admin/tenant-branding", desc: "مراجعة شاملة لحالة التحقق والتغطية الرسمية" },

  // SEO — admin only
  { group: "seo", adminOnly: true, title: "عروض السوشيال", icon: Bell, path: "/admin/social-offers", desc: "سجل المحلات المراقَبة · طابور المراجعة · اعتماد ونشر" },
  { group: "seo", adminOnly: true, title: "تدقيق SEO", icon: Globe, path: "/admin/seo-audit", desc: "حالة فهرسة الصفحات وتحسين محركات البحث" },
  { group: "seo", adminOnly: true, title: "فحص SEO المباشر", icon: Globe, path: "/admin/seo-verify", desc: "فحص مباشر لكل صفحة عامة: Canonical، Breadcrumbs، H1" },
  { group: "seo", adminOnly: true, title: "سجل IndexNow", icon: RefreshCw, path: "/admin/indexing-logs", desc: "سجل عمليات إرسال الصفحات لمحركات البحث" },
];

const groupLabels: Record<Section["group"], string> = {
  content: "المحتوى",
  spin: "أدر واربح",
  operations: "العمليات",
  seo: "SEO والفهرسة",
  system: "النظام والبنية التحتية",
};

const AdminDashboard = () => {
  const { loading, signOut, isAdmin, canManageContent, user } = useRequireContentAccess();

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;
  if (!user || !canManageContent) return null;

  const visible = adminSections.filter((s) => (s.adminOnly ? isAdmin : true));
  const grouped = (Object.keys(groupLabels) as Section["group"][]).map((g) => ({
    key: g,
    label: groupLabels[g],
    items: visible.filter((s) => s.group === g),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold text-gradient-blue">لوحة تحكم مول البستان</h1>
          <div className="flex items-center gap-2">
            <CampaignStatusBadge />
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-[0.72rem] font-bold text-foreground">
              <Shield className="w-3.5 h-3.5 text-primary" />
              {isAdmin ? "مسؤول" : "محرر محتوى"}
            </span>
            <Link to="/"><Button variant="ghost" size="sm"><Settings className="w-4 h-4 ml-1" /> الموقع</Button></Link>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="w-4 h-4 ml-1" /> خروج</Button>
          </div>
        </div>
      </header>
      <main className="container py-10 space-y-12">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">مرحباً بك في لوحة التحكم</h2>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "لديك صلاحيات مسؤول كاملة — يمكنك إدارة المحتوى والنظام والمستخدمين."
              : "لديك صلاحيات محرر — يمكنك إدارة المتاجر والتأجير والمدونة ومحتوى Spin & Win."}
          </p>
        </div>

        {grouped.map((group) => (
          <section key={group.key}>
            <h3 className="mb-4 text-[0.92rem] font-bold tracking-wide text-muted-foreground">
              {group.label}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.items.map((section) => (
                <Link key={section.path} to={section.path} className="card-premium p-6 hover:glow-blue transition-all group">
                  <section.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-lg text-foreground mb-1">{section.title}</h4>
                  <p className="text-sm text-muted-foreground">{section.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default AdminDashboard;
