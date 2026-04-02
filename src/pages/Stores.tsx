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
  Layers3,
  MapPin,
  Monitor,
  Phone,
  Search,
  Shield,
  Smartphone,
  Store,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { LoadingGrid } from "@/components/ui/loading-states";
import entranceImage from "@/assets/mall-entrance.jpg";
import interiorImage from "@/assets/mall-interior.jpg";

/* ─── category metadata ─── */
const categoryMeta: Record<string, { icon: typeof Store; label: string; brief: string; desc: string }> = {
  "الهواتف والإكسسوارات": { icon: Smartphone, label: "احتياج يومي سريع", brief: "أغطية، شواحن، سماعات، وملحقات.", desc: "تشكيلة شاملة من الهواتف والملحقات." },
  "الكمبيوتر والأجهزة": { icon: Monitor, label: "أداء واحتراف", brief: "لابتوبات، شاشات، أجهزة مكتبية.", desc: "أجهزة للعمل والدراسة والإنتاجية." },
  "الألعاب والترفيه": { icon: CircuitBoard, label: "عالم الجيمنج", brief: "أجهزة ألعاب وملحقات رقمية.", desc: "أجهزة ألعاب وترفيه رقمي." },
  "الطباعة والتصوير": { icon: Globe, label: "حلول مكتبية", brief: "طابعات، ماسحات، وتصوير مهني.", desc: "حلول طباعة وتصوير." },
  "الشبكات والأنظمة الأمنية": { icon: Shield, label: "بنية تحتية", brief: "كاميرات، شبكات، وحماية.", desc: "شبكات وأنظمة حماية." },
  "الشبكات والحماية": { icon: Shield, label: "بنية تحتية", brief: "كاميرات، شبكات، وحماية.", desc: "شبكات وأنظمة حماية." },
  "الصيانة والدعم الفني": { icon: Wrench, label: "دعم فني معتمد", brief: "صيانة متخصصة وإصلاح فوري.", desc: "مراكز صيانة وخدمة إصلاح." },
};

const primaryCategories = Object.keys(categoryMeta).filter((k) => k !== "الشبكات والحماية");

