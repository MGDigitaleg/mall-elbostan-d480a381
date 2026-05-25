import { Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { CampaignStatusBadge } from "@/components/admin/CampaignStatusBadge";
import { LogOut, Shield, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAdmin, signOut } = useAuth();
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background" dir="rtl">
        <AdminSidebar isAdmin={isAdmin} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 h-14 flex items-center gap-2 border-b border-border bg-background/85 backdrop-blur px-3">
            <SidebarTrigger />
            <div className="flex-1" />
            <CampaignStatusBadge />
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-[0.72rem] font-bold text-foreground">
              <Shield className="w-3.5 h-3.5 text-primary" />
              {isAdmin ? "مسؤول" : "محرر محتوى"}
            </span>
            <Link to="/" target="_blank">
              <Button variant="ghost" size="sm" className="gap-1">
                <ExternalLink className="w-4 h-4" /> الموقع
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-1">
              <LogOut className="w-4 h-4" /> خروج
            </Button>
          </header>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
