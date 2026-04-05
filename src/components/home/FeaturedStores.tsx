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
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.03 } } };

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
        .limit(12);
      return data ?? [];
    },
  });

  if (!isLoading && (!stores || stores.length === 0)) return null;

  return (
    <section
      className="bg-card"
      style={{
        contain: "layout style",
        paddingTop: "clamp(20px, 3.5vw, 36px)",
        paddingBottom: "clamp(20px, 3.5vw, 36px)",
      }}
    >
      <div className="container">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {/* Header */}
          <div style={{ marginBottom: 12 }} className="flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker" style={{ fontSize: 11, marginBottom: 4 }}>محلات مميزة</p>
              <h2 className="section-title" style={{ fontFamily: "var(--font-arabic-display)", fontSize: "clamp(15px, 1.4vw, 18px)" }}>
                أبرز المحلات.
              </h2>
            </div>
            <Link to="/stores" className="hidden lg:inline-flex">
              <Button variant="ghost" className="gap-1 text-primary hover:text-primary/80" style={{ fontSize: 13, fontWeight: 700 }}>
                دليل المحلات <ArrowLeft className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
              style={{ gap: "clamp(8px, 1vw, 12px)" }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center border border-border bg-background"
                  style={{ borderRadius: 14, padding: "clamp(8px, 1vw, 12px)" }}
                >
                  <Skeleton className="rounded-xl" style={{ width: 48, height: 48 }} />
                  <Skeleton className="mt-2 h-3 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
              style={{ gap: "clamp(8px, 1vw, 12px)" }}
            >
              {stores!.map((store) => (
                <motion.div key={store.id} variants={cardReveal}>
                  <Link
                    to={`/stores/${store.slug}`}
                    className="group flex flex-col items-center overflow-hidden transition-all duration-[180ms] ease-out hover:-translate-y-0.5"
                    style={{
                      borderRadius: 14,
                      border: "1px solid rgba(22,41,84,0.08)",
                      background: "var(--background)",
                      padding: "clamp(8px, 1vw, 12px)",
                    }}
                  >
                    {/* Logo — dominant */}
                    <div
                      className="flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105"
                      style={{
                        width: "clamp(44px, 5vw, 56px)",
                        height: "clamp(44px, 5vw, 56px)",
                        borderRadius: 12,
                        background: "#fff",
                        padding: 3,
                        marginBottom: 6,
                      }}
                    >
                      {store.logo_url ? (
                        <img
                          src={store.logo_url}
                          alt={store.name_ar}
                          className="object-contain"
                          style={{ width: "100%", height: "100%" }}
                          loading="lazy"
                        />
                      ) : (
                        <Store className="text-muted-foreground/25" style={{ width: 22, height: 22 }} />
                      )}
                    </div>

                    {/* Name */}
                    <h3
                      className="text-center font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors"
                      style={{ fontSize: "clamp(11px, 1.1vw, 13px)", lineHeight: 1.3 }}
                    >
                      {store.name_ar}
                    </h3>

                    {/* Category */}
                    {store.category && (
                      <span
                        className="inline-flex items-center gap-0.5 text-muted-foreground"
                        style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, marginTop: 2 }}
                      >
                        <Tag style={{ width: 8, height: 8 }} />
                        {store.category}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-3 text-center lg:hidden">
            <Link to="/stores">
              <Button variant="outline-blue" className="h-8 gap-1 rounded-lg px-4 font-bold" style={{ fontSize: 12 }}>
                جميع المحلات <ArrowLeft className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
