import { Link } from "react-router-dom";
import logoWhite from "@/assets/logo-white.png";
import { Button } from "@/components/ui/button";

const footerColumns = [
  {
    title: "المول",
    links: [
      { label: "عن المول", path: "/about" },
      { label: "فرع القاهرة الجديدة", path: "/new-cairo-branch" },
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
    title: "المعلومات",
    links: [
      { label: "الأسئلة الشائعة", path: "/faq" },
      { label: "المدونة", path: "/blog" },
      { label: "سياسة الخصوصية", path: "/privacy" },
      { label: "الشروط والأحكام", path: "/terms" },
      { label: "شروط المكافآت", path: "/reward-terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/6 bg-[hsl(222_44%_7%)] text-white">
      <div className="container pt-16 pb-8 md:pt-20 md:pb-10">
        {/* top grid */}
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8">
          {/* brand column */}
          <div className="space-y-5">
            <img src={logoWhite} alt="مول البستان" className="h-auto max-w-[136px]" />
            <p className="max-w-[260px] text-[0.9rem] leading-7 dark-body">
              وجهة مصر التقنية الأولى — مكانة بناها السوق وثقة أثبتتها السنوات في القاهرة الجديدة.
            </p>
            <div className="flex gap-2.5">
              <Link to="/map">
                <Button variant="cta" className="h-10 rounded-lg px-5 text-[0.85rem]">
                  استكشف الخريطة
                </Button>
              </Link>
              <Link to="/leasing">
                <Button className="h-10 rounded-lg border border-white/15 bg-white/8 px-5 text-[0.85rem] text-white hover:bg-white/14">
                  التأجير
                </Button>
              </Link>
            </div>
          </div>

          {/* link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[0.82rem] font-bold tracking-[0.08em] uppercase" style={{ color: "hsl(220 15% 72%)" }}>
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-[0.88rem] transition-colors hover:text-white"
                      style={{ color: "hsl(220 12% 58%)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* mobile link groups (visible only on small screens) */}
        <div className="mt-8 grid grid-cols-2 gap-8 lg:hidden">
          {footerColumns.slice(0, 2).map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-[0.78rem] font-bold tracking-[0.08em] uppercase" style={{ color: "hsl(220 15% 68%)" }}>
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-[0.85rem] transition-colors hover:text-white"
                      style={{ color: "hsl(220 12% 58%)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* divider & bottom */}
        <div className="mt-12 border-t border-white/8 pt-6">
          <div className="flex flex-col gap-3 text-[0.78rem] md:flex-row md:items-center md:justify-between" style={{ color: "hsl(220 12% 50%)" }}>
            <p>مول البستان — وجهة تقنية مصرية راسخة. الافتتاح الكبير — مايو 2026.</p>
            <p>© {new Date().getFullYear()} مول البستان. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
