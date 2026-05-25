import { useEffect, useMemo, useState } from "react";
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
  Link2, RefreshCw, CalendarClock, TrendingUp, QrCode,
  MessageCircle, Navigation, Globe, Megaphone,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend,
} from "recharts";

type Kpis = {
  storesTotal: number; storesActive: number; storesOpeningSoon: number;
  productsPublished: number; productsDraft: number;
  dealsLive: number; dealsExpiringSoon: number;
  socialPending: number;
  leads7d: number; leadsPrev7d: number;
  spins7d: number; spinsPrev7d: number;
  edgeErrors24h: number;
  syncErrors: number;
  connectorsLinked: number;
  qrScansTotal: number;
};

type PendingRow = {
  id: string; kind: "social" | "offer" | "product";
  title: string; subtitle?: string; href: string; createdAt: string;
};

type ActivityRow = {
  id: string; table: string; action: string; createdAt: string; actor: string | null;
};
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
type QrCampaignRow = {
  id: string; name_ar: string; utm_source: string; utm_campaign: string;
  scan_count: number; lead_count: number;
};
type TimelinePoint = { date: string; label: string; leads: number; spins: number };
type RankRow = { key: string; label: string; value: number };

const inSec = (sec: number) => new Date(Date.now() - sec * 1000).toISOString();
const daysUntil = (iso: string | null) => {
  if (!iso) return null;
  return Math.ceil((+new Date(iso) - Date.now()) / (1000 * 60 * 60 * 24));
};
const dayKey = (d: Date) => d.toISOString().slice(0, 10);
const arDay = (d: Date) => d.toLocaleDateString("ar-EG", { day: "numeric", month: "short" });

