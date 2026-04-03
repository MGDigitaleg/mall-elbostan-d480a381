import { Link } from "react-router-dom";
import logoWhite from "@/assets/logo-white.svg";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Compass, ArrowUp } from "lucide-react";

const footerColumns = [
  {
    title: "المول",
    links: [
      { label: "عن المول", path: "/about" },
      { label: "فرع وسط البلد", path: "/downtown-branch" },
      { label: "دليل وسط البلد", path: "/downtown-directory" },
      { label: "فرع القاهرة الجديدة", path: "/new-cairo-branch" },
      { label: "المحلات", path: "/stores" },
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

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} width="18" height="18">
      <path d="M16.6 5.82A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
    </svg>
  );
}

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-white/[0.04]" style={{ background: "#071326" }}>
      {/* Subtle top accent line */}
      <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, #2563EB40, #CDBB9A30, transparent)" }} />

      <div className="container pt-14 pb-7 md:pt-16 md:pb-8">
        {/* ── TOP: Brand + Navigation ── */}
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-6">
          {/* Brand column */}
          <div className="space-y-4">
            <img src={logoWhite} alt="مول البستان" className="h-auto max-w-[130px]" />
            <p className="max-w-[240px] text-[0.82rem] leading-[1.75]" style={{ color: "#7C8BA1" }}>
              وجهة مصر التقنية الأولى — مكانة بناها السوق وثقة أثبتتها السنوات.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                  style={{ background: "#ffffff08", border: "1px solid #ffffff0D" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ffffff14";
                    e.currentTarget.style.borderColor = "#ffffff20";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#ffffff08";
                    e.currentTarget.style.borderColor = "#ffffff0D";
                  }}
                >
                  <s.icon className="h-4 w-4" style={{ color: "#94A3B8" }} />
                </a>
              ))}
              <a
                href="https://www.tiktok.com/@mallelbostan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                style={{ background: "#ffffff08", border: "1px solid #ffffff0D", color: "#94A3B8" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ffffff14";
                  e.currentTarget.style.borderColor = "#ffffff20";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ffffff08";
                  e.currentTarget.style.borderColor = "#ffffff0D";
                }}
              >
                <TikTokIcon />
              </a>
            </div>

            {/* CTA */}
            <div className="flex gap-2 pt-1">
              <Link to="/map">
                <Button variant="cta" className="h-9 rounded-lg px-4 text-[0.78rem] font-bold">
                  <Compass className="ml-1 h-3.5 w-3.5" /> استكشف الخريطة
                </Button>
              </Link>
              <Link to="/leasing">
                <Button className="h-9 rounded-lg border px-4 text-[0.78rem] font-bold" style={{ borderColor: "#ffffff12", background: "#ffffff06", color: "#CBD5E1" }}>
                  التأجير
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3.5 text-[0.72rem] font-bold tracking-[0.1em] uppercase" style={{ color: "#CDBB9A" }}>
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-[0.8rem] transition-colors hover:text-white"
                      style={{ color: "#7C8BA1" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── MIDDLE: Contact strip ── */}
        <div className="mt-8 rounded-lg px-4 py-3.5 flex flex-wrap items-center gap-5 md:gap-8" style={{ background: "#ffffff05", border: "1px solid #ffffff08" }}>
          <span className="text-[0.7rem] font-bold tracking-[0.08em] uppercase" style={{ color: "#CDBB9A" }}>تواصل</span>
          <a href="mailto:info@mallelbostan.com" className="flex items-center gap-2 text-[0.78rem] transition-colors hover:text-white" style={{ color: "#94A3B8" }}>
            <Mail className="h-3.5 w-3.5 text-primary" />
            <span>info@mallelbostan.com</span>
          </a>
          <span className="flex items-center gap-2 text-[0.78rem]" style={{ color: "#94A3B8" }}>
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>التجمع الخامس، القاهرة الجديدة</span>
          </span>
        </div>

        {/* ── APP BADGES ── */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="text-[0.74rem] font-medium" style={{ color: "#64748B" }}>تطبيق المول قريبا</span>
          <div className="flex gap-2">
            {[
              {
                label: "App Store",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                ),
              },
              {
                label: "Google Play",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M3.61 1.814L13.793 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92zm.78-.752l11.56 6.503L13.21 10.3 4.39 1.062zM20.11 10.95l-2.51 1.41-3.03-3.03 3.03-3.03 2.51 1.41c.89.5.89 1.75 0 2.24zM4.39 22.938l8.82-9.238 2.74 2.735L4.39 22.938z" />
                  </svg>
                ),
              },
            ].map((store) => (
              <a
                key={store.label}
                href="#"
                className="flex h-9 items-center gap-2 rounded-lg px-3.5 text-[0.72rem] transition-all"
                style={{ background: "#ffffff06", border: "1px solid #ffffff0A", color: "#7C8BA1" }}
              >
                {store.icon}
                {store.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="mt-8 border-t pt-5" style={{ borderColor: "#ffffff08" }}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.7rem]" style={{ color: "#4B5563" }}>
              <p>مول البستان — وجهة تقنية مصرية راسخة</p>
              <span className="hidden md:inline">·</span>
              <span>© {new Date().getFullYear()} مول البستان</span>
            </div>
            <div className="flex items-center gap-4 text-[0.7rem]" style={{ color: "#4B5563" }}>
              <Link to="/terms" className="transition-colors hover:text-white/70">الشروط والأحكام</Link>
              <Link to="/privacy" className="transition-colors hover:text-white/70">الخصوصية</Link>
              <span>
                Developed by{" "}
                <a href="https://mg.digital" target="_blank" rel="noopener noreferrer" className="font-medium transition-colors hover:text-white/70" style={{ color: "#64748B" }}>
                  MG Digital
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="absolute left-5 bottom-7 flex h-8 w-8 items-center justify-center rounded-lg transition-all"
        style={{ background: "#ffffff08", border: "1px solid #ffffff0D" }}
        aria-label="العودة للأعلى"
      >
        <ArrowUp className="h-3.5 w-3.5" style={{ color: "#64748B" }} />
      </button>
    </footer>
  );
}
