import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, CalendarDays, Globe, Gift } from "lucide-react";

const LANG_OPTIONS = [
  { code: "ar-EG", label: "العربية" },
  { code: "en", label: "English" },
];

type Settings = {
  id: string;
  key: string;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  headline_ar: string | null;
  headline_en: string | null;
  subtitle_ar: string | null;
  subtitle_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  cta_label_ar: string | null;
  cta_label_en: string | null;
  paused_title_ar: string | null;
  paused_message_ar: string | null;
  languages: string[];
};

const toLocal = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function SpinCampaignSettings() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState<Partial<Settings>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["spin-campaign-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaign_settings")
        .select("*")
        .eq("key", "spin_win")
        .maybeSingle();
      if (error) throw error;
      return data as Settings | null;
    },
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const { data: prizes } = useQuery({
    queryKey: ["spin-campaign-prizes-summary"],
    queryFn: async () => {
      const { data } = await supabase
        .from("store_prizes")
        .select("id, name_ar, prize_type, total_quantity, remaining_stock, is_active")
        .order("prize_type");
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!form.id) throw new Error("missing id");
      const payload = {
        starts_at: form.starts_at || null,
        ends_at: form.ends_at || null,
        headline_ar: form.headline_ar || null,
        headline_en: form.headline_en || null,
        subtitle_ar: form.subtitle_ar || null,
        subtitle_en: form.subtitle_en || null,
        description_ar: form.description_ar || null,
        description_en: form.description_en || null,
        cta_label_ar: form.cta_label_ar || null,
        cta_label_en: form.cta_label_en || null,
        paused_title_ar: form.paused_title_ar || null,
        paused_message_ar: form.paused_message_ar || null,
        languages: form.languages && form.languages.length > 0 ? form.languages : ["ar-EG"],
      };
      const { error } = await supabase
        .from("campaign_settings")
        .update(payload)
        .eq("id", form.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["spin-campaign-settings"] });
      qc.invalidateQueries({ queryKey: ["spin-win-campaign"] });
      toast({ title: "تم الحفظ" });
    },
    onError: (e: any) => toast({ title: "خطأ", description: e.message, variant: "destructive" }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin ml-2" /> جاري التحميل...
      </div>
    );
  }

  const langs = form.languages ?? [];

  const toggleLang = (code: string) => {
    const next = langs.includes(code) ? langs.filter((c) => c !== code) : [...langs, code];
    setForm({ ...form, languages: next });
  };

  return (
    <div className="space-y-6">
      {/* Dates */}
      <section className="card-premium p-5">
        <header className="mb-4 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">تواريخ الحملة</h3>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-xs">تاريخ البدء</Label>
            <Input
              type="datetime-local"
              value={toLocal(form.starts_at ?? null)}
              onChange={(e) => setForm({ ...form, starts_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
            />
          </div>
          <div>
            <Label className="text-xs">تاريخ الانتهاء</Label>
            <Input
              type="datetime-local"
              value={toLocal(form.ends_at ?? null)}
              onChange={(e) => setForm({ ...form, ends_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
            />
          </div>
        </div>
      </section>

      {/* Copy */}
      <section className="card-premium p-5">
        <header className="mb-4">
          <h3 className="text-sm font-bold text-foreground">نصوص الحملة</h3>
          <p className="text-xs text-muted-foreground mt-0.5">تظهر في الواجهة وفي بيانات SEO المنظمة.</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-xs">العنوان (عربي)</Label>
            <Input value={form.headline_ar ?? ""} onChange={(e) => setForm({ ...form, headline_ar: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Headline (English)</Label>
            <Input value={form.headline_en ?? ""} onChange={(e) => setForm({ ...form, headline_en: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">العنوان الفرعي (عربي)</Label>
            <Input value={form.subtitle_ar ?? ""} onChange={(e) => setForm({ ...form, subtitle_ar: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Subtitle (English)</Label>
            <Input value={form.subtitle_en ?? ""} onChange={(e) => setForm({ ...form, subtitle_en: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs">الوصف (عربي)</Label>
            <Textarea rows={3} value={form.description_ar ?? ""} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs">Description (English)</Label>
            <Textarea rows={3} value={form.description_en ?? ""} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">نص زر الدعوة (عربي)</Label>
            <Input value={form.cta_label_ar ?? ""} onChange={(e) => setForm({ ...form, cta_label_ar: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">CTA Label (English)</Label>
            <Input value={form.cta_label_en ?? ""} onChange={(e) => setForm({ ...form, cta_label_en: e.target.value })} />
          </div>
        </div>
      </section>

      {/* Paused state */}
      <section className="card-premium p-5">
        <header className="mb-4">
          <h3 className="text-sm font-bold text-foreground">رسالة التوقف المؤقت</h3>
          <p className="text-xs text-muted-foreground mt-0.5">تظهر للزائر عندما تكون الحملة غير مفعّلة.</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-xs">العنوان</Label>
            <Input value={form.paused_title_ar ?? ""} onChange={(e) => setForm({ ...form, paused_title_ar: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs">الرسالة</Label>
            <Textarea rows={2} value={form.paused_message_ar ?? ""} onChange={(e) => setForm({ ...form, paused_message_ar: e.target.value })} />
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="card-premium p-5">
        <header className="mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">اللغات المدعومة</h3>
        </header>
        <div className="flex flex-wrap gap-2">
          {LANG_OPTIONS.map((l) => {
            const active = langs.includes(l.code);
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => toggleLang(l.code)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                  active ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary/50"
                }`}
              >
                {l.label} <span className="opacity-60">({l.code})</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Prizes summary */}
      <section className="card-premium p-5">
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">قائمة الجوائز</h3>
          </div>
          <p className="text-xs text-muted-foreground">للتعديل: تبويب «مخزون الجوائز»</p>
        </header>
        {prizes && prizes.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-right font-bold">الاسم</th>
                  <th className="px-3 py-2 text-right font-bold">النوع</th>
                  <th className="px-3 py-2 text-right font-bold">المخزون</th>
                  <th className="px-3 py-2 text-right font-bold">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {prizes.map((p: any) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-3 py-2 font-medium text-foreground">{p.name_ar}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.prize_type}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.remaining_stock}/{p.total_quantity}</td>
                    <td className="px-3 py-2">
                      {p.is_active ? (
                        <span className="rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">نشط</span>
                      ) : (
                        <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">متوقف</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">لا توجد جوائز مسجّلة.</p>
        )}
      </section>

      <div className="flex justify-end">
        <Button variant="cta" onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  );
}
