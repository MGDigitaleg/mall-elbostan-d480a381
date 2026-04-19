import { useState, useRef, useEffect } from "react";
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
  ArrowRight, Plus, Pencil, Trash2, Store, Gift, CheckCircle, XCircle,
  BarChart3, QrCode, Search, Clock, Award, TrendingUp, Users, Download
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   ADMIN: Competition Stores
   ═══════════════════════════════════════════════════════════ */
export function AdminCompetitionStores() {
  const { loading: authLoading } = useRequireAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ store_id: "", participation_note: "", is_active: true });

  const { data: competitionStores, isLoading } = useQuery({
    queryKey: ["admin-competition-stores"],
    queryFn: async () => {
      const { data } = await supabase
        .from("competition_stores")
        .select("*, stores:store_id(name_ar, unit_code, logo_url, category)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: allStores } = useQuery({
    queryKey: ["all-stores-for-competition"],
    queryFn: async () => {
      const { data } = await supabase
        .from("stores")
        .select("id, name_ar, unit_code")
        .neq("status", "hidden")
        .order("name_ar");
      return data ?? [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("competition_stores").insert({
        store_id: formData.store_id,
        participation_note: formData.participation_note || null,
        is_active: formData.is_active,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-competition-stores"] });
      setShowForm(false);
      setFormData({ store_id: "", participation_note: "", is_active: true });
      toast({ title: "تم إضافة المتجر للمسابقة" });
    },
    onError: (e: any) => {
      toast({ title: "خطأ", description: e.message?.includes("unique") ? "هذا المتجر مضاف بالفعل" : "حدث خطأ", variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("competition_stores").update({ is_active } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-competition-stores"] });
      toast({ title: "تم التحديث" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("competition_stores").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-competition-stores"] });
      toast({ title: "تم الحذف" });
    },
  });

  if (authLoading) return <AdminShell loading />;

  return (
    <AdminShell title="المتاجر المشاركة في المسابقة" onAdd={() => setShowForm(true)}>
      {isLoading ? <p className="text-muted-foreground">جاري التحميل...</p> : (
        <div className="space-y-3">
          {competitionStores?.map((cs: any) => (
            <div key={cs.id} className="card-premium p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card">
                  {cs.stores?.logo_url ? (
                    <img src={cs.stores.logo_url} alt="" className="h-7 w-7 rounded object-contain" />
                  ) : (
                    <Store className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-foreground">{cs.stores?.name_ar ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{cs.stores?.unit_code ?? ""} — {cs.stores?.category ?? ""}</p>
                </div>
                {cs.is_active ? (
                  <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">نشط</span>
                ) : (
                  <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">متوقف</span>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => toggleMutation.mutate({ id: cs.id, is_active: !cs.is_active })}>
                  {cs.is_active ? <XCircle className="w-4 h-4 text-destructive" /> : <CheckCircle className="w-4 h-4 text-green-600" />}
                </Button>
                <Link to={`/admin/store-prizes?store=${cs.id}`}>
                  <Button variant="ghost" size="icon"><Gift className="w-4 h-4" /></Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(cs.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {competitionStores?.length === 0 && <p className="text-center text-muted-foreground py-8">لا توجد متاجر مشاركة</p>}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>إضافة متجر للمسابقة</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">المتجر *</label>
              <select
                value={formData.store_id}
                onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
                className="w-full h-10 rounded-lg border border-border bg-secondary px-3 text-sm"
                required
              >
                <option value="">اختر متجر...</option>
                {allStores?.map((s) => (
                  <option key={s.id} value={s.id}>{s.name_ar} ({s.unit_code ?? "—"})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">ملاحظة المشاركة</label>
              <Textarea
                value={formData.participation_note}
                onChange={(e) => setFormData({ ...formData, participation_note: e.target.value })}
                className="bg-secondary border-border"
              />
            </div>
            <Button type="submit" variant="cta" className="w-full" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "جاري الحفظ..." : "إضافة"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADMIN: Store Prizes
   ═══════════════════════════════════════════════════════════ */
export function AdminStorePrizes() {
  const { loading: authLoading } = useRequireAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Get store filter from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const filterStoreId = urlParams.get("store");

  const { data: prizes, isLoading } = useQuery({
    queryKey: ["admin-store-prizes", filterStoreId],
    queryFn: async () => {
      let query = supabase
        .from("store_prizes")
        .select("*, competition_stores(*, stores:store_id(name_ar, unit_code))")
        .order("created_at", { ascending: false });
      if (filterStoreId) query = query.eq("competition_store_id", filterStoreId);
      const { data } = await query;
      return data ?? [];
    },
  });

  const { data: competitionStores } = useQuery({
    queryKey: ["competition-stores-dropdown"],
    queryFn: async () => {
      const { data } = await supabase
        .from("competition_stores")
        .select("id, stores:store_id(name_ar, unit_code)")
        .eq("is_active", true);
      return data ?? [];
    },
  });

  const prizeFields = [
    { key: "competition_store_id", label: "المتجر المشارك *", type: "select" },
    { key: "name_ar", label: "اسم المكافأة بالعربية *" },
    { key: "name_en", label: "اسم المكافأة بالإنجليزية" },
    { key: "category", label: "الفئة (mousepad/usb/mouse/voucher/accessory)" },
    { key: "image_url", label: "رابط الصورة" },
    { key: "total_quantity", label: "الكمية الإجمالية", type: "number" },
    { key: "remaining_stock", label: "المخزون المتبقي", type: "number" },
    { key: "probability_weight", label: "وزن الاحتمال", type: "number" },
    { key: "validity_days", label: "أيام الصلاحية", type: "number" },
    { key: "redemption_rules_ar", label: "قواعد الاستلام", type: "textarea" },
    { key: "is_active", label: "نشط (true/false)" },
  ];

  const saveMutation = useMutation({
    mutationFn: async () => {
      const cleaned: Record<string, unknown> = {};
      prizeFields.forEach((f) => {
        const val = formData[f.key];
        if (f.type === "number") cleaned[f.key] = val ? Number(val) : null;
        else if (f.key === "is_active") cleaned[f.key] = val !== "false";
        else cleaned[f.key] = val || null;
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
      queryClient.invalidateQueries({ queryKey: ["admin-store-prizes"] });
      setShowForm(false);
      setEditId(null);
      setFormData({});
      toast({ title: "تم الحفظ" });
    },
    onError: () => toast({ title: "خطأ", description: "حدث خطأ أثناء الحفظ", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("store_prizes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-store-prizes"] });
      toast({ title: "تم الحذف" });
    },
  });

  if (authLoading) return <AdminShell loading />;

  return (
    <AdminShell title="مكافآت المتاجر" onAdd={() => { setEditId(null); setFormData(filterStoreId ? { competition_store_id: filterStoreId } : {}); setShowForm(true); }}>
      {isLoading ? <p className="text-muted-foreground">جاري التحميل...</p> : (
        <div className="space-y-3">
          {prizes?.map((prize: any) => (
            <div key={prize.id} className="card-premium p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {prize.image_url ? (
                  <img src={prize.image_url} alt="" className="h-10 w-10 rounded-lg object-cover border border-border" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-foreground">{prize.name_ar}</p>
                  <p className="text-xs text-muted-foreground">
                    {(prize.competition_stores as any)?.stores?.name_ar ?? "—"} — مخزون: {prize.remaining_stock}/{prize.total_quantity}
                  </p>
                </div>
                {prize.is_active ? (
                  <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">نشط</span>
                ) : (
                  <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">متوقف</span>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => {
                  setEditId(prize.id);
                  const data: Record<string, string> = {};
                  prizeFields.forEach((f) => { data[f.key] = String((prize as any)[f.key] ?? ""); });
                  setFormData(data);
                  setShowForm(true);
                }}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(prize.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {prizes?.length === 0 && <p className="text-center text-muted-foreground py-8">لا توجد مكافآت</p>}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "تعديل" : "إضافة"} مكافأة</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-3">
            {prizeFields.map((field) => (
              <div key={field.key}>
                <label className="text-sm text-muted-foreground mb-1 block">{field.label}</label>
                {field.type === "select" ? (
                  <select
                    value={formData[field.key] ?? ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-secondary px-3 text-sm"
                    required
                  >
                    <option value="">اختر...</option>
                    {competitionStores?.map((cs: any) => (
                      <option key={cs.id} value={cs.id}>{cs.stores?.name_ar ?? "—"} ({cs.stores?.unit_code ?? ""})</option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <Textarea value={formData[field.key] ?? ""} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} className="bg-secondary border-border" />
                ) : (
                  <Input value={formData[field.key] ?? ""} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} className="bg-secondary border-border" type={field.type === "number" ? "number" : "text"} />
                )}
              </div>
            ))}
            <Button type="submit" variant="cta" className="w-full" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADMIN: Winners / Spin Sessions
   ═══════════════════════════════════════════════════════════ */
export function AdminSpinWinners() {
  const { loading: authLoading } = useRequireAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchCode, setSearchCode] = useState("");
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Filters
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterPrizeType, setFilterPrizeType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Search (debounced)
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Pagination (server-side)
  const PAGE_SIZE = 50;
  const [page, setPage] = useState(0);

  // Reset to first page when filters or search change
  const filterKey = `${filterFrom}|${filterTo}|${filterPrizeType}|${filterStatus}|${searchTerm}`;
  const lastFilterKey = useRef(filterKey);
  if (lastFilterKey.current !== filterKey) {
    lastFilterKey.current = filterKey;
    if (page !== 0) setPage(0);
  }

  const buildFilteredQuery = () => {
    let q = supabase
      .from("spin_sessions")
      .select(
        "*, store_prizes(name_ar, category, prize_type), competition_stores(stores:store_id(name_ar, unit_code))",
        { count: "exact" }
      );
    if (filterStatus !== "all") q = q.eq("claim_status", filterStatus);
    if (filterPrizeType !== "all") q = q.eq("prize_type", filterPrizeType);
    if (filterFrom) q = q.gte("created_at", new Date(filterFrom).toISOString());
    if (filterTo) {
      const to = new Date(filterTo);
      to.setHours(23, 59, 59, 999);
      q = q.lte("created_at", to.toISOString());
    }
    if (searchTerm) {
      const escaped = searchTerm.replace(/[%,()]/g, " ");
      const pattern = `%${escaped}%`;
      q = q.or(
        `full_name.ilike.${pattern},phone.ilike.${pattern},claim_code.ilike.${pattern}`
      );
    }
    return q;
  };

  const { data: pageData, isLoading } = useQuery({
    queryKey: ["admin-spin-sessions", filterKey, page],
    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, count } = await buildFilteredQuery()
        .order("created_at", { ascending: false })
        .range(from, to);
      return { rows: data ?? [], total: count ?? 0 };
    },
  });

  const sessions = pageData?.rows ?? [];
  const totalCount = pageData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Stats query — aggregates across ALL filtered rows (not just current page)
  const { data: statsData } = useQuery({
    queryKey: ["admin-spin-sessions-stats", filterKey],
    queryFn: async () => {
      let q = supabase
        .from("spin_sessions")
        .select("claim_status, created_at, redeemed_at");
      if (filterStatus !== "all") q = q.eq("claim_status", filterStatus);
      if (filterPrizeType !== "all") q = q.eq("prize_type", filterPrizeType);
      if (filterFrom) q = q.gte("created_at", new Date(filterFrom).toISOString());
      if (filterTo) {
        const to = new Date(filterTo);
        to.setHours(23, 59, 59, 999);
        q = q.lte("created_at", to.toISOString());
      }
      const { data } = await q.limit(10000);
      const rows = data ?? [];
      const total = rows.length;
      const redeemedRows = rows.filter((r) => r.claim_status === "redeemed" && r.redeemed_at);
      const redeemed = redeemedRows.length;
      const pending = rows.filter((r) => r.claim_status === "pending").length;
      const rate = total > 0 ? (redeemed / total) * 100 : 0;
      const avgMs =
        redeemedRows.length > 0
          ? redeemedRows.reduce(
              (sum, r) => sum + (new Date(r.redeemed_at as string).getTime() - new Date(r.created_at).getTime()),
              0
            ) / redeemedRows.length
          : 0;
      return { total, redeemed, pending, rate, avgMs };
    },
  });

  const formatDuration = (ms: number) => {
    if (!ms || ms <= 0) return "—";
    const minutes = Math.round(ms / 60000);
    if (minutes < 60) return `${minutes} د`;
    const hours = Math.floor(minutes / 60);
    const remMin = minutes % 60;
    if (hours < 24) return remMin > 0 ? `${hours} س ${remMin} د` : `${hours} س`;
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return remHours > 0 ? `${days} ي ${remHours} س` : `${days} ي`;
  };


  const handleVerify = async () => {
    if (!searchCode.trim()) return;
    setVerifyLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("verify-claim", {
        body: { claim_code: searchCode.trim(), action: "verify" },
        headers: { Authorization: `Bearer ${session?.session?.access_token}` },
      });
      if (error) throw error;
      if (data?.error) {
        toast({ title: "خطأ", description: data.error, variant: "destructive" });
      } else {
        setVerifyResult(data.session);
      }
    } catch {
      toast({ title: "خطأ", description: "حدث خطأ أثناء التحقق", variant: "destructive" });
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleRedeem = async (claimCode: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("verify-claim", {
        body: { claim_code: claimCode, action: "redeem" },
        headers: { Authorization: `Bearer ${session?.session?.access_token}` },
      });
      if (error) throw error;
      if (data?.error) {
        toast({ title: "خطأ", description: data.error, variant: "destructive" });
      } else {
        toast({ title: "تم التأكيد", description: "تم تأكيد استلام المكافأة" });
        setVerifyResult(null);
        queryClient.invalidateQueries({ queryKey: ["admin-spin-sessions"] });
      }
    } catch {
      toast({ title: "خطأ", description: "حدث خطأ", variant: "destructive" });
    }
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-700" },
    claimed: { label: "مطالب به", color: "bg-blue-100 text-blue-700" },
    redeemed: { label: "تم الاستلام", color: "bg-green-100 text-green-700" },
    expired: { label: "منتهي", color: "bg-red-100 text-red-700" },
    cancelled: { label: "ملغي", color: "bg-gray-100 text-gray-500" },
    no_prize: { label: "بدون مكافأة", color: "bg-gray-100 text-gray-500" },
  };

  // Server-side filtering — current page rows only.
  // CSV exports ALL matching rows by re-querying without pagination.
  const resetFilters = () => {
    setFilterFrom(""); setFilterTo(""); setFilterPrizeType("all"); setFilterStatus("all");
    setSearchInput(""); setSearchTerm("");
  };

  const exportCSV = async () => {
    if (totalCount === 0) {
      toast({ title: "لا توجد بيانات للتصدير", variant: "destructive" });
      return;
    }
    const { data: allRows } = await buildFilteredQuery()
      .order("created_at", { ascending: false })
      .limit(5000);
    const rowsData = allRows ?? [];
    if (rowsData.length === 0) {
      toast({ title: "لا توجد بيانات للتصدير", variant: "destructive" });
      return;
    }

    const headers = [
      "الاسم", "الهاتف", "البريد", "المكافأة", "نوع المكافأة",
      "المتجر", "كود الوحدة", "رمز الاستلام", "الحالة",
      "تاريخ الفوز", "تاريخ الاستلام", "صالح حتى", "أكّد بواسطة",
    ];
    const escape = (v: unknown) => {
      const s = v === null || v === undefined ? "" : String(v);
      return `"${s.replace(/"/g, '""')}"`;
    };
    const fmt = (d: string | null | undefined) =>
      d ? new Date(d).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" }) : "";

    const rows = rowsData.map((s: any) => [
      s.full_name,
      s.phone,
      s.email ?? "",
      s.store_prizes?.name_ar ?? "",
      s.store_prizes?.prize_type ?? s.prize_type ?? "",
      (s.competition_stores as any)?.stores?.name_ar ?? "",
      (s.competition_stores as any)?.stores?.unit_code ?? "",
      s.claim_code ?? "",
      statusLabels[s.claim_status]?.label ?? s.claim_status,
      fmt(s.created_at),
      fmt(s.redeemed_at),
      fmt(s.expires_at),
      s.redeemed_by ?? "",
    ]);

    const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const stamp = new Date().toISOString().slice(0, 10);
    a.download = `spin-winners-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "تم التصدير", description: `${rowsData.length} سجل` });
  };

  if (authLoading) return <AdminShell loading />;

  return (
    <AdminShell title="الفائزون والمشاركون">
      {/* Verify Code Section */}
      <div className="card-premium p-4 mb-6">
        <p className="font-bold text-foreground mb-3 flex items-center gap-2">
          <QrCode className="w-4 h-4" /> التحقق من رمز الاستلام
        </p>
        <div className="flex gap-2">
          <Input
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            placeholder="أدخل رمز الاستلام (مثال: ABCD-1234-WXYZ)"
            className="bg-secondary border-border font-mono"
            dir="ltr"
          />
          <Button variant="cta" onClick={handleVerify} disabled={verifyLoading}>
            {verifyLoading ? "..." : "تحقق"}
          </Button>
        </div>

        {verifyResult && (
          <div className="mt-4 rounded-lg border border-border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-bold text-foreground">{verifyResult.full_name}</p>
              <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${statusLabels[verifyResult.claim_status]?.color ?? ""}`}>
                {statusLabels[verifyResult.claim_status]?.label ?? verifyResult.claim_status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">الهاتف: {verifyResult.phone}</p>
            {verifyResult.prize && <p className="text-sm text-foreground">المكافأة: {verifyResult.prize.name_ar}</p>}
            {verifyResult.store && <p className="text-sm text-muted-foreground">المتجر: {verifyResult.store.name_ar}</p>}
            <p className="text-xs text-muted-foreground">الرمز: {verifyResult.claim_code}</p>
            {verifyResult.expires_at && (
              <p className="text-xs text-muted-foreground">صالح حتى: {new Date(verifyResult.expires_at).toLocaleDateString("ar-EG")}</p>
            )}
            {verifyResult.claim_status === "pending" && (
              <Button variant="cta" size="sm" className="mt-2" onClick={() => handleRedeem(verifyResult.claim_code)}>
                <CheckCircle className="w-4 h-4 ml-1" /> تأكيد الاستلام
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Filters + Export */}
      <div className="card-premium p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-foreground flex items-center gap-2">
            <Search className="w-4 h-4" /> فلاتر التصدير
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={resetFilters}>إعادة ضبط</Button>
            <Button variant="cta" size="sm" onClick={exportCSV} disabled={totalCount === 0}>
              <Download className="w-4 h-4 ml-1" />
              تصدير CSV ({totalCount})
            </Button>
          </div>
        </div>
        <div className="mb-3">
          <label className="text-xs text-muted-foreground mb-1 block">بحث (الاسم / الهاتف / كود الاستلام)</label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث بالاسم أو الهاتف أو الكود..."
              className="bg-secondary border-border h-9 pr-9"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">من تاريخ</label>
            <Input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className="bg-secondary border-border h-9" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">إلى تاريخ</label>
            <Input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className="bg-secondary border-border h-9" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">نوع المكافأة</label>
            <select
              value={filterPrizeType}
              onChange={(e) => setFilterPrizeType(e.target.value)}
              className="w-full h-9 rounded-lg border border-border bg-secondary px-3 text-sm"
            >
              <option value="all">الكل</option>
              <option value="instant">فورية (Instant)</option>
              <option value="grand">كبرى (Grand)</option>
              <option value="visitor">زائر (Visitor)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">حالة الاستلام</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-9 rounded-lg border border-border bg-secondary px-3 text-sm"
            >
              <option value="all">الكل</option>
              <option value="pending">قيد الانتظار</option>
              <option value="redeemed">تم الاستلام</option>
              <option value="expired">منتهي</option>
              <option value="cancelled">ملغي</option>
              <option value="no_prize">بدون مكافأة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats summary (based on applied filters) */}
      {statsData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="card-premium p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="w-4 h-4" />
              <p className="text-xs">إجمالي الفائزين</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{statsData.total.toLocaleString("ar-EG")}</p>
          </div>
          <div className="card-premium p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CheckCircle className="w-4 h-4" />
              <p className="text-xs">تم الاستلام</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{statsData.redeemed.toLocaleString("ar-EG")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">قيد الانتظار: {statsData.pending.toLocaleString("ar-EG")}</p>
          </div>
          <div className="card-premium p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <p className="text-xs">نسبة الاستلام</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{statsData.rate.toFixed(1)}%</p>
          </div>
          <div className="card-premium p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <p className="text-xs">متوسط وقت الاستلام</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatDuration(statsData.avgMs)}</p>
          </div>
        </div>
      )}

      {/* Sessions list */}

      {isLoading ? <p className="text-muted-foreground">جاري التحميل...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-right">
                <th className="py-2 px-3 font-bold text-muted-foreground">الاسم</th>
                <th className="py-2 px-3 font-bold text-muted-foreground">الهاتف</th>
                <th className="py-2 px-3 font-bold text-muted-foreground">المكافأة</th>
                <th className="py-2 px-3 font-bold text-muted-foreground">المتجر</th>
                <th className="py-2 px-3 font-bold text-muted-foreground">الرمز</th>
                <th className="py-2 px-3 font-bold text-muted-foreground">الحالة</th>
                <th className="py-2 px-3 font-bold text-muted-foreground">التاريخ</th>
                <th className="py-2 px-3 font-bold text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s: any) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-2 px-3">{s.full_name}</td>
                  <td className="py-2 px-3 font-mono text-xs" dir="ltr">{s.phone}</td>
                  <td className="py-2 px-3">{s.store_prizes?.name_ar ?? "—"}</td>
                  <td className="py-2 px-3">{(s.competition_stores as any)?.stores?.name_ar ?? "—"}</td>
                  <td className="py-2 px-3 font-mono text-xs">{s.claim_code ?? "—"}</td>
                  <td className="py-2 px-3">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${statusLabels[s.claim_status]?.color ?? ""}`}>
                      {statusLabels[s.claim_status]?.label ?? s.claim_status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="py-2 px-3">
                    {s.claim_code ? (
                      <a
                        href={`/spin-win/claim/${s.claim_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="فتح صفحة التحقق في تبويب جديد"
                        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-bold text-foreground hover:bg-secondary transition"
                      >
                        <QrCode className="w-3 h-3" />
                        تحقق
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sessions.length === 0 && <p className="text-center text-muted-foreground py-8">لا توجد نتائج مطابقة للفلاتر</p>}

          {/* Pagination */}
          {totalCount > 0 && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                عرض {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalCount)} من {totalCount}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                  السابق
                </Button>
                <span className="text-xs text-muted-foreground font-mono">{page + 1} / {totalPages}</span>
                <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page + 1 >= totalPages}>
                  التالي
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADMIN: Spin Reports
   ═══════════════════════════════════════════════════════════ */
export function AdminSpinReports() {
  const { loading: authLoading } = useRequireAdmin();

  const { data: stats } = useQuery({
    queryKey: ["spin-reports"],
    queryFn: async () => {
      const { data: sessions } = await supabase
        .from("spin_sessions")
        .select("*, store_prizes(name_ar, remaining_stock, total_quantity), competition_stores(stores:store_id(name_ar))");

      if (!sessions) return null;

      const total = sessions.length;
      const winners = sessions.filter((s: any) => s.prize_id).length;
      const redeemed = sessions.filter((s: any) => s.claim_status === "redeemed").length;
      const expired = sessions.filter((s: any) => s.claim_status === "expired").length;
      const pending = sessions.filter((s: any) => s.claim_status === "pending" && s.prize_id).length;

      // Group by store
      const byStore: Record<string, { name: string; count: number; redeemed: number }> = {};
      sessions.forEach((s: any) => {
        const storeName = (s.competition_stores as any)?.stores?.name_ar ?? "غير معروف";
        if (!byStore[storeName]) byStore[storeName] = { name: storeName, count: 0, redeemed: 0 };
        byStore[storeName].count++;
        if (s.claim_status === "redeemed") byStore[storeName].redeemed++;
      });

      // Group by day
      const byDay: Record<string, number> = {};
      sessions.forEach((s: any) => {
        const day = s.spin_date ?? new Date(s.created_at).toISOString().split("T")[0];
        byDay[day] = (byDay[day] ?? 0) + 1;
      });

      // Prize stock
      const { data: prizes } = await supabase
        .from("store_prizes")
        .select("name_ar, remaining_stock, total_quantity, competition_stores(stores:store_id(name_ar))");

      return {
        total,
        winners,
        redeemed,
        expired,
        pending,
        byStore: Object.values(byStore).sort((a, b) => b.count - a.count),
        byDay: Object.entries(byDay).sort(([a], [b]) => b.localeCompare(a)).slice(0, 14),
        prizes: prizes ?? [],
      };
    },
  });

  if (authLoading) return <AdminShell loading />;

  return (
    <AdminShell title="تقارير المسابقة">
      {!stats ? <p className="text-muted-foreground">جاري التحميل...</p> : (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "إجمالي المشاركات", value: stats.total, icon: Users, color: "#2563EB" },
              { label: "الفائزون", value: stats.winners, icon: Award, color: "#10B981" },
              { label: "تم الاستلام", value: stats.redeemed, icon: CheckCircle, color: "#059669" },
              { label: "قيد الانتظار", value: stats.pending, icon: Clock, color: "#F59E0B" },
              { label: "منتهي الصلاحية", value: stats.expired, icon: XCircle, color: "#EF4444" },
            ].map((s) => (
              <div key={s.label} className="card-premium p-4 text-center">
                <s.icon className="w-5 h-5 mx-auto mb-2" style={{ color: s.color }} />
                <p className="font-poppins text-2xl font-extrabold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* By Store */}
          <div className="card-premium p-4">
            <p className="font-bold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> أكثر المتاجر نشاطاً
            </p>
            <div className="space-y-2">
              {stats.byStore.map((s) => (
                <div key={s.name} className="flex items-center justify-between rounded-lg px-3 py-2 bg-secondary/30">
                  <span className="font-medium text-foreground">{s.name}</span>
                  <div className="flex gap-3 text-xs">
                    <span className="text-muted-foreground">{s.count} مشاركة</span>
                    <span className="text-green-600 font-bold">{s.redeemed} استلام</span>
                  </div>
                </div>
              ))}
              {stats.byStore.length === 0 && <p className="text-center text-muted-foreground py-4">لا توجد بيانات</p>}
            </div>
          </div>

          {/* By Day */}
          <div className="card-premium p-4">
            <p className="font-bold text-foreground mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> المشاركات اليومية
            </p>
            <div className="space-y-1">
              {stats.byDay.map(([day, count]) => (
                <div key={day} className="flex items-center justify-between rounded-lg px-3 py-2 bg-secondary/30">
                  <span className="text-sm text-foreground">{new Date(day).toLocaleDateString("ar-EG", { day: "numeric", month: "long" })}</span>
                  <span className="font-poppins font-bold text-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prize stock */}
          <div className="card-premium p-4">
            <p className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4" /> مخزون المكافآت
            </p>
            <div className="space-y-2">
              {stats.prizes.map((p: any) => {
                const pct = p.total_quantity > 0 ? Math.round((p.remaining_stock / p.total_quantity) * 100) : 0;
                return (
                  <div key={p.name_ar} className="flex items-center justify-between rounded-lg px-3 py-2 bg-secondary/30">
                    <div>
                      <span className="font-medium text-foreground">{p.name_ar}</span>
                      <span className="text-xs text-muted-foreground mr-2">{(p.competition_stores as any)?.stores?.name_ar ?? ""}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct > 30 ? "#10B981" : pct > 10 ? "#F59E0B" : "#EF4444" }} />
                      </div>
                      <span className="font-poppins text-xs font-bold text-foreground">{p.remaining_stock}/{p.total_quantity}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   Shared admin shell
   ═══════════════════════════════════════════════════════════ */
function AdminShell({ children, title, onAdd, loading: isLoading }: { children?: React.ReactNode; title?: string; onAdd?: () => void; loading?: boolean }) {
  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-primary hover:underline"><ArrowRight className="w-5 h-5" /></Link>
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          </div>
          {onAdd && (
            <Button variant="cta" size="sm" onClick={onAdd}>
              <Plus className="w-4 h-4 ml-1" /> إضافة
            </Button>
          )}
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
