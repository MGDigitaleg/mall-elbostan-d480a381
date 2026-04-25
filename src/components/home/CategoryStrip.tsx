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
        background: "linear-gradient(180deg, #071326 0%, #0D1A30 100%)",
        paddingTop: "clamp(18px, 2.4vw, 32px)",
        paddingBottom: "clamp(18px, 2.4vw, 32px)",
        minHeight: 220,
      }}
    >
      <div className="container">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[0.78rem] font-bold" style={{ color: "#E2E8F0" }}>
                أقسام المول — كمبيوتر، موبايلات، جيمنج، وأكثر
              </h2>
              <p className="text-[0.58rem] mt-0.5" style={{ color: "#64748B" }}>
                تصفّح المحلات حسب التخصص
              </p>
            </div>
            <Link
              to="/stores"
              className="text-[0.66rem] font-semibold transition-colors hover:opacity-80"
              style={{ color: "#60A5FA" }}
            >
              جميع المحلات
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-4 md:grid-cols-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/stores?category=${encodeURIComponent(cat.slug)}`}
                className="group flex flex-col items-center gap-1.5 rounded-lg p-2 transition-all duration-200 hover:bg-white/[0.06]"
                style={{ border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                  style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)" }}
                >
                  <cat.icon className="h-4 w-4" style={{ color: "#60A5FA" }} />
                </div>
                <span
                  className="text-center text-[0.58rem] md:text-[0.62rem] font-semibold leading-tight line-clamp-2"
                  style={{ color: "#CBD5E1" }}
                >
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
