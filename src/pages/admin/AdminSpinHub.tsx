import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  ArrowRight, Plus, Pencil, Trash2, Gift, CheckCircle, XCircle,
  QrCode, Crown, Sparkles, Ticket, Copy, Calendar as CalendarIcon, Users, Settings,
} from "lucide-react";
import { CampaignToggleCard } from "@/components/admin/CampaignToggleCard";
import { CampaignStatusBadge } from "@/components/admin/CampaignStatusBadge";
import { SpinCampaignSettings } from "@/components/admin/SpinCampaignSettings";

type PrizeType = "instant" | "grand" | "visitor";

const TYPE_META: Record<PrizeType, { label: string; icon: any; color: string; bg: string }> = {
  instant: { label: "جوائز فورية", icon: Sparkles, color: "text-blue-700", bg: "bg-blue-100" },
  grand: { label: "الجائزة الكبرى", icon: Crown, color: "text-amber-700", bg: "bg-amber-100" },
  visitor: { label: "جوائز الزوار", icon: Ticket, color: "text-emerald-700", bg: "bg-emerald-100" },
};

/* ═══════════════════════════════════════════════════════════
   ADMIN: Spin System Hub
   ═══════════════════════════════════════════════════════════ */
export default function AdminSpinHub() {
  const { loading: authLoading } = useRequireAdmin();
  const [tab, setTab] = useState<"inventory" | "visitor_codes" | "winners">("inventory");

  if (authLoading) return <Shell loading />;

  return (
    <Shell title="نظام أدر واربح">
      <CampaignToggleCard campaignKey="spin_win" />
      <div className="mb-6 flex flex-wrap gap-2 border-b border-border">
        {[
          { key: "inventory", label: "مخزون الجوائز", icon: Gift },
          { key: "visitor_codes", label: "أكواد الزوار", icon: QrCode },
          { key: "winners", label: "الفائزون", icon: Users },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 -mb-px transition ${
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "inventory" && <InventoryTab />}
      {tab === "visitor_codes" && <VisitorCodesTab />}
      {tab === "winners" && <WinnersTab />}
    </Shell>
  );
}

/* ─────────────────────────────────────────────────────────
   TAB 1: Prize Inventory (filterable by type)
   ───────────────────────────────────────────────────────── */
function InventoryTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState<PrizeType | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const { data: prizes, isLoading } = useQuery({
    queryKey: ["spin-hub-prizes", filterType],
    queryFn: async () => {
      let q = supabase
        .from("store_prizes")
        .select("*, competition_stores(stores:store_id(name_ar, unit_code))")
        .order("prize_type", { ascending: true })
        .order("created_at", { ascending: false });
      if (filterType !== "all") q = q.eq("prize_type", filterType);
      const { data } = await q;
      return data ?? [];
    },
  });

  const { data: compStores } = useQuery({
    queryKey: ["hub-comp-stores"],
    queryFn: async () => {
      const { data } = await supabase
        .from("competition_stores")
        .select("id, stores:store_id(name_ar, unit_code)")
        .eq("is_active", true);
      return data ?? [];
    },
  });

  const fields = [
    { key: "competition_store_id", label: "المتجر *", type: "select" },
    { key: "prize_type", label: "نوع الجائزة *", type: "type-select" },
    { key: "name_ar", label: "اسم الجائزة بالعربية *" },
    { key: "name_en", label: "اسم الجائزة بالإنجليزية" },
    { key: "category", label: "الفئة" },
    { key: "image_url", label: "رابط الصورة" },
    { key: "total_quantity", label: "الكمية الإجمالية", type: "number" },
    { key: "remaining_stock", label: "المخزون المتبقي", type: "number" },
    { key: "probability_weight", label: "وزن الاحتمال (للجوائز الفورية)", type: "number" },
    { key: "grand_probability", label: "احتمال الجائزة الكبرى (0-1)", type: "number" },
    { key: "validity_days", label: "أيام الصلاحية", type: "number" },
    { key: "redemption_rules_ar", label: "قواعد الاستلام", type: "textarea" },
    { key: "is_active", label: "نشط (true/false)" },
    { key: "is_grand", label: "جائزة كبرى مخفية (true/false)" },
    { key: "visitor_only", label: "للزوار فقط (true/false)" },
  ];

  const saveMutation = useMutation({
    mutationFn: async () => {
      const cleaned: Record<string, unknown> = {};
      fields.forEach((f) => {
        const v = form[f.key];
        if (f.type === "number") cleaned[f.key] = v ? Number(v) : null;
        else if (f.key === "is_active" || f.key === "is_grand" || f.key === "visitor_only")
          cleaned[f.key] = v === "true";
        else cleaned[f.key] = v || null;
      });
      if (editId) {
        const { error } = await supabase.from("store_prizes").update(cleaned as any).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("store_prizes").insert(cleaned as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spin-hub-prizes"] });
      setShowForm(false); setEditId(null); setForm({});
      toast({ title: "تم الحفظ" });
    },
    onError: (e: any) => toast({ title: "خطأ", description: e.message ?? "فشل الحفظ", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("store_prizes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spin-hub-prizes"] });
      toast({ title: "تم الحذف" });
    },
  });

  const openEdit = (p: any) => {
    setEditId(p.id);
    const d: Record<string, string> = {};
    fields.forEach((f) => { d[f.key] = String(p[f.key] ?? ""); });
    setForm(d);
    setShowForm(true);
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["all", "instant", "grand", "visitor"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilterType(k)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition ${
                filterType === k
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              }`}
            >
              {k === "all" ? "الكل" : TYPE_META[k].label}
            </button>
          ))}
        </div>
        <Button variant="cta" size="sm" onClick={() => { setEditId(null); setForm({ prize_type: "instant", is_active: "true" }); setShowForm(true); }}>
          <Plus className="w-4 h-4 ml-1" /> إضافة جائزة
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">جاري التحميل...</p>
      ) : (
        <div className="space-y-3">
          {prizes?.map((p: any) => {
            const meta = TYPE_META[p.prize_type as PrizeType] ?? TYPE_META.instant;
            const Icon = meta.icon;
            const pct = p.total_quantity > 0 ? Math.round((p.remaining_stock / p.total_quantity) * 100) : 0;
            return (
              <div key={p.id} className="card-premium p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta.bg}`}>
                    <Icon className={`h-4 w-4 ${meta.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-foreground truncate">{p.name_ar}</p>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${meta.bg} ${meta.color}`}>
                        {meta.label}
                      </span>
                      {p.is_grand && <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">مخفية</span>}
                      {p.visitor_only && <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">زوار فقط</span>}
                      {p.is_active ? (
                        <span className="rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">نشط</span>
                      ) : (
                        <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">متوقف</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      مخزون: {p.remaining_stock}/{p.total_quantity} ({pct}%)
                      {p.probability_weight ? ` · وزن: ${p.probability_weight}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(p.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })}
          {prizes?.length === 0 && <p className="text-center text-muted-foreground py-8">لا توجد جوائز</p>}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "تعديل" : "إضافة"} جائزة</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-3">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-sm text-muted-foreground mb-1 block">{f.label}</label>
                {f.type === "select" ? (
                  <select
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-secondary px-3 text-sm"
                    required
                  >
                    <option value="">اختر...</option>
                    {compStores?.map((cs: any) => (
                      <option key={cs.id} value={cs.id}>{cs.stores?.name_ar ?? "—"} ({cs.stores?.unit_code ?? ""})</option>
                    ))}
                  </select>
                ) : f.type === "type-select" ? (
                  <select
                    value={form[f.key] ?? "instant"}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-secondary px-3 text-sm"
                    required
                  >
                    <option value="instant">جائزة فورية</option>
                    <option value="grand">الجائزة الكبرى</option>
                    <option value="visitor">جائزة زوار</option>
                  </select>
                ) : f.type === "textarea" ? (
                  <Textarea value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="bg-secondary border-border" />
                ) : (
                  <Input
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="bg-secondary border-border"
                    type={f.type === "number" ? "number" : "text"}
                  />
                )}
              </div>
            ))}
            <Button type="submit" variant="cta" className="w-full" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   TAB 2: Visitor Verification Codes
   ───────────────────────────────────────────────────────── */
function VisitorCodesTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    token: "",
    method: "staff_code",
    max_uses: "",
    valid_to: "",
    issued_by: "",
    notes: "",
  });

  const { data: codes, isLoading } = useQuery({
    queryKey: ["visitor-codes"],
    queryFn: async () => {
      const { data } = await supabase
        .from("visitor_verifications")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const generateToken = (method: string) => {
    const prefix = method === "qr" ? "BOSTAN-QR" : "BOSTAN-VISITOR";
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    const year = new Date().getFullYear();
    return `${prefix}-${year}-${rand}`;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        token: form.token.trim() || generateToken(form.method),
        method: form.method,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        valid_to: form.valid_to ? new Date(form.valid_to).toISOString() : null,
        issued_by: form.issued_by || null,
        notes: form.notes || null,
        is_active: true,
      };
      const { error } = await supabase.from("visitor_verifications").insert(payload as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitor-codes"] });
      setShowForm(false);
      setForm({ token: "", method: "staff_code", max_uses: "", valid_to: "", issued_by: "", notes: "" });
      toast({ title: "تم إنشاء الكود" });
    },
    onError: (e: any) => toast({ title: "خطأ", description: e.message?.includes("unique") ? "هذا الكود موجود بالفعل" : "فشل الإنشاء", variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("visitor_verifications").update({ is_active } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitor-codes"] });
      toast({ title: "تم التحديث" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("visitor_verifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitor-codes"] });
      toast({ title: "تم الحذف" });
    },
  });

  const copyToClipboard = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({ title: "تم النسخ", description: token });
  };

  const isExpired = (validTo: string | null) => validTo && new Date(validTo) < new Date();
  const isExhausted = (used: number, max: number | null) => max !== null && used >= max;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          أكواد التحقق للزوار داخل الفرع — لتفعيل جائزة الزوار (1000 جنيه)
        </p>
        <Button variant="cta" size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 ml-1" /> توليد كود جديد
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">جاري التحميل...</p>
      ) : (
        <div className="space-y-3">
          {codes?.map((c: any) => {
            const expired = isExpired(c.valid_to);
            const exhausted = isExhausted(c.used_count, c.max_uses);
            const inactive = !c.is_active || expired || exhausted;
            return (
              <div key={c.id} className="card-premium p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <code className="font-mono text-sm bg-secondary px-2 py-1 rounded border border-border" dir="ltr">
                        {c.token}
                      </code>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(c.token)}>
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                        {c.method === "qr" ? "QR زائر" : c.method === "location" ? "تحقق موقعي" : "كود موظف"}
                      </span>
                      {inactive ? (
                        <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                          {!c.is_active ? "متوقف" : expired ? "منتهي" : "مستنفد"}
                        </span>
                      ) : (
                        <span className="rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                          نشط
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">الاستخدامات: </span>
                        <span className="font-bold text-foreground">
                          {c.used_count}{c.max_uses ? `/${c.max_uses}` : " (غير محدود)"}
                        </span>
                      </div>
                      {c.valid_to && (
                        <div>
                          <span className="text-muted-foreground">صالح حتى: </span>
                          <span className="font-bold text-foreground">
                            {new Date(c.valid_to).toLocaleDateString("ar-EG")}
                          </span>
                        </div>
                      )}
                      {c.issued_by && (
                        <div>
                          <span className="text-muted-foreground">أصدره: </span>
                          <span className="font-bold text-foreground">{c.issued_by}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">تاريخ الإنشاء: </span>
                        <span className="text-foreground">{new Date(c.created_at).toLocaleDateString("ar-EG")}</span>
                      </div>
                    </div>
                    {c.notes && <p className="text-xs text-muted-foreground mt-2">{c.notes}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => toggleMutation.mutate({ id: c.id, is_active: !c.is_active })}>
                      {c.is_active ? <XCircle className="w-4 h-4 text-destructive" /> : <CheckCircle className="w-4 h-4 text-green-600" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(c.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          {codes?.length === 0 && <p className="text-center text-muted-foreground py-8">لا توجد أكواد بعد</p>}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>توليد كود زائر جديد</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">طريقة التحقق</label>
              <select
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
                className="w-full h-10 rounded-lg border border-border bg-secondary px-3 text-sm"
              >
                <option value="staff_code">كود موظف (يدوي)</option>
                <option value="qr">QR code للفرع</option>
                <option value="location">تحقق موقعي</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                الكود (اتركه فارغاً للتوليد التلقائي)
              </label>
              <Input
                value={form.token}
                onChange={(e) => setForm({ ...form, token: e.target.value.toUpperCase() })}
                className="bg-secondary border-border font-mono"
                dir="ltr"
                placeholder="BOSTAN-VISITOR-2026-XXXXXX"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">عدد الاستخدامات الأقصى</label>
                <Input
                  type="number"
                  min="1"
                  value={form.max_uses}
                  onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                  className="bg-secondary border-border"
                  placeholder="غير محدود"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">تاريخ الصلاحية</label>
                <Input
                  type="date"
                  value={form.valid_to}
                  onChange={(e) => setForm({ ...form, valid_to: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">أصدره (موظف)</label>
              <Input
                value={form.issued_by}
                onChange={(e) => setForm({ ...form, issued_by: e.target.value })}
                className="bg-secondary border-border"
                placeholder="اسم الموظف أو الفرع"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">ملاحظات</label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="bg-secondary border-border"
              />
            </div>
            <Button type="submit" variant="cta" className="w-full" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "جاري الإنشاء..." : "إنشاء الكود"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   TAB 3: Winners (compact view)
   ───────────────────────────────────────────────────────── */
function WinnersTab() {
  const [filter, setFilter] = useState<"all" | PrizeType>("all");

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["hub-winners", filter],
    queryFn: async () => {
      let q = supabase
        .from("spin_sessions")
        .select("*, store_prizes(name_ar, prize_type, visitor_only, is_grand)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (filter !== "all") q = q.eq("prize_type", filter);
      const { data } = await q;
      return data ?? [];
    },
  });

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-700" },
    redeemed: { label: "تم الاستلام", color: "bg-green-100 text-green-700" },
    expired: { label: "منتهي", color: "bg-red-100 text-red-700" },
    no_prize: { label: "بدون مكافأة", color: "bg-gray-100 text-gray-500" },
  };

  const formatRelative = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return { text: "الآن", fresh: true };
    if (mins < 60) return { text: `منذ ${mins} دقيقة`, fresh: true };
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return { text: `منذ ${hrs} ساعة`, fresh: hrs < 6 };
    const days = Math.floor(hrs / 24);
    if (days < 30) return { text: `منذ ${days} يوم`, fresh: false };
    const months = Math.floor(days / 30);
    return { text: `منذ ${months} شهر`, fresh: false };
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["all", "instant", "grand", "visitor"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition ${
                filter === k
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              }`}
            >
              {k === "all" ? "الكل" : TYPE_META[k].label}
            </button>
          ))}
        </div>
        <Link to="/admin/spin-winners">
          <Button variant="outline" size="sm">
            <QrCode className="w-4 h-4 ml-1" /> التحقق من الأكواد
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">جاري التحميل...</p>
      ) : (
        <div className="overflow-x-auto card-premium">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-right border-b border-border">
                <th className="py-3 px-3 font-bold text-muted-foreground">الاسم</th>
                <th className="py-3 px-3 font-bold text-muted-foreground">الهاتف</th>
                <th className="py-3 px-3 font-bold text-muted-foreground">الجائزة</th>
                <th className="py-3 px-3 font-bold text-muted-foreground">النوع</th>
                <th className="py-3 px-3 font-bold text-muted-foreground">الكود</th>
                <th className="py-3 px-3 font-bold text-muted-foreground">الحالة</th>
                <th className="py-3 px-3 font-bold text-muted-foreground">الوقت المنقضي</th>
                <th className="py-3 px-3 font-bold text-muted-foreground">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {sessions?.map((s: any) => {
                const meta = s.prize_type ? TYPE_META[s.prize_type as PrizeType] : null;
                return (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="py-2 px-3">{s.full_name}</td>
                    <td className="py-2 px-3 font-mono text-xs" dir="ltr">{s.phone}</td>
                    <td className="py-2 px-3">{s.store_prizes?.name_ar ?? "—"}</td>
                    <td className="py-2 px-3">
                      {meta && (
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${meta.bg} ${meta.color}`}>
                          {meta.label}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-mono text-xs" dir="ltr">{s.claim_code ?? "—"}</td>
                    <td className="py-2 px-3">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${statusLabels[s.claim_status]?.color ?? ""}`}>
                        {statusLabels[s.claim_status]?.label ?? s.claim_status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs">
                      {(() => {
                        const r = formatRelative(s.created_at);
                        return (
                          <span className={r.fresh ? "font-bold text-primary" : "text-muted-foreground"}>
                            {r.text}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-2 px-3 text-xs text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString("ar-EG")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {sessions?.length === 0 && <p className="text-center text-muted-foreground py-8">لا توجد مشاركات</p>}
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Shared Shell
   ───────────────────────────────────────────────────────── */
function Shell({ children, title, loading }: { children?: React.ReactNode; title?: string; loading?: boolean }) {
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;
  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-primary hover:underline"><ArrowRight className="w-5 h-5" /></Link>
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          </div>
          <CampaignStatusBadge asLink={false} />
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
