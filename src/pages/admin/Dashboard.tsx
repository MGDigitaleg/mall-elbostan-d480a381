import { Link } from "react-router-dom";
import { useRequireAdmin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Store, Building, Calendar, Gift, Tag, Briefcase, FileText, HelpCircle, Users, Settings, LogOut, FolderTree, ShoppingBag, LayoutGrid, Trophy, Award, BarChart3, Building2, Cpu, Sparkles, Ticket } from "lucide-react";

const adminSections = [
  { title: "المتاجر", icon: Store, path: "/admin/stores", desc: "إدارة المتاجر والعلامات التجارية" },
  { title: "الوحدات", icon: Building, path: "/admin/units", desc: "إدارة الوحدات التجارية" },
  { title: "فئات المنتجات", icon: LayoutGrid, path: "/admin/product-categories", desc: "إدارة فئات المنتجات والتصنيفات" },
  { title: "المنتجات", icon: ShoppingBag, path: "/admin/products", desc: "إدارة المنتجات والماركتبليس" },
  { title: "دليل وسط البلد", icon: Building2, path: "/admin/downtown-merchants", desc: "إدارة دليل محلات فرع وسط البلد والتوثيق" },
  { title: "الفعاليات", icon: Calendar, path: "/admin/events", desc: "إدارة فعاليات الافتتاح" },
  { title: "نظام أدر واربح", icon: Sparkles, path: "/admin/spin-system", desc: "مخزون الجوائز · أكواد الزوار · الفائزون" },
  { title: "أكواد الزوار", icon: Ticket, path: "/admin/visitor-tokens", desc: "إنشاء/تعطيل/تتبع أكواد التحقق من الزوار" },
  { title: "المكافآت القديمة", icon: Gift, path: "/admin/rewards", desc: "نظام المكافآت القديم" },
  { title: "متاجر المسابقة", icon: Trophy, path: "/admin/competition-stores", desc: "إدارة المتاجر المشاركة في أدر واربح" },
  { title: "مكافآت المتاجر", icon: Award, path: "/admin/store-prizes", desc: "إدارة مكافآت كل متجر" },
  { title: "الفائزون", icon: Users, path: "/admin/spin-winners", desc: "عرض المشاركات والتحقق من الأكواد" },
  { title: "تقارير المسابقة", icon: BarChart3, path: "/admin/spin-reports", desc: "إحصائيات وتحليلات أدر واربح" },
  { title: "العروض", icon: Tag, path: "/admin/deals", desc: "إدارة العروض اليومية" },
  { title: "الوظائف", icon: Briefcase, path: "/admin/jobs", desc: "إدارة الوظائف الشاغرة" },
  { title: "المدونة", icon: FileText, path: "/admin/blog", desc: "إدارة المقالات والأخبار" },
  { title: "الأسئلة الشائعة", icon: HelpCircle, path: "/admin/faqs", desc: "إدارة الأسئلة والأجوبة" },
  { title: "العملاء المحتملون", icon: Users, path: "/admin/leads", desc: "عرض طلبات التواصل والتأجير وانضمام التجار" },
  { title: "أصول المستأجرين", icon: FolderTree, path: "/admin/tenant-assets", desc: "إدارة قائمة الشعارات والمطابقة والتصدير النهائي" },
  { title: "منتجات Kasr Zero", icon: Cpu, path: "/admin/kz-products", desc: "إدارة منتجات ومتغيرات وصور متجر Kasr Zero" },
];

const AdminDashboard = () => {
  const { loading, signOut } = useRequireAdmin();

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold text-gradient-blue">لوحة تحكم مول البستان</h1>
          <div className="flex gap-2">
            <Link to="/"><Button variant="ghost" size="sm"><Settings className="w-4 h-4 ml-1" /> الموقع</Button></Link>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="w-4 h-4 ml-1" /> خروج</Button>
          </div>
        </div>
      </header>
      <main className="container py-10">
        <h2 className="text-2xl font-bold text-foreground mb-8">مرحباً بك في لوحة التحكم</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <Link key={section.path} to={section.path} className="card-premium p-6 hover:glow-blue transition-all group">
              <section.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg text-foreground mb-1">{section.title}</h3>
              <p className="text-sm text-muted-foreground">{section.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
