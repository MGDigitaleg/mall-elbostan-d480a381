import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, Store, Building, ShoppingBag, Tag, LayoutGrid, FileText,
  Calendar, Briefcase, HelpCircle, Building2, Cpu, Sparkles, Trophy, Award,
  Gift, Ticket, Users, BarChart3, Bell, Globe, RefreshCw, Rocket, Cloud,
  Database, Activity, Phone, ScanSearch, FolderTree, Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Item = { title: string; url: string; icon: LucideIcon; adminOnly?: boolean };
type Group = { label: string; items: Item[] };

const groups: Group[] = [
  {
    label: "نظرة عامة",
    items: [{ title: "لوحة التحكم", url: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "المحلات والتأجير",
    items: [
      { title: "المحلات", url: "/admin/stores", icon: Store },
      { title: "الوحدات", url: "/admin/units", icon: Building },
      { title: "دليل وسط البلد", url: "/admin/downtown-merchants", icon: Building2 },
      { title: "أصول المستأجرين", url: "/admin/tenant-assets", icon: FolderTree, adminOnly: true },
      { title: "تدقيق شعارات المحلات", url: "/admin/tenant-branding", icon: ScanSearch, adminOnly: true },
      { title: "تدقيق اللوجوهات", url: "/admin/logo-audit", icon: ScanSearch, adminOnly: true },
    ],
  },
  {
    label: "المنتجات والعروض",
    items: [
      { title: "فئات المنتجات", url: "/admin/product-categories", icon: LayoutGrid },
      { title: "المنتجات", url: "/admin/products", icon: ShoppingBag },
      { title: "مسار العروض", url: "/admin/offers", icon: Tag },
      { title: "العروض (الكلاسيكي)", url: "/admin/deals", icon: Tag, adminOnly: true },
      { title: "عروض السوشيال", url: "/admin/social-offers", icon: Bell, adminOnly: true },
      { title: "منتجات Kasr Zero", url: "/admin/kz-products", icon: Cpu },
    ],
  },
  {
    label: "المحتوى",
    items: [
      { title: "المدونة", url: "/admin/blog", icon: FileText },
      { title: "الفعاليات", url: "/admin/events", icon: Calendar },
      { title: "الوظائف", url: "/admin/jobs", icon: Briefcase },
      { title: "الأسئلة الشائعة", url: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    label: "أدر واربح",
    items: [
      { title: "نظام الحملة", url: "/admin/spin-system", icon: Sparkles },
      { title: "متاجر المسابقة", url: "/admin/competition-stores", icon: Trophy },
      { title: "مكافآت المتاجر", url: "/admin/store-prizes", icon: Award },
      { title: "المكافآت القديمة", url: "/admin/rewards", icon: Gift },
      { title: "أكواد الزوار", url: "/admin/visitor-tokens", icon: Ticket, adminOnly: true },
      { title: "الفائزون", url: "/admin/spin-winners", icon: Users, adminOnly: true },
      { title: "تقارير المسابقة", url: "/admin/spin-reports", icon: BarChart3, adminOnly: true },
    ],
  },
  {
    label: "SEO والفهرسة",
    items: [
      { title: "تدقيق SEO", url: "/admin/seo-audit", icon: Globe, adminOnly: true },
      { title: "فحص SEO المباشر", url: "/admin/seo-verify", icon: Globe, adminOnly: true },
      { title: "سجل IndexNow", url: "/admin/indexing-logs", icon: RefreshCw, adminOnly: true },
    ],
  },
  {
    label: "العمليات",
    items: [
      { title: "العملاء المحتملون", url: "/admin/leads", icon: Users, adminOnly: true },
      { title: "إعدادات التواصل", url: "/admin/contact-settings", icon: Phone, adminOnly: true },
    ],
  },
  {
    label: "النظام",
    items: [
      { title: "الإعدادات", url: "/admin/settings", icon: Settings, adminOnly: true },
      { title: "مستخدمو الأدمن", url: "/admin/users", icon: Users, adminOnly: true },
      { title: "جاهزية الإطلاق", url: "/admin/launch-readiness", icon: Rocket, adminOnly: true },
      { title: "حالة Lovable Cloud", url: "/admin/cloud-status", icon: Cloud, adminOnly: true },
      { title: "النسخ الاحتياطية", url: "/admin/backup", icon: Database, adminOnly: true },
      { title: "تشخيص Edge Functions", url: "/admin/edge-logs", icon: Activity, adminOnly: true },
      { title: "قاعدة البيانات", url: "/admin/database", icon: Database, adminOnly: true },
    ],
  },
];

export function AdminSidebar({ isAdmin }: { isAdmin: boolean }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/15 grid place-items-center">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-sidebar-foreground">مول البستان</div>
              <div className="text-[10px] text-muted-foreground">لوحة التحكم</div>
            </div>
          </div>
        ) : (
          <Settings className="w-5 h-5 text-primary mx-auto" />
        )}
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => {
          const items = group.items.filter((i) => (i.adminOnly ? isAdmin : true));
          if (!items.length) return null;
          return (
            <SidebarGroup key={group.label}>
              {!collapsed && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const active = item.url === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.url || pathname.startsWith(item.url + "/");
                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                          <NavLink to={item.url} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            {!collapsed && <span className="text-[0.82rem]">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
