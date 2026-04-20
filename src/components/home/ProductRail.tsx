import { useRef, useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag, Store, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

import { optimizeImageUrl, unsplashSrcSet } from "@/lib/imageUtils";

type Product = {
  id: string;
  name_ar: string;
  slug: string;
  price: number | null;
  price_note: string | null;
  image_url: string | null;
  featured: boolean;
  brand: string | null;
  stores: { name_ar: string; slug: string; logo_url: string | null; category: string | null } | null;
};

type Density = "standard" | "premium";
type Tier = "mobile" | "tablet" | "desktop";

type Props = {
  title: string;
  subtitle?: string;
  kicker?: string;
  products: Product[];
  ctaLabel?: string;
  ctaTo?: string;
  layout?: "grid" | "rail";
  columns?: 4 | 5;
  maxItems?: number;
  theme?: "light" | "dark";
  density?: Density;
  fillMode?: "exact" | "auto";
  loading?: boolean;
  skeletonCount?: number;
};

/* ─── Columns per tier+density (matches getGridClasses below) ─── */
function getColsForTier(tier: Tier, density: Density): number {
  if (density === "premium") {
    if (tier === "mobile") return 2;
    if (tier === "tablet") return 3;
    return 4;
  }
  if (tier === "mobile") return 2;
  if (tier === "tablet") return 4;
  return 6;
}


/* ─── useDeviceTier hook (matchMedia at 640 + 1024) ─── */
function useDeviceTier(): Tier {
  const [tier, setTier] = useState<Tier>(() => {
    if (typeof window === "undefined") return "desktop";
    if (window.matchMedia("(max-width: 639px)").matches) return "mobile";
    if (window.matchMedia("(max-width: 1023px)").matches) return "tablet";
    return "desktop";
  });

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 639px)");
    const mqTablet = window.matchMedia("(min-width: 640px) and (max-width: 1023px)");
    const update = () => {
      if (mqMobile.matches) setTier("mobile");
      else if (mqTablet.matches) setTier("tablet");
      else setTier("desktop");
    };
    update();
    mqMobile.addEventListener("change", update);
    mqTablet.addEventListener("change", update);
    return () => {
      mqMobile.removeEventListener("change", update);
      mqTablet.removeEventListener("change", update);
    };
  }, []);

  return tier;
}

/* ─── Tier-based size tokens ─── */
type Sizes = {
  aspect: string;
  padding: string;
  titleSize: number;
  storeSize: number;
  priceSize: number;
  logoSize: number;
};

function getSizes(tier: Tier): Sizes {
  switch (tier) {
    case "mobile":
      return { aspect: "1/1", padding: "10px 12px 12px", titleSize: 13, storeSize: 11, priceSize: 14, logoSize: 14 };
    case "tablet":
      return { aspect: "4/3", padding: "12px 14px 14px", titleSize: 13.5, storeSize: 11, priceSize: 14.5, logoSize: 14 };
    case "desktop":
    default:
      return { aspect: "4/3", padding: "10px 12px 12px", titleSize: 13, storeSize: 10.5, priceSize: 13.5, logoSize: 13 };
  }
}

