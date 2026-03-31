import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";

const navItems = [
  { label: "الرئيسية", path: "/" },
  { label: "عن المول", path: "/about" },
  { label: "المتاجر", path: "/stores" },
  { label: "الخريطة", path: "/map" },
  { label: "التأجير", path: "/leasing" },
  { label: "يوم الافتتاح", path: "/opening-day" },
  { label: "السوق قريباً", path: "/#marketplace" },
  { label: "العروض اليومية", path: "/daily-deals" },
  { label: "المدونة", path: "/blog" },
  { label: "الوظائف", path: "/careers" },
  { label: "تواصل معنا", path: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => path !== "/#marketplace" && location.pathname === path;

  return (
    <header className="fixed top-0 right-0 left-0 z-50 glass">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link to="/" className="shrink-0">
          <BrandLogo subtitle="Premium technology destination" imageClassName="h-11 md:h-12" />
        </Link>

        <nav className="hidden xl:flex items-center gap-1 rounded-full border border-border/60 bg-background/35 px-2 py-2 backdrop-blur-sm">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                isActive(item.path)
                  ? "bg-card text-foreground shadow-[var(--shadow-soft)]"
                  : "text-muted-foreground hover:bg-card/80 hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/#marketplace">
            <Button variant="secondary" size="sm" className="mr-2 rounded-full px-4">
              <ShoppingBag className="h-4 w-4" />
              السوق قريباً
            </Button>
          </Link>
          <Link to="/spin-win">
            <Button variant="cta" size="sm" className="mr-2 rounded-full px-5">
              أدر واربح
            </Button>
          </Link>
        </nav>

        <button
          className="xl:hidden rounded-full border border-border/60 bg-card/70 p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden glass border-t border-border/70"
          >
            <nav className="container py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-card text-foreground"
                      : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/spin-win" onClick={() => setMobileOpen(false)}>
                <Button variant="cta" className="mt-2 w-full rounded-2xl">
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
