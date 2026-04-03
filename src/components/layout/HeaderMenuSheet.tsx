import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Compass, MapPin, Sparkles, Building2, ShoppingBag, Briefcase, FileText, Phone, Map } from "lucide-react";

const navSections = [
  {
    title: "المول",
    items: [
      { label: "الرئيسية", path: "/", icon: Building2 },
      { label: "عن المول", path: "/about", icon: Building2 },
      { label: "المحلات", path: "/stores", icon: ShoppingBag },
      { label: "المنتجات", path: "/products", icon: ShoppingBag },
      { label: "الخريطة التفاعلية", path: "/map", icon: Map },
    ],
  },
  {
    title: "الفروع",
    items: [
      { label: "فرع القاهرة الجديدة", path: "/new-cairo-branch", icon: MapPin },
      { label: "فرع وسط البلد", path: "/downtown-branch", icon: MapPin },
      { label: "دليل وسط البلد", path: "/downtown-directory", icon: MapPin },
    ],
  },
  {
    title: "خدمات",
    items: [
      { label: "التأجير", path: "/leasing", icon: Briefcase },
      { label: "يوم الافتتاح", path: "/opening-day", icon: Sparkles },
      { label: "انضم للسوق", path: "/join-marketplace", icon: ShoppingBag },
      { label: "الوظائف", path: "/careers", icon: Briefcase },
    ],
  },
  {
    title: "المعلومات",
    items: [
      { label: "المدونة", path: "/blog", icon: FileText },
      { label: "تواصل معنا", path: "/contact", icon: Phone },
    ],
  },
];

interface HeaderMenuSheetProps {
  isActive: (path: string) => boolean;
  trigger: JSX.Element;
}

export function HeaderMenuSheet({ isActive, trigger }: HeaderMenuSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-[90vw] max-w-[24rem] flex-col border-0 px-0 py-0"
        style={{ background: "#FAFBFC" }}
      >
        {/* Header */}
        <div
          className="shrink-0 px-6 pt-6 pb-4"
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
            <Link to="/map">
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
            <Link to="/spin-win">
              <Button
                className="h-11 w-full gap-2 rounded-xl text-[0.78rem] font-bold"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                  color: "#fff",
                }}
              >
                <Sparkles className="h-4 w-4" />
                أدر واربح
              </Button>
            </Link>
          </div>
        </div>

        {/* Scrollable Nav */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {navSections.map((section) => (
            <div key={section.title} className="mb-5">
              <p
                className="mb-2 px-1 text-[0.68rem] font-bold tracking-[0.12em]"
                style={{ color: "#94A3B8", textTransform: "uppercase" }}
              >
                {section.title}
              </p>
              <nav className="grid gap-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200"
                      style={{
                        background: active ? "rgba(37,99,235,0.07)" : "transparent",
                        color: active ? "#2563EB" : "#334155",
                        fontWeight: active ? 700 : 500,
                        fontSize: "0.84rem",
                      }}
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: active ? "rgba(37,99,235,0.12)" : "rgba(7,19,38,0.04)",
                          color: active ? "#2563EB" : "#64748B",
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="shrink-0 px-6 py-4"
          style={{ borderTop: "1px solid #E2E8F0" }}
        >
          <Link to="/leasing" className="block">
            <Button
              className="h-11 w-full rounded-xl text-[0.82rem] font-bold"
              style={{
                background: "#F97316",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(249,115,22,0.25)",
              }}
            >
              استفسر عن التأجير والشراء
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
