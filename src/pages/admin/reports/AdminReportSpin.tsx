import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireContentAccess } from "@/hooks/useAuth";
import { AdminSectionCard, AdminEmptyState } from "@/components/admin/AdminPrimitives";
import {
  ReportShell, DateRangeFilter, useDateRange, RankTable, ReportKpi, buildDailyBuckets,
} from "@/components/admin/AdminReports";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sparkles } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

type Spin = {
  id: string; full_name: string; phone: string;
  claim_status: string; prize_id: string | null; prize_type: string | null;
  competition_store_id: string | null;
  utm_source: string | null; utm_medium: string | null; utm_campaign: string | null;
  visitor_verified: boolean; created_at: string;
};

export default function AdminReportSpin() {
  const { loading: authLoading, user, canManageContent, isAdmin } = useRequireContentAccess();
  const ds = useDateRange("7d");
  const [loading, setLoading] = useState(true);
  const [spins, setSpins] = useState<Spin[]>([]);

  useEffect(() => {
    if (!user || !canManageContent || !isAdmin) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data } = await supabase.from("spin_sessions")
        .select("id, full_name, phone, claim_status, prize_id, prize_type, competition_store_id, utm_source, utm_medium, utm_campaign, visitor_verified, created_at")
        .gte("created_at", ds.range.fromIso).lte("created_at", ds.range.toIso)
        .order("created_at", { ascending: false }).limit(2000);
      if (cancelled) return;
      setSpins((data ?? []) as Spin[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, canManageContent, isAdmin, ds.range.fromIso, ds.range.toIso]);

  if (authLoading) return <div className="min-h-screen grid place-items-center text-muted-foreground">جاري التحميل...</div>;
  if (!user || !canManageContent) return null;
  if (!isAdmin) {
    return (
      <ReportShell title="تقرير أدر واربح">
        <AdminEmptyState icon={Sparkles} title="هذا التقرير مخصص للمسؤولين فقط" />
      </ReportShell>
    );
  }

  const total = spins.length;
  const winners = spins.filter(s => s.prize_id).length;
  const claimed = spins.filter(s => s.claim_status === "claimed" || s.claim_status === "redeemed").length;
  const verified = spins.filter(s => s.visitor_verified).length;
  const winRate = total > 0 ? Math.round((winners / total) * 100) : 0;
  const claimRate = winners > 0 ? Math.round((claimed / winners) * 100) : 0;

  // daily series
  const buckets = buildDailyBuckets(ds.range);
  const map: Record<string, { date: string; label: string; spins: number; wins: number }> = {};
  buckets.forEach((b) => { map[b.date] = { date: b.date, label: b.label, spins: 0, wins: 0 }; });
  spins.forEach((s) => {
    const k = s.created_at.slice(0, 10);
    if (map[k]) { map[k].spins += 1; if (s.prize_id) map[k].wins += 1; }
  });
  const series = buckets.map((b) => map[b.date]);

  const bySource: Record<string, number> = {};
  const byCampaign: Record<string, number> = {};
  const byPrizeType: Record<string, number> = {};
  spins.forEach((s) => {
    bySource[s.utm_source || "مباشر"] = (bySource[s.utm_source || "مباشر"] || 0) + 1;
    if (s.utm_campaign) byCampaign[s.utm_campaign] = (byCampaign[s.utm_campaign] || 0) + 1;
    if (s.prize_type) byPrizeType[s.prize_type] = (byPrizeType[s.prize_type] || 0) + 1;
  });
  const toRanked = (m: Record<string, number>) =>
    Object.entries(m).map(([k, v]) => ({ key: k, label: k, value: v })).sort((a, b) => b.value - a.value).slice(0, 10);

  return (
    <ReportShell
      title="تقرير أداء أدر واربح"
      subtitle="التسجيلات، الفائزون، نسبة الاستلام، ومصادر الحملة (UTM)."
      source={["db", "utm"]}
    >
      <DateRangeFilter state={ds} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <ReportKpi label="إجمالي التسجيلات" value={loading ? "…" : total.toLocaleString("ar-EG")} tone="info" />
        <ReportKpi label="فائزون" value={loading ? "…" : winners.toLocaleString("ar-EG")} tone="success" />
        <ReportKpi label="استلموا الجائزة" value={loading ? "…" : claimed.toLocaleString("ar-EG")} tone="warning" />
        <ReportKpi label="نسبة الفوز" value={loading ? "…" : `${winRate}%`} tone="neutral" />
        <ReportKpi label="نسبة الاستلام" value={loading ? "…" : `${claimRate}%`} tone="neutral" />
        <ReportKpi label="زوار موثوقون" value={loading ? "…" : verified.toLocaleString("ar-EG")} tone="info" />
      </div>

      <AdminSectionCard title="التسجيلات والفائزون يومياً">
        {loading ? (
          <Skeleton className="h-56 w-full" />
        ) : series.every((s) => s.spins === 0) ? (
          <AdminEmptyState icon={Sparkles} title="لا توجد تسجيلات في هذا النطاق" />
        ) : (
          <div className="h-56 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="sp1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(38 92% 50%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sp2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="spins" name="تسجيلات" stroke="hsl(38 92% 50%)" fill="url(#sp1)" strokeWidth={2} />
                <Area type="monotone" dataKey="wins" name="فائزون" stroke="hsl(var(--primary))" fill="url(#sp2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </AdminSectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AdminSectionCard title="حسب المصدر"><RankTable rows={toRanked(bySource)} valueLabel="تسجيل" /></AdminSectionCard>
        <AdminSectionCard title="حسب الحملة"><RankTable rows={toRanked(byCampaign)} valueLabel="تسجيل" /></AdminSectionCard>
        <AdminSectionCard title="حسب نوع الجائزة"><RankTable rows={toRanked(byPrizeType)} valueLabel="فائز" /></AdminSectionCard>
      </div>

      <AdminSectionCard
        title="آخر التسجيلات"
        action={<Link to="/admin/spin-winners" className="text-xs font-bold text-primary hover:underline">الفائزون ←</Link>}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الجائزة</TableHead>
                <TableHead>المصدر</TableHead>
                <TableHead>التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spins.slice(0, 30).map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-bold text-foreground">{s.full_name}</TableCell>
                  <TableCell className="text-xs font-mono">{s.phone}</TableCell>
                  <TableCell className="text-xs">{s.claim_status}</TableCell>
                  <TableCell className="text-xs">{s.prize_type || (s.prize_id ? "✓" : "—")}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.utm_source || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" })}</TableCell>
                </TableRow>
              ))}
              {spins.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">لا توجد تسجيلات.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </AdminSectionCard>
    </ReportShell>
  );
}
