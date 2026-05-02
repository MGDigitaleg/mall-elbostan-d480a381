/**
 * HomeAnchorNav — RTL in-page navigation for the homepage.
 * Smoothly scrolls to map / stores / leasing / contact sections,
 * compensating for the fixed header height.
 */
import { Compass, Store, Building2, Phone } from "lucide-react";

const HEADER_OFFSET = 76;

const links = [
  { id: "home-map",     label: "الخريطة",     icon: Compass },
  { id: "home-stores",  label: "دليل المحلات", icon: Store },
  { id: "home-leasing", label: "التأجير",     icon: Building2 },
  { id: "home-contact", label: "تواصل",       icon: Phone },
];

export function HomeAnchorNav() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      dir="rtl"
      aria-label="روابط أقسام الصفحة الرئيسية"
      className="bg-card dark:bg-background border-b border-border/40"
      style={{ paddingTop: "clamp(10px, 1.5vw, 14px)", paddingBottom: "clamp(10px, 1.5vw, 14px)", minHeight: 56, contain: "layout" }}
    >
      <div className="container">
        <ul
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide justify-start lg:justify-center"
          style={{ scrollbarWidth: "none" }}
        >
          {links.map((link) => (
            <li key={link.id} className="shrink-0">
              <a
                href={`#${link.id}`}
                onClick={(e) => handleClick(e, link.id)}
                className="group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.78rem] font-semibold transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
              >
                <link.icon className="h-3.5 w-3.5 transition-colors group-hover:text-primary" />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
