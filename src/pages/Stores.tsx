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
import { Button } from "@/components/ui/button";
import { LoadingGrid } from "@/components/ui/loading-states";
import entranceImage from "@/assets/mall-entrance.jpg";
import interiorImage from "@/assets/mall-interior.jpg";

/* ─── category metadata ─── */
const categoryMeta: Record<string, { icon: typeof Store; label: string; desc: string }> = {
  "الهواتف والإكسسوارات": { icon: Smartphone, label: "احتياج يومي سريع", desc: "تشكيلة شاملة من الهواتف والملحقات والحلول التقنية اليومية." },
  "الكمبيوتر والأجهزة": { icon: Monitor, label: "أداء واحتراف", desc: "أجهزة محمولة ومكتبية من علامات رائدة — للعمل والدراسة والإنتاجية." },
  "الألعاب والترفيه": { icon: CircuitBoard, label: "عالم الجيمنج", desc: "أجهزة ألعاب وملحقات وتجربة ترفيه رقمية متكاملة." },
  "الطباعة والتصوير": { icon: Globe, label: "حلول مكتبية", desc: "حلول طباعة وتصوير للمؤسسات والطلاب وأصحاب الأعمال." },
  "الشبكات والأنظمة الأمنية": { icon: Shield, label: "بنية تحتية", desc: "شبكات وكاميرات مراقبة وأنظمة حماية متقدمة." },
  "الشبكات والحماية": { icon: Shield, label: "بنية تحتية", desc: "شبكات وكاميرات مراقبة وأنظمة حماية متقدمة." },
  "الصيانة والدعم الفني": { icon: Wrench, label: "دعم فني معتمد", desc: "مراكز صيانة متخصصة وخدمة إصلاح فورية." },
};

