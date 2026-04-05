import { Link } from "react-router-dom";
import { ArrowLeft, Store, Tag } from "lucide-react";
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
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.04 } } };

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
    <section
      className="bg-card"
      style={{
        contain: "layout style",
        paddingTop: "clamp(36px, 5vw, 80px)",
        paddingBottom: "clamp(36px, 5vw, 80px)",
      }}
    >
      <div className="container">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {/* Header */}
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">محلات مميزة</p>
              <h2 className="section-title" style={{ fontFamily: "var(--font-arabic-display)" }}>
                أبرز المحلات.
              </h2>
            </div>
            <Link to="/stores" className="hidden lg:inline-flex">
              <Button variant="ghost" className="gap-1.5 text-[0.74rem] font-bold text-primary hover:text-primary/80">
                دليل المحلات <ArrowLeft className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                  <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
            >
              {stores!.map((store) => (
                <motion.div key={store.id} variants={cardReveal}>
                  <Link
                    to={`/stores/${store.slug}`}
                    className="group flex items-center gap-3 overflow-hidden rounded-xl border border-border/60 bg-background p-3 transition-all hover:border-primary/15 hover:shadow-sm"
                  >
                    {/* Logo — larger & prominent */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-white p-1 transition-transform duration-300 group-hover:scale-105">
                      {store.logo_url ? (
                        <img
                          src={store.logo_url}
                          alt={store.name_ar}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <Store className="h-5 w-5 text-muted-foreground/25" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="min-w-0">
                      <h3 className="text-[0.76rem] font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {store.name_ar}
                      </h3>
                      {store.category && (
                        <span className="mt-0.5 flex items-center gap-1 text-[0.56rem] font-medium text-muted-foreground line-clamp-1">
                          <Tag className="h-2 w-2 shrink-0" />
                          {store.category}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-4 text-center lg:hidden">
            <Link to="/stores">
              <Button variant="outline-blue" className="h-8 gap-1 rounded-lg px-4 text-[0.72rem] font-bold">
                جميع المحلات <ArrowLeft className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
