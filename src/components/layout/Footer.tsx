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
    <footer className="border-t border-border/70 bg-secondary/35">
      <div className="container py-14 md:py-16">
        <div className="section-shell mb-10 grid gap-8 px-6 py-8 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <BrandLogo imageClassName="h-16 md:h-20" subtitle="Mall Elbostan" />
            <p className="max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
              مول البستان يقدّم تجربة علامة تجارية تقنية أكثر نضجًا: متاجر متخصصة، خريطة تفاعلية، حملة إطلاق مدروسة، وفرص
              تجارية تمتد لاحقًا إلى Marketplace by Mall Elbostan.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/map" className="soft-card rounded-[1.35rem] p-4 transition-transform duration-300 hover:-translate-y-1">
              <p className="text-sm font-semibold text-foreground">استكشف الخريطة</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">تعرّف على المتاجر والوحدات ومواقعها داخل المشروع.</p>
            </Link>
            <Link to="/leasing" className="soft-card rounded-[1.35rem] p-4 transition-transform duration-300 hover:-translate-y-1">
              <p className="text-sm font-semibold text-foreground">استفسر عن التأجير</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">ابدأ محادثة احترافية حول الوحدات المتاحة وخطط الحضور التجاري.</p>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="soft-card p-6">
            <p className="text-sm font-semibold tracking-[0.16em] text-muted-foreground uppercase">هوية العلامة</p>
            <p className="mt-4 text-sm leading-8 text-foreground/88">
              تجربة تقنية راقية في شرق القاهرة، تربط الزيارة الفعلية بالأنشطة الافتتاحية والنمو الرقمي المستقبلي.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title} className="soft-card p-6">
              <h4 className="mb-4 text-base font-semibold text-foreground">{group.title}</h4>
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

        <div className="mt-10 border-t border-border/70 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} مول البستان. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
