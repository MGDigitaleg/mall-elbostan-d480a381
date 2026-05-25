import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader, AdminStatusBadge, AdminEmptyState, AdminStatCard } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tag, Search, Plus, Eye, EyeOff, Star, StarOff, Trash2, Pencil, Clock } from "lucide-react";

const COLUMNS = [
  { key: "draft", label: "مسودات", tone: "warning" as const },
  { key: "live", label: "مباشر الآن", tone: "success" as const },
  { key: "featured", label: "في الواجهة", tone: "info" as const },
  { key: "expired", label: "منتهي", tone: "neutral" as const },
];

type DealRow = {
  id: string;
  title_ar: string;
  campaign_key: string;
  is_live: boolean;
  featured: boolean;
  valid_from: string | null;
  valid_to: string | null;
  price_current: number | null;
  price_old: number | null;
  image_primary: string | null;
  store_id: string | null;
  updated_at: string;
};

export default function AdminOffersPipeline() {
  const { loading: authLoading } = useRequireAdmin();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: deals, isLoading } = useQuery({
    queryKey: ["admin-offers-pipeline"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("id,title_ar,campaign_key,is_live,featured,valid_from,valid_to,price_current,price_old,image_primary,store_id,updated_at")
        .order("updated_at", { ascending: false })
        .limit(400);
      if (error) throw error;
      return (data ?? []) as DealRow[];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return deals ?? [];
    return (deals ?? []).filter((d) => d.title_ar?.toLowerCase().includes(q));
  }, [deals, search]);

  const now = Date.now();
  const buckets = useMemo(() => {
    const b: Record<string, DealRow[]> = { draft: [], live: [], featured: [], expired: [] };
    filtered.forEach((d) => {
      const expired = d.valid_to && new Date(d.valid_to).getTime() < now;
      if (expired) b.expired.push(d);
      else if (d.featured && d.is_live) b.featured.push(d);
      else if (d.is_live) b.live.push(d);
      else b.draft.push(d);
    });
    return b;
  }, [filtered, now]);

  const updateMut = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { error } = await supabase.from("deals").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-offers-pipeline"] });
      toast({ title: "تم التحديث" });
    },
    onError: (e: Error) => toast({ title: "خطأ", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("deals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-offers-pipeline"] });
      toast({ title: "تم الحذف" });
    },
  });

  if (authLoading) return null;

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <AdminPageHeader
          title="مسار العروض"
          subtitle="نظرة على دورة حياة العروض من المسودة إلى الواجهة، مع إجراءات سريعة"
          actions={
            <div className="flex items-center gap-2">
              <Link to="/admin/social-offers">
                <Button variant="outline" size="sm">من السوشيال</Button>
              </Link>
              <Link to="/admin/deals">
                <Button size="sm" className="gap-1">
                  <Plus className="w-4 h-4" /> عرض جديد
                </Button>
              </Link>
            </div>
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {COLUMNS.map((c) => (
            <AdminStatCard
              key={c.key}
              label={c.label}
              value={buckets[c.key].length}
              tone={c.tone}
              icon={Tag}
              loading={isLoading}
            />
          ))}
        </div>

        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث في العروض..."
            className="pr-9"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {COLUMNS.map((col) => (
            <div key={col.key} className="rounded-xl border border-border bg-card flex flex-col min-h-[320px]">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                <h3 className="font-bold text-sm text-foreground">{col.label}</h3>
                <AdminStatusBadge tone={col.tone}>{buckets[col.key].length}</AdminStatusBadge>
              </div>
              <div className="p-2 space-y-2 overflow-y-auto max-h-[70vh]">
                {buckets[col.key].length === 0 ? (
                  <div className="text-xs text-muted-foreground text-center py-6">لا يوجد</div>
                ) : (
                  buckets[col.key].map((d) => (
                    <article key={d.id} className="rounded-lg border border-border bg-background p-2.5">
                      <div className="flex gap-2">
                        <div className="w-12 h-12 rounded-md bg-secondary overflow-hidden shrink-0">
                          {d.image_primary && (
                            <img src={d.image_primary} alt="" className="w-full h-full object-cover" loading="lazy" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-foreground text-sm truncate">{d.title_ar}</div>
                          <div className="text-[0.7rem] text-muted-foreground flex items-center gap-1 mt-0.5">
                            {d.price_current && <span>{d.price_current} ج.م</span>}
                            {d.price_old && <s className="opacity-60">{d.price_old}</s>}
                          </div>
                          {d.valid_to && (
                            <div className="text-[0.65rem] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              ينتهي {new Date(d.valid_to).toLocaleDateString("ar-EG")}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2"
                          title={d.is_live ? "إيقاف" : "نشر مباشر"}
                          onClick={() => updateMut.mutate({ id: d.id, patch: { is_live: !d.is_live } })}
                        >
                          {d.is_live ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2"
                          title={d.featured ? "إزالة من الواجهة" : "إضافة للواجهة"}
                          onClick={() => updateMut.mutate({ id: d.id, patch: { featured: !d.featured } })}
                        >
                          {d.featured ? <StarOff className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                        </Button>
                        <Link to="/admin/deals" className="ml-auto">
                          <Button size="sm" variant="ghost" className="h-7 px-2">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm(`حذف ${d.title_ar}؟`)) deleteMut.mutate(d.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {!isLoading && (deals?.length ?? 0) === 0 && (
          <div className="mt-6">
            <AdminEmptyState
              icon={Tag}
              title="لا توجد عروض بعد"
              description="ابدأ بإنشاء عرض جديد أو استيراد عرض من حسابات السوشيال الخاصة بالمحلات."
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
