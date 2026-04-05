import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag, Store, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
};

const sectionReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Product Card ─── */
function ProductCard({ product, theme = "light" }: { product: Product; theme?: "light" | "dark" }) {
  const store = product.stores;
  const isDark = theme === "dark";

  return (
    <Link
      to={`/products/${product.slug}`}
      style={{
        borderRadius: 10,
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : undefined,
        background: isDark ? "rgba(255,255,255,0.04)" : undefined,
        boxShadow: "0 2px 8px rgba(15,23,42,0.03)",
      }}
      className={`group flex flex-col overflow-hidden transition-all duration-[180ms] ease-out hover:-translate-y-0.5 ${
        !isDark ? "bg-card border border-border/40 dark:bg-secondary dark:border-border/60" : ""
      }`}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 16px rgba(15,23,42,0.07)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(15,23,42,0.03)";
      }}
    >
      {/* ── Image zone ── */}
      <div
        className={`relative overflow-hidden ${isDark ? "" : "dark:bg-muted/30"}`}
        style={{
          aspectRatio: "4/3",
          background: isDark ? "rgba(255,255,255,0.03)" : "#F1F5F9",
          borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid hsl(var(--border) / 0.3)",
        }}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name_ar}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            style={{ padding: "clamp(4px, 0.5vw, 8px)" }}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-muted-foreground/10" />
          </div>
        )}

        {/* Category chip */}
        {store?.category && (
          <span
            className="absolute top-1 right-1 backdrop-blur-sm"
            style={{
              height: 16,
              display: "inline-flex",
              alignItems: "center",
              paddingInline: 5,
              borderRadius: 999,
              fontSize: 8,
              fontWeight: 700,
              lineHeight: 1,
              color: isDark ? "rgba(255,255,255,0.8)" : "#fff",
              background: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.68)",
            }}
          >
            {store.category}
          </span>
        )}

        {/* Featured badge */}
        {product.featured && (
          <span
            className="absolute top-1 left-1 flex items-center gap-0.5 backdrop-blur-sm"
            style={{
              height: 16,
              paddingInline: 5,
              borderRadius: 999,
              fontSize: 8,
              fontWeight: 700,
              lineHeight: 1,
              color: "#fff",
              background: "hsl(var(--primary) / 0.88)",
            }}
          >
            <Sparkles className="h-2 w-2" />
            مميز
          </span>
        )}
      </div>

      {/* ── Content zone ── */}
      <div
        className="flex flex-1 flex-col justify-between"
        style={{ padding: "6px 8px 8px" }}
      >
        <div>
          {/* Title */}
          <p
            className={`font-bold line-clamp-1 group-hover:text-primary transition-colors ${
              isDark ? "text-white/90" : "text-foreground"
            }`}
            style={{ fontSize: "clamp(10px, 1vw, 12.5px)", lineHeight: 1.3 }}
          >
            {product.name_ar}
          </p>

          {/* Shop name */}
          {store && (
            <div className="flex items-center gap-1" style={{ marginTop: 1 }}>
              {store.logo_url ? (
                <img
                  src={store.logo_url}
                  alt={store.name_ar}
                  className="rounded-sm object-contain shrink-0"
                  style={{
                    width: 11,
                    height: 11,
                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(22,41,84,0.08)",
                    background: "#fff",
                  }}
                />
              ) : (
                <Store className="shrink-0 text-muted-foreground/25" style={{ width: 10, height: 10 }} />
              )}
              <span
                className={`line-clamp-1 ${isDark ? "text-white/50" : "text-muted-foreground"}`}
                style={{ fontSize: "clamp(8px, 0.75vw, 10px)", fontWeight: 500, opacity: 0.7 }}
              >
                {store.name_ar}
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        {product.price ? (
          <p
            className="font-poppins font-extrabold text-primary"
            style={{ fontSize: "clamp(10px, 1vw, 13px)", marginTop: 2 }}
          >
            {Number(product.price).toLocaleString("ar-EG")} جم
          </p>
        ) : product.price_note ? (
          <p
            className="font-bold text-primary"
            style={{ fontSize: "clamp(9px, 0.8vw, 11px)", marginTop: 2 }}
          >
            {product.price_note}
          </p>
        ) : null}
      </div>
    </Link>
  );
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
  columns = 4,
  maxItems,
  theme = "light",
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";
  const displayed = maxItems ? products.slice(0, maxItems) : products;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
  };

  if (displayed.length === 0) return null;

  return (
    <motion.div
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
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
      {layout === "rail" ? (
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1"
            style={{ gap: "clamp(8px, 1vw, 12px)", scrollbarWidth: "none" }}
          >
          {displayed.map((product) => (
              <div key={product.id} className="shrink-0 snap-start" style={{ width: "clamp(130px, 13vw, 165px)" }}>
                <ProductCard product={product} theme={theme} />
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-6 w-6 items-center justify-center rounded-full border bg-white/90 shadow-sm hover:shadow-md"
          >
            <ChevronRight className="h-3 w-3 text-foreground" />
          </button>
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-6 w-6 items-center justify-center rounded-full border bg-white/90 shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="h-3 w-3 text-foreground" />
          </button>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          style={{ gap: "clamp(8px, 1vw, 12px)", rowGap: "clamp(10px, 1.2vw, 14px)" }}
        >
          {displayed.map((product) => (
            <ProductCard key={product.id} product={product} theme={theme} />
          ))}
        </div>
      )}

      {/* Mobile CTA */}
      <div className="mt-4 flex justify-center lg:hidden">
        <Link to={ctaTo}>
          <Button
            variant={isDark ? "outline-blue" : "cta"}
            className="h-8 rounded-lg px-4 text-[0.72rem] font-bold gap-1"
          >
            {ctaLabel} <ArrowLeft className="h-2.5 w-2.5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
