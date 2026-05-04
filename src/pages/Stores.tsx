import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { trackSeoLinkClick } from "@/lib/analytics";
import { motion } from "framer-motion";
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
import { TenantLogo } from "@/components/TenantLogo";
import { getVerifiedLogoUrl } from "@/lib/tenantLogoRegistry";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildStoreListLd, buildCategoryListLd, buildCollectionPageLd } from "@/components/SEOHead";
import { PageHero } from "@/components/PageHero";
import { BackToTop } from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
  "coming-soon": { text: "قريباً", color: "#06B6D4", bg: "#06B6D415", border: "#06B6D430" },
};

/* ── Category-specific SEO intro content ── */
const categorySeoContent: Record<string, string> = {
  "الكمبيوتر والأجهزة": "تصفّح أفضل محلات الكمبيوتر واللابتوبات في مول البستان. أجهزة ديسكتوب، لابتوبات للعمل والدراسة والجيمنج، ملحقات، وشاشات من أبرز الماركات العالمية — كل ذلك في مكان واحد بالتجمع الخامس.",
  "الهواتف والإكسسوارات": "اعثر على أحدث الهواتف الذكية والإكسسوارات في مول البستان. سماعات، شواحن، كفرات، وأجهزة ذكية من جميع الماركات بأسعار تنافسية في القاهرة الجديدة.",
  "الألعاب والترفيه": "اكتشف عالم الجيمنج في مول البستان — أجهزة بلايستيشن، إكس بوكس، كروت شاشة، كراسي جيمنج، وملحقات الألعاب المتقدمة بالتجمع الخامس.",
  "الطباعة والتصوير": "محلات الطباعة والتصوير في مول البستان — طابعات، سكانرات، أحبار، وخدمات طباعة احترافية لكل احتياجات العمل والمشاريع.",
  "الشبكات والأنظمة الأمنية": "حلول الشبكات والأمن في مول البستان — راوترات، كاميرات مراقبة، أنظمة إنذار، وتجهيزات البنية التحتية التقنية.",
  "الصيانة والدعم الفني": "خدمات صيانة وإصلاح الكمبيوتر والموبايل في مول البستان — دعم فني متخصص، استبدال شاشات، إصلاح لابتوبات، واستعادة بيانات.",
};

