import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Store,
  X,
  ArrowLeft,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildProductListLd } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PageHero } from "@/components/PageHero";
import { ProductRail } from "@/components/home/ProductRail";
import { BackToTop } from "@/components/BackToTop";

const PAGE_SIZE = 24;

/* ══════════════════════════════════════════════
   Unified product type for display
   ══════════════════════════════════════════════ */
export type UnifiedProduct = {
  id: string;
  slug: string;
  product_name: string;
  price: number | null;
  priceNote: string | null;
  comparePrice: number | null;
  product_image: string | null;
  brand: string | null;
  featured: boolean;
  shop_name: string | null;
  storeSlug: string | null;
  storeLogo: string | null;
  section: string | null;
  mall: string;
  source: "mall" | "kz";
  createdAt: string;
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read filters from URL
  const urlShopName = searchParams.get("shop_name") ?? searchParams.get("store") ?? "all";
  const urlSection = searchParams.get("section") ?? searchParams.get("category") ?? "all";
  const urlMall = searchParams.get("mall") ?? "all";
  const urlSearch = searchParams.get("q") ?? "";

  const urlBrand = searchParams.get("brand") ?? "all";
  const urlPriceMin = Number(searchParams.get("price_min") ?? "");
  const urlPriceMax = Number(searchParams.get("price_max") ?? "");
  const urlSortRaw = searchParams.get("sort");
  const validSorts = ["featured", "price_asc", "price_desc", "newest"] as const;
  const urlSort = (validSorts as readonly string[]).includes(urlSortRaw ?? "")
    ? (urlSortRaw as typeof validSorts[number])
    : "featured";

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedShop, setSelectedShop] = useState(urlShopName);
  const [selectedSection, setSelectedSection] = useState(urlSection);
  const [selectedMall, setSelectedMall] = useState(urlMall);
  const [selectedBrand, setSelectedBrand] = useState(urlBrand);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(
    Number.isFinite(urlPriceMin) && Number.isFinite(urlPriceMax) && urlPriceMin > 0 && urlPriceMax > 0
      ? [urlPriceMin, urlPriceMax]
      : null
  );
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "newest">(urlSort);

  // Sync URL when filters change (sort included so the choice survives filter changes)
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedShop !== "all") params.set("shop_name", selectedShop);
    if (selectedSection !== "all") params.set("section", selectedSection);
    if (selectedMall !== "all") params.set("mall", selectedMall);
    if (selectedBrand !== "all") params.set("brand", selectedBrand);
    if (priceRange) {
      params.set("price_min", String(priceRange[0]));
      params.set("price_max", String(priceRange[1]));
    }
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (sortBy !== "featured") params.set("sort", sortBy);
    setSearchParams(params, { replace: true });
  }, [selectedShop, selectedSection, selectedMall, selectedBrand, priceRange, searchTerm, sortBy, setSearchParams]);

  /* ── Fetch mall products ── */
  const { data: mallProducts, isLoading: loadingMall } = useQuery({
    queryKey: ["unified-mall-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id, slug, name_ar, price, price_note, image_url, brand, featured, created_at, store_id, stores(name_ar, slug, logo_url), product_categories(name_ar)")
        .eq("status", "published");
      return data ?? [];
    },
  });

  /* ── Fetch KZ products ── */
  const { data: kzProducts, isLoading: loadingKz } = useQuery({
    queryKey: ["unified-kz-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("kz_products")
        .select("id, slug, title, brand, featured, created_at, category_id, kz_product_variants(price, compare_price, is_default), kz_product_images(image_url, sort_order), kz_categories(name)")
        .eq("status", "published");
      return data ?? [];
    },
  });

  /* ── Fetch store list for filter ── */
  const { data: storeList } = useQuery({
    queryKey: ["product-store-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("stores")
        .select("id, name_ar, slug, logo_url")
        .neq("status", "hidden")
        .order("name_ar");
      return data ?? [];
    },
  });

  /* ── Fetch category lists ── */
  const { data: mallCategories } = useQuery({
    queryKey: ["product_categories"],
    queryFn: async () => {
      const { data } = await supabase.from("product_categories").select("id, name_ar, slug").order("sort_order");
      return data ?? [];
    },
  });

  const { data: kzCategories } = useQuery({
    queryKey: ["kz-all-categories-unified"],
    queryFn: async () => {
      const { data } = await supabase.from("kz_categories").select("id, name, slug").order("sort_order");
      return data ?? [];
    },
  });

  const isLoading = loadingMall || loadingKz;

  /* ── Normalize into unified list ── */
  const allProducts: UnifiedProduct[] = useMemo(() => {
    const unified: UnifiedProduct[] = [];
    const kzStore = storeList?.find(s => s.slug === "kasr-zero");

    if (mallProducts) {
      for (const p of mallProducts) {
        const store = (p as any).stores;
        const cat = (p as any).product_categories;
        unified.push({
          id: p.id,
          slug: p.slug,
          product_name: p.name_ar,
          price: p.price ? Number(p.price) : null,
          priceNote: p.price_note,
          comparePrice: null,
          product_image: p.image_url,
          brand: p.brand,
          featured: p.featured,
          shop_name: store?.name_ar ?? null,
          storeSlug: store?.slug ?? null,
          storeLogo: store?.logo_url ?? null,
          section: cat?.name_ar ?? null,
          mall: "القاهرة الجديدة",
          source: "mall",
          createdAt: p.created_at,
        });
      }
    }

    if (kzProducts) {
      for (const p of kzProducts as any[]) {
        const defaultVariant = p.kz_product_variants?.find((v: any) => v.is_default) ?? p.kz_product_variants?.[0];
        const firstImage = p.kz_product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)?.[0];
        unified.push({
          id: p.id,
          slug: p.slug,
          product_name: p.title,
          price: defaultVariant ? Number(defaultVariant.price) : null,
          priceNote: null,
          comparePrice: defaultVariant?.compare_price ? Number(defaultVariant.compare_price) : null,
          product_image: firstImage?.image_url ?? null,
          brand: p.brand,
          featured: p.featured,
          shop_name: kzStore?.name_ar ?? "كسر زيرو",
          storeSlug: kzStore?.slug ?? "kasr-zero",
          storeLogo: kzStore?.logo_url ?? null,
          section: p.kz_categories?.name ?? null,
          mall: "القاهرة الجديدة",
          source: "kz",
          createdAt: p.created_at,
        });
      }
    }

    return unified;
  }, [mallProducts, kzProducts, storeList]);

  /* ── Build merged section list ── */
  const mergedSections = useMemo(() => {
    const cats: { id: string; label: string }[] = [];
    const seen = new Set<string>();
    if (mallCategories) {
      for (const c of mallCategories) {
        if (!seen.has(c.name_ar)) { seen.add(c.name_ar); cats.push({ id: c.name_ar, label: c.name_ar }); }
      }
    }
    if (kzCategories) {
      for (const c of kzCategories) {
        if (!seen.has(c.name)) { seen.add(c.name); cats.push({ id: c.name, label: c.name }); }
      }
    }
    return cats;
  }, [mallCategories, kzCategories]);

  /* ── Mall list ── */
  const mallList = useMemo(() => {
    const set = new Set(allProducts.map(p => p.mall));
    return Array.from(set);
  }, [allProducts]);

  /* ── Brand list (from products that pass shop/section/mall filters) ── */
  const brandList = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of allProducts) {
      if (!p.brand) continue;
      const b = p.brand.trim();
      if (!b) continue;
      counts.set(b, (counts.get(b) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [allProducts]);

  /* ── Price bounds across all products ── */
  const priceBounds = useMemo<[number, number]>(() => {
    const prices = allProducts.map(p => p.price).filter((p): p is number => typeof p === "number" && p > 0);
    if (prices.length === 0) return [0, 100000];
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    return [min, max === min ? min + 1 : max];
  }, [allProducts]);

  /* ── Filter & Sort ── */
  const filteredProducts = useMemo(() => {
    let list = allProducts;

    if (selectedShop !== "all") {
      list = list.filter(p => p.storeSlug === selectedShop);
    }

    if (selectedSection !== "all") {
      list = list.filter(p => p.section === selectedSection);
    }

    if (selectedMall !== "all") {
      list = list.filter(p => p.mall === selectedMall);
    }

    if (selectedBrand !== "all") {
      list = list.filter(p => p.brand?.trim() === selectedBrand);
    }

    if (priceRange) {
      const [lo, hi] = priceRange;
      list = list.filter(p => typeof p.price === "number" && p.price >= lo && p.price <= hi);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(p =>
        p.product_name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.shop_name?.toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    switch (sortBy) {
      case "price_asc": return sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      case "price_desc": return sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      case "newest": return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default: return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [allProducts, selectedShop, selectedSection, selectedMall, selectedBrand, priceRange, searchTerm, sortBy]);

  const hasActiveFilters = selectedSection !== "all" || selectedShop !== "all" || selectedMall !== "all" || selectedBrand !== "all" || priceRange !== null || searchTerm.trim().length > 0;

  /* ── Infinite scroll: visible count ── */
  const SCROLL_KEY = "products:scrollState";
  const restoredRef = useRef(false);
  const filtersChangedByUserRef = useRef(false);

  const [visibleCount, setVisibleCount] = useState(() => {
    if (typeof window === "undefined") return PAGE_SIZE;
    try {
      const raw = sessionStorage.getItem(SCROLL_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved.visibleCount === "number" && saved.visibleCount >= PAGE_SIZE) {
          return saved.visibleCount;
        }
      }
    } catch {}
    return PAGE_SIZE;
  });
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset pagination when filters/sort change (only after user interaction, not on initial mount)
  useEffect(() => {
    if (!filtersChangedByUserRef.current) {
      filtersChangedByUserRef.current = true;
      return;
    }
    setVisibleCount(PAGE_SIZE);
    try { sessionStorage.removeItem(SCROLL_KEY); } catch {}
  }, [selectedShop, selectedSection, selectedMall, selectedBrand, priceRange, searchTerm, sortBy]);

  // Restore scroll position once products are loaded (one-time)
  useEffect(() => {
    if (restoredRef.current) return;
    if (isLoading) return;
    if (filteredProducts.length === 0) return;
    try {
      const raw = sessionStorage.getItem(SCROLL_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved.scrollY === "number") {
          requestAnimationFrame(() => {
            window.scrollTo({ top: saved.scrollY, behavior: "auto" });
          });
        }
      }
    } catch {}
    restoredRef.current = true;
  }, [isLoading, filteredProducts.length]);

  // Save state when leaving via product link (handler passed to ProductCard)
  const saveScrollState = useCallback(() => {
    try {
      sessionStorage.setItem(
        SCROLL_KEY,
        JSON.stringify({ scrollY: window.scrollY, visibleCount })
      );
    } catch {}
  }, [visibleCount]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );
  const hasMore = visibleCount < filteredProducts.length;

  // IntersectionObserver to auto-load more
  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredProducts.length));
        }
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, filteredProducts.length]);

  /* ── Quick filter chips: match merged sections by keywords ── */
  const quickChips = useMemo(() => {
    const groups: { key: string; label: string; keywords: string[] }[] = [
      { key: "phones", label: "هواتف", keywords: ["هاتف", "هواتف", "موبايل", "phone", "mobile"] },
      { key: "computers", label: "كمبيوتر ولابتوب", keywords: ["كمبيوتر", "حاسب", "لابتوب", "laptop", "computer", "pc"] },
      { key: "gaming", label: "جيمنج", keywords: ["جيم", "ألعاب", "العاب", "gaming", "console"] },
      { key: "accessories", label: "إكسسوارات", keywords: ["إكسسوار", "اكسسوار", "accessor"] },
      { key: "audio", label: "صوتيات", keywords: ["صوت", "سماعة", "سماعات", "audio", "headphone"] },
      { key: "parts", label: "قطع غيار", keywords: ["قطع", "غيار", "part", "spare"] },
    ];
    const usedSectionIds = new Set<string>();
    return groups
      .map((g) => {
        const lowerKeywords = g.keywords.map((k) => k.toLowerCase());
        // Prefer exact label match first, then substring match — and skip already-used sections
        const exact = mergedSections.find(
          (s) => !usedSectionIds.has(s.id) && lowerKeywords.includes(s.label.toLowerCase())
        );
        const substring =
          exact ??
          mergedSections.find(
            (s) =>
              !usedSectionIds.has(s.id) &&
              lowerKeywords.some((kw) => s.label.toLowerCase().includes(kw))
          );
        if (!substring) return null;
        usedSectionIds.add(substring.id);
        return { ...g, sectionId: substring.id };
      })
      .filter((c): c is { key: string; label: string; keywords: string[]; sectionId: string } => c !== null)
      .map((c) => ({
        ...c,
        count: allProducts.filter((p) => p.section === c.sectionId).length,
      }))
      .filter((c) => c.count > 0);
  }, [mergedSections, allProducts]);

  /* ── Featured products for premium top rail ── */
  const featuredHighlights = useMemo(() => {
    return allProducts
      .filter((p) => p.featured && p.product_image)
      .slice(0, 10)
      .map((p) => ({
        id: p.id,
        name_ar: p.product_name,
        slug: p.slug,
        price: p.price,
        price_note: p.priceNote,
        image_url: p.product_image,
        featured: p.featured,
        brand: p.brand,
        stores: p.shop_name
          ? { name_ar: p.shop_name, slug: p.storeSlug ?? "", logo_url: p.storeLogo, category: p.section }
          : null,
      }));
  }, [allProducts]);

  /* Trending highlights removed — single featured strip only on this page */

  const clearFilters = useCallback(() => {
    setSelectedSection("all");
    setSelectedShop("all");
    setSelectedMall("all");
    setSelectedBrand("all");
    setPriceRange(null);
    setSearchTerm("");
    setSortBy("featured");
  }, []);

  /* ── Sidebar filter content (shared between desktop sidebar & mobile sheet) ── */
  const FilterSidebar = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col gap-5 ${className}`}>
      {/* Price Range */}
      <div>
        <h3 className="mb-3 text-[0.76rem] font-bold" style={{ color: "#CBD5E1" }}>نطاق السعر</h3>
        <div className="px-1">
          <Slider
            min={priceBounds[0]}
            max={priceBounds[1]}
            step={Math.max(1, Math.floor((priceBounds[1] - priceBounds[0]) / 100))}
            value={priceRange ?? priceBounds}
            onValueChange={(val) => {
              const [lo, hi] = val as [number, number];
              if (lo === priceBounds[0] && hi === priceBounds[1]) {
                setPriceRange(null);
              } else {
                setPriceRange([lo, hi]);
              }
            }}
            className="my-2"
          />
          <div className="flex items-center justify-between text-[0.68rem] font-poppins" style={{ color: "#94A3B8" }}>
            <span>{(priceRange?.[0] ?? priceBounds[0]).toLocaleString("ar-EG")} ج.م</span>
            <span>{(priceRange?.[1] ?? priceBounds[1]).toLocaleString("ar-EG")} ج.م</span>
          </div>
        </div>
        {priceRange && (
          <button
            onClick={() => setPriceRange(null)}
            className="mt-2 flex items-center gap-1 text-[0.66rem] font-semibold transition-colors hover:text-white"
            style={{ color: "#5B9AFF" }}
          >
            <X className="h-3 w-3" /> إلغاء فلتر السعر
          </button>
        )}
      </div>

      {/* Brand Filter */}
      {brandList.length > 0 && (
        <div>
          <h3 className="mb-3 text-[0.76rem] font-bold" style={{ color: "#CBD5E1" }}>العلامة التجارية</h3>
          <div className="flex flex-col gap-1 max-h-[240px] overflow-y-auto scrollbar-hide">
            <button
              onClick={() => setSelectedBrand("all")}
              className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[0.72rem] font-semibold text-right transition-all"
              style={{
                background: selectedBrand === "all" ? "#2563EB20" : "transparent",
                color: selectedBrand === "all" ? "#60A5FA" : "#94A3B8",
                border: selectedBrand === "all" ? "1px solid #2563EB40" : "1px solid transparent",
              }}
            >
              <span>الكل</span>
              <span className="font-poppins text-[0.62rem]" style={{ color: "#64748B" }}>{allProducts.length}</span>
            </button>
            {brandList.slice(0, 20).map((b) => (
              <button
                key={b.name}
                onClick={() => setSelectedBrand(selectedBrand === b.name ? "all" : b.name)}
                className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[0.72rem] font-semibold text-right transition-all"
                style={{
                  background: selectedBrand === b.name ? "#2563EB20" : "transparent",
                  color: selectedBrand === b.name ? "#60A5FA" : "#94A3B8",
                  border: selectedBrand === b.name ? "1px solid #2563EB40" : "1px solid transparent",
                }}
              >
                <span>{b.name}</span>
                <span className="font-poppins text-[0.62rem]" style={{ color: "#64748B" }}>{b.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reset all */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-[0.74rem] font-bold transition-all"
          style={{ border: "1px solid #ffffff18", background: "#ffffff08", color: "#CBD5E1" }}
        >
          <X className="h-3.5 w-3.5" /> إعادة ضبط كل الفلاتر
        </button>
      )}
    </div>
  );

  return (
    <MainLayout>
      <SEOHead
        title="منتجات الكمبيوتر والموبايلات والإلكترونيات"
        titleEn="Computer, Mobile & Electronics Products"
        description="تصفّح منتجات مول البستان — لابتوبات، هواتف، إكسسوارات، جيمنج، وقطع غيار من جميع المحلات في التجمع الخامس بالقاهرة الجديدة. قارن الأسعار واطلب مباشرة."
        descriptionEn="Browse products from Mall Elbostan — laptops, phones, accessories, gaming gear from all stores in New Cairo."
        keywords="لابتوب, موبايل, اكسسوارات, جيمنج, قطع غيار, أسعار, مول البستان, التجمع الخامس"
        breadcrumbs={[{ name: "المنتجات", url: "/products" }]}
        jsonLd={filteredProducts.length > 0 ? buildProductListLd(filteredProducts.map(p => ({ name_ar: p.product_name, slug: p.slug, price: p.price, image_url: p.product_image }))) : undefined}
        noIndex={hasActiveFilters}
      />

      <PageHero
        kicker="سوق المول"
        kickerEn="Marketplace"
        title={<>جميع <span style={{ color: "#CDBB9A" }}>المنتجات.</span></>}
        subtitle="ابحث، قارن، واطلب من محلات المول مباشرة."
        ctas={[
          { label: "تصفّح المنتجات", to: "#products", icon: Search },
          { label: "دليل المحلات", to: "/stores", icon: Store },
        ]}
        compact
      />

      <div className="band-primary" />

      {/* ═══ Single compact Featured Rail (top, no filters active) ═══ */}
      {!hasActiveFilters && (isLoading || featuredHighlights.length >= 3) && (
        <section
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
            paddingTop: "clamp(12px, 1.8vw, 24px)",
            paddingBottom: "clamp(12px, 1.8vw, 24px)",
          }}
        >
          <div className="container relative max-w-[1200px]">
            <ProductRail
              kicker="مختارات"
              title="منتجات مميزة"
              subtitle="أبرز ما اختارته محلات مول البستان."
              products={featuredHighlights.slice(0, 6)}
              ctaLabel="تصفّح الكل"
              ctaTo="#products"
              layout="rail"
              theme="dark"
              density="standard"
              loading={isLoading}
            />
          </div>
        </section>
      )}

      <section id="products" className="heritage-deep py-4 md:py-6 scroll-mt-20">
        <div className="container max-w-[1200px]">

          {/* Filter bar */}
          <div className="lg:sticky lg:top-14 z-20 -mx-1 mb-5 rounded-xl px-1 py-3 backdrop-blur-xl" style={{ background: "#0B1220E8" }}>
            {/* Mobile: stacked vertically / Desktop: row */}
            <div className="flex flex-col gap-3">
              {/* Row 1: Search */}
              <div className="relative flex-1">
                <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "#475569" }} />
                <input
                  type="text"
                  placeholder="ابحث عن منتج أو علامة تجارية..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  dir="rtl"
                  className="h-10 w-full rounded-lg pr-10 pl-4 text-[0.84rem] text-right outline-none transition-all focus:ring-1"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff08", color: "#F8FAFC" }}
                />
              </div>

              {/* Row 2: Category dropdowns (Section + Sort) */}
              <div className="flex flex-row items-center gap-2 flex-wrap" dir="rtl">
                {/* Section filter */}
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="h-9 w-auto max-w-[200px] rounded-lg px-3 text-[0.76rem] font-semibold outline-none text-right"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff08", color: "#CBD5E1", direction: "rtl" }}
                >
                  <option value="all">جميع الأقسام</option>
                  {mergedSections.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="h-9 w-auto max-w-[180px] rounded-lg px-3 text-[0.76rem] font-semibold outline-none text-right"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff08", color: "#CBD5E1", direction: "rtl" }}
                >
                  <option value="featured">الأكثر تميزاً</option>
                  <option value="price_asc">السعر: الأقل</option>
                  <option value="price_desc">السعر: الأعلى</option>
                  <option value="newest">الأحدث</option>
                </select>

                {/* Mall filter - desktop only */}
                {mallList.length > 1 && (
                  <select
                    value={selectedMall}
                    onChange={(e) => setSelectedMall(e.target.value)}
                    className="hidden lg:block h-9 rounded-lg px-3 text-[0.76rem] font-semibold outline-none text-right"
                    style={{ border: "1px solid #ffffff12", background: "#ffffff08", color: "#CBD5E1", direction: "rtl" }}
                  >
                    <option value="all">جميع الفروع</option>
                    {mallList.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                )}

                {/* Shop filter - desktop only */}
                <select
                  value={selectedShop}
                  onChange={(e) => setSelectedShop(e.target.value)}
                  className="hidden lg:block h-9 rounded-lg px-3 text-[0.76rem] font-semibold outline-none text-right"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff08", color: "#CBD5E1", direction: "rtl" }}
                >
                  <option value="all">جميع المحلات</option>
                  {storeList?.map((s) => (
                    <option key={s.id} value={s.slug}>{s.name_ar}</option>
                  ))}
                </select>
              </div>

              {/* Row 3: Action buttons (Mobile filters + Clear) */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Mobile filters trigger */}
                <Sheet>
                  <SheetTrigger asChild>
                    <button
                      className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-[0.76rem] font-semibold transition-all"
                      style={{ border: "1px solid #2563EB40", background: "#2563EB18", color: "#60A5FA" }}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      فلاتر متقدمة
                      {(priceRange || selectedBrand !== "all") && (
                        <span className="ml-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[0.6rem] font-bold" style={{ background: "#2563EB", color: "#fff" }}>
                          {(priceRange ? 1 : 0) + (selectedBrand !== "all" ? 1 : 0)}
                        </span>
                      )}
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[340px] bg-[#0B1220] border-[#ffffff14]" style={{ direction: "rtl" }}>
                    <SheetHeader>
                      <SheetTitle className="text-right text-[0.95rem] font-bold" style={{ color: "#F8FAFC" }}>
                        الفلاتر المتقدمة
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-5">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Clear filters button */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex h-9 items-center gap-1 rounded-lg px-3 text-[0.76rem] font-semibold transition-colors"
                    style={{ border: "1px solid #ffffff12", background: "#ffffff06", color: "#94A3B8" }}
                  >
                    <X className="h-3.5 w-3.5" />
                    مسح الفلاتر
                  </button>
                )}
              </div>

            {/* Active filter summary - Desktop */}
            {hasActiveFilters && (
              <div className="mt-2.5 hidden lg:flex items-center gap-2 text-[0.72rem]" style={{ color: "#64748B" }}>
                <span>نتائج البحث: {filteredProducts.length} منتج</span>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-md px-2 py-0.5 transition-colors hover:text-white"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff06" }}
                >
                  <X className="h-3 w-3" /> مسح الفلاتر
                </button>
              </div>
            )}

            {/* Mobile Results Banner - Shows when filters change */}
            {hasActiveFilters && (
              <div className="lg:hidden mt-3 rounded-lg px-4 py-3" style={{ background: "#2563EB20", border: "1px solid #2563EB40" }}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.9rem] font-bold" style={{ color: "#60A5FA" }}>
                      {filteredProducts.length}
                    </span>
                    <span className="text-[0.8rem] font-medium" style={{ color: "#94A3B8" }}>
                      منتج متاح
                    </span>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-[0.7rem] font-semibold transition-colors"
                    style={{ border: "1px solid #ffffff20", background: "#ffffff10", color: "#CBD5E1" }}
                  >
                    <X className="h-3 w-3" />
                    مسح
                  </button>
                </div>
              </div>
            )}

            {!hasActiveFilters && (
              <div className="mt-2 text-[0.72rem]" style={{ color: "#475569" }}>
                {allProducts.length} منتج من {storeList?.length ?? 0} محل
              </div>
            )}
          </div>
        </div>

          {/* Quick category chips */}
          {quickChips.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-[0.7rem] font-semibold tracking-wide" style={{ color: "#64748B" }}>
                تصفية سريعة:
              </span>
              <button
                onClick={() => setSelectedSection("all")}
                className="flex h-8 items-center gap-1.5 rounded-full px-3 text-[0.74rem] font-bold transition-all"
                style={{
                  border: selectedSection === "all" ? "1px solid #2563EB" : "1px solid #ffffff14",
                  background: selectedSection === "all" ? "#2563EB" : "#ffffff08",
                  color: selectedSection === "all" ? "#fff" : "#CBD5E1",
                }}
              >
                <span>الكل</span>
                <span
                  className="font-poppins text-[0.62rem] font-semibold"
                  style={{ color: selectedSection === "all" ? "#DBEAFE" : "#64748B" }}
                >
                  {allProducts.length}
                </span>
              </button>
              {quickChips.map((chip) => {
                const active = selectedSection === chip.sectionId;
                return (
                  <button
                    key={chip.key}
                    onClick={() => setSelectedSection(active ? "all" : chip.sectionId)}
                    className="flex h-8 items-center gap-1.5 rounded-full px-3 text-[0.74rem] font-bold transition-all hover:border-primary/50"
                    style={{
                      border: active ? "1px solid #2563EB" : "1px solid #ffffff14",
                      background: active ? "#2563EB" : "#ffffff08",
                      color: active ? "#fff" : "#CBD5E1",
                    }}
                  >
                    <span>{chip.label}</span>
                    <span
                      className="font-poppins text-[0.62rem] font-semibold"
                      style={{ color: active ? "#DBEAFE" : "#64748B" }}
                    >
                      {chip.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Layout: Sidebar (desktop) + Grid */}
          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Desktop sidebar (RTL: appears on the right visually) */}
            <aside className="hidden lg:block lg:w-[240px] lg:shrink-0">
              <div
                className="sticky top-32 rounded-xl p-4"
                style={{ border: "1px solid #ffffff10", background: "#ffffff04" }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5" style={{ color: "#5B9AFF" }} />
                  <h2 className="text-[0.82rem] font-bold" style={{ color: "#F8FAFC" }}>
                    الفلاتر
                  </h2>
                </div>
                <FilterSidebar />
              </div>
            </aside>

            {/* Grid column */}
            <div className="flex-1 min-w-0">
              {/* Sort pills — clear, persistent across filter changes */}
              <div
                className="mb-3 flex flex-wrap items-center gap-1.5 rounded-xl p-1.5"
                style={{ border: "1px solid #ffffff10", background: "#ffffff05" }}
                role="radiogroup"
                aria-label="ترتيب المنتجات"
                dir="rtl"
              >
                <span className="px-2 text-[0.68rem] font-semibold" style={{ color: "#64748B" }}>
                  ترتيب:
                </span>
                {([
                  { id: "newest", label: "الأحدث" },
                  { id: "price_asc", label: "الأرخص" },
                  { id: "price_desc", label: "الأعلى سعراً" },
                  { id: "featured", label: "الأعلى تقييماً" },
                ] as const).map((opt) => {
                  const isActive = sortBy === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => setSortBy(opt.id)}
                      className="h-8 rounded-lg px-3 text-[0.74rem] font-bold transition-all"
                      style={
                        isActive
                          ? { background: "#2563EB", color: "#fff", border: "1px solid #2563EB" }
                          : { background: "#ffffff06", color: "#CBD5E1", border: "1px solid #ffffff10" }
                      }
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid #ffffff0C", background: "#ffffff05" }}>
                      <Skeleton className="aspect-square w-full rounded-none bg-[#ffffff08]" />
                      <div className="p-3 space-y-2">
                        <Skeleton className="h-2 w-12 bg-[#ffffff06]" />
                        <Skeleton className="h-3 w-full bg-[#ffffff08]" />
                        <Skeleton className="h-3 w-3/4 bg-[#ffffff08]" />
                        <div className="flex items-center gap-1.5 pt-1">
                          <Skeleton className="h-3.5 w-3.5 rounded-sm bg-[#ffffff06]" />
                          <Skeleton className="h-2.5 w-16 bg-[#ffffff06]" />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <Skeleton className="h-4 w-14 bg-[#ffffff08]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                    {visibleProducts.map((product, i) => (
                      <ProductCard key={`${product.source}-${product.id}`} product={product} index={i} onNavigate={saveScrollState} />
                    ))}
                  </div>

                  {/* Infinite scroll sentinel + status */}
                  {hasMore ? (
                    <div ref={sentinelRef} className="mt-6 flex flex-col items-center justify-center gap-3 py-6">
                      <div className="flex items-center gap-2 text-[0.74rem] font-semibold" style={{ color: "#94A3B8" }}>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: "#5B9AFF" }} />
                        جارٍ تحميل المزيد...
                      </div>
                      <button
                        onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredProducts.length))}
                        className="h-9 rounded-lg px-5 text-[0.76rem] font-bold transition-all"
                        style={{ border: "1px solid #2563EB40", background: "#2563EB18", color: "#60A5FA" }}
                      >
                        تحميل المزيد ({filteredProducts.length - visibleCount})
                      </button>
                    </div>
                  ) : filteredProducts.length > PAGE_SIZE ? (
                    <div className="mt-6 text-center text-[0.72rem] font-semibold" style={{ color: "#475569" }}>
                      عرضت كل المنتجات ({filteredProducts.length})
                    </div>
                  ) : null}
                </>
              ) : (
                <EmptyState hasFilters={hasActiveFilters} onClear={clearFilters} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 md:py-7" style={{ background: "hsl(var(--background))" }}>
        <div className="container max-w-[1200px]">
          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="section-kicker">انضم للمحلات</p>
                <h2 className="section-title max-w-[20rem]" style={{ fontSize: "clamp(15px, 1.4vw, 18px)" }}>اعرض منتجاتك في سوق المول.</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/join-marketplace">
                  <Button variant="cta" className="h-9 gap-1.5 rounded-lg px-5 text-[0.78rem] font-bold">
                    انضم كتاجر
                  </Button>
                </Link>
                <Link to="/stores">
                  <Button variant="outline-blue" className="h-9 rounded-lg px-5 text-[0.78rem]">دليل المحلات</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ SEO FOOTER TEXT ═══════════ */}
      <section className="bg-card dark:bg-background border-t border-border/30" style={{ paddingTop: "clamp(16px, 2vw, 28px)", paddingBottom: "clamp(16px, 2vw, 28px)" }}>
        <div className="container max-w-4xl">
          <h2 className="text-[0.88rem] font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-arabic-display)" }}>
            تسوّق إلكترونيات مول البستان
          </h2>
          <div className="text-[0.72rem] leading-[2.1] text-muted-foreground space-y-2">
            <p>
              تصفّح أكبر تشكيلة منتجات تقنية من محلات مول البستان — لابتوبات، هواتف ذكية، إكسسوارات، أجهزة جيمنج، وقطع غيار كمبيوتر. جميع المنتجات من محلات حقيقية في التجمع الخامس بالقاهرة الجديدة.
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-muted-foreground/70 font-medium">تصفّح أيضاً:</span>
              <Link to="/stores" className="text-primary font-semibold hover:underline">دليل المحلات</Link>
              <span className="text-muted-foreground/40">•</span>
              <Link to="/map" className="text-primary font-semibold hover:underline">الخريطة التفاعلية</Link>
              <span className="text-muted-foreground/40">•</span>
              <Link to="/leasing" className="text-primary font-semibold hover:underline">فرص التأجير</Link>
              <span className="text-muted-foreground/40">•</span>
              <Link to="/about" className="text-primary font-semibold hover:underline">عن المول</Link>
            </div>
          </div>
        </div>
      </section>

      <BackToTop />
    </MainLayout>
  );
};

/* ══════════════════════════════════════════════════════════
   ProductCard — single reusable card
   ══════════════════════════════════════════════════════════ */

export function ProductCard({ product, index, onNavigate }: { product: UnifiedProduct; index: number; onNavigate?: () => void }) {
  const detailPath = `/products/${product.slug}`;

  const hasDiscount = product.comparePrice && product.comparePrice > (product.price ?? 0);
  const discountPct = hasDiscount
    ? Math.round(((product.comparePrice! - product.price!) / product.comparePrice!) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.2), duration: 0.3 }}
    >
      <Link
        to={detailPath}
        onClick={() => onNavigate?.()}
        className="group flex flex-col rounded-xl overflow-hidden transition-all duration-200"
        style={{ border: "1px solid #ffffff0C", background: "#ffffff05" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#2D6BFF30";
          e.currentTarget.style.background = "#ffffff0A";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#ffffff0C";
          e.currentTarget.style.background = "#ffffff05";
        }}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-card dark:bg-muted/20">
          {product.product_image ? (
            <img
              src={product.product_image}
              alt={product.product_name}
              className="h-full w-full object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag className="h-7 w-7" style={{ color: "#CBD5E130" }} />
            </div>
          )}

          {product.featured && !hasDiscount && (
            <span
              className="absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-[0.58rem] font-bold"
              style={{ background: "#2D6BFF", color: "#fff" }}
            >
              مميز
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-[0.58rem] font-bold bg-destructive text-white">
              خصم {discountPct}%
            </span>
          )}
          {product.brand && (
            <span
              className="absolute bottom-2 left-2 rounded px-1.5 py-0.5 text-[0.56rem] font-semibold backdrop-blur-sm"
              style={{ background: "#00000050", color: "#E2E8F0" }}
            >
              {product.brand}
            </span>
          )}
        </div>

        {/* Info — clearer hierarchy: category chip → name → store → price */}
        <div className="flex flex-1 flex-col justify-between p-3">
          <div>
            {product.section && (
              <span
                className="inline-block mb-1.5 rounded px-1.5 py-0.5 text-[0.56rem] font-bold tracking-wide"
                style={{ background: "#2563EB18", color: "#7DB0FF", border: "1px solid #2563EB30" }}
              >
                {product.section}
              </span>
            )}
            <h3 className="text-[0.82rem] font-bold leading-snug line-clamp-2 transition-colors group-hover:text-primary" style={{ color: "#F8FAFC" }}>
              {product.product_name}
            </h3>
            {product.shop_name && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[0.66rem] font-medium" style={{ color: "#94A3B8" }}>
                {product.storeLogo ? (
                  <img src={product.storeLogo} alt="" className="h-4 w-4 rounded-sm bg-card object-contain" style={{ padding: 1 }} />
                ) : (
                  <Store className="h-3 w-3" />
                )}
                <span className="truncate">{product.shop_name}</span>
              </p>
            )}
          </div>

          {/* Price — bigger, primary */}
          <div className="mt-2.5 flex items-end justify-between border-t pt-2" style={{ borderColor: "#ffffff0A" }}>
            {product.price ? (
              <div className="flex flex-col">
                {hasDiscount && (
                  <span className="font-poppins text-[0.6rem] line-through leading-none mb-0.5" style={{ color: "#64748B" }}>
                    {Number(product.comparePrice!).toLocaleString("ar-EG")} ج.م
                  </span>
                )}
                <p className="font-poppins text-[1rem] font-extrabold leading-none" style={{ color: "#F8FAFC" }}>
                  {Number(product.price).toLocaleString("ar-EG")}
                  <span className="mr-0.5 text-[0.62rem] font-semibold" style={{ color: "#94A3B8" }}>ج.م</span>
                </p>
              </div>
            ) : product.priceNote ? (
              <p className="text-[0.74rem] font-semibold" style={{ color: "#5B9AFF" }}>{product.priceNote}</p>
            ) : (
              <span className="text-[0.66rem]" style={{ color: "#475569" }}>اسأل عن السعر</span>
            )}
            <ArrowLeft className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-x-0.5" style={{ color: "#5B9AFF" }} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="heritage-surface rounded-xl p-8 text-center md:p-12">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "#2D6BFF14", border: "1px solid #2D6BFF30" }}>
        <ShoppingBag className="h-5 w-5" style={{ color: "#5B9AFF" }} />
      </div>
      {hasFilters ? (
        <>
          <h3 className="mt-4 text-[1rem] font-bold dark-heading">لا توجد نتائج مطابقة</h3>
          <p className="mx-auto mt-1.5 max-w-xs text-[0.82rem] leading-6 dark-body">
            جرّب تعديل الفلاتر أو البحث بكلمات مختلفة.
          </p>
          <button onClick={onClear} className="mt-4 rounded-lg px-5 py-2 text-[0.82rem] font-bold transition-all" style={{ border: "1px solid #ffffff18", background: "#ffffff0A", color: "#CBD5E1" }}>
            إعادة ضبط الفلاتر
          </button>
        </>
      ) : (
        <>
          <h3 className="mt-4 text-[1rem] font-bold dark-heading">سوق مول البستان الرقمي</h3>
          <p className="mx-auto mt-2 max-w-sm text-[0.82rem] leading-6 dark-body">
            نعمل على بناء أول سوق رقمي يجمع منتجات محلات المول في مكان واحد.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link to="/stores">
              <Button variant="cta" className="h-9 gap-1.5 rounded-lg px-5 text-[0.82rem] font-bold">
                <Store className="ml-1.5 h-3.5 w-3.5" /> دليل المحلات
              </Button>
            </Link>
            <Link to="/join-marketplace">
              <Button className="h-9 rounded-lg border px-5 text-[0.82rem] font-bold" style={{ borderColor: "#ffffff18", background: "#ffffff08", color: "#E2E8F0" }}>
                انضم كتاجر
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Products;
