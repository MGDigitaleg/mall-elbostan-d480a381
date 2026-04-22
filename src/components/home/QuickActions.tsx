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
        background: "linear-gradient(180deg, #071326 0%, #0D1A30 100%)",
        paddingTop: "clamp(24px, 3vw, 40px)",
        paddingBottom: "clamp(24px, 3vw, 40px)",
      }}
    >
      <div className="container">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {ACTIONS.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex flex-col items-center gap-2 rounded-xl p-3 md:p-4 transition-all duration-200 hover:bg-white/[0.06]"
              style={{ border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                style={{ background: `${action.color}10`, border: `1px solid ${action.color}18` }}
              >
                <action.icon className="h-4.5 w-4.5" style={{ color: action.color }} />
              </div>
              <div className="text-center">
                <span className="block text-[0.68rem] md:text-[0.72rem] font-bold leading-tight" style={{ color: "#E2E8F0" }}>
                  {action.label}
                </span>
                <span className="hidden md:block text-[0.56rem] font-medium leading-tight mt-0.5" style={{ color: "#64748B" }}>
                  {action.desc}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
