import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireContentAccess } from "@/hooks/useAuth";
import { AdminSectionCard } from "@/components/admin/AdminPrimitives";
import {
  ReportShell, DateRangeFilter, useDateRange, RankTable, ReportKpi, ExportActions,
} from "@/components/admin/AdminReports";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Deal = {
  id: string; title_ar: string; is_live: boolean; featured: boolean; verified: boolean;
  store_id: string | null; valid_to: string | null; valid_from: string | null;
  price_current: number | null; price_old: number | null; created_at: string;
};

const daysUntil = (iso: string | null) => iso ? Math.ceil((+new Date(iso) - Date.now()) / 86400000) : null;

export default function AdminReportOffers() {
  const { loading: authLoading, user, canManageContent } = useRequireContentAccess();
  const ds = useDateRange("30d");
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stores, setStores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user || !canManageContent) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [d, s] = await Promise.all([
        supabase.from("deals")
          .select("id, title_ar, is_live, featured, verified, store_id, valid_to, valid_from, price_current, price_old, created_at")
          .order("created_at", { ascending: false }).limit(1000),
        supabase.from("stores").select("id, name_ar").limit(500),
      ]);
      if (cancelled) return;
      setDeals((d.data ?? []) as Deal[]);
      const sm: Record<string, string> = {}; ((s.data ?? []) as any[]).forEach(r => { sm[r.id] = r.name_ar; });
      setStores(sm);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, canManageContent, ds.range.fromIso]);

  if (authLoading) return <div className="min-h-screen grid place-items-center text-muted-foreground">جاري التحميل...</div>;
  if (!user || !canManageContent) return null;

  const total = deals.length;
  const live = deals.filter(d => d.is_live).length;
  const draft = deals.filter(d => !d.is_live).length;
  const featured = deals.filter(d => d.featured && d.is_live).length;
  const expiringSoon = deals.filter(d => d.is_live && d.valid_to && (daysUntil(d.valid_to) ?? 99) <= 7 && (daysUntil(d.valid_to) ?? -1) >= 0).length;
  const expired = deals.filter(d => d.valid_to && +new Date(d.valid_to) < Date.now()).length;
  const inRange = deals.filter(d => d.created_at >= ds.range.fromIso && d.created_at <= ds.range.toIso).length;

  const byStore: Record<string, number> = {};
  deals.filter(d => d.is_live).forEach(d => { if (d.store_id) byStore[d.store_id] = (byStore[d.store_id] || 0) + 1; });
  const topStores = Object.entries(byStore).map(([k, v]) => ({ key: k, label: stores[k] || k.slice(0, 8), value: v, href: `/admin/stores/${k}` }))
    .sort((a, b) => b.value - a.value).slice(0, 10);

  // Top discount
  const withDiscount = deals.filter(d => d.is_live && d.price_old && d.price_current && d.price_old > d.price_current)
    .map(d => ({ ...d, pct: Math.round(((d.price_old! - d.price_current!) / d.price_old!) * 100) }))
    .sort((a, b) => b.pct - a.pct).slice(0, 10);
  const topDiscount = withDiscount.map(d => ({ key: d.id, label: d.title_ar, value: d.pct }));

  const upcoming = deals.filter(d => d.is_live && d.valid_to).sort((a, b) => +new Date(a.valid_to!) - +new Date(b.valid_to!)).slice(0, 20);

  return (
    <ReportShell
      title="تقرير أداء العروض"
      subtitle="حالة العروض الحية، العروض القريبة من الانتهاء، أعلى المحلات نشاطاً، وأعلى نسب الخصم."
      source={["db"]}
    >
      <DateRangeFilter state={ds} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <ReportKpi label="إجمالي" value={total} tone="info" />
        <ReportKpi label="حية" value={live} tone="success" />
        <ReportKpi label="مسودة" value={draft} tone="warning" />
        <ReportKpi label="مميّزة" value={featured} tone="info" />
        <ReportKpi label="تنتهي خلال 7 أيام" value={expiringSoon} tone={expiringSoon > 0 ? "warning" : "neutral"} />
        <ReportKpi label="منتهية" value={expired} tone={expired > 0 ? "danger" : "neutral"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AdminSectionCard title="أعلى المحلات في العروض الحية">
          {loading ? <Skeleton className="h-40" /> : <RankTable rows={topStores} valueLabel="عرض" />}
        </AdminSectionCard>
        <AdminSectionCard title="أعلى نسب الخصم (حية)">
          {loading ? <Skeleton className="h-40" /> : <RankTable rows={topDiscount} valueLabel="%" emptyHint="لا توجد عروض بأسعار مقارنة." />}
        </AdminSectionCard>
      </div>

      <AdminSectionCard title="العروض القادمة للانتهاء">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العرض</TableHead>
                <TableHead>المحل</TableHead>
                <TableHead className="text-end">السعر الحالي</TableHead>
                <TableHead className="text-end">السعر القديم</TableHead>
                <TableHead>تاريخ الانتهاء</TableHead>
                <TableHead className="text-end">متبقي</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcoming.map((d) => {
                const days = daysUntil(d.valid_to);
                return (
                  <TableRow key={d.id}>
                    <TableCell>
                      <Link to="/admin/offers" className="font-bold text-foreground hover:text-primary">{d.title_ar}</Link>
                    </TableCell>
                    <TableCell className="text-xs">{d.store_id ? stores[d.store_id] || "—" : "—"}</TableCell>
                    <TableCell className="text-end font-mono">{d.price_current ?? "—"}</TableCell>
                    <TableCell className="text-end font-mono text-muted-foreground line-through">{d.price_old ?? "—"}</TableCell>
                    <TableCell className="text-xs">{d.valid_to ? new Date(d.valid_to).toLocaleDateString("ar-EG") : "—"}</TableCell>
                    <TableCell className={`text-end font-bold text-xs ${days !== null && days <= 1 ? "text-red-600" : days !== null && days <= 3 ? "text-amber-600" : "text-emerald-600"}`}>
                      {days !== null ? (days <= 0 ? "اليوم" : `${days} يوم`) : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
              {upcoming.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">لا توجد عروض جارية بتاريخ انتهاء.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </AdminSectionCard>
    </ReportShell>
  );
}
