import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const footerLinks = [
  {
    title: "روابط المول",
    links: [
      { label: "عن المول", path: "/about" },
      { label: "فرع القاهرة الجديدة", path: "/new-cairo-branch" },
      { label: "المتاجر", path: "/stores" },
      { label: "الخريطة", path: "/map" },
      { label: "يوم الافتتاح", path: "/opening-day" },
    ],
  },
  {
    title: "الخدمات",
    links: [
      { label: "التأجير", path: "/leasing" },
      { label: "أدر واربح", path: "/spin-win" },
      { label: "العروض اليومية", path: "/daily-deals" },
      { label: "الوظائف", path: "/careers" },
      { label: "تواصل معنا", path: "/contact" },
    ],
  },
  {
    title: "القانوني والتواصل",
    links: [
      { label: "الأسئلة الشائعة", path: "/faq" },
      { label: "سياسة الخصوصية", path: "/privacy" },
      { label: "الشروط والأحكام", path: "/terms" },
      { label: "شروط المكافآت", path: "/reward-terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-background">
      <div className="container pt-12 pb-8 md:pt-[72px] md:pb-9">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr] xl:gap-8">
          <div className="space-y-4 md:space-y-5">
            <BrandLogo imageClassName="h-auto max-w-[140px]" />
            <p className="max-w-[320px] text-sm leading-7 text-muted-foreground">مول البستان يقدم تجربة تقنية عربية أولًا، تربط الزيارة بالخريطة والمتاجر والتأجير في مسار واضح.</p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <Link to="/map"><Button variant="cta" className="h-11 w-full rounded-[18px] px-5">استكشف الخريطة</Button></Link>
              <Link to="/leasing"><Button variant="outline-blue" className="h-11 w-full rounded-[18px] px-5">التأجير</Button></Link>
            </div>
          </div>

          <div className="xl:hidden">
            <Accordion type="multiple" className="space-y-2">
              {footerLinks.map((group) => (
                <AccordionItem key={group.title} value={group.title} className="section-shell overflow-hidden rounded-[1.1rem] px-4">
                  <AccordionTrigger className="min-h-[3.75rem] py-3 text-right text-sm font-bold text-foreground">
                    {group.title}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <ul className="space-y-2.5">
                      {group.links.map((link) => (
                        <li key={link.path}>
                          <Link to={link.path} className="text-sm text-muted-foreground transition-colors hover:text-primary">{link.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title} className="hidden space-y-4 xl:block">
              <h4 className="text-lg font-bold text-foreground">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm text-muted-foreground transition-colors hover:text-primary">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 text-xs text-muted-foreground md:mt-10 md:flex-row md:items-center md:justify-between md:pt-6">
          <p>مول البستان — وجهة تقنية مصرية راقية تقترب من الافتتاح.</p>
          <p>© {new Date().getFullYear()} مول البستان. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}