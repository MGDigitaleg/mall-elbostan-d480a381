import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Gift, Store, Layers, Tag, Calendar, Compass, ArrowLeft, X,
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

const MODE_META: Record<AtriumMode, { icon: typeof Gift; label: string }> = {
  spin:       { icon: Gift,     label: "المكافآت" },
  offers:     { icon: Tag,      label: "العروض" },
  featured:   { icon: Store,    label: "متاجر مميّزة" },
  events:     { icon: Calendar, label: "الفعاليات" },
  categories: { icon: Layers,   label: "الفئات" },
  campaign:   { icon: Compass,  label: "الحملة" },
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
            className="fixed inset-x-4 top-[6vh] z-50 mx-auto max-w-[520px] max-h-[88vh] overflow-hidden rounded-2xl bg-card md:inset-x-auto"
            style={{ border: "1px solid hsl(var(--border))", boxShadow: "0 20px 60px hsl(222 36% 6% / 0.3), 0 4px 16px hsl(222 36% 6% / 0.15)" }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Header — branded, not generic */}
            <div className="px-6 pb-3 pt-5" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "hsl(222 58% 42% / 0.08)", border: "1px solid hsl(222 58% 42% / 0.12)" }}>
                  <Compass className="h-5 w-5" style={{ color: "hsl(222 58% 42%)" }} />
                </div>
                <div>
                  <h2 className="text-[0.95rem] font-bold text-foreground">مركز التفاعل</h2>
                  <p className="text-[0.72rem] text-muted-foreground">قلب المول — عروض ومكافآت ومتاجر</p>
                </div>
              </div>
            </div>

            {/* Tab bar — refined, compact */}
            <div className="flex gap-0.5 overflow-x-auto px-4 py-2 scrollbar-hide" style={{ borderBottom: "1px solid hsl(var(--border))", background: "hsl(var(--secondary) / 0.3)" }}>
              {tabs.map((tab) => {
                const meta = MODE_META[tab];
                const Icon = meta.icon;
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold transition-all ${
                      isActive
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={isActive ? { border: "1px solid hsl(var(--border))" } : undefined}
                  >
                    <Icon className="h-3 w-3" />
                    {meta.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-5" style={{ maxHeight: "calc(88vh - 160px)" }}>

              {/* ── SPIN — premium engagement, not casino ── */}
              {activeTab === "spin" && (
                <div className="space-y-5">
                  <div className="rounded-xl p-5" style={{ background: "hsl(222 36% 96%)", border: "1px solid hsl(222 30% 90%)" }}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "hsl(222 58% 42% / 0.1)" }}>
                        <Gift className="h-5 w-5" style={{ color: "hsl(222 58% 42%)" }} />
                      </div>
                      <div>
                        <h3 className="text-[0.92rem] font-bold text-foreground">مكافآت مول البستان</h3>
                        <p className="text-[0.75rem] text-muted-foreground">خصومات وهدايا من متاجر حقيقية</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[0.82rem] leading-7 text-muted-foreground">
                      سجّل بياناتك وأدر عجلة المكافآت. الجوائز مقدّمة من متاجر المول وترتبط بموقعها على الخريطة.
                    </p>
                  </div>

                  {/* Benefits — clean, not flashy */}
                  <div className="space-y-1.5">
                    {[
                      "خصومات مباشرة من متاجر المول",
                      "هدايا وإكسسوارات مجانية",
                      "المكافأة مرتبطة بموقع المتجر على الخريطة",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.78rem]" style={{ background: "hsl(var(--secondary) / 0.4)" }}>
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "hsl(222 58% 42%)" }} />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="cta"
                    className="h-11 w-full rounded-xl text-[0.88rem] font-bold"
                    onClick={() => { onClose(); onOpenSpinWheel(); }}
                  >
                    سجّل وابدأ
                  </Button>
                  <p className="text-center text-[0.68rem] text-muted-foreground">مشاركة واحدة لكل رقم هاتف — الاستلام يوم الافتتاح</p>
                </div>
              )}

              {/* ── OFFERS ── */}
              {activeTab === "offers" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[0.92rem] font-bold text-foreground">عروض اليوم</h3>
                    <p className="mt-0.5 text-[0.75rem] text-muted-foreground">أحدث الخصومات من متاجر المول</p>
                  </div>
                  {deals && deals.length > 0 ? (
                    <div className="space-y-2">
                      {deals.map((deal) => (
                        <div key={deal.id} className="rounded-xl p-3.5" style={{ background: "hsl(var(--secondary) / 0.4)", border: "1px solid hsl(var(--border))" }}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[0.82rem] font-bold text-foreground">{deal.title_ar}</p>
                              {deal.description_ar && (
                                <p className="mt-1 text-[0.72rem] leading-5 text-muted-foreground">{deal.description_ar}</p>
                              )}
                            </div>
                            {deal.promo_code && (
                              <span className="shrink-0 rounded-md px-2 py-0.5 font-poppins text-[0.68rem] font-bold" style={{ background: "hsl(222 58% 42% / 0.08)", color: "hsl(222 58% 42%)", border: "1px solid hsl(222 58% 42% / 0.15)" }}>
                                {deal.promo_code}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-6 text-center">
                      <Tag className="mx-auto h-6 w-6 text-muted-foreground/30" />
                      <p className="mt-2 text-[0.78rem] text-muted-foreground">العروض ستتوفر قريبًا مع افتتاح المول</p>
                    </div>
                  )}
                  <Link to="/daily-deals" className="block">
                    <Button variant="outline-blue" className="h-9 w-full rounded-xl text-[0.8rem]">
                      جميع العروض <ArrowLeft className="mr-1.5 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* ── FEATURED ── */}
              {activeTab === "featured" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[0.92rem] font-bold text-foreground">متاجر مميّزة</h3>
                    <p className="mt-0.5 text-[0.75rem] text-muted-foreground">أبرز العلامات في المول</p>
                  </div>
                  {featuredStores && featuredStores.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {featuredStores.map((store) => (
                        <Link
                          key={store.id}
                          to={`/stores/${store.slug}`}
                          className="rounded-xl p-3 transition-colors hover:bg-secondary/60"
                          style={{ background: "hsl(var(--secondary) / 0.4)", border: "1px solid hsl(var(--border))" }}
                        >
                          <p className="text-[0.8rem] font-bold text-foreground">{store.name_ar}</p>
                          {store.unit_code && (
                            <p className="mt-0.5 font-poppins text-[0.68rem] text-muted-foreground">{store.unit_code}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-6 text-center">
                      <Store className="mx-auto h-6 w-6 text-muted-foreground/30" />
                      <p className="mt-2 text-[0.78rem] text-muted-foreground">المتاجر المميزة ستظهر هنا قريبًا</p>
                    </div>
                  )}
                  <Link to="/stores" className="block">
                    <Button variant="outline-blue" className="h-9 w-full rounded-xl text-[0.8rem]">
                      جميع المتاجر <ArrowLeft className="mr-1.5 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* ── EVENTS ── */}
              {activeTab === "events" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[0.92rem] font-bold text-foreground">فعاليات قادمة</h3>
                    <p className="mt-0.5 text-[0.75rem] text-muted-foreground">أحداث مميزة في مول البستان</p>
                  </div>
                  {events && events.length > 0 ? (
                    <div className="space-y-2">
                      {events.map((event) => (
                        <div key={event.id} className="flex items-center gap-3 rounded-xl p-3.5" style={{ background: "hsl(var(--secondary) / 0.4)", border: "1px solid hsl(var(--border))" }}>
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "hsl(222 58% 42% / 0.08)" }}>
                            <Calendar className="h-4 w-4" style={{ color: "hsl(222 58% 42%)" }} />
                          </div>
                          <div>
                            <p className="text-[0.8rem] font-bold text-foreground">{event.title_ar}</p>
                            {event.event_date && (
                              <p className="mt-0.5 font-poppins text-[0.7rem] text-muted-foreground" dir="ltr">
                                {new Date(event.event_date).toLocaleDateString("ar-EG", { day: "numeric", month: "long" })}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-6 text-center">
                      <Calendar className="mx-auto h-6 w-6 text-muted-foreground/30" />
                      <p className="mt-2 text-[0.78rem] text-muted-foreground">الفعاليات ستُعلن قريبًا</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── CATEGORIES ── */}
              {activeTab === "categories" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[0.92rem] font-bold text-foreground">اكتشف حسب الفئة</h3>
                    <p className="mt-0.5 text-[0.75rem] text-muted-foreground">اختر فئة لتمييز متاجرها على الخريطة</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {allCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { onClose(); onFilterCategory(cat); }}
                        className="group rounded-xl p-3.5 text-right transition-all"
                        style={{ background: "hsl(var(--secondary) / 0.4)", border: "1px solid hsl(var(--border))" }}
                      >
                        <p className="text-[0.8rem] font-bold text-foreground">{categoryLabelsAr[cat]}</p>
                        <p className="mt-1 text-[0.68rem] text-muted-foreground group-hover:text-primary transition-colors">عرض على الخريطة</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
