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
import { Users } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

type Lead = {
  id: string; lead_type: string; full_name: string; company: string | null;
  phone: string | null; email: string | null; message: string | null;
  metadata: any; created_at: string;
};

export default function AdminReportLeads() {
  const { loading: authLoading, user, canManageContent, isAdmin } = useRequireContentAccess();
  const ds = useDateRange("7d");
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stores, setStores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user || !canManageContent || !isAdmin) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [l, s] = await Promise.all([
        supabase.from("leads").select("id, lead_type, full_name, company, phone, email, message, metadata, created_at")
          .gte("created_at", ds.range.fromIso).lte("created_at", ds.range.toIso)
          .order("created_at", { ascending: false }).limit(1000),
        supabase.from("stores").select("id, name_ar").limit(500),
      ]);
      if (cancelled) return;
      setLeads((l.data ?? []) as Lead[]);
      const sm: Record<string, string> = {}; ((s.data ?? []) as any[]).forEach(r => { sm[r.id] = r.name_ar; });
      setStores(sm);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, canManageContent, isAdmin, ds.range.fromIso, ds.range.toIso]);

  if (authLoading) return <div className="min-h-screen grid place-items-center text-muted-foreground">جاري التحميل...</div>;
  if (!user || !canManageContent) return null;
  if (!isAdmin) {
    return (
      <ReportShell title="تقرير العملاء المحتملين">
        <AdminEmptyState icon={Users} title="هذا التقرير مخصص للمسؤولين فقط" />
      </ReportShell>
    );
  }

  const total = leads.length;
  const byType: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  const byStore: Record<string, number> = {};
  leads.forEach((l) => {
    byType[l.lead_type] = (byType[l.lead_type] || 0) + 1;
    const src = (l.metadata?.utm_source || l.metadata?.source || "مباشر").toString().slice(0, 32);
    bySource[src] = (bySource[src] || 0) + 1;
    if (l.metadata?.store_id) byStore[l.metadata.store_id] = (byStore[l.metadata.store_id] || 0) + 1;
  });
  const toRanked = (m: Record<string, number>, map?: Record<string, string>, hrefFn?: (k: string) => string) =>
    Object.entries(m).map(([k, v]) => ({
      key: k, label: map?.[k] || k, value: v, href: hrefFn?.(k),
    })).sort((a, b) => b.value - a.value).slice(0, 10);

  // daily buckets
  const buckets = buildDailyBuckets(ds.range);
  const map: Record<string, { leads: number; label: string }> = {};
  buckets.forEach((b) => { map[b.date] = { leads: 0, label: b.label }; });
  leads.forEach((l) => { const k = l.created_at.slice(0, 10); if (map[k]) map[k].leads += 1; });
  const series = buckets.map((b) => ({ ...map[b.date] }));

  return (
    <ReportShell
      title="تقرير العملاء المحتملين"
      subtitle="رسائل وعملاء من نماذج التأجير والتواصل والسوق، مع تقسيم النوع والمصدر والمحل."
      source={["db", "utm"]}
    >
      <DateRangeFilter state={ds} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ReportKpi label="إجمالي العملاء" value={loading ? "…" : total.toLocaleString("ar-EG")} tone="info" hint={ds.range.label} />
        <ReportKpi label="رسائل تأجير" value={loading ? "…" : (byType["leasing"] || 0).toLocaleString("ar-EG")} tone="success" />
        <ReportKpi label="رسائل سوق" value={loading ? "…" : (byType["marketplace"] || byType["join"] || 0).toLocaleString("ar-EG")} tone="warning" />
        <ReportKpi label="رسائل تواصل" value={loading ? "…" : (byType["contact"] || 0).toLocaleString("ar-EG")} tone="neutral" />
      </div>

      <AdminSectionCard title="العملاء يومياً">
        {loading ? (
          <Skeleton className="h-56 w-full" />
        ) : series.every((s) => s.leads === 0) ? (
          <AdminEmptyState icon={Users} title="لا توجد رسائل في هذا النطاق" />
        ) : (
          <div className="h-56 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="leads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </AdminSectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AdminSectionCard title="حسب النوع"><RankTable rows={toRanked(byType)} valueLabel="رسالة" /></AdminSectionCard>
        <AdminSectionCard title="حسب المصدر"><RankTable rows={toRanked(bySource)} valueLabel="رسالة" /></AdminSectionCard>
        <AdminSectionCard title="حسب المحل"><RankTable rows={toRanked(byStore, stores, (k) => `/admin/stores/${k}`)} valueLabel="رسالة" emptyHint="لم تُربط رسائل بمحل." /></AdminSectionCard>
      </div>

      <AdminSectionCard
        title="آخر الرسائل"
        action={<Link to="/admin/leads" className="text-xs font-bold text-primary hover:underline">الكل ←</Link>}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>المصدر</TableHead>
                <TableHead>التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.slice(0, 25).map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-bold text-foreground">{l.full_name}</TableCell>
                  <TableCell className="text-xs">{l.lead_type}</TableCell>
                  <TableCell className="text-xs font-mono">{l.phone || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{l.metadata?.utm_source || l.metadata?.source || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" })}</TableCell>
                </TableRow>
              ))}
              {leads.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">لا توجد رسائل في النطاق المحدد.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </AdminSectionCard>
    </ReportShell>
  );
}
