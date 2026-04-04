import { Link } from "react-router-dom";
import { ArrowLeft, Store, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const sectionReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};
const cardReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

export function FeaturedStores() {
  const { data: stores, isLoading } = useQuery({
    queryKey: ["featured-stores-home"],
    queryFn: async () => {
      const { data } = await supabase
        .from("stores")
        .select("id, name_ar, name_en, slug, logo_url, category, unit_code, short_description_ar")
        .eq("featured", true)
        .eq("status", "leased")
        .order("name_ar")
        .limit(8);
      return data ?? [];
    },
  });

  if (!isLoading && (!stores || stores.length === 0)) return null;

  return (
    <section className="bg-card py-8 md:py-12 min-h-[280px]" style={{ contain: "layout style" }}>
      <div className="container">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {/* Header */}
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1">
                <Store className="h-3 w-3 text-primary" />
                <span className="text-[0.68rem] font-bold text-primary">محلات مميزة</span>
              </div>
              <h2 className="text-[1.1rem] font-bold leading-[1.2] text-foreground md:text-[1.3rem]"
                  style={{ fontFamily: "var(--font-arabic-display)" }}>
                أبرز المحلات في مول البستان
              </h2>
              <p className="mt-1.5 max-w-md text-[0.8rem] leading-[1.7] text-muted-foreground">
                تعرّف على أبرز العلامات التجارية التقنية داخل المول
              </p>
            </div>
            <Link to="/stores" className="hidden lg:inline-flex">
              <Button variant="ghost" className="gap-1.5 text-[0.78rem] font-bold text-primary hover:text-primary/80">
                عرض الكل <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background">
                  <div className="flex items-center justify-center border-b border-border bg-muted/20 p-5 md:p-6">
                    <Skeleton className="h-14 w-14 rounded-xl md:h-16 md:w-16" />
                  </div>
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-full mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}
                      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {stores.map((store) => (
              <motion.div key={store.id} variants={cardReveal}>
                <Link to={`/stores/${store.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all hover:border-primary/20 hover:shadow-md">
                  {/* Logo area */}
                  <div className="flex items-center justify-center border-b border-border bg-muted/20 p-5 md:p-6">
                    {store.logo_url ? (
                      <img src={store.logo_url} alt={store.name_ar}
                           className="h-14 w-14 rounded-xl object-contain transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16"
                           loading="lazy" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card md:h-16 md:w-16">
                        <Store className="h-6 w-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-[0.84rem] font-bold text-foreground transition-colors group-hover:text-primary line-clamp-1">
                      {store.name_ar}
                    </h3>
                    {store.name_en && (
                      <p className="mt-0.5 font-poppins text-[0.66rem] text-muted-foreground/60">{store.name_en}</p>
                    )}
                    {store.short_description_ar && (
                      <p className="mt-1.5 text-[0.72rem] leading-[1.6] text-muted-foreground line-clamp-2">
                        {store.short_description_ar}
                      </p>
                    )}

                    {/* Meta row */}
                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                      {store.category && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2.5 py-1 text-[0.62rem] font-semibold text-muted-foreground">
                          <Tag className="h-2.5 w-2.5" />{store.category}
                        </span>
                      )}
                      {store.unit_code && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2.5 py-1 text-[0.62rem] font-bold text-primary">
                          <MapPin className="h-2.5 w-2.5" />{store.unit_code}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          )}

          {/* Mobile CTA */}
          <div className="mt-5 text-center lg:hidden">
            <Link to="/stores">
              <Button variant="outline-blue" className="h-10 gap-1.5 rounded-xl px-6 text-[0.8rem] font-bold">
                عرض جميع المحلات <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
