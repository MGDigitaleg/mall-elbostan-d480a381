import { Link } from "react-router-dom";
import logoWhite from "@/assets/logo-white.png";
import { Button } from "@/components/ui/button";

const footerLinks = [
  {
    title: "المول",
    links: [
      { label: "عن المول", path: "/about" },
      { label: "المتاجر", path: "/stores" },
      { label: "الخريطة التفاعلية", path: "/map" },
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
    title: "القانوني",
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
    <footer className="heritage-section mt-0 border-t border-white/10">
      <div className="container pt-14 pb-8 md:pt-20 md:pb-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          {/* Brand column */}
          <div className="space-y-5">
            <img src={logoWhite} alt="مول البستان" className="h-auto max-w-[140px]" />
            <p className="max-w-[260px] text-sm leading-7 text-white/45">
              وجهة مصر التقنية الأولى — تاريخ من الثقة وتجربة تسوّق منظّمة.
            </p>
            <div className="flex gap-2.5">
              <Link to="/map"><Button variant="cta" className="h-10 rounded-lg px-5 text-[0.85rem]">الخريطة</Button></Link>
              <Link to="/leasing"><Button className="h-10 rounded-lg border border-white/20 bg-white/10 px-5 text-[0.85rem] text-white hover:bg-white/15">التأجير</Button></Link>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-4">
              <h4 className="text-sm font-bold text-white">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm text-white/40 transition-colors hover:text-white/70">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/30 md:flex-row md:items-center md:justify-between">
          <p>مول البستان — وجهة تقنية مصرية راسخة.</p>
          <p>© {new Date().getFullYear()} مول البستان. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
