import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  CircuitBoard,
  Compass,
  Globe,
  MapPin,
  Monitor,
  Phone,
  Search,
  Shield,
  Smartphone,
  Store,
  Wrench,
  X,
  ArrowLeft,
  Layers,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { LoadingGrid } from "@/components/ui/loading-states";

/* ─── category metadata ─── */
const categoryMeta: Record<string, { icon: typeof Store; label: string; color: string }> = {
  "الهواتف والإكسسوارات": { icon: Smartphone, label: "احتياج يومي سريع", color: "#3B82F6" },
  "الكمبيوتر والأجهزة": { icon: Monitor, label: "أداء واحتراف", color: "#8B5CF6" },
  "الألعاب والترفيه": { icon: CircuitBoard, label: "عالم الجيمنج", color: "#EC4899" },
  "الطباعة والتصوير": { icon: Globe, label: "حلول مكتبية", color: "#F59E0B" },
  "الشبكات والأنظمة الأمنية": { icon: Shield, label: "بنية تحتية", color: "#10B981" },
  "الشبكات والحماية": { icon: Shield, label: "بنية تحتية", color: "#10B981" },
  "الصيانة والدعم الفني": { icon: Wrench, label: "دعم فني", color: "#06B6D4" },
};

const primaryCategories = Object.keys(categoryMeta).filter((k) => k !== "الشبكات والحماية");

const statusConfig: Record<string, { text: string; color: string; bg: string; border: string }> = {
  leased: { text: "نشط", color: "#10B981", bg: "#10B98118", border: "#10B98130" },
  available: { text: "متاح للتأجير", color: "#F97316", bg: "#F9731618", border: "#F9731630" },
  "coming-soon": { text: "قريبًا", color: "#06B6D4", bg: "#06B6D418", border: "#06B6D430" },
};

