import { Link, useLocation } from "react-router-dom";
import { Home, Store, Compass, ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";
import { HeaderMenuSheet } from "@/components/layout/HeaderMenuSheet";

const items = [
  { label: "الرئيسية", path: "/", icon: Home },
  { label: "المحلات", path: "/stores", icon: Store },
  { label: "الخريطة", path: "/map", icon: Compass },
  { label: "المنتجات", path: "/products", icon: ShoppingBag },
];

/**
 * Fixed bottom nav for mobile only. Hidden on md+ screens.
 * Provides native-app feel with primary destinations always reachable.
 */
export function MobileBottomNav() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav
      className="fixed bottom-0 right-0 left-0 z-40 md:hidden"
      style={{
        background: "hsl(var(--card) / 0.96)",
        borderTop: "1px solid hsl(var(--border) / 0.6)",
        boxShadow: "0 -4px 16px hsl(218 72% 9% / 0.06)",
        paddingBottom: "env(safe-area-inset-bottom)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      aria-label="تنقل سفلي"
    >
      <div className="grid grid-cols-5 gap-0">
        {items.map((it) => {
          const active = isActive(it.path);
          const Icon = it.icon;
          return (
            <Link
              key={it.path}
              to={it.path}
              className="flex flex-col items-center justify-center gap-0.5 transition-colors"
              style={{
                minHeight: 56,
                color: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
              }}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 1.8} />
              <span className="text-[0.62rem]" style={{ fontWeight: active ? 700 : 500 }}>
                {it.label}
              </span>
            </Link>
          );
        })}

        <HeaderMenuSheet
          isActive={isActive}
          trigger={
            <button
              className="flex flex-col items-center justify-center gap-0.5 transition-colors"
              style={{
                minHeight: 56,
                color: "hsl(var(--muted-foreground))",
              }}
              aria-label="القائمة"
            >
              <Menu className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <span className="text-[0.62rem]" style={{ fontWeight: 500 }}>
                القائمة
              </span>
            </button>
          }
        />
      </div>
    </nav>
  );
}
