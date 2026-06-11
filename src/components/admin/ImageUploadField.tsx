import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Upload, Link2, Image as ImageIcon, X, Loader2, Video } from "lucide-react";

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
  /** When true, allows video file uploads alongside images. */
  acceptVideo?: boolean;
};

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

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
  acceptVideo = false,
}: Props) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !(acceptVideo && isVideo)) {
      toast({ title: acceptVideo ? "الملف ليس صورة أو فيديو" : "الملف ليس صورة", variant: "destructive" });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "حجم الملف كبير", description: "الحد الأقصى 20 ميجابايت.", variant: "destructive" });
      return;
    }
    setBusy(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || (isVideo ? "mp4" : "jpg");
    const path = `${pathPrefix || "misc"}/${kind}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
      cacheControl: "3600",
      contentType: file.type,
    });
    if (error) {
      setBusy(false);
      toast({ title: "تعذّر رفع الملف", description: error.message, variant: "destructive" });
      return;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setBusy(false);
    onChange(data.publicUrl);
    toast({ title: "تم رفع الملف" });
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void handleFile(f);
    e.target.value = "";
  };

  const isWide = shape === "wide";
  const previewClass = isWide ? "w-full aspect-[3/1]" : "w-20 h-20";
  const showVideo = value && isVideoUrl(value);

  return (
    <div className="space-y-2">
      <div className={isWide ? "space-y-3" : "flex items-start gap-3"}>
        <div
          className={`${previewClass} shrink-0 rounded-lg bg-white border border-border grid place-items-center overflow-hidden`}
        >
          {showVideo ? (
            <video
              src={value}
              className={shape === "wide" ? "w-full h-full object-cover" : "w-full h-full object-contain p-1.5"}
              controls
              muted
            />
          ) : value ? (
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
              <Upload className="w-3.5 h-3.5" /> {acceptVideo ? "رفع ملف" : "رفع صورة"}
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
              <input
                ref={inputRef}
                type="file"
                accept={acceptVideo ? "image/*,video/*" : "image/*"}
                className="sr-only"
                onChange={onPick}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
                className="gap-1"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {busy ? "جارٍ الرفع…" : acceptVideo ? "اختر ملف" : "اختر صورة"}
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
            {mode === "upload"
              ? acceptVideo
                ? "PNG أو JPG أو MP4 أو WebM، الحد الأقصى 20 ميجابايت."
                : "PNG أو JPG، الحد الأقصى 5 ميجابايت."
              : "الصق رابط صورة أو فيديو مباشر (يُفضّل من مصدر موثوق)."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ImageUploadField;
