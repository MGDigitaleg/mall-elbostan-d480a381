import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AdminPageHeader,
  AdminStatCard,
  AdminStatusBadge,
  AdminEmptyState,
} from "@/components/admin/AdminPrimitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { downloadCsv } from "@/lib/csvExport";
import { Users, Download, Search, Inbox, Phone, Mail, Building2 } from "lucide-react";

type Lead = {
  id: string;
  full_name: string;
  lead_type: string;
  phone: string | null;
  email: string | null;
  company: string | null;
  message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

const TYPE_LABELS: Record<string, string> = {
  leasing: "تأجير",
  contact: "تواصل",
  partnership: "شراكة",
  media: "إعلام",
  careers: "وظائف",
};

const TYPE_TONES: Record<string, "info" | "success" | "warning" | "neutral"> = {
  leasing: "info",
  contact: "neutral",
  partnership: "success",
  media: "warning",
  careers: "neutral",
};

export default function AdminLeads() {
  const { loading: authLoading } = useRequireAdmin();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: leads, isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (leads ?? []).filter((l) => {
      if (typeFilter !== "all" && l.lead_type !== typeFilter) return false;
      if (!q) return true;
      return (
        l.full_name?.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.company?.toLowerCase().includes(q)
      );
    });
  }, [leads, search, typeFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { total: leads?.length ?? 0 };
    (leads ?? []).forEach((l) => {
      c[l.lead_type] = (c[l.lead_type] ?? 0) + 1;
    });
    return c;
  }, [leads]);

  const handleExport = () => {
    if (!filtered.length) {
      toast({ title: "لا توجد بيانات للتصدير", variant: "destructive" });
      return;
    }
    downloadCsv("leads", filtered, [
      { header: "التاريخ", value: (l) => new Date(l.created_at).toISOString() },
      { header: "النوع", value: (l) => TYPE_LABELS[l.lead_type] ?? l.lead_type },
      { header: "الاسم", value: (l) => l.full_name },
      { header: "الهاتف", value: (l) => l.phone ?? "" },
      { header: "البريد", value: (l) => l.email ?? "" },
      { header: "الشركة", value: (l) => l.company ?? "" },
      { header: "الرسالة", value: (l) => l.message ?? "" },
      { header: "المصدر", value: (l) => (l.metadata as any)?.utm_source ?? "" },
    ]);
    toast({ title: "تم التصدير", description: `${filtered.length} سجل` });
  };

  if (authLoading) return null;

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <AdminPageHeader
          title="العملاء المحتملون"
          subtitle="جميع الطلبات الواردة من نماذج الموقع، مع تصفية وتصدير."
          actions={
            <Button size="sm" variant="cta" className="gap-1" onClick={handleExport}>
              <Download className="w-4 h-4" /> تصدير CSV
            </Button>
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-5">
          <AdminStatCard
            label="الإجمالي"
            value={counts.total ?? 0}
            tone="info"
            icon={Users}
            loading={isLoading}
          />
          {(["leasing", "contact", "partnership", "media", "careers"] as const).map((t) => (
            <AdminStatCard
              key={t}
              label={TYPE_LABELS[t]}
              value={counts[t] ?? 0}
              tone={TYPE_TONES[t]}
              icon={Inbox}
              loading={isLoading}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم، الهاتف، البريد، الشركة..."
              className="pr-9"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm font-bold text-foreground"
          >
            <option value="all">كل الأنواع</option>
            {Object.entries(TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground py-8 text-center">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <AdminEmptyState
            icon={Inbox}
            title="لا توجد طلبات"
            description={search || typeFilter !== "all" ? "حاول تعديل البحث أو الفلاتر." : "ستظهر الطلبات الواردة من نماذج الموقع هنا."}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((l) => (
              <article key={l.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="font-bold text-foreground truncate">{l.full_name}</div>
                  <AdminStatusBadge tone={TYPE_TONES[l.lead_type] ?? "neutral"}>
                    {TYPE_LABELS[l.lead_type] ?? l.lead_type}
                  </AdminStatusBadge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  {l.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span dir="ltr">{l.phone}</span>
                    </div>
                  )}
                  {l.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> {l.email}
                    </div>
                  )}
                  {l.company && (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> {l.company}
                    </div>
                  )}
                </div>
                {l.message && (
                  <p className="text-sm text-foreground mt-2 line-clamp-3 leading-relaxed">{l.message}</p>
                )}
                <div className="text-[0.68rem] text-muted-foreground mt-2 pt-2 border-t border-border">
                  {new Date(l.created_at).toLocaleString("ar-EG")}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
