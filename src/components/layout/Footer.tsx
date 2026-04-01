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

const mobileFooterGroups = [
  {
    title: "روابط المول",
    links: footerLinks[0].links,
  },
  {
    title: "الخدمات والقانوني",
    links: [...footerLinks[1].links, ...footerLinks[2].links],
  },
];

export function Footer() {
  return (
    <footer className="mt-10 border-t border-border bg-background md:mt-12">
      <div className="container pt-10 pb-7 md:pt-[72px] md:pb-9">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr] xl:gap-8">
          <div className="space-y-3.5 md:space-y-5">
            <BrandLogo imageClassName="h-auto max-w-[136px]" />
            <p className="max-w-[280px] text-sm leading-6 text-muted-foreground">تجربة تقنية عربية تبدأ بالخريطة ثم تقودك للمتاجر والوحدات بوضوح.</p>
            <div className="md:hidden">
              <Link to="/map"><Button variant="cta" className="h-12 w-full rounded-[16px] px-5">استكشف الخريطة</Button></Link>
            </div>
            <div className="hidden gap-2.5 sm:grid-cols-2 md:hidden xl:grid">
              <Link to="/map"><Button variant="cta" className="h-11 w-full rounded-[18px] px-5">استكشف الخريطة</Button></Link>
              <Link to="/leasing"><Button variant="outline-blue" className="h-11 w-full rounded-[18px] px-5">التأجير</Button></Link>
            </div>
          </div>

          <div className="md:hidden">
            <Accordion type="multiple" className="space-y-1.5">
              {mobileFooterGroups.map((group) => (
                <AccordionItem key={group.title} value={group.title} className="section-shell overflow-hidden rounded-[1rem] px-3.5">
                  <AccordionTrigger className="min-h-[3.45rem] py-2.5 text-right text-sm font-bold text-foreground">
                    {group.title}
                  </AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <ul className="space-y-2">
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

          <div className="hidden min-[768px]:max-[1194px]:grid min-[768px]:max-[1194px]:grid-cols-[1.05fr_0.95fr] min-[768px]:max-[1194px]:gap-4 min-[768px]:max-[1194px]:col-span-full">
            <div className="section-shell rounded-[1.45rem] p-5">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-foreground">تنقل أوضح من نفس المسار</h4>
                <p className="max-w-[28rem] text-sm leading-7 text-muted-foreground">الخريطة، المتاجر، والتأجير تظهر هنا بإيقاع أخف يناسب التابلت دون كثافة زائدة.</p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <Link to="/map"><Button variant="cta" className="h-11 w-full rounded-[18px] px-5">استكشف الخريطة</Button></Link>
                  <Link to="/leasing"><Button variant="outline-blue" className="h-11 w-full rounded-[18px] px-5">التأجير</Button></Link>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {mobileFooterGroups.map((group) => (
                <Accordion key={group.title} type="single" collapsible defaultValue={group.title} className="section-shell overflow-hidden rounded-[1.25rem] px-4">
                  <AccordionItem value={group.title} className="border-none">
                    <AccordionTrigger className="min-h-[3.6rem] py-3 text-right text-sm font-bold text-foreground">
                      {group.title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {group.links.map((link) => (
                          <li key={link.path}>
                            <Link to={link.path} className="text-sm text-muted-foreground transition-colors hover:text-primary">{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
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

        <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4 text-xs text-muted-foreground md:mt-10 md:flex-row md:items-center md:justify-between md:gap-3 md:pt-6">
          <p>مول البستان — وجهة تقنية مصرية راقية تقترب من الافتتاح.</p>
          <p>© {new Date().getFullYear()} مول البستان. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}