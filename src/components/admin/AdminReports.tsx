/**
 * Shared building blocks for the admin reporting layer:
 * - useDateRange / DateRangeFilter — preset & custom range selector
 * - SourceBadge — labels the data source (GA4, DB, UTM, audit, edge)
 * - RankTable — ranked horizontal bar list
 * - ReportShell — page wrapper with breadcrumb back to dashboard
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowRight, Database, Globe, ListChecks, Activity, Megaphone, Download, Printer } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { downloadCsv, type CsvColumn } from "@/lib/csvExport";
import { AdminShell } from "./AdminShell";

export type RangePreset = "today" | "7d" | "30d" | "this_month" | "custom";

export type DateRange = {
  preset: RangePreset;
  from: Date;
  to: Date;
  /** ISO strings used in queries */
  fromIso: string;
  toIso: string;
  /** Human label */
  label: string;
};

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function endOfDay(d: Date) { const x = new Date(d); x.setHours(23,59,59,999); return x; }

export function buildRange(preset: RangePreset, customFrom?: string, customTo?: string): DateRange {
  const now = new Date();
  let from = startOfDay(now);
  let to = endOfDay(now);
  let label = "اليوم";
  if (preset === "7d") {
    from = startOfDay(new Date(Date.now() - 6 * 86400000));
    to = endOfDay(now); label = "آخر 7 أيام";
  } else if (preset === "30d") {
    from = startOfDay(new Date(Date.now() - 29 * 86400000));
    to = endOfDay(now); label = "آخر 30 يوم";
  } else if (preset === "this_month") {
    from = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
    to = endOfDay(now); label = "هذا الشهر";
  } else if (preset === "custom" && customFrom && customTo) {
    from = startOfDay(new Date(customFrom));
    to = endOfDay(new Date(customTo));
    label = `${customFrom} → ${customTo}`;
  }
  return { preset, from, to, fromIso: from.toISOString(), toIso: to.toISOString(), label };
}

export function useDateRange(initial: RangePreset = "7d") {
  const [sp, setSp] = useSearchParams();
  const urlPreset = (sp.get("preset") as RangePreset) || null;
  const urlFrom = sp.get("from") || "";
  const urlTo = sp.get("to") || "";
  const [preset, setPresetRaw] = useState<RangePreset>(urlPreset ?? initial);
  const [customFrom, setCustomFromRaw] = useState<string>(urlFrom);
  const [customTo, setCustomToRaw] = useState<string>(urlTo);

  // Persist to URL so drill-down navigation keeps context.
  useEffect(() => {
    const next = new URLSearchParams(sp);
    next.set("preset", preset);
    if (preset === "custom") {
      if (customFrom) next.set("from", customFrom); else next.delete("from");
      if (customTo) next.set("to", customTo); else next.delete("to");
    } else {
      next.delete("from"); next.delete("to");
    }
    setSp(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, customFrom, customTo]);

  const range = useMemo(
    () => buildRange(preset, customFrom, customTo),
    [preset, customFrom, customTo],
  );
  return {
    preset, setPreset: setPresetRaw,
    customFrom, setCustomFrom: setCustomFromRaw,
    customTo, setCustomTo: setCustomToRaw,
    range,
  };
}

/** Build a query-string fragment that preserves the active range when linking between reports. */
export function rangeToQuery(state: { preset: RangePreset; customFrom: string; customTo: string }): string {
  const p = new URLSearchParams();
  p.set("preset", state.preset);
  if (state.preset === "custom") {
    if (state.customFrom) p.set("from", state.customFrom);
    if (state.customTo) p.set("to", state.customTo);
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

const PRESETS: { value: RangePreset; label: string }[] = [
  { value: "today", label: "اليوم" },
  { value: "7d", label: "7 أيام" },
  { value: "30d", label: "30 يوم" },
  { value: "this_month", label: "هذا الشهر" },
  { value: "custom", label: "مخصص" },
];

export function DateRangeFilter({
  state,
}: { state: ReturnType<typeof useDateRange> }) {
  const { preset, setPreset, customFrom, setCustomFrom, customTo, setCustomTo } = state;
  return (
    <div className="rounded-xl border border-border bg-card p-3 flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPreset(p.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-bold border transition-colors",
              preset === p.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-secondary",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      {preset === "custom" && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="h-8 w-[140px] text-xs"
          />
          <span className="text-xs text-muted-foreground">إلى</span>
          <Input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="h-8 w-[140px] text-xs"
          />
        </div>
      )}
      <div className="ms-auto text-[0.7rem] text-muted-foreground">
        النطاق المختار: <span className="font-bold text-foreground">{state.range.label}</span>
      </div>
    </div>
  );
}

const SOURCE_META: Record<string, { label: string; icon: LucideIcon; tone: string }> = {
  ga4:   { label: "GA4",        icon: Globe,      tone: "bg-orange-500/10 text-orange-600 border-orange-500/30" },
  db:    { label: "قاعدة البيانات", icon: Database,   tone: "bg-primary/10 text-primary border-primary/30" },
  utm:   { label: "UTM",         icon: Megaphone,  tone: "bg-violet-500/10 text-violet-600 border-violet-500/30" },
  audit: { label: "سجل التدقيق", icon: ListChecks, tone: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  edge:  { label: "Edge Logs",   icon: Activity,   tone: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
};

export function SourceBadge({ source }: { source: keyof typeof SOURCE_META }) {
  const m = SOURCE_META[source];
  if (!m) return null;
  const Icon = m.icon;
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem] font-bold",
      m.tone,
    )}>
      <Icon className="w-3 h-3" />
      المصدر: {m.label}
    </span>
  );
}

