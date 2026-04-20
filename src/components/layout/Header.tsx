import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, Menu, Sparkles, ChevronDown, MapPin, ShoppingCart } from "lucide-react";
import { useKzCart } from "@/hooks/useKzCart";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { HeaderMenuSheet } from "@/components/layout/HeaderMenuSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

const primaryNavItems = [
  { label: "الرئيسية", path: "/" },
  { label: "عن البستان", path: "/about" },
  { label: "دليل المحلات", path: "/stores" },
  { label: "المنتجات", path: "/products" },
  { label: "الخريطة", path: "/map" },
];

const branchItems = [
  { label: "فرع القاهرة الجديدة", path: "/new-cairo-branch", desc: "التجمع الخامس" },
  { label: "فرع وسط البلد", path: "/downtown-branch", desc: "الفرع الأصلي منذ ١٩٩٠" },
  { label: "دليل محلات وسط البلد", path: "/downtown-directory", desc: "كل المحلات في الفرع" },
  { label: "صدى السوق", path: "/market-echo", desc: "ذاكرة السوق والهوية" },
];

const secondaryNavItems = [
  { label: "الوحدات المتاحة", path: "/leasing" },
  { label: "يوم الافتتاح", path: "/opening-day" },
  { label: "العروض", path: "/daily-deals" },
  { label: "تواصل معنا", path: "/contact" },
];

/** Pages that have a full-bleed dark hero — header starts transparent */
const darkHeroPages = ["/", "/downtown-branch", "/new-cairo-branch", "/opening-day"];

