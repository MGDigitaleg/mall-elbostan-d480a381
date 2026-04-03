import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { HeaderMenuSheet } from "@/components/layout/HeaderMenuSheet";

const primaryNavItems = [
  { label: "الرئيسية", path: "/" },
  { label: "عن المول", path: "/about" },
  { label: "المحلات", path: "/stores" },
  { label: "المنتجات", path: "/products" },
  { label: "الخريطة", path: "/map" },
];

const secondaryNavItems = [
  { label: "دليل وسط البلد", path: "/downtown-directory" },
  { label: "التأجير", path: "/leasing" },
  { label: "يوم الافتتاح", path: "/opening-day" },
  { label: "تواصل معنا", path: "/contact" },
];

export function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/#marketplace") return location.pathname === "/" && location.hash === "#marketplace";
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-card/[0.97] shadow-[0_1px_3px_hsl(var(--navy)/0.06),0_6px_20px_hsl(var(--navy)/0.04)] backdrop-blur-xl"
          : "bg-card/90 backdrop-blur-sm"
      }`}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-l from-transparent via-primary to-transparent opacity-60" />

      <div className="container">
        {/* ── Desktop ── */}
        <div className="hidden min-h-[64px] xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:gap-6">
          {/* Primary nav */}
          <nav className="flex items-center justify-start gap-0.5">
            {primaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative inline-flex h-9 items-center rounded-lg px-3.5 text-[0.84rem] font-semibold transition-all duration-300 ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {item.label}
                {/* Active indicator dot */}
                <span
                  className={`absolute bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ${
                    isActive(item.path) ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Center logo */}
          <Link to="/" className="justify-self-center transition-transform duration-300 hover:scale-[1.02]">
            <BrandLogo align="center" imageClassName="h-auto max-w-[172px]" />
          </Link>

          {/* Secondary nav + CTA */}
          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center gap-0.5">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex h-8 items-center px-2.5 text-[0.78rem] font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mx-1 h-5 w-px bg-border/70" />

            <Link to="/spin-win">
              <Button variant="cta" size="sm" className="h-8 rounded-lg px-4 text-[0.76rem]">
                أدر واربح
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Tablet ── */}
        <div className="hidden min-[768px]:max-[1194px]:grid min-[768px]:max-[1194px]:min-h-[60px] min-[768px]:max-[1194px]:grid-cols-[1fr_auto_1fr] min-[768px]:max-[1194px]:items-center min-[768px]:max-[1194px]:gap-3">
          <nav className="flex items-center justify-start gap-0.5">
            {primaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex h-9 items-center px-2.5 text-[0.79rem] font-semibold transition-all duration-300 ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link to="/" className="justify-self-center">
            <BrandLogo align="center" imageClassName="h-auto max-w-[160px]" />
          </Link>

          <div className="flex items-center justify-end gap-2">
            <Link to="/spin-win">
              <Button variant="cta" size="sm" className="h-8 rounded-lg px-4 text-[0.76rem]">أدر واربح</Button>
            </Link>
            <HeaderMenuSheet
              isActive={isActive}
              trigger={
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary" aria-label="فتح القائمة">
                  <Menu size={17} />
                </button>
              }
            />
          </div>
        </div>

        {/* ── Mobile ── */}
        <div className="grid min-h-[56px] grid-cols-[auto_1fr_auto] items-center gap-2 md:hidden">
          <Link to="/map">
            <Button variant="outline-blue" size="sm" className="h-9 w-9 rounded-lg px-0" aria-label="افتح الخريطة">
              <Compass className="h-4 w-4" />
            </Button>
          </Link>

          <Link to="/" className="justify-self-center">
            <BrandLogo align="center" imageClassName="h-[2.5rem] w-auto max-w-[140px]" />
          </Link>

          <HeaderMenuSheet
            isActive={isActive}
            trigger={
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary" aria-label="فتح القائمة">
                <Menu size={17} />
              </button>
            }
          />
        </div>
      </div>
    </header>
  );
}
