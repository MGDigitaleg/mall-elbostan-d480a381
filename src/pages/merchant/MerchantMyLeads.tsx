import { useEffect, useState } from "react";
import { useRequireMerchant } from "@/hooks/useMerchant";
import { MerchantShell } from "@/components/merchant/MerchantShell";
import { AdminPageHeader, AdminEmptyState } from "@/components/admin/AdminPrimitives";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Lead {
  id: string;
  created_at: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  lead_type: string;
  metadata: any;
}

export default function MerchantMyLeads() {
  const { loading, activeStore } = useRequireMerchant();
  const [rows, setRows] = useState<Lead[]>([]);

  useEffect(() => {
    if (!activeStore) return;
    (async () => {
      const { data } = await supabase
        .from("leads")
        .select("id,created_at,full_name,email,phone,message,lead_type,metadata")
        .filter("metadata->>store_id", "eq", activeStore.id)
        .order("created_at", { ascending: false })
        .limit(200);
      setRows((data ?? []) as Lead[]);
    })();
  }, [activeStore?.id]);

  if (loading || !activeStore) {
    return <MerchantShell><div className="text-sm text-muted-foreground">جاري التحميل…</div></MerchantShell>;
  }

  return (
    <MerchantShell>
      <AdminPageHeader
        title="الاستفسارات"
        subtitle="الاستفسارات الواردة المرتبطة بمتجرك فقط"
      />
      {rows.length === 0 ? (
        <AdminEmptyState
          icon={MessageSquare}
          title="لا توجد استفسارات بعد"
          description="ستظهر هنا الاستفسارات الواردة من زوار صفحة متجرك أو منتجاتك."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs">
              <tr>
                <th className="text-right p-3">التاريخ</th>
                <th className="text-right p-3">الاسم</th>
                <th className="text-right p-3">الهاتف</th>
                <th className="text-right p-3">البريد</th>
                <th className="text-right p-3">النوع</th>
                <th className="text-right p-3">الرسالة</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="p-3 whitespace-nowrap text-xs">{new Date(l.created_at).toLocaleDateString("ar-EG")}</td>
                  <td className="p-3 font-bold">{l.full_name}</td>
                  <td className="p-3" dir="ltr">{l.phone ?? "—"}</td>
                  <td className="p-3" dir="ltr">{l.email ?? "—"}</td>
                  <td className="p-3 text-xs">{l.lead_type}</td>
                  <td className="p-3 max-w-md text-muted-foreground">{l.message ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MerchantShell>
  );
}
