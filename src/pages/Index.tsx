import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, organizationLd, buildFaqLd } from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HomeContent } from "@/components/home/HomeContent";
import { BackToTop } from "@/components/BackToTop";

const Index = () => {
  /* FAQs are used for JSON-LD and the FAQ section far below the fold —
     defer with a staleTime so the query doesn't block initial paint. */
  const { data: faqs } = useQuery({
    queryKey: ["home-faqs"],
    queryFn: async () => {
      const { data } = await supabase.from("faqs").select("*").order("sort_order").limit(5);
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
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

      <HomeContent faqs={faqs ?? []} />
      <BackToTop />
    </MainLayout>
  );
};

export default Index;
