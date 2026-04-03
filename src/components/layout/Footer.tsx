import { Link } from "react-router-dom";
import logoWhite from "@/assets/logo-white.svg";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Compass, ArrowUp, ExternalLink } from "lucide-react";

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

function SocialIcon({ children, href, label }: { children: React.ReactNode; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 hover:scale-105"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.08))",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {children}
    </a>
  );
}

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #060E1C 0%, #071326 40%, #0A0F1A 100%)" }}>
      {/* Decorative top border */}
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent 5%, #CDBB9A40 30%, #2563EB50 50%, #CDBB9A40 70%, transparent 95%)" }} />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(ellipse, #2563EB, transparent 70%)" }} />

      <div className="container relative pt-14 pb-6 md:pt-18 md:pb-8 lg:pt-20">
        {/* ── TOP: Brand + Navigation ── */}
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8 xl:gap-12">
          {/* Brand column */}
          <div className="space-y-5">
            <Link to="/" className="inline-block">
              <img src={logoWhite} alt="مول البستان" className="h-[52px] w-auto opacity-90 transition-opacity hover:opacity-100" />
            </Link>

            <p className="max-w-[260px] text-[0.82rem] leading-[1.85] font-light" style={{ color: "#8896AB" }}>
              وجهة مصر التقنية الأولى — مكانة بناها السوق وثقة أثبتتها السنوات منذ 1990.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map((s) => (
                <SocialIcon key={s.label} href={s.href} label={s.label}>
                  <s.icon className="h-[15px] w-[15px] transition-colors group-hover:text-white" style={{ color: "#8896AB" }} />
                </SocialIcon>
              ))}
              <SocialIcon href="https://www.tiktok.com/@mallelbostan" label="TikTok">
                <span className="transition-colors group-hover:text-white" style={{ color: "#8896AB" }}>
                  <TikTokIcon />
                </span>
              </SocialIcon>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <Link to="/map">
                <Button variant="cta" className="h-10 rounded-xl px-5 text-[0.78rem] font-bold shadow-lg shadow-primary/20">
                  <Compass className="ml-1.5 h-3.5 w-3.5" /> استكشف الخريطة
                </Button>
              </Link>
              <Link to="/leasing">
                <Button
                  className="h-10 rounded-xl px-5 text-[0.78rem] font-bold transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                  style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  التأجير والشراء
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4
                className="mb-4 text-[0.68rem] font-bold tracking-[0.14em] uppercase"
                style={{ color: "#CDBB9A" }}
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="group/link flex items-center text-[0.8rem] transition-all duration-200"
                      style={{ color: "#7C8BA1" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#E2E8F0"; e.currentTarget.style.paddingInlineEnd = "4px"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#7C8BA1"; e.currentTarget.style.paddingInlineEnd = "0"; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── CONTACT STRIP ── */}
        <div
          className="mt-10 rounded-2xl px-5 py-4 flex flex-wrap items-center gap-6 md:gap-10"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.04))",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase" style={{ color: "#CDBB9A" }}>
            تواصل معنا
          </span>

          <a href="mailto:info@mallelbostan.com" className="flex items-center gap-2.5 text-[0.8rem] transition-colors hover:text-white" style={{ color: "#8896AB" }}>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "rgba(37,99,235,0.12)" }}>
              <Mail className="h-3.5 w-3.5" style={{ color: "#4B8BFF" }} />
            </span>
            info@mallelbostan.com
          </a>

          <span className="flex items-center gap-2.5 text-[0.8rem]" style={{ color: "#8896AB" }}>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "rgba(37,99,235,0.12)" }}>
              <MapPin className="h-3.5 w-3.5" style={{ color: "#4B8BFF" }} />
            </span>
            التجمع الخامس، القاهرة الجديدة
          </span>

          <span className="flex items-center gap-2.5 text-[0.8rem]" style={{ color: "#8896AB" }}>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "rgba(37,99,235,0.12)" }}>
              <MapPin className="h-3.5 w-3.5" style={{ color: "#4B8BFF" }} />
            </span>
            18 شارع البستان، باب اللوق، القاهرة
          </span>
        </div>

        {/* ── APP BADGES ── */}
        <div className="mt-7 flex flex-col gap-3.5 sm:flex-row sm:items-center">
          <span className="text-[0.74rem] font-medium" style={{ color: "#506078" }}>
            تطبيق المول قريبا
          </span>
          <div className="flex gap-2.5">
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
                className="flex h-10 items-center gap-2 rounded-xl px-4 text-[0.73rem] font-medium transition-all duration-300 hover:border-white/15 hover:bg-white/8"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#6B7A8D",
                }}
              >
                {store.icon}
                {store.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="mt-9 border-t pt-6" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.7rem]" style={{ color: "#3D4A5C" }}>
              <p>مول البستان — وجهة تقنية مصرية راسخة</p>
              <span className="hidden md:inline" style={{ color: "#2A3444" }}>|</span>
              <span>© {new Date().getFullYear()} جميع الحقوق محفوظة</span>
            </div>
            <div className="flex items-center gap-5 text-[0.7rem]" style={{ color: "#3D4A5C" }}>
              <Link to="/terms" className="transition-colors duration-200 hover:text-slate-300">الشروط والأحكام</Link>
              <Link to="/privacy" className="transition-colors duration-200 hover:text-slate-300">الخصوصية</Link>
              <span>
                Developed by{" "}
                <a
                  href="https://mg.digital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium transition-colors duration-200 hover:text-slate-300"
                  style={{ color: "#506078" }}
                >
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
        className="absolute left-5 bottom-6 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 hover:bg-white/10"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.08))",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
        aria-label="العودة للأعلى"
      >
        <ArrowUp className="h-4 w-4" style={{ color: "#6B7A8D" }} />
      </button>
    </footer>
  );
}
