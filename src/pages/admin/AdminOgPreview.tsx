import { useState } from "react";
import { getOgImageUrl, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from "@/lib/ogImageUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  "",
  "الهواتف والإكسسوارات",
  "الكمبيوتر والمكونات",
  "الألعاب والجيمنج",
  "الشبكات والاتصالات",
  "الصوتيات والسماعات",
  "الطباعة والتصوير",
  "الأجهزة المنزلية الذكية",
  "الصيانة والدعم الفني",
  "البرمجيات والخدمات",
  "الأمن والمراقبة",
];

export default function AdminOgPreview() {
  const [title, setTitle] = useState("كاسر زيرو");
  const [type, setType] = useState<"store" | "product">("store");
  const [category, setCategory] = useState("");
  const [format, setFormat] = useState<"png" | "svg">("png");
  const [key, setKey] = useState(0);

  const url = getOgImageUrl(title, type, category || undefined, format);

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    toast.success("تم نسخ الرابط");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-foreground">معاينة صور OG</h1>

      <div className="grid md:grid-cols-[340px_1fr] gap-6">
        {/* Controls */}
        <Card>
          <CardHeader><CardTitle className="text-base">الإعدادات</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>العنوان</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="اسم المحل أو المنتج" />
            </div>

            <div className="space-y-1.5">
              <Label>النوع</Label>
              <Select value={type} onValueChange={v => setType(v as "store" | "product")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="store">محل</SelectItem>
                  <SelectItem value="product">منتج</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>التصنيف (اختياري)</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="بدون تصنيف" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">بدون</SelectItem>
                  {CATEGORIES.filter(Boolean).map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>الصيغة</Label>
              <Select value={format} onValueChange={v => setFormat(v as "png" | "svg")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="svg">SVG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setKey(k => k + 1)}>
                <RefreshCw className="h-3.5 w-3.5" /> تحديث
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={copyUrl}>
                <Copy className="h-3.5 w-3.5" /> نسخ
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" /> فتح
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {OG_IMAGE_WIDTH}×{OG_IMAGE_HEIGHT} — {format.toUpperCase()}
          </p>
          <div className="rounded-lg border border-border overflow-hidden bg-muted" style={{ maxWidth: 720 }}>
            <img
              key={key}
              src={url}
              alt="OG Preview"
              width={OG_IMAGE_WIDTH}
              height={OG_IMAGE_HEIGHT}
              className="w-full h-auto"
              loading="eager"
            />
          </div>
          <p className="text-xs text-muted-foreground break-all font-mono ltr" dir="ltr">{url}</p>
        </div>
      </div>
    </div>
  );
}
