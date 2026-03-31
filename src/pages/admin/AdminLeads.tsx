import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AdminLeads = () => {
  useRequireAdmin();
  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const typeLabels: Record<string, string> = { leasing: "تأجير", contact: "تواصل", partnership: "شراكة", media: "إعلام", careers: "وظائف" };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center gap-3">
          <Link to="/admin" className="text-primary hover:underline"><ArrowRight className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold text-foreground">العملاء المحتملون</h1>
        </div>
      </header>
      <main className="container py-8">
        {isLoading ? <p className="text-muted-foreground">جاري التحميل...</p> : (
          <div className="space-y-3">
            {leads?.map((lead) => (
              <div key={lead.id} className="card-premium p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-foreground">{lead.full_name}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{typeLabels[lead.lead_type] ?? lead.lead_type}</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  {lead.phone && <p>📞 <span dir="ltr">{lead.phone}</span></p>}
                  {lead.email && <p>📧 {lead.email}</p>}
                  {lead.company && <p>🏢 {lead.company}</p>}
                  {lead.message && <p>💬 {lead.message}</p>}
                  <p className="text-xs">{new Date(lead.created_at).toLocaleDateString("ar-EG")}</p>
                </div>
              </div>
            ))}
            {leads?.length === 0 && <p className="text-muted-foreground text-center py-8">لا توجد طلبات بعد</p>}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLeads;
