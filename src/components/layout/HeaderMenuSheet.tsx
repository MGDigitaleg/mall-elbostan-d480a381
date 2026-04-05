import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Compass, MapPin, Sparkles, Building2, ShoppingBag, Briefcase,
  FileText, Phone, Map, Tag, HelpCircle, Gamepad2, Store, Sun, Moon,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const navSections = [
  {
    title: "المول",
    items: [
      { label: "الرئيسية", path: "/", icon: Building2 },
      { label: "عن البستان", path: "/about", icon: Building2 },
      { label: "صدى السوق", path: "/market-echo", icon: Building2 },
      { label: "دليل المحلات", path: "/stores", icon: Store },
      { label: "منتجات المحلات", path: "/products", icon: ShoppingBag },
      { label: "الخريطة التفاعلية", path: "/map", icon: Map },
      { label: "العروض اليومية", path: "/daily-deals", icon: Tag },
    ],
  },
  {
    title: "الفروع",
    items: [
      { label: "فرع القاهرة الجديدة", path: "/new-cairo-branch", icon: MapPin },
      { label: "فرع وسط البلد", path: "/downtown-branch", icon: MapPin },
      { label: "دليل محلات وسط البلد", path: "/downtown-directory", icon: MapPin },
    ],
  },
  {
    title: "خدمات",
    items: [
      { label: "الوحدات المتاحة", path: "/leasing", icon: Briefcase },
      { label: "يوم الافتتاح", path: "/opening-day", icon: Sparkles },
      { label: "أدر واربح", path: "/spin-win", icon: Gamepad2 },
      { label: "انضم كتاجر", path: "/join-marketplace", icon: ShoppingBag },
      { label: "فرص العمل", path: "/careers", icon: Briefcase },
    ],
  },
  {
    title: "معلومات",
    items: [
      { label: "المدونة", path: "/blog", icon: FileText },
      { label: "الأسئلة الشائعة", path: "/faq", icon: HelpCircle },
      { label: "تواصل معنا", path: "/contact", icon: Phone },
    ],
  },
];

interface HeaderMenuSheetProps {
  isActive: (path: string) => boolean;
  trigger: JSX.Element;
}

export function HeaderMenuSheet({ isActive, trigger }: HeaderMenuSheetProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleLinkClick = () => {
    // Small delay for visual feedback before closing
    setTimeout(() => setOpen(false), 120);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-[90vw] max-w-[24rem] flex-col border-0 px-0 py-0"
        style={{ background: "hsl(var(--card))" }}
      >
        {/* Header */}
        <div
          className="shrink-0 px-6 pt-6 pb-5"
          style={{
            background: "linear-gradient(135deg, #071326 0%, #0B1B34 100%)",
          }}
        >
          <SheetHeader className="space-y-2 text-right">
            <BrandLogo align="start" imageClassName="h-auto max-w-[140px] brightness-0 invert opacity-90" />
            <SheetTitle className="text-right text-lg" style={{ color: "#F8FAFC" }}>
              القائمة
            </SheetTitle>
            <SheetDescription className="text-right text-[0.78rem] leading-7" style={{ color: "#94A3B8" }}>
              تنقل سريع بين صفحات مول البستان
            </SheetDescription>
          </SheetHeader>

          {/* Quick Actions */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link to="/map" onClick={handleLinkClick}>
              <Button
                className="h-11 w-full gap-2 rounded-xl text-[0.78rem] font-bold"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#E2E8F0",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <Compass className="h-4 w-4" />
                الخريطة
              </Button>
            </Link>
            <Link to="/spin-win" onClick={handleLinkClick}>
              <Button
                className="h-11 w-full gap-2 rounded-xl text-[0.78rem] font-bold"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 12px rgba(37,99,235,0.3)",
                }}
              >
                <Sparkles className="h-4 w-4" />
                أدر واربح
              </Button>
            </Link>
          </div>
        </div>

        {/* Current page indicator */}
        <div
          className="shrink-0 mx-5 mt-4 mb-1 flex items-center gap-2 rounded-lg px-3 py-2"
          style={{ background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.08)" }}
        >
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: "#2563EB" }} />
          <span className="text-[0.72rem] font-semibold" style={{ color: "#2563EB" }}>
            {navSections
              .flatMap((s) => s.items)
              .find((item) => isActive(item.path))?.label ?? "الصفحة الحالية"}
          </span>
        </div>

        {/* Scrollable Nav */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {navSections.map((section, sIdx) => (
            <div key={section.title} className={sIdx > 0 ? "mt-4" : ""}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <span
                  className="text-[0.66rem] font-bold tracking-[0.14em]"
                  style={{ color: "#94A3B8", textTransform: "uppercase" }}
                >
                  {section.title}
                </span>
                <div className="flex-1 h-px" style={{ background: "#E2E8F0" }} />
              </div>
              <nav className="grid gap-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200"
                      style={{
                        background: active ? "rgba(37,99,235,0.07)" : "transparent",
                        color: active ? "#2563EB" : "#334155",
                        fontWeight: active ? 700 : 500,
                        fontSize: "0.84rem",
                      }}
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
                        style={{
                          background: active ? "rgba(37,99,235,0.12)" : "rgba(7,19,38,0.04)",
                          color: active ? "#2563EB" : "#64748B",
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      {item.label}
                      {active && (
                        <div className="mr-auto h-1.5 w-1.5 rounded-full" style={{ background: "#2563EB" }} />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="shrink-0 px-6 py-4 space-y-2"
          style={{ borderTop: "1px solid hsl(var(--border))" }}
        >
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 transition-colors"
            style={{
              background: "hsl(var(--muted) / 0.4)",
              border: "1px solid hsl(var(--border) / 0.6)",
            }}
          >
            <span className="flex items-center gap-2.5 text-[0.82rem] font-semibold text-foreground">
              {theme === "dark" ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-orange" />}
              {theme === "dark" ? "الوضع الداكن" : "الوضع الفاتح"}
            </span>
            <span
              className="rounded-md px-2 py-0.5 text-[0.66rem] font-bold"
              style={{
                background: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
              }}
            >
              {theme === "dark" ? "فاتح" : "داكن"}
            </span>
          </button>

          <Link to="/leasing" onClick={handleLinkClick} className="block">
            <Button
              className="h-11 w-full rounded-xl text-[0.82rem] font-bold"
              style={{
                background: "#F97316",
                color: "#fff",
                boxShadow: "0 2px 10px rgba(249,115,22,0.25)",
              }}
            >
              استفسر عن الوحدات المتاحة
            </Button>
          </Link>
          <Link to="/contact" onClick={handleLinkClick} className="block">
            <Button
              variant="outline"
              className="h-10 w-full rounded-xl text-[0.78rem] font-bold gap-1.5"
              style={{ borderColor: "#E2E8F0", color: "#64748B" }}
            >
              <Phone className="h-3.5 w-3.5" />
              تواصل معنا
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