const statusConfig: Record<string, { text: string; dot: string }> = {
  leased: { text: "نشط", dot: "bg-primary" },
  available: { text: "متاح للتأجير", dot: "bg-orange" },
  "coming-soon": { text: "قريبًا", dot: "bg-accent" },
};

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
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

  const featuredStores = useMemo(() => stores?.filter((s) => s.featured) ?? [], [stores]);
  const totalStores = stores?.length ?? 0;
  const activeCount = stores?.filter((s) => s.status === "leased").length ?? 0;
  const hasStores = totalStores > 0;

  return (
    <MainLayout>
      <SEOHead
        title="دليل المتاجر"
        titleEn="Stores Directory"
        description="تصفح جميع المتاجر في مول البستان — أجهزة، هواتف، جيمنج، صيانة، وأكثر. دليل تقني منظّم في القاهرة الجديدة."
        descriptionEn="Browse all stores at Mall Elbostan — phones, computers, gaming, and more."
        breadcrumbs={[{ name: "المتاجر", url: "/stores" }]}
      />

      {/* ═══════════ HERO — compact ═══════════ */}
      <section className="relative overflow-hidden" style={{ background: "#071326" }}>
        <div className="relative mx-auto w-full max-w-[1440px]">
          <div className="grid min-h-[42vh] items-center lg:grid-cols-[1.25fr_0.75fr]">

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="order-1 space-y-3.5 px-6 py-8 md:px-12 lg:py-10 lg:pr-14 xl:pr-16">
              <p className="font-poppins text-[0.56rem] font-bold tracking-[0.28em] uppercase" style={{ color: "#64748B" }}>
                Store Directory
              </p>

              <h1 className="max-w-[18rem] text-[1.45rem] leading-[1.1] md:text-[1.75rem] lg:text-[2rem]" style={{ color: "#F8FAFC" }}>
                دليل المتاجر
                <br />
                <span style={{ color: "#CDBB9A" }}>التقنية.</span>
              </h1>

              <p className="max-w-[22rem] text-[0.84rem] leading-[1.8]" style={{ color: "#94A3B8" }}>
                كل متجر بفئته، موقعه، وحالته الفعلية.
              </p>

              <div className="flex flex-wrap gap-2">
                <a href="#directory">
                  <Button variant="cta" className="h-9 gap-2 rounded-lg px-5 text-[0.82rem] font-bold shadow-[var(--shadow-blue)]">
                    <Search className="h-3.5 w-3.5" /> ابدأ التصفح
                  </Button>
                </a>
                <Link to="/map">
                  <Button className="h-9 gap-2 rounded-lg border px-5 text-[0.82rem] font-semibold" style={{ borderColor: "#1E293B", background: "transparent", color: "#CBD5E1" }}>
                    <Compass className="h-3.5 w-3.5" /> الخريطة
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-5 pt-3" style={{ borderTop: "1px solid #1E293B" }}>
                {[
                  { v: "50+", l: "وحدة تجارية" },
                  { v: `${primaryCategories.length}`, l: "فئة متخصصة" },
                  { v: "3", l: "أدوار" },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-4">
                    <div>
                      <p className="font-poppins text-[1.1rem] font-extrabold" style={{ color: "#F8FAFC" }}>{s.v}</p>
                      <p className="text-[0.58rem] font-semibold" style={{ color: "#64748B" }}>{s.l}</p>
                    </div>
                    {i < 2 && <div className="h-5 w-px" style={{ background: "#1E293B" }} />}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative order-2 hidden self-center py-8 pe-6 lg:block xl:pe-8">
              <div className="frame-geometric overflow-hidden">
                <img src={entranceImage} alt="مدخل مول البستان" className="aspect-[4/3] max-h-[240px] w-full object-cover object-[center_35%] img-grade-dark" loading="eager" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES — compact grid ═══════════ */}
      <section className="py-6 md:py-8" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-[1200px]">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-4 max-w-[28rem]">
              <p className="section-kicker">التصنيف التجاري</p>
              <h2 className="section-title">ستة أسواق متخصصة.</h2>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {primaryCategories.map((cat, i) => {
                const meta = categoryMeta[cat];
                const Icon = meta.icon;
                const count = stores?.filter((s) => s.category === cat).length ?? 0;
                const isActive = selectedCategory === cat;
                return (
                  <motion.div key={cat} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <button
                      onClick={() => {
                        setSelectedCategory(isActive ? "" : cat);
                        document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`group flex w-full items-start gap-3 rounded-lg border bg-card p-3.5 text-right transition-all duration-200 ${
                        isActive
                          ? "border-primary/30 shadow-[var(--shadow-elevated)]"
                          : "border-border hover:border-primary/15 hover:shadow-[var(--shadow-card)]"
                      }`}
                      style={isActive ? { background: "hsl(var(--primary) / 0.04)" } : {}}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary transition-colors group-hover:border-primary/20 group-hover:bg-primary/5">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-[0.86rem] font-bold light-heading truncate">{cat}</h3>
                          <span className="font-poppins text-[0.62rem] font-bold light-meta shrink-0">0{i + 1}</span>
                        </div>
                        <p className="mt-0.5 text-[0.78rem] leading-5 light-body line-clamp-1">{meta.brief}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[0.62rem] font-bold light-muted">{meta.label}</span>
                          {count > 0 && <span className="text-[0.68rem] font-bold text-primary">{count} متجر</span>}
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ═══════════ DIRECTORY ═══════════ */}
      <section id="directory" className="heritage-deep py-6 md:py-8 scroll-mt-20">
        <div className="container max-w-[1200px]">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="section-kicker dark-kicker">دليل المتاجر</p>
                <h2 className="section-title dark-heading">
                  {selectedCategory || "جميع المتاجر"}
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
                  placeholder="ابحث باسم المتجر أو الفئة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 w-full rounded-lg pr-10 pl-4 text-[0.88rem] outline-none transition-colors"
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

            {/* store grid or ecosystem state */}
            {isLoading ? (
              <LoadingGrid count={6} />
            ) : filtered && filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* ═══════════ FEATURED STORES ═══════════ */}
      {featuredStores.length > 0 && (
        <section className="py-6 md:py-8" style={{ background: "#F5F2EC" }}>
          <div className="container max-w-[1200px]">
            <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="mb-5">
                <p className="section-kicker">وجهات بارزة</p>
                <h2 className="section-title">علامات رائدة داخل المول.</h2>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {featuredStores.slice(0, 8).map((store) => (
                  <Link
                    key={store.id}
                    to={`/stores/${store.slug}`}
                    className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3.5 transition-all hover:border-primary/15 hover:shadow-[var(--shadow-card)]"
                  >
                    {store.logo_url ? (
                      <img src={store.logo_url} alt={store.name_ar} className="h-10 w-10 rounded-lg border border-border object-contain" loading="lazy" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                        <Store className="h-4 w-4" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-[0.86rem] font-bold light-heading group-hover:text-primary">{store.name_ar}</h3>
                      {store.category && <p className="mt-0.5 text-[0.68rem] light-muted">{store.category}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════ MAP CONNECTION — compact ═══════════ */}
      <section className="py-6 md:py-8" style={{ background: featuredStores.length > 0 ? "#FAFAF8" : "#F5F2EC" }}>
        <div className="container max-w-[1200px]">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_1fr] lg:gap-10">
              <div className="space-y-3.5">
                <div className="chapter-shell pt-4">
                  <p className="section-kicker">الخريطة التجارية</p>
                  <h2 className="section-title max-w-[20rem]">استكشف المتاجر على الخريطة.</h2>
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

              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Building2, v: "3 أدوار", l: "خريطة لكل دور" },
                    { icon: TrendingUp, v: "50+", l: "وحدة تجارية" },
                    { icon: MapPin, v: `${primaryCategories.length}`, l: "فئة متخصصة" },
                  ].map((item) => (
                    <div key={item.l} className="rounded-lg border border-border bg-card px-3 py-2.5 text-center">
                      <item.icon className="mx-auto h-4 w-4 text-primary" />
                      <p className="mt-1 text-[0.82rem] font-bold light-heading">{item.v}</p>
                      <p className="mt-0.5 text-[0.64rem] light-muted">{item.l}</p>
                    </div>
                  ))}
                </div>
                <div className="editorial-frame overflow-hidden rounded-xl">
                  <img src={interiorImage} alt="المشهد الداخلي" className="img-grade aspect-[16/9] max-h-[160px] w-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ═══════════ DIGITAL FUTURE — minimal ═══════════ */}
      <section className="heritage-deep relative overflow-hidden py-7 md:py-9">
        <div className="relative container max-w-3xl">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="mx-auto max-w-[26rem] text-center">
              <p className="section-kicker dark-kicker">المرحلة القادمة</p>
              <h2 className="section-title dark-heading">من دليل متاجر إلى سوق رقمي.</h2>
            </div>

            <div className="mx-auto mt-5 grid max-w-2xl gap-2.5 sm:grid-cols-3">
              {[
                { n: "01", icon: Compass, title: "الدليل التفاعلي", desc: "خريطة لكل دور.", active: true },
                { n: "02", icon: Store, title: "دليل المتاجر", desc: "كل علامة تجارية.", active: true },
                { n: "03", icon: Zap, title: "السوق الرقمي", desc: "تسوّق إلكتروني — قريبًا.", active: false },
              ].map((item) => (
                <div key={item.n} className="heritage-surface rounded-lg p-4 text-center">
                  <span className="font-poppins text-[0.62rem] font-bold" style={{ color: "#CDBB9A" }}>{item.n}</span>
                  <div className="mx-auto mt-2 mb-2 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: item.active ? "#2D6BFF14" : "#ffffff08", border: `1px solid ${item.active ? "#2D6BFF30" : "#ffffff10"}` }}>
                    <item.icon className="h-4 w-4" style={{ color: item.active ? "#5B9AFF" : "#7C8BA1" }} />
                  </div>
                  <p className="text-[0.84rem] font-bold dark-heading">{item.title}</p>
                  <p className="mt-0.5 text-[0.76rem] leading-5 dark-muted">{item.desc}</p>
                  {item.active && (
                    <span className="mt-2 inline-flex rounded-full px-2 py-0.5 text-[0.62rem] font-bold" style={{ background: "#2D6BFF14", color: "#5B9AFF", border: "1px solid #2D6BFF25" }}>
                      متاح الآن
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 text-center">
              <Link to="/">
                <Button className="h-9 rounded-lg border px-5 text-[0.82rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
                  رؤية المول الكاملة
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ CLOSING CTA ═══════════ */}
      <section className="py-7 md:py-9" style={{ background: "#F5F2EC" }}>
        <div className="container max-w-[720px] text-center">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-[2px] w-5 rounded-full" style={{ background: "#CDBB9A" }} />
              <span className="font-poppins text-[0.58rem] font-bold tracking-[0.22em] uppercase light-muted">ابدأ من هنا</span>
              <div className="h-[2px] w-5 rounded-full" style={{ background: "#CDBB9A" }} />
            </div>
            <h2 className="mx-auto max-w-[22rem] text-[1.2rem] font-bold leading-[1.15] md:text-[1.45rem] light-heading">
              المول جاهز — والقرار بيدك.
            </h2>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link to="/map">
                <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.82rem] font-bold">
                  <Compass className="ml-2 h-4 w-4" /> الخريطة التفاعلية
                </Button>
              </Link>
              <Link to="/leasing">
                <Button variant="orange" className="h-9 rounded-lg px-5 text-[0.82rem] font-bold">
                  <Phone className="ml-2 h-4 w-4" /> استفسار التأجير
                </Button>
              </Link>
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
      className="rounded-full px-3 py-1 text-[0.74rem] font-bold transition-all"
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.35 }}>
      <Link
        to={`/stores/${store.slug}`}
        className="group flex flex-col rounded-lg p-4 transition-all duration-300"
        style={{ border: "1px solid #ffffff12", background: "#ffffff06" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2D6BFF40"; e.currentTarget.style.background = "#ffffff0A"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ffffff12"; e.currentTarget.style.background = "#ffffff06"; }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.name_ar} className="h-9 w-9 rounded-lg object-cover" style={{ border: "1px solid #ffffff14" }} loading="lazy" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "#ffffff0A", border: "1px solid #ffffff14" }}>
                <Store className="h-4 w-4" style={{ color: "#5B9AFF" }} />
              </div>
            )}
            <div>
              <h3 className="text-[0.88rem] font-bold dark-heading transition-colors group-hover:text-primary">{store.name_ar}</h3>
              {store.category && <span className="mt-0.5 inline-block text-[0.68rem] dark-muted">{store.category}</span>}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[0.62rem] font-bold" style={{ border: "1px solid #ffffff14", color: "#94A3B8" }}>
            <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
            {st.text}
          </div>
        </div>

        <p className="mt-2 flex-1 text-[0.78rem] leading-5 dark-body line-clamp-2">
          {store.short_description_ar ?? "متجر ضمن دليل مول البستان التقني."}
        </p>

        <div className="mt-3 flex items-center justify-between pt-2" style={{ borderTop: "1px solid #ffffff0A" }}>
          <div className="flex items-center gap-2.5 text-[0.68rem] dark-muted">
            {store.unit_code && (
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{store.unit_code}</span>
            )}
            {store.featured && (
              <span className="rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold" style={{ border: "1px solid #2D6BFF25", background: "#2D6BFF14", color: "#5B9AFF" }}>
                مميّز
              </span>
            )}
          </div>
          <ArrowLeft className="h-3 w-3 dark-muted transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-primary" />
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Compact ecosystem state ── */
function EcosystemGrowingState() {
  return (
    <div className="space-y-4">
      <div className="heritage-surface rounded-xl p-6 text-center md:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "#2D6BFF14", border: "1px solid #2D6BFF30" }}>
          <Store className="h-5 w-5" style={{ color: "#5B9AFF" }} />
        </div>
        <h3 className="mt-4 text-[1.05rem] font-bold dark-heading">الدليل يتجهّز — والمتاجر في الطريق.</h3>
        <p className="mx-auto mt-2 max-w-sm text-[0.84rem] leading-6 dark-body">
          المتاجر تنضم تدريجيًا مع اقتراب الافتتاح.
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

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {primaryCategories.map((cat) => {
          const meta = categoryMeta[cat];
          const Icon = meta.icon;
          return (
            <div key={cat} className="heritage-surface flex items-center gap-3 rounded-lg p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "#2D6BFF14", border: "1px solid #2D6BFF25" }}>
                <Icon className="h-3.5 w-3.5" style={{ color: "#5B9AFF" }} />
              </div>
              <div>
                <p className="text-[0.82rem] font-bold dark-heading">{cat}</p>
                <p className="mt-0.5 text-[0.72rem] dark-muted">{meta.brief}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-5 pt-1">
        {[
          { icon: Users, text: "متاجر تنضم تدريجيًا" },
          { icon: TrendingUp, text: "دليل يتحدث تلقائيًا" },
          { icon: Layers3, text: "تصنيف جاهز" },
        ].map((c) => (
          <div key={c.text} className="flex items-center gap-1.5">
            <c.icon className="h-3.5 w-3.5" style={{ color: "#5B9AFF" }} />
            <span className="text-[0.74rem] font-semibold dark-subheading">{c.text}</span>
          </div>
        ))}
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
      <h3 className="mt-4 text-[0.98rem] font-bold dark-heading">لا توجد نتائج</h3>
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
