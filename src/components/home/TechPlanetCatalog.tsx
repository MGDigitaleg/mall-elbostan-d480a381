import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, X, ArrowLeft, ExternalLink, Sparkles, Layers, SearchX, Compass, Lightbulb, type LucideIcon } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { deviceCatalog } from "@/lib/deviceCatalog";
import { resolveDeviceHref } from "@/lib/deviceHref";
import { scoreDevice, tokenizeQuery } from "@/lib/deviceSearchIndex";
import { clusters as taxonomyClusters, pillars as taxonomyPillars } from "@/lib/deviceTaxonomy";

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

  // Map every catalog slug to its taxonomy pillar (if any) so each orbit can
  // deep-link into the new /devices/{pillar}[/{cluster}[/{longtail}]] hub
  // pages instead of the legacy /devices/{slug} routes.
  const slugToPillar = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of taxonomyClusters) m.set(c.slug, c.pillarSlug);
    return m;
  }, []);

  // For each orbit (inner/middle/outer), pick the dominant pillar based on
  // how many of that orbit's devices live under it. Used for the
  // "تصفّح هذا المدار في صفحة موسّعة" CTA next to the active chip.
  const orbitDeepLinks = useMemo(() => {
    const out: Record<Exclude<OrbitKey, "all">, { href: string; labelAr: string } | null> = {
      inner: null,
      middle: null,
      outer: null,
    };
    const groups: Record<Exclude<OrbitKey, "all">, CatalogDevice[]> = { inner, middle, outer };
    for (const ring of ["inner", "middle", "outer"] as const) {
      const counts = new Map<string, number>();
      for (const d of groups[ring]) {
        const pillar = slugToPillar.get(d.slug) ?? null;
        if (!pillar) continue;
        counts.set(pillar, (counts.get(pillar) ?? 0) + 1);
      }
      let bestSlug: string | null = null;
      let bestCount = 0;
      counts.forEach((n, slug) => {
        if (n > bestCount) { bestCount = n; bestSlug = slug; }
      });
      if (!bestSlug) continue;
      const pillarMeta = taxonomyPillars.find((p) => p.slug === bestSlug);
      if (!pillarMeta) continue;
      out[ring] = { href: `/devices/${pillarMeta.slug}`, labelAr: pillarMeta.labelAr };
    }
    return out;
  }, [inner, middle, outer, slugToPillar]);


  const results = useMemo(() => {
    const tokens = tokenizeQuery(query);
    const scored = all
      .filter((d) => orbit === "all" || d.ring === orbit)
      .map((d) => ({ d, score: tokens.length === 0 ? 1 : scoreDevice(d.slug, tokens) }))
      .filter((r) => r.score > 0);

    // When no query, preserve catalog order; with a query, sort by score desc.
    if (tokens.length > 0) scored.sort((a, b) => b.score - a.score);
    return scored.map((r) => r.d);
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
        if (slug) navigate(resolveDeviceHref(slug));
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
      navigate(resolveDeviceHref(results[0].slug));
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

      {/* Deep-link to the new taxonomy hub for the active orbit */}
      {orbit !== "all" && orbitDeepLinks[orbit] && (
        <div className="mt-3 flex justify-end">
          <Link
            to={orbitDeepLinks[orbit]!.href}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-arabic text-[0.72rem] transition-all hover:bg-white/10"
            style={{
              borderColor: `${ORBIT_COLORS[orbit]}55`,
              color: ORBIT_COLORS[orbit],
              background: `${ORBIT_COLORS[orbit]}10`,
            }}
            aria-label={`تصفّح ${ORBIT_LABELS[orbit]} في صفحة ${orbitDeepLinks[orbit]!.labelAr} الموسّعة`}
          >
            <ExternalLink className="h-3 w-3" />
            تصفّح {orbitDeepLinks[orbit]!.labelAr} في صفحة موسّعة
            <ArrowLeft className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Results */}
      <div className="mt-5">
        <p className="mb-3 font-arabic text-[0.72rem]" style={{ color: "rgba(255,255,255,0.55)" }}>
          {results.length === 0
            ? "لا توجد نتائج مطابقة"
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
                  <HoverCard openDelay={180} closeDelay={120}>
                    <HoverCardTrigger asChild>
                      <Link
                        ref={(el) => (itemsRef.current[idx] = el)}
                        to={resolveDeviceHref(d.slug)}
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
                    </HoverCardTrigger>
                    <DevicePreviewCard slug={d.slug} ring={d.ring} accent={color} />
                  </HoverCard>
                </li>
              );
            })}
          </ul>
        )}

        {results.length === 0 && (
          <EmptyState
            query={query}
            orbit={orbit}
            all={all}
            orbitDeepLink={orbit === "all" ? null : orbitDeepLinks[orbit]}
            onClearQuery={() => {
              setQuery("");
              requestAnimationFrame(() => searchRef.current?.focus());
            }}
            onResetOrbit={() => setOrbit("all")}
            onPickSuggestion={(s) => {
              setQuery(s);
              requestAnimationFrame(() => searchRef.current?.focus());
            }}
          />
        )}
      </div>
    </div>
  );
};

