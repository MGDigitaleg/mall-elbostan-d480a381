import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader, AdminStatusBadge, AdminEmptyState, AdminStatCard } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { downloadCsv } from "@/lib/csvExport";
import {
  Tag, Search, Plus, Eye, EyeOff, Star, StarOff, Trash2, Pencil, Clock,
  XCircle, RotateCcw, Download,
} from "lucide-react";

const COLUMNS = [
  { key: "draft", label: "مسودات", tone: "warning" as const },
  { key: "pending", label: "بانتظار المراجعة", tone: "warning" as const },
  { key: "live", label: "مباشر الآن", tone: "success" as const },
  { key: "featured", label: "في الواجهة", tone: "info" as const },
  { key: "expired", label: "منتهي", tone: "neutral" as const },
  { key: "rejected", label: "مرفوض", tone: "danger" as const },
];

type DealRow = {
  id: string;
  title_ar: string;
  campaign_key: string;
  is_live: boolean;
  featured: boolean;
  valid_from: string | null;
  valid_to: string | null;
  price_current: number | null;
  price_old: number | null;
  image_primary: string | null;
  store_id: string | null;
  source_type: string | null;
  updated_at: string;
};

type IntakeRow = {
  id: string;
  offer_title: string | null;
  source_caption: string | null;
  source_thumbnail_url: string | null;
  source_platform: string;
  source_post_url: string | null;
  store_id: string;
  merchant_id: string;
  review_status: string;
  publish_status: string;
  opening_related: boolean;
  featured: boolean;
  category: string | null;
  current_price: number | null;
  old_price: number | null;
  expires_at: string | null;
  created_at: string;
};

type Bucket = {
  kind: "deal" | "intake";
  id: string;
  title: string;
  image: string | null;
  price_current: number | null;
  price_old: number | null;
  valid_to: string | null;
  is_live: boolean;
  featured: boolean;
  store_id: string | null;
  source_type: string | null;
  opening_related: boolean;
};

