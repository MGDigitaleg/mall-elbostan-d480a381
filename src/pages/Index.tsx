import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, organizationLd, shoppingCenterLd, websiteLd, buildFaqLd } from "@/components/SEOHead";
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
        title="مول تكنولوجيا وإلكترونيات في القاهرة الجديدة"
        titleEn="Technology & Electronics Mall in New Cairo"
        description="مول البستان — أكبر مول متخصص في الكمبيوتر والموبايلات والإلكترونيات بالتجمع الخامس. أكثر من 150 محل لابتوبات، هواتف، جيمنج، إكسسوارات، وصيانة. زُر الخريطة التفاعلية واكتشف المحلات."
        descriptionEn="Mall Elbostan — the largest technology & electronics mall in New Cairo's Fifth Settlement. 150+ stores for laptops, phones, gaming, accessories & repairs. Explore the interactive map."
        keywords="مول البستان, مول تكنولوجيا, محلات كمبيوتر القاهرة الجديدة, محلات موبايلات التجمع الخامس, لابتوب, جيمنج, اكسسوارات, صيانة, الكترونيات, Mall Elbostan, technology mall Cairo"
        ogImageWidth={1200}
        ogImageHeight={630}
        jsonLd={[organizationLd, shoppingCenterLd, websiteLd, ...(faqs && faqs.length > 0 ? [buildFaqLd(faqs)] : [])]}
      />

      <HomeContent faqs={faqs ?? []} />
      <BackToTop />
    </MainLayout>
  );
};

export default Index;
