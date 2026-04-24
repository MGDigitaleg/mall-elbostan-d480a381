import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, ArrowLeft, type LucideIcon } from "lucide-react";

export type CatalogDevice = {
  Icon: LucideIcon;
  label: string;
  slug: string;
};

type OrbitKey = "all" | "inner" | "middle" | "outer";

const ORBIT_LABELS: Record<OrbitKey, string> = {
  all: "كل الفئات",
  inner: "المدار الداخلي",
  middle: "المدار الأوسط",
  outer: "المدار الخارجي",
};

const ORBIT_COLORS: Record<Exclude<OrbitKey, "all">, string> = {
  inner: "#7DD3FC",
  middle: "#60A5FA",
  outer: "#A78BFA",
};

type Props = {
  inner: CatalogDevice[];
  middle: CatalogDevice[];
  outer: CatalogDevice[];
};

// Normalize Arabic letters and strip diacritics for forgiving search.
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "") // Tashkeel
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[-_]/g, " ")
    .trim();

export const TechPlanetCatalog = ({ inner, middle, outer }: Props) => {
  const [orbit, setOrbit] = useState<OrbitKey>("all");
  const [query, setQuery] = useState("");

  const all = useMemo(() => {
    const tag = (devices: CatalogDevice[], ring: Exclude<OrbitKey, "all">) =>
      devices.map((d) => ({ ...d, ring }));
    return [...tag(inner, "inner"), ...tag(middle, "middle"), ...tag(outer, "outer")];
  }, [inner, middle, outer]);

  const results = useMemo(() => {
    const q = normalize(query);
    return all.filter((d) => {
      if (orbit !== "all" && d.ring !== orbit) return false;
      if (!q) return true;
      return (
        normalize(d.label).includes(q) ||
        normalize(d.slug).includes(q)
      );
    });
  }, [all, orbit, query]);

  const counts: Record<OrbitKey, number> = {
    all: all.length,
    inner: inner.length,
    middle: middle.length,
    outer: outer.length,
  };

  return (
    <div
      dir="rtl"
      className="mx-auto mt-12 w-full max-w-5xl rounded-2xl border p-5 backdrop-blur-md sm:p-6"
      style={{
        borderColor: "rgba(205,187,154,0.22)",
        background: "rgba(7,19,38,0.55)",
      }}
    >
      {/* Header: search + filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search
            className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "rgba(255,255,255,0.5)" }}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن جهاز… (مثال: لابتوب، شاشة، playstation)"
            aria-label="ابحث في كوكب البستان"
            className="w-full rounded-lg border bg-white/[0.04] py-2 pe-10 ps-3 font-arabic text-[0.88rem] text-white placeholder:text-white/40 focus:border-[#7DD3FC] focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]/30"
            style={{ borderColor: "rgba(205,187,154,0.25)" }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="مسح البحث"
              className="absolute start-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div role="tablist" aria-label="فلتر المدارات" className="flex flex-wrap items-center gap-2">
          {(Object.keys(ORBIT_LABELS) as OrbitKey[]).map((key) => {
            const isActive = orbit === key;
            const dot = key === "all" ? "#CDBB9A" : ORBIT_COLORS[key];
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setOrbit(key)}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-arabic text-[0.75rem] transition-all"
                style={{
                  borderColor: isActive ? dot : "rgba(205,187,154,0.22)",
                  background: isActive ? `${dot}1A` : "rgba(255,255,255,0.03)",
                  color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                }}
              >
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: dot, boxShadow: `0 0 8px ${dot}` }}
                />
                {ORBIT_LABELS[key]}
                <span className="text-white/45">({counts[key]})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="mt-5">
        <p className="mb-3 font-arabic text-[0.72rem]" style={{ color: "rgba(255,255,255,0.55)" }}>
          {results.length === 0
            ? "لا توجد نتائج مطابقة — جرّب كلمة أخرى."
            : `${results.length} جهاز${results.length === all.length ? "" : ` من ${all.length}`}`}
        </p>

        {results.length > 0 && (
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {results.map((d) => {
              const color = ORBIT_COLORS[d.ring];
              return (
                <li key={`${d.ring}-${d.slug}`}>
                  <Link
                    to={`/devices/${d.slug}`}
                    className="group flex h-full items-center gap-2.5 rounded-lg border bg-white/[0.03] px-3 py-2.5 transition-all hover:border-[#FCD34D]/50 hover:bg-white/[0.07]"
                    style={{ borderColor: "rgba(205,187,154,0.18)" }}
                  >
                    <span
                      aria-hidden
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors"
                      style={{ background: `${color}15`, color }}
                    >
                      <d.Icon size={18} strokeWidth={1.7} />
                    </span>
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-1">
                      <span className="truncate font-arabic text-[0.82rem] text-white/90 group-hover:text-white">
                        {d.label}
                      </span>
                      <ArrowLeft
                        className="h-3 w-3 shrink-0 opacity-0 transition-all group-hover:opacity-70"
                        style={{ color: "#FCD34D" }}
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
