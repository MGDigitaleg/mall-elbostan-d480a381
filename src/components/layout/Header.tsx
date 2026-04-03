import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, Menu, Sparkles } from "lucide-react";
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
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-400"
      style={{
        background: scrolled
          ? "rgba(255,255,255,0.96)"
          : "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        boxShadow: scrolled
          ? "0 1px 0 rgba(7,19,38,0.06), 0 4px 16px rgba(7,19,38,0.04)"
          : "none",
      }}
    >
      {/* Top accent line — refined gradient */}
      <div
        className="h-[2px] w-full transition-opacity duration-500"
        style={{
          background: "linear-gradient(90deg, transparent 5%, #2563EB 30%, #06B6D4 50%, #2563EB 70%, transparent 95%)",
          opacity: scrolled ? 0.7 : 0.45,
        }}
      />

      <div className="container">
        {/* ── Desktop XL ── */}
        <div className="hidden min-h-[68px] xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:gap-8">
          {/* Primary nav */}
          <nav className="flex items-center justify-start gap-1">
            {primaryNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group relative inline-flex h-10 items-center rounded-lg px-3.5 transition-all duration-300"
                  style={{
                    color: active ? "#2563EB" : "#334155",
                    fontWeight: active ? 700 : 600,
                    fontSize: "0.84rem",
                    background: active ? "rgba(37,99,235,0.06)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = "rgba(7,19,38,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {item.label}
                  {/* Active underline bar */}
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300"
                    style={{
                      height: "2px",
                      width: active ? "60%" : "0%",
                      background: "#2563EB",
                      opacity: active ? 1 : 0,
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Center logo */}
          <Link
            to="/"
            className="group justify-self-center transition-transform duration-300 hover:scale-[1.02]"
          >
            <BrandLogo align="center" imageClassName="h-auto max-w-[176px]" />
          </Link>

          {/* Secondary nav + CTA */}
          <div className="flex items-center justify-end gap-1">
            {secondaryNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="inline-flex h-8 items-center rounded-md px-2.5 transition-all duration-300"
                  style={{
                    fontSize: "0.76rem",
                    fontWeight: active ? 700 : 500,
                    color: active ? "#2563EB" : "#64748B",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = "#0F172A";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = active ? "#2563EB" : "#64748B";
                  }}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mx-1.5 h-5 w-px" style={{ background: "#E2E8F0" }} />

            <Link to="/spin-win">
              <Button
                size="sm"
                className="h-[34px] gap-1.5 rounded-lg px-4 text-[0.76rem] font-bold transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                أدر واربح
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Tablet ── */}
        <div className="hidden min-[768px]:max-[1194px]:grid min-[768px]:max-[1194px]:min-h-[62px] min-[768px]:max-[1194px]:grid-cols-[1fr_auto_1fr] min-[768px]:max-[1194px]:items-center min-[768px]:max-[1194px]:gap-3">
          <nav className="flex items-center justify-start gap-0.5">
            {primaryNavItems.slice(0, 4).map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="inline-flex h-9 items-center rounded-md px-2.5 transition-all duration-300"
                  style={{
                    fontSize: "0.79rem",
                    fontWeight: active ? 700 : 600,
                    color: active ? "#2563EB" : "#334155",
                    background: active ? "rgba(37,99,235,0.06)" : "transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link to="/" className="justify-self-center">
            <BrandLogo align="center" imageClassName="h-auto max-w-[156px]" />
          </Link>

          <div className="flex items-center justify-end gap-2">
            <Link to="/spin-win">
              <Button
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-3.5 text-[0.74rem] font-bold"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.2)",
                }}
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
                  style={{ border: "1px solid #E2E8F0", background: "#FAFAFA", color: "#334155" }}
                  aria-label="فتح القائمة"
                >
                  <Menu size={17} />
                </button>
              }
            />
          </div>
        </div>

        {/* ── Mobile ── */}
        <div className="grid min-h-[58px] grid-cols-[auto_1fr_auto] items-center gap-3 md:hidden">
          <Link to="/map">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200"
              style={{
                border: "1px solid rgba(37,99,235,0.2)",
                background: "rgba(37,99,235,0.06)",
                color: "#2563EB",
              }}
              aria-label="افتح الخريطة"
            >
              <Compass className="h-4 w-4" />
            </button>
          </Link>

          <Link to="/" className="justify-self-center">
            <BrandLogo align="center" imageClassName="h-[2.5rem] w-auto max-w-[140px]" />
          </Link>

          <HeaderMenuSheet
            isActive={isActive}
            trigger={
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200"
                style={{ border: "1px solid #E2E8F0", background: "#FAFAFA", color: "#334155" }}
                aria-label="فتح القائمة"
              >
                <Menu size={17} />
              </button>
            }
          />
        </div>
      </div>
    </header>
  );
}
