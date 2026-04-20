import { Link } from "react-router-dom";
import { ArrowLeft, Tag, Clock, Store, Zap, Gift, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/home/Reveal";

const PROMO_CARDS = [
  {
    icon: Zap,
    title: "عروض الافتتاح",
    desc: "خصومات حصرية من محلات المول احتفالاً بالافتتاح الكبير.",
    color: "#F97316",
    to: "/daily-deals",
  },
  {
    icon: Gift,
    title: "أدر واربح",
    desc: "جوائز حقيقية من المحلات المشاركة — سجّل الآن.",
    color: "#2563EB",
    to: "/spin-win",
  },
  {
    icon: ShoppingBag,
    title: "منتجات مميزة",
    desc: "تصفّح أحدث المنتجات من محلات مول البستان.",
    color: "#06B6D4",
    to: "/products",
  },
];

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
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
        paddingTop: "clamp(48px, 6vw, 96px)",
        paddingBottom: "clamp(48px, 6vw, 96px)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }}
        />
      </div>

      <div className="container relative">
        <Reveal rootMargin="-60px" offset={12}>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.04em] mb-1.5" style={{ color: "#F97316" }}>
                عروض وحملات
              </p>
              <h2
                className="text-[1rem] md:text-[1.15rem] font-bold leading-[1.2]"
                style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}
              >
                عروض الافتتاح والمزايا.
              </h2>
            </div>
            <Link to="/daily-deals" className="hidden lg:inline-flex shrink-0">
              <Button
                variant="ghost"
                className="gap-1.5 text-[0.78rem] font-bold"
                style={{ color: "#60A5FA" }}
              >
                جميع العروض <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Layout: promo banner + deal cards */}
          <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
            {/* Left: promo campaign cards */}
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {PROMO_CARDS.map((card) => (
                <Link
                  key={card.title}
                  to={card.to}
                  className="group flex items-start gap-3.5 rounded-xl p-4 transition-all duration-200 hover:bg-white/[0.04]"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                    style={{ background: `${card.color}10`, border: `1px solid ${card.color}18` }}
                  >
                    <card.icon className="h-4 w-4" style={{ color: card.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.82rem] font-bold leading-snug" style={{ color: "#F1F5F9" }}>
                      {card.title}
                    </p>
                    <p className="mt-1 text-[0.7rem] leading-[1.6] line-clamp-2" style={{ color: "#94A3B8" }}>
                      {card.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Right: live deal cards */}
            <div>
              {isLoading ? (
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <Skeleton className="h-3 w-1/3 bg-white/10" />
                      <Skeleton className="h-4 w-3/4 bg-white/10" />
                      <Skeleton className="h-3 w-full bg-white/10" />
                    </div>
                  ))}
                </div>
              ) : hasDeals ? (
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {deals.map((deal) => {
                    const store = (deal as any).stores;
                    const expiryDate = deal.valid_to ? new Date(deal.valid_to) : null;
                    const isExpiringSoon = expiryDate
                      ? expiryDate.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
                      : false;

                    return (
                      <div
                        key={deal.id}
                        className="flex flex-col rounded-xl overflow-hidden transition-all hover:bg-white/[0.04]"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <div className="h-0.5" style={{ background: "linear-gradient(to left, #F9731660, #F9731620)" }} />
                        <div className="flex flex-1 flex-col p-4">
                          <h3 className="text-[0.84rem] font-bold leading-snug line-clamp-2" style={{ color: "#F1F5F9" }}>
                            {deal.title_ar}
                          </h3>

                          {deal.description_ar && (
                            <p className="mt-1.5 text-[0.72rem] leading-[1.6] line-clamp-2" style={{ color: "#94A3B8" }}>
                              {deal.description_ar}
                            </p>
                          )}

                          {deal.promo_code && (
                            <div
                              className="mt-2.5 flex items-center gap-2 rounded-md px-2.5 py-1.5"
                              style={{ background: "#F9731608", border: "1px dashed #F9731625" }}
                            >
                              <Tag className="h-3 w-3 shrink-0" style={{ color: "#F97316" }} />
                              <span className="font-poppins text-[0.74rem] font-bold tracking-wide" style={{ color: "#F97316" }} dir="ltr">
                                {deal.promo_code}
                              </span>
                            </div>
                          )}

                          <div className="mt-auto pt-3 space-y-1.5">
                            {expiryDate && (
                              <div className="flex items-center gap-1.5">
                                <Clock className={`h-2.5 w-2.5 shrink-0 ${isExpiringSoon ? "text-orange-400" : ""}`} style={isExpiringSoon ? {} : { color: "#64748B" }} />
                                <span className={`text-[0.62rem] ${isExpiringSoon ? "text-orange-400 font-semibold" : ""}`} style={isExpiringSoon ? {} : { color: "#64748B" }}>
                                  ينتهي {expiryDate.toLocaleDateString("ar-EG", { day: "numeric", month: "long" })}
                                </span>
                              </div>
                            )}
                            {store && (
                              <Link to={`/stores/${store.slug}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                                {store.logo_url ? (
                                  <img src={store.logo_url} alt={store.name_ar} className="h-3.5 w-3.5 rounded object-contain border border-white/10 bg-white shrink-0" />
                                ) : (
                                  <Store className="h-2.5 w-2.5 shrink-0" style={{ color: "#64748B" }} />
                                )}
                                <span className="text-[0.62rem] line-clamp-1" style={{ color: "#64748B" }}>{store.name_ar}</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Pre-launch state */
                <div className="flex flex-col items-center justify-center rounded-xl p-8 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", minHeight: "280px" }}>
                  <Tag className="mb-3 h-8 w-8" style={{ color: "#F97316", opacity: 0.4 }} />
                  <h3 className="text-[0.92rem] font-bold" style={{ color: "#F1F5F9" }}>
                    العروض تبدأ مع الافتتاح
                  </h3>
                  <p className="mt-1.5 max-w-[18rem] text-[0.76rem] leading-[1.6]" style={{ color: "#94A3B8" }}>
                    عروض حصرية من محلات المول احتفالاً بالافتتاح الكبير — ترقبوا التفاصيل قريباً.
                  </p>
                  <Link to="/daily-deals" className="mt-4">
                    <Button
                      className="h-9 rounded-xl px-5 text-[0.78rem] font-bold"
                      style={{ background: "#F97316", color: "#fff" }}
                    >
                      صفحة العروض
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex justify-center lg:hidden">
            <Link to="/daily-deals">
              <Button
                className="h-9 rounded-xl px-5 text-[0.78rem] font-bold gap-1.5"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#CBD5E1" }}
              >
                جميع العروض <ArrowLeft className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
