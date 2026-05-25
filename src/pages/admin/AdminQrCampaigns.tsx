import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, QrCode, Plus, Trash2, ExternalLink } from "lucide-react";

type QrCampaign = {
  id: string;
  slug: string;
  name_ar: string;
  description_ar: string | null;
  destination_path: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string | null;
  placement: string | null;
  is_active: boolean;
  scan_count: number;
  lead_count: number;
  notes: string | null;
  created_at: string;
};

const BASE_URL = "https://www.mallelbostan.com";

function buildLink(c: Partial<QrCampaign>): string {
  const url = new URL((c.destination_path || "/spin-win"), BASE_URL);
  if (c.utm_source) url.searchParams.set("utm_source", c.utm_source);
  if (c.utm_medium) url.searchParams.set("utm_medium", c.utm_medium);
  if (c.utm_campaign) url.searchParams.set("utm_campaign", c.utm_campaign);
  if (c.utm_content) url.searchParams.set("utm_content", c.utm_content);
  if (c.slug) url.searchParams.set("qr", c.slug);
  return url.toString();
}

const blank: Partial<QrCampaign> = {
  slug: "",
  name_ar: "",
  destination_path: "/spin-win",
  utm_source: "qr",
  utm_medium: "qr",
  utm_campaign: "",
  utm_content: "",
  placement: "",
  is_active: true,
};

const AdminQrCampaigns = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<QrCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<QrCampaign>>(blank);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("qr_campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    setRows((data ?? []) as QrCampaign[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const previewLink = useMemo(() => buildLink(form), [form]);

  const save = async () => {
    if (!form.slug?.trim() || !form.name_ar?.trim() || !form.utm_campaign?.trim()) {
      toast({ title: "بيانات ناقصة", description: "أدخل الـ slug والاسم وحملة UTM", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("qr_campaigns").insert({
      slug: form.slug!.trim(),
      name_ar: form.name_ar!.trim(),
      description_ar: form.description_ar || null,
      destination_path: form.destination_path || "/spin-win",
      utm_source: form.utm_source || "qr",
      utm_medium: form.utm_medium || "qr",
      utm_campaign: form.utm_campaign!.trim(),
      utm_content: form.utm_content || null,
      placement: form.placement || null,
      is_active: form.is_active ?? true,
    });
    setSaving(false);
    if (error) { toast({ title: "تعذر الحفظ", description: error.message, variant: "destructive" }); return; }
    toast({ title: "تم إنشاء حملة QR" });
    setForm(blank);
    load();
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    await supabase.from("qr_campaigns").update({ is_active: !is_active }).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف هذه الحملة؟")) return;
    await supabase.from("qr_campaigns").delete().eq("id", id);
    load();
  };

  return (
    <AdminShell>
      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">حملات QR</h1>
          <p className="text-sm text-muted-foreground">روابط مُتابَعة بـ UTM للطباعة وتوزيع QR Codes</p>
        </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 font-semibold">
            <Plus className="h-4 w-4" /> حملة جديدة
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>المعرّف (slug)</Label>
              <Input value={form.slug ?? ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="bus-nc-01" />
            </div>
            <div className="space-y-1.5">
              <Label>اسم الحملة</Label>
              <Input value={form.name_ar ?? ""} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} placeholder="حملة الأتوبيس - تجمع" />
            </div>
            <div className="space-y-1.5">
              <Label>وجهة الرابط</Label>
              <Input value={form.destination_path ?? ""} onChange={(e) => setForm({ ...form, destination_path: e.target.value })} placeholder="/spin-win" />
            </div>
            <div className="space-y-1.5">
              <Label>مكان النشر</Label>
              <Input value={form.placement ?? ""} onChange={(e) => setForm({ ...form, placement: e.target.value })} placeholder="bus_back / mall_entrance" />
            </div>
            <div className="space-y-1.5">
              <Label>utm_source</Label>
              <Input value={form.utm_source ?? ""} onChange={(e) => setForm({ ...form, utm_source: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>utm_medium</Label>
              <Input value={form.utm_medium ?? ""} onChange={(e) => setForm({ ...form, utm_medium: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>utm_campaign</Label>
              <Input value={form.utm_campaign ?? ""} onChange={(e) => setForm({ ...form, utm_campaign: e.target.value })} placeholder="opening_2026" />
            </div>
            <div className="space-y-1.5">
              <Label>utm_content</Label>
              <Input value={form.utm_content ?? ""} onChange={(e) => setForm({ ...form, utm_content: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>ملاحظات</Label>
            <Textarea rows={2} value={form.description_ar ?? ""} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              نشطة
            </label>
            <Button onClick={save} disabled={saving} variant="cta">حفظ الحملة</Button>
          </div>
          <div className="rounded-lg bg-muted/40 border p-3 text-xs space-y-1">
            <div className="font-semibold flex items-center gap-1.5"><QrCode className="h-3.5 w-3.5" /> رابط المعاينة</div>
            <div className="font-mono break-all text-[11px]">{previewLink}</div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="font-semibold mb-3">الحملات ({rows.length})</div>
          {loading ? (
            <div className="text-sm text-muted-foreground">جاري التحميل…</div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-muted-foreground">لا توجد حملات بعد.</div>
          ) : (
            <div className="space-y-2">
              {rows.map((c) => {
                const link = buildLink(c);
                return (
                  <div key={c.id} className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{c.name_ar}</div>
                        <div className="text-[11px] text-muted-foreground">{c.slug} · {c.utm_campaign}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={c.is_active ? "default" : "secondary"}>{c.is_active ? "نشطة" : "متوقفة"}</Badge>
                        <Badge variant="outline">{c.scan_count} زيارة</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Input readOnly value={link} className="font-mono text-[11px] h-8" />
                      <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(link); toast({ title: "تم النسخ" }); }}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline"><ExternalLink className="h-3.5 w-3.5" /></Button>
                      </a>
                    </div>
                    <div className="flex items-center justify-end gap-1.5">
                      <Button size="sm" variant="ghost" onClick={() => toggleActive(c.id, c.is_active)}>
                        {c.is_active ? "إيقاف" : "تفعيل"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(c.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
      </div>
    </AdminShell>
  );
};

export default AdminQrCampaigns;
