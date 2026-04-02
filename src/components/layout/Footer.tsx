import { Link } from "react-router-dom";
import logoWhite from "@/assets/logo-white.svg";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";

const footerColumns = [
  {
    title: "المول",
    links: [
      { label: "عن المول", path: "/about" },
      { label: "فرع وسط البلد", path: "/downtown-branch" },
      { label: "فرع القاهرة الجديدة", path: "/new-cairo-branch" },
      { label: "المتاجر", path: "/stores" },
      { label: "الخريطة التفاعلية", path: "/map" },
    ],
  },
  {
    title: "السوق",
    links: [
      { label: "المنتجات", path: "/products" },
      { label: "انضم كتاجر", path: "/join-marketplace" },
      { label: "العروض اليومية", path: "/daily-deals" },
      { label: "التأجير", path: "/leasing" },
      { label: "يوم الافتتاح", path: "/opening-day" },
    ],
  },
  {
    title: "المعلومات",
    links: [
      { label: "الأسئلة الشائعة", path: "/faq" },
      { label: "المدونة", path: "/blog" },
      { label: "الوظائف", path: "/careers" },
      { label: "تواصل معنا", path: "/contact" },
      { label: "سياسة الخصوصية", path: "/privacy" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/mallelbostan", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/mallelbostan", label: "Instagram" },
  { icon: Youtube, href: "https://www.youtube.com/@mallelbostan", label: "YouTube" },
];

/* TikTok isn't in Lucide — use a tiny inline SVG */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} width="18" height="18">
      <path d="M16.6 5.82A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/6" style={{ background: "#071326" }}>
      <div className="container pt-16 pb-8 md:pt-20 md:pb-10">
        {/* top grid */}
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8">
          {/* brand column */}
          <div className="space-y-5">
            <img src={logoWhite} alt="مول البستان" className="h-auto max-w-[136px]" />
            <p className="max-w-[260px] text-[0.9rem] leading-7 dark-body">
              وجهة مصر التقنية الأولى — مكانة بناها السوق وثقة أثبتتها السنوات في القاهرة الجديدة.
            </p>

            {/* Social media icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white"
                >
                  <s.icon className="h-[18px] w-[18px]" />
                </a>
              ))}
              <a
                href="https://www.tiktok.com/@mallelbostan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                <TikTokIcon />
              </a>
            </div>

            {/* CTA buttons */}
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
              <h4 className="mb-4 text-[0.82rem] font-bold tracking-[0.08em] uppercase dark-subheading">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-[0.88rem] transition-colors hover:text-white dark-muted"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info row */}
        <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/6 pt-8 text-[0.85rem] dark-muted">
          <a href="tel:+201000000000" className="flex items-center gap-2 transition-colors hover:text-white">
            <Phone className="h-4 w-4 text-primary" />
            <span dir="ltr">+20 100 000 0000</span>
          </a>
          <a href="mailto:info@mallelbostan.com" className="flex items-center gap-2 transition-colors hover:text-white">
            <Mail className="h-4 w-4 text-primary" />
            <span>info@mallelbostan.com</span>
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>القاهرة الجديدة، مصر</span>
          </span>
        </div>

        {/* App download badges */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="text-[0.82rem] font-medium text-white/70">حمّل تطبيق المول قريبا</span>
          <div className="flex gap-3">
            <a
              href="#"
              className="flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-[0.8rem] text-white/80 transition-all hover:border-white/20 hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              App Store
            </a>
            <a
              href="#"
              className="flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-[0.8rem] text-white/80 transition-all hover:border-white/20 hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M3.61 1.814L13.793 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92zm.78-.752l11.56 6.503L13.21 10.3 4.39 1.062zM20.11 10.95l-2.51 1.41-3.03-3.03 3.03-3.03 2.51 1.41c.89.5.89 1.75 0 2.24zM4.39 22.938l8.82-9.238 2.74 2.735L4.39 22.938z" />
              </svg>
              Google Play
            </a>
          </div>
        </div>

        {/* mobile link groups (visible only on small screens) */}
        <div className="mt-8 grid grid-cols-2 gap-8 lg:hidden">
          {footerColumns.slice(0, 2).map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-[0.78rem] font-bold tracking-[0.08em] uppercase dark-subheading">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-[0.85rem] transition-colors hover:text-white dark-muted"
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
          <div className="flex flex-col gap-3 text-[0.78rem] md:flex-row md:items-center md:justify-between dark-meta">
            <p>مول البستان — وجهة تقنية مصرية راسخة. الافتتاح الكبير — مايو 2026.</p>
            <div className="flex items-center gap-4">
              <Link to="/terms" className="transition-colors hover:text-white">الشروط والأحكام</Link>
              <Link to="/privacy" className="transition-colors hover:text-white">سياسة الخصوصية</Link>
              <span>© {new Date().getFullYear()} مول البستان</span>
              <span className="border-r border-white/10 pr-4 mr-0">
                Developed by{" "}
                <a href="https://mg.digital" target="_blank" rel="noopener noreferrer" className="font-medium text-white/80 transition-colors hover:text-white">
                  MG Digital
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
