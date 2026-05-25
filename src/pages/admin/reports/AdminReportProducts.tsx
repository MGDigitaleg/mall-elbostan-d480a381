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

type Product = {
  id: string; name_ar: string; slug: string; status: string; featured: boolean;
  store_id: string | null; category_id: string | null; image_url: string | null;
  price: number | null; created_at: string;
};

export default function AdminReportProducts() {
  const { loading: authLoading, user, canManageContent } = useRequireContentAccess();
  const ds = useDateRange("30d");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Record<string, string>>({});
  const [cats, setCats] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user || !canManageContent) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [p, s, c] = await Promise.all([
        supabase.from("products")
          .select("id, name_ar, slug, status, featured, store_id, category_id, image_url, price, created_at")
          .order("created_at", { ascending: false }).limit(1000),
        supabase.from("stores").select("id, name_ar").limit(500),
        supabase.from("product_categories").select("id, name_ar").limit(200),
      ]);
      if (cancelled) return;
      setProducts((p.data ?? []) as Product[]);
      const sm: Record<string, string> = {}; ((s.data ?? []) as any[]).forEach(r => { sm[r.id] = r.name_ar; });
      const cm: Record<string, string> = {}; ((c.data ?? []) as any[]).forEach(r => { cm[r.id] = r.name_ar; });
      setStores(sm); setCats(cm);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, canManageContent, ds.range.fromIso]);

  if (authLoading) return <div className="min-h-screen grid place-items-center text-muted-foreground">جاري التحميل...</div>;
  if (!user || !canManageContent) return null;

  const total = products.length;
  const published = products.filter(p => p.status === "published").length;
  const draft = products.filter(p => p.status === "draft").length;
  const featured = products.filter(p => p.featured).length;
  const noImage = products.filter(p => !p.image_url).length;
  const inRange = products.filter(p => p.created_at >= ds.range.fromIso && p.created_at <= ds.range.toIso).length;

  const byStore: Record<string, number> = {};
  const byCat: Record<string, number> = {};
  products.filter(p => p.status === "published").forEach(p => {
    if (p.store_id) byStore[p.store_id] = (byStore[p.store_id] || 0) + 1;
    if (p.category_id) byCat[p.category_id] = (byCat[p.category_id] || 0) + 1;
  });

  const topStores = Object.entries(byStore).map(([k, v]) => ({ key: k, label: stores[k] || k.slice(0, 8), value: v, href: `/admin/stores/${k}` }))
    .sort((a, b) => b.value - a.value).slice(0, 10);
  const topCats = Object.entries(byCat).map(([k, v]) => ({ key: k, label: cats[k] || k.slice(0, 8), value: v }))
    .sort((a, b) => b.value - a.value).slice(0, 10);

  const recent = products.slice(0, 30);

  return (
    <ReportShell
      title="تقرير أداء المنتجات"
      subtitle="جودة الكتالوج: المنشور، المسودات، التغطية بالصور، والأكثر منتجات حسب المحل والفئة."
      source={["db"]}
    >
      <DateRangeFilter state={ds} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <ReportKpi label="إجمالي" value={total} tone="info" />
        <ReportKpi label="منشور" value={published} tone="success" />
        <ReportKpi label="مسودة" value={draft} tone="warning" />
        <ReportKpi label="مميّز" value={featured} tone="info" />
        <ReportKpi label="بدون صورة" value={noImage} tone={noImage > 0 ? "danger" : "success"} />
        <ReportKpi label="جديد في النطاق" value={inRange} tone="neutral" hint={ds.range.label} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AdminSectionCard title="أعلى المحلات في عدد المنتجات">
          {loading ? <Skeleton className="h-40" /> : <RankTable rows={topStores} valueLabel="منتج" />}
        </AdminSectionCard>
        <AdminSectionCard title="أعلى الفئات في عدد المنتجات">
          {loading ? <Skeleton className="h-40" /> : <RankTable rows={topCats} valueLabel="منتج" />}
        </AdminSectionCard>
      </div>

      <AdminSectionCard title="أحدث المنتجات المُضافة">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المنتج</TableHead>
                <TableHead>المحل</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-end">السعر</TableHead>
                <TableHead>تاريخ الإضافة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Link to={`/admin/products`} className="font-bold text-foreground hover:text-primary">{p.name_ar}</Link>
                  </TableCell>
                  <TableCell className="text-xs">{p.store_id ? stores[p.store_id] || "—" : "—"}</TableCell>
                  <TableCell className="text-xs">{p.category_id ? cats[p.category_id] || "—" : "—"}</TableCell>
                  <TableCell className={`text-xs font-bold ${p.status === "published" ? "text-emerald-600" : "text-amber-600"}`}>{p.status}</TableCell>
                  <TableCell className="text-end font-mono">{p.price ? `${p.price} ج.م` : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("ar-EG")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </AdminSectionCard>
    </ReportShell>
  );
}
