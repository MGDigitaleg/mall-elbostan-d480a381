import { Link } from "react-router-dom";
import {
  Smartphone,
  Monitor,
  Gamepad2,
  Network,
  Printer,
  Wrench,
  Cpu,
  MonitorSmartphone,
  type LucideIcon,
} from "lucide-react";

const CATEGORIES: { label: string; icon: LucideIcon; slug: string }[] = [
  { label: "الهواتف والإكسسوارات", icon: Smartphone, slug: "الهواتف والإكسسوارات" },
  { label: "الكمبيوتر والأجهزة", icon: Monitor, slug: "الكمبيوتر والأجهزة" },
  { label: "الألعاب والترفيه", icon: Gamepad2, slug: "الألعاب والترفيه" },
  { label: "الشبكات والأنظمة الأمنية", icon: Network, slug: "الشبكات والأنظمة الأمنية" },
  { label: "الطباعة والتصوير", icon: Printer, slug: "الطباعة والتصوير" },
  { label: "الصيانة والدعم الفني", icon: Wrench, slug: "الصيانة والدعم الفني" },
  { label: "المكونات والتجميع", icon: Cpu, slug: "المكونات والتجميع" },
  { label: "الشاشات", icon: MonitorSmartphone, slug: "الشاشات" },
];

export function CategoryStrip() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #071326 0%, #0B1930 50%, #0D1A30 100%)",
        paddingTop: "clamp(36px, 4.5vw, 64px)",
        paddingBottom: "clamp(36px, 4.5vw, 64px)",
        minHeight: 296,
      }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[500px] rounded-full opacity-[0.025]" style={{ background: "radial-gradient(ellipse, #2563EB, transparent 70%)" }} />
      </div>

      <div className="container relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[0.6rem] font-bold tracking-[0.24em] uppercase mb-1.5" style={{ color: "#60A5FA" }}>الأقسام</p>
            <h2 className="text-[0.92rem] md:text-[1rem] font-bold" style={{ color: "#F1F5F9", letterSpacing: "-0.015em" }}>
              تصفّح حسب الفئة
            </h2>
          </div>
          <Link
            to="/products"
            className="text-[0.72rem] font-semibold transition-colors hover:opacity-80"
            style={{ color: "#60A5FA" }}
          >
            جميع الفئات
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-4 md:grid-cols-8 md:gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/stores?category=${encodeURIComponent(cat.slug)}`}
              className="group flex flex-col items-center gap-2.5 rounded-2xl p-3.5 md:p-4 transition-all duration-300 hover:bg-white/[0.06]"
              style={{ border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "rgba(37,99,235,0.07)",
                  border: "1px solid rgba(37,99,235,0.12)",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.05)",
                }}
              >
                <cat.icon className="h-5 w-5" style={{ color: "#60A5FA" }} />
              </div>
              <span
                className="text-center text-[0.62rem] md:text-[0.66rem] font-semibold leading-tight line-clamp-2"
                style={{ color: "#CBD5E1" }}
              >
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
