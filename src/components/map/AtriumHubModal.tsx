import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Gift, Store, Layers, Tag, Calendar, Compass, ArrowLeft, X,
  Smartphone, Monitor, Gamepad2, Printer, Wrench, Shield,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import type { MallCategory } from "@/lib/mallFloorGeometry";
import { categoryLabelsAr } from "@/lib/mallFloorGeometry";

/* ─────────────────────── Types ─────────────────────── */

export type AtriumMode =
  | "spin"
  | "offers"
  | "featured"
  | "events"
  | "categories"
  | "campaign";

export type AtriumConfig = {
  mode: AtriumMode;
  label: string;
  pulseColor?: string;
};

const MODE_META: Record<AtriumMode, { icon: typeof Gift; label: string; desc: string }> = {
  spin:       { icon: Gift,     label: "المكافآت",      desc: "خصومات وهدايا حقيقية" },
  offers:     { icon: Tag,      label: "العروض",        desc: "أحدث خصومات المتاجر" },
  featured:   { icon: Store,    label: "متاجر مميّزة",  desc: "أبرز العلامات" },
  events:     { icon: Calendar, label: "الفعاليات",     desc: "أحداث قادمة" },
  categories: { icon: Layers,   label: "الفئات",        desc: "استكشف حسب التخصص" },
  campaign:   { icon: Compass,  label: "الحملة",        desc: "حملة الافتتاح" },
};

const CATEGORY_ICONS: Record<string, typeof Smartphone> = {
  "Accessories": Smartphone,
  "Laptops": Monitor,
  "Components": Gamepad2,
  "Networking": Shield,
  "Maintenance": Wrench,
  "Security Systems": Printer,
};

export const DEFAULT_ATRIUM_CONFIG: AtriumConfig = {
  mode: "spin",
  label: "مركز التفاعل",
};

/* ─────────────────────── Hub Modal ─────────────────────── */

type Props = {
  open: boolean;
  onClose: () => void;
  config: AtriumConfig;
  onOpenSpinWheel: () => void;
  onFilterCategory: (cat: MallCategory) => void;
};

