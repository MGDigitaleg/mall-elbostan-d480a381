import { Link } from "react-router-dom";
import { Compass, Store, MapPin, Tag, ShoppingBag } from "lucide-react";

const ACTIONS = [
  { icon: Compass, label: "الخريطة", to: "/map", color: "#2563EB" },
  { icon: Store, label: "دليل المحلات", to: "/stores", color: "#06B6D4" },
  { icon: ShoppingBag, label: "المنتجات", to: "/products", color: "#10B981" },
  { icon: Tag, label: "العروض", to: "/daily-deals", color: "#8B5CF6" },
  { icon: MapPin, label: "الوصول", to: "/new-cairo-branch", color: "#EC4899" },
];

export function QuickActions() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #071326 0%, #0D1A30 100%)",
        paddingTop: "clamp(10px, 1.4vw, 18px)",
        paddingBottom: "clamp(10px, 1.4vw, 18px)",
        minHeight: 78,
        contain: "layout",
      }}
    >
      <div className="container">
        <div className="grid grid-cols-5 gap-1.5 md:gap-2">
          {ACTIONS.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex flex-col items-center gap-1 rounded-lg p-1.5 md:p-2 transition-all duration-200 hover:bg-white/[0.06]"
              style={{ border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div
                className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                style={{ background: `${action.color}10`, border: `1px solid ${action.color}18` }}
              >
                <action.icon className="h-3.5 w-3.5 md:h-4 md:w-4" style={{ color: action.color }} />
              </div>
              <span className="block text-center text-[0.6rem] md:text-[0.66rem] font-bold leading-tight" style={{ color: "#E2E8F0" }}>
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
