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
        paddingTop: "clamp(14px, 1.8vw, 24px)",
        paddingBottom: "clamp(14px, 1.8vw, 24px)",
      }}
    >
      <div className="container">
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-3 md:grid-cols-6">
          {ACTIONS.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex flex-col items-center gap-1.5 rounded-lg p-2 md:p-2.5 transition-all duration-200 hover:bg-white/[0.06]"
              style={{ border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                style={{ background: `${action.color}10`, border: `1px solid ${action.color}18` }}
              >
                <action.icon className="h-4 w-4" style={{ color: action.color }} />
              </div>
              <div className="text-center">
                <span className="block text-[0.64rem] md:text-[0.68rem] font-bold leading-tight" style={{ color: "#E2E8F0" }}>
                  {action.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
