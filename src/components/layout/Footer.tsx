import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";

const footerLinks = [
  {
    title: "المول",
    links: [
      { label: "عن المول", path: "/about" },
      { label: "فرع القاهرة الجديدة", path: "/new-cairo-branch" },
      { label: "المتاجر", path: "/stores" },
      { label: "الخريطة", path: "/map" },
      { label: "يوم الافتتاح", path: "/opening-day" },
      { label: "السوق قريباً", path: "/#marketplace" },
    ],
  },
  {
    title: "خدمات",
    links: [
      { label: "التأجير", path: "/leasing" },
      { label: "العروض اليومية", path: "/daily-deals" },
      { label: "الوظائف", path: "/careers" },
      { label: "المدونة", path: "/blog" },
      { label: "تواصل معنا", path: "/contact" },
    ],
  },
  {
    title: "قانوني",
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
    <footer className="mt-16 border-t border-border/60 bg-secondary/30">
      <div className="container py-14 md:py-16">
        <div className="brand-shell overflow-hidden rounded-[2.6rem] px-6 py-8 md:px-8 md:py-10">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-5">
              <BrandLogo imageClassName="h-[5rem] md:h-[6rem]" subtitle="Mall Elbostan" />
              <div className="chapter-shell pt-5">
                <h3 className="text-3xl font-bold text-foreground md:text-4xl">مول تقني مصري بطموح أكبر من مجرد وجهة تسوق</h3>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  مول البستان بيتجه يبقى عنوان واضح للتقنية في شرق القاهرة، يجمع المتاجر، الخريطة، حملة الافتتاح، وفرص النمو التجاري
                  في تجربة واحدة شكلها راقٍ وكلامها مباشر ومقنع.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link to="/map" className="soft-card rounded-[1.5rem] p-5 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-sm font-semibold text-foreground">استكشف الخريطة</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">شوف مواقع المتاجر والوحدات بشكل أوضح داخل المشروع.</p>
              </Link>
              <Link to="/leasing" className="soft-card rounded-[1.5rem] p-5 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-sm font-semibold text-foreground">ابدأ استفسار التأجير</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">خد خطوة مباشرة لو بتدور على حضور قوي جوه وجهة تقنية متخصصة.</p>
              </Link>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-[1.05fr_0.7fr_0.7fr_0.85fr]">
            <div className="section-shell p-6">
              <p className="text-sm font-semibold tracking-[0.16em] text-muted-foreground uppercase">ملخص العلامة</p>
              <p className="mt-4 text-sm leading-8 text-foreground/88">
                تجربة أقرب للواقع، لغة أهدى، وصورة أوضح لمول بيحضّر لإطلاق قوي ولسوق إلكتروني جاي كمرحلة طبيعية بعد كده.
              </p>
            </div>

            {footerLinks.map((group) => (
              <div key={group.title} className="section-shell p-6">
                <h4 className="mb-4 text-lg font-bold text-foreground">{group.title}</h4>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>مول البستان — تجربة تقنية مصرية راقية بتستعد للافتتاح.</p>
          <p>© {new Date().getFullYear()} مول البستان. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