const statusConfig: Record<string, { text: string; dot: string }> = {
  leased: { text: "نشط", dot: "bg-primary" },
  available: { text: "متاح للتأجير", dot: "bg-orange" },
  "coming-soon": { text: "قريبًا", dot: "bg-accent" },
};

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
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

  return (
    <MainLayout>
      <SEOHead
        title="دليل المتاجر"
        titleEn="Stores Directory"
        description="تصفح جميع المتاجر في مول البستان — أجهزة، هواتف، جيمنج، صيانة، وأكثر. دليل تقني منظّم في القاهرة الجديدة."
        descriptionEn="Browse all stores at Mall Elbostan — phones, computers, gaming, and more."
        breadcrumbs={[{ name: "المتاجر", url: "/stores" }]}
      />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden" style={{ background: "hsl(222 38% 6%)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 75% 50%, hsl(222 58% 38% / 0.06), transparent 70%)" }} />

        <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-14">
          <div className="grid min-h-[58vh] items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:py-0">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-7">
              <div className="flex items-center gap-3">
                <div className="h-[3px] w-10 rounded-full" style={{ background: "hsl(30 22% 48%)" }} />
                <span className="font-poppins text-[0.72rem] font-bold tracking-[0.2em] uppercase dark-accent">
                  دليل المتاجر التقنية
                </span>
              </div>

              <h1 className="max-w-[26rem] text-[2.4rem] leading-[1.02] md:text-[3.2rem] lg:text-[3.6rem] dark-heading">
                دليل المتاجر — منظّم بدقة وجاهز للاستكشاف.
              </h1>

              <p className="max-w-[28rem] text-[0.98rem] leading-[2] dark-body">
                كل متجر في مول البستان ظاهر بفئته وحالته وموقعه على الخريطة.
                ابحث بالاسم أو الفئة، واعرف التفاصيل قبل الزيارة.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <a href="#directory">
                  <Button variant="cta" size="lg" className="h-12 gap-2 rounded-xl px-8 font-bold">
                    <Search className="h-4 w-4" /> ابدأ التصفح
                  </Button>
                </a>
                <Link to="/map">
                  <Button size="lg" className="h-12 gap-2 rounded-xl border px-8 font-semibold" style={{ borderColor: "hsl(0 0% 100% / 0.12)", background: "hsl(0 0% 100% / 0.06)", color: "hsl(38 14% 92%)" }}>
                    <Compass className="h-4 w-4" /> الخريطة التفاعلية
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 border-t pt-6" style={{ borderColor: "hsl(0 0% 100% / 0.1)" }}>
                {[
                  { v: `${totalStores}+`, l: "متجر" },
                  { v: `${categories.length}`, l: "فئة تقنية" },
                  { v: "3", l: "أدوار" },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-5">
                    <div>
                      <p className="font-poppins text-[1.5rem] font-extrabold dark-heading">{s.v}</p>
                      <p className="text-[0.72rem] font-semibold dark-muted">{s.l}</p>
                    </div>
                    {i < 2 && <div className="h-8 w-px" style={{ background: "hsl(0 0% 100% / 0.1)" }} />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* image */}
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="hidden lg:flex lg:items-center lg:justify-center">
              <div className="relative w-full max-w-[400px]">
                <div className="editorial-frame-dark overflow-hidden rounded-2xl">
                  <div className="image-shell img-wash-dark aspect-[3/4]">
                    <img src={entranceImage} alt="مدخل مول البستان" className="img-grade-dark h-full w-full object-cover" loading="eager" />
                  </div>
                </div>
                <div className="absolute -bottom-5 -right-5 w-[34%]">
                  <div className="editorial-frame-dark overflow-hidden rounded-xl">
                    <div className="image-shell img-wash-dark aspect-[1/1]">
                      <img src={interiorImage} alt="متاجر المول من الداخل" className="img-grade-dark h-full w-full object-cover" loading="lazy" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ═══ CATEGORIES ═══ */}
      <section className="section-ivory page-section">
        <div className="container max-w-[1200px]">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mx-auto mb-10 max-w-[34rem] text-center">
              <p className="section-kicker">التصنيف التقني</p>
              <h2 className="section-title">فئات دقيقة تختصر المسار لما تبحث عنه.</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(categoryMeta).map(([cat, meta]) => {
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
                    className={`card-architectural group flex items-start gap-4 p-5 text-right transition-all ${isActive ? "shadow-[var(--shadow-elevated)]" : "hover:shadow-[var(--shadow-card)]"}`}
                    style={isActive ? { borderColor: "hsl(var(--primary) / 0.3)", background: "hsl(var(--primary) / 0.04)" } : {}}
                  >
                    <div className="icon-shell h-11 w-11 shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[0.95rem] font-bold text-foreground">{cat}</p>
                      <p className="mt-1 text-[0.82rem] leading-6 text-muted-foreground">{meta.desc}</p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="mini-chip text-[0.68rem]">{meta.label}</span>
                        {count > 0 && <span className="text-[0.74rem] font-bold text-primary">{count} متجر</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ DIRECTORY ═══ */}
      <section id="directory" className="heritage-deep page-section scroll-mt-20">
        <div className="container max-w-[1200px]">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="section-kicker dark-kicker">دليل المتاجر</p>
                <h2 className="section-title dark-heading">
                  {selectedCategory || "جميع المتاجر"}
                  {filtered ? ` (${filtered.length})` : ""}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[0.84rem] dark-muted">
                <Building2 className="h-4 w-4" />
                <span>{activeCount} متجر نشط من أصل {totalStores}</span>
              </div>
            </div>

            {/* search + filters */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 dark-muted" />
                <input
                  type="text"
                  placeholder="ابحث باسم المتجر أو الفئة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-13 w-full rounded-xl pr-12 pl-4 text-[0.95rem] outline-none transition-colors"
                  style={{ border: "1px solid hsl(0 0% 100% / 0.1)", background: "hsl(0 0% 100% / 0.05)", color: "hsl(38 14% 95%)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.4)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(0 0% 100% / 0.1)"; }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 dark-muted" />
                <FilterChip active={!selectedCategory} onClick={() => setSelectedCategory("")}>الكل</FilterChip>
                {categories.map((cat) => (
                  <FilterChip key={cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat!)}>
                    {cat}
                  </FilterChip>
                ))}
                <span className="mx-1 h-4 w-px" style={{ background: "hsl(0 0% 100% / 0.1)" }} />
                {Object.entries(statusConfig).map(([key, val]) => (
                  <FilterChip key={key} active={selectedStatus === key} onClick={() => setSelectedStatus(selectedStatus === key ? "" : key)}>
                    {val.text}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* store grid */}
            {isLoading ? (
              <LoadingGrid count={6} />
            ) : filtered && filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((store, i) => (
                  <StoreCard key={store.id} store={store} index={i} />
                ))}
              </div>
            ) : (
              <DirectoryEmpty onReset={() => { setSearch(""); setSelectedCategory(""); setSelectedStatus(""); }} />
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURED ═══ */}
      {featuredStores.length > 0 && (
        <section className="page-section">
          <div className="container max-w-[1200px]">
            <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <p className="section-kicker">وجهات بارزة</p>
              <h2 className="section-title mb-8">علامات تقنية رائدة داخل المول.</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featuredStores.slice(0, 4).map((store) => (
                  <Link
                    key={store.id}
                    to={`/stores/${store.slug}`}
                    className="card-editorial group flex flex-col items-center gap-3 p-6 text-center transition-all hover:shadow-[var(--shadow-elevated)]"
                  >
                    {store.logo_url ? (
                      <img src={store.logo_url} alt={store.name_ar} className="h-14 w-14 rounded-xl object-cover" loading="lazy" />
                    ) : (
                      <div className="icon-shell h-14 w-14"><Store className="h-6 w-6" /></div>
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

      {/* ═══ MAP CONNECTION ═══ */}
      <section className="section-soft page-section">
        <div className="container max-w-[1200px]">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
              <div className="space-y-6">
                <p className="section-kicker">الربط بالخريطة</p>
                <h2 className="section-title max-w-[24rem]">كل متجر مرتبط بموقعه الفعلي — اعرف مكانه قبل الزيارة.</h2>
                <p className="text-[0.98rem] leading-[2] text-muted-foreground">
                  الخريطة التفاعلية تعرض كل وحدة بحالتها — نشطة، متاحة، أو قادمة.
                  اضغط على أي متجر لتنتقل مباشرة لموقعه الدقيق في الدور المحدد.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/map">
                    <Button variant="cta" size="lg" className="h-12 gap-2 rounded-xl px-8 font-bold">
                      <Compass className="h-4 w-4" /> افتح الخريطة
                    </Button>
                  </Link>
                  <Link to="/leasing">
                    <Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8">فرص التأجير</Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Building2, v: "3 أدوار", l: "خريطة تفاعلية لكل دور" },
                    { icon: TrendingUp, v: `${activeCount}+`, l: "متجر نشط حاليًا" },
                    { icon: MapPin, v: "50+", l: "وحدة تجارية" },
                  ].map((item) => (
                    <div key={item.l} className="stat-block">
                      <item.icon className="mx-auto h-5 w-5 text-primary" />
                      <p className="mt-2 text-sm font-bold text-foreground">{item.v}</p>
                      <p className="mt-0.5 text-[0.72rem] text-muted-foreground">{item.l}</p>
                    </div>
                  ))}
                </div>
                <div className="image-architectural aspect-[16/9] overflow-hidden">
                  <img src={interiorImage} alt="المشهد الداخلي لمول البستان" className="img-grade h-full w-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FUTURE MARKETPLACE ═══ */}
      <section className="heritage-deep page-section">
        <div className="container max-w-[900px] text-center">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="section-kicker dark-kicker">المرحلة القادمة</p>
            <h2 className="section-title mx-auto max-w-[26rem] dark-heading">من دليل متاجر إلى سوق رقمي متكامل.</h2>
            <p className="mx-auto mt-4 max-w-[30rem] text-base leading-8 dark-body">
              الدليل الحالي هو الأساس — المرحلة التالية تتيح تصفّح المنتجات مباشرة،
              متابعة العروض، والشراء إلكترونيًا من متاجر المول.
            </p>

            <div className="mx-auto mt-8 grid max-w-[36rem] gap-4 sm:grid-cols-3">
              {[
                { n: "01", title: "الدليل التفاعلي", active: true },
                { n: "02", title: "دليل المتاجر", active: true },
                { n: "03", title: "السوق الرقمي", active: false },
              ].map((phase) => (
                <div key={phase.n} className="heritage-surface p-5 text-center">
                  <span className="font-poppins text-sm font-bold" style={{ color: phase.active ? "hsl(220 55% 62%)" : "hsl(220 12% 38%)" }}>{phase.n}</span>
                  <p className="mt-2 text-[0.92rem] font-bold dark-heading">{phase.title}</p>
                  {phase.active && (
                    <span className="mt-3 inline-flex rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold" style={{ border: "1px solid hsl(220 50% 42% / 0.2)", background: "hsl(220 50% 42% / 0.12)", color: "hsl(220 55% 62%)" }}>
                      متاح الآن
                    </span>
                  )}
                </div>
              ))}
            </div>

            <Link to="/" className="mt-8 inline-block">
              <Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8">اكتشف رؤية المول الكاملة</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

/* ── Sub-components ── */

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-[0.8rem] font-bold transition-all"
      style={active
        ? { border: "1px solid hsl(var(--primary) / 0.35)", background: "hsl(var(--primary) / 0.14)", color: "hsl(220 55% 62%)" }
        : { border: "1px solid hsl(0 0% 100% / 0.1)", background: "hsl(0 0% 100% / 0.05)", color: "hsl(220 12% 70%)" }
      }
    >
      {children}
    </button>
  );
}

function StoreCard({ store, index }: { store: { id: string; slug: string; name_ar: string; name_en: string | null; category: string | null; short_description_ar: string | null; logo_url: string | null; status: string; unit_code: string | null; featured: boolean }; index: number }) {
  const st = statusConfig[store.status] ?? statusConfig["leased"];
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.035, 0.35), duration: 0.4 }}>
      <Link
        to={`/stores/${store.slug}`}
        className="group flex flex-col rounded-xl p-5 transition-all duration-300"
        style={{ border: "1px solid hsl(0 0% 100% / 0.08)", background: "hsl(0 0% 100% / 0.03)" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.25)"; e.currentTarget.style.background = "hsl(0 0% 100% / 0.055)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(0 0% 100% / 0.08)"; e.currentTarget.style.background = "hsl(0 0% 100% / 0.03)"; }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.name_ar} className="h-11 w-11 rounded-lg object-cover" style={{ border: "1px solid hsl(0 0% 100% / 0.1)" }} loading="lazy" />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-lg" style={{ background: "hsl(0 0% 100% / 0.06)", border: "1px solid hsl(0 0% 100% / 0.1)" }}>
                <Store className="h-5 w-5" style={{ color: "hsl(220 55% 62%)" }} />
              </div>
            )}
            <div>
              <h3 className="text-[0.95rem] font-bold transition-colors dark-heading group-hover:text-primary">{store.name_ar}</h3>
              {store.category && <span className="mt-0.5 inline-block text-[0.74rem] dark-muted">{store.category}</span>}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-bold" style={{ border: "1px solid hsl(0 0% 100% / 0.1)", color: "hsl(220 12% 74%)" }}>
            <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
            {st.text}
          </div>
        </div>

        <p className="mt-3 flex-1 text-[0.84rem] leading-6 dark-body">
          {store.short_description_ar ?? "متجر ضمن دليل مول البستان التقني — التفاصيل قيد التحديث."}
        </p>

        <div className="mt-4 flex items-center justify-between pt-3" style={{ borderTop: "1px solid hsl(0 0% 100% / 0.06)" }}>
          <div className="flex items-center gap-3 text-[0.74rem] dark-muted">
            {store.unit_code && (
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{store.unit_code}</span>
            )}
            {store.featured && (
              <span className="rounded-full px-2 py-0.5 text-[0.65rem] font-bold" style={{ border: "1px solid hsl(220 50% 42% / 0.2)", background: "hsl(220 50% 42% / 0.1)", color: "hsl(220 55% 62%)" }}>
                مميّز
              </span>
            )}
          </div>
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 dark-muted group-hover:-translate-x-1 group-hover:text-primary" />
        </div>
      </Link>
    </motion.div>
  );
}

function DirectoryEmpty({ onReset }: { onReset: () => void }) {
  return (
    <div className="heritage-surface p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "hsl(0 0% 100% / 0.06)", border: "1px solid hsl(0 0% 100% / 0.1)" }}>
        <Layers3 className="h-7 w-7" style={{ color: "hsl(220 55% 62%)" }} />
      </div>
      <h3 className="mt-5 text-xl font-bold dark-heading">لا توجد نتائج ضمن هذا التصفية</h3>
      <p className="mx-auto mt-2 max-w-sm text-[0.9rem] leading-7 dark-body">
        عدّل الفلتر أو جرّب كلمة بحث مختلفة. الدليل يتم تحديثه مع انضمام متاجر جديدة.
      </p>
      <button onClick={onReset} className="mt-5 rounded-lg px-5 py-2 text-[0.85rem] font-bold transition-colors" style={{ border: "1px solid hsl(0 0% 100% / 0.14)", background: "hsl(0 0% 100% / 0.06)", color: "hsl(220 12% 76%)" }}>
        إعادة ضبط الفلاتر
      </button>
    </div>
  );
}

export default Stores;
