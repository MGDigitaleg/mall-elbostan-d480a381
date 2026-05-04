import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildCoreGraphLd, buildFaqLd, buildSiteNavLd, buildSpeakableLd } from "@/components/SEOHead";
import { useSitePhone } from "@/hooks/useSitePhone";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HomeContent } from "@/components/home/HomeContent";
import { BackToTop } from "@/components/BackToTop";

const Index = () => {
  const { phone } = useSitePhone();

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

  const homeBreadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://mallelbostan.com/#breadcrumb",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: "https://mallelbostan.com/",
      },
    ],
  };

  const extras = [
    ...(faqs && faqs.length > 0 ? [buildFaqLd(faqs)] : []),
    buildSiteNavLd(),
    buildSpeakableLd(["h1", "[data-speakable]"]),
    homeBreadcrumbLd,
  ];

  return (
    <MainLayout>
      <SEOHead
        title="أكبر وجهة للتقنية والكمبيوتر في وسط القاهرة"
        titleEn="Largest Technology & Computer Destination in Central Cairo"
        description="اكتشف محلات مول البستان، تصفح الفئات التقنية، اعثر على متاجر الكمبيوتر والإلكترونيات، واستخدم خريطة المول للوصول إلى المحل المناسب بسهولة في وسط القاهرة."
        descriptionEn="Discover Mall Elbostan stores, browse tech categories, find computer & electronics shops, and use the interactive mall map to navigate easily in central Cairo."
        keywords="مول البستان, مول تكنولوجيا, محلات كمبيوتر, محلات موبايلات, لابتوب, جيمنج, اكسسوارات, صيانة, الكترونيات, القاهرة, التجمع الخامس, Mall Elbostan, technology mall Cairo"
        ogImageWidth={1200}
        ogImageHeight={630}
        jsonLd={buildCoreGraphLd(phone, extras)}
      />

      <HomeContent faqs={faqs ?? []} />
      <BackToTop />
    </MainLayout>
  );
};

export default Index;
