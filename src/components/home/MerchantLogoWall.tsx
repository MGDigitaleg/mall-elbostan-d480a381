import { Link } from "react-router-dom";
import { ArrowLeft, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function MerchantLogoWall() {
  const { data: stores } = useQuery({
    queryKey: ["all-stores-logos"],
    queryFn: async () => {
      const { data } = await supabase
        .from("stores")
        .select("id, name_ar, name_en, slug, logo_url, category")
        .eq("status", "leased")
        .order("name_ar");
      return data ?? [];
    },
  });

  if (!stores || stores.length === 0) return null;

  return (
    <section className="py-6 md:py-8" style={{ background: "#F5F2EC" }}>
      <div className="container">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">محلات الفرع الجديد</p>
            <h2 className="section-title">العلامات التجارية داخل المول.</h2>
          </div>
          <Link to="/stores" className="hidden lg:inline-flex">
            <Button variant="ghost" className="gap-1 text-[0.8rem] font-bold text-primary">
              عرض الكل <ArrowLeft className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {stores.map((store) => (
            <Link
              key={store.id}
              to={`/stores/${store.slug}`}
              className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/20 hover:shadow-[var(--shadow-soft)]"
            >
              {store.logo_url ? (
                <img
                  src={store.logo_url}
                  alt={store.name_ar}
                  className="h-12 w-12 rounded-lg border border-border bg-white object-contain p-1.5 transition-transform group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-white">
                  <Store className="h-5 w-5 text-primary/50" />
                </div>
              )}
              <div className="text-center">
                <p className="text-[0.72rem] font-bold light-heading line-clamp-1">{store.name_ar}</p>
                {store.category && (
                  <p className="mt-0.5 text-[0.58rem] light-muted line-clamp-1">{store.category}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex justify-center lg:hidden">
          <Link to="/stores">
            <Button variant="secondary" className="h-9 rounded-lg px-5 text-[0.78rem] font-bold">
              عرض جميع المحلات
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
