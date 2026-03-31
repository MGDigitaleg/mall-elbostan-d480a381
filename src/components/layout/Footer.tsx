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
    ],
  },
  {
    title: "الفرص والخدمات",
    links: [
      { label: "التأجير", path: "/leasing" },
      { label: "أدر واربح", path: "/spin-win" },
      { label: "العروض اليومية", path: "/daily-deals" },
      { label: "الوظائف", path: "/careers" },
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
    <footer className="mt-16 border-t border-border/60 bg-secondary/20">
      <div className="container py-12 md:py-14">
        <div className="brand-shell overflow-hidden rounded-[2.45rem] px-5 py-6 md:px-7 md:py-8 lg:px-8 lg:py-8">
          <div className="grid gap-6 border-b border-border/70 pb-7 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="space-y-4">
              <BrandLogo framed imageClassName="h-[5.4rem] md:h-[6rem]" />
              <div className="chapter-shell pt-5">
                <h3 className="max-w-2xl text-3xl font-bold leading-tight text-foreground md:text-[2.45rem]">
                  مول البستان وجهة تقنية راقية بتجربة أوضح وحضور أقوى.
                </h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                  من المتاجر والخريطة إلى الافتتاح وفرص التأجير، كل خطوة هنا واضحة ومباشرة.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link to="/map" className="editorial-panel rounded-[1.6rem] p-5 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-sm font-semibold text-muted-foreground">ابدأ بالاستكشاف</p>
                <p className="mt-2 text-xl font-bold text-foreground">الخريطة والمتاجر</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">شاهد المتاجر والوحدات بخطوة واحدة.</p>
              </Link>
              <Link to="/leasing" className="editorial-panel rounded-[1.6rem] p-5 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-sm font-semibold text-muted-foreground">خطوة تجارية مباشرة</p>
                <p className="mt-2 text-xl font-bold text-foreground">استفسر عن الوحدات</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">ابدأ الاستفسار التجاري من صفحة التأجير.</p>
              </Link>
            </div>
          </div>

          <div className="mt-7 grid gap-4 xl:grid-cols-[1fr_0.82fr_0.82fr_0.9fr]">
            <div className="section-shell p-5 md:p-6">
              <p className="text-sm font-semibold tracking-[0.16em] text-muted-foreground uppercase">نبذة العلامة</p>
              <p className="mt-4 text-sm leading-7 text-foreground/88">
                مول البستان يقدّم التقنية بصورة أوضح وأهدأ.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link to="/spin-win" className="mini-chip justify-center">شارك في الجوائز</Link>
                <Link to="/#marketplace" className="mini-chip justify-center">تابع السوق القادم</Link>
              </div>
            </div>

            {footerLinks.map((group) => (
              <div key={group.title} className="section-shell p-5 md:p-6">
                <h4 className="mb-4 text-lg font-bold text-foreground">{group.title}</h4>
                <ul className="space-y-3.5">
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
          <p>مول البستان — وجهة تقنية مصرية راقية، افتتاحها قريب.</p>
          <p>© {new Date().getFullYear()} مول البستان. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}