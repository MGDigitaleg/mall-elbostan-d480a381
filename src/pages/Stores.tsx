import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Store, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingGrid, EmptyState } from "@/components/ui/loading-states";

const Stores = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const { data: stores, isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const { data } = await supabase.from("stores").select("id, slug, name_ar, category, short_description_ar, logo_url, status").neq("status", "hidden").order("featured", { ascending: false });
      return data ?? [];
    },
  });

  const categories = [...new Set(stores?.map((s) => s.category).filter(Boolean) ?? [])];

  const filtered = stores?.filter((s) => {
    const matchSearch = !search || s.name_ar.includes(search) || s.category?.includes(search);
    const matchCategory = !selectedCategory || s.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <MainLayout>
      <SEOHead title="دليل المتاجر" titleEn="Stores Directory" description="تصفح جميع المتاجر في مول البستان - أجهزة، هواتف، جيمنج، وأكثر." descriptionEn="Browse all stores at Mall Elbostan - phones, computers, gaming, and more." breadcrumbs={[{ name: "المتاجر", url: "/stores" }]} />
      <div className="container py-20">
        <h1 className="text-4xl font-bold text-gradient-blue mb-8">دليل المتاجر</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="ابحث عن متجر..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 bg-secondary border-border" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={selectedCategory === "" ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedCategory("")}>الكل</Badge>
            {categories.map((cat) => (
              <Badge key={cat} variant={selectedCategory === cat ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedCategory(cat ?? "")}>
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {isLoading ? (
          <LoadingGrid />
        ) : filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((store) => (
              <Link key={store.id} to={`/stores/${store.slug}`} className="card-premium p-6 hover:glow-blue transition-all group">
                <div className="flex items-center gap-4 mb-3">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt={store.name_ar} className="w-12 h-12 rounded-lg object-cover" loading="lazy" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center"><Store className="w-6 h-6 text-primary" /></div>
                  )}
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{store.name_ar}</h3>
                    {store.category && <span className="text-xs text-accent">{store.category}</span>}
                  </div>
                </div>
                {store.short_description_ar && <p className="text-sm text-muted-foreground">{store.short_description_ar}</p>}
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="لا توجد متاجر" description="لم يتم إضافة متاجر بعد. تابعنا للتحديثات!" />
        )}
      </div>
    </MainLayout>
  );
};

export default Stores;
