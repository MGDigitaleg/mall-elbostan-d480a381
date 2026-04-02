import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Phone, MapPin, ExternalLink, CheckCircle, AlertCircle, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  verified: { label: "موثّق", color: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  official_source_linked: { label: "مصدر رسمي", color: "bg-primary/10 text-primary border-primary/20", icon: ExternalLink },
  needs_review: { label: "قيد المراجعة", color: "bg-orange-500/10 text-orange-600 border-orange-500/20", icon: AlertCircle },
};

const DowntownDirectory = () => {
  const { data: merchants, isLoading } = useQuery({
    queryKey: ["downtown-merchants"],
    queryFn: async () => {
      const { data } = await supabase
        .from("downtown_merchants")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  return (
    <MainLayout>
      <SEOHead
        title="دليل محلات فرع وسط البلد"
        titleEn="Downtown Branch Directory"
        description="دليل شامل لمحلات مول البستان في وسط البلد — شارع البستان، باب اللوق، القاهرة. أرقام الهواتف والتصنيفات."
      />

      <section className="py-8 md:py-10" style={{ background: "#071326" }}>
        <div className="container text-center">
          <Building2 className="mx-auto mb-3 h-6 w-6" style={{ color: "#CDBB9A" }} />
          <h1 className="text-[1.3rem] font-bold md:text-[1.6rem]" style={{ color: "#F8FAFC" }}>
            دليل محلات فرع وسط البلد
          </h1>
          <p className="mx-auto mt-2 max-w-[28rem] text-[0.82rem] leading-[1.7]" style={{ color: "#94A3B8" }}>
            18 شارع البستان، باب اللوق، القاهرة — المرجع الأول لسوق الكمبيوتر في مصر منذ التسعينات.
          </p>
          <div className="mt-3 flex justify-center gap-2">
            <Link to="/downtown-branch">
              <Button variant="outline-blue" className="h-9 rounded-lg px-4 text-[0.78rem]">عن الفرع</Button>
            </Link>
            <Link to="/stores">
              <Button className="h-9 rounded-lg border px-4 text-[0.78rem]" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#CBD5E1" }}>فرع القاهرة الجديدة</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-4xl">
          {isLoading ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg border border-border bg-card" />
              ))}
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[0.85rem] font-bold light-heading">{merchants?.length ?? 0} محل تجاري</p>
                <Badge variant="outline" className="text-[0.65rem]">
                  <MapPin className="ml-1 h-3 w-3" /> باب اللوق، القاهرة
                </Badge>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {merchants?.map((m) => {
                  const status = statusConfig[m.verification_status] ?? statusConfig.needs_review;
                  return (
                    <div key={m.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-sm">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
                        <Store className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[0.85rem] font-bold light-heading">{m.name_ar}</p>
                            {m.name_en && <p className="font-poppins text-[0.7rem] light-muted">{m.name_en}</p>}
                          </div>
                          <Badge variant="outline" className={`shrink-0 text-[0.55rem] ${status.color}`}>
                            <status.icon className="ml-0.5 h-2.5 w-2.5" />
                            {status.label}
                          </Badge>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[0.72rem] light-muted">
                          {m.floor && <span>الدور {m.floor}</span>}
                          {m.phone && (
                            <a href={`tel:${m.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                              <Phone className="h-3 w-3" /> {m.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-lg border border-border bg-card p-4 text-center">
                <p className="text-[0.78rem] light-muted">
                  البيانات مصدرها أدلة تجارية عامة موثوقة. للتحديث أو الإضافة{" "}
                  <Link to="/contact" className="font-bold text-primary hover:underline">تواصل معنا</Link>.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default DowntownDirectory;
