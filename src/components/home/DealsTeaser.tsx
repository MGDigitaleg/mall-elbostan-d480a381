import { Link } from "react-router-dom";
import { ArrowLeft, Tag, Clock, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const sectionReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export function DealsTeaser() {
  const { data: deals, isLoading } = useQuery({
    queryKey: ["home-deals"],
    queryFn: async () => {
      const { data } = await supabase
        .from("deals")
        .select("id, title_ar, description_ar, promo_code, valid_to, featured, stores(name_ar, slug, logo_url)")
        .eq("is_live", true)
        .order("featured", { ascending: false })
        .limit(4);
      return data ?? [];
    },
  });

  const hasDeals = !isLoading && deals && deals.length > 0;

  return (
    <section
      className="bg-background min-h-[180px]"
      style={{
        contain: "layout style",
        paddingTop: "clamp(36px, 5vw, 80px)",
        paddingBottom: "clamp(36px, 5vw, 80px)",
      }}
    >
      <div className="container">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">عروض المحلات</p>
              <h2 className="section-title">أحدث العروض.</h2>
            </div>
            <Link to="/daily-deals" className="hidden lg:inline-flex">
              <Button variant="ghost" className="gap-1 text-[0.78rem] font-bold text-primary">
                جميع العروض <ArrowLeft className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : hasDeals ? (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {deals.map((deal) => {
                const store = (deal as any).stores;
                const expiryDate = deal.valid_to ? new Date(deal.valid_to) : null;
                const isExpiringSoon = expiryDate
                  ? expiryDate.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
                  : false;

                return (
                  <div
                    key={deal.id}
                    className="group flex flex-col rounded-xl border border-border/80 bg-card overflow-hidden transition-all hover:shadow-sm hover:border-primary/15"
                  >
                    <div className="h-0.5 bg-gradient-to-l from-primary/60 to-primary/20" />
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="text-[0.84rem] font-bold text-foreground leading-snug line-clamp-2">
                        {deal.title_ar}
                      </h3>

                      {deal.description_ar && (
                        <p className="mt-1.5 text-[0.72rem] leading-[1.6] text-muted-foreground line-clamp-2">
                          {deal.description_ar}
                        </p>
                      )}

                      {deal.promo_code && (
                        <div className="mt-2.5 flex items-center gap-2 rounded-md border border-dashed border-primary/25 bg-primary/5 px-2.5 py-1.5">
                          <Tag className="h-3 w-3 text-primary shrink-0" />
                          <span className="font-poppins text-[0.74rem] font-bold text-primary tracking-wide" dir="ltr">
                            {deal.promo_code}
                          </span>
                        </div>
                      )}

                      <div className="mt-auto pt-3 space-y-1.5">
                        {expiryDate && (
                          <div className="flex items-center gap-1.5">
                            <Clock className={`h-2.5 w-2.5 shrink-0 ${isExpiringSoon ? "text-orange-500" : "text-muted-foreground/40"}`} />
                            <span className={`text-[0.62rem] ${isExpiringSoon ? "text-orange-600 font-semibold" : "text-muted-foreground"}`}>
                              ينتهي {expiryDate.toLocaleDateString("ar-EG", { day: "numeric", month: "long" })}
                            </span>
                          </div>
                        )}
                        {store && (
                          <Link to={`/stores/${store.slug}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                            {store.logo_url ? (
                              <img src={store.logo_url} alt={store.name_ar}
                                   className="h-3.5 w-3.5 rounded object-contain border border-border bg-white shrink-0" />
                            ) : (
                              <Store className="h-2.5 w-2.5 text-muted-foreground/40 shrink-0" />
                            )}
                            <span className="text-[0.62rem] text-muted-foreground line-clamp-1">{store.name_ar}</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Compact empty state */
            <div className="rounded-xl border border-border bg-card p-5 md:p-6 text-center max-w-md mx-auto">
              <Tag className="mx-auto mb-2 h-6 w-6 text-primary/30" />
              <h3 className="text-[0.86rem] font-bold text-foreground">العروض تبدأ مع الافتتاح</h3>
              <p className="mt-1 text-[0.74rem] leading-[1.6] text-muted-foreground">
                عروض حصرية من محلات المول مع الافتتاح الكبير.
              </p>
              <Link to="/daily-deals" className="mt-3 inline-flex">
                <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.76rem]">
                  صفحة العروض
                </Button>
              </Link>
            </div>
          )}

          <div className="mt-4 flex justify-center lg:hidden">
            <Link to="/daily-deals">
              <Button variant="secondary" className="h-9 rounded-lg px-5 text-[0.76rem] font-bold">
                جميع العروض
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
