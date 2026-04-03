import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  CircuitBoard,
  Compass,
  Filter,
  Globe,
  MapPin,
  Monitor,
  Phone,
  Search,
  Shield,
  Smartphone,
  Store,
  Wrench,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { LoadingGrid } from "@/components/ui/loading-states";

/* ─── category metadata ─── */
const categoryMeta: Record<string, { icon: typeof Store; label: string; brief: string }> = {
  "الهواتف والإكسسوارات": { icon: Smartphone, label: "احتياج يومي", brief: "أغطية، شواحن، سماعات، وملحقات." },
  "الكمبيوتر والأجهزة": { icon: Monitor, label: "أداء واحتراف", brief: "لابتوبات، شاشات، أجهزة مكتبية." },
  "الألعاب والترفيه": { icon: CircuitBoard, label: "عالم الجيمنج", brief: "أجهزة ألعاب وملحقات رقمية." },
  "الطباعة والتصوير": { icon: Globe, label: "حلول مكتبية", brief: "طابعات، ماسحات، وتصوير مهني." },
  "الشبكات والأنظمة الأمنية": { icon: Shield, label: "بنية تحتية", brief: "كاميرات، شبكات، وحماية." },
  "الشبكات والحماية": { icon: Shield, label: "بنية تحتية", brief: "كاميرات، شبكات، وحماية." },
  "الصيانة والدعم الفني": { icon: Wrench, label: "دعم فني", brief: "صيانة متخصصة وإصلاح فوري." },
};

const primaryCategories = Object.keys(categoryMeta).filter((k) => k !== "الشبكات والحماية");

const statusConfig: Record<string, { text: string; dot: string }> = {
  leased: { text: "نشط", dot: "bg-primary" },
  available: { text: "متاح للتأجير", dot: "bg-orange" },
  "coming-soon": { text: "قريبًا", dot: "bg-accent" },
};

const reveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
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
  const hasStores = totalStores > 0;

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
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="container max-w-[1200px]">
          <div className="py-10 md:py-14 lg:py-16">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <p className="font-poppins text-[0.56rem] font-bold tracking-[0.28em] uppercase" style={{ color: "#64748B" }}>
                Store Directory
              </p>
              <h1 className="mt-2 max-w-[20rem] text-[1.5rem] font-bold leading-[1.15] md:text-[1.8rem]" style={{ color: "#F8FAFC" }}>
                دليل محلات
                <span className="mr-2" style={{ color: "hsl(var(--accent))" }}>مول البستان.</span>
              </h1>
              <p className="mt-2 max-w-[24rem] text-[0.84rem] leading-[1.7]" style={{ color: "#94A3B8" }}>
                {activeCount} محل نشط عبر {primaryCategories.length} فئات تقنية متخصصة.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href="#directory">
                  <Button variant="cta" className="h-9 gap-2 rounded-lg px-5 text-[0.82rem] font-bold shadow-[var(--shadow-blue)]">
                    <Search className="h-3.5 w-3.5" /> تصفح المحلات
                  </Button>
                </a>
                <Link to="/map">
                  <Button className="h-9 gap-2 rounded-lg border px-5 text-[0.82rem] font-semibold" style={{ borderColor: "#1E293B", background: "transparent", color: "#CBD5E1" }}>
                    <Compass className="h-3.5 w-3.5" /> الخريطة
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <section className="py-7 md:py-9" style={{ background: "hsl(var(--background))" }}>
        <div className="container max-w-[1200px]">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-4">
              <p className="section-kicker">التصنيف التجاري</p>
              <h2 className="section-title">تصفح حسب الفئة.</h2>
            </div>

            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
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
                    className={`group flex flex-col items-center gap-2 rounded-lg border p-3.5 text-center transition-all duration-200 ${
                      isActive
                        ? "border-primary/30 bg-primary/[0.04] shadow-[var(--shadow-card)]"
                        : "border-border bg-card hover:border-primary/15 hover:shadow-[var(--shadow-soft)]"
                    }`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                      isActive ? "border-primary/20 bg-primary/10 text-primary" : "border-border bg-secondary text-primary"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-[0.76rem] font-bold light-heading line-clamp-1">{cat}</p>
                    {count > 0 && <span className="text-[0.64rem] font-bold text-primary">{count} محل</span>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ═══════════ DIRECTORY ═══════════ */}
      <section id="directory" className="heritage-deep py-7 md:py-9 scroll-mt-20">
        <div className="container max-w-[1200px]">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="section-kicker dark-kicker">دليل المحلات</p>
                <h2 className="section-title dark-heading">
                  {selectedCategory || "جميع المحلات"}
                  {filtered ? ` (${filtered.length})` : ""}
                </h2>
              </div>
              {hasStores && (
                <div className="flex items-center gap-2 text-[0.78rem] dark-muted">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{activeCount} نشط من {totalStores}</span>
                </div>
              )}
            </div>

            {/* search + filters */}
            <div className="mb-5 space-y-3">
              <div className="relative">
                <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 dark-muted" />
                <input
                  type="text"
                  placeholder="ابحث باسم المحل أو الفئة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-full rounded-lg pr-10 pl-4 text-[0.84rem] outline-none transition-colors"
                  style={{ border: "1px solid #ffffff14", background: "#ffffff08", color: "#F8FAFC" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.4)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#ffffff14"; }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 dark-muted" />
                <FilterChip active={!selectedCategory} onClick={() => setSelectedCategory("")}>الكل</FilterChip>
                {categories.map((cat) => (
                  <FilterChip key={cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat!)}>
                    {cat}
                  </FilterChip>
                ))}
                <span className="mx-0.5 h-3.5 w-px" style={{ background: "#ffffff14" }} />
                {Object.entries(statusConfig).map(([key, val]) => (
                  <FilterChip key={key} active={selectedStatus === key} onClick={() => setSelectedStatus(selectedStatus === key ? "" : key)}>
                    {val.text}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* store grid */}
            {isLoading ? (
              <LoadingGrid count={8} />
            ) : filtered && filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {filtered.map((store, i) => (
                  <StoreCard key={store.id} store={store} index={i} />
                ))}
              </div>
            ) : totalStores === 0 ? (
              <EcosystemGrowingState />
            ) : (
              <DirectoryEmpty onReset={() => { setSearch(""); setSelectedCategory(""); setSelectedStatus(""); }} />
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ MAP + LEASING CTA ═══════════ */}
      <section className="py-7 md:py-9" style={{ background: "hsl(var(--background))" }}>
        <div className="container max-w-[1200px]">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="section-kicker">الخريطة التجارية</p>
                  <h2 className="section-title max-w-[20rem]">استكشف المحلات على الخريطة.</h2>
                  <p className="mt-1 max-w-[22rem] text-[0.82rem] leading-[1.7] light-body">
                    حدد موقع أي محل داخل المول عبر الخريطة التفاعلية.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to="/map">
                    <Button variant="cta" className="h-9 gap-1.5 rounded-lg px-5 text-[0.82rem] font-bold">
                      <Compass className="h-3.5 w-3.5" /> افتح الخريطة
                    </Button>
                  </Link>
                  <Link to="/leasing">
                    <Button variant="outline-blue" className="h-9 rounded-lg px-5 text-[0.82rem]">فرص التأجير</Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
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
      className="rounded-full px-3 py-1 text-[0.72rem] font-bold transition-all"
      style={active
        ? { border: "1px solid #2D6BFF50", background: "#2D6BFF22", color: "#5B9AFF" }
        : { border: "1px solid #ffffff14", background: "#ffffff08", color: "#94A3B8" }
      }
    >
      {children}
    </button>
  );
}

function StoreCard({ store, index }: { store: { id: string; slug: string; name_ar: string; name_en: string | null; category: string | null; short_description_ar: string | null; logo_url: string | null; status: string; unit_code: string | null; featured: boolean }; index: number }) {
  const st = statusConfig[store.status] ?? statusConfig["leased"];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.025, 0.25), duration: 0.3 }}>
      <Link
        to={`/stores/${store.slug}`}
        className="group flex flex-col items-center rounded-lg p-3.5 text-center transition-all duration-200"
        style={{ border: "1px solid #ffffff10", background: "#ffffff06" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2D6BFF35"; e.currentTarget.style.background = "#ffffff0C"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ffffff10"; e.currentTarget.style.background = "#ffffff06"; }}
      >
        <div className="mb-2.5 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5" style={{ border: "1px solid #ffffff18" }}>
          {store.logo_url ? (
            <img src={store.logo_url} alt={store.name_ar} className="h-full w-full object-contain" loading="lazy" />
          ) : (
            <Store className="h-5 w-5" style={{ color: "#5B9AFF" }} />
          )}
        </div>

        <h3 className="text-[0.82rem] font-bold dark-heading transition-colors group-hover:text-primary line-clamp-1">{store.name_ar}</h3>
        {store.name_en && <p className="font-poppins text-[0.62rem] dark-muted mt-0.5 line-clamp-1">{store.name_en}</p>}

        <div className="mt-2 flex items-center gap-1.5 text-[0.6rem]">
          <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
          <span style={{ color: "#94A3B8" }}>{st.text}</span>
        </div>

        {store.unit_code && (
          <span className="mt-1.5 flex items-center gap-1 text-[0.62rem] dark-muted">
            <MapPin className="h-2.5 w-2.5" />{store.unit_code}
          </span>
        )}
      </Link>
    </motion.div>
  );
}

