import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
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
      <SEOHead title="الأسئلة الشائعة" description="إجابات على أكثر الأسئلة شيوعاً حول مول البستان." />
      <div className="container py-20 max-w-3xl">
        <h1 className="text-4xl font-bold text-gradient-blue mb-8 text-center">الأسئلة الشائعة</h1>
        {categories.length > 0 ? categories.map((cat) => (
          <div key={cat} className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">{cat}</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs?.filter((f) => f.category === cat).map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="card-premium px-6">
                  <AccordionTrigger className="text-foreground font-semibold hover:text-primary">{faq.question_ar}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer_ar}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )) : (
          <Accordion type="single" collapsible className="space-y-2">
            {faqs?.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="card-premium px-6">
                <AccordionTrigger className="text-foreground font-semibold hover:text-primary">{faq.question_ar}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer_ar}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        {(!faqs || faqs.length === 0) && <p className="text-center text-muted-foreground">سيتم إضافة الأسئلة الشائعة قريباً</p>}
      </div>
    </MainLayout>
  );
};

export default FAQ;
