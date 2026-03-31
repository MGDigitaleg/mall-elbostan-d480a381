import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "الرئيسية", path: "/" },
  { label: "المتاجر", path: "/stores" },
  { label: "الخريطة", path: "/map" },
  { label: "التأجير", path: "/leasing" },
  { label: "يوم الافتتاح", path: "/opening-day" },
  { label: "المدونة", path: "/blog" },
  { label: "الوظائف", path: "/careers" },
  { label: "تواصل معنا", path: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 glass">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gradient-gold tracking-tight">
          مول البستان
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === item.path
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/spin-win">
            <Button size="sm" className="bg-gradient-gold text-primary-foreground font-bold mr-2 hover:opacity-90">
              🎡 العجلة
            </Button>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-border"
          >
            <nav className="container py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/spin-win" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-gradient-gold text-primary-foreground font-bold mt-2">
                  🎡 العجلة
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
