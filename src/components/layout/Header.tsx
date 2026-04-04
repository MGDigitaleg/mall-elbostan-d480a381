import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, Menu, Sparkles, ChevronDown, MapPin } from "lucide-react";
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

const branchItems = [
  { label: "فرع القاهرة الجديدة", path: "/new-cairo-branch", desc: "التجمع الخامس" },
  { label: "فرع وسط البلد", path: "/downtown-branch", desc: "الفرع الأصلي منذ 1990" },
  { label: "دليل وسط البلد", path: "/downtown-directory", desc: "دليل محلات الفرع" },
];

const secondaryNavItems = [
  { label: "التأجير", path: "/leasing" },
  { label: "يوم الافتتاح", path: "/opening-day" },
  { label: "العروض", path: "/daily-deals" },
  { label: "تواصل معنا", path: "/contact" },
];

export function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const branchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close branch dropdown on click outside
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

  // Close dropdown on route change
  useEffect(() => {
    setBranchOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isBranchActive = branchItems.some((b) => isActive(b.path));

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(255,255,255,0.97)"
          : "rgba(255,255,255,0.90)",
        backdropFilter: "blur(24px) saturate(1.5)",
        WebkitBackdropFilter: "blur(24px) saturate(1.5)",
        boxShadow: scrolled
          ? "0 1px 0 rgba(7,19,38,0.05), 0 4px 20px rgba(7,19,38,0.04)"
          : "none",
      }}
    >
      {/* Top accent line */}
      <div
        className="h-[2px] w-full transition-opacity duration-500"
        style={{
          background: "linear-gradient(90deg, transparent 5%, #2563EB 25%, #06B6D4 50%, #2563EB 75%, transparent 95%)",
          opacity: scrolled ? 0.8 : 0.45,
        }}
      />

      <div className="container">
        {/* ── Desktop XL ── */}
        <div className="hidden min-h-[68px] xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:gap-6">
          {/* Primary nav */}
          <nav className="flex items-center justify-start gap-0.5">
            {primaryNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group relative inline-flex h-10 items-center rounded-lg px-3 transition-all duration-300"
                  style={{
                    color: active ? "#2563EB" : "#334155",
                    fontWeight: active ? 700 : 600,
                    fontSize: "0.82rem",
                    background: active ? "rgba(37,99,235,0.06)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = "rgba(7,19,38,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {item.label}
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300"
                    style={{
                      height: "2px",
                      width: active ? "55%" : "0%",
                      background: "linear-gradient(90deg, #2563EB, #06B6D4)",
                      opacity: active ? 1 : 0,
                    }}
                  />
                </Link>
              );
            })}

            {/* Branches dropdown */}
            <div ref={branchRef} className="relative">
              <button
                onClick={() => setBranchOpen((v) => !v)}
                className="group relative inline-flex h-10 items-center gap-1 rounded-lg px-3 transition-all duration-300"
                style={{
                  color: isBranchActive ? "#2563EB" : "#334155",
                  fontWeight: isBranchActive ? 700 : 600,
                  fontSize: "0.82rem",
                  background: isBranchActive || branchOpen ? "rgba(37,99,235,0.06)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isBranchActive && !branchOpen) e.currentTarget.style.background = "rgba(7,19,38,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!isBranchActive && !branchOpen) e.currentTarget.style.background = "transparent";
                }}
              >
                الفروع
                <ChevronDown
                  className="h-3 w-3 transition-transform duration-200"
                  style={{ transform: branchOpen ? "rotate(180deg)" : "rotate(0)" }}
                />
                {isBranchActive && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      height: "2px",
                      width: "55%",
                      background: "linear-gradient(90deg, #2563EB, #06B6D4)",
                    }}
                  />
                )}
              </button>

              {/* Dropdown panel */}
              {branchOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-[280px] rounded-xl p-1.5 shadow-xl"
                  style={{
                    background: "rgba(255,255,255,0.98)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(7,19,38,0.08)",
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
                          background: active ? "rgba(37,99,235,0.07)" : "transparent",
                          color: active ? "#2563EB" : "#334155",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) e.currentTarget.style.background = "rgba(7,19,38,0.03)";
                        }}
                        onMouseLeave={(e) => {
                          if (!active) e.currentTarget.style.background = active ? "rgba(37,99,235,0.07)" : "transparent";
                        }}
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            background: active ? "rgba(37,99,235,0.12)" : "rgba(7,19,38,0.04)",
                          }}
                        >
                          <MapPin className="h-3.5 w-3.5" style={{ color: active ? "#2563EB" : "#64748B" }} />
                        </span>
                        <div>
                          <p className="text-[0.8rem]" style={{ fontWeight: active ? 700 : 600 }}>{item.label}</p>
                          <p className="text-[0.68rem]" style={{ color: "#94A3B8" }}>{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Center logo */}
          <Link
            to="/"
            className="group justify-self-center transition-transform duration-300 hover:scale-[1.02]"
          >
            <BrandLogo align="center" imageClassName="h-auto max-w-[176px]" />
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
                  style={{
                    fontSize: "0.74rem",
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
                  boxShadow: "0 2px 10px rgba(37,99,235,0.25)",
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                أدر واربح
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Tablet ── */}
        <div className="hidden min-[768px]:max-[1279px]:grid min-[768px]:max-[1279px]:min-h-[62px] min-[768px]:max-[1279px]:grid-cols-[1fr_auto_1fr] min-[768px]:max-[1279px]:items-center min-[768px]:max-[1279px]:gap-3">
          <nav className="flex items-center justify-start gap-0.5">
            {primaryNavItems.slice(0, 4).map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative inline-flex h-9 items-center rounded-md px-2.5 transition-all duration-300"
                  style={{
                    fontSize: "0.79rem",
                    fontWeight: active ? 700 : 600,
                    color: active ? "#2563EB" : "#334155",
                    background: active ? "rgba(37,99,235,0.06)" : "transparent",
                  }}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full"
                      style={{ background: "#2563EB" }}
                    />
                  )}
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
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 hover:bg-secondary"
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
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 hover:bg-secondary"
                style={{ border: "1px solid #E2E8F0", background: "#FAFAFA", color: "#334155" }}
                aria-label="فتح القائمة"
              >
                <Menu size={17} />
              </button>
            }
          />
        </div>
      </div>

      {/* Dropdown animation keyframes */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