// ── Empty state ────────────────────────────────────────────────────────────
type EmptyProps = {
  query: string;
  orbit: OrbitKey;
  all: Array<CatalogDevice & { ring: Exclude<OrbitKey, "all"> }>;
  onClearQuery: () => void;
  onResetOrbit: () => void;
  onPickSuggestion: (s: string) => void;
};

// Curated, evergreen Arabic suggestions covering common shopper intents.
const FALLBACK_SUGGESTIONS = ["لابتوب", "موبايل", "شاشة", "سماعة", "بلايستيشن", "كاميرا", "طابعة", "راوتر"];

// Lightweight similarity for "did you mean" suggestions (Levenshtein-ish, normalized).
const similarity = (a: string, b: string): number => {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.85;
  // Shared character set ratio — cheap and good enough for short Arabic labels.
  const setA = new Set(a);
  const setB = new Set(b);
  let shared = 0;
  setA.forEach((c) => { if (setB.has(c)) shared += 1; });
  return shared / Math.max(setA.size, setB.size);
};

const EmptyState = ({ query, orbit, all, onClearQuery, onResetOrbit, onPickSuggestion }: EmptyProps) => {
  // How many would match the query if we ignored the orbit filter?
  // Uses the same weighted scoring as the main results for consistency.
  const matchesIgnoringOrbit = useMemo(() => {
    const tokens = tokenizeQuery(query);
    if (tokens.length === 0) return [] as typeof all;
    return all.filter((d) => scoreDevice(d.slug, tokens) > 0);
  }, [all, query]);

  // "Did you mean" — closest matching device labels by character similarity.
  const didYouMean = useMemo(() => {
    const q = normalize(query);
    if (!q || q.length < 2) return [] as string[];
    const scored = all
      .map((d) => ({ label: d.label, score: similarity(normalize(d.label), q) }))
      .filter((s) => s.score >= 0.45)
      .sort((a, b) => b.score - a.score);
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of scored) {
      if (seen.has(s.label)) continue;
      seen.add(s.label);
      out.push(s.label);
      if (out.length === 3) break;
    }
    return out;
  }, [all, query]);

  // Popular suggestions fall back to catalog labels in the active orbit.
  const popular = useMemo(() => {
    const pool = orbit === "all" ? all : all.filter((d) => d.ring === orbit);
    const fromCatalog = pool.slice(0, 6).map((d) => d.label);
    return Array.from(new Set([...fromCatalog, ...FALLBACK_SUGGESTIONS])).slice(0, 8);
  }, [all, orbit]);

  const hasQuery = query.trim().length > 0;
  const orbitFilterActive = orbit !== "all";
  const otherOrbitCount = matchesIgnoringOrbit.length;
  const showCrossOrbitHint = orbitFilterActive && hasQuery && otherOrbitCount > 0;

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative overflow-hidden rounded-2xl border px-5 py-8 sm:px-8"
      style={{
        borderColor: "rgba(205,187,154,0.22)",
        background: "linear-gradient(160deg, rgba(7,19,38,0.55) 0%, rgba(13,31,60,0.35) 100%)",
      }}
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(420px 220px at 50% 0%, rgba(252,211,77,0.10), transparent 60%), radial-gradient(360px 200px at 50% 100%, rgba(125,211,252,0.08), transparent 60%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-5 text-center">
        {/* Icon mark */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-3 rounded-full blur-xl"
            style={{ background: "radial-gradient(circle, rgba(252,211,77,0.25), transparent 70%)" }}
          />
          <div
            aria-hidden
            className="relative flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(252,211,77,0.18), rgba(252,211,77,0.04))",
              border: "1px solid rgba(252,211,77,0.4)",
              boxShadow: "0 0 24px rgba(252,211,77,0.15)",
            }}
          >
            {hasQuery ? (
              <SearchX className="h-6 w-6" style={{ color: "#FCD34D" }} />
            ) : (
              <Compass className="h-6 w-6" style={{ color: "#FCD34D" }} />
            )}
          </div>
        </div>

        {/* Headline + sub */}
        <div className="max-w-md space-y-1.5">
          <p className="font-arabic-display text-[1.05rem] font-bold leading-snug text-white">
            {hasQuery ? (
              <>
                لم نعثر على نتائج لـ{" "}
                <span className="rounded-md px-1.5 py-0.5 font-mono text-[0.92rem]" style={{ background: "rgba(252,211,77,0.14)", color: "#FCD34D" }}>
                  {query}
                </span>
              </>
            ) : (
              "هذا المدار فارغ مؤقتاً"
            )}
          </p>
          <p className="font-arabic text-[0.82rem] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            {showCrossOrbitHint
              ? `وجدنا ${otherOrbitCount} ${otherOrbitCount === 1 ? "نتيجة" : "نتائج"} خارج المدار المحدد. أزل الفلتر للعرض الكامل.`
              : hasQuery
                ? "تأكد من الإملاء، أو جرّب مصطلحاً أبسط مثل ”لابتوب“ أو ”شاشة“."
                : "اختر مداراً آخر أو ابحث مباشرة عن الجهاز الذي تريده."}
          </p>
        </div>

        {/* Did you mean */}
        {didYouMean.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 font-arabic text-[0.72rem]" style={{ color: "rgba(255,255,255,0.5)" }}>
              <Lightbulb className="h-3 w-3" style={{ color: "#FCD34D" }} />
              هل تقصد:
            </span>
            {didYouMean.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onPickSuggestion(s)}
                className="rounded-full border px-2.5 py-1 font-arabic text-[0.74rem] font-semibold transition-all hover:bg-white/10"
                style={{ borderColor: "rgba(252,211,77,0.45)", color: "#FCD34D", background: "rgba(252,211,77,0.06)" }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Primary actions */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {showCrossOrbitHint && (
            <button
              type="button"
              onClick={onResetOrbit}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-arabic text-[0.78rem] font-bold text-white transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #1F61FF 0%, #3B82F6 100%)",
                boxShadow: "0 4px 14px rgba(31,97,255,0.35)",
              }}
            >
              <Compass className="h-3.5 w-3.5" />
              عرض كل المدارات ({otherOrbitCount})
            </button>
          )}
          {!showCrossOrbitHint && orbitFilterActive && (
            <button
              type="button"
              onClick={onResetOrbit}
              className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-arabic text-[0.75rem] transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(125,211,252,0.5)", color: "#7DD3FC" }}
            >
              عرض كل المدارات
            </button>
          )}
          {hasQuery && (
            <button
              type="button"
              onClick={onClearQuery}
              className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-arabic text-[0.75rem] transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(205,187,154,0.35)", color: "rgba(255,255,255,0.85)" }}
            >
              <X className="h-3 w-3" />
              مسح البحث
            </button>
          )}
        </div>

        {/* Popular suggestions */}
        <div className="w-full max-w-xl">
          <div className="mb-2.5 flex items-center justify-center gap-2">
            <span aria-hidden className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(205,187,154,0.25), transparent)" }} />
            <span className="font-arabic text-[0.7rem] tracking-wider" style={{ color: "rgba(255,255,255,0.45)" }}>
              الأكثر بحثاً
            </span>
            <span aria-hidden className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(205,187,154,0.25), transparent)" }} />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {popular.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onPickSuggestion(s)}
                className="rounded-full border px-2.5 py-1 font-arabic text-[0.72rem] text-white/75 transition-all hover:border-[#FCD34D]/60 hover:bg-white/10 hover:text-white"
                style={{ borderColor: "rgba(205,187,154,0.22)", background: "rgba(255,255,255,0.03)" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Browse all stores fallback */}
        <Link
          to="/stores"
          className="inline-flex items-center gap-1.5 font-arabic text-[0.75rem] font-semibold transition-colors hover:text-white"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          أو تصفّح دليل محلات المول
          <ArrowLeft className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};