export function AtriumHubModal({ open, onClose, config, onOpenSpinWheel, onFilterCategory }: Props) {
  const [activeTab, setActiveTab] = useState<AtriumMode>(config.mode);

  const { data: deals } = useQuery({
    queryKey: ["hub-deals"],
    queryFn: async () => {
      const { data } = await supabase
        .from("deals")
        .select("id, title_ar, description_ar, promo_code, stores:store_id(name_ar)")
        .eq("is_live", true)
        .limit(4);
      return data ?? [];
    },
    enabled: open,
  });

  const { data: featuredStores } = useQuery({
    queryKey: ["hub-featured-stores"],
    queryFn: async () => {
      const { data } = await supabase
        .from("stores")
        .select("id, name_ar, category, unit_code, slug")
        .eq("featured", true)
        .eq("status", "leased")
        .limit(6);
      return data ?? [];
    },
    enabled: open,
  });

  const { data: events } = useQuery({
    queryKey: ["hub-events"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("id, title_ar, event_date, category")
        .eq("featured", true)
        .limit(4);
      return data ?? [];
    },
    enabled: open,
  });

  if (!open) return null;

  const tabs: AtriumMode[] = ["spin", "offers", "featured", "events", "categories"];
  const allCategories: MallCategory[] = [
    "Accessories", "Laptops", "Components", "Networking", "Maintenance", "Security Systems",
  ];
  const activeMeta = MODE_META[activeTab];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: "hsl(222 36% 6% / 0.7)", backdropFilter: "blur(6px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[5vh] z-50 mx-auto max-w-[540px] max-h-[90vh] overflow-hidden rounded-2xl bg-card md:inset-x-auto"
            style={{ border: "1px solid hsl(var(--border))", boxShadow: "0 24px 64px hsl(222 36% 6% / 0.28), 0 4px 20px hsl(222 36% 6% / 0.12)" }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* ── Header — branded command center ── */}
            <div className="relative px-6 pb-4 pt-5" style={{ background: "hsl(var(--primary) / 0.03)", borderBottom: "1px solid hsl(var(--border))" }}>
              {/* Decorative line */}
              <div className="mb-3 flex items-center gap-2.5">
                <div className="h-[3px] w-8 rounded-full" style={{ background: "hsl(var(--heritage))" }} />
                <span className="font-poppins text-[0.62rem] font-bold uppercase tracking-[0.22em]" style={{ color: "hsl(var(--heritage))" }}>
                  Engagement Hub
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card" style={{ boxShadow: "var(--shadow-soft)" }}>
                  <Compass className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-[1rem] font-extrabold light-heading">مركز التفاعل</h2>
                  <p className="text-[0.74rem] light-muted">قلب المول — عروض ومكافآت ومتاجر واكتشاف</p>
                </div>
              </div>
            </div>

            {/* ── Tab bar — refined chips ── */}
            <div className="flex gap-1 overflow-x-auto px-5 py-2.5 scrollbar-hide" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
              {tabs.map((tab) => {
                const meta = MODE_META[tab];
                const Icon = meta.icon;
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-[0.74rem] font-bold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {meta.label}
                  </button>
                );
              })}
            </div>

            {/* ── Content ── */}
            <div className="overflow-y-auto p-5" style={{ maxHeight: "calc(90vh - 170px)" }}>

              {/* Section title — dynamic per tab */}
              <div className="mb-4">
                <h3 className="text-[0.92rem] font-bold light-heading">{activeMeta.label}</h3>
                <p className="mt-0.5 text-[0.74rem] light-muted">{activeMeta.desc}</p>
              </div>

              {/* ── SPIN — premium activation, not casino ── */}
              {activeTab === "spin" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border p-4" style={{ background: "hsl(var(--secondary) / 0.3)" }}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
                        <Gift className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[0.84rem] font-bold light-heading">مكافآت من متاجر المول</p>
                        <p className="mt-1 text-[0.78rem] leading-6 light-body">
                          خصومات وهدايا مقدّمة من علامات حقيقية داخل المول. بعد الفوز، يظهر موقع المتجر مباشرة على الخريطة.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Value props — editorial, not listy */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "خصومات مباشرة", sub: "من المتاجر" },
                      { label: "هدايا حقيقية", sub: "إكسسوارات ومنتجات" },
                      { label: "مرتبط بالخريطة", sub: "اعرف المكان فوراً" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg border border-border bg-card p-3 text-center">
                        <p className="text-[0.76rem] font-bold light-heading">{item.label}</p>
                        <p className="mt-0.5 text-[0.66rem] light-muted">{item.sub}</p>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="cta"
                    className="h-11 w-full rounded-xl text-[0.88rem] font-bold"
                    onClick={() => { onClose(); onOpenSpinWheel(); }}
                  >
                    سجّل واحصل على مكافأتك
                  </Button>
                  <p className="text-center text-[0.68rem] light-muted">مشاركة واحدة لكل رقم هاتف — الاستلام يوم الافتتاح</p>
                </div>
              )}

              {/* ── OFFERS ── */}
              {activeTab === "offers" && (
                <div className="space-y-3">
                  {deals && deals.length > 0 ? (
                    deals.map((deal) => (
                      <div key={deal.id} className="rounded-xl border border-border p-4 transition-colors hover:bg-secondary/20">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[0.84rem] font-bold light-heading">{deal.title_ar}</p>
                            {deal.description_ar && (
                              <p className="mt-1 text-[0.76rem] leading-6 light-body">{deal.description_ar}</p>
                            )}
                          </div>
                          {deal.promo_code && (
                            <span className="shrink-0 rounded-md border border-border bg-secondary px-2.5 py-1 font-poppins text-[0.7rem] font-bold light-heading">
                              {deal.promo_code}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState icon={Tag} text="العروض ستتوفر قريباً مع افتتاح المول" />
                  )}
                  <Link to="/daily-deals" className="block">
                    <Button variant="outline-blue" className="h-9 w-full rounded-xl text-[0.82rem] font-bold">
                      جميع العروض <ArrowLeft className="mr-1.5 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* ── FEATURED ── */}
              {activeTab === "featured" && (
                <div className="space-y-3">
                  {featuredStores && featuredStores.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {featuredStores.map((store) => (
                        <Link
                          key={store.id}
                          to={`/stores/${store.slug}`}
                          className="group rounded-xl border border-border p-3.5 transition-all hover:border-primary/20 hover:shadow-sm"
                        >
                          <p className="text-[0.84rem] font-bold light-heading">{store.name_ar}</p>
                          {store.unit_code && (
                            <p className="mt-1 font-poppins text-[0.7rem] light-muted">{store.unit_code}</p>
                          )}
                          <p className="mt-1.5 text-[0.68rem] font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            عرض التفاصيل
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={Store} text="المتاجر المميزة ستظهر هنا قريباً" />
                  )}
                  <Link to="/stores" className="block">
                    <Button variant="outline-blue" className="h-9 w-full rounded-xl text-[0.82rem] font-bold">
                      جميع المتاجر <ArrowLeft className="mr-1.5 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* ── EVENTS ── */}
              {activeTab === "events" && (
                <div className="space-y-3">
                  {events && events.length > 0 ? (
                    events.map((event) => (
                      <div key={event.id} className="flex items-center gap-3 rounded-xl border border-border p-3.5 transition-colors hover:bg-secondary/20">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[0.84rem] font-bold light-heading">{event.title_ar}</p>
                          {event.event_date && (
                            <p className="mt-0.5 font-poppins text-[0.72rem] light-muted" dir="ltr">
                              {new Date(event.event_date).toLocaleDateString("ar-EG", { day: "numeric", month: "long" })}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState icon={Calendar} text="الفعاليات ستُعلن قريباً" />
                  )}
                </div>
              )}

              {/* ── CATEGORIES — premium discovery grid ── */}
              {activeTab === "categories" && (
                <div className="grid grid-cols-2 gap-2">
                  {allCategories.map((cat) => {
                    const CatIcon = CATEGORY_ICONS[cat] ?? Layers;
                    return (
                      <button
                        key={cat}
                        onClick={() => { onClose(); onFilterCategory(cat); }}
                        className="group rounded-xl border border-border p-4 text-right transition-all hover:border-primary/20 hover:shadow-sm"
                      >
                        <CatIcon className="h-4 w-4 text-primary mb-2" />
                        <p className="text-[0.84rem] font-bold light-heading">{categoryLabelsAr[cat]}</p>
                        <p className="mt-1 text-[0.68rem] font-semibold light-muted group-hover:text-primary transition-colors">
                          عرض على الخريطة
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Reusable empty state ── */
function EmptyState({ icon: Icon, text }: { icon: typeof Gift; text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary">
        <Icon className="h-4.5 w-4.5 text-muted-foreground/40" />
      </div>
      <p className="mt-3 text-[0.8rem] light-muted">{text}</p>
    </div>
  );
}
