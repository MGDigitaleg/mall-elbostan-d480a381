import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRequireContentAccess } from "@/hooks/useAuth";
import { AdminSectionCard, AdminEmptyState } from "@/components/admin/AdminPrimitives";
import {
  ReportShell, DateRangeFilter, useDateRange, RankTable, ReportKpi, buildDailyBuckets,
} from "@/components/admin/AdminReports";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

type Row = { created_at: string; metadata?: Record<string, unknown> | null };

export default function AdminReportTraffic() {
  const { loading: authLoading, user, canManageContent, isAdmin } = useRequireContentAccess();
  const ds = useDateRange("7d");
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Row[]>([]);
  const [spins, setSpins] = useState<Row[]>([]);

  useEffect(() => {
    if (!user || !canManageContent) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [l, s] = await Promise.all([
        supabase.from("leads").select("created_at, metadata")
          .gte("created_at", ds.range.fromIso).lte("created_at", ds.range.toIso).limit(1000),
        isAdmin
          ? supabase.from("spin_sessions").select("created_at, utm_source, utm_medium, utm_campaign")
              .gte("created_at", ds.range.fromIso).lte("created_at", ds.range.toIso).limit(1000)
          : Promise.resolve({ data: [] as any[] }),
      ]);
      if (cancelled) return;
      setLeads(((l.data ?? []) as Row[]));
      setSpins(((s.data ?? []) as any[]));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, canManageContent, isAdmin, ds.range.fromIso, ds.range.toIso]);

  if (authLoading) return <div className="min-h-screen grid place-items-center text-muted-foreground">جاري التحميل...</div>;
  if (!user || !canManageContent) return null;

  // daily buckets
  const buckets = buildDailyBuckets(ds.range);
  const map: Record<string, { leads: number; spins: number; label: string }> = {};
  buckets.forEach((b) => { map[b.date] = { leads: 0, spins: 0, label: b.label }; });
  leads.forEach((r) => { const k = r.created_at.slice(0, 10); if (map[k]) map[k].leads += 1; });
  spins.forEach((r: any) => { const k = (r.created_at as string).slice(0, 10); if (map[k]) map[k].spins += 1; });
  const series = buckets.map((b) => ({ ...map[b.date], date: b.date }));

  // source breakdown from leads.metadata + spin_sessions.utm_source
  const sourceMap: Record<string, number> = {};
  const mediumMap: Record<string, number> = {};
  const refMap: Record<string, number> = {};
  leads.forEach((l) => {
    const m: any = l.metadata || {};
    const src = (m.utm_source || m.source || "مباشر").toString().slice(0, 32);
    sourceMap[src] = (sourceMap[src] || 0) + 1;
    if (m.utm_medium) mediumMap[String(m.utm_medium)] = (mediumMap[String(m.utm_medium)] || 0) + 1;
    if (m.referrer) {
      try { const u = new URL(String(m.referrer)); refMap[u.hostname] = (refMap[u.hostname] || 0) + 1; } catch { /* */ }
    }
  });
  spins.forEach((s: any) => {
    const src = (s.utm_source || "مباشر").toString().slice(0, 32);
    sourceMap[src] = (sourceMap[src] || 0) + 1;
    if (s.utm_medium) mediumMap[String(s.utm_medium)] = (mediumMap[String(s.utm_medium)] || 0) + 1;
  });
  const toRanked = (m: Record<string, number>) =>
    Object.entries(m).map(([k, v]) => ({ key: k, label: k, value: v })).sort((a, b) => b.value - a.value).slice(0, 10);

  const totalLeads = leads.length;
  const totalSpins = spins.length;
  const totalConv = totalLeads + totalSpins;
  const directShare = Math.round(((sourceMap["مباشر"] || 0) / Math.max(1, totalConv)) * 100);

  return (
    <ReportShell
      title="تقرير حركة الزيارات"
      subtitle="مصادر التحويلات الفعلية من تسجيلات أدر واربح ونماذج العملاء (UTM + referrer). للمقاييس الكاملة للزوار افتح Google Analytics."
      source={["db", "utm", "ga4"]}
      actions={
        <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-4 h-4" /> فتح GA4</Button>
        </a>
      }
    >
      <DateRangeFilter state={ds} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ReportKpi label="إجمالي التحويلات" value={loading ? "…" : totalConv.toLocaleString("ar-EG")} tone="info" hint={ds.range.label} />
        <ReportKpi label="عملاء محتملون" value={loading ? "…" : totalLeads.toLocaleString("ar-EG")} tone="success" />
        {isAdmin && <ReportKpi label="تسجيلات أدر واربح" value={loading ? "…" : totalSpins.toLocaleString("ar-EG")} tone="warning" />}
        <ReportKpi label="نسبة الزيارات المباشرة" value={loading ? "…" : `${directShare}%`} tone="neutral" hint="بدون UTM" />
      </div>

      <AdminSectionCard title="حركة التحويلات اليومية">
        {loading ? (
          <Skeleton className="h-56 w-full" />
        ) : series.every((s) => s.leads === 0 && s.spins === 0) ? (
          <AdminEmptyState icon={Globe} title="لا توجد تحويلات في هذا النطاق" />
        ) : (
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="tL" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(38 92% 50%)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="leads" name="عملاء" stroke="hsl(var(--primary))" fill="url(#tL)" strokeWidth={2} />
                {isAdmin && <Area type="monotone" dataKey="spins" name="أدر واربح" stroke="hsl(38 92% 50%)" fill="url(#tS)" strokeWidth={2} />}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </AdminSectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AdminSectionCard title="أعلى المصادر (utm_source)">
          {loading ? <Skeleton className="h-40" /> : <RankTable rows={toRanked(sourceMap)} valueLabel="تحويل" />}
        </AdminSectionCard>
        <AdminSectionCard title="أعلى الوسائط (utm_medium)">
          {loading ? <Skeleton className="h-40" /> : <RankTable rows={toRanked(mediumMap)} valueLabel="تحويل" emptyHint="أضف utm_medium في روابطك." />}
        </AdminSectionCard>
        <AdminSectionCard title="أعلى المُحيلين (referrer)">
          {loading ? <Skeleton className="h-40" /> : <RankTable rows={toRanked(refMap)} valueLabel="تحويل" emptyHint="لا توجد إحالات مسجلة من العملاء." />}
        </AdminSectionCard>
      </div>
    </ReportShell>
  );
}
