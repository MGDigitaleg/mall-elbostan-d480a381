import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRequireMerchant } from "@/hooks/useMerchant";
import { MerchantShell } from "@/components/merchant/MerchantShell";
import { AdminPageHeader, AdminStatCard, AdminSectionCard, AdminStatusBadge, AdminEmptyState } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Package, Tag, MessageSquare, Plug, AlertTriangle, Plus, Pencil,
  Image as ImageIcon, Store as StoreIcon, MessageCircle, Navigation, TrendingUp,
} from "lucide-react";
import { LIFECYCLE_META } from "@/lib/storeLifecycle";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

interface Counts {
  productsPublished: number;
  productsDraft: number;
  offersLive: number;
  offersExpiring: number;
  leads30d: number;
  whatsappClicks: number;
  directionsClicks: number;
  topProduct: string | null;
  topOffer: string | null;
}

type TimelinePoint = { date: string; label: string; leads: number };

const dayKey = (d: Date) => d.toISOString().slice(0, 10);
const arDay = (d: Date) => d.toLocaleDateString("ar-EG", { day: "numeric", month: "short" });

export default function MerchantOverview() {
  const { loading, activeStore, stores } = useRequireMerchant();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);

  useEffect(() => {
    if (!activeStore) return;
    (async () => {
      const sevenDaysAhead = new Date(Date.now() + 7 * 86400000).toISOString();
      const thirtyAgo = new Date(Date.now() - 30 * 86400000).toISOString();
      const fourteenAgo = new Date(Date.now() - 13 * 86400000); fourteenAgo.setHours(0,0,0,0);

      const [pPub, pDraft, oLive, oExp, leadsRows, topProd, topOff] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("store_id", activeStore.id).eq("status", "published"),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("store_id", activeStore.id).eq("status", "draft"),
        supabase.from("deals").select("id", { count: "exact", head: true }).eq("store_id", activeStore.id).eq("is_live", true),
        supabase.from("deals").select("id", { count: "exact", head: true }).eq("store_id", activeStore.id).eq("is_live", true).not("valid_to", "is", null).lte("valid_to", sevenDaysAhead),
        supabase.from("leads").select("metadata, created_at").gte("created_at", thirtyAgo).limit(2000),
        supabase.from("products").select("name_ar").eq("store_id", activeStore.id).eq("status", "published").eq("featured", true).order("updated_at", { ascending: false }).limit(1),
        supabase.from("deals").select("title_ar").eq("store_id", activeStore.id).eq("is_live", true).order("featured", { ascending: false }).order("created_at", { ascending: false }).limit(1),
      ]);

      // Scope leads to this store via metadata.store_id
      const scoped = (leadsRows.data ?? []).filter((l: any) => l.metadata?.store_id === activeStore.id);
      const wa = scoped.filter((l: any) => {
        const tags: string[] = Array.isArray(l.metadata?.tags) ? l.metadata.tags : [];
        return tags.includes("whatsapp") || l.metadata?.source === "whatsapp_click";
      }).length;
      const dir = scoped.filter((l: any) => {
        const tags: string[] = Array.isArray(l.metadata?.tags) ? l.metadata.tags : [];
        return tags.includes("directions") || l.metadata?.source === "directions_click";
      }).length;

      // 14-day timeline
      const buckets: Record<string, number> = {};
      const out: TimelinePoint[] = [];
      for (let i = 0; i < 14; i++) {
        const d = new Date(fourteenAgo); d.setDate(d.getDate() + i);
        const k = dayKey(d);
        buckets[k] = 0;
        out.push({ date: k, label: arDay(d), leads: 0 });
      }
      scoped.forEach((l: any) => {
        const k = (l.created_at as string).slice(0, 10);
        if (k in buckets) buckets[k] += 1;
      });
      out.forEach((p) => (p.leads = buckets[p.date] || 0));

      setTimeline(out);
      setCounts({
        productsPublished: pPub.count ?? 0,
        productsDraft: pDraft.count ?? 0,
        offersLive: oLive.count ?? 0,
        offersExpiring: oExp.count ?? 0,
        leads30d: scoped.length,
        whatsappClicks: wa,
        directionsClicks: dir,
        topProduct: (topProd.data?.[0] as any)?.name_ar ?? null,
        topOffer: (topOff.data?.[0] as any)?.title_ar ?? null,
      });
    })();
  }, [activeStore?.id]);

  if (loading) {
    return <MerchantShell><div className="text-sm text-muted-foreground">جاري التحميل…</div></MerchantShell>;
  }

  if (!activeStore && stores.length === 0) {
    return (
      <MerchantShell>
        <AdminEmptyState
          icon={StoreIcon}
          title="لم يتم ربط أي متجر بحسابك بعد"
          description="يرجى التواصل مع إدارة مول البستان لربط متجرك بحسابك حتى تتمكن من الوصول إلى البوابة."
        />
      </MerchantShell>
    );
  }

  if (!activeStore) return null;

  const lifecycle = LIFECYCLE_META[activeStore.lifecycle_status as keyof typeof LIFECYCLE_META] ?? { label: activeStore.lifecycle_status, tone: "neutral" as const };
  const isPublished = activeStore.status === "published";
  const externalConnected = activeStore.external_store_type && activeStore.external_store_type !== "none";
  const syncOk = activeStore.sync_status !== "error";

  return (
    <MerchantShell>
      <AdminPageHeader
        title={`أهلاً بك في بوابة ${activeStore.name_ar}`}
        subtitle="نظرة سريعة على نشاط متجرك داخل مول البستان"
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1">
              <Link to="/merchant/store"><Pencil className="w-4 h-4" /> تعديل المتجر</Link>
            </Button>
            <Button asChild size="sm" className="gap-1">
              <Link to="/merchant/products"><Plus className="w-4 h-4" /> منتج جديد</Link>
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <AdminStatusBadge tone={isPublished ? "success" : "warning"}>
          {isPublished ? "ظاهر للعامة" : "غير منشور"}
        </AdminStatusBadge>
        <AdminStatusBadge tone={lifecycle.tone as any}>{lifecycle.label}</AdminStatusBadge>
        {activeStore.featured && <AdminStatusBadge tone="info">مميّز</AdminStatusBadge>}
        <AdminStatusBadge tone={externalConnected ? (syncOk ? "success" : "danger") : "neutral"}>
          {externalConnected ? `متصل: ${activeStore.external_store_type}${syncOk ? "" : " · خطأ مزامنة"}` : "بدون متجر خارجي"}
        </AdminStatusBadge>
      </div>

      {/* KPI grid — merchant-scoped */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <AdminStatCard label="منتجات منشورة" value={counts?.productsPublished ?? "—"} icon={Package} tone="success" />
        <AdminStatCard label="مسودات منتجات" value={counts?.productsDraft ?? "—"} icon={Package} tone="warning" />
        <AdminStatCard label="عروض حالية" value={counts?.offersLive ?? "—"} icon={Tag} tone="info" />
        <AdminStatCard label="تنتهي خلال 7 أيام" value={counts?.offersExpiring ?? "—"} icon={AlertTriangle} tone={counts?.offersExpiring ? "warning" : "neutral"} />
        <AdminStatCard label="استفسارات (30 يوم)" value={counts?.leads30d ?? "—"} icon={MessageSquare} tone="neutral" />
      </div>

      {/* Engagement strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <AdminStatCard label="نقرات واتساب" value={counts?.whatsappClicks ?? "—"} icon={MessageCircle} tone="success" />
        <AdminStatCard label="نقرات الاتجاهات" value={counts?.directionsClicks ?? "—"} icon={Navigation} tone="info" />
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-[0.72rem] font-bold text-muted-foreground">أبرز منتج</div>
          <div className="text-sm font-bold text-foreground mt-1 truncate">{counts?.topProduct ?? "—"}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-[0.72rem] font-bold text-muted-foreground">أبرز عرض</div>
          <div className="text-sm font-bold text-foreground mt-1 truncate">{counts?.topOffer ?? "—"}</div>
        </div>
      </div>

      {/* Timeline */}
      <AdminSectionCard
        title="استفسارات متجرك · آخر 14 يوم"
        action={<span className="text-[0.7rem] text-muted-foreground inline-flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> بيانات متجرك فقط</span>}
      >
        {timeline.length === 0 || timeline.every((p) => p.leads === 0) ? (
          <AdminEmptyState icon={TrendingUp} title="لا توجد استفسارات بعد" description="ستظهر هنا فور تواصل أول عميل مع متجرك." />
        ) : (
          <div className="h-44 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gMerLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="leads" name="استفسارات" stroke="hsl(var(--primary))" fill="url(#gMerLeads)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </AdminSectionCard>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-bold text-foreground mb-3">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline" className="justify-start gap-2"><Link to="/merchant/products"><Plus className="w-4 h-4" /> إضافة منتج</Link></Button>
            <Button asChild variant="outline" className="justify-start gap-2"><Link to="/merchant/offers"><Tag className="w-4 h-4" /> عرض جديد</Link></Button>
            <Button asChild variant="outline" className="justify-start gap-2"><Link to="/merchant/store"><Pencil className="w-4 h-4" /> تحديث بيانات المتجر</Link></Button>
            <Button asChild variant="outline" className="justify-start gap-2"><Link to="/merchant/media"><ImageIcon className="w-4 h-4" /> رفع وسائط</Link></Button>
            <Button asChild variant="outline" className="justify-start gap-2 col-span-2"><Link to="/merchant/external"><Plug className="w-4 h-4" /> {externalConnected ? "إدارة المتجر الخارجي" : "ربط متجر خارجي"}</Link></Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-bold text-foreground mb-3">حالة الجاهزية</h2>
          <ul className="space-y-2 text-sm">
            <Check ok={!!activeStore.logo_url} text="شعار المتجر مرفوع" to="/merchant/media" />
            <Check ok={!!activeStore.short_description_ar} text="وصف مختصر للمتجر" to="/merchant/store" />
            <Check ok={!!(activeStore.phone || activeStore.whatsapp)} text="معلومات تواصل" to="/merchant/store" />
            <Check ok={!!externalConnected} text="ربط متجر خارجي (اختياري)" to="/merchant/external" />
            <Check ok={(counts?.productsPublished ?? 0) > 0} text="على الأقل منتج منشور" to="/merchant/products" />
            <Check ok={syncOk} text="حالة المزامنة الخارجية سليمة" to="/merchant/external" />
          </ul>
        </div>
      </div>
    </MerchantShell>
  );
}

function Check({ ok, text, to }: { ok: boolean; text: string; to: string }) {
  return (
    <li className="flex items-center justify-between gap-2 border-b border-border/60 pb-2 last:border-b-0">
      <div className="flex items-center gap-2">
        <AdminStatusBadge tone={ok ? "success" : "warning"}>{ok ? "تم" : "مطلوب"}</AdminStatusBadge>
        <span className="text-foreground">{text}</span>
      </div>
      {!ok && (
        <Link to={to} className="text-xs font-bold text-primary hover:underline">إكمال</Link>
      )}
    </li>
  );
}
