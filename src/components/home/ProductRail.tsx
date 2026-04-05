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

function ProductCard({ product, theme = "light" }: { product: Product; theme?: "light" | "dark" }) {
  const store = product.stores;
  const isDark = theme === "dark";

  return (
    <Link
      to={`/products/${product.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-md ${
        isDark
          ? "border-white/[0.08] bg-white/[0.04] hover:border-primary/20 hover:shadow-primary/[0.06]"
          : "border-border/60 bg-white hover:border-primary/15 hover:shadow-primary/[0.06]"
      }`}
    >
      {/* Image — reduced from aspect-square to ~65% ratio */}
      <div className={`relative aspect-[4/3] overflow-hidden ${isDark ? "bg-white/[0.03]" : "bg-[#F5F6F8]"}`}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name_ar}
            className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-muted-foreground/10" />
          </div>
        )}

        {store?.category && (
          <span className={`absolute top-2 right-2 rounded-md px-1.5 py-[2px] text-[0.52rem] font-bold leading-tight backdrop-blur-sm ${
            isDark ? "bg-white/10 text-white/80" : "bg-foreground/75 text-white"
          }`}>
            {store.category}
          </span>
        )}

        {product.featured && (
          <span className="absolute top-2 left-2 flex items-center gap-0.5 rounded-md bg-primary/90 px-1.5 py-[2px] text-[0.5rem] font-bold text-white leading-tight backdrop-blur-sm">
            <Sparkles className="h-2 w-2" />
            مميز
          </span>
        )}
      </div>

      {/* Info — tighter padding */}
      <div className={`flex flex-1 flex-col justify-between border-t p-2.5 ${
        isDark ? "border-white/[0.06]" : "border-border/40"
      }`}>
        <div>
          <p className={`text-[0.72rem] font-bold line-clamp-2 leading-[1.4] group-hover:text-primary transition-colors ${
            isDark ? "text-white/90" : "text-foreground"
          }`}>
            {product.name_ar}
          </p>
          {store && (
            <div className="mt-1 flex items-center gap-1">
              {store.logo_url ? (
                <img
                  src={store.logo_url}
                  alt={store.name_ar}
                  className="h-3.5 w-3.5 rounded-sm object-contain border border-border/50 bg-white shrink-0"
                />
              ) : (
                <Store className="h-2.5 w-2.5 text-muted-foreground/25 shrink-0" />
              )}
              <span className={`text-[0.58rem] line-clamp-1 ${isDark ? "text-white/40" : "text-muted-foreground"}`}>
                {store.name_ar}
              </span>
            </div>
          )}
        </div>

        {product.price ? (
          <p className="mt-1.5 font-poppins text-[0.8rem] font-extrabold text-primary">
            {Number(product.price).toLocaleString("ar-EG")} جم
          </p>
        ) : product.price_note ? (
          <p className="mt-1.5 text-[0.66rem] font-bold text-primary">
            {product.price_note}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

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
    const amount = 280;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
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
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          {kicker && (
            <p className={`text-[0.64rem] font-semibold tracking-[0.04em] mb-1 ${
              isDark ? "text-[#60A5FA]" : "section-kicker"
            }`}>
              {kicker}
            </p>
          )}
          <h2 className={`text-[0.95rem] md:text-[1.08rem] font-bold leading-[1.2] ${
            isDark ? "text-[#F8FAFC]" : "text-foreground"
          }`} style={{ fontFamily: "var(--font-arabic-display)" }}>
            {title}
          </h2>
          {subtitle && (
            <p className={`mt-0.5 text-[0.72rem] leading-[1.6] max-w-md ${
              isDark ? "text-[#94A3B8]" : "text-muted-foreground"
            }`}>
              {subtitle}
            </p>
          )}
        </div>
        <Link to={ctaTo} className="hidden lg:inline-flex shrink-0">
          <Button variant="ghost" className={`gap-1.5 text-[0.74rem] font-bold ${
            isDark ? "text-[#60A5FA] hover:text-[#93BBFD]" : "text-primary hover:text-primary/80"
          }`}>
            {ctaLabel} <ArrowLeft className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Product display */}
      {layout === "rail" ? (
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-2.5 md:gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {displayed.map((product) => (
              <div
                key={product.id}
                className="w-[170px] md:w-[200px] lg:w-[215px] shrink-0 snap-start"
              >
                <ProductCard product={product} theme={theme} />
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-7 w-7 items-center justify-center rounded-full border bg-white/90 shadow-sm transition-all hover:shadow-md"
            style={{ borderColor: isDark ? "#ffffff15" : undefined }}
          >
            <ChevronRight className="h-3.5 w-3.5 text-foreground" />
          </button>
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-7 w-7 items-center justify-center rounded-full border bg-white/90 shadow-sm transition-all hover:shadow-md"
            style={{ borderColor: isDark ? "#ffffff15" : undefined }}
          >
            <ChevronLeft className="h-3.5 w-3.5 text-foreground" />
          </button>
        </div>
      ) : (
        <div className={`grid gap-2.5 md:gap-3 grid-cols-2 md:grid-cols-3 ${
          columns === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4 xl:grid-cols-5"
        }`}>
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