function StoreSeoIntro({ category, totalStores, activeCount, topStores }: { category: string; totalStores: number; activeCount: number; topStores?: { name_ar: string; slug: string; unit_code: string | null }[] }) {
  const content = category ? categorySeoContent[category] : null;
  const otherCategories = primaryCategories.filter((c) => c !== category).slice(0, 3);

  return (
    <section className="bg-card dark:bg-background" style={{ paddingTop: "clamp(16px, 2vw, 24px)", paddingBottom: "clamp(12px, 1.5vw, 20px)" }}>
      <div className="container max-w-[1200px]">
        <p className="text-[0.78rem] leading-[2] text-muted-foreground max-w-3xl">
          {content ?? `يضم مول البستان ${totalStores > 0 ? totalStores : "أكثر من 150"} محل تجاري متخصص في الكمبيوتر، الموبايلات، الجيمنج، الإكسسوارات، والصيانة.${activeCount > 0 ? ` ${activeCount} محل نشط حالياً` : ""} على 3 أدوار في التجمع الخامس بالقاهرة الجديدة.`}
        </p>

        {/* Internal links to top stores in this category */}
        {topStores && topStores.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.72rem] leading-relaxed">
            <span className="text-muted-foreground/70 font-medium whitespace-nowrap">محلات مميزة:</span>
            {topStores.slice(0, 5).map((s, i) => (
              <span key={s.slug} className="inline-flex items-center gap-1">
                <Link
                  to={`/stores/${s.slug}`}
                  className="text-primary font-semibold hover:underline"
                  onClick={() => trackSeoLinkClick("stores_intro", "store", s.name_ar, `/stores/${s.slug}`)}
                >{s.name_ar}</Link>
                {s.unit_code && (
                  <Link
                    to={`/map?highlight=${encodeURIComponent(s.unit_code)}&store=${encodeURIComponent(s.name_ar)}`}
                    className="inline-flex items-center gap-0.5 text-muted-foreground/50 hover:text-primary transition-colors"
                    title={`عرض ${s.name_ar} على الخريطة`}
                    onClick={() => trackSeoLinkClick("stores_intro", "map_pin", s.name_ar, `/map?highlight=${s.unit_code}`)}
                  >
                    <MapPin className="h-3 w-3" />
                  </Link>
                )}
                {i < Math.min(topStores.length, 5) - 1 && <span className="text-muted-foreground/40 mx-1">•</span>}
              </span>
            ))}
          </div>
        )}

        {/* Cross-links to other categories and map */}
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.72rem] leading-relaxed">
          <span className="text-muted-foreground/70 font-medium whitespace-nowrap">تصفّح أيضاً:</span>
          {otherCategories.map((c, i) => (
            <span key={c} className="inline-flex items-center">
              <Link
                to={`/stores?category=${encodeURIComponent(c)}`}
                className="text-primary font-semibold hover:underline"
                onClick={() => trackSeoLinkClick("stores_intro", "category", c, `/stores?category=${encodeURIComponent(c)}`)}
              >{c}</Link>
              {i < otherCategories.length - 1 && <span className="text-muted-foreground/40 mx-1">•</span>}
            </span>
          ))}
          <span className="text-muted-foreground/30 mx-1">|</span>
          <Link
            to="/map"
            className="text-primary font-semibold hover:underline whitespace-nowrap"
            onClick={() => trackSeoLinkClick("stores_intro", "page", "الخريطة التفاعلية", "/map")}
          >الخريطة التفاعلية</Link>
        </div>
      </div>
    </section>
  );
}

type SortKey = "default" | "area_desc" | "area_asc" | "floor_asc" | "floor_desc";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "default",    label: "الترتيب الافتراضي" },
  { value: "area_desc",  label: "المساحة: الأكبر أولاً" },
  { value: "area_asc",   label: "المساحة: الأصغر أولاً" },
  { value: "floor_asc",  label: "الدور: من الأرضي للأعلى" },
  { value: "floor_desc", label: "الدور: من الأعلى للأرضي" },
];

