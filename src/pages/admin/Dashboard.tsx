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
  Sparkles, Clock, AlertTriangle, Activity, Rocket, Zap,
  Link2, RefreshCw, CalendarClock,
} from "lucide-react";

type Kpis = {
  storesTotal: number; storesActive: number; storesOpeningSoon: number;
  productsPublished: number; productsDraft: number;
  dealsLive: number; dealsExpiringSoon: number;
  socialPending: number;
  leads7d: number;
  edgeErrors24h: number;
  syncErrors: number;
  connectorsLinked: number;
};

type PendingRow = {
  id: string;
  kind: "social" | "offer" | "product";
  title: string;
  subtitle?: string;
  href: string;
  createdAt: string;
};

type ActivityRow = { id: string; table: string; action: string; createdAt: string };
type ExpiringOffer = { id: string; title_ar: string; valid_to: string | null; store_id: string | null };
type OpeningSoonStore = {
  id: string; slug: string; name_ar: string; logo_url: string | null;
  external_store_type: string | null; status: string;
};
type SyncIssueStore = {
  id: string; slug: string; name_ar: string;
  external_store_type: string | null; sync_status: string | null; last_sync_at: string | null;
};
type EdgeError = { id: string; function_name: string; error_message: string | null; created_at: string };

const inSec = (sec: number) => new Date(Date.now() - sec * 1000).toISOString();

const daysUntil = (iso: string | null) => {
  if (!iso) return null;
  return Math.ceil((+new Date(iso) - Date.now()) / (1000 * 60 * 60 * 24));
};