export default function AdminOffersPipeline() {
  const { loading: authLoading } = useRequireAdmin();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [openingFilter, setOpeningFilter] = useState<"all" | "yes" | "no">("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "yes" | "no">("all");
  const [publishFilter, setPublishFilter] = useState<"all" | "live" | "draft">("all");

  const { data: deals, isLoading: dealsLoading } = useQuery({
    queryKey: ["admin-offers-pipeline-deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("id,title_ar,campaign_key,is_live,featured,valid_from,valid_to,price_current,price_old,image_primary,store_id,source_type,updated_at")
        .order("updated_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as DealRow[];
    },
  });

  const { data: intake, isLoading: intakeLoading } = useQuery({
    queryKey: ["admin-offers-pipeline-intake"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_offer_intake")
        .select("id,offer_title,source_caption,source_thumbnail_url,source_platform,source_post_url,store_id,merchant_id,review_status,publish_status,opening_related,featured,category,current_price,old_price,expires_at,created_at")
        .order("created_at", { ascending: false })
        .limit(400);
      if (error) throw error;
      return (data ?? []) as IntakeRow[];
    },
  });

  const { data: stores } = useQuery({
    queryKey: ["admin-offers-stores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("id,name_ar")
        .order("name_ar");
      if (error) throw error;
      return data ?? [];
    },
  });

  const storeMap = useMemo(
    () => Object.fromEntries((stores ?? []).map((s) => [s.id, s.name_ar])),
    [stores],
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    (intake ?? []).forEach((i) => i.category && set.add(i.category));
    return Array.from(set).sort();
  }, [intake]);

  const sources = useMemo(() => {
    const set = new Set<string>();
    (deals ?? []).forEach((d) => d.source_type && set.add(d.source_type));
    (intake ?? []).forEach((i) => set.add(i.source_platform));
    return Array.from(set).sort();
  }, [deals, intake]);

  const passFilters = (b: Bucket & { category?: string | null }) => {
    if (storeFilter !== "all" && b.store_id !== storeFilter) return false;
    if (categoryFilter !== "all" && (b.category ?? null) !== categoryFilter) return false;
    if (sourceFilter !== "all" && (b.source_type ?? null) !== sourceFilter) return false;
    if (openingFilter === "yes" && !b.opening_related) return false;
    if (openingFilter === "no" && b.opening_related) return false;
    if (featuredFilter === "yes" && !b.featured) return false;
    if (featuredFilter === "no" && b.featured) return false;
    if (publishFilter === "live" && !b.is_live) return false;
    if (publishFilter === "draft" && b.is_live) return false;
    const q = search.trim().toLowerCase();
    if (q && !b.title?.toLowerCase().includes(q)) return false;
    return true;
  };

  const now = Date.now();
  const buckets = useMemo(() => {
    const b: Record<string, (Bucket & { category?: string | null })[]> = {
      draft: [], pending: [], live: [], featured: [], expired: [], rejected: [],
    };

    (deals ?? []).forEach((d) => {
      const bucket: Bucket & { category?: string | null } = {
        kind: "deal",
        id: d.id,
        title: d.title_ar,
        image: d.image_primary,
        price_current: d.price_current,
        price_old: d.price_old,
        valid_to: d.valid_to,
        is_live: d.is_live,
        featured: d.featured,
        store_id: d.store_id,
        source_type: d.source_type,
        opening_related: d.campaign_key === "opening",
        category: null,
      };
      if (!passFilters(bucket)) return;
      const expired = d.valid_to && new Date(d.valid_to).getTime() < now;
      if (expired) b.expired.push(bucket);
      else if (d.featured && d.is_live) b.featured.push(bucket);
      else if (d.is_live) b.live.push(bucket);
      else b.draft.push(bucket);
    });

    (intake ?? []).forEach((i) => {
      const bucket: Bucket & { category?: string | null } = {
        kind: "intake",
        id: i.id,
        title: i.offer_title || i.source_caption?.slice(0, 60) || "منشور بدون عنوان",
        image: i.source_thumbnail_url,
        price_current: i.current_price,
        price_old: i.old_price,
        valid_to: i.expires_at,
        is_live: i.publish_status === "published",
        featured: i.featured,
        store_id: i.store_id,
        source_type: i.source_platform,
        opening_related: i.opening_related,
        category: i.category,
      };
      if (!passFilters(bucket)) return;
      if (i.review_status === "rejected") b.rejected.push(bucket);
      else if (i.review_status === "detected" || i.review_status === "pending_review") b.pending.push(bucket);
    });

    return b;
  }, [deals, intake, now, search, storeFilter, categoryFilter, sourceFilter, openingFilter, featuredFilter, publishFilter]);

  const updateDealMut = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { error } = await supabase.from("deals").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-offers-pipeline-deals"] });
      toast({ title: "تم التحديث" });
    },
    onError: (e: Error) => toast({ title: "خطأ", description: e.message, variant: "destructive" }),
  });

  const deleteDealMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("deals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-offers-pipeline-deals"] });
      toast({ title: "تم الحذف" });
    },
  });

  const restoreIntakeMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("social_offer_intake")
        .update({ review_status: "pending_review", publish_status: "draft" } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-offers-pipeline-intake"] });
      toast({ title: "تم إرجاع المنشور إلى طابور المراجعة" });
    },
  });

  const exportCsv = () => {
    const allBuckets = Object.entries(buckets).flatMap(([col, rows]) =>
      rows.map((r) => ({ col, ...r })),
    );
    downloadCsv(`offers-${new Date().toISOString().slice(0, 10)}.csv`, allBuckets, [
      { header: "column", value: (r) => r.col },
      { header: "kind", value: (r) => r.kind },
      { header: "title", value: (r) => r.title },
      { header: "store", value: (r) => storeMap[r.store_id ?? ""] ?? "" },
      { header: "price_current", value: (r) => r.price_current ?? "" },
      { header: "price_old", value: (r) => r.price_old ?? "" },
      { header: "valid_to", value: (r) => r.valid_to ?? "" },
      { header: "featured", value: (r) => (r.featured ? "نعم" : "لا") },
      { header: "opening_related", value: (r) => (r.opening_related ? "نعم" : "لا") },
      { header: "source_type", value: (r) => r.source_type ?? "" },
    ]);
  };

  if (authLoading) return null;
  const isLoading = dealsLoading || intakeLoading;

  return (
    <AdminShell>
      <div className="max-w-[1600px] mx-auto p-4 md:p-6">
        <AdminPageHeader
          title="مسار العروض"
          subtitle="نظرة موحَّدة على دورة حياة العروض من الاكتشاف والمراجعة حتى النشر والانتهاء"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={exportCsv}>
                <Download className="w-4 h-4" /> تصدير
              </Button>
              <Link to="/admin/social-offers">
                <Button variant="outline" size="sm">من السوشيال</Button>
              </Link>
              <Link to="/admin/deals">
                <Button size="sm" className="gap-1">
                  <Plus className="w-4 h-4" /> عرض جديد
                </Button>
              </Link>
            </div>
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-5">
          {COLUMNS.map((c) => (
            <AdminStatCard
              key={c.key}
              label={c.label}
              value={buckets[c.key].length}
              tone={c.tone}
              icon={Tag}
              loading={isLoading}
            />
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-3 mb-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث في العروض..."
              className="pr-9"
            />
          </div>

          <Select value={storeFilter} onValueChange={setStoreFilter}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="المتجر" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المحلات</SelectItem>
              {(stores ?? []).map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name_ar}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="الفئة" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الفئات</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="المصدر" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المصادر</SelectItem>
              {sources.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={openingFilter} onValueChange={(v: typeof openingFilter) => setOpeningFilter(v)}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">افتتاح: الكل</SelectItem>
              <SelectItem value="yes">افتتاح فقط</SelectItem>
              <SelectItem value="no">بدون افتتاح</SelectItem>
            </SelectContent>
          </Select>

          <Select value={featuredFilter} onValueChange={(v: typeof featuredFilter) => setFeaturedFilter(v)}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">مميَّز: الكل</SelectItem>
              <SelectItem value="yes">مميَّز فقط</SelectItem>
              <SelectItem value="no">غير مميَّز</SelectItem>
            </SelectContent>
          </Select>

          <Select value={publishFilter} onValueChange={(v: typeof publishFilter) => setPublishFilter(v)}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">النشر: الكل</SelectItem>
              <SelectItem value="live">مباشر</SelectItem>
              <SelectItem value="draft">غير مباشر</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {COLUMNS.map((col) => (
            <div key={col.key} className="rounded-xl border border-border bg-card flex flex-col min-h-[320px]">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                <h3 className="font-bold text-sm text-foreground">{col.label}</h3>
                <AdminStatusBadge tone={col.tone}>{buckets[col.key].length}</AdminStatusBadge>
              </div>
              <div className="p-2 space-y-2 overflow-y-auto max-h-[70vh]">
                {buckets[col.key].length === 0 ? (
                  <div className="text-xs text-muted-foreground text-center py-6">لا يوجد</div>
                ) : (
                  buckets[col.key].map((d) => (
                    <article key={`${d.kind}-${d.id}`} className="rounded-lg border border-border bg-background p-2.5">
                      <div className="flex gap-2">
                        <div className="w-12 h-12 rounded-md bg-secondary overflow-hidden shrink-0">
                          {d.image && (
                            <img src={d.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-foreground text-sm truncate flex items-center gap-1">
                            {d.kind === "intake" && (
                              <span className="text-[0.6rem] bg-primary/10 text-primary px-1 rounded">سوشيال</span>
                            )}
                            {d.title}
                          </div>
                          <div className="text-[0.7rem] text-muted-foreground flex items-center gap-1 mt-0.5 flex-wrap">
                            {d.price_current && <span>{d.price_current} ج.م</span>}
                            {d.price_old && <s className="opacity-60">{d.price_old}</s>}
                            {d.store_id && storeMap[d.store_id] && (
                              <span className="text-[0.65rem] opacity-70">· {storeMap[d.store_id]}</span>
                            )}
                          </div>
                          {d.valid_to && (
                            <div className="text-[0.65rem] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              ينتهي {new Date(d.valid_to).toLocaleDateString("ar-EG")}
                            </div>
                          )}
                        </div>
                      </div>

                      {d.kind === "deal" ? (
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          <Button
                            size="sm" variant="ghost" className="h-7 px-2"
                            title={d.is_live ? "إيقاف" : "نشر مباشر"}
                            onClick={() => updateDealMut.mutate({ id: d.id, patch: { is_live: !d.is_live } })}
                          >
                            {d.is_live ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </Button>
                          <Button
                            size="sm" variant="ghost" className="h-7 px-2"
                            title={d.featured ? "إزالة من الواجهة" : "إضافة للواجهة"}
                            onClick={() => updateDealMut.mutate({ id: d.id, patch: { featured: !d.featured } })}
                          >
                            {d.featured ? <StarOff className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                          </Button>
                          <Link to="/admin/deals" className="ml-auto">
                            <Button size="sm" variant="ghost" className="h-7 px-2">
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          <Button
                            size="sm" variant="ghost"
                            className="h-7 px-2 text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm(`حذف ${d.title}؟`)) deleteDealMut.mutate(d.id);
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          {col.key === "rejected" ? (
                            <Button
                              size="sm" variant="ghost" className="h-7 px-2"
                              title="إرجاع للمراجعة"
                              onClick={() => restoreIntakeMut.mutate(d.id)}
                            >
                              <RotateCcw className="w-3.5 h-3.5 ml-1" /> استعادة
                            </Button>
                          ) : (
                            <Link to={`/admin/social-offers?post=${d.id}`}>
                              <Button size="sm" variant="ghost" className="h-7 px-2">
                                <Pencil className="w-3.5 h-3.5 ml-1" /> فتح المعالج
                              </Button>
                            </Link>
                          )}
                          {col.key === "rejected" && (
                            <span className="ml-auto text-[0.6rem] text-destructive/70 flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> مرفوض
                            </span>
                          )}
                        </div>
                      )}
                    </article>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {!isLoading && (deals?.length ?? 0) === 0 && (intake?.length ?? 0) === 0 && (
          <div className="mt-6">
            <AdminEmptyState
              icon={Tag}
              title="لا توجد عروض بعد"
              description="ابدأ بإنشاء عرض جديد أو استيراد عرض من حسابات السوشيال الخاصة بالمحلات."
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
