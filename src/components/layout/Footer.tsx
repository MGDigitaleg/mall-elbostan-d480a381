import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";

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
    <footer className="mt-16 border-t border-border bg-background">
      <div className="container pt-[72px] pb-9">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr]">
          <div className="space-y-5">
            <BrandLogo imageClassName="h-auto max-w-[180px]" />
            <p className="max-w-[320px] text-sm leading-7 text-muted-foreground">مول البستان يقدّم تجربة تقنية عربية أولًا، تجمع الخريطة والمتاجر وفرص التأجير في مسار واضح ومباشر.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/map"><Button variant="cta" className="h-12 rounded-[18px] px-5">استكشف الخريطة</Button></Link>
              <Link to="/leasing"><Button variant="outline-blue" className="h-12 rounded-[18px] px-5">التأجير</Button></Link>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-4">
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

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>مول البستان — وجهة تقنية مصرية راقية، افتتاحها قريب.</p>
          <p>© {new Date().getFullYear()} مول البستان. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}