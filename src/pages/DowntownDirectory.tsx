import { useState, useMemo, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Phone, MapPin, Search, Globe, ChevronLeft, ShieldCheck, ShieldQuestion, AlertCircle, Filter, ListChecks } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TenantLogo } from "@/components/TenantLogo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPublicBadge, isAdminOnlyStatus, publicSafe } from "@/lib/downtownVerification";

const BADGE_TONE: Record<string, { color: string; Icon: typeof ShieldCheck }> = {
  green: { color: "bg-success/10 text-success border-success/20", Icon: ShieldCheck },
  blue:  { color: "bg-primary/10 text-primary border-primary/20", Icon: ListChecks },
  amber: { color: "bg-orange-500/10 text-orange-600 border-orange-500/20", Icon: AlertCircle },
  gray:  { color: "bg-muted/40 text-muted-foreground border-border", Icon: ShieldQuestion },
};

const CATEGORIES = [
  "الكل",
  "الكمبيوتر والأجهزة",
  "الهواتف والإكسسوارات",
  "الطباعة والتصوير",
  "الصيانة والدعم الفني",
  "الشبكات والأنظمة الأمنية",
  "الألعاب والترفيه",
];

const PAGE_SIZE = 12;

const DowntownDirectory = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedStatus, setSelectedStatus] = useState("الكل");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { data: merchants, isLoading } = useQuery({
    queryKey: ["downtown-merchants"],
    queryFn: async () => {
      const { data } = await supabase
        .from("downtown_merchants")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  const visibleMerchantsAll = useMemo(() => {
    return (merchants ?? []).filter(m => !isAdminOnlyStatus(m.verification_status));
  }, [merchants]);

  const filtered = useMemo(() => {
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "");
    const searchNorm = search ? normalize(search) : "";
    return visibleMerchantsAll.filter((m) => {
      const matchesSearch = !searchNorm ||
        normalize(m.name_ar).includes(searchNorm) ||
        m.name_ar.toLowerCase().includes(search.toLowerCase()) ||
        (m.name_en && (normalize(m.name_en).includes(searchNorm) || m.name_en.toLowerCase().includes(search.toLowerCase()))) ||
        (m.phone && m.phone.replace(/\s+/g, "").includes(searchNorm)) ||
        (m.category && normalize(m.category).includes(searchNorm));
      const matchesCategory = selectedCategory === "الكل" || m.category === selectedCategory;
      const badge = getPublicBadge(m);
      const matchesStatus = selectedStatus === "الكل"
        || (selectedStatus === "verified" && badge?.tone === "green")
        || (selectedStatus === "listed"   && badge?.tone === "blue")
        || (selectedStatus === "needs"    && badge?.tone === "amber");
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [visibleMerchantsAll, search, selectedCategory, selectedStatus]);

  // Reset pagination when filters change
  const visibleMerchants = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = filtered.length > visibleCount;

  const handleFilterChange = useCallback((setter: (v: string) => void, value: string) => {
    setter(value);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const categoryCounts = useMemo(() => {
    if (!merchants) return {};
    const counts: Record<string, number> = {};
    merchants.forEach((m) => { counts[m.category ?? "أخرى"] = (counts[m.category ?? "أخرى"] || 0) + 1; });
    return counts;
  }, [merchants]);

  const directoryLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "دليل محلات مول البستان وسط البلد",
    description: "أكبر دليل لمحلات التكنولوجيا والإلكترونيات في وسط البلد، القاهرة",
    numberOfItems: merchants?.length ?? 0,
    itemListElement: filtered.slice(0, 20).map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Store",
        name: m.name_ar,
        alternateName: m.name_en,
        telephone: m.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: "18 شارع البستان",
          addressLocality: "باب اللوق",
          addressRegion: "القاهرة",
          addressCountry: "EG",
        },
      },
    })),
  };

  return (
    <MainLayout>
      <SEOHead
        title="دليل محلات وسط البلد - التكنولوجيا والإلكترونيات"
        titleEn="Downtown Cairo Technology Directory"
        description="أكبر دليل موثّق لمحلات التكنولوجيا والإلكترونيات في مول البستان وسط البلد — شارع البستان، باب اللوق، القاهرة. أرقام الهواتف، التصنيفات، والمراجعات."
        descriptionEn="The most trusted technology and electronics directory in Downtown Cairo - Mall El Bostan, Al-Bustan Street."
        ogImage="https://mallelbostan.com/hero/downtown-hero-1.webp"
        ogImageAlt="دليل محلات مول البستان وسط البلد"
        tags={["وسط البلد", "باب اللوق", "شارع البستان", "تكنولوجيا", "إلكترونيات", "مول البستان", "دليل محلات"]}
        jsonLd={directoryLd}
        breadcrumbs={[
          { name: "فرع وسط البلد", url: "/downtown-branch" },
          { name: "دليل محلات وسط البلد", url: "/downtown-directory" },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-10 md:py-14" style={{ background: "linear-gradient(135deg, #071326 0%, #0d1f3c 50%, #071326 100%)" }}>
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 30% 50%, hsl(var(--accent-blue) / 0.3), transparent 60%)" }} />
        <div className="container relative text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 px-4 py-1.5 text-[0.72rem] text-primary">
            <Building2 className="ml-1 h-3.5 w-3.5" /> منذ ١٩٩٠
          </Badge>
          <h1 className="text-[1.5rem] font-bold leading-tight md:text-[2rem]" style={{ color: "#F8FAFC" }}>
            دليل محلات التكنولوجيا — وسط البلد
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[0.84rem] leading-[1.8]" style={{ color: "#94A3B8" }}>
            المرجع الأول لسوق الكمبيوتر والإلكترونيات في مصر. {merchants?.length ?? "..."} محل تجاري في شارع البستان، باب اللوق.
          </p>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {[
              { label: "محل تجاري", value: merchants?.length ?? 0 },
              { label: "تصنيف", value: Object.keys(categoryCounts).length },
              { label: "موثّق", value: merchants?.filter(m => m.verification_status === "Verified" || m.verification_status === "verified").length ?? 0 },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border px-5 py-2.5" style={{ borderColor: "hsl(0 0% 100% / 0.08)", background: "hsl(0 0% 100% / 0.03)" }}>
                <span className="text-[1.2rem] font-bold" style={{ color: "#F8FAFC" }}>{s.value}</span>
                <span className="mr-2 text-[0.72rem]" style={{ color: "#64748B" }}>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-center gap-2">
            <Link to="/downtown-branch">
              <Button variant="outline" className="h-9 rounded-lg border-primary/30 bg-primary/5 px-4 text-[0.78rem] text-primary hover:bg-primary/10">عن الفرع</Button>
            </Link>
            <Link to="/stores">
              <Button className="h-9 rounded-lg border px-4 text-[0.78rem]" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#CBD5E1" }}>فرع القاهرة الجديدة</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Filters & Directory */}
      <section className="py-8 md:py-10 bg-secondary dark:bg-background">
        <div className="container max-w-5xl">
          {/* Search & Filters */}
          <div className="mb-6 space-y-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ابحث بالاسم أو رقم الهاتف..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
                className="h-11 rounded-xl border-border bg-card pr-10 text-[0.84rem]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange(setSelectedCategory, cat)}
                  className={`rounded-lg px-3 py-1.5 text-[0.72rem] font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-card text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {cat} {cat !== "الكل" && categoryCounts[cat] ? `(${categoryCounts[cat]})` : ""}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[0.72rem] text-muted-foreground">حالة التوثيق:</span>
              {["الكل", "Verified", "Official source linked", "Needs review"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleFilterChange(setSelectedStatus, s)}
                  className={`rounded-md px-2.5 py-1 text-[0.65rem] font-medium transition-all ${
                    selectedStatus === s
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s === "الكل" ? "الكل" : s === "Verified" ? "موثّق" : s === "Official source linked" ? "مصدر رسمي" : "قيد المراجعة"}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[0.82rem] font-bold text-foreground">{filtered.length} محل تجاري</p>
            <Badge variant="outline" className="text-[0.65rem]">
              <MapPin className="ml-1 h-3 w-3" /> باب اللوق، القاهرة
            </Badge>
          </div>

          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                  <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-2.5 w-20" />
                      </div>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {visibleMerchants.map((m) => {
                  const status = statusConfig[m.verification_status] ?? statusConfig["Unknown status"];
                  const StatusIcon = status.icon;
                  return (
                    <Link
                      key={m.id}
                      to={`/downtown-directory/${m.slug ?? m.id}`}
                      className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md"
                    >
                      <TenantLogo
                        src={m.logo_url}
                        alt={m.name_ar}
                        fallbackName={m.name_ar}
                        size="sm"
                        rounded="xl"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[0.88rem] font-bold text-foreground group-hover:text-primary transition-colors">{m.name_ar}</p>
                            {m.name_en && <p className="font-poppins text-[0.7rem] text-muted-foreground">{m.name_en}</p>}
                          </div>
                          <Badge variant="outline" className={`shrink-0 text-[0.55rem] ${status.color}`}>
                            <StatusIcon className="ml-0.5 h-2.5 w-2.5" />
                            {status.label}
                          </Badge>
                        </div>

                        {m.category && (
                          <Badge variant="secondary" className="mt-1.5 text-[0.6rem]">{m.category}</Badge>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[0.72rem] text-muted-foreground">
                          {m.floor && <span>الدور {m.floor}</span>}
                          {m.phone && (
                            <span className="flex items-center gap-1 text-primary">
                              <Phone className="h-3 w-3" /> {m.phone}
                            </span>
                          )}
                          {m.website && (
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" /> موقع
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 flex items-center text-[0.65rem] text-primary">
                          عرض التفاصيل <ChevronLeft className="h-3 w-3 mr-0.5 transition-transform group-hover:-translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {hasMore && (
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="h-10 rounded-xl border-border px-8 text-[0.82rem] font-bold hover:bg-secondary"
                  >
                    عرض المزيد ({filtered.length - visibleCount} محل متبقي)
                  </Button>
                </div>
              )}
            </>
          )}

          {filtered.length === 0 && !isLoading && (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <ShieldQuestion className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-[0.88rem] font-bold text-foreground">لا توجد نتائج</p>
              <p className="mt-1 text-[0.78rem] text-muted-foreground">جرب تغيير الفلاتر أو البحث بكلمة مختلفة</p>
            </div>
          )}

          <div className="mt-8 rounded-xl border border-border bg-card p-5 text-center">
            <p className="text-[0.78rem] text-muted-foreground">
              البيانات مصدرها أدلة تجارية عامة موثوقة. للتحديث أو الإضافة{" "}
              <Link to="/contact" className="font-bold text-primary hover:underline">تواصل معنا</Link>.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default DowntownDirectory;
