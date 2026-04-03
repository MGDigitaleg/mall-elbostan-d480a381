import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildEventLd } from "@/components/SEOHead";
import { OpeningHero } from "@/components/opening/OpeningHero";
import { OpeningRoadmap } from "@/components/opening/OpeningRoadmap";
import { OpeningSchedule } from "@/components/opening/OpeningSchedule";
import { OpeningGuests } from "@/components/opening/OpeningGuests";
import { OpeningGaming } from "@/components/opening/OpeningGaming";
import { OpeningSponsors } from "@/components/opening/OpeningSponsors";
import { OpeningFAQ } from "@/components/opening/OpeningFAQ";

const OpeningDay = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["opening-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").order("start_time", { ascending: true });
      return data ?? [];
    },
  });

  const schedule = events?.filter((e) => e.category !== "gaming" && e.category !== "guest") ?? [];
  const gaming = events?.filter((e) => e.category === "gaming") ?? [];
  const guests = events?.filter((e) => e.category === "guest") ?? [];

  return (
    <MainLayout>
      <SEOHead
        title="يوم الافتتاح"
        titleEn="Opening Day"
        description="تابع تفاصيل يوم افتتاح مول البستان من الفعاليات للجوائز وخطة الزيارة."
        descriptionEn="Follow Mall Elbostan opening day details, from events to rewards and visit planning."
        breadcrumbs={[{ name: "يوم الافتتاح", url: "/opening-day" }]}
        jsonLd={events && events.length > 0 ? buildEventLd(events) : undefined}
      />

      <OpeningHero />
      <OpeningRoadmap />
      <OpeningSchedule events={schedule} isLoading={isLoading} />
      <OpeningGaming competitions={gaming} />
      <OpeningGuests guests={guests} />
      <OpeningFAQ />
      <OpeningSponsors />
    </MainLayout>
  );
};

export default OpeningDay;