const AdminDashboard = () => {
  const { loading: authLoading, user, canManageContent, isAdmin } = useRequireContentAccess();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [pending, setPending] = useState<PendingRow[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [expiring, setExpiring] = useState<ExpiringOffer[]>([]);
  const [openingSoon, setOpeningSoon] = useState<OpeningSoonStore[]>([]);
  const [syncIssues, setSyncIssues] = useState<SyncIssueStore[]>([]);
  const [edgeErrors, setEdgeErrors] = useState<EdgeError[]>([]);

  useEffect(() => {
    if (!user || !canManageContent) return;
    let cancelled = false;
    (async () => {
      const sevenDaysAgo = inSec(7 * 24 * 3600);
      const oneDayAgo = inSec(24 * 3600);
      const staleSyncCutoff = inSec(7 * 24 * 3600);
      const nowIso = new Date().toISOString();
      const sevenDaysAhead = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();

      const C = (q: any) => q.then((r: any) => r.count ?? 0);

      const [
        storesTotal, storesActive, storesOpeningSoon,
        productsPublished, productsDraft,
        dealsLive, dealsExpiringSoon,
        socialPending, leads7d, edgeErrors24h,
        syncErrors, connectorsLinked,
        socialRows, draftOffers, draftProducts, auditRows,
        expiringRows, openingSoonRows, syncIssueRows, edgeErrorRows,
      ] = await Promise.all([
        C(supabase.from("stores").select("id", { count: "exact", head: true })),
        C(supabase.from("stores").select("id", { count: "exact", head: true }).eq("lifecycle_status", "active")),
        C(supabase.from("stores").select("id", { count: "exact", head: true }).eq("lifecycle_status", "opening_soon")),
        C(supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "published")),
        C(supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "draft")),
        C(supabase.from("deals").select("id", { count: "exact", head: true }).eq("is_live", true)),
        C(supabase.from("deals").select("id", { count: "exact", head: true }).eq("is_live", true).lte("valid_to", sevenDaysAhead).gte("valid_to", nowIso)),
        C(supabase.from("social_offer_intake").select("id", { count: "exact", head: true }).in("review_status", ["detected", "pending_review"])),
        C(supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo)),
        isAdmin ? C(supabase.from("edge_function_logs").select("id", { count: "exact", head: true }).eq("status", "error").gte("created_at", oneDayAgo)) : Promise.resolve(0),
        C(supabase.from("stores").select("id", { count: "exact", head: true }).eq("sync_status", "error")),
        C(supabase.from("stores").select("id", { count: "exact", head: true }).neq("external_store_type", "none").not("external_store_type", "is", null)),

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

        supabase.from("deals")
          .select("id, title_ar, valid_to, store_id")
          .eq("is_live", true)
          .not("valid_to", "is", null)
          .lte("valid_to", sevenDaysAhead)
          .gte("valid_to", nowIso)
          .order("valid_to", { ascending: true }).limit(6),
        supabase.from("stores")
          .select("id, slug, name_ar, logo_url, external_store_type, status")
          .eq("lifecycle_status", "opening_soon")
          .order("updated_at", { ascending: false }).limit(6),
        supabase.from("stores")
          .select("id, slug, name_ar, external_store_type, sync_status, last_sync_at")
          .or(`sync_status.eq.error,and(external_store_type.neq.none,last_sync_at.lt.${staleSyncCutoff})`)
          .order("last_sync_at", { ascending: true, nullsFirst: true }).limit(6),
        isAdmin
          ? supabase.from("edge_function_logs")
              .select("id, function_name, error_message, created_at")
              .eq("status", "error")
              .order("created_at", { ascending: false }).limit(5)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      if (cancelled) return;

      setKpis({
        storesTotal, storesActive, storesOpeningSoon,
        productsPublished, productsDraft,
        dealsLive, dealsExpiringSoon,
        socialPending, leads7d, edgeErrors24h,
        syncErrors, connectorsLinked,
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
          href: `/admin/offers`, createdAt: r.created_at,
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

      setExpiring(((expiringRows as any).data ?? []) as ExpiringOffer[]);
      setOpeningSoon(((openingSoonRows as any).data ?? []) as OpeningSoonStore[]);
      setSyncIssues(((syncIssueRows as any).data ?? []) as SyncIssueStore[]);
      setEdgeErrors(((edgeErrorRows as any).data ?? []) as EdgeError[]);

      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, canManageContent, isAdmin]);

  if (authLoading) {
    return <div className="min-h-screen bg-background grid place-items-center text-muted-foreground">جاري التحميل...</div>;
  }
  if (!user || !canManageContent) return null;

  const criticalCount =
    (kpis?.socialPending ?? 0) +
    (kpis?.syncErrors ?? 0) +
    (kpis?.edgeErrors24h ?? 0);

  return (
    <AdminShell>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <AdminPageHeader
          title="مرحباً بك في غرفة العمليات"
          subtitle={isAdmin
            ? "صلاحيات مسؤول كاملة — راقب الإطلاق، المحتوى، الربط الخارجي، وصحة النظام."
            : "صلاحيات محرر — راجِع المحتوى، العروض، والمحلات."}
          actions={
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/stores"><Button variant="cta" size="sm" className="gap-1"><Plus className="w-4 h-4" /> محل جديد</Button></Link>
              <Link to="/admin/offers"><Button variant="outline" size="sm" className="gap-1"><Tag className="w-4 h-4" /> العروض</Button></Link>
              <Link to="/admin/social-offers"><Button variant="outline" size="sm" className="gap-1"><Bell className="w-4 h-4" /> السوشيال</Button></Link>
            </div>
          }
        />

        {/* Critical alerts bar */}
        {criticalCount > 0 && (
          <div className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 flex flex-wrap items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1 min-w-[200px]">
              <div className="font-bold text-sm text-foreground">
                {criticalCount} عنصر يحتاج انتباهك
              </div>
              <div className="text-xs text-muted-foreground">
                {kpis?.socialPending ? `${kpis.socialPending} مراجعة سوشيال · ` : ""}
                {kpis?.syncErrors ? `${kpis.syncErrors} خطأ مزامنة · ` : ""}
                {kpis?.edgeErrors24h ? `${kpis.edgeErrors24h} خطأ نظام (24س)` : ""}
              </div>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <AdminStatCard label="المحلات" value={kpis?.storesTotal ?? "—"} hint={kpis ? `${kpis.storesActive} نشِط` : undefined} icon={Store} tone="info" loading={loading} />
          <AdminStatCard label="يُفتتح قريباً" value={kpis?.storesOpeningSoon ?? "—"} icon={Rocket} tone="warning" loading={loading} />
          <AdminStatCard label="منتجات منشورة" value={kpis?.productsPublished ?? "—"} hint={kpis ? `${kpis.productsDraft} مسودة` : undefined} icon={ShoppingBag} loading={loading} />
          <AdminStatCard label="عروض مباشرة" value={kpis?.dealsLive ?? "—"} hint={kpis ? `${kpis.dealsExpiringSoon} ينتهي قريباً` : undefined} icon={Tag} tone="success" loading={loading} />
          <AdminStatCard label="ربط خارجي" value={kpis?.connectorsLinked ?? "—"} hint={kpis?.syncErrors ? `${kpis.syncErrors} خطأ` : "كل الربط سليم"} icon={Link2} tone={kpis && kpis.syncErrors > 0 ? "danger" : "info"} loading={loading} />
          <AdminStatCard label="عملاء (7 أيام)" value={kpis?.leads7d ?? "—"} icon={Users} loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-5">
            {/* Pending queue */}
            <AdminSectionCard
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
                <AdminEmptyState icon={Sparkles} title="لا يوجد عناصر بانتظار المراجعة" />
              ) : (
                <ul className="divide-y divide-border">
                  {pending.map((row) => (
                    <li key={`${row.kind}-${row.id}`}>
                      <Link to={row.href} className="flex items-center gap-3 py-2.5 hover:bg-secondary/40 px-2 -mx-2 rounded-md transition-colors">
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

            {/* Expiring offers */}
            <AdminSectionCard
              title="عروض تنتهي قريباً"
              action={
                <Link to="/admin/offers" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
                  مسار العروض <ArrowLeft className="w-3 h-3" />
                </Link>
              }
            >
              {loading ? (
                <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : expiring.length === 0 ? (
                <AdminEmptyState icon={CalendarClock} title="لا توجد عروض تنتهي خلال 7 أيام" />
              ) : (
                <ul className="divide-y divide-border">
                  {expiring.map((o) => {
                    const d = daysUntil(o.valid_to);
                    const tone = d !== null && d <= 1 ? "danger" : d !== null && d <= 3 ? "warning" : "info";
                    return (
                      <li key={o.id}>
                        <Link to={`/admin/offers`} className="flex items-center gap-3 py-2.5 hover:bg-secondary/40 px-2 -mx-2 rounded-md">
                          <AdminStatusBadge tone={tone}>
                            {d !== null ? (d <= 0 ? "اليوم" : `${d} يوم`) : "—"}
                          </AdminStatusBadge>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-foreground truncate">{o.title_ar}</div>
                            <div className="text-[0.7rem] text-muted-foreground">
                              ينتهي: {o.valid_to ? new Date(o.valid_to).toLocaleDateString("ar-EG") : "—"}
                            </div>
                          </div>
                          <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </AdminSectionCard>

            {/* Opening soon stores */}
            <AdminSectionCard
              title="محلات يُفتتح قريباً"
              action={
                <Link to="/admin/stores" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
                  المحلات <ArrowLeft className="w-3 h-3" />
                </Link>
              }
            >
              {loading ? (
                <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
              ) : openingSoon.length === 0 ? (
                <AdminEmptyState icon={Rocket} title="لا توجد محلات قيد الافتتاح حالياً" />
              ) : (
                <ul className="divide-y divide-border">
                  {openingSoon.map((s) => {
                    const gaps: string[] = [];
                    if (s.status === "hidden") gaps.push("مخفي");
                    if (!s.logo_url) gaps.push("بدون شعار");
                    if (!s.external_store_type || s.external_store_type === "none") gaps.push("بدون ربط خارجي");
                    return (
                      <li key={s.id}>
                        <Link to={`/admin/stores/${s.id}`} className="flex items-center gap-3 py-2.5 hover:bg-secondary/40 px-2 -mx-2 rounded-md">
                          <div className="w-9 h-9 rounded-lg bg-secondary grid place-items-center overflow-hidden shrink-0">
                            {s.logo_url
                              ? <img src={s.logo_url} alt="" className="w-full h-full object-contain" />
                              : <Store className="w-4 h-4 text-muted-foreground" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-foreground truncate">{s.name_ar}</div>
                            <div className="text-[0.7rem] text-muted-foreground truncate">
                              {gaps.length > 0 ? gaps.join(" · ") : "جاهز للنشر"}
                            </div>
                          </div>
                          {gaps.length > 0 && (
                            <AdminStatusBadge tone="warning">{gaps.length} ثغرة</AdminStatusBadge>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </AdminSectionCard>
          </div>

          {/* SIDE COLUMN */}
          <div className="space-y-5">
            {/* Sync issues */}
            <AdminSectionCard
              title="مشاكل ربط ومزامنة"
              action={<RefreshCw className="w-4 h-4 text-muted-foreground" />}
            >
              {loading ? (
                <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : syncIssues.length === 0 ? (
                <AdminEmptyState icon={Link2} title="كل الواجهات الخارجية سليمة" />
              ) : (
                <ul className="divide-y divide-border">
                  {syncIssues.map((s) => (
                    <li key={s.id}>
                      <Link to={`/admin/stores/${s.id}?tab=external`} className="flex items-center gap-2 py-2 hover:bg-secondary/40 px-2 -mx-2 rounded-md">
                        <AdminStatusBadge tone={s.sync_status === "error" ? "danger" : "warning"}>
                          {s.sync_status === "error" ? "خطأ" : "قديم"}
                        </AdminStatusBadge>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-foreground truncate">{s.name_ar}</div>
                          <div className="text-[0.65rem] text-muted-foreground truncate">
                            {s.external_store_type || "—"} · {s.last_sync_at ? new Date(s.last_sync_at).toLocaleDateString("ar-EG") : "لم تتم مزامنة"}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </AdminSectionCard>

            {/* Edge / system health (admin-only) */}
            {isAdmin && (
              <AdminSectionCard
                title="صحة النظام"
                action={
                  <Link to="/admin/edge-logs" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
                    السجلات <ArrowLeft className="w-3 h-3" />
                  </Link>
                }
              >
                {loading ? (
                  <div className="space-y-2">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : edgeErrors.length === 0 ? (
                  <AdminEmptyState icon={Zap} title="لا توجد أخطاء حديثة" />
                ) : (
                  <ul className="space-y-2">
                    {edgeErrors.map((e) => (
                      <li key={e.id} className="text-xs border border-red-500/20 bg-red-500/5 rounded-md p-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-bold text-red-600 truncate">{e.function_name}</span>
                          <span className="text-[0.65rem] text-muted-foreground shrink-0">
                            {new Date(e.created_at).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" })}
                          </span>
                        </div>
                        {e.error_message && (
                          <div className="text-[0.7rem] text-muted-foreground mt-1 line-clamp-2">{e.error_message}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </AdminSectionCard>
            )}

            {/* Quick actions */}
            <AdminSectionCard title="إجراءات سريعة">
              <div className="grid grid-cols-2 gap-2">
                <Link to="/admin/stores"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Store className="w-4 h-4" /> المحلات</Button></Link>
                <Link to="/admin/products"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><ShoppingBag className="w-4 h-4" /> المنتجات</Button></Link>
                <Link to="/admin/offers"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Tag className="w-4 h-4" /> العروض</Button></Link>
                <Link to="/admin/social-offers"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Bell className="w-4 h-4" /> سوشيال</Button></Link>
                {isAdmin && (
                  <>
                    <Link to="/admin/launch-readiness"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Rocket className="w-4 h-4" /> الإطلاق</Button></Link>
                    <Link to="/admin/leads"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Users className="w-4 h-4" /> العملاء</Button></Link>
                  </>
                )}
              </div>
            </AdminSectionCard>

            {/* Recent activity */}
            {isAdmin && (
              <AdminSectionCard title="آخر النشاط" action={<Activity className="w-4 h-4 text-muted-foreground" />}>
                {loading ? (
                  <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
                ) : activity.length === 0 ? (
                  <p className="text-xs text-muted-foreground">لا يوجد نشاط مسجل بعد.</p>
                ) : (
                  <ul className="space-y-2">
                    {activity.slice(0, 6).map((a) => (
                      <li key={a.id} className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <AdminStatusBadge tone={a.action === "DELETE" ? "danger" : a.action === "INSERT" ? "success" : "info"}>
                            {a.action}
                          </AdminStatusBadge>
                          <span className="font-mono text-muted-foreground truncate">{a.table}</span>
                        </div>
                        <span className="text-muted-foreground shrink-0 text-[0.65rem]">
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