/* ─── Product Card ─── */
function ProductCard({
  product,
  theme = "light",
  tier,
  density,
}: {
  product: Product;
  theme?: "light" | "dark";
  tier: Tier;
  density: Density;
}) {
  const store = product.stores;
  const isDark = theme === "dark";
  const sizes = getSizes(tier);
  const isPremium = density === "premium";

  return (
    <Link
      to={`/products/${product.slug}`}
      style={{
        borderRadius: 12,
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : undefined,
        background: isDark ? "rgba(255,255,255,0.04)" : undefined,
        boxShadow: "0 2px 8px rgba(15,23,42,0.03)",
      }}
      className={`group flex flex-col overflow-hidden transition-all duration-200 ease-out hover:-translate-y-0.5 ${
        !isDark ? "bg-card border border-border/40 dark:bg-secondary dark:border-border/60" : ""
      } ${isPremium ? "hover:border-primary/40" : ""}`}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = isPremium
          ? "0 10px 24px rgba(37,99,235,0.12)"
          : "0 6px 16px rgba(15,23,42,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(15,23,42,0.03)";
      }}
    >
      {/* Image zone */}
      <div
        className={`relative overflow-hidden ${isDark ? "" : "bg-muted/30 dark:bg-muted/20"}`}
        style={{
          aspectRatio: sizes.aspect,
          background: isDark ? "rgba(255,255,255,0.03)" : "#F1F5F9",
          borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid hsl(var(--border) / 0.3)",
        }}
      >
        {product.image_url ? (
          <img
            src={optimizeImageUrl(product.image_url, 400)}
            srcSet={unsplashSrcSet(product.image_url, [200, 400, 600]) || undefined}
            sizes={tier === "mobile" ? "70vw" : tier === "tablet" ? "33vw" : "20vw"}
            alt={product.name_ar}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            style={{ padding: tier === "mobile" ? 10 : 8 }}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-muted-foreground/20" />
          </div>
        )}

        {/* Category chip */}
        {store?.category && (
          <span
            className="absolute top-1.5 right-1.5 backdrop-blur-sm"
            style={{
              height: 18,
              display: "inline-flex",
              alignItems: "center",
              paddingInline: 6,
              borderRadius: 999,
              fontSize: 9,
              fontWeight: 700,
              lineHeight: 1,
              color: isDark ? "rgba(255,255,255,0.85)" : "#fff",
              background: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.7)",
            }}
          >
            {store.category}
          </span>
        )}

        {/* Featured badge */}
        {product.featured && (
          <span
            className="absolute top-1.5 left-1.5 flex items-center gap-0.5 backdrop-blur-sm"
            style={{
              height: 18,
              paddingInline: 6,
              borderRadius: 999,
              fontSize: 9,
              fontWeight: 700,
              lineHeight: 1,
              color: "#fff",
              background: "hsl(var(--primary) / 0.9)",
            }}
          >
            <Sparkles className="h-2.5 w-2.5" />
            مميز
          </span>
        )}
      </div>

      {/* Content zone */}
      <div className="flex flex-1 flex-col justify-between" style={{ padding: sizes.padding }}>
        <div>
          <p
            className={`font-bold line-clamp-2 group-hover:text-primary transition-colors ${
              isDark ? "text-white/90" : "text-foreground"
            }`}
            style={{ fontSize: sizes.titleSize, lineHeight: 1.35, minHeight: sizes.titleSize * 1.35 * 2 }}
          >
            {product.name_ar}
          </p>

          {store && (
            <div className="flex items-center gap-1.5" style={{ marginTop: 4 }}>
              {store.logo_url ? (
                <img
                  src={store.logo_url}
                  alt={store.name_ar}
                  className="rounded-sm object-contain shrink-0"
                  loading="lazy"
                  style={{
                    width: sizes.logoSize,
                    height: sizes.logoSize,
                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(22,41,84,0.08)",
                    background: "#fff",
                  }}
                />
              ) : (
                <Store className="shrink-0 text-muted-foreground/30" style={{ width: sizes.logoSize, height: sizes.logoSize }} />
              )}
              <span
                className={`line-clamp-1 ${isDark ? "text-white/55" : "text-muted-foreground"}`}
                style={{ fontSize: sizes.storeSize, fontWeight: 500 }}
              >
                {store.name_ar}
              </span>
            </div>
          )}
        </div>

        {product.price ? (
          <p
            className="font-poppins font-extrabold text-primary"
            style={{ fontSize: sizes.priceSize, marginTop: 6 }}
          >
            {Number(product.price).toLocaleString("ar-EG")} جم
          </p>
        ) : product.price_note ? (
          <p
            className="font-bold text-primary"
            style={{ fontSize: sizes.priceSize - 1, marginTop: 6 }}
          >
            {product.price_note}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

/* ─── Grid column classes per density ─── */
function getGridClasses(density: Density): string {
  if (density === "premium") {
    // one column less per breakpoint = larger card
    return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4";
  }
  return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";
}

/* ─── Mobile rail card width ─── */
function getRailWidth(tier: Tier, density: Density): { width: string; maxWidth: number } {
  if (tier === "mobile") {
    return density === "premium" ? { width: "70vw", maxWidth: 280 } : { width: "62vw", maxWidth: 240 };
  }
  // Tablet/desktop rail (only used when explicitly layout="rail" AND tier != mobile)
  if (tier === "tablet") {
    return density === "premium" ? { width: "38vw", maxWidth: 320 } : { width: "30vw", maxWidth: 240 };
  }
  return density === "premium" ? { width: "22vw", maxWidth: 280 } : { width: "17vw", maxWidth: 220 };
}

/* ─── ProductRail ─── */
export function ProductRail({
  title,
  subtitle,
  kicker,
  products,
  ctaLabel = "عرض الكل",
  ctaTo = "/products",
  layout = "grid",
  maxItems,
  theme = "light",
  density = "standard",
  fillMode = "auto",
  loading = false,
  skeletonCount,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const isDark = theme === "dark";
  const tier = useDeviceTier();

  /* Mobile is always rail (app-like). Tablet/desktop respect layout prop. */
  const effectiveLayout = tier === "mobile" ? "rail" : layout;
  let displayed = maxItems ? products.slice(0, maxItems) : products;

  /* Auto-fill: trim to a multiple of the active column count so no row is partial */
  if (fillMode === "auto" && effectiveLayout === "grid" && tier !== "mobile") {
    const cols = getColsForTier(tier, density);
    if (displayed.length >= cols) {
      const fullRows = Math.floor(displayed.length / cols) * cols;
      displayed = displayed.slice(0, fullRows);
    }
  }
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, displayed.length]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const step = tier === "mobile" ? 240 : 320;
    scrollRef.current.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    dragStart.current = { x: e.pageX, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dx = e.pageX - dragStart.current.x;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
      scrollRef.current.style.userSelect = "";
    }
  }, []);

  if (!loading && displayed.length === 0) return <></>;

  const railSize = getRailWidth(tier, density);

  /* Skeleton items (sized identically to real cards) */
  const cols = getColsForTier(tier, density);
  const skelCount = skeletonCount ?? (effectiveLayout === "rail" ? (tier === "mobile" ? 4 : 6) : cols * 2);
  const skeletonItems = loading ? Array.from({ length: skelCount }) : [];

  const SkeletonCard = () => {
    const sizes = getSizes(tier);
    const shimmerBg = isDark ? "rgba(255,255,255,0.06)" : "hsl(var(--muted) / 0.6)";
    return (
      <div
        style={{
          borderRadius: 12,
          border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid hsl(var(--border) / 0.4)",
          background: isDark ? "rgba(255,255,255,0.04)" : "hsl(var(--card))",
          overflow: "hidden",
        }}
        className="flex flex-col"
        aria-hidden="true"
      >
        <div
          className="animate-pulse"
          style={{
            aspectRatio: sizes.aspect,
            background: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9",
          }}
        />
        <div className="flex flex-col gap-2" style={{ padding: sizes.padding }}>
          <div className="animate-pulse rounded" style={{ height: sizes.titleSize * 1.2, background: shimmerBg, width: "92%" }} />
          <div className="animate-pulse rounded" style={{ height: sizes.titleSize * 1.2, background: shimmerBg, width: "70%" }} />
          <div className="flex items-center gap-1.5" style={{ marginTop: 4 }}>
            <div className="animate-pulse rounded-sm" style={{ width: sizes.logoSize, height: sizes.logoSize, background: shimmerBg }} />
            <div className="animate-pulse rounded" style={{ height: sizes.storeSize * 1.2, width: "45%", background: shimmerBg }} />
          </div>
          <div className="animate-pulse rounded" style={{ height: sizes.priceSize * 1.2, width: "38%", background: shimmerBg, marginTop: 6 }} />
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16 }} className="flex items-end justify-between gap-4">
        <div>
          {kicker && (
            <p
              className={isDark ? "text-[#60A5FA]" : "section-kicker"}
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 4 }}
            >
              {kicker}
            </p>
          )}
          <h2
            className={isDark ? "text-[#F8FAFC]" : "text-foreground"}
            style={{ fontFamily: "var(--font-arabic-display)", fontSize: "clamp(15px, 1.4vw, 18px)", fontWeight: 700, lineHeight: 1.2 }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={isDark ? "text-[#94A3B8]" : "text-muted-foreground"}
              style={{ marginTop: 2, fontSize: "clamp(12px, 1vw, 14px)", lineHeight: 1.6, maxWidth: "28rem" }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <Link to={ctaTo} className="hidden lg:inline-flex shrink-0">
          <Button
            variant="ghost"
            className={`gap-1 font-bold ${isDark ? "text-[#60A5FA] hover:text-[#93BBFD]" : "text-primary hover:text-primary/80"}`}
            style={{ fontSize: 13 }}
          >
            {ctaLabel} <ArrowLeft className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Grid or Rail */}
      {effectiveLayout === "rail" ? (
        <div className="relative group/rail">
          {/* Edge fades */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-8 md:w-12 transition-opacity duration-300"
            style={{
              background: isDark
                ? "linear-gradient(to left, hsla(220,30%,8%,0.9), transparent)"
                : "linear-gradient(to left, hsla(0,0%,100%,0.9), transparent)",
              opacity: canScrollRight ? 1 : 0,
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-8 md:w-12 transition-opacity duration-300"
            style={{
              background: isDark
                ? "linear-gradient(to right, hsla(220,30%,8%,0.9), transparent)"
                : "linear-gradient(to right, hsla(0,0%,100%,0.9), transparent)",
              opacity: canScrollLeft ? 1 : 0,
            }}
          />
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 scroll-snap-rtl-start"
            style={{ gap: tier === "mobile" ? 12 : 14, scrollbarWidth: "none", cursor: "grab" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {loading
              ? skeletonItems.map((_, i) => (
                  <div
                    key={`skel-${i}`}
                    className="shrink-0 snap-start"
                    style={{ width: railSize.width, maxWidth: railSize.maxWidth }}
                  >
                    <SkeletonCard />
                  </div>
                ))
              : displayed.map((product) => (
                  <div
                    key={product.id}
                    className="shrink-0 snap-start"
                    style={{ width: railSize.width, maxWidth: railSize.maxWidth }}
                  >
                    <ProductCard product={product} theme={theme} tier={tier} density={density} />
                  </div>
                ))}
          </div>
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              aria-label="التمرير لليمين"
              className="group absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-md bg-background"
              style={{ borderColor: isDark ? "hsla(0,0%,100%,0.12)" : undefined, background: isDark ? "hsla(220,45%,10%,0.7)" : undefined }}
            >
              <ChevronRight className={`h-4 w-4 transition-colors duration-300 ${isDark ? "text-[#CBD5E1] group-hover:text-[#CDBB9A]" : "text-foreground group-hover:text-primary"}`} />
            </button>
          )}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              aria-label="التمرير لليسار"
              className="group absolute -left-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-md bg-background"
              style={{ borderColor: isDark ? "hsla(0,0%,100%,0.12)" : undefined, background: isDark ? "hsla(220,45%,10%,0.7)" : undefined }}
            >
              <ChevronLeft className={`h-4 w-4 transition-colors duration-300 ${isDark ? "text-[#CBD5E1] group-hover:text-[#CDBB9A]" : "text-foreground group-hover:text-primary"}`} />
            </button>
          )}
        </div>
      ) : (
        <div className={getGridClasses(density)} style={{ gap: 12, rowGap: 16 }}>
          {loading
            ? skeletonItems.map((_, i) => <SkeletonCard key={`skel-${i}`} />)
            : displayed.map((product) => (
                <ProductCard key={product.id} product={product} theme={theme} tier={tier} density={density} />
              ))}
        </div>
      )}

      {/* Mobile CTA */}
      <div className="mt-4 flex justify-center lg:hidden">
        <Link to={ctaTo}>
          <Button
            variant={isDark ? "outline-blue" : "cta"}
            className="h-9 rounded-lg px-5 text-[0.78rem] font-bold gap-1"
          >
            {ctaLabel} <ArrowLeft className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
