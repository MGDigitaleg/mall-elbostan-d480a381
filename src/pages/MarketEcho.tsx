import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { MarketEchoSection } from "@/components/home/MarketEchoSection";

const MarketEcho = () => (
  <MainLayout>
    <SEOHead
      title="صدى السوق"
      titleEn="Market Echo"
      description="اسم ظل يتردد في ذاكرة السوق — قصة مول البستان من عبارات الناس إلى تجربة رقمية حديثة."
      descriptionEn="A name that echoed through the market — Mall El Bostan's journey from spoken reputation to a modern digital experience."
    />
    <MarketEchoSection />
  </MainLayout>
);

export default MarketEcho;
