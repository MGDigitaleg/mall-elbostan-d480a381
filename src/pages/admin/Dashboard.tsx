import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireContentAccess } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AdminPageHeader, AdminStatCard, AdminSectionCard,
  AdminStatusBadge, AdminEmptyState,
} from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Store, ShoppingBag, Tag, Bell, Users, Plus, ArrowLeft,
  Sparkles, Clock, AlertTriangle, Activity, Rocket,
} from "lucide-react";

type Kpis = {
  storesTotal: number; storesActive: number; storesOpeningSoon: number;
  productsPublished: number; productsDraft: number;
  dealsLive: number; dealsExpiringSoon: number;
  socialPending: number;
  leads7d: number;
  edgeErrors24h: number;
};

type PendingRow = {
  id: string;
  kind: "social" | "offer" | "product";
  title: string;
  subtitle?: string;
  href: string;
  createdAt: string;
};

type ActivityRow = {
  id: string;
  table: string;
  action: string;
  createdAt: string;
};

const inSec = (sec: number) => new Date(Date.now() - sec * 1000).toISOString();

const AdminDashboard = () => {
  const { loading: authLoading, user, canManageContent, isAdmin } = useRequireContentAccess();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [pending, setPending] = useState<PendingRow[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);

  useEffect(() => {
    if (!user || !canManageContent) return;
    let cancelled = false;
    (async () => {
      const sevenDaysAgo = inSec(7 * 24 * 3600);
      const oneDayAgo = inSec(24 * 3600);
      const sevenDaysAhead = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();

      const C = (q: any) => q.then((r: any) => r.count ?? 0);

      const [
        storesTotal, storesActive, storesOpeningSoon,
        productsPublished, productsDraft,
        dealsLive, dealsExpiringSoon,
        socialPending, leads7d, edgeErrors24h,
        socialRows, draftOffers, draftProducts, auditRows,
      ] = await Promise.all([
        C(supabase.from("stores").select("id", { count: "exact", head: true })),
        C(supabase.from("stores").select("id", { count: "exact", head: true }).eq("opening_status", "open")),
        C(supabase.from("stores").select("id", { count: "exact", head: true }).eq("opening_status", "opening_soon")),
        C(supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "published")),
        C(supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "draft")),
        C(supabase.from("deals").select("id", { count: "exact", head: true }).eq("is_live", true)),
        C(supabase.from("deals").select("id", { count: "exact", head: true }).eq("is_live", true).lte("valid_to", sevenDaysAhead).gte("valid_to", new Date().toISOString())),
        C(supabase.from("social_offer_intake").select("id", { count: "exact", head: true }).in("review_status", ["detected", "pending_review"])),
        C(supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo)),
        isAdmin ? C(supabase.from("edge_function_logs").select("id", { count: "exact", head: true }).eq("status", "error").gte("created_at", oneDayAgo)) : Promise.resolve(0),

        supabase.from("social_offer_intake")
          .select("id, offer_title, source_caption, created_at, review_status")
          .in("review_status", ["detected", "pending_review"])
          .order("created_at", { ascending: false }).limit(5),
        supabase.from("deals")
          .select("id, title_ar, created_at, is_live")
          .eq("is_live", false)
          .order("created_at", { ascending: false }).limit(5),
        supabase.from("products")
          .select("id, name_ar, created_at, status")
          .eq("status", "draft")
          .order("created_at", { ascending: false }).limit(5),
        isAdmin
          ? supabase.from("audit_logs")
              .select("id, table_name, action, created_at")
              .order("created_at", { ascending: false }).limit(15)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      if (cancelled) return;

      setKpis({
        storesTotal, storesActive, storesOpeningSoon,
        productsPublished, productsDraft,
        dealsLive, dealsExpiringSoon,
        socialPending, leads7d, edgeErrors24h,
      });

      const p: PendingRow[] = [
        ...((socialRows.data ?? []) as any[]).map((r) => ({
          id: r.id, kind: "social" as const,
          title: r.offer_title || r.source_caption || "منشور بانتظار المراجعة",
          subtitle: "عرض سوشيال",
          href: `/admin/social-offers?post=${r.id}`,
          createdAt: r.created_at,
        })),
        ...((draftOffers.data ?? []) as any[]).map((r) => ({
          id: r.id, kind: "offer" as const,
          title: r.title_ar, subtitle: "عرض مسودة",
          href: `/admin/deals`, createdAt: r.created_at,
        })),
        ...((draftProducts.data ?? []) as any[]).map((r) => ({
          id: r.id, kind: "product" as const,
          title: r.name_ar, subtitle: "منتج مسودة",
          href: `/admin/products`, createdAt: r.created_at,
        })),
      ].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 8);
      setPending(p);

      setActivity(((auditRows as any).data ?? []).map((r: any) => ({
        id: r.id, table: r.table_name, action: r.action, createdAt: r.created_at,
      })));

      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, canManageContent, isAdmin]);

  if (authLoading) {
    return <div className="min-h-screen bg-background grid place-items-center text-muted-foreground">جاري التحميل...</div>;
  }
  if (!user || !canManageContent) return null;

  return (
    <AdminShell>
      <div className="p-6 max-w-7xl mx-auto">
        <AdminPageHeader
          title="مرحباً بك في لوحة التحكم"
          subtitle={isAdmin
            ? "صلاحيات مسؤول كاملة — مراجعة العمليات، المحتوى، والنظام."
            : "صلاحيات محرر — يمكنك إدارة المحتوى ومراجعة العروض."}
          actions={
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/stores"><Button variant="cta" size="sm" className="gap-1"><Plus className="w-4 h-4" /> محل جديد</Button></Link>
              <Link to="/admin/deals"><Button variant="outline" size="sm" className="gap-1"><Plus className="w-4 h-4" /> عرض جديد</Button></Link>
              <Link to="/admin/social-offers"><Button variant="outline" size="sm" className="gap-1"><Bell className="w-4 h-4" /> مراجعة السوشيال</Button></Link>
            </div>
          }
        />

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          <AdminStatCard label="المحلات" value={kpis?.storesTotal ?? "—"} hint={kpis ? `${kpis.storesActive} نشط · ${kpis.storesOpeningSoon} يُفتتح قريباً` : undefined} icon={Store} tone="info" loading={loading} />
          <AdminStatCard label="منتجات منشورة" value={kpis?.productsPublished ?? "—"} hint={kpis ? `${kpis.productsDraft} مسودة` : undefined} icon={ShoppingBag} tone="neutral" loading={loading} />
          <AdminStatCard label="عروض مباشرة" value={kpis?.dealsLive ?? "—"} hint={kpis ? `${kpis.dealsExpiringSoon} تنتهي خلال 7 أيام` : undefined} icon={Tag} tone="success" loading={loading} />
          <AdminStatCard label="مراجعات سوشيال" value={kpis?.socialPending ?? "—"} hint="بانتظار المراجعة" icon={Bell} tone={kpis && kpis.socialPending > 0 ? "warning" : "neutral"} loading={loading} />
          <AdminStatCard label="عملاء محتملون (7 أيام)" value={kpis?.leads7d ?? "—"} icon={Users} tone="info" loading={loading} />
        </div>

        {/* Alerts */}
        {isAdmin && kpis && kpis.edgeErrors24h > 0 && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1">
              <div className="font-bold text-sm text-foreground">{kpis.edgeErrors24h} خطأ في Edge Functions خلال 24 ساعة</div>
              <div className="text-xs text-muted-foreground">راجع السجلات لتشخيص المشكلة.</div>
            </div>
            <Link to="/admin/edge-logs"><Button variant="outline" size="sm" className="gap-1">عرض السجلات <ArrowLeft className="w-4 h-4" /></Button></Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending queue */}
          <AdminSectionCard
            className="lg:col-span-2"
            title="طابور المراجعة"
            action={
              <Link to="/admin/social-offers" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
                الكل <ArrowLeft className="w-3 h-3" />
              </Link>
            }
          >
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : pending.length === 0 ? (
              <AdminEmptyState icon={Sparkles} title="لا يوجد عناصر بانتظار المراجعة" description="جميع العروض والمنتجات تمت معالجتها." />
            ) : (
              <ul className="divide-y divide-border">
                {pending.map((row) => (
                  <li key={`${row.kind}-${row.id}`}>
                    <Link to={row.href} className="flex items-center gap-3 py-3 hover:bg-secondary/40 px-2 -mx-2 rounded-md transition-colors">
                      <AdminStatusBadge tone={row.kind === "social" ? "warning" : row.kind === "offer" ? "info" : "neutral"}>
                        {row.subtitle}
                      </AdminStatusBadge>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-foreground truncate">{row.title}</div>
                      </div>
                      <div className="text-[0.7rem] text-muted-foreground inline-flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {new Date(row.createdAt).toLocaleDateString("ar-EG")}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </AdminSectionCard>

          {/* Side column: recent activity + quick links */}
          <div className="space-y-6">
            <AdminSectionCard title="إجراءات سريعة">
              <div className="grid grid-cols-2 gap-2">
                <Link to="/admin/stores"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Store className="w-4 h-4" /> المحلات</Button></Link>
                <Link to="/admin/products"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><ShoppingBag className="w-4 h-4" /> المنتجات</Button></Link>
                <Link to="/admin/deals"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Tag className="w-4 h-4" /> العروض</Button></Link>
                <Link to="/admin/social-offers"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Bell className="w-4 h-4" /> سوشيال</Button></Link>
                {isAdmin && (
                  <>
                    <Link to="/admin/launch-readiness"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Rocket className="w-4 h-4" /> الإطلاق</Button></Link>
                    <Link to="/admin/leads"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Users className="w-4 h-4" /> العملاء</Button></Link>
                  </>
                )}
              </div>
            </AdminSectionCard>

            {isAdmin && (
              <AdminSectionCard title="آخر النشاط" action={<Activity className="w-4 h-4 text-muted-foreground" />}>
                {loading ? (
                  <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
                ) : activity.length === 0 ? (
                  <p className="text-xs text-muted-foreground">لا يوجد نشاط مسجل بعد.</p>
                ) : (
                  <ul className="space-y-2">
                    {activity.slice(0, 8).map((a) => (
                      <li key={a.id} className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <AdminStatusBadge tone={a.action === "DELETE" ? "danger" : a.action === "INSERT" ? "success" : "info"}>
                            {a.action}
                          </AdminStatusBadge>
                          <span className="font-mono text-muted-foreground truncate">{a.table}</span>
                        </div>
                        <span className="text-muted-foreground shrink-0">
                          {new Date(a.createdAt).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" })}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </AdminSectionCard>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
};

export default AdminDashboard;
