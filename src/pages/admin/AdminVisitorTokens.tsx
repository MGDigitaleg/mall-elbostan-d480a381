import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRequireAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowRight, Copy, Plus, Trash2, RefreshCw, Ticket } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface VisitorToken {
  id: string;
  token: string;
  method: string;
  issued_by: string | null;
  is_active: boolean;
  valid_from: string;
  valid_to: string | null;
  max_uses: number | null;
  used_count: number;
  notes: string | null;
  created_at: string;
  last_used_at?: string | null;
}

const formatRelative = (iso: string | null | undefined): string => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "الآن";
  if (m < 60) return `منذ ${m} دقيقة`;
  const h = Math.floor(m / 60);
  if (h < 24) return `منذ ${h} ساعة`;
  const d = Math.floor(h / 24);
  return `منذ ${d} يوم`;
};

const generateToken = () => {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BOSTAN-VISITOR-${rand}`;
};

const AdminVisitorTokens = () => {
  const { loading: authLoading } = useRequireAdmin();
  const [tokens, setTokens] = useState<VisitorToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    token: generateToken(),
    issued_by: "",
    max_uses: "",
    valid_to: "",
    notes: "",
  });

  const load = async () => {
    setLoading(true);
    const [tokensRes, sessionsRes] = await Promise.all([
      supabase.from("visitor_verifications").select("*").order("created_at", { ascending: false }),
      supabase.from("spin_sessions").select("visitor_token, created_at").not("visitor_token", "is", null).order("created_at", { ascending: false }),
    ]);
    if (tokensRes.error) toast.error("فشل تحميل الأكواد");
    else {
      const lastUsed = new Map<string, string>();
      (sessionsRes.data || []).forEach((s: { visitor_token: string | null; created_at: string }) => {
        if (s.visitor_token && !lastUsed.has(s.visitor_token)) lastUsed.set(s.visitor_token, s.created_at);
      });
      setTokens((tokensRes.data || []).map(t => ({ ...t, last_used_at: lastUsed.get(t.token) || null })));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.token.trim()) { toast.error("الكود مطلوب"); return; }
    const payload = {
      token: form.token.trim(),
      method: "staff_code",
      issued_by: form.issued_by || null,
      max_uses: form.max_uses ? parseInt(form.max_uses, 10) : null,
      valid_to: form.valid_to ? new Date(form.valid_to).toISOString() : null,
      notes: form.notes || null,
      is_active: true,
    };
    const { error } = await supabase.from("visitor_verifications").insert(payload);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "هذا الكود موجود بالفعل" : "فشل الإنشاء");
      return;
    }
    toast.success("تم إنشاء الكود بنجاح");
    setOpen(false);
    setForm({ token: generateToken(), issued_by: "", max_uses: "", valid_to: "", notes: "" });
    load();
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("visitor_verifications")
      .update({ is_active: !current })
      .eq("id", id);
    if (error) toast.error("فشل التحديث");
    else { toast.success(!current ? "تم تفعيل الكود" : "تم تعطيل الكود"); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكود؟")) return;
    const { error } = await supabase.from("visitor_verifications").delete().eq("id", id);
    if (error) toast.error("فشل الحذف");
    else { toast.success("تم الحذف"); load(); }
  };

  const copyCode = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success("تم نسخ الكود");
  };

  const isExpired = (t: VisitorToken) => t.valid_to && new Date(t.valid_to) < new Date();
  const isExhausted = (t: VisitorToken) => t.max_uses !== null && t.used_count >= t.max_uses;

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin"><Button variant="ghost" size="sm"><ArrowRight className="w-4 h-4 ml-1" /> رجوع</Button></Link>
            <h1 className="text-xl font-bold text-gradient-blue">أكواد الزوار</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={load}><RefreshCw className="w-4 h-4 ml-1" /> تحديث</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 ml-1" /> كود جديد</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle>إنشاء كود زائر جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>الكود</Label>
                    <div className="flex gap-2">
                      <Input value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} />
                      <Button type="button" variant="outline" size="icon" onClick={() => setForm({ ...form, token: generateToken() })}><RefreshCw className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div>
                    <Label>أقصى عدد استخدامات (اتركه فارغ للا محدود)</Label>
                    <Input type="number" min="1" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} placeholder="مثال: 1000" />
                  </div>
                  <div>
                    <Label>صالح حتى (اختياري)</Label>
                    <Input type="datetime-local" value={form.valid_to} onChange={(e) => setForm({ ...form, valid_to: e.target.value })} />
                  </div>
                  <div>
                    <Label>المسؤول عن الإصدار</Label>
                    <Input value={form.issued_by} onChange={(e) => setForm({ ...form, issued_by: e.target.value })} placeholder="مثال: فريق الاستقبال" />
                  </div>
                  <div>
                    <Label>ملاحظات</Label>
                    <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                  <Button onClick={create}>إنشاء</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-4"><div className="text-sm text-muted-foreground mb-1">إجمالي الأكواد</div><div className="text-2xl font-bold">{tokens.length}</div></Card>
          <Card className="p-4"><div className="text-sm text-muted-foreground mb-1">نشطة</div><div className="text-2xl font-bold text-primary">{tokens.filter(t => t.is_active && !isExpired(t) && !isExhausted(t)).length}</div></Card>
          <Card className="p-4"><div className="text-sm text-muted-foreground mb-1">إجمالي الاستخدامات</div><div className="text-2xl font-bold">{tokens.reduce((s, t) => s + t.used_count, 0)}</div></Card>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">جاري التحميل...</div>
        ) : tokens.length === 0 ? (
          <Card className="p-12 text-center">
            <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">لا توجد أكواد زوار حتى الآن</p>
            <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 ml-1" /> إنشاء كود جديد</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {tokens.map((t) => {
              const expired = isExpired(t);
              const exhausted = isExhausted(t);
              const usagePct = t.max_uses ? Math.min(100, (t.used_count / t.max_uses) * 100) : 0;
              return (
                <Card key={t.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <code className="text-base font-bold bg-muted px-2 py-1 rounded">{t.token}</code>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyCode(t.token)}><Copy className="w-3.5 h-3.5" /></Button>
                        {!t.is_active && <Badge variant="secondary">معطّل</Badge>}
                        {expired && <Badge variant="destructive">منتهي</Badge>}
                        {exhausted && <Badge variant="destructive">مستنفد</Badge>}
                        {t.is_active && !expired && !exhausted && <Badge className="bg-primary">نشط</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          الاستخدام: <span className="font-semibold text-foreground">{t.used_count}</span>
                          {t.max_uses !== null ? <> / {t.max_uses}</> : <> (غير محدود)</>}
                        </div>
                        {t.max_uses !== null && (
                          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all" style={{ width: `${usagePct}%` }} />
                          </div>
                        )}
                        {t.valid_to && <div>صالح حتى: {new Date(t.valid_to).toLocaleString("ar-EG")}</div>}
                        {t.issued_by && <div>الإصدار: {t.issued_by}</div>}
                        {t.notes && <div className="italic">{t.notes}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch checked={t.is_active} onCheckedChange={() => toggleActive(t.id, t.is_active)} />
                        <span className="text-sm">{t.is_active ? "نشط" : "معطّل"}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => remove(t.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminVisitorTokens;
