import { useEffect, useState } from "react";
import { useRequireMerchant } from "@/hooks/useMerchant";
import { MerchantShell } from "@/components/merchant/MerchantShell";
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Save, Trash2, Image as ImageIcon } from "lucide-react";

export default function MerchantMedia() {
  const { loading, activeStore, refetch } = useRequireMerchant();
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [newImg, setNewImg] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (activeStore) {
      setLogoUrl(activeStore.logo_url ?? "");
      setCoverUrl(activeStore.cover_image_url ?? "");
      const g = Array.isArray(activeStore.gallery) ? activeStore.gallery : [];
      setGallery(g.map((x: any) => (typeof x === "string" ? x : x?.url)).filter(Boolean));
    }
  }, [activeStore?.id]);

  if (loading || !activeStore) {
    return <MerchantShell><div className="text-sm text-muted-foreground">جاري التحميل…</div></MerchantShell>;
  }

  const uploadFile = async (file: File, kind: "logo" | "cover" | "gallery") => {
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${activeStore.id}/${kind}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("logos").upload(path, file, { upsert: false });
    if (error) { toast.error(error.message); setUploading(false); return null; }
    const { data } = supabase.storage.from("logos").getPublicUrl(path);
    setUploading(false);
    return data.publicUrl;
  };

  const onPick = (kind: "logo" | "cover" | "gallery") => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await uploadFile(f, kind);
    if (!url) return;
    if (kind === "logo") setLogoUrl(url);
    else if (kind === "cover") setCoverUrl(url);
    else setGallery((g) => [...g, url]);
  };

  const save = async () => {
    const { error } = await supabase.from("stores").update({
      logo_url: logoUrl || null,
      cover_image_url: coverUrl || null,
      gallery: gallery as any,
    }).eq("id", activeStore.id);
    if (error) { toast.error(error.message); return; }
    toast.success("تم حفظ الوسائط");
    await refetch();
  };

  return (
    <MerchantShell>
      <AdminPageHeader
        title="الوسائط والملفات"
        subtitle="الشعار، صورة الغلاف، ومعرض الصور لمتجرك."
        actions={<Button size="sm" className="gap-1" onClick={save}><Save className="w-4 h-4" /> حفظ</Button>}
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="شعار المتجر">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-lg bg-white border border-border grid place-items-center overflow-hidden">
              {logoUrl ? <img src={logoUrl} alt="logo" className="w-full h-full object-contain p-2" /> : <ImageIcon className="w-6 h-6 text-muted-foreground" />}
            </div>
            <div className="flex-1 space-y-2">
              <Input dir="ltr" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://…" />
              <FilePick onChange={onPick("logo")} busy={uploading} />
            </div>
          </div>
        </Card>

        <Card title="صورة الغلاف">
          <div className="aspect-[3/1] rounded-lg bg-secondary border border-border overflow-hidden mb-2">
            {coverUrl ? <img src={coverUrl} alt="cover" className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center"><ImageIcon className="w-6 h-6 text-muted-foreground" /></div>}
          </div>
          <Input dir="ltr" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://…" />
          <div className="mt-2"><FilePick onChange={onPick("cover")} busy={uploading} /></div>
        </Card>

        <div className="lg:col-span-2">
          <Card title="معرض الصور">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-3">
              {gallery.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-border bg-secondary">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setGallery((g) => g.filter((_, j) => j !== i))} className="absolute top-1 left-1 bg-background/90 rounded p-1">
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              ))}
              {gallery.length === 0 && <div className="col-span-full text-xs text-muted-foreground">لا توجد صور.</div>}
            </div>
            <div className="flex items-center gap-2">
              <Input dir="ltr" value={newImg} onChange={(e) => setNewImg(e.target.value)} placeholder="https://image-url" />
              <Button variant="outline" onClick={() => { if (newImg) { setGallery((g) => [...g, newImg]); setNewImg(""); } }}>أضف رابط</Button>
              <FilePick onChange={onPick("gallery")} busy={uploading} />
            </div>
          </Card>
        </div>
      </div>
    </MerchantShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-bold text-foreground mb-3">{title}</h2>
      {children}
    </div>
  );
}
function FilePick({ onChange, busy }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; busy: boolean }) {
  return (
    <Label className="inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer text-primary hover:underline">
      <Upload className="w-3.5 h-3.5" /> {busy ? "جارٍ الرفع…" : "رفع صورة"}
      <input type="file" accept="image/*" className="sr-only" onChange={onChange} />
    </Label>
  );
}
