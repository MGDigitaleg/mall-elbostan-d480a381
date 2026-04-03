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
    <section className="heritage-deep relative overflow-hidden py-7 md:py-9">
      <div className="relative container">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker dark-kicker">محلات الفرع الجديد</p>
            <h2 className="section-title dark-heading">العلامات التجارية داخل المول.</h2>
          </div>
          <Link to="/stores" className="hidden lg:inline-flex">
            <Button variant="ghost" className="gap-1 text-[0.78rem] font-bold" style={{ color: "#5B9AFF" }}>
              عرض الكل <ArrowLeft className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
          {stores.map((store) => (
            <Link
              key={store.id}
              to={`/stores/${store.slug}`}
              className="group flex flex-col items-center gap-1.5 rounded-lg p-2.5 transition-all heritage-surface hover:border-primary/20"
            >
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5">
                {store.logo_url ? (
                  <img
                    src={store.logo_url}
                    alt={store.name_ar}
                    className="h-full w-full object-contain transition-transform group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <Store className="h-5 w-5" style={{ color: "#5B9AFF" }} />
                )}
              </div>
              <p className="text-[0.65rem] font-bold dark-heading line-clamp-1 text-center">{store.name_ar}</p>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex justify-center lg:hidden">
          <Link to="/stores">
            <Button className="h-9 rounded-lg border px-5 text-[0.76rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
              عرض جميع المحلات
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
