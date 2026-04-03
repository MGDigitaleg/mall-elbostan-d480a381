import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Pencil, Trash2 } from "lucide-react";

interface CrudPageProps {
  table: "stores" | "units" | "events" | "rewards" | "deals" | "jobs" | "blog_posts" | "faqs" | "products" | "product_categories";
  title: string;
  nameField: string;
  fields: { key: string; label: string; type?: string }[];
}

export function AdminCrudPage({ table, title, nameField, fields }: CrudPageProps) {
  const { loading: authLoading } = useRequireAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const { data: items, isLoading } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const cleanData: Record<string, unknown> = {};
      fields.forEach((f) => {
        const val = data[f.key];
        if (f.type === "boolean") cleanData[f.key] = val === "true";
        else if (f.type === "number") cleanData[f.key] = val ? Number(val) : null;
        else cleanData[f.key] = val || null;
      });

      if (editId) {
        const { error } = await supabase.from(table).update(cleanData).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert(cleanData as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
      setShowForm(false);
      setEditId(null);
      setFormData({});
      toast({ title: "تم الحفظ بنجاح" });
    },
    onError: () => toast({ title: "خطأ", description: "حدث خطأ أثناء الحفظ", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
      toast({ title: "تم الحذف" });
    },
  });

  const openEdit = (item: Record<string, unknown>) => {
    setEditId(item.id as string);
    const data: Record<string, string> = {};
    fields.forEach((f) => { data[f.key] = String(item[f.key] ?? ""); });
    setFormData(data);
    setShowForm(true);
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-primary hover:underline"><ArrowRight className="w-5 h-5" /></Link>
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          </div>
          <Button variant="cta" size="sm" onClick={() => { setEditId(null); setFormData({}); setShowForm(true); }}>
            <Plus className="w-4 h-4 ml-1" /> إضافة
          </Button>
        </div>
      </header>

      <main className="container py-8">
        {isLoading ? <p className="text-muted-foreground">جاري التحميل...</p> : (
          <div className="space-y-3">
            {items?.map((item: Record<string, unknown>) => (
              <div key={item.id as string} className="card-premium p-4 flex items-center justify-between">
                <span className="font-medium text-foreground">{String(item[nameField] ?? item.id)}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id as string)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
            {items?.length === 0 && <p className="text-muted-foreground text-center py-8">لا توجد بيانات</p>}
          </div>
        )}
      </main>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "تعديل" : "إضافة"} {title}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} className="space-y-3">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="text-sm text-muted-foreground mb-1 block">{field.label}</label>
                {field.type === "textarea" ? (
                  <Textarea value={formData[field.key] ?? ""} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} className="bg-secondary border-border" />
                ) : (
                  <Input value={formData[field.key] ?? ""} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} className="bg-secondary border-border" type={field.type === "number" ? "number" : "text"} dir={field.key.includes("email") || field.key.includes("phone") || field.key.includes("url") || field.key.includes("website") ? "ltr" : "rtl"} />
                )}
              </div>
            ))}
            <Button type="submit" variant="cta" className="w-full" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
