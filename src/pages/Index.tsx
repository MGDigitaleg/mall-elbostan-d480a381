import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, organizationLd, buildFaqLd } from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HomeContent } from "@/components/home/HomeContent";

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
        description="مول البستان - وجهة التكنولوجيا الأولى في القاهرة الجديدة. أكثر من 150 متجراً للتكنولوجيا والإلكترونيات. افتتاح 1 مايو 2026."
        descriptionEn="Mall Elbostan - Egypt's premier technology mall in New Cairo. 150+ stores. Grand opening May 1, 2026."
        jsonLd={[organizationLd, ...(faqs && faqs.length > 0 ? [buildFaqLd(faqs)] : [])]}
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
        <HomeContent faqs={faqs ?? []} featuredStores={featuredStores ?? []} upcomingEvents={upcomingEvents ?? []} />
      </motion.div>
    </MainLayout>
  );
};

export default Index;
