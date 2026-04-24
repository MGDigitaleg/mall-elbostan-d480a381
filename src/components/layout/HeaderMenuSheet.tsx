import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Compass, MapPin, Sparkles, Info, ShoppingBag, Briefcase,
  FileText, Phone, Map, Tag, HelpCircle, Gamepad2, Store, Sun, Moon, Home, Radio,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

type BadgeKind = "new" | "soon" | "hot";

const badgeStyles: Record<BadgeKind, { label: string; bg: string; color: string; border: string }> = {
  new: {
    label: "جديد",
    bg: "hsl(var(--primary) / 0.14)",
    color: "hsl(var(--primary))",
    border: "1px solid hsl(var(--primary) / 0.32)",
  },
  soon: {
    label: "قريباً",
    bg: "rgba(249,115,22,0.14)",
    color: "#F97316",
    border: "1px solid rgba(249,115,22,0.34)",
  },
  hot: {
    label: "مميز",
    bg: "rgba(16,185,129,0.14)",
    color: "#10B981",
    border: "1px solid rgba(16,185,129,0.34)",
  },
};

const navSections: Array<{
  title: string;
  items: Array<{ label: string; path: string; icon: typeof Home; badge?: BadgeKind }>;
}> = [
  {
    title: "المول",
    items: [
      { label: "الرئيسية", path: "/", icon: Home },
      { label: "عن البستان", path: "/about", icon: Info },
      { label: "صدى السوق", path: "/market-echo", icon: Radio, badge: "new" },
      { label: "دليل المحلات", path: "/stores", icon: Store },
      { label: "منتجات المحلات", path: "/products", icon: ShoppingBag },
      { label: "الخريطة التفاعلية", path: "/map", icon: Map },
      { label: "عروض الافتتاح", path: "/daily-deals", icon: Tag, badge: "soon" },
    ],
  },
  {
    title: "الفروع",
    items: [
      { label: "فرع القاهرة الجديدة", path: "/new-cairo-branch", icon: MapPin },
      { label: "فرع وسط البلد", path: "/downtown-branch", icon: MapPin },
      { label: "دليل محلات وسط البلد", path: "/downtown-directory", icon: Compass },
    ],
  },
  {
    title: "خدمات",
    items: [
      { label: "الوحدات المتاحة", path: "/leasing", icon: Briefcase },
      { label: "يوم الافتتاح", path: "/opening-day", icon: Sparkles, badge: "soon" },
      { label: "أدر واربح", path: "/spin-win", icon: Gamepad2, badge: "hot" },
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
  const { theme, toggleTheme } = useTheme();

  const handleLinkClick = () => {
    setTimeout(() => setOpen(false), 120);
  };

  const currentLabel =
    navSections.flatMap((s) => s.items).find((item) => isActive(item.path))?.label;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-[90vw] max-w-[24rem] flex-col border-0 px-0 py-0 overflow-hidden"
        style={{ background: "hsl(var(--card))" }}
      >
        {/* Dark Header with rounded bottom */}
        <div
          className="shrink-0 px-6 pt-10 pb-6 rounded-b-3xl relative"
          style={{
            background:
              "linear-gradient(160deg, #071326 0%, #0B1B34 60%, #102448 100%)",
          }}
        >
          {/* Theme toggle — top-left (next to close button area) */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
            className="absolute left-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#E2E8F0",
            }}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <SheetHeader className="space-y-2 text-center">
            <div className="flex justify-center">
              <BrandLogo align="center" imageClassName="h-auto max-w-[110px] brightness-0 invert opacity-95" />
            </div>
            <SheetTitle className="text-center text-[1rem] font-bold" style={{ color: "#F8FAFC" }}>
              القائمة
            </SheetTitle>
            <SheetDescription className="text-center text-[0.74rem] leading-6" style={{ color: "#94A3B8" }}>
              تنقل سريع بين صفحات مول البستان
            </SheetDescription>
          </SheetHeader>

          {/* Current page indicator inside header */}
          {currentLabel && (
            <div
              className="mx-auto mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-1.5"
              style={{
                background: "rgba(37,99,235,0.18)",
                border: "1px solid rgba(37,99,235,0.32)",
              }}
            >
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: "#60A5FA" }} />
              <span className="text-[0.72rem] font-semibold" style={{ color: "#DBEAFE" }}>
                أنت الآن في: {currentLabel}
              </span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <Link to="/map" onClick={handleLinkClick}>
              <Button
                className="h-12 w-full gap-2 rounded-xl text-[0.8rem] font-bold"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#E2E8F0",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <Compass className="h-4 w-4" />
                الخريطة
              </Button>
            </Link>
            <Link to="/spin-win" onClick={handleLinkClick}>
              <Button
                className="h-12 w-full gap-2 rounded-xl text-[0.8rem] font-bold"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                }}
              >
                <Sparkles className="h-4 w-4" />
                أدر واربح
              </Button>
            </Link>
          </div>
        </div>

        {/* Scrollable Nav */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {navSections.map((section, sIdx) => (
            <div key={section.title} className={sIdx > 0 ? "mt-5" : ""}>
              <div className="flex items-center gap-3 mb-2.5 px-2">
                <span
                  className="text-[0.7rem] font-bold tracking-[0.16em]"
                  style={{ color: "hsl(var(--muted-foreground))", textTransform: "uppercase" }}
                >
                  {section.title}
                </span>
                <div className="flex-1 h-px" style={{ background: "hsl(var(--border) / 0.5)" }} />
              </div>
              <nav className="grid gap-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  const badge = item.badge ? badgeStyles[item.badge] : null;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={handleLinkClick}
                      className="group flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 hover:bg-muted/60"
                      style={{
                        background: active ? "hsl(var(--primary) / 0.08)" : "transparent",
                        color: active ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.78)",
                        fontWeight: active ? 700 : 500,
                        fontSize: "0.85rem",
                        borderRight: active ? "2px solid hsl(var(--primary))" : "2px solid transparent",
                      }}
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
                        style={{
                          background: active
                            ? "hsl(var(--primary) / 0.14)"
                            : "hsl(var(--muted) / 0.6)",
                          color: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {badge && (
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[0.62rem] font-bold leading-none"
                          style={{
                            background: badge.bg,
                            color: badge.color,
                            border: badge.border,
                          }}
                        >
                          {badge.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom CTA — single quiet outline */}
        <div
          className="shrink-0 px-5 py-4"
          style={{ borderTop: "1px solid hsl(var(--border))" }}
        >
          <Link to="/contact" onClick={handleLinkClick} className="block">
            <Button
              variant="outline"
              className="h-11 w-full rounded-xl text-[0.82rem] font-bold gap-2"
            >
              <Phone className="h-4 w-4" />
              تواصل معنا
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
