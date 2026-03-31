import { useQuery } from "@tanstack/react-query";
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
      <SEOHead title="الأسئلة الشائعة" titleEn="FAQ" description="إجابات على أكثر الأسئلة شيوعاً حول مول البستان." descriptionEn="Frequently asked questions about Mall Elbostan." breadcrumbs={[{ name: "الأسئلة الشائعة", url: "/faq" }]} jsonLd={faqs && faqs.length > 0 ? buildFaqLd(faqs) : undefined} />
      <div className="container max-w-5xl py-8 md:py-12">
        <div className="brand-shell mb-10 rounded-[2.2rem] px-6 py-8 text-center md:px-8 md:py-10">
          <p className="section-kicker">FAQ</p>
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">الأسئلة الشائعة</h1>
          <p className="mx-auto max-w-2xl leading-8 text-muted-foreground">إجابات سريعة وواضحة عن المول، الافتتاح، المتاجر، والصفحات المهمة، بشكل أبسط وأقرب لطريقة الكلام اللي تناسب علامة مصرية premium.</p>
        </div>
        {categories.length > 0 ? categories.map((cat) => (
          <div key={cat} className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-foreground">{cat}</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs?.filter((f) => f.category === cat).map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="section-shell px-6">
                  <AccordionTrigger className="text-foreground font-semibold hover:text-primary">{faq.question_ar}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer_ar}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )) : (
          <Accordion type="single" collapsible className="space-y-2">
            {faqs?.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="section-shell px-6">
                <AccordionTrigger className="text-foreground font-semibold hover:text-primary">{faq.question_ar}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer_ar}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        {(!faqs || faqs.length === 0) && <div className="section-shell p-8 text-center text-muted-foreground">الأسئلة دي هتتحدث قريب مع إضافة محتوى أكتر</div>}
      </div>
    </MainLayout>
  );
};

export default FAQ;