function pctDelta(curr: number, prev: number): string {
  if (prev === 0) return curr > 0 ? "+جديد" : "—";
  const d = Math.round(((curr - prev) / prev) * 100);
  return `${d >= 0 ? "+" : ""}${d}%`;
}
function deltaTone(curr: number, prev: number): "success" | "danger" | "neutral" {
  if (curr > prev) return "success";
  if (curr < prev) return "danger";
  return "neutral";
}

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
  const [qrCampaigns, setQrCampaigns] = useState<QrCampaignRow[]>([]);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [topSources, setTopSources] = useState<RankRow[]>([]);
  const [topCampaigns, setTopCampaigns] = useState<RankRow[]>([]);
  const [topStoreLeads, setTopStoreLeads] = useState<RankRow[]>([]);
  const [whatsappClicks, setWhatsappClicks] = useState<number>(0);
  const [directionsClicks, setDirectionsClicks] = useState<number>(0);

  useEffect(() => {
    if (!user || !canManageContent) return;
    let cancelled = false;
    (async () => {
      const sevenDaysAgo = inSec(7 * 24 * 3600);
      const prev7Start = inSec(14 * 24 * 3600);
      const fourteenDaysAgo = inSec(14 * 24 * 3600);
      const oneDayAgo = inSec(24 * 3600);
      const staleSyncCutoff = inSec(7 * 24 * 3600);
      const nowIso = new Date().toISOString();
      const sevenDaysAhead = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();

      const C = (q: any) => q.then((r: any) => r.count ?? 0);

      const [
        storesTotal, storesActive, storesOpeningSoon,
        productsPublished, productsDraft,
        dealsLive, dealsExpiringSoon,
        socialPending, leads7d, leadsPrev7d, spins7d, spinsPrev7d,
        edgeErrors24h, syncErrors, connectorsLinked,
        socialRows, draftOffers, draftProducts, auditRows,
        expiringRows, openingSoonRows, syncIssueRows, edgeErrorRows,
        timelineLeads, timelineSpins,
        sourcesLeads, sourcesSpins,
        qrRows, storesIndex,
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
        C(supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", prev7Start).lt("created_at", sevenDaysAgo)),
        isAdmin ? C(supabase.from("spin_sessions").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo)) : Promise.resolve(0),
        isAdmin ? C(supabase.from("spin_sessions").select("id", { count: "exact", head: true }).gte("created_at", prev7Start).lt("created_at", sevenDaysAgo)) : Promise.resolve(0),
        isAdmin ? C(supabase.from("edge_function_logs").select("id", { count: "exact", head: true }).eq("status", "error").gte("created_at", oneDayAgo)) : Promise.resolve(0),
        C(supabase.from("stores").select("id", { count: "exact", head: true }).eq("sync_status", "error")),
        C(supabase.from("stores").select("id", { count: "exact", head: true }).neq("external_store_type", "none").not("external_store_type", "is", null)),

        supabase.from("social_offer_intake")
          .select("id, offer_title, source_caption, created_at, review_status")
          .in("review_status", ["detected", "pending_review"])
          .order("created_at", { ascending: false }).limit(5),
        supabase.from("deals")
          .select("id, title_ar, created_at, is_live").eq("is_live", false)
          .order("created_at", { ascending: false }).limit(5),
        supabase.from("products")
          .select("id, name_ar, created_at, status").eq("status", "draft")
          .order("created_at", { ascending: false }).limit(5),
        isAdmin
          ? supabase.from("audit_logs")
              .select("id, table_name, action, created_at, actor_id")
              .order("created_at", { ascending: false }).limit(15)
          : Promise.resolve({ data: [] as any[] }),

        supabase.from("deals")
          .select("id, title_ar, valid_to, store_id")
          .eq("is_live", true).not("valid_to", "is", null)
          .lte("valid_to", sevenDaysAhead).gte("valid_to", nowIso)
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

        // Timeline raw rows (14 days)
        supabase.from("leads")
          .select("created_at, metadata")
          .gte("created_at", fourteenDaysAgo).limit(1000),
        isAdmin
          ? supabase.from("spin_sessions")
              .select("created_at, utm_source, utm_campaign")
              .gte("created_at", fourteenDaysAgo).limit(1000)
          : Promise.resolve({ data: [] as any[] }),

        // Source breakdown (last 30 days)
        supabase.from("leads")
          .select("metadata, created_at")
          .gte("created_at", inSec(30 * 24 * 3600)).limit(1000),
        isAdmin
          ? supabase.from("spin_sessions")
              .select("utm_source, utm_campaign, created_at")
              .gte("created_at", inSec(30 * 24 * 3600)).limit(1000)
          : Promise.resolve({ data: [] as any[] }),

        supabase.from("qr_campaigns")
          .select("id, name_ar, utm_source, utm_campaign, scan_count, lead_count")
          .order("scan_count", { ascending: false }).limit(6),
        supabase.from("stores").select("id, name_ar").limit(500),
      ]);

      if (cancelled) return;

      // Aggregate QR scan total
      const qrScansTotal = ((qrRows as any).data ?? []).reduce(
        (s: number, r: any) => s + (r.scan_count ?? 0), 0
      );

      setKpis({
        storesTotal, storesActive, storesOpeningSoon,
        productsPublished, productsDraft,
        dealsLive, dealsExpiringSoon,
        socialPending, leads7d, leadsPrev7d, spins7d, spinsPrev7d,
        edgeErrors24h, syncErrors, connectorsLinked, qrScansTotal,
      });

      // Pending
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
      ].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6);
      setPending(p);

      setActivity(((auditRows as any).data ?? []).map((r: any) => ({
        id: r.id, table: r.table_name, action: r.action,
        createdAt: r.created_at, actor: r.actor_id,
      })));

      setExpiring(((expiringRows as any).data ?? []) as ExpiringOffer[]);
      setOpeningSoon(((openingSoonRows as any).data ?? []) as OpeningSoonStore[]);
      setSyncIssues(((syncIssueRows as any).data ?? []) as SyncIssueStore[]);
      setEdgeErrors(((edgeErrorRows as any).data ?? []) as EdgeError[]);
      setQrCampaigns(((qrRows as any).data ?? []) as QrCampaignRow[]);

      // Build 14-day timeline buckets
      const buckets: Record<string, TimelinePoint> = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
        const k = dayKey(d);
        buckets[k] = { date: k, label: arDay(d), leads: 0, spins: 0 };
      }
      const leadRows = ((timelineLeads as any).data ?? []) as any[];
      leadRows.forEach((r) => {
        const k = (r.created_at as string).slice(0, 10);
        if (buckets[k]) buckets[k].leads += 1;
      });
      const spinRows = ((timelineSpins as any).data ?? []) as any[];
      spinRows.forEach((r) => {
        const k = (r.created_at as string).slice(0, 10);
        if (buckets[k]) buckets[k].spins += 1;
      });
      setTimeline(Object.values(buckets));

      // WhatsApp / directions clicks heuristic (leads with lead_type tags or metadata source)
      const allLeads30 = ((sourcesLeads as any).data ?? []) as any[];
      const wa = allLeads30.filter((l) => (l.metadata?.source || "").toString().includes("whatsapp")).length;
      const dirc = allLeads30.filter((l) => (l.metadata?.source || "").toString().includes("directions")).length;
      setWhatsappClicks(wa);
      setDirectionsClicks(dirc);

      // Aggregate top UTM sources & campaigns from leads.metadata + spin_sessions
      const srcMap: Record<string, number> = {};
      const campMap: Record<string, number> = {};
      const storeLeadMap: Record<string, number> = {};
      allLeads30.forEach((l) => {
        const m = l.metadata || {};
        const src = (m.utm_source || m.source || "مباشر").toString().slice(0, 24);
        srcMap[src] = (srcMap[src] || 0) + 1;
        if (m.utm_campaign) {
          const c = String(m.utm_campaign).slice(0, 32);
          campMap[c] = (campMap[c] || 0) + 1;
        }
        if (m.store_id) {
          storeLeadMap[m.store_id] = (storeLeadMap[m.store_id] || 0) + 1;
        }
      });
      const spinSrc = ((sourcesSpins as any).data ?? []) as any[];
      spinSrc.forEach((s) => {
        const src = (s.utm_source || "مباشر").toString().slice(0, 24);
        srcMap[src] = (srcMap[src] || 0) + 1;
        if (s.utm_campaign) {
          const c = String(s.utm_campaign).slice(0, 32);
          campMap[c] = (campMap[c] || 0) + 1;
        }
      });
      const toRanked = (m: Record<string, number>): RankRow[] =>
        Object.entries(m).map(([k, v]) => ({ key: k, label: k, value: v }))
          .sort((a, b) => b.value - a.value).slice(0, 6);
      setTopSources(toRanked(srcMap));
      setTopCampaigns(toRanked(campMap));

      const storeIdx: Record<string, string> = {};
      ((storesIndex as any).data ?? []).forEach((s: any) => { storeIdx[s.id] = s.name_ar; });
      setTopStoreLeads(
        Object.entries(storeLeadMap)
          .map(([k, v]) => ({ key: k, label: storeIdx[k] || k.slice(0, 8), value: v }))
          .sort((a, b) => b.value - a.value).slice(0, 6)
      );

      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, canManageContent, isAdmin]);

  const criticalCount = useMemo(() =>
    (kpis?.socialPending ?? 0) + (kpis?.syncErrors ?? 0) + (kpis?.edgeErrors24h ?? 0)
  , [kpis]);

  if (authLoading) {
    return <div className="min-h-screen bg-background grid place-items-center text-muted-foreground">جاري التحميل...</div>;
  }
  if (!user || !canManageContent) return null;

  const maxRank = (rows: RankRow[]) => Math.max(1, ...rows.map((r) => r.value));

  return (
    <AdminShell>
      <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-5">
        <AdminPageHeader
          title="غرفة العمليات التنفيذية"
          subtitle={isAdmin
            ? "نظرة شاملة على الأداء، حركة الزوار، التحويلات، والصحة التشغيلية."
            : "نظرة على المحتوى والعروض والمحلات."}
          actions={
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/stores"><Button variant="cta" size="sm" className="gap-1"><Plus className="w-4 h-4" /> محل جديد</Button></Link>
              <Link to="/admin/qr-campaigns"><Button variant="outline" size="sm" className="gap-1"><QrCode className="w-4 h-4" /> حملات QR</Button></Link>
              <Link to="/admin/social-offers"><Button variant="outline" size="sm" className="gap-1"><Bell className="w-4 h-4" /> السوشيال</Button></Link>
            </div>
          }
        />

        {/* Critical alerts bar */}
        {criticalCount > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 flex flex-wrap items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1 min-w-[200px]">
              <div className="font-bold text-sm text-foreground">{criticalCount} عنصر يحتاج انتباهك</div>
              <div className="text-xs text-muted-foreground">
                {kpis?.socialPending ? `${kpis.socialPending} مراجعة سوشيال · ` : ""}
                {kpis?.syncErrors ? `${kpis.syncErrors} خطأ مزامنة · ` : ""}
                {kpis?.edgeErrors24h ? `${kpis.edgeErrors24h} خطأ نظام (24س)` : ""}
              </div>
            </div>
          </div>
        )}

        {/* === Executive KPIs === */}
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-bold text-muted-foreground tracking-wide">المؤشرات التنفيذية · آخر 7 أيام</h2>
            <span className="text-[0.65rem] text-muted-foreground">مقارنة بالأسبوع السابق</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3">
            <AdminStatCard
              label="عملاء محتملون"
              value={kpis?.leads7d ?? "—"}
              hint={kpis ? `${pctDelta(kpis.leads7d, kpis.leadsPrev7d)} · سابق ${kpis.leadsPrev7d}` : undefined}
              icon={Users}
              tone={kpis ? deltaTone(kpis.leads7d, kpis.leadsPrev7d) === "success" ? "success" : "info" : "info"}
              loading={loading}
            />
            {isAdmin && (
              <AdminStatCard
                label="تسجيلات الأسبوع"
                value={kpis?.spins7d ?? "—"}
                hint={kpis ? `${pctDelta(kpis.spins7d, kpis.spinsPrev7d)} · أدر واربح` : undefined}
                icon={Sparkles}
                tone="warning"
                loading={loading}
              />
            )}
            <AdminStatCard
              label="نقرات واتساب"
              value={whatsappClicks || "—"}
              hint="آخر 30 يوم"
              icon={MessageCircle}
              tone="success"
              loading={loading}
            />
            <AdminStatCard
              label="نقرات الاتجاهات"
              value={directionsClicks || "—"}
              hint="آخر 30 يوم"
              icon={Navigation}
              tone="info"
              loading={loading}
            />
            <AdminStatCard
              label="مسح QR"
              value={kpis?.qrScansTotal ?? "—"}
              hint="إجمالي الحملات"
              icon={QrCode}
              tone="info"
              loading={loading}
            />
            <AdminStatCard
              label="عروض مباشرة"
              value={kpis?.dealsLive ?? "—"}
              hint={kpis ? `${kpis.dealsExpiringSoon} ينتهي قريباً` : undefined}
              icon={Tag}
              tone="success"
              loading={loading}
            />
            <AdminStatCard
              label="المحلات"
              value={kpis?.storesTotal ?? "—"}
              hint={kpis ? `${kpis.storesActive} نشِط · ${kpis.storesOpeningSoon} قريب` : undefined}
              icon={Store}
              tone="info"
              loading={loading}
            />
            <AdminStatCard
              label="ربط خارجي"
              value={kpis?.connectorsLinked ?? "—"}
              hint={kpis?.syncErrors ? `${kpis.syncErrors} خطأ` : "كل الربط سليم"}
              icon={Link2}
              tone={kpis && kpis.syncErrors > 0 ? "danger" : "info"}
              loading={loading}
            />
          </div>
        </section>

        {/* === Traffic & Conversion timeline === */}
        <AdminSectionCard
          title="حركة التحويلات · آخر 14 يوم"
          action={<span className="text-[0.7rem] text-muted-foreground inline-flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> العملاء + تسجيلات أدر واربح</span>}
        >
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : timeline.every((t) => t.leads === 0 && t.spins === 0) ? (
            <AdminEmptyState icon={TrendingUp} title="لا توجد بيانات تحويلات بعد" description="ستبدأ الأرقام بالظهور فور وصول أول العملاء." />
          ) : (
            <div className="h-56 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gSpins" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(38 92% 50%)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8, fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="leads" name="عملاء" stroke="hsl(var(--primary))" fill="url(#gLeads)" strokeWidth={2} />
                  {isAdmin && <Area type="monotone" dataKey="spins" name="أدر واربح" stroke="hsl(38 92% 50%)" fill="url(#gSpins)" strokeWidth={2} />}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </AdminSectionCard>

        {/* === Top sources / campaigns / stores === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <RankBlock title="أعلى مصادر الزيارات" icon={Globe} rows={topSources} loading={loading} href="/admin/reports/traffic" />
          <RankBlock title="أفضل الحملات" icon={Megaphone} rows={topCampaigns} loading={loading} emptyHint="أضف utm_campaign في الروابط." href="/admin/reports/campaigns" />
          <RankBlock title="أعلى محلات تجذب العملاء" icon={Store} rows={topStoreLeads} loading={loading} emptyHint="لا توجد عملاء مرتبطين بمحلات بعد." href="/admin/reports/stores" />
        </div>

        {/* === Operations grid === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main column 2/3 */}
          <div className="lg:col-span-2 space-y-5">
            <AdminSectionCard
              title="طابور المراجعة"
              action={<Link to="/admin/social-offers" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">الكل <ArrowLeft className="w-3 h-3" /></Link>}
            >
              {loading ? (
                <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <AdminSectionCard
                title="عروض تنتهي قريباً"
                action={<Link to="/admin/offers" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">المسار <ArrowLeft className="w-3 h-3" /></Link>}
              >
                {loading ? (
                  <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : expiring.length === 0 ? (
                  <AdminEmptyState icon={CalendarClock} title="لا توجد عروض تنتهي قريباً" />
                ) : (
                  <ul className="divide-y divide-border">
                    {expiring.map((o) => {
                      const d = daysUntil(o.valid_to);
                      const tone = d !== null && d <= 1 ? "danger" : d !== null && d <= 3 ? "warning" : "info";
                      return (
                        <li key={o.id}>
                          <Link to={`/admin/offers`} className="flex items-center gap-2 py-2 hover:bg-secondary/40 px-2 -mx-2 rounded-md">
                            <AdminStatusBadge tone={tone}>{d !== null ? (d <= 0 ? "اليوم" : `${d}ي`) : "—"}</AdminStatusBadge>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-foreground truncate">{o.title_ar}</div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </AdminSectionCard>

              <AdminSectionCard
                title="محلات يُفتتح قريباً"
                action={<Link to="/admin/stores" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">المحلات <ArrowLeft className="w-3 h-3" /></Link>}
              >
                {loading ? (
                  <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : openingSoon.length === 0 ? (
                  <AdminEmptyState icon={Rocket} title="لا توجد محلات قيد الافتتاح" />
                ) : (
                  <ul className="divide-y divide-border">
                    {openingSoon.map((s) => {
                      const gaps: string[] = [];
                      if (s.status === "hidden") gaps.push("مخفي");
                      if (!s.logo_url) gaps.push("بدون شعار");
                      if (!s.external_store_type || s.external_store_type === "none") gaps.push("بدون ربط");
                      return (
                        <li key={s.id}>
                          <Link to={`/admin/stores/${s.id}`} className="flex items-center gap-2 py-2 hover:bg-secondary/40 px-2 -mx-2 rounded-md">
                            <div className="w-7 h-7 rounded bg-secondary grid place-items-center overflow-hidden shrink-0">
                              {s.logo_url ? <img src={s.logo_url} alt="" className="w-full h-full object-contain" /> : <Store className="w-3.5 h-3.5 text-muted-foreground" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-foreground truncate">{s.name_ar}</div>
                              <div className="text-[0.65rem] text-muted-foreground truncate">{gaps.length ? gaps.join(" · ") : "جاهز للنشر"}</div>
                            </div>
                            {gaps.length > 0 && <AdminStatusBadge tone="warning">{gaps.length}</AdminStatusBadge>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </AdminSectionCard>
            </div>

            {/* Activity center */}
            {isAdmin && (
              <AdminSectionCard
                title="مركز النشاط · آخر التعديلات"
                action={<Link to="/admin/edge-logs" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">السجلات <ArrowLeft className="w-3 h-3" /></Link>}
              >
                {loading ? (
                  <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}</div>
                ) : activity.length === 0 ? (
                  <AdminEmptyState icon={Activity} title="لا يوجد نشاط مسجل بعد" />
                ) : (
                  <ul className="divide-y divide-border">
                    {activity.slice(0, 8).map((a) => (
                      <li key={a.id} className="flex items-center justify-between gap-2 py-2 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <AdminStatusBadge tone={a.action === "DELETE" ? "danger" : a.action === "INSERT" ? "success" : "info"}>
                            {a.action === "INSERT" ? "إضافة" : a.action === "UPDATE" ? "تعديل" : a.action === "DELETE" ? "حذف" : a.action}
                          </AdminStatusBadge>
                          <span className="font-mono text-muted-foreground truncate">{a.table}</span>
                          {a.actor && <span className="text-[0.65rem] text-muted-foreground truncate hidden sm:inline">· {a.actor.slice(0, 8)}</span>}
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

          {/* Side column 1/3 */}
          <div className="space-y-5">
            <AdminSectionCard
              title="مشاكل ربط ومزامنة"
              action={<RefreshCw className="w-4 h-4 text-muted-foreground" />}
            >
              {loading ? (
                <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : syncIssues.length === 0 ? (
                <AdminEmptyState icon={Link2} title="كل الواجهات سليمة" />
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
                            {s.external_store_type || "—"} · {s.last_sync_at ? new Date(s.last_sync_at).toLocaleDateString("ar-EG") : "بدون مزامنة"}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </AdminSectionCard>

            <AdminSectionCard
              title="حملات QR الأفضل أداءً"
              action={<Link to="/admin/qr-campaigns" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">إدارة <ArrowLeft className="w-3 h-3" /></Link>}
            >
              {loading ? (
                <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : qrCampaigns.length === 0 ? (
                <AdminEmptyState icon={QrCode} title="لم تُنشأ حملات QR بعد" />
              ) : (
                <ul className="divide-y divide-border">
                  {qrCampaigns.map((q) => (
                    <li key={q.id} className="py-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-bold text-foreground truncate">{q.name_ar}</div>
                        <span className="text-[0.65rem] text-muted-foreground shrink-0">{q.utm_campaign}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[0.7rem] text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><QrCode className="w-3 h-3" /> {q.scan_count}</span>
                        <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" /> {q.lead_count}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </AdminSectionCard>

            {isAdmin && (
              <AdminSectionCard
                title="صحة النظام"
                action={<Link to="/admin/edge-logs" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">السجلات <ArrowLeft className="w-3 h-3" /></Link>}
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
                        {e.error_message && <div className="text-[0.7rem] text-muted-foreground mt-1 line-clamp-2">{e.error_message}</div>}
                      </li>
                    ))}
                  </ul>
                )}
              </AdminSectionCard>
            )}

            <AdminSectionCard title="إجراءات سريعة">
              <div className="grid grid-cols-2 gap-2">
                <Link to="/admin/stores"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Store className="w-4 h-4" /> المحلات</Button></Link>
                <Link to="/admin/products"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><ShoppingBag className="w-4 h-4" /> المنتجات</Button></Link>
                <Link to="/admin/offers"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Tag className="w-4 h-4" /> العروض</Button></Link>
                <Link to="/admin/leads"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Users className="w-4 h-4" /> العملاء</Button></Link>
                {isAdmin && <Link to="/admin/launch-readiness"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Rocket className="w-4 h-4" /> الإطلاق</Button></Link>}
                {isAdmin && <Link to="/admin/qr-campaigns"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><QrCode className="w-4 h-4" /> QR</Button></Link>}
              </div>
            </AdminSectionCard>
          </div>
        </div>
      </div>
    </AdminShell>
  );
};

/** Ranked horizontal bar list — used for sources, campaigns, stores. */
function RankBlock({
  title, icon: Icon, rows, loading, emptyHint, href,
}: {
  title: string; icon: typeof Globe; rows: RankRow[]; loading: boolean; emptyHint?: string; href?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <AdminSectionCard
      title={title}
      action={href ? (
        <Link to={href} className="text-[0.7rem] font-bold text-primary hover:underline inline-flex items-center gap-1">
          عرض التقرير <ArrowLeft className="w-3 h-3" />
        </Link>
      ) : <Icon className="w-4 h-4 text-muted-foreground" />}
    >
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-7 w-full" />)}</div>
      ) : rows.length === 0 ? (
        <AdminEmptyState icon={Icon} title="لا توجد بيانات بعد" description={emptyHint} />
      ) : (
        <ul className="space-y-2.5">
          {rows.map((r) => (
            <li key={r.key}>
              <div className="flex items-center justify-between gap-2 text-xs mb-1">
                <span className="font-bold text-foreground truncate">{r.label}</span>
                <span className="text-muted-foreground shrink-0">{r.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.max(6, (r.value / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminSectionCard>
  );
}

export default AdminDashboard;
