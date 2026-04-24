import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Compass, ArrowUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { OFFICIAL_WHATSAPP } from "@/lib/contactInfo";
import { useSitePhone } from "@/hooks/useSitePhone";

const footerColumns = [
  {
    title: "المول",
    links: [
      { label: "عن البستان", path: "/about" },
      { label: "فرع وسط البلد", path: "/downtown-branch" },
      { label: "دليل وسط البلد", path: "/downtown-directory" },
      { label: "فرع القاهرة الجديدة", path: "/new-cairo-branch" },
      { label: "دليل المحلات", path: "/stores" },
      { label: "الخريطة التفاعلية", path: "/map" },
      { label: "صدى السوق", path: "/market-echo" },
    ],
  },
  {
    title: "السوق والخدمات",
    links: [
      { label: "منتجات المحلات", path: "/products" },
      { label: "انضم كتاجر", path: "/join-marketplace" },
      { label: "العروض اليومية", path: "/daily-deals" },
      { label: "الوحدات المتاحة", path: "/leasing" },
      { label: "يوم الافتتاح", path: "/opening-day" },
    ],
  },
  {
    title: "تواصل ومعلومات",
    links: [
      { label: "الأسئلة الشائعة", path: "/faq" },
      { label: "المدونة", path: "/blog" },
      { label: "فرص العمل", path: "/careers" },
      { label: "تواصل معنا", path: "/contact" },
      { label: "الخصوصية", path: "/privacy" },
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
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} width="15" height="15">
      <path d="M16.6 5.82A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
    </svg>
  );
}

function SocialIcon({ children, href, label }: { children: React.ReactNode; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 hover:scale-110"
      style={{ background: "#ffffff06", border: "1px solid #ffffff0D" }}
    >
      {children}
    </a>
  );
}

