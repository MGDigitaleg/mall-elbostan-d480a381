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
import { motion } from "framer-motion";

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

const sectionReveal = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export function CategoryStrip() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #071326 0%, #0D1A30 100%)",
        paddingTop: "clamp(28px, 3.5vw, 48px)",
        paddingBottom: "clamp(28px, 3.5vw, 48px)",
      }}
    >
      <div className="container">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[0.82rem] font-bold" style={{ color: "#E2E8F0" }}>
              تصفّح حسب الفئة
            </h2>
            <Link
              to="/products"
              className="text-[0.7rem] font-semibold transition-colors hover:opacity-80"
              style={{ color: "#60A5FA" }}
            >
              جميع الفئات
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 md:grid-cols-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/stores?category=${encodeURIComponent(cat.slug)}`}
                className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-200 hover:bg-white/[0.06]"
                style={{ border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                  style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)" }}
                >
                  <cat.icon className="h-4.5 w-4.5" style={{ color: "#60A5FA" }} />
                </div>
                <span
                  className="text-center text-[0.6rem] md:text-[0.64rem] font-semibold leading-tight line-clamp-2"
                  style={{ color: "#CBD5E1" }}
                >
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
