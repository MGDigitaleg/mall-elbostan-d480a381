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
  Search,
  Shield,
  Smartphone,
  Store,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingGrid, EmptyState } from "@/components/ui/loading-states";
import entranceImage from "@/assets/mall-entrance.jpg";
import interiorImage from "@/assets/mall-interior.jpg";

/* ─── category metadata ─── */
const categoryMeta: Record<string, { icon: typeof Store; label: string; desc: string }> = {
  "الهواتف والإكسسوارات": { icon: Smartphone, label: "احتياج يومي مباشر", desc: "تشكيلة شاملة من الهواتف والملحقات والحلول التقنية اليومية." },
  "الكمبيوتر والأجهزة": { icon: Monitor, label: "أداء واحتراف", desc: "أجهزة محمولة ومكتبية من علامات رائدة — للعمل والدراسة والإنتاجية." },
  "الألعاب والترفيه": { icon: CircuitBoard, label: "عالم الجيمنج", desc: "أجهزة ألعاب وملحقات وتجربة ترفيه رقمية متكاملة." },
  "الطباعة والتصوير": { icon: Globe, label: "خدمات مهنية", desc: "حلول طباعة وتصوير للمؤسسات والطلاب وأصحاب الأعمال." },
  "الشبكات والأنظمة الأمنية": { icon: Shield, label: "بنية تحتية", desc: "شبكات وكاميرات مراقبة وأنظمة حماية متقدمة." },
  "الشبكات والحماية": { icon: Shield, label: "بنية تحتية", desc: "شبكات وكاميرات مراقبة وأنظمة حماية متقدمة." },
  "الصيانة والدعم الفني": { icon: Wrench, label: "دعم فني معتمد", desc: "مراكز صيانة متخصصة وخدمة إصلاح فورية." },
};

