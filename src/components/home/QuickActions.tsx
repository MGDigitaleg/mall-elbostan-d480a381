import { Link } from "react-router-dom";
import { Compass, Store, MapPin, Sparkles, Building, ShoppingBag } from "lucide-react";

const ACTIONS = [
  { icon: Compass, label: "الخريطة التفاعلية", desc: "اكتشف المول بالتفصيل", to: "/map", color: "#2563EB" },
  { icon: Store, label: "دليل المحلات", desc: "تصفّح جميع المحلات", to: "/stores", color: "#06B6D4" },
  { icon: Building, label: "وحدات متاحة", desc: "استثمر في موقع مميز", to: "/leasing", color: "#F97316" },
  { icon: ShoppingBag, label: "المنتجات", desc: "تصفّح أحدث المنتجات", to: "/products", color: "#10B981" },
  { icon: Sparkles, label: "أدر واربح", desc: "جوائز يوم الافتتاح", to: "/spin-win", color: "#8B5CF6" },
  { icon: MapPin, label: "الوصول للمول", desc: "طريقك إلينا", to: "/new-cairo-branch", color: "#EC4899" },
];

export function QuickActions() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #050E1C 0%, #0A1628 50%, #0D1A30 100%)",
        paddingTop: "clamp(32px, 4vw, 56px)",
        paddingBottom: "clamp(32px, 4vw, 56px)",
      }}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent 10%, rgba(37,99,235,0.2) 50%, transparent 90%)" }} />

      <div className="container">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
          {ACTIONS.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex flex-col items-center gap-2.5 rounded-2xl p-4 md:p-5 transition-all duration-300 hover:bg-white/[0.05]"
              style={{ border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                style={{
                  background: `${action.color}0D`,
                  border: `1px solid ${action.color}1A`,
                  boxShadow: `0 4px 16px ${action.color}08`,
                }}
              >
                <action.icon className="h-5 w-5" style={{ color: action.color }} />
              </div>
              <div className="text-center">
                <span className="block text-[0.72rem] md:text-[0.76rem] font-bold leading-tight" style={{ color: "#E2E8F0", letterSpacing: "-0.01em" }}>
                  {action.label}
                </span>
                <span className="hidden md:block text-[0.6rem] font-medium leading-tight mt-1" style={{ color: "#64748B" }}>
                  {action.desc}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent 10%, rgba(205,187,154,0.12) 50%, transparent 90%)" }} />
    </section>
  );
}
