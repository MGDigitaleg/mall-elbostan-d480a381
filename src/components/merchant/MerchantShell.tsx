import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Store, Package, Tag, MessageSquare, Plug, Image as ImageIcon,
  User, LogOut, ExternalLink, ChevronsUpDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMerchant } from "@/hooks/useMerchant";
import { TenantLogo } from "@/components/TenantLogo";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const NAV = [
  { to: "/merchant", label: "نظرة عامة", icon: LayoutDashboard, end: true },
  { to: "/merchant/store", label: "متجري", icon: Store },
  { to: "/merchant/products", label: "منتجاتي", icon: Package },
  { to: "/merchant/offers", label: "عروضي", icon: Tag },
  { to: "/merchant/leads", label: "الاستفسارات", icon: MessageSquare },
  { to: "/merchant/external", label: "المتجر الخارجي", icon: Plug },
  { to: "/merchant/media", label: "الوسائط والملفات", icon: ImageIcon },
  { to: "/merchant/account", label: "إعدادات الحساب", icon: User },
];

function MerchantSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarContent>
        <div className="px-3 py-4 border-b border-border">
          {!collapsed ? (
            <div>
              <div className="text-[0.7rem] font-bold text-muted-foreground">بوابة التاجر</div>
              <div className="text-sm font-bold text-foreground mt-0.5">مول البستان</div>
            </div>
          ) : (
            <Store className="w-5 h-5 text-primary mx-auto" />
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink to={item.to} end={item.end} className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        {!collapsed && <span>{item.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function StoreSwitcher() {
  const { stores, activeStore, setActiveStoreId } = useMerchant();
  if (stores.length === 0) return null;
  if (stores.length === 1 && activeStore) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1">
        <TenantLogo
          src={activeStore.logo_url}
          alt={activeStore.name_ar}
          fallbackName={activeStore.name_ar}
          size="xs"
        />
        <span className="text-xs font-bold text-foreground truncate max-w-[160px]">
          {activeStore.name_ar}
        </span>
      </div>
    );
  }
  return (
    <Select value={activeStore?.id} onValueChange={setActiveStoreId}>
      <SelectTrigger className="h-8 w-[200px] text-xs">
        <SelectValue placeholder="اختر متجراً" />
      </SelectTrigger>
      <SelectContent>
        {stores.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.name_ar}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function MerchantShell({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background" dir="rtl">
        <MerchantSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 h-14 flex items-center gap-2 border-b border-border bg-background/85 backdrop-blur px-3">
            <SidebarTrigger />
            <div className="flex-1" />
            <StoreSwitcher />
            <Link to="/" target="_blank">
              <Button variant="ghost" size="sm" className="gap-1">
                <ExternalLink className="w-4 h-4" /> الموقع
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-1">
              <LogOut className="w-4 h-4" /> خروج
            </Button>
          </header>
          <main className="flex-1 min-w-0 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
