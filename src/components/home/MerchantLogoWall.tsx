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
        .select("id, name_ar, name_en, slug, logo_url, category, unit_code")
        .eq("status", "leased")
        .order("name_ar");
      return data ?? [];
    },
  });

  if (!stores || stores.length === 0) return null;

  return (
    <section className="heritage-deep relative overflow-hidden py-7 md:py-9">
      <div className="relative container">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker dark-kicker">محلات المول</p>
            <h2 className="section-title dark-heading">تعرّف على المحلات.</h2>
            <p className="mt-1 text-[0.78rem] dark-muted max-w-md">
              {stores.length} محل تقنية متخصص — تصفّح وتعرّف على كل علامة تجارية.
            </p>
          </div>
          <Link to="/stores" className="hidden lg:inline-flex">
            <Button variant="ghost" className="gap-1 text-[0.78rem] font-bold" style={{ color: "#5B9AFF" }}>
              دليل المحلات <ArrowLeft className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {stores.map((store) => (
            <Link
              key={store.id}
              to={`/stores/${store.slug}`}
              className="group flex flex-col items-center gap-2 rounded-lg p-3 transition-all heritage-surface hover:border-primary/20 hover:shadow-[0_4px_20px_rgba(37,99,235,0.12)]"
            >
              {/* Logo container */}
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-white/[0.18] bg-white p-1.5 transition-transform group-hover:scale-105">
                {store.logo_url ? (
                  <img
                    src={store.logo_url}
                    alt={store.name_ar}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <Store className="h-6 w-6" style={{ color: "#5B9AFF" }} />
                )}
              </div>

              {/* Name */}
              <p className="text-[0.68rem] font-bold dark-heading line-clamp-1 text-center leading-tight">
                {store.name_ar}
              </p>

              {/* Category chip */}
              {store.category && (
                <span
                  className="rounded-full px-2 py-[1px] text-[0.52rem] font-semibold line-clamp-1 text-center"
                  style={{
                    background: "rgba(45,107,255,0.1)",
                    color: "#7EB4FF",
                    border: "1px solid rgba(45,107,255,0.15)",
                  }}
                >
                  {store.category}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-center">
          {[
            { value: stores.length.toString(), label: "محل نشط" },
            { value: "6", label: "فئات تقنية" },
            { value: "3", label: "أدوار" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="font-poppins text-[1rem] font-extrabold" style={{ color: "#5B9AFF" }}>
                {stat.value}
              </span>
              <span className="text-[0.68rem] font-semibold dark-muted">{stat.label}</span>
              <span className="text-navy-foreground/15 last:hidden">|</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center lg:hidden">
          <Link to="/stores">
            <Button
              className="h-9 rounded-lg border px-5 text-[0.76rem] font-bold"
              style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}
            >
              عرض جميع المحلات
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
