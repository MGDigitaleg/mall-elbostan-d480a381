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
    `rounded-full px-2 py-1 text-[0.88rem] font-semibold transition-all duration-300 ${
      isActive(path)
        ? "bg-card/88 text-foreground shadow-[var(--shadow-soft)]"
        : "text-muted-foreground/90 hover:text-foreground"
    }`;

  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-3 pt-2 md:px-4 md:pt-2">
      <div className="container">
        <div className="glass rounded-[1.15rem] border-border/60 px-3 py-1.5 md:px-4 md:py-1.5 shadow-[var(--shadow-soft)]">
          <div className="hidden xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:gap-3">
            <nav className="flex items-center justify-end gap-1">
              {primaryNavItems.map((item) => (
                <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link to="/" className="justify-self-center">
              <div className="relative flex items-center justify-center px-2 py-0.5">
                <BrandLogo
                  framed
                  align="center"
                  imageClassName="h-[5.2rem] md:h-[5.6rem]"
                />
              </div>
            </Link>

            <div className="flex items-center justify-start gap-1.5">
              <div className="flex items-center gap-1">
                {secondaryNavItems.map((item) => (
                  <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <Link to="/#marketplace" className="rounded-full px-2 py-1 text-[0.88rem] font-semibold text-muted-foreground transition-colors hover:text-foreground">
                السوق قريبًا
              </Link>
              <Link to="/spin-win">
                <Button variant="cta" size="sm" className="h-8.5 rounded-full px-4">
                  أدر واربح
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 xl:hidden">
            <button
              className="rounded-full border border-border/70 bg-card p-2 text-foreground shadow-[var(--shadow-soft)]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link to="/" className="flex-1">
              <div className="flex items-center justify-center px-1 py-0">
                <BrandLogo framed align="center" imageClassName="h-[4.65rem]" />
              </div>
            </Link>

            <Link to="/spin-win" className="hidden sm:block">
              <Button variant="cta" size="sm" className="h-8.5 rounded-full px-4">
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
            <nav className="glass mt-3 flex flex-col gap-2 rounded-[1.2rem] px-4 py-4">
              <div className="rounded-[1.2rem] px-1 py-0.5 text-center">
                <BrandLogo framed align="center" imageClassName="mx-auto h-[4.8rem]" />
              </div>

              {mobileNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-[1rem] px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive(item.path) ? "bg-card text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
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
