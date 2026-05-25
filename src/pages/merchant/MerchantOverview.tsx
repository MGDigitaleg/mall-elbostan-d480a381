import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRequireMerchant } from "@/hooks/useMerchant";
import { MerchantShell } from "@/components/merchant/MerchantShell";
import { AdminPageHeader, AdminStatCard, AdminStatusBadge, AdminEmptyState } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Package, Tag, MessageSquare, Plug, AlertTriangle, Plus, Pencil, Image as ImageIcon, Store as StoreIcon,
} from "lucide-react";
import { LIFECYCLE_META } from "@/lib/storeLifecycle";

interface Counts {
  productsPublished: number;
  productsDraft: number;
  offersLive: number;
  offersExpiring: number;
  leads7d: number;
}

export default function MerchantOverview() {
  const { loading, activeStore, stores } = useRequireMerchant();
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    if (!activeStore) return;
    (async () => {
      const sevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const [pPub, pDraft, oLive, oExp, lds] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("store_id", activeStore.id).eq("status", "published"),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("store_id", activeStore.id).eq("status", "draft"),
        supabase.from("deals").select("id", { count: "exact", head: true }).eq("store_id", activeStore.id).eq("is_live", true),
        supabase.from("deals").select("id", { count: "exact", head: true }).eq("store_id", activeStore.id).eq("is_live", true).not("valid_to", "is", null).lte("valid_to", sevenDays),
        supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
      ]);
      setCounts({
        productsPublished: pPub.count ?? 0,
        productsDraft: pDraft.count ?? 0,
        offersLive: oLive.count ?? 0,
        offersExpiring: oExp.count ?? 0,
        leads7d: lds.count ?? 0,
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

  const lifecycle = LIFECYCLE_LABELS[activeStore.lifecycle_status as keyof typeof LIFECYCLE_LABELS] ?? { ar: activeStore.lifecycle_status, tone: "neutral" as const };
  const isPublished = activeStore.status === "published";
  const externalConnected = activeStore.external_store_type && activeStore.external_store_type !== "none";

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
        <AdminStatusBadge tone={externalConnected ? "success" : "neutral"}>
          {externalConnected ? `متصل: ${activeStore.external_store_type}` : "بدون متجر خارجي"}
        </AdminStatusBadge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <AdminStatCard label="منتجات منشورة" value={counts?.productsPublished ?? "—"} icon={Package} tone="success" />
        <AdminStatCard label="مسودات منتجات" value={counts?.productsDraft ?? "—"} icon={Package} tone="warning" />
        <AdminStatCard label="عروض حالية" value={counts?.offersLive ?? "—"} icon={Tag} tone="info" />
        <AdminStatCard label="عروض تنتهي خلال 7 أيام" value={counts?.offersExpiring ?? "—"} icon={AlertTriangle} tone={counts?.offersExpiring ? "warning" : "neutral"} />
        <AdminStatCard label="استفسارات (7 أيام)" value={counts?.leads7d ?? "—"} icon={MessageSquare} tone="neutral" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
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
