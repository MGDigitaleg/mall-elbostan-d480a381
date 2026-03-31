import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";

const primaryNavItems = [
  { label: "الرئيسية", path: "/" },
  { label: "عن المول", path: "/about" },
  { label: "المتاجر", path: "/stores" },
  { label: "الخريطة", path: "/map" },
];

const secondaryNavItems = [
  { label: "التأجير", path: "/leasing" },
  { label: "يوم الافتتاح", path: "/opening-day" },
  { label: "تواصل معنا", path: "/contact" },
];

const mobileNavItems = [
  ...primaryNavItems,
  ...secondaryNavItems,
  { label: "الوظائف", path: "/careers" },
  { label: "المدونة", path: "/blog" },
  { label: "السوق قريباً", path: "/#marketplace" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => {
    if (path === "/#marketplace") {
      return location.pathname === "/" && location.hash === "#marketplace";
    }

    return location.pathname === path;
  };

  const navLinkClass = (path: string) =>
    `inline-flex h-8 items-center rounded-full px-3.5 text-[0.95rem] font-semibold transition-colors duration-200 ${
      isActive(path)
        ? "bg-secondary text-foreground shadow-[var(--shadow-soft)]"
        : "text-foreground hover:bg-secondary/75 hover:text-foreground"
    }`;

  const secondaryNavLinkClass = (path: string) =>
    `inline-flex h-8 items-center rounded-full px-2.5 text-[0.82rem] font-semibold transition-colors duration-200 ${
      isActive(path)
        ? "bg-card text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-3 pt-2 md:px-4 md:pt-2.5">
      <div className="container">
        <div className="surface-panel rounded-[1.35rem] px-4 md:px-5">
          <div className="hidden min-h-[82px] xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:gap-3">
            <nav className="flex items-center justify-end gap-1">
              {primaryNavItems.map((item) => (
                <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link to="/" className="justify-self-center">
              <div className="relative -translate-y-[1px] flex items-center justify-center">
                <BrandLogo
                  align="center"
                  imageClassName="h-auto max-w-[198px]"
                />
              </div>
            </Link>

            <div className="flex items-center justify-start gap-2">
              <div className="flex items-center gap-0.5 rounded-full border border-border/70 bg-card px-1.5 py-1">
                {secondaryNavItems.map((item) => (
                  <Link key={item.path} to={item.path} className={secondaryNavLinkClass(item.path)}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <Link to="/#marketplace" className="inline-flex h-8 items-center rounded-full px-2.5 text-[0.82rem] font-semibold text-muted-foreground transition-colors hover:text-foreground">
                السوق قريبًا
              </Link>
              <Link to="/spin-win">
                <Button variant="cta" size="sm" className="h-8.5 rounded-full px-4">
                  أدر واربح
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex min-h-[68px] items-center justify-between gap-2 xl:hidden">
            <button
              className="rounded-full border border-border/70 bg-card p-2 text-foreground shadow-[var(--shadow-soft)]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link to="/" className="flex-1">
              <div className="flex items-center justify-center">
                <BrandLogo align="center" imageClassName="h-auto max-w-[144px]" />
              </div>
            </Link>

            <Link to="/spin-win" className="hidden sm:block">
              <Button variant="cta" size="sm" className="h-9 rounded-full px-4">
                أدر واربح
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="container xl:hidden"
          >
            <nav className="surface-panel mt-2.5 flex flex-col gap-2 rounded-[1.5rem] px-4 py-4">
              <div className="text-center">
                <BrandLogo align="center" imageClassName="mx-auto h-auto max-w-[150px]" />
              </div>

              {mobileNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-[1rem] px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(item.path) ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/#marketplace" onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" className="w-full rounded-[1.1rem]">
                  <ShoppingBag className="h-4 w-4" />
                  السوق قريبًا
                </Button>
              </Link>
              <Link to="/spin-win" onClick={() => setMobileOpen(false)}>
                <Button variant="cta" className="w-full rounded-[1.1rem]">
                  أدر واربح
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
