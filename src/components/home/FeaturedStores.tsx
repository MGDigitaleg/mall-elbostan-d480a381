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
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

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
      className="bg-card min-h-[260px]"
      style={{
        contain: "layout style",
        paddingTop: "clamp(40px, 5.5vw, 88px)",
        paddingBottom: "clamp(40px, 5.5vw, 88px)",
      }}
    >
      <div className="container">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {/* Header */}
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">محلات مميزة</p>
              <h2
                className="section-title"
                style={{ fontFamily: "var(--font-arabic-display)" }}
              >
                أبرز المحلات.
              </h2>
            </div>
            <Link to="/stores" className="hidden lg:inline-flex">
              <Button variant="ghost" className="gap-1.5 text-[0.78rem] font-bold text-primary hover:text-primary/80">
                دليل المحلات <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-background p-5">
                  <Skeleton className="mx-auto h-12 w-12 rounded-xl" />
                  <Skeleton className="mx-auto mt-3 h-4 w-2/3" />
                  <Skeleton className="mx-auto mt-2 h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            >
              {stores!.map((store) => (
                <motion.div key={store.id} variants={cardReveal}>
                  <Link
                    to={`/stores/${store.slug}`}
                    className="group flex flex-col items-center overflow-hidden rounded-xl border border-border/70 bg-background p-5 text-center transition-all hover:border-primary/15 hover:shadow-sm"
                  >
                    {/* Logo */}
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-1.5 transition-transform duration-300 group-hover:scale-105">
                      {store.logo_url ? (
                        <img
                          src={store.logo_url}
                          alt={store.name_ar}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <Store className="h-6 w-6 text-muted-foreground/25" />
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="mt-3 text-[0.82rem] font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {store.name_ar}
                    </h3>

                    {/* Category */}
                    {store.category && (
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-muted/40 px-2 py-0.5 text-[0.58rem] font-medium text-muted-foreground">
                        <Tag className="h-2 w-2" />
                        {store.category}
                      </span>
                    )}

                    {/* Unit */}
                    {store.unit_code && (
                      <span className="mt-1 text-[0.58rem] font-medium text-primary/60">
                        {store.unit_code}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-5 text-center lg:hidden">
            <Link to="/stores">
              <Button variant="outline-blue" className="h-9 gap-1.5 rounded-xl px-5 text-[0.78rem] font-bold">
                جميع المحلات <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
