import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Upload, Link2, Image as ImageIcon, X, Loader2 } from "lucide-react";

type Props = {
  /** Current image URL value. */
  value: string | null | undefined;
  /** Called with the new URL (uploaded public URL or pasted link), or "" when cleared. */
  onChange: (url: string) => void;
  /** Storage path prefix, e.g. the store id. Used to namespace uploaded files. */
  pathPrefix: string;
  /** Logical kind, used in the generated filename (logo, cover, gallery…). */
  kind?: string;
  /** Storage bucket name. Defaults to "logos". */
  bucket?: string;
  /** Preview shape. */
  shape?: "square" | "wide";
  placeholder?: string;
};

/**
 * Lets the user either upload an image file (stored in Supabase Storage) or
 * paste an external URL. Both modes write a final URL through `onChange`.
 */
export function ImageUploadField({
  value,
  onChange,
  pathPrefix,
  kind = "image",
  bucket = "logos",
  shape = "square",
  placeholder = "https://…",
}: Props) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "الملف ليس صورة", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "حجم الصورة كبير", description: "الحد الأقصى 5 ميجابايت.", variant: "destructive" });
      return;
    }
    setBusy(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${pathPrefix || "misc"}/${kind}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
      cacheControl: "3600",
      contentType: file.type,
    });
    if (error) {
      setBusy(false);
      toast({ title: "تعذّر رفع الصورة", description: error.message, variant: "destructive" });
      return;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setBusy(false);
    onChange(data.publicUrl);
    toast({ title: "تم رفع الصورة" });
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void handleFile(f);
    e.target.value = "";
  };

  const previewClass = shape === "wide" ? "w-full aspect-[3/1]" : "w-20 h-20";

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <div
          className={`${previewClass} shrink-0 rounded-lg bg-white border border-border grid place-items-center overflow-hidden`}
        >
          {value ? (
            <img
              src={value}
              alt=""
              className={shape === "wide" ? "w-full h-full object-cover" : "w-full h-full object-contain p-1.5"}
              onError={(e) => ((e.currentTarget.style.opacity = "0.2"))}
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="inline-flex rounded-lg border border-border p-0.5 bg-secondary/50">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition ${
                mode === "upload" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> رفع صورة
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition ${
                mode === "url" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" /> رابط
            </button>
          </div>

          {mode === "upload" ? (
            <div className="flex items-center gap-2">
              <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={onPick} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
                className="gap-1"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {busy ? "جارٍ الرفع…" : "اختر صورة"}
              </Button>
              {value && (
                <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")} className="gap-1 text-red-600">
                  <X className="w-4 h-4" /> إزالة
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                dir="ltr"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
              />
              {value && (
                <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")} className="text-red-600">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
          <p className="text-[0.7rem] text-muted-foreground">
            {mode === "upload" ? "PNG أو JPG، الحد الأقصى 5 ميجابايت." : "الصق رابط صورة مباشر (يُفضّل من مصدر موثوق)."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ImageUploadField;