function NavColumn({ col, openMobile, onToggle }: { col: typeof footerColumns[0]; openMobile: boolean; onToggle: () => void }) {
  const linkCount = col.links.length;
  // Reserve exact height: heading ~32px + links * 28px line-height + gaps
  const desktopHeight = 32 + linkCount * 28 + (linkCount - 1) * 10;

  return (
    <div style={{ minHeight: undefined }} className="lg:min-h-0" data-footer-col>
      {/* Mobile: accordion trigger */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={openMobile}
        className="flex w-full items-center justify-between lg:hidden"
        style={{ height: 40 }}
      >
        <div className="flex items-center gap-2">
          <div className="h-px w-4 rounded-full" style={{ background: "#CDBB9A" }} />
          <span className="text-[0.66rem] font-bold tracking-[0.16em] uppercase" style={{ color: "#CDBB9A" }}>
            {col.title}
          </span>
        </div>
        <ChevronDown
          className="h-4 w-4 transition-transform duration-200"
          style={{ color: "#CDBB9A", transform: openMobile ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Desktop: static heading */}
      <div className="mb-4 hidden items-center gap-2 lg:flex" style={{ height: 20 }}>
        <div className="h-px w-4 rounded-full" style={{ background: "#CDBB9A" }} />
        <span className="text-[0.66rem] font-bold tracking-[0.16em] uppercase" role="heading" aria-level={2} style={{ color: "#CDBB9A" }}>
          {col.title}
        </span>
      </div>

      <ul
        className={`space-y-2.5 overflow-hidden transition-all duration-200 lg:block pt-2 lg:pt-0 ${openMobile ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"}`}
        style={{ contain: "layout style" }}
      >
        {col.links.map((link) => (
          <li key={link.path} style={{ height: 20 }}>
            <Link
              to={link.path}
              className="text-[0.8rem] leading-[20px] transition-colors duration-200 hover:text-white inline-block"
              style={{ color: "#7C8BA1" }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { phone: officialPhone } = useSitePhone();

  return (
    <footer className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #060E1C 0%, #071326 40%, #0A0F1A 100%)", overflowAnchor: "none", contain: "layout style paint", minHeight: 460 } as React.CSSProperties}>
      {/* Decorative top border */}
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent 5%, #CDBB9A40 30%, #2563EB50 50%, #CDBB9A40 70%, transparent 95%)" }} />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(ellipse, #2563EB, transparent 70%)" }} />
        <div className="absolute bottom-0 right-[15%] h-[250px] w-[250px] rounded-full opacity-[0.02]" style={{ background: "radial-gradient(circle, #CDBB9A, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

      <div className="container relative pt-10 pb-5 md:pt-16 md:pb-8 lg:pt-20">
        {/* ── TOP: Brand + Navigation ── */}
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8 lg:gap-y-10 xl:gap-12">
          {/* Brand column */}
          <div className="space-y-3 lg:space-y-5 flex flex-col items-center text-center lg:items-start lg:text-right">
            <Link to="/" className="brand-logo-glow inline-flex items-center" style={{ height: 64 }}>
              <BrandLogo align="start" imageClassName="h-[clamp(48px,10vw,64px)] max-h-[64px] w-auto" variant="light" priority={false} />
            </Link>

            <p className="max-w-[260px] text-[0.82rem] leading-[1.7] font-light" style={{ color: "#8896AB" }}>
              سوق التقنية الأول في مصر — ثقة بناها السوق منذ ١٩٩٠.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-1 justify-center lg:justify-start">
              {socialLinks.map((s) => (
                <SocialIcon key={s.label} href={s.href} label={s.label}>
                  <s.icon className="h-[15px] w-[15px] transition-colors group-hover:text-white" style={{ color: "#7C8BA1" }} />
                </SocialIcon>
              ))}
              <SocialIcon href="https://www.tiktok.com/@mallelbostan" label="TikTok">
                <span className="transition-colors group-hover:text-white" style={{ color: "#7C8BA1" }}>
                  <TikTokIcon />
                </span>
              </SocialIcon>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-2 pt-1 lg:pt-2 justify-center lg:justify-start">
              <Link to="/map">
                <Button variant="cta" className="h-9 lg:h-10 rounded-xl px-4 lg:px-5 text-[0.78rem] font-bold shadow-lg shadow-primary/20">
                  <Compass className="ml-1.5 h-3.5 w-3.5" /> استكشف الخريطة
                </Button>
              </Link>
              <Link to="/leasing">
                <Button
                  className="h-9 lg:h-10 rounded-xl px-4 lg:px-5 text-[0.78rem] font-bold transition-all duration-300 hover:bg-white/[0.08]"
                  style={{ background: "#ffffff06", color: "#CBD5E1", border: "1px solid #ffffff12" }}
                >
                  التأجير والشراء
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation columns (accordion on mobile) */}
          <div className="lg:contents space-y-1 lg:space-y-0 border-t border-b lg:border-0 py-2 lg:py-0" style={{ borderColor: "#ffffff08" }}>
            {footerColumns.map((col, idx) => (
              <NavColumn
                key={col.title}
                col={col}
                openMobile={openIdx === idx}
                onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
              />
            ))}
          </div>
        </div>

        {/* ── CONTACT STRIP ── */}
        <div
          className="mt-6 lg:mt-10 rounded-2xl px-4 py-3 lg:px-5 lg:py-4 grid gap-2.5 lg:gap-4 sm:grid-cols-3 md:flex md:flex-wrap md:items-center md:gap-8"
          style={{ background: "#ffffff04", border: "1px solid #ffffff0A", backdropFilter: "blur(8px)" }}
        >
          <span className="text-[0.66rem] font-bold tracking-[0.14em] uppercase sm:col-span-3 md:col-auto" style={{ color: "#CDBB9A" }}>
            تواصل معنا
          </span>

          <a href="mailto:info@mallelbostan.com" className="flex items-center gap-2.5 text-[0.8rem] transition-colors hover:text-white" style={{ color: "#8896AB" }}>
            <span className="flex h-7 w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "#2563EB15", border: "1px solid #2563EB28" }}>
              <Mail className="h-3.5 w-3.5" style={{ color: "#60A5FA" }} />
            </span>
            <span className="font-poppins text-[0.78rem]">info@mallelbostan.com</span>
          </a>

          {officialPhone ? (
            <a href={`tel:${officialPhone}`} className="flex items-center gap-2.5 text-[0.8rem] transition-colors hover:text-white" style={{ color: "#8896AB" }}>
              <span className="flex h-7 w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "#10B98115", border: "1px solid #10B98128" }}>
                <Phone className="h-3.5 w-3.5" style={{ color: "#34D399" }} />
              </span>
              <span className="font-poppins text-[0.78rem]" dir="ltr">{officialPhone}</span>
            </a>
          ) : (
            <a href={`https://wa.me/${OFFICIAL_WHATSAPP}`} target="_blank" rel="noopener" className="flex items-center gap-2.5 text-[0.8rem] transition-colors hover:text-white" style={{ color: "#8896AB" }}>
              <span className="flex h-7 w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "#10B98115", border: "1px solid #10B98128" }}>
                <Phone className="h-3.5 w-3.5" style={{ color: "#34D399" }} />
              </span>
              <span className="font-poppins text-[0.78rem]">واتساب الإدارة</span>
            </a>
          )}

          <span className="flex items-center gap-2.5 text-[0.8rem]" style={{ color: "#8896AB" }}>
            <span className="flex h-7 w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "#06B6D415", border: "1px solid #06B6D428" }}>
              <MapPin className="h-3.5 w-3.5" style={{ color: "#22D3EE" }} />
            </span>
            التجمع الخامس، القاهرة الجديدة
          </span>

          <span className="flex items-center gap-2.5 text-[0.8rem]" style={{ color: "#8896AB" }}>
            <span className="flex h-7 w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "#F9731615", border: "1px solid #F9731628" }}>
              <MapPin className="h-3.5 w-3.5" style={{ color: "#FB923C" }} />
            </span>
            18 شارع البستان، باب اللوق، القاهرة
          </span>
        </div>

        {/* ── APP BADGES (hidden on mobile) ── */}
        <div className="mt-7 hidden sm:flex flex-col gap-3.5 sm:flex-row sm:items-center">
          <span className="text-[0.74rem] font-medium" style={{ color: "#506078" }}>
            تطبيق المول قريبا
          </span>
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
                className="flex h-10 items-center gap-2 rounded-xl px-4 text-[0.73rem] font-medium transition-all duration-300 hover:bg-white/[0.06]"
                style={{ background: "#ffffff04", border: "1px solid #ffffff0A", color: "#6B7A8D" }}
              >
                {store.icon}
                {store.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="mt-6 lg:mt-9 border-t pt-4 lg:pt-6" style={{ borderColor: "#ffffff08" }}>
          <div className="flex flex-col gap-2 lg:gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 lg:gap-x-3 lg:gap-y-1.5 text-[0.7rem]" style={{ color: "#3D4A5C" }}>
              <p>مول البستان — منذ ١٩٩٠</p>
              <span style={{ color: "#2A3444" }}>|</span>
              <span>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 lg:gap-5 text-[0.7rem]" style={{ color: "#3D4A5C" }}>
              <Link to="/terms" className="transition-colors duration-200 hover:text-slate-300">الشروط</Link>
              <Link to="/privacy" className="transition-colors duration-200 hover:text-slate-300">الخصوصية</Link>
              <span>
                Developed by{" "}
                <a href="https://mg.digital" target="_blank" rel="noopener noreferrer" className="font-poppins font-medium transition-colors duration-200 hover:text-slate-300" style={{ color: "#506078" }}>
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
        className="absolute left-5 bottom-6 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 hover:bg-white/[0.08]"
        style={{ background: "#ffffff06", border: "1px solid #ffffff0D", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
        aria-label="العودة للأعلى"
      >
        <ArrowUp className="h-4 w-4" style={{ color: "#6B7A8D" }} />
      </button>
    </footer>
  );
}
