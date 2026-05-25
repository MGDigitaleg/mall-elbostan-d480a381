import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRequireAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowRight, Bell, CheckCircle2, Clock, Eye, Inbox, Plus, Store as StoreIcon, ExternalLink, Trash2, XCircle, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SocialOfferConvertWizard } from "@/components/admin/SocialOfferConvertWizard";

type Store = { id: string; name_ar: string; slug: string; logo_url: string | null; opening_status: string | null; branch_context: string | null };
type MonitoredMerchant = {
  id: string; store_id: string; merchant_name: string; store_slug: string;
  branch_context: string; opening_status: string | null; logo_url: string | null;
  monitoring_status: string; monitoring_enabled: boolean;
  keywords_ar: string[]; keywords_en: string[]; opening_keywords: string[];
  admin_notes: string | null; created_at: string;
};
type IntakePost = {
  id: string; merchant_id: string; store_id: string; branch_context: string;
  source_platform: string; source_post_url: string | null; source_caption: string | null;
  source_thumbnail_url: string | null; offer_title: string | null; offer_subtitle: string | null;
  short_specs: string | null; current_price: number | null; old_price: number | null; currency: string;
  opening_related: boolean; review_status: string; publish_status: string;
  published_deal_id: string | null; published_at: string | null; expires_at: string | null;
  featured: boolean; category: string | null; notes: string | null; created_at: string;
};
type Notification = {
  id: string; intake_id: string; merchant_id: string; notification_type: string;
  title_ar: string; body_ar: string | null; thumbnail_url: string | null;
  action_url: string | null; unread: boolean; created_at: string;
};

const REVIEW_LABELS: Record<string, string> = {
  detected: "مكتشف",
  pending_review: "بانتظار المراجعة",
  approved: "معتمد",
  rejected: "مرفوض",
  duplicate: "مكرر",
};
const PUBLISH_LABELS: Record<string, string> = {
  draft: "مسودة",
  published: "منشور",
  archived: "مؤرشف",
};