export function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const branchRef = useRef<HTMLDivElement>(null);

  const { totalItems } = useKzCart();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isKzPage = location.pathname.startsWith("/kz");

  const hasDarkHero = darkHeroPages.some(
    (p) => (p === "/" ? location.pathname === "/" : location.pathname === p)
  );

  /** Mode A = transparent over dark hero; Mode B = light after scroll or on light pages */
  const isTransparent = hasDarkHero && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!branchOpen) return;
    const handler = (e: MouseEvent) => {
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) {
        setBranchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [branchOpen]);

  useEffect(() => {
    setBranchOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isBranchActive = branchItems.some((b) => isActive(b.path));

  /* ----------- adaptive colors ----------- */
  const textColor = isTransparent ? "rgba(248,250,252,0.92)" : (isDark ? "#E2E8F0" : "#334155");
  const textColorMuted = isTransparent ? "rgba(148,163,184,0.9)" : (isDark ? "#94A3B8" : "#64748B");
  const activeColor = isTransparent ? "#60A5FA" : "#2563EB";
  const activeBg = isTransparent ? "rgba(96,165,250,0.1)" : "rgba(37,99,235,0.06)";
  const hoverBg = isTransparent ? "rgba(255,255,255,0.06)" : (isDark ? "rgba(255,255,255,0.05)" : "rgba(7,19,38,0.03)");
  const borderColor = isTransparent ? "rgba(255,255,255,0.08)" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(216,222,232,0.5)");
  const menuBtnBg = isTransparent ? "rgba(255,255,255,0.08)" : (isDark ? "rgba(255,255,255,0.06)" : "#FAFAF8");
  const menuBtnBorder = isTransparent ? "rgba(255,255,255,0.12)" : (isDark ? "rgba(255,255,255,0.1)" : "#D8DEE8");
  const menuBtnColor = isTransparent ? "#E2E8F0" : (isDark ? "#E2E8F0" : "#334155");

  const navLinkStyle = (active: boolean) => ({
    color: active ? activeColor : textColor,
    fontWeight: active ? 700 : 600,
    fontSize: "0.82rem" as const,
    background: active ? activeBg : "transparent",
  });

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50"
      style={{
        background: isTransparent
          ? "transparent"
          : scrolled
            ? (isDark ? "rgba(11,18,32,0.97)" : "rgba(250,250,248,0.97)")
            : (isDark ? "rgba(11,18,32,0.92)" : "rgba(250,250,248,0.92)"),
        backdropFilter: isTransparent ? "none" : "blur(12px) saturate(1.2)",
        WebkitBackdropFilter: isTransparent ? "none" : "blur(12px) saturate(1.2)",
        borderBottom: isTransparent ? "1px solid transparent" : `1px solid ${borderColor}`,
        boxShadow: !isTransparent && scrolled
          ? (isDark ? "0 1px 3px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.15)" : "0 1px 3px rgba(7,19,38,0.04), 0 4px 16px rgba(7,19,38,0.03)")
          : "none",
        transition: "background 0.4s, box-shadow 0.4s, border-color 0.4s, backdrop-filter 0.4s",
      }}
    >
      <div className="container">
        {/* ── Desktop XL ── */}
        <div
          className="hidden xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:gap-6"
          style={{ minHeight: scrolled ? "60px" : "66px", transition: "min-height 0.4s" }}
        >
          {/* Primary nav */}
          <nav className="flex items-center justify-start gap-0.5">
            {primaryNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group relative inline-flex h-10 items-center rounded-lg px-3 transition-all duration-300"
                  style={{ ...navLinkStyle(active), ...(active ? {} : { ":hover": { background: hoverBg } }) } as React.CSSProperties}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget.style.background = hoverBg); }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget.style.background = "transparent"); }}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-[50%] rounded-full"
                      style={{ background: activeColor }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Branches dropdown */}
            <div ref={branchRef} className="relative">
              <button
                onClick={() => setBranchOpen((v) => !v)}
                className="group relative inline-flex h-10 items-center gap-1 rounded-lg px-3 transition-all duration-300"
                style={navLinkStyle(isBranchActive || branchOpen)}
                onMouseEnter={(e) => { if (!isBranchActive && !branchOpen) (e.currentTarget.style.background = hoverBg); }}
                onMouseLeave={(e) => { if (!isBranchActive && !branchOpen) (e.currentTarget.style.background = "transparent"); }}
              >
                الفروع
                <ChevronDown
                  className="h-3 w-3 transition-transform duration-200"
                  style={{ transform: branchOpen ? "rotate(180deg)" : "rotate(0)" }}
                />
                {isBranchActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-[50%] rounded-full" style={{ background: activeColor }} />
                )}
              </button>

              {branchOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-[280px] rounded-xl p-1.5"
                  style={{
                    background: isTransparent ? "rgba(7,19,38,0.92)" : (isDark ? "rgba(17,27,46,0.98)" : "rgba(250,250,248,0.98)"),
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${(isTransparent || isDark) ? "rgba(255,255,255,0.1)" : "rgba(216,222,232,0.6)"}`,
                    boxShadow: "0 8px 32px rgba(7,19,38,0.15), 0 2px 8px rgba(7,19,38,0.08)",
                    animation: "fadeInDown 0.15s ease-out",
                  }}
                >
                  {branchItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 transition-all duration-200"
                        style={{
                          background: active ? activeBg : "transparent",
                          color: active ? activeColor : ((isTransparent || isDark) ? "#CBD5E1" : "#334155"),
                        }}
                        onMouseEnter={(e) => { if (!active) (e.currentTarget.style.background = hoverBg); }}
                        onMouseLeave={(e) => { if (!active) (e.currentTarget.style.background = "transparent"); }}
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ background: active ? (isTransparent ? "rgba(96,165,250,0.15)" : "rgba(37,99,235,0.12)") : ((isTransparent || isDark) ? "rgba(255,255,255,0.06)" : "rgba(7,19,38,0.04)") }}
                        >
                          <MapPin className="h-3.5 w-3.5" style={{ color: active ? activeColor : textColorMuted }} />
                        </span>
                        <div>
                          <p className="text-[0.8rem]" style={{ fontWeight: active ? 700 : 600 }}>{item.label}</p>
                          <p className="text-[0.68rem]" style={{ color: isTransparent ? "rgba(148,163,184,0.7)" : "#94A3B8" }}>{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Center logo */}
          <Link to="/" className="group justify-self-center transition-transform duration-300 hover:scale-[1.02]">
            <BrandLogo
              align="center"
              imageClassName="h-[54px] w-auto"
              variant={(isTransparent || isDark) ? "light" : "dark"}
            />
          </Link>

          {/* Secondary nav + CTA */}
          <div className="flex items-center justify-end gap-0.5">
            {secondaryNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="inline-flex h-8 items-center rounded-md px-2.5 transition-all duration-300"
                  style={{ fontSize: "0.74rem", fontWeight: active ? 700 : 500, color: active ? activeColor : textColorMuted }}
                >
                  {item.label}
                </Link>
              );
            })}

            {isKzPage && (
              <Link to="/kz/cart" className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200" style={{ border: `1px solid ${menuBtnBorder}`, background: menuBtnBg, color: menuBtnColor }}>
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[0.6rem] font-bold text-white" style={{ background: "#2563EB" }}>{totalItems}</span>
                )}
              </Link>
            )}

            <ThemeToggle isTransparent={isTransparent} />

            <div className="mx-1.5 h-5 w-px" style={{ background: isTransparent ? "rgba(255,255,255,0.12)" : (isDark ? "rgba(255,255,255,0.1)" : "#D8DEE8") }} />

            <Link to="/spin-win" className="relative z-10 inline-flex">
              <Button
                size="sm"
                className="h-[34px] gap-1.5 rounded-lg px-4 text-[0.76rem] font-bold transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 10px rgba(37,99,235,0.22)",
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                أدر واربح
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Tablet ── */}
        <div
          className="hidden min-[768px]:max-[1279px]:grid min-[768px]:max-[1279px]:grid-cols-[1fr_auto_1fr] min-[768px]:max-[1279px]:items-center min-[768px]:max-[1279px]:gap-3"
          style={{ minHeight: scrolled ? "56px" : "62px", transition: "min-height 0.4s" }}
        >
          <nav className="flex items-center justify-start gap-0.5">
            {primaryNavItems.slice(0, 4).map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative inline-flex h-9 items-center rounded-md px-2.5 transition-all duration-300"
                  style={{ fontSize: "0.79rem", fontWeight: active ? 700 : 600, color: active ? activeColor : textColor, background: active ? activeBg : "transparent" }}
                >
                  {item.label}
                  {active && <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full" style={{ background: activeColor }} />}
                </Link>
              );
            })}
          </nav>

          <Link to="/" className="justify-self-center">
            <BrandLogo align="center" imageClassName="h-[46px] w-auto" variant={(isTransparent || isDark) ? "light" : "dark"} />
          </Link>

          <div className="flex items-center justify-end gap-2">
            <ThemeToggle isTransparent={isTransparent} />
            {isKzPage && (
              <Link to="/kz/cart" className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200" style={{ border: `1px solid ${menuBtnBorder}`, background: menuBtnBg, color: menuBtnColor }}>
                <ShoppingCart className="h-3.5 w-3.5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-0.5 text-[0.55rem] font-bold text-white" style={{ background: "#2563EB" }}>{totalItems}</span>
                )}
              </Link>
            )}
            <Link to="/spin-win">
              <Button
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-3.5 text-[0.74rem] font-bold"
                style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", color: "#fff", boxShadow: "0 2px 8px rgba(37,99,235,0.2)" }}
              >
                <Sparkles className="h-3 w-3" />
                أدر واربح
              </Button>
            </Link>
            <HeaderMenuSheet
              isActive={isActive}
              trigger={
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200"
                  style={{ border: `1px solid ${menuBtnBorder}`, background: menuBtnBg, color: menuBtnColor }}
                  aria-label="فتح القائمة"
                >
                  <Menu size={17} />
                </button>
              }
            />
          </div>
        </div>

        {/* ── Mobile ── */}
        <div
          className={`grid items-center gap-3 md:hidden ${isKzPage ? "grid-cols-[auto_auto_1fr_auto]" : "grid-cols-[auto_1fr_auto]"}`}
          style={{ minHeight: scrolled ? "44px" : "48px", transition: "min-height 0.4s" }}
        >
          <Link to="/map">
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200"
              style={{
                border: `1px solid ${isTransparent ? "rgba(96,165,250,0.2)" : "rgba(37,99,235,0.18)"}`,
                background: isTransparent ? "rgba(96,165,250,0.08)" : "rgba(37,99,235,0.06)",
                color: isTransparent ? "#60A5FA" : "#2563EB",
              }}
              aria-label="افتح الخريطة"
            >
              <Compass className="h-4 w-4" />
            </button>
          </Link>

          {isKzPage && (
            <Link to="/kz/cart" className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200" style={{ border: `1px solid ${menuBtnBorder}`, background: menuBtnBg, color: menuBtnColor }}>
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -left-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-0.5 text-[0.55rem] font-bold text-white" style={{ background: "#2563EB" }}>{totalItems}</span>
              )}
            </Link>
          )}

          <Link to="/" className="justify-self-center">
            <BrandLogo align="center" imageClassName="h-[38px] w-auto" variant={(isTransparent || isDark) ? "light" : "dark"} />
          </Link>

          <HeaderMenuSheet
            isActive={isActive}
            trigger={
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200"
                style={{ border: `1px solid ${menuBtnBorder}`, background: menuBtnBg, color: menuBtnColor }}
                aria-label="فتح القائمة"
              >
                <Menu size={17} />
              </button>
            }
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
