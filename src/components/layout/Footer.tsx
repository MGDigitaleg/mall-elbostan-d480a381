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
    <footer className="mt-18 border-t border-border/60 bg-secondary/25">
      <div className="container py-14 md:py-18">
        <div className="brand-shell overflow-hidden rounded-[2.8rem] px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="space-y-6">
              <BrandLogo framed imageClassName="h-[5.4rem] md:h-[6.3rem]" subtitle="Premium Technology Mall" />
              <div className="chapter-shell pt-5">
                <h3 className="max-w-3xl text-3xl font-bold leading-tight text-foreground md:text-[2.85rem]">
                  مول البستان بيتقدّم كعلامة تقنية مصرية راقية، حضورها واضح من أول زيارة وآخر لقطة في الموقع.
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  هنا هتلاقي صورة المشروع كاملة بشكل أهدى وأقوى: متاجر، خريطة، افتتاح، فرص تجارية، وخطوة جاية لسوق رقمي يكمل نفس
                  الهوية من غير ما يفقدها.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link to="/map" className="editorial-panel rounded-[1.7rem] p-5 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-sm font-semibold text-muted-foreground">استكشف المشروع</p>
                <p className="mt-2 text-xl font-bold text-foreground">الخريطة والمتاجر</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">شوف توزيع المتاجر والوحدات بشكل أوضح قبل الزيارة أو قرار الاستفسار.</p>
              </Link>
              <Link to="/spin-win" className="editorial-panel rounded-[1.7rem] p-5 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-sm font-semibold text-muted-foreground">شارك بدري</p>
                <p className="mt-2 text-xl font-bold text-foreground">أدر واربح</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">ادخل حملة الجوائز واحتفظ بالنتيجة علشان تكون جاهز ليوم الافتتاح.</p>
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.8fr_0.8fr_0.9fr]">
            <div className="section-shell p-6 md:p-7">
              <p className="text-sm font-semibold tracking-[0.16em] text-muted-foreground uppercase">ملخص العلامة</p>
              <p className="mt-4 text-sm leading-8 text-foreground/88">
                مول تقني بنَفَس مصري واضح، بيكلّم الناس بلغة طبيعية ومحترمة، وبيقدّم تجربة تجارية شكلها متزن وقيمتها باينة.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link to="/leasing" className="mini-chip justify-center">استفسر عن الوحدات</Link>
                <Link to="/#marketplace" className="mini-chip justify-center">تابع السوق القادم</Link>
              </div>
            </div>

            {footerLinks.map((group) => (
              <div key={group.title} className="section-shell p-6 md:p-7">
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
          <p>مول البستان — علامة تقنية مصرية بتستعد لافتتاح يبان من أول لحظة.</p>
          <p>© {new Date().getFullYear()} مول البستان. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}