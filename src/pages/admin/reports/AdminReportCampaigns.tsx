import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireContentAccess } from "@/hooks/useAuth";
import { AdminSectionCard } from "@/components/admin/AdminPrimitives";
import {
  ReportShell, DateRangeFilter, useDateRange, RankTable, ReportKpi,
} from "@/components/admin/AdminReports";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QrCode } from "lucide-react";

type LeadRow = { created_at: string; metadata: any };
type SpinRow = { created_at: string; utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; utm_content: string | null };
type QrRow = { id: string; name_ar: string; slug: string; utm_source: string; utm_medium: string; utm_campaign: string; scan_count: number; lead_count: number; is_active: boolean };

export default function AdminReportCampaigns() {
  const { loading: authLoading, user, canManageContent, isAdmin } = useRequireContentAccess();
  const ds = useDateRange("30d");
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [spins, setSpins] = useState<SpinRow[]>([]);
  const [qrs, setQrs] = useState<QrRow[]>([]);

  useEffect(() => {
    if (!user || !canManageContent) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [l, s, q] = await Promise.all([
        supabase.from("leads").select("created_at, metadata")
          .gte("created_at", ds.range.fromIso).lte("created_at", ds.range.toIso).limit(2000),
        isAdmin
          ? supabase.from("spin_sessions").select("created_at, utm_source, utm_medium, utm_campaign, utm_content")
              .gte("created_at", ds.range.fromIso).lte("created_at", ds.range.toIso).limit(2000)
          : Promise.resolve({ data: [] as any[] }),
        supabase.from("qr_campaigns").select("id, name_ar, slug, utm_source, utm_medium, utm_campaign, scan_count, lead_count, is_active")
          .order("scan_count", { ascending: false }).limit(50),
      ]);
      if (cancelled) return;
      setLeads((l.data ?? []) as LeadRow[]);
      setSpins((s.data ?? []) as SpinRow[]);
      setQrs((q.data ?? []) as QrRow[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, canManageContent, isAdmin, ds.range.fromIso, ds.range.toIso]);

  if (authLoading) return <div className="min-h-screen grid place-items-center text-muted-foreground">جاري التحميل...</div>;
  if (!user || !canManageContent) return null;

  const campMap: Record<string, number> = {};
  const contentMap: Record<string, number> = {};
  const sourceMediumMap: Record<string, number> = {};
  leads.forEach((l) => {
    const m: any = l.metadata || {};
    if (m.utm_campaign) campMap[String(m.utm_campaign)] = (campMap[String(m.utm_campaign)] || 0) + 1;
    if (m.utm_content) contentMap[String(m.utm_content)] = (contentMap[String(m.utm_content)] || 0) + 1;
    const sm = `${m.utm_source || "—"} / ${m.utm_medium || "—"}`;
    sourceMediumMap[sm] = (sourceMediumMap[sm] || 0) + 1;
  });
  spins.forEach((s) => {
    if (s.utm_campaign) campMap[s.utm_campaign] = (campMap[s.utm_campaign] || 0) + 1;
    if (s.utm_content) contentMap[s.utm_content] = (contentMap[s.utm_content] || 0) + 1;
    const sm = `${s.utm_source || "—"} / ${s.utm_medium || "—"}`;
    sourceMediumMap[sm] = (sourceMediumMap[sm] || 0) + 1;
  });
  const toRanked = (m: Record<string, number>) =>
    Object.entries(m).map(([k, v]) => ({ key: k, label: k, value: v })).sort((a, b) => b.value - a.value).slice(0, 12);

  const totalConv = leads.length + spins.length;
  const namedShare = totalConv > 0 ? Math.round((Object.values(campMap).reduce((a, b) => a + b, 0) / totalConv) * 100) : 0;
  const totalScans = qrs.reduce((s, q) => s + (q.scan_count || 0), 0);
  const totalQrLeads = qrs.reduce((s, q) => s + (q.lead_count || 0), 0);

  return (
    <ReportShell
      title="تقرير الحملات والـ UTM"
      subtitle="أداء الحملات المُعلَّمة بـ UTM من قاعدة البيانات، مع جدول حملات QR والمقارنة بين المصدر والوسيط."
      source={["db", "utm"]}
      actions={
        <Link to="/admin/qr-campaigns"><Button variant="outline" size="sm" className="gap-1"><QrCode className="w-4 h-4" /> إدارة QR</Button></Link>
      }
    >
      <DateRangeFilter state={ds} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ReportKpi label="إجمالي التحويلات" value={loading ? "…" : totalConv.toLocaleString("ar-EG")} tone="info" hint={ds.range.label} />
        <ReportKpi label="تحويلات بحملة مُعلَّمة" value={loading ? "…" : `${namedShare}%`} tone="success" hint="من إجمالي التحويلات" />
        <ReportKpi label="إجمالي مسح QR" value={loading ? "…" : totalScans.toLocaleString("ar-EG")} tone="warning" hint="جميع الحملات" />
        <ReportKpi label="عملاء من QR" value={loading ? "…" : totalQrLeads.toLocaleString("ar-EG")} tone="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AdminSectionCard title="أفضل الحملات (utm_campaign)">
          {loading ? <Skeleton className="h-40" /> : <RankTable rows={toRanked(campMap)} valueLabel="تحويل" emptyHint="أضف utm_campaign في الروابط." />}
        </AdminSectionCard>
        <AdminSectionCard title="أفضل المحتوى (utm_content)">
          {loading ? <Skeleton className="h-40" /> : <RankTable rows={toRanked(contentMap)} valueLabel="تحويل" />}
        </AdminSectionCard>
        <AdminSectionCard title="مزيج المصدر / الوسيط">
          {loading ? <Skeleton className="h-40" /> : <RankTable rows={toRanked(sourceMediumMap)} valueLabel="تحويل" />}
        </AdminSectionCard>
      </div>

      <AdminSectionCard title="حملات QR — الأداء الكامل">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الحملة</TableHead>
                <TableHead>UTM</TableHead>
                <TableHead className="text-end">مسح</TableHead>
                <TableHead className="text-end">عملاء</TableHead>
                <TableHead className="text-end">معدل التحويل</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qrs.map((q) => {
                const cr = q.scan_count > 0 ? Math.round((q.lead_count / q.scan_count) * 100) : 0;
                return (
                  <TableRow key={q.id}>
                    <TableCell className="font-bold text-foreground">{q.name_ar}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{q.utm_source}/{q.utm_medium}/{q.utm_campaign}</TableCell>
                    <TableCell className="text-end font-mono">{q.scan_count}</TableCell>
                    <TableCell className="text-end font-mono">{q.lead_count}</TableCell>
                    <TableCell className="text-end font-mono">{cr}%</TableCell>
                    <TableCell>
                      <span className={`text-xs font-bold ${q.is_active ? "text-emerald-600" : "text-muted-foreground"}`}>
                        {q.is_active ? "نشطة" : "موقوفة"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
              {qrs.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">لا توجد حملات QR.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </AdminSectionCard>
    </ReportShell>
  );
}
