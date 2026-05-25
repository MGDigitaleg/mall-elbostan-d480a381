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

type Store = { id: string; name_ar: string; slug: string; lifecycle_status: string | null; sync_status: string | null; external_store_type: string | null; logo_url: string | null };
type Lead = { metadata: any; created_at: string };

export default function AdminReportStores() {
  const { loading: authLoading, user, canManageContent } = useRequireContentAccess();
  const ds = useDateRange("30d");
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<{ store_id: string | null; status: string }[]>([]);
  const [deals, setDeals] = useState<{ store_id: string | null; is_live: boolean }[]>([]);

  useEffect(() => {
    if (!user || !canManageContent) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [s, l, p, d] = await Promise.all([
        supabase.from("stores").select("id, name_ar, slug, lifecycle_status, sync_status, external_store_type, logo_url").limit(500),
        supabase.from("leads").select("metadata, created_at")
          .gte("created_at", ds.range.fromIso).lte("created_at", ds.range.toIso).limit(2000),
        supabase.from("products").select("store_id, status").limit(2000),
        supabase.from("deals").select("store_id, is_live").limit(2000),
      ]);
      if (cancelled) return;
      setStores((s.data ?? []) as Store[]);
      setLeads((l.data ?? []) as Lead[]);
      setProducts((p.data ?? []) as any[]);
      setDeals((d.data ?? []) as any[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, canManageContent, ds.range.fromIso, ds.range.toIso]);

  if (authLoading) return <div className="min-h-screen grid place-items-center text-muted-foreground">جاري التحميل...</div>;
  if (!user || !canManageContent) return null;

  const leadByStore: Record<string, number> = {};
  leads.forEach((l) => { const sid = l.metadata?.store_id; if (sid) leadByStore[sid] = (leadByStore[sid] || 0) + 1; });
  const prodByStore: Record<string, number> = {};
  products.filter(p => p.status === "published").forEach((p) => { if (p.store_id) prodByStore[p.store_id] = (prodByStore[p.store_id] || 0) + 1; });
  const dealsByStore: Record<string, number> = {};
  deals.filter(d => d.is_live).forEach((d) => { if (d.store_id) dealsByStore[d.store_id] = (dealsByStore[d.store_id] || 0) + 1; });

  const enriched = stores.map((s) => ({
    ...s,
    leads: leadByStore[s.id] || 0,
    products: prodByStore[s.id] || 0,
    deals: dealsByStore[s.id] || 0,
  })).sort((a, b) => b.leads - a.leads);

  const active = stores.filter(s => s.lifecycle_status === "active").length;
  const opening = stores.filter(s => s.lifecycle_status === "opening_soon").length;
  const syncErr = stores.filter(s => s.sync_status === "error").length;
  const linked = stores.filter(s => s.external_store_type && s.external_store_type !== "none").length;

  const topLeads = enriched.slice(0, 10).map(s => ({ key: s.id, label: s.name_ar, value: s.leads, href: `/admin/stores/${s.id}` }));
  const topProducts = [...enriched].sort((a, b) => b.products - a.products).slice(0, 10).map(s => ({ key: s.id, label: s.name_ar, value: s.products, href: `/admin/stores/${s.id}` }));
  const topDeals = [...enriched].sort((a, b) => b.deals - a.deals).slice(0, 10).map(s => ({ key: s.id, label: s.name_ar, value: s.deals, href: `/admin/stores/${s.id}` }));

  return (
    <ReportShell
      title="تقرير أداء المحلات"
      subtitle="ترتيب المحلات حسب العملاء، المنتجات المنشورة، العروض الحية، وحالة المزامنة الخارجية."
      source={["db"]}
    >
      <DateRangeFilter state={ds} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ReportKpi label="إجمالي المحلات" value={stores.length} tone="info" />
        <ReportKpi label="نشط" value={active} tone="success" hint={`${opening} يُفتتح قريباً`} />
        <ReportKpi label="مربوط خارجياً" value={linked} tone="neutral" />
        <ReportKpi label="أخطاء مزامنة" value={syncErr} tone={syncErr > 0 ? "danger" : "success"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AdminSectionCard title="أعلى محلات تجذب العملاء">
          {loading ? <Skeleton className="h-40" /> : <RankTable rows={topLeads} valueLabel="عميل" emptyHint="لم تُربط أي رسائل بمحل بعد." />}
        </AdminSectionCard>
        <AdminSectionCard title="أعلى المحلات في عدد المنتجات">
          {loading ? <Skeleton className="h-40" /> : <RankTable rows={topProducts} valueLabel="منتج" />}
        </AdminSectionCard>
        <AdminSectionCard title="أعلى المحلات في العروض الحية">
          {loading ? <Skeleton className="h-40" /> : <RankTable rows={topDeals} valueLabel="عرض" />}
        </AdminSectionCard>
      </div>

      <AdminSectionCard title="الجدول الكامل">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المحل</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>ربط خارجي</TableHead>
                <TableHead>مزامنة</TableHead>
                <TableHead className="text-end">منتجات</TableHead>
                <TableHead className="text-end">عروض</TableHead>
                <TableHead className="text-end">عملاء ({ds.range.label})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enriched.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Link to={`/admin/stores/${s.id}`} className="font-bold text-foreground hover:text-primary">
                      {s.name_ar}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs">{s.lifecycle_status || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.external_store_type || "—"}</TableCell>
                  <TableCell className={`text-xs font-bold ${s.sync_status === "error" ? "text-red-600" : "text-muted-foreground"}`}>{s.sync_status || "—"}</TableCell>
                  <TableCell className="text-end font-mono">{s.products}</TableCell>
                  <TableCell className="text-end font-mono">{s.deals}</TableCell>
                  <TableCell className="text-end font-mono">{s.leads}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </AdminSectionCard>
    </ReportShell>
  );
}
