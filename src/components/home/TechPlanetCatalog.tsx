import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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

const ORBIT_KEYS: OrbitKey[] = ["all", "inner", "middle", "outer"];

const isOrbitKey = (v: string | null): v is OrbitKey =>
  v === "all" || v === "inner" || v === "middle" || v === "outer";

export const TechPlanetCatalog = ({ inner, middle, outer }: Props) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL (?tp=inner&q=laptop) so refresh + shared links restore state.
  const initialOrbit = useMemo<OrbitKey>(() => {
    const v = searchParams.get("tp");
    return isOrbitKey(v) ? v : "all";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const initialQuery = useMemo(() => searchParams.get("q") ?? "", []);

  const [orbit, setOrbit] = useState<OrbitKey>(initialOrbit);
  const [query, setQuery] = useState(initialQuery);
  const [activeIndex, setActiveIndex] = useState(0);

  const searchRef = useRef<HTMLInputElement>(null);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const itemsRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const gridRef = useRef<HTMLUListElement>(null);
  const isFirstSyncRef = useRef(true);

  // Sync state → URL (debounced for query). Uses replace to avoid history spam.
  useEffect(() => {
    // Skip the very first run so we don't overwrite a fresh URL on mount.
    if (isFirstSyncRef.current) {
      isFirstSyncRef.current = false;
      return;
    }
    const handle = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (orbit === "all") next.delete("tp");
      else next.set("tp", orbit);
      const trimmed = query.trim();
      if (!trimmed) next.delete("q");
      else next.set("q", trimmed);
      // Only update if something actually changed (avoid replace loops).
      if (next.toString() !== searchParams.toString()) {
        setSearchParams(next, { replace: true });
      }
    }, 250);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orbit, query]);

  // Sync URL → state (e.g. browser back/forward).
  useEffect(() => {
    const urlOrbit = searchParams.get("tp");
    const nextOrbit: OrbitKey = isOrbitKey(urlOrbit) ? urlOrbit : "all";
    const nextQuery = searchParams.get("q") ?? "";
    if (nextOrbit !== orbit) setOrbit(nextOrbit);
    if (nextQuery !== query) setQuery(nextQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);


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
      return normalize(d.label).includes(q) || normalize(d.slug).includes(q);
    });
  }, [all, orbit, query]);

  const counts: Record<OrbitKey, number> = {
    all: all.length,
    inner: inner.length,
    middle: middle.length,
    outer: outer.length,
  };

  // Reset roving focus when result set changes
  useEffect(() => {
    setActiveIndex(0);
  }, [orbit, query]);

  // Global "/" shortcut to focus search (only when not already typing)
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "/") return;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (t && t.isContentEditable)) return;
      // Only intercept if catalog is visible
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      e.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Compute columns from the rendered grid for 2D arrow navigation
  const getColumns = (): number => {
    const grid = gridRef.current;
    if (!grid) return 1;
    const styles = window.getComputedStyle(grid);
    const tmpl = styles.gridTemplateColumns || "";
    const cols = tmpl.split(" ").filter(Boolean).length;
    return Math.max(1, cols);
  };

  // Tablist roving navigation (RTL-aware: ArrowLeft = next, ArrowRight = prev)
  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const last = ORBIT_KEYS.length - 1;
    let next = idx;
    if (e.key === "ArrowLeft") next = idx === last ? 0 : idx + 1;
    else if (e.key === "ArrowRight") next = idx === 0 ? last : idx - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      itemsRef.current[0]?.focus();
      setActiveIndex(0);
      return;
    } else {
      return;
    }
    e.preventDefault();
    setOrbit(ORBIT_KEYS[next]);
    requestAnimationFrame(() => tabsRef.current[next]?.focus());
  };

  // Results grid 2D navigation (RTL-aware horizontal arrows)
  const handleItemKeyDown = (e: KeyboardEvent<HTMLAnchorElement>, idx: number) => {
    const cols = getColumns();
    const total = results.length;
    let next = idx;

    switch (e.key) {
      case "ArrowLeft":
        next = idx + 1; // RTL: visually next
        break;
      case "ArrowRight":
        next = idx - 1; // RTL: visually previous
        break;
      case "ArrowDown":
        next = idx + cols;
        break;
      case "ArrowUp":
        next = idx - cols;
        if (next < 0) {
          e.preventDefault();
          // Jump back up to the active tab
          const tabIdx = Math.max(0, ORBIT_KEYS.indexOf(orbit));
          tabsRef.current[tabIdx]?.focus();
          return;
        }
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = total - 1;
        break;
      case "PageDown":
        next = Math.min(total - 1, idx + cols * 3);
        break;
      case "PageUp":
        next = Math.max(0, idx - cols * 3);
        break;
      case "Enter":
      case " ": {
        e.preventDefault();
        const slug = results[idx]?.slug;
        if (slug) navigate(`/devices/${slug}`);
        return;
      }
      case "Escape":
        if (query) {
          e.preventDefault();
          setQuery("");
          searchRef.current?.focus();
        }
        return;
      default:
        return;
    }
    if (next < 0 || next >= total) return;
    e.preventDefault();
    setActiveIndex(next);
    requestAnimationFrame(() => itemsRef.current[next]?.focus());
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      itemsRef.current[0]?.focus();
      setActiveIndex(0);
    } else if (e.key === "Escape" && query) {
      e.preventDefault();
      setQuery("");
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      navigate(`/devices/${results[0].slug}`);
    }
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
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder='ابحث عن جهاز… (اضغط "/" للبحث السريع)'
            aria-label="ابحث في كوكب البستان"
            aria-controls="tp-results-grid"
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
          {ORBIT_KEYS.map((key, idx) => {
            const isActive = orbit === key;
            const dot = key === "all" ? "#CDBB9A" : ORBIT_COLORS[key];
            return (
              <button
                key={key}
                ref={(el) => (tabsRef.current[idx] = el)}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setOrbit(key)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-arabic text-[0.75rem] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD34D]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071326]"
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
            : `${results.length} جهاز${results.length === all.length ? "" : ` من ${all.length}`} · تنقّل بالأسهم، Enter للفتح`}
        </p>

        {results.length > 0 && (
          <ul
            id="tp-results-grid"
            ref={gridRef}
            role="listbox"
            aria-label="نتائج الأجهزة"
            className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          >
            {results.map((d, idx) => {
              const color = ORBIT_COLORS[d.ring];
              const isActive = idx === activeIndex;
              return (
                <li key={`${d.ring}-${d.slug}`} role="option" aria-selected={isActive}>
                  <Link
                    ref={(el) => (itemsRef.current[idx] = el)}
                    to={`/devices/${d.slug}`}
                    tabIndex={isActive ? 0 : -1}
                    onFocus={() => setActiveIndex(idx)}
                    onKeyDown={(e) => handleItemKeyDown(e, idx)}
                    className="group flex h-full items-center gap-2.5 rounded-lg border bg-white/[0.03] px-3 py-2.5 transition-all hover:border-[#FCD34D]/50 hover:bg-white/[0.07] focus:outline-none focus-visible:border-[#FCD34D] focus-visible:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[#FCD34D]/50"
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
                        className="h-3 w-3 shrink-0 opacity-0 transition-all group-hover:opacity-70 group-focus-visible:opacity-90"
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
