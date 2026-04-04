import { SEOHead } from "@/components/SEOHead";
import { MarketEchoImmersive } from "@/components/market-echo/MarketEchoImmersive";

const MarketEcho = () => (
  <>
    <SEOHead
      title="صدى السوق"
      titleEn="Market Echo"
      description="اسم ظل يتردد في ذاكرة السوق — قصة مول البستان من عبارات الناس إلى تجربة رقمية حديثة."
      descriptionEn="A name that echoed through the market — Mall El Bostan's journey from spoken reputation to a modern digital experience."
    />
    <MarketEchoImmersive />
  </>
);

export default MarketEcho;
