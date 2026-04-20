import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, organizationLd, buildFaqLd } from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HomeContent } from "@/components/home/HomeContent";
import { BackToTop } from "@/components/BackToTop";

const Index = () => {
  const { data: featuredStores } = useQuery({
    queryKey: ["featured-stores"],
    queryFn: async () => {
      const { data } = await supabase.from("stores").select("id, name_ar, category, slug, logo_url, short_description_ar").eq("featured", true).eq("status", "leased").limit(6);
      return data ?? [];
    },
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").eq("featured", true).order("event_date", { ascending: true }).limit(3);
      return data ?? [];
    },
  });

  const { data: faqs } = useQuery({
    queryKey: ["home-faqs"],
    queryFn: async () => {
      const { data } = await supabase.from("faqs").select("*").order("sort_order").limit(5);
      return data ?? [];
    },
  });

  return (
    <MainLayout>
      <SEOHead
        title="الرئيسية"
        titleEn="Home"
        description="مول البستان — وجهة تجارية راسخة في القاهرة الجديدة لعالم الإلكترونيات والتقنية. أكثر من 150 وحدة تجارية متخصصة يعرفها السوق."
        descriptionEn="Mall Elbostan — an established commercial landmark for technology retail in New Cairo. 150+ specialized units trusted by the market."
        jsonLd={[organizationLd, ...(faqs && faqs.length > 0 ? [buildFaqLd(faqs)] : [])]}
      />

      <HomeContent faqs={faqs ?? []} featuredStores={featuredStores ?? []} upcomingEvents={upcomingEvents ?? []} />
      <BackToTop />
    </MainLayout>
  );
};

export default Index;
