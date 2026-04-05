import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Search, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const KzSearch = () => {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const { data: results, isLoading } = useQuery({
    queryKey: ["kz-search", trimmed],
    queryFn: async () => {
      if (!trimmed) return [];
      const { data } = await supabase
        .from("kz_products")
        .select("*, kz_product_variants(price, compare_price, is_default), kz_product_images(image_url, sort_order)")
        .eq("status", "published")
        .or(`title.ilike.%${trimmed}%,brand.ilike.%${trimmed}%,description.ilike.%${trimmed}%`)
        .limit(20);
      return data ?? [];
    },
    enabled: trimmed.length > 1,
  });

  return (
    <MainLayout>
      <SEOHead title="بحث - Kasr Zero" titleEn="Search - Kasr Zero" description="ابحث عن منتج في Kasr Zero" />

      <section className="py-8 md:py-10" style={{ background: "linear-gradient(135deg, #071326 0%, #0d1f3c 100%)" }}>
        <div className="container max-w-[700px]">
          <h1 className="mb-4 text-[1.4rem] font-extrabold text-center" style={{ color: "#F8FAFC" }}>ابحث عن منتج</h1>
          <div className="relative">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: "#475569" }} />
            <input
              type="text" placeholder="اكتب اسم المنتج أو الماركة..." value={query}
              onChange={(e) => setQuery(e.target.value)} autoFocus
              className="h-12 w-full rounded-xl pr-12 pl-5 text-[0.92rem] outline-none transition-all focus:ring-2"
              style={{ border: "1px solid #ffffff18", background: "#ffffff0A", color: "#F8FAFC" }}
            />
          </div>
        </div>
      </section>

      <section className="py-6 md:py-8" style={{ background: "hsl(var(--background))" }}>
        <div className="container max-w-[1200px]">
          {!trimmed ? (
            <p className="text-center text-[0.84rem] text-muted-foreground py-12">ابدأ بكتابة اسم المنتج أو الماركة</p>
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <Skeleton className="aspect-square w-full" /><div className="p-3 space-y-2"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
                </div>
              ))}
            </div>
          ) : results && results.length > 0 ? (
            <>
              <p className="mb-4 text-[0.82rem] text-muted-foreground">{results.length} نتيجة لـ "{trimmed}"</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {results.map((product: any) => {
                  const variant = product.kz_product_variants?.find((v: any) => v.is_default) ?? product.kz_product_variants?.[0];
                  const image = product.kz_product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)?.[0];
                  return (
                    <Link key={product.id} to={`/kz/products/${product.slug}`} className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/20 hover:shadow-md">
                      <div className="aspect-square overflow-hidden bg-card dark:bg-muted/20">
                        {image ? <img src={image.image_url} alt={product.title} className="h-full w-full object-contain p-3 transition-transform group-hover:scale-105" loading="lazy" /> : <div className="flex h-full w-full items-center justify-center"><ShoppingBag className="h-8 w-8 text-muted-foreground/20" /></div>}
                      </div>
                      <div className="p-3">
                        <p className="text-[0.78rem] font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{product.title}</p>
                        {variant && <p className="mt-1 font-poppins text-[0.88rem] font-bold text-foreground">{Number(variant.price).toLocaleString("ar-EG")} ج.م</p>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
              <p className="text-[0.88rem] font-bold text-foreground">لا توجد نتائج لـ "{trimmed}"</p>
              <p className="mt-1 text-[0.78rem] text-muted-foreground">جرّب كلمات مختلفة</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default KzSearch;
