import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { TenantLogo } from "@/components/TenantLogo";

export function MerchantLogoWall() {
  const isMobile = useIsMobile();
  const { data: stores, isLoading } = useQuery({
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

  if (!isLoading && (!stores || stores.length === 0)) return null;

  if (isLoading) {
    return (
      <section
        className="heritage-deep relative overflow-hidden"
        style={{
          contain: "layout style",
          paddingTop: "clamp(32px, 4vw, 64px)",
          paddingBottom: "clamp(32px, 4vw, 64px)",
        }}
      >
        <div className="container animate-pulse">
          <div className="h-4 w-24 rounded bg-muted/20 mb-2" />
          <div className="h-6 w-40 rounded bg-muted/20 mb-4" />
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-1.5">
            {Array.from({ length: isMobile ? 8 : 18 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 py-2 px-1.5">
                <div className="h-10 w-10 rounded-lg bg-muted/10" />
                <div className="h-2.5 w-10 rounded bg-muted/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Mobile: 8 logos (2 rows of 4). Desktop: 18 logos (3 rows of 6).
  const sorted = [...stores].sort((a, b) => a.slug === 'kasr-zero' ? -1 : b.slug === 'kasr-zero' ? 1 : 0);
  const displayed = sorted.slice(0, isMobile ? 8 : 18);

  return (
    <section
      className="heritage-deep relative overflow-hidden"
      style={{
        contain: "layout style",
        paddingTop: "clamp(32px, 4vw, 64px)",
        paddingBottom: "clamp(32px, 4vw, 64px)",
      }}
    >
      <div className="relative container">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker dark-kicker">محلات المول</p>
            <h2 className="section-title dark-heading">تعرّف على المحلات.</h2>
          </div>
          <Link to="/stores" className="hidden lg:inline-flex">
            <Button variant="ghost" className="gap-1 text-[0.78rem] font-bold" style={{ color: "#5B9AFF" }}>
              دليل المحلات <ArrowLeft className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9">
          {displayed.map((store) => (
            <Link
              key={store.id}
              to={`/stores/${store.slug}`}
              className="group flex flex-col items-center gap-1 rounded-lg py-2 px-1.5 transition-all heritage-surface hover:border-primary/20 hover:shadow-[0_4px_20px_rgba(37,99,235,0.1)]"
            >
              <div className="transition-transform group-hover:scale-105">
                <TenantLogo
                  src={store.logo_url}
                  alt={store.name_ar}
                  fallbackName={store.name_ar}
                  size="sm"
                  rounded="lg"
                  darkContext
                />
              </div>
              <p className="text-[0.58rem] font-bold dark-heading line-clamp-1 text-center leading-tight">
                {store.name_en || store.name_ar}
              </p>
            </Link>
          ))}
        </div>

        {/* Stats + CTA */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-center">
          {[
            { value: stores.length.toString(), label: "محل نشط" },
            { value: "6", label: "فئات تقنية" },
            { value: "3", label: "أدوار" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="font-poppins text-[0.95rem] font-extrabold" style={{ color: "#5B9AFF" }}>
                {stat.value}
              </span>
              <span className="text-[0.66rem] font-semibold dark-muted">{stat.label}</span>
              {i < 2 && <span className="text-white/10">|</span>}
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-center lg:hidden">
          <Link to="/stores">
            <Button
              className="h-8 rounded-lg border px-4 text-[0.72rem] font-bold"
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
