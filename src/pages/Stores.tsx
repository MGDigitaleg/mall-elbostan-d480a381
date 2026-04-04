import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  CircuitBoard,
  Compass,
  Globe,
  MapPin,
  Monitor,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Store,
  Wrench,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { PageHero } from "@/components/PageHero";
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
  leased: { text: "نشط", color: "#10B981", bg: "#10B98115", border: "#10B98130" },
  available: { text: "متاح للتأجير", color: "#F97316", bg: "#F9731615", border: "#F9731630" },
  "coming-soon": { text: "قريبًا", color: "#06B6D4", bg: "#06B6D415", border: "#06B6D430" },
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

      {/* ═══════════ HERO — Unified PageHero ═══════════ */}
      <PageHero
        kicker="دليل المحلات"
        kickerEn="Store Directory"
        title={<>محلات <span className="bg-gradient-to-l from-[#2D6BFF] to-[#60A5FA] bg-clip-text text-transparent">مول البستان.</span></>}
        subtitle={`${activeCount > 0 ? `${activeCount} محل نشط` : "جميع المحلات"} في ${primaryCategories.length} تخصصات تقنية بالقاهرة الجديدة.`}
        ctas={[
          { label: "تصفح المحلات", to: "#directory", icon: Search },
          { label: "الخريطة التفاعلية", to: "/map", icon: Compass },
        ]}
        compact
      >
        {/* Compact stats row */}
        <div className="flex items-center gap-4 lg:justify-end">
          {[
            { label: "إجمالي المحلات", value: totalStores, accent: "#2D6BFF" },
            { label: "محل نشط", value: activeCount, accent: "#10B981" },
            { label: "فئة تقنية", value: primaryCategories.length, accent: "#06B6D4" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 rounded-xl px-4 py-3 text-center"
              style={{ background: "#ffffff06", border: "1px solid #ffffff0A" }}
            >
              <span className="font-poppins text-[1.3rem] font-extrabold leading-none" style={{ color: stat.accent }}>{stat.value}</span>
              <span className="text-[0.58rem] font-medium" style={{ color: "#64748B" }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </PageHero>

      {/* ═══════════ CATEGORY CARDS ═══════════ */}
      <section className="py-9 md:py-12" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-[1200px]">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="section-kicker">التصنيف التجاري</p>
              <h2 className="section-title">تصفح حسب الفئة.</h2>
            </div>
            {selectedCategory && (
              <button onClick={() => setSelectedCategory("")} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem] font-bold text-primary transition-colors hover:bg-primary/5" style={{ border: "1px solid hsl(var(--primary) / 0.15)" }}>
                <X className="h-3 w-3" /> مسح التصنيف
              </button>
            )}
          </div>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
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
                  className="group relative flex flex-col justify-between rounded-2xl border p-4 text-start transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    borderColor: isActive ? `${meta.color}50` : "#E2E8F030",
                    background: isActive ? `linear-gradient(145deg, ${meta.color}08, ${meta.color}03)` : "white",
                    boxShadow: isActive
                      ? `0 0 0 1px ${meta.color}20, 0 8px 24px ${meta.color}12`
                      : "0 1px 4px hsl(0 0% 0% / 0.03)",
                  }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: isActive ? `${meta.color}18` : `${meta.color}08`,
                      border: `1px solid ${isActive ? `${meta.color}40` : `${meta.color}15`}`,
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: meta.color }} />
                  </div>

                  <div className="mt-3.5">
                    <p className="text-[0.78rem] font-bold light-heading line-clamp-1">{cat}</p>
                    <p className="mt-0.5 text-[0.6rem] light-muted">{meta.label}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {count > 0 ? (
                      <span className="rounded-full px-2 py-0.5 text-[0.64rem] font-extrabold" style={{ background: `${meta.color}10`, color: meta.color }}>
                        {count} محل
                      </span>
                    ) : (
                      <span className="text-[0.62rem] light-muted">قريبًا</span>
                    )}
                    <ArrowLeft className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:opacity-60 group-hover:-translate-x-1" style={{ color: meta.color }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 15%, #CDBB9A30, transparent 85%)" }} />

      {/* ═══════════ DIRECTORY ═══════════ */}
      <section id="directory" className="py-9 md:py-12 scroll-mt-20" style={{ background: "linear-gradient(170deg, #071326 0%, #0D1F3C 100%)" }}>
        <div className="container max-w-[1200px]">
          {/* Sticky search + filters bar */}
          <div
            className="sticky top-14 z-20 -mx-1 mb-7 rounded-2xl p-4 backdrop-blur-2xl"
            style={{ background: "#0B1220F2", border: "1px solid #ffffff0C", boxShadow: "0 8px 40px hsl(0 0% 0% / 0.25)" }}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "#475569" }} />
                <input
                  type="text"
                  placeholder="ابحث باسم المحل أو الفئة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 w-full rounded-xl pr-10 pl-4 text-[0.84rem] outline-none transition-all placeholder:text-[#475569] focus:ring-2 focus:ring-primary/25"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff08", color: "#F8FAFC" }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <FilterChip active={!selectedCategory && !selectedStatus} onClick={clearFilters}>الكل</FilterChip>
                {categories.map((cat) => (
                  <FilterChip key={cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat!)}>
                    {cat ? categoryMeta[cat]?.icon ? <CategoryIcon category={cat} size={12} /> : null : null}
                    {cat}
                  </FilterChip>
                ))}
                <span className="mx-1.5 h-4 w-px" style={{ background: "#ffffff14" }} />
                {Object.entries(statusConfig).map(([key, val]) => (
                  <FilterChip key={key} active={selectedStatus === key} onClick={() => setSelectedStatus(selectedStatus === key ? "" : key)}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: val.color }} />
                    {val.text}
                  </FilterChip>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 flex items-center gap-2.5 border-t pt-3 text-[0.72rem]" style={{ borderColor: "#ffffff0C", color: "#64748B" }}>
                    <span className="rounded-md px-2.5 py-1 font-bold" style={{ background: "#2D6BFF15", color: "#5B9AFF" }}>
                      {filtered?.length ?? 0} نتيجة
                    </span>
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1 font-semibold transition-colors hover:text-white"
                      style={{ border: "1px solid #ffffff12", background: "#ffffff08" }}
                    >
                      <X className="h-3 w-3" /> مسح الفلاتر
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section header */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-[1.15rem] font-extrabold" style={{ color: "#F8FAFC" }}>
                {selectedCategory || "جميع المحلات"}
              </h2>
              {selectedCategory && categoryMeta[selectedCategory] && (
                <p className="mt-0.5 text-[0.76rem]" style={{ color: "#64748B" }}>{categoryMeta[selectedCategory].label}</p>
              )}
            </div>
            {totalStores > 0 && (
              <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem]" style={{ background: "#ffffff06", border: "1px solid #ffffff0C", color: "#64748B" }}>
                <Building2 className="h-3.5 w-3.5" />
                <span>{activeCount} نشط من {totalStores}</span>
              </div>
            )}
          </div>

          {/* Store grid */}
          {isLoading ? (
            <LoadingGrid count={8} />
          ) : filtered && filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      <section className="relative overflow-hidden py-9 md:py-12" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-[1200px]">
          <div className="rounded-2xl p-6 md:p-8" style={{ background: "linear-gradient(135deg, #071326 0%, #0D1F3C 100%)", border: "1px solid #ffffff0A" }}>
            <div className="pointer-events-none absolute left-1/3 top-1/2 h-[200px] w-[300px] -translate-y-1/2 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }} />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1" style={{ background: "#2D6BFF12", border: "1px solid #2D6BFF25" }}>
                  <Compass className="h-3 w-3" style={{ color: "#5B9AFF" }} />
                  <span className="text-[0.62rem] font-bold" style={{ color: "#5B9AFF" }}>الخريطة التجارية</span>
                </div>
                <h2 className="mt-3 text-[1.2rem] font-extrabold md:text-[1.35rem]" style={{ color: "#F8FAFC" }}>استكشف المحلات على الخريطة.</h2>
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
                  <Button className="h-10 rounded-xl px-6 text-[0.84rem] font-bold" style={{ background: "#ffffff08", color: "#CBD5E1", border: "1px solid #ffffff18" }}>
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

function CategoryIcon({ category, size = 14 }: { category: string; size?: number }) {
  const meta = categoryMeta[category];
  if (!meta) return null;
  const Icon = meta.icon;
  return <Icon style={{ width: size, height: size, color: meta.color }} />;
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.72rem] font-bold transition-all duration-200 hover:brightness-110"
      style={
        active
          ? { border: "1px solid #2D6BFF45", background: "#2D6BFF20", color: "#5B9AFF", boxShadow: "0 0 0 1px #2D6BFF15" }
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.2), duration: 0.35 }}
    >
      <Link
        to={`/stores/${store.slug}`}
        className="group relative flex flex-col rounded-2xl p-4 transition-all duration-300"
        style={{ border: "1px solid #ffffff0C", background: "#ffffff05" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#2D6BFF25";
          e.currentTarget.style.background = "#ffffff0C";
          e.currentTarget.style.boxShadow = "0 8px 32px hsl(222 100% 59% / 0.08)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#ffffff0C";
          e.currentTarget.style.background = "#ffffff05";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {store.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: "#F59E0B15", border: "1px solid #F59E0B30" }}>
            <Sparkles className="h-2.5 w-2.5" style={{ color: "#F59E0B" }} />
            <span className="text-[0.55rem] font-bold" style={{ color: "#F59E0B" }}>مميّز</span>
          </div>
        )}

        <div className="flex items-center gap-3.5">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl p-2"
            style={{
              background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
              border: "1px solid #ffffff20",
              boxShadow: "0 2px 12px hsl(0 0% 0% / 0.12)",
            }}
          >
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.name_ar} className="h-full w-full object-contain" loading="lazy" />
            ) : (
              <Store className="h-7 w-7" style={{ color: meta?.color ?? "#5B9AFF" }} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[0.9rem] font-bold leading-snug transition-colors group-hover:text-[#5B9AFF] line-clamp-1" style={{ color: "#F8FAFC" }}>
              {store.name_ar}
            </h3>
            {store.name_en && (
              <p className="font-poppins text-[0.68rem] mt-0.5 line-clamp-1" style={{ color: "#64748B" }}>{store.name_en}</p>
            )}
            {store.category && (
              <div className="mt-1 flex items-center gap-1.5">
                {meta && <meta.icon className="h-3 w-3" style={{ color: meta.color }} />}
                <span className="text-[0.62rem] font-medium" style={{ color: "#64748B" }}>{store.category}</span>
              </div>
            )}
          </div>

          <ArrowLeft className="mt-0.5 h-4 w-4 shrink-0 opacity-0 transition-all duration-300 group-hover:opacity-70 group-hover:-translate-x-1" style={{ color: "#5B9AFF" }} />
        </div>

        {store.short_description_ar && (
          <p className="mt-3 text-[0.74rem] leading-[1.65] line-clamp-2" style={{ color: "#94A3B8" }}>
            {store.short_description_ar}
          </p>
        )}

        <div className="mt-3.5 flex items-center gap-2 border-t pt-3" style={{ borderColor: "#ffffff08" }}>
          <span
            className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.62rem] font-bold"
            style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.color }} />
            {st.text}
          </span>

          {store.unit_code && (
            <span className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.62rem] font-medium" style={{ background: "#ffffff06", border: "1px solid #ffffff0A", color: "#64748B" }}>
              <MapPin className="h-2.5 w-2.5" />{store.unit_code}
            </span>
          )}

          <span className="flex-1" />

          <span className="text-[0.6rem] font-semibold opacity-0 transition-all group-hover:opacity-100" style={{ color: "#5B9AFF" }}>
            عرض التفاصيل
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

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
          <Button className="h-10 rounded-xl px-6 text-[0.84rem] font-bold" style={{ background: "#ffffff08", color: "#CBD5E1", border: "1px solid #ffffff18" }}>
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
