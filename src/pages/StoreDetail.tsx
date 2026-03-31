import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Phone, Globe, Mail, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

const StoreDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: store, isLoading } = useQuery({
    queryKey: ["store", slug],
    queryFn: async () => {
      const { data } = await supabase.from("stores").select("*").eq("slug", slug!).maybeSingle();
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) return <MainLayout><div className="container py-20 text-center text-muted-foreground">جاري التحميل...</div></MainLayout>;
  if (!store) return <MainLayout><div className="container py-20 text-center"><h1 className="text-2xl font-bold text-foreground mb-4">المتجر غير موجود</h1><Link to="/stores"><Button variant="outline-blue">العودة للمتاجر</Button></Link></div></MainLayout>;

  return (
    <MainLayout>
      <SEOHead title={store.name_ar} description={store.short_description_ar ?? `${store.name_ar} في مول البستان`} breadcrumbs={[{ name: "المتاجر", url: "/stores" }, { name: store.name_ar, url: `/stores/${store.slug}` }]} />
      <div className="container py-20 max-w-4xl">
        <Link to="/stores" className="text-primary text-sm flex items-center gap-1 mb-6 hover:underline">
          <ArrowRight className="w-4 h-4" /> العودة لدليل المتاجر
        </Link>

        <div className="flex items-center gap-6 mb-8">
          {store.logo_url ? (
            <img src={store.logo_url} alt={store.name_ar} className="w-20 h-20 rounded-xl object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-primary/20 flex items-center justify-center"><Store className="w-10 h-10 text-primary" /></div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground">{store.name_ar}</h1>
            {store.name_en && <p className="text-muted-foreground font-poppins">{store.name_en}</p>}
            {store.category && <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded mt-1 inline-block">{store.category}</span>}
          </div>
        </div>

        {store.cover_image_url && (
          <img src={store.cover_image_url} alt={store.name_ar} className="w-full h-64 object-cover rounded-xl mb-8" loading="lazy" />
        )}

        {store.long_description_ar && (
          <div className="card-premium p-6 mb-6">
            <h2 className="font-bold text-lg mb-3">عن المتجر</h2>
            <p className="text-muted-foreground leading-relaxed">{store.long_description_ar}</p>
          </div>
        )}

        <div className="card-premium p-6">
          <h2 className="font-bold text-lg mb-3">معلومات الاتصال</h2>
          <div className="space-y-3 text-muted-foreground">
            {store.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> <span dir="ltr">{store.phone}</span></p>}
            {store.email && <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> {store.email}</p>}
            {store.website && <p className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{store.website}</a></p>}
            {store.opening_hours && <p>🕐 {store.opening_hours}</p>}
            {store.whatsapp && (
              <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <Button variant="cta" size="sm" className="mt-2">تواصل عبر واتساب</Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StoreDetail;
