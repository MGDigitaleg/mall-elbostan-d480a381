import { useQuery } from "@tanstack/react-query";
import { HelpCircle, MapPin, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildFaqLd } from "@/components/SEOHead";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const { data: faqs } = useQuery({
    queryKey: ["all-faqs"],
    queryFn: async () => {
      const { data } = await supabase.from("faqs").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const categories = [...new Set(faqs?.map((f) => f.category).filter(Boolean) ?? [])];

  return (
    <MainLayout>
      <SEOHead title="الأسئلة الشائعة" titleEn="FAQ" description="إجابات مختصرة على أكثر الأسئلة تكراراً حول مول البستان والزيارة والتأجير." descriptionEn="Frequently asked questions about Mall Elbostan." breadcrumbs={[{ name: "الأسئلة الشائعة", url: "/faq" }]} jsonLd={faqs && faqs.length > 0 ? buildFaqLd(faqs) : undefined} />
      <div className="container max-w-5xl py-8 md:py-12">
        <div className="brand-shell page-halo mb-8 rounded-[2.15rem] px-5 py-5 md:px-7 md:py-6">
          <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <p className="section-kicker">الأسئلة الشائعة</p>
              <h1 className="mb-3 text-2xl font-bold text-foreground md:text-[2.2rem]">أسئلة الزوار والتجار</h1>
              <p className="max-w-2xl leading-7 text-muted-foreground">إجابات مباشرة على ما يسأل عنه الزائر والتاجر حول المول والوحدات والزيارة.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: HelpCircle, title: "إجابات مباشرة" },
                { icon: Store, title: "المحلات والتأجير" },
                { icon: MapPin, title: "الزيارة والموقع" },
              ].map((item) => (
                <div key={item.title} className="editorial-panel rounded-[1.25rem] p-4">
                  <item.icon className="icon-shell mb-2.5 h-10 w-10 p-2.5" />
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {categories.length > 0 ? categories.map((cat) => (
          <div key={cat} className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-foreground">{cat}</h2>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs?.filter((f) => f.category === cat).map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="section-shell rounded-[1.5rem] px-6">
                  <AccordionTrigger className="font-semibold text-foreground hover:text-primary">{faq.question_ar}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer_ar}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )) : (
            <Accordion type="single" collapsible defaultValue={faqs?.[0]?.id} className="space-y-3">
            {faqs?.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="section-shell rounded-[1.5rem] px-6">
                <AccordionTrigger className="font-semibold text-foreground hover:text-primary">{faq.question_ar}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer_ar}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {(!faqs || faqs.length === 0) && <div className="section-shell p-8 text-center text-muted-foreground">الأسئلة الشائعة قيد التحديث — ستُضاف قريباً.</div>}
      </div>
    </MainLayout>
  );
};

export default FAQ;