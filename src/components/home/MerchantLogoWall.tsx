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
    <section className="heritage-deep relative overflow-hidden py-8 md:py-10">
      <div className="relative container">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker dark-kicker">تجّار الفرع الجديد</p>
            <h2 className="section-title dark-heading">العلامات التجارية داخل المول.</h2>
          </div>
          <Link to="/stores" className="hidden lg:inline-flex">
            <Button variant="ghost" className="gap-1 text-[0.8rem] font-bold" style={{ color: "#5B9AFF" }}>
              عرض الكل <ArrowLeft className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {stores.map((store) => (
            <Link
              key={store.id}
              to={`/stores/${store.slug}`}
              className="group flex flex-col items-center gap-2 rounded-lg p-3 transition-all heritage-surface hover:border-primary/20"
            >
              {store.logo_url ? (
                <img
                  src={store.logo_url}
                  alt={store.name_ar}
                  className="h-12 w-12 rounded-lg border border-white/10 bg-white/5 object-contain p-1 transition-transform group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Store className="h-5 w-5" style={{ color: "#5B9AFF" }} />
                </div>
              )}
              <div className="text-center">
                <p className="text-[0.72rem] font-bold dark-heading line-clamp-1">{store.name_ar}</p>
                {store.category && (
                  <p className="mt-0.5 text-[0.58rem] dark-muted line-clamp-1">{store.category}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 flex justify-center lg:hidden">
          <Link to="/stores">
            <Button className="h-9 rounded-lg border px-5 text-[0.78rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
              عرض جميع المتاجر
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
