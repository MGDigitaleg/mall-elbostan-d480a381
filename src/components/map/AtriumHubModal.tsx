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
  | "spin"       // spin & win
  | "offers"     // today's deals
  | "featured"   // featured stores
  | "events"     // upcoming events
  | "categories" // category discovery
  | "campaign";  // seasonal / custom campaign

export type AtriumConfig = {
  mode: AtriumMode;
  label: string;         // shown on hover in SVG
  pulseColor?: string;   // ring color override
};

const MODE_META: Record<AtriumMode, { icon: typeof Gift; label: string; color: string }> = {
  spin:       { icon: Gift,     label: "أدر واربح",           color: "hsl(221 83% 53%)" },
  offers:     { icon: Tag,      label: "عروض اليوم",          color: "hsl(25 95% 53%)" },
  featured:   { icon: Store,    label: "متاجر مميّزة",        color: "hsl(192 91% 36%)" },
  events:     { icon: Calendar, label: "فعاليات قادمة",       color: "hsl(262 83% 58%)" },
  categories: { icon: Layers,   label: "اكتشف الفئات",       color: "hsl(192 91% 42%)" },
  campaign:   { icon: Compass,  label: "حملة الافتتاح",      color: "hsl(221 83% 48%)" },
};

/* Default config — rotates through modes or sticks to a primary */
export const DEFAULT_ATRIUM_CONFIG: AtriumConfig = {
  mode: "spin",
  label: "اكتشف المكافآت",
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

  // Fetch live data for each tab
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[8vh] z-50 mx-auto max-w-[540px] max-h-[84vh] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)] md:inset-x-auto"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent px-6 pb-4 pt-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                <Compass className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mt-3 text-lg font-bold text-foreground">مركز الأتريوم</h2>
              <p className="mt-1 text-[0.78rem] text-muted-foreground">قلب مول البستان — اكتشف العروض والمكافآت والمتاجر</p>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 overflow-x-auto border-b border-border bg-secondary/20 px-4 py-2 scrollbar-hide">
              {tabs.map((tab) => {
                const meta = MODE_META[tab];
                const Icon = meta.icon;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[0.75rem] font-semibold transition-colors ${
                      activeTab === tab
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {meta.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="overflow-y-auto p-5" style={{ maxHeight: "calc(84vh - 220px)" }}>
              {/* ── SPIN ── */}
              {activeTab === "spin" && (
                <div className="text-center">
                  <Gift className="mx-auto h-10 w-10 text-primary" />
                  <h3 className="mt-4 text-lg font-bold text-foreground">أدر العجلة واربح</h3>
                  <p className="mx-auto mt-2 max-w-xs text-[0.85rem] leading-7 text-muted-foreground">
                    سجّل بياناتك وأدر عجلة المكافآت للحصول على خصومات وهدايا حصرية من متاجر المول.
                  </p>
                  <Button
                    variant="cta"
                    className="mt-6 h-12 w-full rounded-xl font-bold"
                    onClick={() => { onClose(); onOpenSpinWheel(); }}
                  >
                    ابدأ الآن
                  </Button>
                  <p className="mt-2 text-[0.7rem] text-muted-foreground">مشاركة واحدة لكل رقم هاتف</p>
                </div>
              )}

              {/* ── OFFERS ── */}
              {activeTab === "offers" && (
                <div>
                  <h3 className="text-[0.95rem] font-bold text-foreground">عروض اليوم</h3>
                  <p className="mt-1 text-[0.78rem] text-muted-foreground">أحدث العروض والخصومات من متاجر المول</p>
                  {deals && deals.length > 0 ? (
                    <div className="mt-4 space-y-2.5">
                      {deals.map((deal) => (
                        <div key={deal.id} className="rounded-xl border border-border bg-secondary/30 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[0.85rem] font-bold text-foreground">{deal.title_ar}</p>
                              {deal.description_ar && (
                                <p className="mt-1 text-[0.75rem] leading-5 text-muted-foreground">{deal.description_ar}</p>
                              )}
                            </div>
                            {deal.promo_code && (
                              <span className="shrink-0 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 font-poppins text-[0.7rem] font-bold text-primary">
                                {deal.promo_code}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-center">
                      <Tag className="mx-auto h-8 w-8 text-muted-foreground/40" />
                      <p className="mt-3 text-[0.82rem] text-muted-foreground">العروض ستتوفر قريبًا مع افتتاح المول</p>
                    </div>
                  )}
                  <Link to="/daily-deals" className="mt-4 block">
                    <Button variant="outline-blue" className="h-10 w-full rounded-xl text-[0.82rem]">
                      جميع العروض
                      <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* ── FEATURED ── */}
              {activeTab === "featured" && (
                <div>
                  <h3 className="text-[0.95rem] font-bold text-foreground">متاجر مميّزة</h3>
                  <p className="mt-1 text-[0.78rem] text-muted-foreground">أبرز العلامات التجارية في المول</p>
                  {featuredStores && featuredStores.length > 0 ? (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {featuredStores.map((store) => (
                        <Link
                          key={store.id}
                          to={`/stores/${store.slug}`}
                          className="rounded-xl border border-border bg-secondary/30 p-3.5 transition-colors hover:border-primary/20 hover:bg-primary/5"
                        >
                          <p className="text-[0.82rem] font-bold text-foreground">{store.name_ar}</p>
                          {store.unit_code && (
                            <p className="mt-1 font-poppins text-[0.7rem] text-muted-foreground">{store.unit_code}</p>
                          )}
                          {store.category && (
                            <p className="mt-1.5 text-[0.68rem] text-primary">{store.category}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-center">
                      <Store className="mx-auto h-8 w-8 text-muted-foreground/40" />
                      <p className="mt-3 text-[0.82rem] text-muted-foreground">المتاجر المميزة ستظهر هنا قريبًا</p>
                    </div>
                  )}
                  <Link to="/stores" className="mt-4 block">
                    <Button variant="outline-blue" className="h-10 w-full rounded-xl text-[0.82rem]">
                      تصفّح جميع المتاجر
                      <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* ── EVENTS ── */}
              {activeTab === "events" && (
                <div>
                  <h3 className="text-[0.95rem] font-bold text-foreground">فعاليات قادمة</h3>
                  <p className="mt-1 text-[0.78rem] text-muted-foreground">أحداث مميزة في مول البستان</p>
                  {events && events.length > 0 ? (
                    <div className="mt-4 space-y-2.5">
                      {events.map((event) => (
                        <div key={event.id} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-[0.82rem] font-bold text-foreground">{event.title_ar}</p>
                            {event.event_date && (
                              <p className="mt-0.5 font-poppins text-[0.72rem] text-muted-foreground" dir="ltr">
                                {new Date(event.event_date).toLocaleDateString("ar-EG", { day: "numeric", month: "long" })}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-center">
                      <Calendar className="mx-auto h-8 w-8 text-muted-foreground/40" />
                      <p className="mt-3 text-[0.82rem] text-muted-foreground">الفعاليات ستُعلن قريبًا</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── CATEGORIES ── */}
              {activeTab === "categories" && (
                <div>
                  <h3 className="text-[0.95rem] font-bold text-foreground">اكتشف حسب الفئة</h3>
                  <p className="mt-1 text-[0.78rem] text-muted-foreground">اضغط على أي فئة لتمييز متاجرها على الخريطة</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {allCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { onClose(); onFilterCategory(cat); }}
                        className="rounded-xl border border-border bg-secondary/30 p-4 text-right transition-colors hover:border-primary/20 hover:bg-primary/5"
                      >
                        <p className="text-[0.82rem] font-bold text-foreground">{categoryLabelsAr[cat]}</p>
                        <p className="mt-1 text-[0.68rem] text-muted-foreground">عرض على الخريطة</p>
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