export function RankTable({
  rows, max, valueLabel = "العدد", emptyHint,
}: {
  rows: { key: string; label: string; value: number; href?: string }[];
  max?: number;
  valueLabel?: string;
  emptyHint?: string;
}) {
  if (!rows.length) {
    return (
      <div className="text-center text-sm text-muted-foreground py-8">
        {emptyHint || "لا توجد بيانات في النطاق المحدد."}
      </div>
    );
  }
  const m = max ?? Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="divide-y divide-border">
      {rows.map((r) => {
        const pct = Math.round((r.value / m) * 100);
        const Inner = (
          <div className="py-2.5 px-2 -mx-2 rounded-md hover:bg-secondary/40 transition-colors">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-sm font-bold text-foreground truncate">{r.label}</span>
              <span className="text-xs font-mono text-muted-foreground shrink-0">
                {r.value.toLocaleString("ar-EG")} <span className="text-[0.6rem]">{valueLabel}</span>
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
        return (
          <li key={r.key}>
            {r.href ? <Link to={r.href}>{Inner}</Link> : Inner}
          </li>
        );
      })}
    </ul>
  );
}

export function ReportShell({
  title, subtitle, children, actions, source,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  source?: keyof typeof SOURCE_META | (keyof typeof SOURCE_META)[];
}) {
  const sources = Array.isArray(source) ? source : source ? [source] : [];
  return (
    <AdminShell>
      <div className="report-print-root p-4 md:p-6 max-w-[1400px] mx-auto space-y-5">
        <div>
          <Link to="/admin" className="no-print inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2">
            <ArrowRight className="w-3 h-3" /> العودة إلى لوحة التحكم
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
              {sources.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {sources.map((s) => <SourceBadge key={s} source={s} />)}
                </div>
              )}
            </div>
            {actions && <div className="no-print flex items-center gap-2">{actions}</div>}
          </div>
        </div>
        {children}
      </div>
    </AdminShell>
  );
}

/** CSV export + print actions for a report page. Pass into ReportShell `actions`. */
export function ExportActions<T>({
  filename, rows, columns,
}: { filename: string; rows: T[]; columns: CsvColumn<T>[] }) {
  return (
    <>
      <Button
        variant="outline" size="sm" className="gap-1"
        onClick={() => downloadCsv(filename, rows, columns)}
        disabled={!rows.length}
      >
        <Download className="w-4 h-4" /> تصدير CSV
      </Button>
      <Button
        variant="outline" size="sm" className="gap-1"
        onClick={() => window.print()}
      >
        <Printer className="w-4 h-4" /> طباعة / PDF
      </Button>
    </>
  );
}

/** Convert a day-bucketed dataset for a given range. Returns ordered points. */
export function buildDailyBuckets(range: DateRange): { date: string; label: string }[] {
  const days = Math.max(1, Math.round((+range.to - +range.from) / 86400000) + 1);
  const out: { date: string; label: string }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(range.from); d.setDate(d.getDate() + i);
    out.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("ar-EG", { day: "numeric", month: "short" }),
    });
  }
  return out;
}

/** Generic small KPI tile for report headers */
export function ReportKpi({
  label, value, hint, tone = "neutral",
}: { label: string; value: React.ReactNode; hint?: string; tone?: "neutral" | "success" | "warning" | "danger" | "info" }) {
  const toneClass = {
    neutral: "bg-secondary text-foreground",
    success: "bg-emerald-500/10 text-emerald-700",
    warning: "bg-amber-500/10 text-amber-700",
    danger: "bg-red-500/10 text-red-700",
    info: "bg-primary/10 text-primary",
  }[tone];
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-[0.72rem] font-bold text-muted-foreground">{label}</div>
      <div className={cn("inline-block mt-1 rounded-md px-2 py-0.5 text-2xl font-bold leading-tight", toneClass)}>{value}</div>
      {hint && <div className="text-[0.7rem] text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}