const statusLabel: Record<string, { text: string; cls: string }> = {
  leased: { text: "نشط", cls: "border-primary/20 bg-primary/8 text-primary" },
  available: { text: "متاح للتأجير", cls: "border-orange/20 bg-orange/8 text-orange" },
  "coming-soon": { text: "قريبًا", cls: "border-accent/20 bg-accent/8 text-accent" },
};

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const Stores = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState("");

  /* ─── fetch stores ─── */
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

  /* ─── derived data ─── */
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

  return (
    <MainLayout>
      <SEOHead
        title="دليل المتاجر"
        titleEn="Stores Directory"
        description="تصفح جميع المتاجر في مول البستان — أجهزة، هواتف، جيمنج، صيانة، وأكثر. دليل تقني منظّم في القاهرة الجديدة."
        descriptionEn="Browse all stores at Mall Elbostan — phones, computers, gaming, and more."
        breadcrumbs={[{ name: "المتاجر", url: "/stores" }]}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-[hsl(222_44%_7%)]">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(hsl(0 0% 100% / 0.02) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.02) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-14">
          <div className="grid min-h-[70vh] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-0">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="space-y-6"
            >
              <span className="eyebrow-chip border-white/15 bg-white/8 text-[0.76rem] text-white/70">
                <Store className="h-4 w-4" />
                دليل المتاجر التقنية
              </span>

              <h1 className="max-w-[28rem] text-[2rem] font-extrabold leading-[1.08] text-white md:text-[2.8rem] lg:text-[3.4rem]">
                دليل المتاجر — منظّم بدقة وجاهز للاستكشاف.
              </h1>

              <p className="max-w-[28rem] text-[1rem] leading-[2] text-white/50 md:text-[1.1rem]">
                كل متجر في مول البستان ظاهر بفئته وحالته وموقعه على الخريطة.
                ابحث بالاسم أو الفئة، واعرف التفاصيل قبل الزيارة.
              </p>

              {/* quick stats */}
              <div className="flex flex-wrap gap-3 pt-1">
                {[
                  { v: `${totalStores}+`, l: "متجر" },
                  { v: `${categories.length}`, l: "فئة تقنية" },
                  { v: "3", l: "أدوار" },
                ].map((s) => (
                  <div key={s.l} className="heritage-card rounded-xl px-5 py-3 text-center">
                    <p className="font-poppins text-lg font-bold text-white">{s.v}</p>
                    <p className="mt-0.5 text-[0.72rem] text-white/40">{s.l}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#directory">
                  <Button variant="cta" size="lg" className="h-12 rounded-xl px-7 font-bold">
                    <Search className="ml-2 h-4 w-4" />
                    ابدأ التصفح
                  </Button>
                </a>
                <Link to="/map">
                  <Button size="lg" className="h-12 rounded-xl border border-white/15 bg-white/8 px-7 font-semibold text-white backdrop-blur-sm hover:bg-white/14">
                    <Compass className="ml-2 h-4 w-4" />
                    الخريطة التفاعلية
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-full max-w-[460px]">
                <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                  <div className="image-shell aspect-[4/5]">
                    <img src={entranceImage} alt="مدخل مول البستان" className="h-full w-full object-cover" loading="eager" />
                    <div className="image-wash absolute inset-0" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-[42%] overflow-hidden rounded-xl ring-1 ring-white/10">
                  <div className="image-shell aspect-[3/4]">
                    <img src={interiorImage} alt="متاجر المول من الداخل" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES OVERVIEW ═══════════ */}
      <section className="page-section">
        <div className="container max-w-[1200px]">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mx-auto mb-10 max-w-[34rem] text-center">
              <p className="section-kicker">التصنيف التقني</p>
              <h2 className="section-title">فئات دقيقة تختصر المسار لما تبحث عنه.</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(categoryMeta).map(([cat, meta]) => {
                const Icon = meta.icon;
                const count = stores?.filter((s) => s.category === cat).length ?? 0;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(selectedCategory === cat ? "" : cat);
                      document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`group flex items-start gap-4 rounded-xl border p-5 text-right transition-all hover:shadow-[var(--shadow-card)] ${
                      selectedCategory === cat
                        ? "border-primary/30 bg-primary/5 shadow-[var(--shadow-card)]"
                        : "border-border bg-card hover:border-primary/15"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[0.95rem] font-bold text-foreground">{cat}</p>
                      <p className="mt-1 text-[0.8rem] leading-6 text-muted-foreground">{meta.desc}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[0.7rem] font-semibold text-muted-foreground">{meta.label}</span>
                        {count > 0 && <span className="text-[0.72rem] text-primary font-semibold">{count} متجر</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ DIRECTORY — SEARCH + FILTERS + GRID ═══════════ */}
      <section id="directory" className="heritage-section page-section scroll-mt-20">
        <div className="container max-w-[1200px]">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            {/* header */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="section-kicker">دليل المتاجر</p>
                <h2 className="section-title">
                  {selectedCategory ? selectedCategory : "جميع المتاجر"}
                  {filtered ? ` (${filtered.length})` : ""}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[0.82rem] text-white/40">
                <Building2 className="h-4 w-4" />
                <span>{activeCount} متجر نشط من أصل {totalStores}</span>
              </div>
            </div>

            {/* search + filters bar */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="ابحث باسم المتجر أو الفئة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-13 w-full rounded-xl border border-white/10 bg-white/5 pr-12 pl-4 text-[0.95rem] text-white placeholder:text-white/25 outline-none transition-colors focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-white/30" />

                {/* category chips */}
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`rounded-full border px-3.5 py-1.5 text-[0.78rem] font-semibold transition-all ${
                    !selectedCategory ? "border-primary/30 bg-primary/15 text-primary" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                  }`}
                >
                  الكل
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat!)}
                    className={`rounded-full border px-3.5 py-1.5 text-[0.78rem] font-semibold transition-all ${
                      selectedCategory === cat ? "border-primary/30 bg-primary/15 text-primary" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}

                <span className="mx-1 h-4 w-px bg-white/10" />

                {/* status chips */}
                {Object.entries(statusLabel).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedStatus(selectedStatus === key ? "" : key)}
                    className={`rounded-full border px-3.5 py-1.5 text-[0.78rem] font-semibold transition-all ${
                      selectedStatus === key ? "border-primary/30 bg-primary/15 text-primary" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                    }`}
                  >
                    {val.text}
                  </button>
                ))}
              </div>
            </div>

            {/* store grid */}
            {isLoading ? (
              <LoadingGrid count={6} />
            ) : filtered && filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((store, i) => {
                  const st = statusLabel[store.status] ?? statusLabel["leased"];
                  return (
                    <motion.div
                      key={store.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.4 }}
                    >
                      <Link
                        to={`/stores/${store.slug}`}
                        className="heritage-card group flex flex-col rounded-xl p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_24px_hsl(221_83%_53%/0.08)]"
                      >
                        {/* top row: logo + name + status */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {store.logo_url ? (
                              <img src={store.logo_url} alt={store.name_ar} className="h-11 w-11 rounded-lg object-cover ring-1 ring-white/10" loading="lazy" />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                                <Store className="h-5 w-5 text-primary" />
                              </div>
                            )}
                            <div>
                              <h3 className="text-[0.95rem] font-bold text-white transition-colors group-hover:text-primary">{store.name_ar}</h3>
                              {store.category && (
                                <span className="mt-0.5 inline-block text-[0.72rem] text-white/35">{store.category}</span>
                              )}
                            </div>
                          </div>
                          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold ${st.cls}`}>
                            {st.text}
                          </span>
                        </div>

                        {/* description */}
                        <p className="mt-3 flex-1 text-[0.82rem] leading-6 text-white/35">
                          {store.short_description_ar ?? "متجر ضمن دليل مول البستان التقني — التفاصيل قيد التحديث."}
                        </p>

                        {/* footer */}
                        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                          <div className="flex items-center gap-3 text-[0.72rem] text-white/30">
                            {store.unit_code && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {store.unit_code}
                              </span>
                            )}
                            {store.featured && (
                              <span className="rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 text-[0.65rem] font-semibold text-primary">
                                مميّز
                              </span>
                            )}
                          </div>
                          <ArrowLeft className="h-3.5 w-3.5 text-white/20 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-primary" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* premium empty state */
              <div className="heritage-card rounded-2xl p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <Layers3 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">لا توجد نتائج ضمن هذا التصفية</h3>
                <p className="mx-auto mt-2 max-w-sm text-[0.9rem] leading-7 text-white/40">
                  عدّل الفلتر أو جرّب كلمة بحث مختلفة. الدليل يتم تحديثه مع انضمام متاجر جديدة.
                </p>
                <button
                  onClick={() => { setSearch(""); setSelectedCategory(""); setSelectedStatus(""); }}
                  className="mt-5 rounded-lg border border-white/15 bg-white/5 px-5 py-2 text-[0.85rem] font-semibold text-white/60 transition-colors hover:bg-white/10"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURED STORES (if any) ═══════════ */}
      {featuredStores.length > 0 && (
        <section className="page-section">
          <div className="container max-w-[1200px]">
            <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <p className="section-kicker">وجهات بارزة</p>
              <h2 className="section-title mb-8">علامات تقنية رائدة داخل المول.</h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featuredStores.slice(0, 4).map((store) => (
                  <Link
                    key={store.id}
                    to={`/stores/${store.slug}`}
                    className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/20 hover:shadow-[var(--shadow-card)]"
                  >
                    {store.logo_url ? (
                      <img src={store.logo_url} alt={store.name_ar} className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/8">
                        <Store className="h-7 w-7 text-primary" />
                      </div>
                    )}
                    <h3 className="text-[0.95rem] font-bold text-foreground group-hover:text-primary">{store.name_ar}</h3>
                    {store.category && <span className="text-[0.72rem] text-muted-foreground">{store.category}</span>}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════ MAP CONNECTION + FUTURE VISION ═══════════ */}
      <section className="section-soft page-section">
        <div className="container max-w-[1200px]">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="space-y-5">
                <p className="section-kicker">الربط بالخريطة</p>
                <h2 className="section-title max-w-[24rem]">كل متجر مرتبط بموقعه الفعلي — اعرف مكانه قبل الزيارة.</h2>
                <p className="text-[0.95rem] leading-[2] text-muted-foreground">
                  الخريطة التفاعلية تعرض كل وحدة بحالتها — نشطة، متاحة، أو قادمة.
                  اضغط على أي متجر لتنتقل مباشرة لموقعه الدقيق في الدور المحدد.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/map">
                    <Button variant="cta" size="lg" className="h-12 rounded-xl px-7 font-bold">
                      <Compass className="ml-2 h-4 w-4" />
                      افتح الخريطة
                    </Button>
                  </Link>
                  <Link to="/leasing">
                    <Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-7">
                      فرص التأجير
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                {/* mini-stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Building2, v: "3 أدوار", l: "خريطة تفاعلية لكل دور" },
                    { icon: TrendingUp, v: `${activeCount}+`, l: "متجر نشط حاليًا" },
                    { icon: MapPin, v: "50+", l: "وحدة تجارية" },
                  ].map((item) => (
                    <div key={item.l} className="rounded-xl border border-border bg-card p-4 text-center">
                      <item.icon className="mx-auto h-5 w-5 text-primary" />
                      <p className="mt-2 text-sm font-bold text-foreground">{item.v}</p>
                      <p className="mt-0.5 text-[0.7rem] text-muted-foreground">{item.l}</p>
                    </div>
                  ))}
                </div>

                <div className="image-shell aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-border">
                  <img src={interiorImage} alt="المشهد الداخلي لمول البستان" className="h-full w-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FUTURE MARKETPLACE ═══════════ */}
      <section className="heritage-section page-section">
        <div className="container max-w-[900px] text-center">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="section-kicker">المرحلة القادمة</p>
            <h2 className="section-title mx-auto max-w-[26rem]">من دليل متاجر إلى سوق رقمي متكامل.</h2>
            <p className="mx-auto mt-4 max-w-[30rem] text-base leading-8 text-white/45">
              الدليل الحالي هو الأساس — المرحلة التالية تتيح تصفّح المنتجات مباشرة،
              متابعة العروض، والشراء إلكترونيًا من متاجر المول.
            </p>

            <div className="mx-auto mt-8 grid max-w-[36rem] gap-4 sm:grid-cols-3">
              {[
                { n: "01", title: "الدليل التفاعلي", active: true },
                { n: "02", title: "دليل المتاجر", active: true },
                { n: "03", title: "السوق الرقمي", active: false },
              ].map((phase) => (
                <div key={phase.n} className="heritage-card rounded-xl p-5 text-center">
                  <span className={`font-poppins text-sm font-bold ${phase.active ? "text-primary" : "text-primary/40"}`}>{phase.n}</span>
                  <p className="mt-2 text-[0.92rem] font-bold text-white">{phase.title}</p>
                  {phase.active && (
                    <span className="mt-3 inline-flex rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 text-[0.68rem] font-semibold text-primary">
                      متاح الآن
                    </span>
                  )}
                </div>
              ))}
            </div>

            <Link to="/" className="mt-8 inline-block">
              <Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8">
                اكتشف رؤية المول الكاملة
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Stores;