/* ── Ecosystem state ── */
function EcosystemGrowingState() {
  return (
    <div className="heritage-surface rounded-xl p-6 text-center md:p-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "#2D6BFF14", border: "1px solid #2D6BFF30" }}>
        <Store className="h-5 w-5" style={{ color: "#5B9AFF" }} />
      </div>
      <h3 className="mt-4 text-[1rem] font-bold dark-heading">الدليل يتجهّز — والمحلات في الطريق.</h3>
      <p className="mx-auto mt-2 max-w-sm text-[0.82rem] leading-6 dark-body">
        المحلات تنضم تدريجيًا مع اقتراب الافتتاح.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Link to="/map">
          <Button variant="cta" className="h-9 gap-1.5 rounded-lg px-5 text-[0.82rem] font-bold">
            <Compass className="h-3.5 w-3.5" /> الوحدات على الخريطة
          </Button>
        </Link>
        <Link to="/leasing">
          <Button variant="outline-blue" className="h-9 rounded-lg px-5 text-[0.82rem]">استفسر عن التأجير</Button>
        </Link>
      </div>
    </div>
  );
}

function DirectoryEmpty({ onReset }: { onReset: () => void }) {
  return (
    <div className="heritage-surface rounded-xl p-7 text-center md:p-10">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "#ffffff0A", border: "1px solid #ffffff14" }}>
        <Search className="h-5 w-5" style={{ color: "#5B9AFF" }} />
      </div>
      <h3 className="mt-4 text-[0.95rem] font-bold dark-heading">لا توجد نتائج</h3>
      <p className="mx-auto mt-1.5 max-w-xs text-[0.82rem] leading-6 dark-body">
        عدّل الفلتر أو جرّب كلمة بحث مختلفة.
      </p>
      <button onClick={onReset} className="mt-4 rounded-lg px-5 py-2 text-[0.82rem] font-bold transition-all" style={{ border: "1px solid #ffffff18", background: "#ffffff0A", color: "#CBD5E1" }}>
        إعادة ضبط الفلاتر
      </button>
    </div>
  );
}

export default Stores;