const Stores = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("default");

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

  /* Floors lookup (id → sort_order, name) */
  const { data: floors } = useQuery({
    queryKey: ["stores-floors-lookup"],
    queryFn: async () => {
      const { data } = await supabase.from("floors").select("id, name_ar, sort_order");
      return data ?? [];
    },
    staleTime: 10 * 60 * 1000,
  });

  /* Units lookup (unit_code → area_sqm) for sort by area */
  const { data: units } = useQuery({
    queryKey: ["stores-units-area"],
    queryFn: async () => {
      const { data } = await supabase.from("units").select("unit_code, area_sqm");
      return data ?? [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const floorMap = useMemo(() => {
    const m = new Map<string, { name: string; order: number }>();
    floors?.forEach((f) => m.set(f.id, { name: f.name_ar, order: f.sort_order ?? 0 }));
    return m;
  }, [floors]);

  const areaMap = useMemo(() => {
    const m = new Map<string, number>();
    units?.forEach((u) => { if (u.unit_code) m.set(u.unit_code, u.area_sqm ?? 0); });
    return m;
  }, [units]);

  const categories = useMemo(() => [...new Set(stores?.map((s) => s.category).filter(Boolean) ?? [])], [stores]);

  const filtered = useMemo(() => {
    const list = stores?.filter((s) => {
      const q = search.trim();
      const matchSearch = !q || s.name_ar.includes(q) || s.name_en?.toLowerCase().includes(q.toLowerCase()) || s.category?.includes(q);
      const matchCategory = !selectedCategory || s.category === selectedCategory;
      const matchStatus = !selectedStatus || s.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    }) ?? [];

    if (sortBy === "default") return list;

    const sorted = [...list];
    if (sortBy === "area_desc" || sortBy === "area_asc") {
      const dir = sortBy === "area_desc" ? -1 : 1;
      sorted.sort((a, b) => {
        const aa = (a.unit_code && areaMap.get(a.unit_code)) || 0;
        const bb = (b.unit_code && areaMap.get(b.unit_code)) || 0;
        return (aa - bb) * dir;
      });
    } else {
      const dir = sortBy === "floor_asc" ? 1 : -1;
      sorted.sort((a, b) => {
        const ao = (a.floor_id && floorMap.get(a.floor_id)?.order) ?? 999;
        const bo = (b.floor_id && floorMap.get(b.floor_id)?.order) ?? 999;
        return (ao - bo) * dir;
      });
    }
    return sorted;
  }, [stores, search, selectedCategory, selectedStatus, sortBy, areaMap, floorMap]);

  const totalStores = stores?.length ?? 0;
  const activeCount = stores?.filter((s) => s.status === "leased").length ?? 0;
  const hasActiveFilters = !!search || !!selectedCategory || !!selectedStatus || sortBy !== "default";

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("");
    setSelectedStatus("");
    setSortBy("default");
  }, []);


  return (
    <MainLayout>
      <SEOHead
        title={selectedCategory ? `محلات ${selectedCategory} في مول البستان` : "دليل محلات الكمبيوتر والموبايلات والإلكترونيات"}
        titleEn={selectedCategory ? `${selectedCategory} Stores at Mall Elbostan` : "Computer, Mobile & Electronics Stores Directory"}
        description={selectedCategory
          ? `تصفح محلات ${selectedCategory} في مول البستان — ${filtered?.length ?? 0} محل متخصص بالتجمع الخامس، القاهرة الجديدة. اعثر على أفضل الأسعار والعروض.`
          : `تصفح جميع محلات مول البستان — ${activeCount > 0 ? `${activeCount} محل نشط` : "محلات"} في الكمبيوتر، اللابتوبات، الموبايلات، الجيمنج، والإكسسوارات بالتجمع الخامس، القاهرة.`
        }
        descriptionEn="Browse all stores at Mall Elbostan — computers, laptops, phones, gaming & accessories in New Cairo's Fifth Settlement."
        keywords={`محلات ${selectedCategory ?? "كمبيوتر"}, محلات موبايلات, دليل محلات, مول البستان, التجمع الخامس, لابتوب, جيمنج, إكسسوارات, القاهرة الجديدة`}
        breadcrumbs={selectedCategory
          ? [{ name: "المحلات", url: "/stores" }, { name: selectedCategory, url: `/stores?category=${encodeURIComponent(selectedCategory)}` }]
          : [{ name: "المحلات", url: "/stores" }]
        }
        jsonLd={[
          ...(filtered && filtered.length > 0
            ? [
                buildStoreListLd(filtered),
                buildCollectionPageLd({
                  name: selectedCategory
                    ? `محلات ${selectedCategory} في مول البستان`
                    : "دليل محلات مول البستان",
                  description: selectedCategory
                    ? `قائمة بمحلات ${selectedCategory} داخل مول البستان بالتجمع الخامس.`
                    : "دليل شامل لجميع محلات مول البستان مرتبة حسب التخصص التقني.",
                  url: selectedCategory
                    ? `/stores?category=${encodeURIComponent(selectedCategory)}`
                    : "/stores",
                  items: filtered.map((s: any) => ({
                    name: s.name_ar,
                    url: `/stores/${s.slug}`,
                    image: s.logo_url ?? null,
                  })),
                }),
              ]
            : []),
          ...(!selectedCategory
            ? [buildCategoryListLd(primaryCategories.map(c => ({ name: c, url: `/stores?category=${encodeURIComponent(c)}` })))]
            : []),
        ]}
        noIndex={!!search || !!selectedStatus}
      />

      {/* ═══════════ HERO ═══════════ */}
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
        {/* Hero stats — refined glass cards */}
        <div className="flex items-center gap-3 lg:justify-end">
          {[
            { label: "إجمالي المحلات", value: totalStores, accent: "#2D6BFF" },
            { label: "محل نشط", value: activeCount, accent: "#10B981" },
            { label: "فئة تقنية", value: primaryCategories.length, accent: "#06B6D4" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group relative flex flex-col items-center gap-1.5 rounded-2xl px-5 py-4 text-center transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(145deg, #ffffff08, #ffffff03)",
                border: "1px solid #ffffff0C",
                boxShadow: "0 2px 12px hsl(0 0% 0% / 0.1)",
              }}
            >
              {/* Subtle top accent line */}
              <div className="absolute inset-x-3 top-0 h-[2px] rounded-b-full opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${stat.accent}60, transparent)` }} />
              <span className="font-poppins text-[1.5rem] font-extrabold leading-none" style={{ color: stat.accent }}>{stat.value}</span>
              <span className="text-[0.58rem] font-medium" style={{ color: "#64748B" }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </PageHero>

      {/* ═══════════ SEO INTRO (category-aware) ═══════════ */}
      <StoreSeoIntro
        category={selectedCategory}
        totalStores={totalStores}
        activeCount={activeCount}
        topStores={filtered?.filter((s) => s.featured && s.status === "leased").slice(0, 5).map((s) => ({ name_ar: s.name_ar, slug: s.slug, unit_code: s.unit_code }))}
      />

      {/* ═══════════ DIRECTORY ═══════════ */}
      <section id="directory" className="py-6 md:py-8 scroll-mt-20" style={{ background: "linear-gradient(170deg, #071326 0%, #0D1F3C 100%)" }}>
        <div className="container max-w-[1200px]">
          {/* Sticky glassmorphic search + filters bar */}
          <div
            className="sticky top-14 z-20 -mx-1 mb-8 rounded-2xl p-4 backdrop-blur-2xl"
            style={{
              background: "linear-gradient(145deg, #0B1220F5, #0D1830F0)",
              border: "1px solid #ffffff0E",
              boxShadow: "0 8px 40px hsl(0 0% 0% / 0.3), inset 0 1px 0 #ffffff08",
            }}
          >
            <div dir="rtl" className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
              {/* Search input — RTL with leading icon + clear button */}
              <div className="relative flex-1">
                <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" style={{ color: "#64748B" }} />
                <input
                  type="search"
                  inputMode="search"
                  enterKeyHint="search"
                  dir="rtl"
                  placeholder="ابحث باسم المحل أو الفئة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="ابحث في دليل المحلات"
                  className="h-11 w-full rounded-xl pr-10 pl-10 text-[0.84rem] outline-none transition-all placeholder:text-[#64748B] focus:ring-2 focus:ring-primary/30 [&::-webkit-search-cancel-button]:hidden"
                  style={{ border: `1px solid ${search ? "#2D6BFF45" : "#ffffff14"}`, background: search ? "linear-gradient(135deg, #2D6BFF12, #2D6BFF06)" : "#ffffff0A", color: "#F8FAFC" }}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="مسح البحث"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                    style={{ color: "#94A3B8" }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Sort dropdown — RTL */}
              <div className="relative">
                <label htmlFor="stores-sort" className="sr-only">ترتيب المحلات</label>
                <select
                  id="stores-sort"
                  dir="rtl"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="h-11 w-full lg:w-auto cursor-pointer appearance-none rounded-xl pr-10 pl-4 text-[0.8rem] font-bold outline-none transition-all focus:ring-2 focus:ring-primary/30"
                  style={{
                    border: `1px solid ${sortBy !== "default" ? "#2D6BFF45" : "#ffffff14"}`,
                    background: sortBy !== "default" ? "linear-gradient(135deg, #2D6BFF20, #2D6BFF10)" : "#ffffff0A",
                    color: sortBy !== "default" ? "#5B9AFF" : "#CBD5E1",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3 8 4-4 4 4'/%3E%3Cpath d='M7 4v16'/%3E%3Cpath d='M17 20V4'/%3E%3Cpath d='m21 16-4 4-4-4'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left 12px center",
                    paddingLeft: "32px",
                  }}
                  aria-label="ترتيب المحلات"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ background: "#0B1220", color: "#F8FAFC" }}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Filter chips */}
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
                <span className="mx-1.5 h-4 w-px" style={{ background: "#ffffff14" }} />
                {/* Map-first quick action */}
                <Link
                  to={selectedCategory ? `/map?category=${encodeURIComponent(selectedCategory)}` : "/map"}
                  className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.72rem] font-bold transition-all duration-200 hover:brightness-110"
                  style={{ border: "1px solid #2D6BFF45", background: "linear-gradient(135deg, #2D6BFF25, #2D6BFF15)", color: "#5B9AFF", boxShadow: "0 0 0 1px #2D6BFF15" }}
                >
                  <Compass className="h-3 w-3" />
                  عرض على الخريطة
                </Link>
              </div>
            </div>

            <div dir="rtl" className="mt-3 flex flex-wrap items-center gap-2.5 border-t pt-3 text-[0.72rem]" style={{ borderColor: "#ffffff0C", color: "#64748B" }}>
              <span
                className="rounded-md px-2.5 py-1 font-bold transition-colors"
                style={{
                  background: hasActiveFilters ? "#2D6BFF15" : "#ffffff08",
                  color: hasActiveFilters ? "#5B9AFF" : "#94A3B8",
                  border: `1px solid ${hasActiveFilters ? "#2D6BFF25" : "#ffffff10"}`,
                }}
                aria-live="polite"
              >
                {filtered?.length ?? 0} نتيجة{hasActiveFilters ? " مطابقة" : ""}
              </span>

              {/* Active filter pills */}
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory("")}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold transition-colors hover:brightness-110"
                  style={{ border: "1px solid #2D6BFF25", background: "#2D6BFF12", color: "#5B9AFF" }}
                >
                  القسم: {selectedCategory} <X className="h-3 w-3" />
                </button>
              )}
              {selectedStatus && statusConfig[selectedStatus] && (
                <button
                  onClick={() => setSelectedStatus("")}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold transition-colors hover:brightness-110"
                  style={{ border: `1px solid ${statusConfig[selectedStatus].border}`, background: statusConfig[selectedStatus].bg, color: statusConfig[selectedStatus].color }}
                >
                  الحالة: {statusConfig[selectedStatus].text} <X className="h-3 w-3" />
                </button>
              )}
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold transition-colors hover:brightness-110"
                  style={{ border: "1px solid #ffffff14", background: "#ffffff08", color: "#CBD5E1" }}
                >
                  بحث: «{search}» <X className="h-3 w-3" />
                </button>
              )}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ms-auto flex items-center gap-1.5 rounded-lg px-3 py-1 font-semibold transition-colors hover:text-white"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff08" }}
                >
                  <X className="h-3 w-3" /> مسح الفلاتر
                </button>
              )}
            </div>
          </div>

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45 }}
            className="mb-6 flex items-end justify-between"
          >
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
          </motion.div>

          {/* Store grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden" style={{ border: "1px solid #ffffff0C", background: "#ffffff05" }}>
                  <Skeleton className="aspect-[4/3] w-full rounded-none bg-[#ffffff08]" />
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-9 w-9 rounded-xl bg-[#ffffff08]" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-3/4 bg-[#ffffff08]" />
                        <Skeleton className="h-2.5 w-1/2 bg-[#ffffff06]" />
                      </div>
                    </div>
                    <Skeleton className="h-2.5 w-full bg-[#ffffff06]" />
                    <div className="flex items-center justify-between pt-1">
                      <Skeleton className="h-5 w-16 rounded-full bg-[#ffffff08]" />
                      <Skeleton className="h-5 w-12 rounded-md bg-[#ffffff06]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered && filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      {/* ═══════════ CATEGORY CARDS (secondary discovery) ═══════════ */}
      <section className="py-5 md:py-7 bg-secondary dark:bg-background">
        <div className="container max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="mb-5 flex items-end justify-between"
          >
            <div>
              <p className="section-kicker">طرق تصفّح أخرى</p>
              <h2 className="section-title">تصفّح حسب الفئة.</h2>
            </div>
            {selectedCategory && (
              <button onClick={() => setSelectedCategory("")} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem] font-bold text-primary transition-colors hover:bg-primary/5" style={{ border: "1px solid hsl(var(--primary) / 0.15)" }}>
                <X className="h-3 w-3" /> مسح التصنيف
              </button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
          >
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
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 text-start transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-card"
                  style={{
                    borderColor: isActive ? `${meta.color}50` : "hsl(var(--border))",
                    background: isActive ? `linear-gradient(155deg, ${meta.color}0A, hsl(var(--card)))` : undefined,
                    boxShadow: isActive
                      ? `0 0 0 1px ${meta.color}20, 0 12px 32px ${meta.color}15`
                      : "0 1px 6px hsl(0 0% 0% / 0.04)",
                  }}
                >
                  {/* Ambient category glow on hover */}
                  <div
                    className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `radial-gradient(circle, ${meta.color}15, transparent 70%)` }}
                  />

                  <div
                    className="relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: isActive ? `${meta.color}15` : `${meta.color}08`,
                      border: `1px solid ${isActive ? `${meta.color}40` : `${meta.color}12`}`,
                    }}
                  >
                    <Icon className="h-5 w-5 transition-colors" style={{ color: meta.color }} />
                  </div>

                  <div className="mt-4">
                    <p className="text-[0.78rem] font-bold text-foreground line-clamp-1">{cat}</p>
                    <p className="mt-0.5 text-[0.6rem] text-muted-foreground">{meta.label}</p>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between">
                    {count > 0 ? (
                      <span className="rounded-full px-2.5 py-0.5 text-[0.64rem] font-extrabold" style={{ background: `${meta.color}10`, color: meta.color }}>
                        {count} محل
                      </span>
                    ) : (
                      <span className="text-[0.62rem] light-muted">قريباً</span>
                    )}
                    <ArrowLeft className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:opacity-60 group-hover:-translate-x-1.5" style={{ color: meta.color }} />
                  </div>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Separator */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 15%, #CDBB9A30, transparent 85%)" }} />


      {/* ═══════════ MAP + LEASING CTA ═══════════ */}
      <section className="relative overflow-hidden py-9 md:py-12 bg-secondary dark:bg-background">
        <div className="container max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl p-6 md:p-8" style={{ background: "linear-gradient(135deg, #071326 0%, #0D1F3C 100%)", border: "1px solid #ffffff0A" }}>
            <div className="pointer-events-none absolute left-1/3 top-1/2 h-[200px] w-[300px] -translate-y-1/2 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }} />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-[180px] w-[180px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #CDBB9A, transparent 70%)" }} />
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
          </motion.div>
        </div>
      </section>

      {/* ═══════════ STORES SEO CONTENT — internal linking footer ═══════════ */}
      <section className="bg-card dark:bg-background border-t border-border/30" style={{ paddingTop: "clamp(24px, 3vw, 40px)", paddingBottom: "clamp(24px, 3vw, 40px)" }}>
        <div className="container max-w-4xl">
          <h2 className="text-[0.92rem] font-bold text-foreground mb-3" style={{ fontFamily: "var(--font-arabic-display)" }}>
            دليل محلات مول البستان
          </h2>
          <div className="text-[0.76rem] leading-[2.1] text-muted-foreground space-y-3">
            <p>
              يضم{" "}
              <strong className="text-foreground">دليل المحلات</strong>{" "}
              أكثر من 150 محلاً متخصصاً موزّعة على ثلاثة أدوار في{" "}
              <Link to="/new-cairo-branch" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "page", "فرع التجمع الخامس", "/new-cairo-branch")}>فرع التجمع الخامس</Link>{" "}
              — إلى جانب الإرث التاريخي في{" "}
              <Link to="/downtown-branch" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "page", "فرع وسط البلد", "/downtown-branch")}>فرع وسط البلد</Link>{" "}
              ودليله الكامل في{" "}
              <Link to="/downtown-directory" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "page", "دليل وسط البلد", "/downtown-directory")}>دليل تجار وسط البلد</Link>.
            </p>
            <p>
              تصفّح المحلات حسب الفئة:{" "}
              <Link to="/stores?category=الكمبيوتر والأجهزة" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "category", "الكمبيوتر والأجهزة", "/stores?category=الكمبيوتر والأجهزة")}>الكمبيوتر واللابتوبات</Link>،{" "}
              <Link to="/stores?category=الهواتف والإكسسوارات" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "category", "الهواتف والإكسسوارات", "/stores?category=الهواتف والإكسسوارات")}>الهواتف والإكسسوارات</Link>،{" "}
              <Link to="/stores?category=الألعاب والترفيه" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "category", "الألعاب والترفيه", "/stores?category=الألعاب والترفيه")}>الجيمنج والألعاب</Link>،{" "}
              <Link to="/stores?category=الطباعة والتصوير" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "category", "الطباعة والتصوير", "/stores?category=الطباعة والتصوير")}>الطباعة والتصوير</Link>،{" "}
              <Link to="/stores?category=الشبكات والأنظمة الأمنية" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "category", "الشبكات والأمن", "/stores?category=الشبكات والأنظمة الأمنية")}>الشبكات والأمن</Link>، أو{" "}
              <Link to="/stores?category=الصيانة والدعم الفني" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "category", "الصيانة والدعم الفني", "/stores?category=الصيانة والدعم الفني")}>الصيانة والدعم الفني</Link>.
            </p>
            <p>
              لمعرفة موقع كل محل بدقة على الأدوار، استخدم{" "}
              <Link to="/map" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "page", "الخريطة التفاعلية", "/map")}>الخريطة التفاعلية</Link>،{" "}
              أو قارن بين المنتجات والأسعار من خلال{" "}
              <Link to="/products" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "page", "كتالوج المنتجات", "/products")}>كتالوج المنتجات</Link>،{" "}
              وتابع{" "}
              <Link to="/daily-deals" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "page", "عروض الافتتاح", "/daily-deals")}>عروض الافتتاح</Link>{" "}
              من المحلات الجديدة.
            </p>
            <p>
              للتجار الراغبين في فتح محل داخل المول،{" "}
              <Link to="/leasing" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "page", "وحدات للتأجير", "/leasing")}>تصفّح الوحدات المتاحة للتأجير</Link>{" "}
              أو{" "}
              <Link to="/join-marketplace" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "page", "انضم كتاجر", "/join-marketplace")}>انضم إلى السوق الرقمي</Link>،{" "}
              ولأي استفسار{" "}
              <Link to="/contact" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "page", "تواصل", "/contact")}>تواصل مع فريق المول</Link>{" "}
              أو راجع{" "}
              <Link to="/faq" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("stores_seo", "page", "الأسئلة الشائعة", "/faq")}>الأسئلة الشائعة</Link>.
            </p>
          </div>
        </div>
      </section>

      <BackToTop />
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
          ? { border: "1px solid #2D6BFF45", background: "linear-gradient(135deg, #2D6BFF25, #2D6BFF15)", color: "#5B9AFF", boxShadow: "0 0 0 1px #2D6BFF15, 0 2px 8px #2D6BFF12" }
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
  const accentColor = meta?.color ?? "#5B9AFF";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: Math.min(index * 0.04, 0.25), duration: 0.45, ease: "easeOut" }}
    >
      <Link
        to={`/stores/${store.slug}`}
        className="group relative flex flex-col rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1"
        style={{
          border: "1px solid #ffffff0E",
          background: "linear-gradient(165deg, #ffffff08, #ffffff03)",
          boxShadow: "0 1px 4px hsl(0 0% 0% / 0.08)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${accentColor}30`;
          e.currentTarget.style.background = "linear-gradient(165deg, #ffffff0F, #ffffff06)";
          e.currentTarget.style.boxShadow = `0 12px 40px ${accentColor}12, 0 0 0 1px ${accentColor}15`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#ffffff0E";
          e.currentTarget.style.background = "linear-gradient(165deg, #ffffff08, #ffffff03)";
          e.currentTarget.style.boxShadow = "0 1px 4px hsl(0 0% 0% / 0.08)";
        }}
      >
        {/* Featured badge */}
        {store.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full px-2.5 py-0.5" style={{ background: "#F59E0B18", border: "1px solid #F59E0B30" }}>
            <Sparkles className="h-2.5 w-2.5" style={{ color: "#F59E0B" }} />
            <span className="text-[0.55rem] font-bold" style={{ color: "#F59E0B" }}>مميّز</span>
          </div>
        )}

        {/* Top accent line — category colored */}
        <div
          className="absolute inset-x-4 top-0 h-[2px] rounded-b-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)` }}
        />

        <div className="flex items-center gap-3.5">
          {/* Logo — unified component */}
          <div className="transition-all duration-300 group-hover:scale-105" style={{ boxShadow: "0 3px 16px hsl(0 0% 0% / 0.15)" }}>
            <TenantLogo
              src={getVerifiedLogoUrl(store.slug, store.logo_url)}
              alt={store.name_ar}
              fallbackName={store.name_ar}
              size="md"
              rounded="xl"
              darkContext
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[0.9rem] font-bold leading-snug transition-colors group-hover:text-[#5B9AFF] line-clamp-1" style={{ color: "#F8FAFC" }}>
              {store.name_ar}
            </h3>
            {store.name_en && (
              <p className="font-poppins text-[0.68rem] mt-0.5 line-clamp-1" style={{ color: "#64748B" }}>{store.name_en}</p>
            )}
            {store.category && (
              <div className="mt-1.5 flex items-center gap-1.5">
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

        {/* Footer with status + unit (map deep-link) */}
        <div className="mt-auto pt-3.5">
          <div className="flex items-center gap-2 border-t pt-3" style={{ borderColor: "#ffffff0A" }}>
            <span
              className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.62rem] font-bold"
              style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: st.color }} />
              {st.text}
            </span>

            {store.unit_code && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/map?highlight=${encodeURIComponent(store.unit_code!)}&store=${encodeURIComponent(store.name_ar)}`;
                }}
                title={`عرض ${store.name_ar} على الخريطة`}
                className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.62rem] font-semibold transition-colors hover:brightness-125"
                style={{ background: "#2D6BFF12", border: "1px solid #2D6BFF25", color: "#5B9AFF" }}
              >
                <MapPin className="h-2.5 w-2.5" />{store.unit_code}
              </button>
            )}

            <span className="flex-1" />

            <span className="text-[0.6rem] font-semibold opacity-0 transition-all duration-300 group-hover:opacity-100" style={{ color: "#5B9AFF" }}>
              عرض التفاصيل
            </span>
          </div>
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
        المحلات تنضم تدريجياً مع اقتراب الافتتاح.
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
