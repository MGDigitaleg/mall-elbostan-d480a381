import { Link } from "react-router-dom";
import { ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/home/Reveal";
import { TenantLogo } from "@/components/TenantLogo";

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
      className="bg-card dark:bg-background"
      style={{
        contain: "layout style",
        paddingTop: "clamp(20px, 3.5vw, 36px)",
        paddingBottom: "clamp(20px, 3.5vw, 36px)",
      }}
    >
      <div className="container">
        <Reveal rootMargin="-60px" offset={12}>
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
            <div
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
              style={{ gap: "clamp(8px, 1vw, 12px)" }}
            >
              {[...stores!].sort((a, b) => a.slug === 'kasr-zero' ? -1 : b.slug === 'kasr-zero' ? 1 : 0).map((store) => (
                <Link
                  key={store.id}
                  to={`/stores/${store.slug}`}
                  className="group flex flex-col items-center overflow-hidden transition-all duration-[180ms] ease-out hover:-translate-y-0.5 bg-background border border-border/40 dark:border-border/60 dark:bg-card"
                  style={{
                    borderRadius: 14,
                    padding: "clamp(8px, 1vw, 12px)",
                  }}
                >
                  {/* Logo — unified component */}
                  <div className="mb-1.5 transition-transform duration-300 group-hover:scale-105">
                    <TenantLogo
                      src={store.logo_url}
                      alt={store.name_ar}
                      size="sm"
                      rounded="lg"
                    />
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
              ))}
            </div>
          )}

          <div className="mt-3 text-center lg:hidden">
            <Link to="/stores">
              <Button variant="outline-blue" className="h-8 gap-1 rounded-lg px-4 font-bold" style={{ fontSize: 12 }}>
                جميع المحلات <ArrowLeft className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