const Stores = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState("");

  const { data: stores, isLoading } = useQuery({
    queryKey: ["stores-directory"],
    queryFn: async () => {
      const { data } = await supabase
        .from("stores")
        .select("id, slug, name_ar, name_en, category, short_description_ar, logo_url, status, unit_code, featured, floor_id")
        .neq("status", "hidden")
        .order("featured", { ascending: false })
        .order("name_ar", { ascending: true });
      return data ?? [];
    },
  });

  const categories = useMemo(() => [...new Set(stores?.map((s) => s.category).filter(Boolean) ?? [])], [stores]);

  const filtered = useMemo(() => {
    return stores?.filter((s) => {
      const q = search.trim();
      const matchSearch = !q || s.name_ar.includes(q) || s.name_en?.toLowerCase().includes(q.toLowerCase()) || s.category?.includes(q);
      const matchCategory = !selectedCategory || s.category === selectedCategory;
      const matchStatus = !selectedStatus || s.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [stores, search, selectedCategory, selectedStatus]);

  const totalStores = stores?.length ?? 0;
  const activeCount = stores?.filter((s) => s.status === "leased").length ?? 0;
  const hasActiveFilters = !!search || !!selectedCategory || !!selectedStatus;

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("");
    setSelectedStatus("");
  }, []);

  return (
    <MainLayout>
      <SEOHead
        title="دليل المحلات"
        titleEn="Stores Directory"
        description="تصفح جميع المحلات في مول البستان — أجهزة، هواتف، جيمنج، صيانة، وأكثر. دليل تقني في القاهرة الجديدة."
        descriptionEn="Browse all stores at Mall Elbostan — phones, computers, gaming, and more."
        breadcrumbs={[{ name: "المحلات", url: "/stores" }]}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(165deg, #071326 0%, #0D1F3C 40%, #0B1830 100%)" }}>
        {/* Decorative glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 h-[300px] w-[400px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 h-[200px] w-[300px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)" }} />
        </div>

        <div className="container relative max-w-[1200px]">
          <div className="py-12 md:py-16 lg:py-20">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              {/* Text side */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-lg">
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5" style={{ background: "#2D6BFF12", border: "1px solid #2D6BFF25" }}>
                  <Layers className="h-3 w-3" style={{ color: "#5B9AFF" }} />
                  <span className="font-poppins text-[0.62rem] font-bold tracking-[0.2em] uppercase" style={{ color: "#5B9AFF" }}>
                    Store Directory
                  </span>
                </div>

                <h1 className="mt-4 text-[1.6rem] font-extrabold leading-[1.15] md:text-[2rem] lg:text-[2.2rem]" style={{ color: "#F8FAFC" }}>
                  دليل محلات
                  <br />
                  <span style={{ color: "#5B9AFF" }}>مول البستان.</span>
                </h1>
                <p className="mt-3 max-w-[26rem] text-[0.88rem] leading-[1.8]" style={{ color: "#94A3B8" }}>
                  تصفّح {activeCount > 0 ? `${activeCount} محل نشط` : "المحلات"} عبر {primaryCategories.length} فئات تقنية متخصصة في القاهرة الجديدة.
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  <a href="#directory">
                    <Button variant="cta" className="h-10 gap-2 rounded-xl px-6 text-[0.84rem] font-bold shadow-[0_4px_20px_hsl(222_100%_59%/0.25)]">
                      <Search className="h-3.5 w-3.5" /> تصفح المحلات
                    </Button>
                  </a>
                  <Link to="/map">
                    <Button className="h-10 gap-2 rounded-xl px-6 text-[0.84rem] font-semibold" style={{ borderColor: "#ffffff18", background: "#ffffff08", color: "#CBD5E1", border: "1px solid #ffffff18" }}>
                      <Compass className="h-3.5 w-3.5" /> الخريطة التفاعلية
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Stats cards */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="grid grid-cols-3 gap-2.5 lg:gap-3"
              >
                {[
                  { label: "إجمالي المحلات", value: totalStores, icon: Building2, accent: "#2D6BFF" },
                  { label: "محل نشط", value: activeCount, icon: Sparkles, accent: "#10B981" },
                  { label: "فئة تقنية", value: primaryCategories.length, icon: Layers, accent: "#06B6D4" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-2 rounded-xl px-4 py-5 text-center"
                    style={{ background: "#ffffff06", border: "1px solid #ffffff0D" }}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${stat.accent}15`, border: `1px solid ${stat.accent}30` }}>
                      <stat.icon className="h-4 w-4" style={{ color: stat.accent }} />
                    </div>
                    <span className="text-[1.4rem] font-extrabold" style={{ color: "#F8FAFC" }}>{stat.value}</span>
                    <span className="text-[0.65rem] font-medium" style={{ color: "#64748B" }}>{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 10%, #2D6BFF30, transparent 90%)" }} />
      </section>

      {/* ═══════════ CATEGORY CARDS ═══════════ */}
      <section className="py-8 md:py-10" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-[1200px]">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="section-kicker">التصنيف التجاري</p>
              <h2 className="section-title">تصفح حسب الفئة.</h2>
            </div>
            {selectedCategory && (
              <button onClick={() => setSelectedCategory("")} className="flex items-center gap-1 text-[0.74rem] font-bold text-primary hover:underline">
                <X className="h-3 w-3" /> مسح التصنيف
              </button>
            )}
          </div>

          <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {primaryCategories.map((cat) => {
              const meta = categoryMeta[cat];
              const Icon = meta.icon;
              const count = stores?.filter((s) => s.category === cat).length ?? 0;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(isActive ? "" : cat);
                    document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group relative flex flex-col justify-between rounded-xl border p-4 text-start transition-all duration-300"
                  style={{
                    borderColor: isActive ? `${meta.color}40` : "#E2E8F020",
                    background: isActive ? `${meta.color}08` : "white",
                    boxShadow: isActive ? `0 0 0 1px ${meta.color}20, 0 4px 16px ${meta.color}10` : "0 1px 3px hsl(0 0% 0% / 0.04)",
                  }}
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300"
                    style={{
                      background: isActive ? `${meta.color}18` : `${meta.color}08`,
                      border: `1px solid ${isActive ? `${meta.color}35` : `${meta.color}15`}`,
                      color: meta.color,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-3">
                    <p className="text-[0.78rem] font-bold light-heading line-clamp-1">{cat}</p>
                    <p className="mt-0.5 text-[0.6rem] light-muted">{meta.label}</p>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    {count > 0 && (
                      <span className="text-[0.68rem] font-bold" style={{ color: meta.color }}>{count} محل</span>
                    )}
                    <ArrowLeft className="h-3 w-3 opacity-0 transition-all group-hover:opacity-60 group-hover:-translate-x-0.5" style={{ color: meta.color }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 15%, #CDBB9A40, transparent 85%)" }} />

      {/* ═══════════ DIRECTORY ═══════════ */}
      <section id="directory" className="py-8 md:py-10 scroll-mt-20" style={{ background: "linear-gradient(170deg, #071326 0%, #0D1F3C 100%)" }}>
        <div className="container max-w-[1200px]">
          {/* Sticky search + filters bar */}
          <div className="sticky top-14 z-20 -mx-1 mb-6 rounded-2xl px-4 py-4 backdrop-blur-2xl" style={{ background: "#0B1220F0", border: "1px solid #ffffff0A", boxShadow: "0 8px 32px hsl(0 0% 0% / 0.2)" }}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "#475569" }} />
                <input
                  type="text"
                  placeholder="ابحث باسم المحل أو الفئة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 w-full rounded-xl pr-10 pl-4 text-[0.84rem] outline-none transition-all focus:ring-1 focus:ring-primary/30"
                  style={{
                    border: "1px solid #ffffff10",
                    background: "#ffffff06",
                    color: "#F8FAFC",
                  }}
                />
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <FilterChip active={!selectedCategory && !selectedStatus} onClick={clearFilters}>الكل</FilterChip>
                {categories.map((cat) => (
                  <FilterChip key={cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat!)}>
                    {cat}
                  </FilterChip>
                ))}
                <span className="mx-1 h-4 w-px" style={{ background: "#ffffff12" }} />
                {Object.entries(statusConfig).map(([key, val]) => (
                  <FilterChip key={key} active={selectedStatus === key} onClick={() => setSelectedStatus(selectedStatus === key ? "" : key)}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: val.color }} />
                    {val.text}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* Active filter summary */}
            {hasActiveFilters && (
              <div className="mt-3 flex items-center gap-2.5 border-t pt-3 text-[0.72rem]" style={{ borderColor: "#ffffff0A", color: "#64748B" }}>
                <span className="rounded-md px-2 py-0.5 font-bold" style={{ background: "#2D6BFF15", color: "#5B9AFF" }}>{filtered?.length ?? 0} نتيجة</span>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition-colors hover:text-white"
                  style={{ border: "1px solid #ffffff10", background: "#ffffff06" }}
                >
                  <X className="h-3 w-3" /> مسح الفلاتر
                </button>
              </div>
            )}
          </div>

          {/* Section header */}
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-[1.15rem] font-extrabold" style={{ color: "#F8FAFC" }}>
                {selectedCategory || "جميع المحلات"}
              </h2>
              {selectedCategory && categoryMeta[selectedCategory] && (
                <p className="mt-0.5 text-[0.76rem]" style={{ color: "#64748B" }}>{categoryMeta[selectedCategory].label}</p>
              )}
            </div>
            {totalStores > 0 && (
              <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem]" style={{ background: "#ffffff06", border: "1px solid #ffffff0A", color: "#64748B" }}>
                <Building2 className="h-3.5 w-3.5" />
                <span>{activeCount} نشط من {totalStores}</span>
              </div>
            )}
          </div>

          {/* Store grid */}
          {isLoading ? (
            <LoadingGrid count={8} />
          ) : filtered && filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((store, i) => (
                <StoreCard key={store.id} store={store} index={i} />
              ))}
            </div>
          ) : totalStores === 0 ? (
            <EcosystemGrowingState />
          ) : (
            <DirectoryEmpty onReset={clearFilters} />
          )}
        </div>
      </section>

      {/* ═══════════ MAP + LEASING CTA ═══════════ */}
      <section className="relative overflow-hidden py-8 md:py-10" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-[1200px]">
          <div className="rounded-2xl p-6 md:p-8" style={{ background: "linear-gradient(135deg, #071326 0%, #0D1F3C 100%)", border: "1px solid #ffffff0A" }}>
            {/* Decorative glow */}
            <div className="pointer-events-none absolute left-1/3 top-1/2 h-[200px] w-[300px] -translate-y-1/2 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }} />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1" style={{ background: "#2D6BFF12", border: "1px solid #2D6BFF25" }}>
                  <Compass className="h-3 w-3" style={{ color: "#5B9AFF" }} />
                  <span className="text-[0.62rem] font-bold" style={{ color: "#5B9AFF" }}>الخريطة التجارية</span>
                </div>
                <h2 className="mt-3 text-[1.2rem] font-extrabold md:text-[1.35rem]" style={{ color: "#F8FAFC" }}>
                  استكشف المحلات على الخريطة.
                </h2>
                <p className="mt-1.5 max-w-[22rem] text-[0.82rem] leading-[1.7]" style={{ color: "#94A3B8" }}>
                  حدد موقع أي محل داخل المول عبر الخريطة التفاعلية ثلاثية الأدوار.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Link to="/map">
                  <Button variant="cta" className="h-10 gap-1.5 rounded-xl px-6 text-[0.84rem] font-bold shadow-[0_4px_20px_hsl(222_100%_59%/0.25)]">
                    <Compass className="h-3.5 w-3.5" /> افتح الخريطة
                  </Button>
                </Link>
                <Link to="/leasing">
                  <Button className="h-10 rounded-xl px-6 text-[0.84rem] font-bold" style={{ borderColor: "#ffffff18", background: "#ffffff08", color: "#CBD5E1", border: "1px solid #ffffff18" }}>
                    فرص التأجير
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

/* ══════════════════════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════════════════════ */

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.72rem] font-bold transition-all duration-200"
      style={active
        ? { border: "1px solid #2D6BFF50", background: "#2D6BFF22", color: "#5B9AFF", boxShadow: "0 0 0 1px #2D6BFF20" }
        : { border: "1px solid #ffffff10", background: "#ffffff06", color: "#94A3B8" }
      }
    >
      {children}
    </button>
  );
}

type StoreRow = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string | null;
  category: string | null;
  short_description_ar: string | null;
  logo_url: string | null;
  status: string;
  unit_code: string | null;
  featured: boolean;
};

function StoreCard({ store, index }: { store: StoreRow; index: number }) {
  const st = statusConfig[store.status] ?? statusConfig["leased"];
  const meta = store.category ? categoryMeta[store.category] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.25), duration: 0.35 }}
    >
      <Link
        to={`/stores/${store.slug}`}
        className="group relative flex items-start gap-4 rounded-xl p-4 transition-all duration-300"
        style={{ border: "1px solid #ffffff0C", background: "#ffffff05" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#2D6BFF25";
          e.currentTarget.style.background = "#ffffff0A";
          e.currentTarget.style.boxShadow = "0 4px 24px hsl(222 100% 59% / 0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#ffffff0C";
          e.currentTarget.style.background = "#ffffff05";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Featured indicator */}
        {store.featured && (
          <div className="absolute top-2 left-2">
            <Sparkles className="h-3 w-3" style={{ color: "#F59E0B" }} />
          </div>
        )}

        {/* Logo */}
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5"
          style={{ border: "1px solid #ffffff18", boxShadow: "0 2px 8px hsl(0 0% 0% / 0.1)" }}
        >
          {store.logo_url ? (
            <img src={store.logo_url} alt={store.name_ar} className="h-full w-full object-contain" loading="lazy" />
          ) : (
            <Store className="h-6 w-6" style={{ color: meta?.color ?? "#5B9AFF" }} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[0.88rem] font-bold transition-colors group-hover:text-primary line-clamp-1" style={{ color: "#F8FAFC" }}>
                {store.name_ar}
              </h3>
              {store.name_en && (
                <p className="font-poppins text-[0.68rem] mt-0.5 line-clamp-1" style={{ color: "#64748B" }}>{store.name_en}</p>
              )}
            </div>
            <ArrowLeft className="mt-1 h-3.5 w-3.5 shrink-0 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-1" style={{ color: "#5B9AFF" }} />
          </div>

          {store.short_description_ar && (
            <p className="mt-1.5 text-[0.76rem] leading-[1.6] line-clamp-2" style={{ color: "#94A3B8" }}>
              {store.short_description_ar}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span
              className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.62rem] font-bold"
              style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.color }} />
              {st.text}
            </span>

            {store.unit_code && (
              <span className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.64rem]" style={{ background: "#ffffff06", color: "#64748B" }}>
                <MapPin className="h-3 w-3" />{store.unit_code}
              </span>
            )}

            {store.category && (
              <span className="text-[0.64rem] font-medium" style={{ color: "#475569" }}>
                {store.category}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Ecosystem state ── */
function EcosystemGrowingState() {
  return (
    <div className="rounded-2xl p-8 text-center md:p-10" style={{ background: "#ffffff06", border: "1px solid #ffffff0A" }}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "#2D6BFF12", border: "1px solid #2D6BFF25" }}>
        <Store className="h-6 w-6" style={{ color: "#5B9AFF" }} />
      </div>
      <h3 className="mt-5 text-[1.05rem] font-extrabold" style={{ color: "#F8FAFC" }}>الدليل يتجهّز — والمحلات في الطريق.</h3>
      <p className="mx-auto mt-2 max-w-sm text-[0.84rem] leading-7" style={{ color: "#94A3B8" }}>
        المحلات تنضم تدريجيًا مع اقتراب الافتتاح.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        <Link to="/map">
          <Button variant="cta" className="h-10 gap-1.5 rounded-xl px-6 text-[0.84rem] font-bold">
            <Compass className="h-3.5 w-3.5" /> الوحدات على الخريطة
          </Button>
        </Link>
        <Link to="/leasing">
          <Button className="h-10 rounded-xl px-6 text-[0.84rem] font-bold" style={{ borderColor: "#ffffff18", background: "#ffffff08", color: "#CBD5E1", border: "1px solid #ffffff18" }}>
            استفسر عن التأجير
          </Button>
        </Link>
      </div>
    </div>
  );
}

function DirectoryEmpty({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl p-8 text-center md:p-10" style={{ background: "#ffffff06", border: "1px solid #ffffff0A" }}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "#ffffff0A", border: "1px solid #ffffff14" }}>
        <Search className="h-5 w-5" style={{ color: "#5B9AFF" }} />
      </div>
      <h3 className="mt-4 text-[0.95rem] font-bold" style={{ color: "#F8FAFC" }}>لا توجد نتائج</h3>
      <p className="mx-auto mt-1.5 max-w-xs text-[0.82rem] leading-6" style={{ color: "#94A3B8" }}>
        عدّل الفلتر أو جرّب كلمة بحث مختلفة.
      </p>
      <button onClick={onReset} className="mt-4 rounded-xl px-5 py-2.5 text-[0.82rem] font-bold transition-all" style={{ border: "1px solid #ffffff18", background: "#ffffff0A", color: "#CBD5E1" }}>
        إعادة ضبط الفلاتر
      </button>
    </div>
  );
}

export default Stores;
