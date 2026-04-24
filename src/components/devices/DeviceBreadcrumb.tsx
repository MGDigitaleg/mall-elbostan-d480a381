import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export interface CrumbNode {
  labelAr: string;
  to?: string;
}

export function DeviceBreadcrumb({ items }: { items: CrumbNode[] }) {
  return (
    <nav aria-label="مسار التنقل" className="font-arabic text-[0.78rem] text-white/60">
      <Link to="/" className="hover:text-white">الرئيسية</Link>
      {items.map((it, i) => (
        <span key={i}>
          <ChevronLeft className="mx-1 inline h-3 w-3 opacity-60" />
          {it.to ? (
            <Link to={it.to} className="hover:text-white">{it.labelAr}</Link>
          ) : (
            <span className="text-white">{it.labelAr}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