const AdminSocialOffers = () => {
  useRequireAdmin();
  const qc = useQueryClient();
  const [tab, setTab] = useState("queue");
  const [wizardPostId, setWizardPostId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: merchants = [], isLoading: loadingMerchants } = useQuery({
    queryKey: ["social-monitored-merchants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_monitored_merchants")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as MonitoredMerchant[];
    },
  });

  const { data: posts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ["social-offer-intake"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_offer_intake")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as IntakePost[];
    },
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["social-offer-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_offer_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as Notification[];
    },
  });

  const { data: stores = [] } = useQuery({
    queryKey: ["stores-for-social"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("id, name_ar, slug, logo_url, opening_status, branch_context")
        .neq("status", "hidden")
        .order("name_ar");
      if (error) throw error;
      return (data ?? []) as Store[];
    },
  });

  const pendingPosts = useMemo(
    () => posts.filter((p) => p.review_status === "detected" || p.review_status === "pending_review"),
    [posts]
  );
  const approvedPosts = useMemo(() => posts.filter((p) => p.review_status === "approved"), [posts]);
  const rejectedPosts = useMemo(() => posts.filter((p) => p.review_status === "rejected"), [posts]);
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Auto-open wizard when navigated with ?post=ID
  useEffect(() => {
    const postId = searchParams.get("post");
    if (postId && posts.find((p) => p.id === postId)) {
      setWizardPostId(postId);
    }
  }, [searchParams, posts]);

  const activeWizardPost = wizardPostId ? posts.find((p) => p.id === wizardPostId) ?? null : null;

  const openWizard = (id: string) => setWizardPostId(id);
  const closeWizard = (open: boolean) => {
    if (!open) {
      setWizardPostId(null);
      if (searchParams.get("post")) {
        searchParams.delete("post");
        setSearchParams(searchParams, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-primary hover:underline" aria-label="الرجوع">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-foreground">إدارة العروض من السوشيال</h1>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-primary/15 text-primary border border-primary/30">
              <Bell className="w-3.5 h-3.5 ml-1" /> {unreadCount} إشعار جديد
            </Badge>
          )}
        </div>
      </header>

      <main className="container py-6">
        <Tabs value={tab} onValueChange={setTab} dir="rtl">
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="queue">
              <Inbox className="w-4 h-4 ml-1" /> طابور المراجعة ({pendingPosts.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              <CheckCircle2 className="w-4 h-4 ml-1" /> المعتمدة ({approvedPosts.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              <XCircle className="w-4 h-4 ml-1" /> المرفوضة ({rejectedPosts.length})
            </TabsTrigger>
            <TabsTrigger value="merchants">
              <StoreIcon className="w-4 h-4 ml-1" /> سجل المحلات ({merchants.length})
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 ml-1" /> الإشعارات ({unreadCount}/{notifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                المنشورات المُكتشفة أو المُدخلة يدوياً بانتظار المراجعة. استخدم «معالج التحويل» لإنشاء عرض رسمي منظَّم.
              </p>
              <ManualIntakeDialog merchants={merchants} stores={stores} onSaved={() => qc.invalidateQueries({ queryKey: ["social-offer-intake"] })} />
            </div>
            {loadingPosts ? (
              <p className="text-muted-foreground py-8 text-center">جاري التحميل...</p>
            ) : pendingPosts.length === 0 ? (
              <EmptyState title="لا توجد منشورات بانتظار المراجعة" hint="استخدم زر «إضافة منشور يدوياً» لإدخال عرض من حساب المحل." />
            ) : (
              <div className="grid gap-4">
                {pendingPosts.map((post) => (
                  <PostReviewCard key={post.id} post={post} merchants={merchants} stores={stores} onConvert={openWizard} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {approvedPosts.length === 0 ? (
              <EmptyState title="لا توجد عروض معتمدة بعد" />
            ) : (
              <div className="grid gap-4">
                {approvedPosts.map((post) => (
                  <PostReviewCard key={post.id} post={post} merchants={merchants} stores={stores} onConvert={openWizard} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              المنشورات المرفوضة تبقى متاحة هنا للمراجعة ويمكن إعادتها إلى طابور المراجعة لإعادة تقييمها.
            </p>
            {rejectedPosts.length === 0 ? (
              <EmptyState title="لا توجد منشورات مرفوضة" />
            ) : (
              <div className="grid gap-4">
                {rejectedPosts.map((post) => (
                  <PostReviewCard key={post.id} post={post} merchants={merchants} stores={stores} onConvert={openWizard} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="merchants" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                سجل المحلات المراقَبة لاكتشاف العروض من حساباتها على السوشيال (يدوي + شبه آلي للمرحلة الأولى).
              </p>
              <RegisterMerchantDialog stores={stores} merchants={merchants} onSaved={() => qc.invalidateQueries({ queryKey: ["social-monitored-merchants"] })} />
            </div>
            {loadingMerchants ? (
              <p className="text-muted-foreground py-8 text-center">جاري التحميل...</p>
            ) : merchants.length === 0 ? (
              <EmptyState title="لا توجد محلات مسجَّلة بعد" hint="ابدأ بإضافة محل من القائمة المعتمدة." />
            ) : (
              <div className="grid gap-3">
                {merchants.map((m) => (
                  <MerchantRow key={m.id} merchant={m} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-3">
            {notifications.length === 0 ? (
              <EmptyState title="لا توجد إشعارات" />
            ) : (
              notifications.map((n) => <NotificationRow key={n.id} notif={n} />)
            )}
          </TabsContent>
        </Tabs>
      </main>

      <SocialOfferConvertWizard
        post={activeWizardPost}
        stores={stores}
        open={!!activeWizardPost}
        onOpenChange={closeWizard}
        onConverted={() => {
          qc.invalidateQueries({ queryKey: ["social-offer-intake"] });
          qc.invalidateQueries({ queryKey: ["admin-offers-pipeline-deals"] });
          qc.invalidateQueries({ queryKey: ["admin-offers-pipeline-intake"] });
        }}
      />
    </div>
  );
};

/* ---------- Components ---------- */

function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card-premium p-10 text-center">
      <Inbox className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
      <p className="text-foreground font-semibold">{title}</p>
      {hint && <p className="text-sm text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function PostReviewCard({ post, merchants, stores }: { post: IntakePost; merchants: MonitoredMerchant[]; stores: Store[] }) {
  const qc = useQueryClient();
  const merchant = merchants.find((m) => m.id === post.merchant_id);
  const store = stores.find((s) => s.id === post.store_id);
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["social-offer-intake"] });
    qc.invalidateQueries({ queryKey: ["social-offer-notifications"] });
  };

  const logActivity = async (action_type: string, action_label_ar: string, payload: Record<string, unknown> = {}) => {
    await supabase.from("social_offer_activity_log").insert([
      { intake_id: post.id, action_type, action_label_ar, payload: payload as never },
    ]);
  };

  const reject = async () => {
    setBusy(true);
    const { error } = await supabase
      .from("social_offer_intake")
      .update({ review_status: "rejected", publish_status: "archived" })
      .eq("id", post.id);
    if (error) toast({ title: "تعذّر الرفض", description: error.message, variant: "destructive" });
    else {
      await logActivity("post_rejected", "رفض المنشور");
      toast({ title: "تم رفض المنشور" });
      refresh();
    }
    setBusy(false);
  };

  const approveAndPublish = async () => {
    if (!post.offer_title) {
      toast({ title: "ينقص عنوان العرض", description: "أضف عنواناً قبل الاعتماد والنشر.", variant: "destructive" });
      return;
    }
    if (!store) {
      toast({ title: "المتجر غير موجود", variant: "destructive" });
      return;
    }
    setBusy(true);

    // 1) Create deal in deals table (linked to store)
    const dealPayload = {
      title_ar: post.offer_title,
      description_ar: post.offer_subtitle ?? post.source_caption ?? null,
      specs_short_ar: post.short_specs,
      store_id: post.store_id,
      price_current: post.current_price,
      price_old: post.old_price,
      currency: post.currency || "EGP",
      image_primary: post.source_thumbnail_url,
      source_type: "social_intake",
      source_link: post.source_post_url,
      verified: true,
      is_live: true,
      featured: post.featured,
      opening_status: post.opening_related ? "opening_soon" : "standard",
      campaign_key: post.opening_related ? "opening" : "general",
      valid_from: new Date().toISOString(),
      valid_to: post.expires_at,
    };
    const { data: deal, error: dealErr } = await supabase
      .from("deals")
      .insert(dealPayload)
      .select("id")
      .single();
    if (dealErr || !deal) {
      toast({ title: "تعذّر إنشاء العرض", description: dealErr?.message, variant: "destructive" });
      setBusy(false);
      return;
    }

    // 2) Update intake row → approved + published, link the deal
    const { error: upErr } = await supabase
      .from("social_offer_intake")
      .update({
        review_status: "approved",
        publish_status: "published",
        published_deal_id: deal.id,
        published_at: new Date().toISOString(),
      })
      .eq("id", post.id);
    if (upErr) {
      toast({ title: "تم إنشاء العرض لكن تعذّر تحديث الحالة", description: upErr.message, variant: "destructive" });
    } else {
      await logActivity("post_published", "اعتماد ونشر العرض", { deal_id: deal.id });
      toast({ title: "تم اعتماد العرض ونشره", description: "العرض ظاهر الآن في صفحة العروض وصفحة المتجر." });
    }
    refresh();
    setBusy(false);
  };

  const updateField = async (patch: Partial<IntakePost>) => {
    const { error } = await supabase.from("social_offer_intake").update(patch).eq("id", post.id);
    if (error) toast({ title: "تعذّر التحديث", description: error.message, variant: "destructive" });
    else refresh();
  };

  return (
    <div className="card-premium p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {(post.source_thumbnail_url || merchant?.logo_url) && (
            <img
              src={post.source_thumbnail_url || merchant?.logo_url || ""}
              alt={merchant?.merchant_name ?? ""}
              className="w-14 h-14 rounded-md object-cover bg-muted"
            />
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-foreground truncate">{post.offer_title || merchant?.merchant_name || "بدون عنوان"}</h3>
            <p className="text-xs text-muted-foreground">
              {merchant?.merchant_name} · {post.source_platform} ·{" "}
              <Badge variant="outline" className="ml-1">{REVIEW_LABELS[post.review_status] ?? post.review_status}</Badge>{" "}
              <Badge variant="outline">{PUBLISH_LABELS[post.publish_status] ?? post.publish_status}</Badge>
            </p>
          </div>
        </div>
        {post.source_post_url && (
          <a href={post.source_post_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0">
            <ExternalLink className="w-3.5 h-3.5" /> المصدر
          </a>
        )}
      </div>

      {post.source_caption && (
        <p className="text-sm text-muted-foreground bg-muted/40 rounded p-2 mb-3 whitespace-pre-wrap line-clamp-4">
          {post.source_caption}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div>
          <Label className="text-xs">عنوان العرض (مطلوب للنشر)</Label>
          <Input
            defaultValue={post.offer_title ?? ""}
            onBlur={(e) => e.target.value !== (post.offer_title ?? "") && updateField({ offer_title: e.target.value || null })}
            placeholder="مثال: لابتوب Lenovo IdeaPad 3 — خصم الافتتاح"
          />
        </div>
        <div>
          <Label className="text-xs">عنوان فرعي / مواصفات قصيرة</Label>
          <Input
            defaultValue={post.offer_subtitle ?? ""}
            onBlur={(e) => e.target.value !== (post.offer_subtitle ?? "") && updateField({ offer_subtitle: e.target.value || null })}
          />
        </div>
        <div>
          <Label className="text-xs">السعر الحالي (EGP)</Label>
          <Input
            type="number"
            defaultValue={post.current_price ?? ""}
            onBlur={(e) => {
              const v = e.target.value ? Number(e.target.value) : null;
              if (v !== post.current_price) updateField({ current_price: v });
            }}
          />
        </div>
        <div>
          <Label className="text-xs">السعر القديم</Label>
          <Input
            type="number"
            defaultValue={post.old_price ?? ""}
            onBlur={(e) => {
              const v = e.target.value ? Number(e.target.value) : null;
              if (v !== post.old_price) updateField({ old_price: v });
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {post.review_status !== "approved" && (
          <Button onClick={approveAndPublish} disabled={busy} size="sm">
            <CheckCircle2 className="w-4 h-4 ml-1" /> اعتماد ونشر
          </Button>
        )}
        {post.review_status !== "rejected" && (
          <Button onClick={reject} disabled={busy} size="sm" variant="outline">
            رفض
          </Button>
        )}
        {post.published_deal_id && (
          <Link to={`/daily-deals/offer/${post.published_deal_id}`} target="_blank">
            <Button size="sm" variant="ghost">
              <Eye className="w-4 h-4 ml-1" /> فتح بطاقة العرض
            </Button>
          </Link>
        )}
        {store && (
          <Link to={`/stores/${store.slug}`} target="_blank">
            <Button size="sm" variant="ghost">
              <StoreIcon className="w-4 h-4 ml-1" /> صفحة المتجر
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function MerchantRow({ merchant }: { merchant: MonitoredMerchant }) {
  const qc = useQueryClient();
  const toggleEnabled = async () => {
    const { error } = await supabase
      .from("social_monitored_merchants")
      .update({ monitoring_enabled: !merchant.monitoring_enabled })
      .eq("id", merchant.id);
    if (error) toast({ title: "تعذّر التحديث", description: error.message, variant: "destructive" });
    else qc.invalidateQueries({ queryKey: ["social-monitored-merchants"] });
  };
  const remove = async () => {
    if (!confirm(`حذف ${merchant.merchant_name} من سجل المراقبة؟`)) return;
    const { error } = await supabase.from("social_monitored_merchants").delete().eq("id", merchant.id);
    if (error) toast({ title: "تعذّر الحذف", description: error.message, variant: "destructive" });
    else qc.invalidateQueries({ queryKey: ["social-monitored-merchants"] });
  };
  return (
    <div className="card-premium p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {merchant.logo_url && <img src={merchant.logo_url} alt="" className="w-10 h-10 rounded object-contain bg-muted p-1" />}
        <div className="min-w-0">
          <p className="font-bold text-foreground truncate">{merchant.merchant_name}</p>
          <p className="text-xs text-muted-foreground">
            /{merchant.store_slug} · {merchant.branch_context}
            {merchant.opening_status === "opening_soon" && <Badge className="mr-2 bg-primary/15 text-primary border-primary/30">افتتاح</Badge>}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={merchant.monitoring_enabled ? "default" : "outline"}>
          {merchant.monitoring_enabled ? "مفعّل" : "موقوف"}
        </Badge>
        <Button size="sm" variant="outline" onClick={toggleEnabled}>{merchant.monitoring_enabled ? "إيقاف" : "تفعيل"}</Button>
        <Button size="sm" variant="ghost" onClick={remove} aria-label="حذف"><Trash2 className="w-4 h-4 text-destructive" /></Button>
      </div>
    </div>
  );
}

function NotificationRow({ notif }: { notif: Notification }) {
  const qc = useQueryClient();
  const markRead = async () => {
    await supabase.from("social_offer_notifications").update({ unread: false, read_at: new Date().toISOString() }).eq("id", notif.id);
    qc.invalidateQueries({ queryKey: ["social-offer-notifications"] });
  };
  return (
    <div className={`card-premium p-4 flex items-start justify-between gap-3 ${notif.unread ? "border-primary/40" : "opacity-70"}`}>
      <div className="flex items-start gap-3 min-w-0">
        {notif.thumbnail_url && <img src={notif.thumbnail_url} alt="" className="w-12 h-12 rounded object-cover bg-muted shrink-0" />}
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{notif.title_ar}</p>
          {notif.body_ar && <p className="text-sm text-muted-foreground line-clamp-2">{notif.body_ar}</p>}
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {new Date(notif.created_at).toLocaleString("ar-EG")}
          </p>
        </div>
      </div>
      {notif.unread && <Button size="sm" variant="ghost" onClick={markRead}>تحديد كمقروء</Button>}
    </div>
  );
}

/* ---------- Dialogs ---------- */

function RegisterMerchantDialog({ stores, merchants, onSaved }: { stores: Store[]; merchants: MonitoredMerchant[]; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [storeId, setStoreId] = useState("");
  const [keywordsAr, setKeywordsAr] = useState("");
  const [openingKeywords, setOpeningKeywords] = useState("");
  const [busy, setBusy] = useState(false);

  const usedStoreIds = new Set(merchants.map((m) => m.store_id));
  const availableStores = stores.filter((s) => !usedStoreIds.has(s.id));

  const submit = async () => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) {
      toast({ title: "اختر متجراً", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("social_monitored_merchants").insert({
      store_id: store.id,
      store_slug: store.slug,
      merchant_name: store.name_ar,
      display_name: store.name_ar,
      branch_context: store.branch_context ?? "new-cairo",
      opening_status: store.opening_status,
      logo_url: store.logo_url,
      monitoring_status: "monitoring_enabled",
      monitoring_enabled: true,
      keywords_ar: keywordsAr.split(/[,،\n]/).map((k) => k.trim()).filter(Boolean),
      keywords_en: [],
      opening_keywords: openingKeywords.split(/[,،\n]/).map((k) => k.trim()).filter(Boolean),
    });
    setBusy(false);
    if (error) toast({ title: "تعذّر الحفظ", description: error.message, variant: "destructive" });
    else {
      toast({ title: "تم تسجيل المحل" });
      setOpen(false);
      setStoreId(""); setKeywordsAr(""); setOpeningKeywords("");
      onSaved();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-4 h-4 ml-1" /> إضافة محل للمراقبة</Button>
      </DialogTrigger>
      <DialogContent dir="rtl">
        <DialogHeader><DialogTitle>تسجيل محل في سجل المراقبة</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>المتجر</Label>
            <Select value={storeId} onValueChange={setStoreId}>
              <SelectTrigger><SelectValue placeholder="اختر من المتاجر المعتمدة" /></SelectTrigger>
              <SelectContent>
                {availableStores.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name_ar} ({s.slug})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>كلمات مفتاحية عربية (مفصولة بفاصلة)</Label>
            <Input value={keywordsAr} onChange={(e) => setKeywordsAr(e.target.value)} placeholder="عرض، خصم، افتتاح" />
          </div>
          <div>
            <Label>كلمات مفتاحية لمنشورات الافتتاح</Label>
            <Input value={openingKeywords} onChange={(e) => setOpeningKeywords(e.target.value)} placeholder="افتتاح، البستان، التجمع" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={busy || !storeId}>حفظ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ManualIntakeDialog({ merchants, stores, onSaved }: { merchants: MonitoredMerchant[]; stores: Store[]; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [merchantId, setMerchantId] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [postUrl, setPostUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [openingRelated, setOpeningRelated] = useState(true);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const merchant = merchants.find((m) => m.id === merchantId);
    if (!merchant) {
      toast({ title: "اختر محلاً مسجَّلاً", variant: "destructive" });
      return;
    }
    const store = stores.find((s) => s.id === merchant.store_id);
    setBusy(true);
    const { error } = await supabase.from("social_offer_intake").insert({
      merchant_id: merchant.id,
      store_id: merchant.store_id,
      branch_context: merchant.branch_context,
      source_platform: platform,
      source_post_url: postUrl || null,
      source_thumbnail_url: thumbnail || null,
      source_caption: caption || null,
      offer_title: title || null,
      current_price: currentPrice ? Number(currentPrice) : null,
      old_price: oldPrice ? Number(oldPrice) : null,
      opening_related: openingRelated,
      review_status: "pending_review",
      publish_status: "draft",
      relevance_status: "manual",
      relevance_score: 1,
      source_capture_method: "manual",
      detected_keywords: [],
      raw_payload: { source: "manual_intake", store_slug: store?.slug },
    });
    setBusy(false);
    if (error) toast({ title: "تعذّر الإدخال", description: error.message, variant: "destructive" });
    else {
      toast({ title: "تمت إضافة المنشور", description: "ظهر في طابور المراجعة." });
      setOpen(false);
      setMerchantId(""); setPostUrl(""); setThumbnail(""); setCaption(""); setTitle("");
      setCurrentPrice(""); setOldPrice(""); setOpeningRelated(true);
      onSaved();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Plus className="w-4 h-4 ml-1" /> إضافة منشور يدوياً</Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-w-2xl">
        <DialogHeader><DialogTitle>إدخال يدوي/شبه آلي لمنشور</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>المحل المسجَّل</Label>
              <Select value={merchantId} onValueChange={setMerchantId}>
                <SelectTrigger><SelectValue placeholder="اختر محلاً" /></SelectTrigger>
                <SelectContent>
                  {merchants.map((m) => <SelectItem key={m.id} value={m.id}>{m.merchant_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>المنصة</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>عنوان العرض</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: لابتوب Lenovo — خصم الافتتاح" />
          </div>
          <div>
            <Label>رابط المنشور الأصلي</Label>
            <Input value={postUrl} onChange={(e) => setPostUrl(e.target.value)} placeholder="https://instagram.com/p/..." dir="ltr" />
          </div>
          <div>
            <Label>رابط الصورة المصغّرة</Label>
            <Input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} dir="ltr" />
          </div>
          <div>
            <Label>نص المنشور</Label>
            <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>السعر الحالي</Label>
              <Input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} />
            </div>
            <div>
              <Label>السعر القديم</Label>
              <Input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={openingRelated} onChange={(e) => setOpeningRelated(e.target.checked)} />
            مرتبط بافتتاح المول
          </label>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={busy || !merchantId}>إضافة للطابور</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AdminSocialOffers;
