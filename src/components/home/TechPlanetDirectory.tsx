import { Link } from "react-router-dom";
import {
  Smartphone, Monitor, Gamepad2, Wifi, Printer, Wrench, ArrowLeft, Store,
  type LucideIcon,
} from "lucide-react";
import { CAT } from "@/lib/deviceCatalog";

type DirectoryItem = {
  category: string;
  label: string;
  description: string;
  Icon: LucideIcon;
  accent: string;
};

// Mirrors the canonical mall taxonomy in deviceCatalog.CAT so this stays in sync
// with the rest of the platform (header nav, /stores filters, SEO content).
const ITEMS: DirectoryItem[] = [
  {
    category: CAT.phones,
    label: "الهواتف والإكسسوارات",
    description: "موبايلات، سماعات، شواحن وحماية",
    Icon: Smartphone,
    accent: "#3B82F6",
  },
  {
    category: CAT.computers,
    label: "الكمبيوتر والأجهزة",
    description: "لابتوبات، شاشات، قطع وملحقات",
    Icon: Monitor,
    accent: "#8B5CF6",
  },
  {
    category: CAT.gaming,
    label: "الألعاب والترفيه",
    description: "كونسولات، ذراعات وإكسسوارات",
    Icon: Gamepad2,
    accent: "#EC4899",
  },
  {
    category: CAT.networking,
    label: "الشبكات والحماية",
    description: "راوترات، كاميرات وأنظمة أمن",
    Icon: Wifi,
    accent: "#10B981",
  },
  {
    category: CAT.printing,
    label: "الطباعة والتصوير",
    description: "طابعات، ماسحات وكاميرات",
    Icon: Printer,
    accent: "#F59E0B",
  },
  {
    category: CAT.maintenance,
    label: "الصيانة والدعم الفني",
    description: "إصلاح، ترقية وضمان معتمد",
    Icon: Wrench,
    accent: "#06B6D4",
  },
];

export const TechPlanetDirectory = () => {
  return (
    <div
      dir="rtl"
      className="mx-auto mt-8 w-full max-w-5xl rounded-2xl border p-5 backdrop-blur-md sm:p-6"
      style={{
        borderColor: "rgba(205,187,154,0.22)",
        background: "rgba(7,19,38,0.55)",
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p
            className="font-arabic text-[0.7rem] tracking-[0.18em]"
            style={{ color: "#FCD34D" }}
          >
            دليل المحلات
          </p>
          <h3
            className="mt-1 font-arabic-display text-[0.95rem] font-bold text-white sm:text-[1.05rem]"
          >
            تصفّح المحلات حسب القسم
          </h3>
        </div>
        <Link
          to="/stores"
          className="hidden items-center gap-1 font-arabic text-[0.78rem] font-bold transition-colors hover:opacity-80 sm:inline-flex"
          style={{ color: "#7DD3FC" }}
        >
          <Store className="h-3.5 w-3.5" />
          الدليل الكامل
          <ArrowLeft className="h-3 w-3" />
        </Link>
      </div>

      {/* Grid */}
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {ITEMS.map(({ category, label, description, Icon, accent }) => (
          <li key={category}>
            <Link
              to={`/stores?category=${encodeURIComponent(category)}`}
              className="group flex h-full items-center gap-3 rounded-xl border bg-white/[0.03] px-3 py-3 transition-all hover:-translate-y-0.5 hover:bg-white/[0.07]"
              style={{ borderColor: "rgba(205,187,154,0.18)" }}
            >
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all"
                style={{
                  background: `${accent}1A`,
                  border: `1px solid ${accent}40`,
                  color: accent,
                  boxShadow: `0 0 0 0 ${accent}55`,
                }}
              >
                <Icon size={18} strokeWidth={1.7} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-arabic-display text-[0.85rem] font-bold text-white">
                  {label}
                </span>
                <span
                  className="truncate font-arabic text-[0.7rem]"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {description}
                </span>
              </span>
              <ArrowLeft
                className="h-3.5 w-3.5 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-90"
                style={{ color: "#FCD34D" }}
              />
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile full-directory CTA */}
      <Link
        to="/stores"
        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full border px-4 py-2 font-arabic text-[0.78rem] font-bold transition-all hover:bg-white/10 sm:hidden"
        style={{
          borderColor: "rgba(125,211,252,0.5)",
          color: "#7DD3FC",
          background: "rgba(125,211,252,0.06)",
        }}
      >
        <Store className="h-3.5 w-3.5" />
        فتح الدليل الكامل
        <ArrowLeft className="h-3 w-3" />
      </Link>
    </div>
  );
};