// ── Quick preview card on hover/focus ─────────────────────────────────────
const RING_LABEL_AR: Record<Exclude<OrbitKey, "all">, string> = {
  inner: "المدار الداخلي",
  middle: "المدار الأوسط",
  outer: "المدار الخارجي",
};

type PreviewProps = {
  slug: string;
  ring: Exclude<OrbitKey, "all">;
  accent: string;
};

const DevicePreviewCard = ({ slug, ring, accent }: PreviewProps) => {
  const entry = deviceCatalog[slug];
  if (!entry) return null;

  const { Icon, labelAr, labelEn, parentCategory, seo, faq, relatedSlugs } = entry;
  // Trim description to a tight 2–3 line preview (avoid huge cards).
  const description = seo.description.length > 180 ? `${seo.description.slice(0, 175).trimEnd()}…` : seo.description;

  return (
    <HoverCardContent
      side="top"
      align="center"
      sideOffset={10}
      collisionPadding={12}
      className="z-50 w-72 rounded-xl border p-0 shadow-2xl"
      style={{
        background: "linear-gradient(150deg, rgba(7,19,38,0.98) 0%, rgba(13,31,60,0.98) 100%)",
        borderColor: `${accent}55`,
        boxShadow: `0 20px 50px -10px rgba(7,19,38,0.7), 0 0 0 1px ${accent}22`,
      }}
    >
      <div dir="rtl" className="overflow-hidden rounded-xl">
        {/* Header */}
        <div
          className="flex items-start gap-3 px-4 pt-4 pb-3"
          style={{ borderBottom: `1px solid ${accent}22` }}
        >
          <div
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
            style={{
              background: `${accent}1F`,
              border: `1px solid ${accent}55`,
              color: accent,
              boxShadow: `0 0 18px ${accent}33`,
            }}
          >
            <Icon size={22} strokeWidth={1.7} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-arabic-display text-[0.95rem] font-bold leading-tight text-white">
              {labelAr}
            </h4>
            <p className="mt-0.5 truncate font-mono text-[0.68rem]" style={{ color: "rgba(255,255,255,0.45)" }}>
              {labelEn}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 py-3">
          <p className="font-arabic text-[0.78rem] leading-[1.55]" style={{ color: "rgba(255,255,255,0.78)" }}>
            {description}
          </p>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3">
          <span
            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-arabic text-[0.65rem]"
            style={{ borderColor: `${accent}55`, background: `${accent}14`, color: accent }}
          >
            <Layers className="h-2.5 w-2.5" />
            {RING_LABEL_AR[ring]}
          </span>
          <span
            className="inline-flex items-center rounded-full border px-2 py-0.5 font-arabic text-[0.65rem]"
            style={{
              borderColor: "rgba(205,187,154,0.3)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {parentCategory}
          </span>
          {faq.length > 0 && (
            <span
              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-arabic text-[0.65rem]"
              style={{
                borderColor: "rgba(252,211,77,0.35)",
                background: "rgba(252,211,77,0.08)",
                color: "#FCD34D",
              }}
            >
              <Sparkles className="h-2.5 w-2.5" />
              {faq.length} سؤال شائع
            </span>
          )}
          {relatedSlugs.length > 0 && (
            <span
              className="inline-flex items-center rounded-full border px-2 py-0.5 font-arabic text-[0.65rem]"
              style={{
                borderColor: "rgba(205,187,154,0.3)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {relatedSlugs.length} فئة مرتبطة
            </span>
          )}
        </div>

        {/* Footer CTA */}
        <Link
          to={resolveDeviceHref(slug)}
          className="flex items-center justify-between gap-2 border-t px-4 py-2.5 font-arabic text-[0.78rem] font-bold transition-colors hover:bg-white/[0.06]"
          style={{ borderColor: `${accent}22`, color: "#FCD34D" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" />
            عرض صفحة {labelAr}
          </span>
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      </div>
    </HoverCardContent>
  );
};

