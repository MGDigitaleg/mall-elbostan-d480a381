import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Power, Save } from "lucide-react";

interface Props {
  campaignKey?: string;
}

export function CampaignToggleCard({ campaignKey = "spin_win" }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [active, setActive] = useState(true);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("campaign_settings")
      .select("is_active, paused_title_ar, paused_message_ar")
      .eq("key", campaignKey)
      .maybeSingle();
    if (data) {
      setActive(data.is_active);
      setTitle(data.paused_title_ar ?? "");
      setMessage(data.paused_message_ar ?? "");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [campaignKey]);

  const save = async (overrides?: Partial<{ is_active: boolean }>) => {
    setSaving(true);
    const payload = {
      is_active: overrides?.is_active ?? active,
      paused_title_ar: title || null,
      paused_message_ar: message || null,
    };
    const { error } = await supabase
      .from("campaign_settings")
      .update(payload)
      .eq("key", campaignKey);
    setSaving(false);
    if (error) { toast.error("فشل الحفظ"); return; }
    toast.success(payload.is_active ? "الحملة مفعّلة" : "الحملة موقوفة");
  };

  const onToggle = async (next: boolean) => {
    setActive(next);
    await save({ is_active: next });
  };

  if (loading) return <Card className="p-4 mb-6 animate-pulse h-24" />;

  return (
    <Card className={`p-5 mb-6 border-l-4 ${active ? "border-l-emerald-500" : "border-l-orange-500"}`}>
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
            <Power className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-base">حالة الحملة</div>
            <div className="text-sm text-muted-foreground">
              {active ? "الحملة نشطة — صفحة /spin-win تعمل بشكل طبيعي." : "الحملة موقوفة — الزوار يشاهدون رسالة 'الحملة قريباً'."}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{active ? "نشطة" : "موقوفة"}</span>
          <Switch checked={active} onCheckedChange={onToggle} disabled={saving} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-border">
        <div>
          <Label className="text-xs">عنوان شاشة الإيقاف</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: الحملة قريباً" />
        </div>
        <div>
          <Label className="text-xs">رسالة شاشة الإيقاف</Label>
          <Textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="نص الرسالة المعروضة للزوار..." />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button size="sm" onClick={() => save()} disabled={saving}>
            <Save className="w-4 h-4 ml-1" /> حفظ النصوص
          </Button>
        </div>
      </div>
    </Card>
  );
}
