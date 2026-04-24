import { Link } from "react-router-dom";

export interface RelatedItem {
  to: string;
  labelAr: string;
}

export function DeviceRelatedGrid({ title, items }: { title: string; items: RelatedItem[] }) {
  if (!items.length) return null;
  return (
    <section className="bg-background">
      <div className="container py-12 md:py-16">
        <h2 className="mb-6 font-arabic-display text-2xl font-semibold">{title}</h2>
        <div className="flex flex-wrap gap-3">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className="inline-flex items-center rounded-full border bg-card px-4 py-2 font-arabic text-sm transition-colors hover:bg-muted"
            >
              {it.labelAr}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
