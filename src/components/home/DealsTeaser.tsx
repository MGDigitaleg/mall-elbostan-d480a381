import { Link } from "react-router-dom";
import { ArrowLeft, Tag, Clock, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const sectionReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export function DealsTeaser() {
  const { data: deals } = useQuery({
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

  const hasDeals = deals && deals.length > 0;

  return (
    <section className="py-7 md:py-9 bg-background">
      <div className="container">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <div className="mb-4 flex items-end justify-between gap-4">
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

          {hasDeals ? (
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {deals.map((deal) => {
                const store = (deal as any).stores;
                const hasExpiry = deal.valid_to;
                const expiryDate = hasExpiry ? new Date(deal.valid_to!) : null;
                const isExpiringSoon = expiryDate
                  ? expiryDate.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
                  : false;

                return (
                  <div
                    key={deal.id}
                    className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden transition-all hover:shadow-[var(--shadow-card)] hover:border-primary/20"
                  >
                    {/* Header accent */}
                    <div className="h-1 bg-gradient-to-l from-primary to-accent" />

                    <div className="flex flex-1 flex-col p-4">
                      {/* Featured badge */}
                      {deal.featured && (
                        <span className="mb-2 inline-flex w-fit rounded-md bg-primary/10 px-2 py-0.5 text-[0.58rem] font-bold text-primary">
                          عرض مميز
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="text-[0.86rem] font-bold text-foreground leading-snug line-clamp-2">
                        {deal.title_ar}
                      </h3>

                      {/* Description */}
                      {deal.description_ar && (
                        <p className="mt-1.5 text-[0.74rem] leading-[1.65] text-muted-foreground line-clamp-2">
                          {deal.description_ar}
                        </p>
                      )}

                      {/* Promo code */}
                      {deal.promo_code && (
                        <div className="mt-2.5 flex items-center gap-2 rounded-md border border-dashed border-primary/30 bg-primary/5 px-2.5 py-1.5">
                          <Tag className="h-3 w-3 text-primary shrink-0" />
                          <span className="font-poppins text-[0.76rem] font-bold text-primary tracking-wide" dir="ltr">
                            {deal.promo_code}
                          </span>
                        </div>
                      )}

                      <div className="mt-auto pt-3 space-y-2">
                        {/* Expiry */}
                        {expiryDate && (
                          <div className="flex items-center gap-1.5">
                            <Clock className={`h-3 w-3 shrink-0 ${isExpiringSoon ? "text-orange-500" : "text-muted-foreground/50"}`} />
                            <span className={`text-[0.66rem] font-semibold ${isExpiringSoon ? "text-orange-600" : "text-muted-foreground"}`}>
                              ينتهي {expiryDate.toLocaleDateString("ar-EG", { day: "numeric", month: "long" })}
                            </span>
                          </div>
                        )}

                        {/* Store */}
                        {store && (
                          <Link
                            to={`/stores/${store.slug}`}
                            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                          >
                            {store.logo_url ? (
                              <img
                                src={store.logo_url}
                                alt={store.name_ar}
                                className="h-4 w-4 rounded object-contain border border-border bg-white shrink-0"
                              />
                            ) : (
                              <Store className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                            )}
                            <span className="text-[0.66rem] font-semibold text-muted-foreground line-clamp-1">
                              {store.name_ar}
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty state — deals coming soon */
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="h-1 bg-gradient-to-l from-primary to-accent" />
              <div className="p-5 md:p-7 text-center">
                <Tag className="mx-auto mb-3 h-8 w-8 text-primary/40" />
                <h3 className="text-[0.9rem] font-bold light-heading">العروض والخصومات قادمة مع الافتتاح</h3>
                <p className="mx-auto mt-1.5 max-w-[24rem] text-[0.78rem] leading-[1.65] light-body">
                  عروض حصرية ومميزة من محلات المول ستتوفر مع الافتتاح الكبير.
                  تابعنا لتكون أول من يعرف.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                  <Link to="/daily-deals">
                    <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.76rem]">
                      <Tag className="ml-1 h-3.5 w-3.5" /> صفحة العروض
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="mt-3 flex justify-center lg:hidden">
            <Link to="/daily-deals">
              <Button variant="secondary" className="h-9 rounded-lg px-5 text-[0.78rem] font-bold">
                جميع العروض
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
