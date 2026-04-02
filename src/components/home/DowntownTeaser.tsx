import { Link } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function DowntownTeaser() {
  const { data: count } = useQuery({
    queryKey: ["downtown-merchants-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("downtown_merchants")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      return count ?? 0;
    },
  });

  return (
    <section className="py-8 md:py-10" style={{ background: "#F5F2EC" }}>
      <div className="container">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="grid lg:grid-cols-[1fr_0.5fr]">
            <div className="space-y-3 p-5 md:p-6">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <p className="section-kicker">فرع وسط البلد</p>
              </div>
              <h2 className="section-title max-w-[20rem]">الإرث الذي بنى الاسم.</h2>
              <p className="text-[0.82rem] leading-[1.65] light-body max-w-[28rem]">
                منذ التسعينات ومول البستان في شارع البستان بباب اللوق هو المرجع الأول لسوق الكمبيوتر في مصر. اكتشف دليل المحلات الكامل.
              </p>

              <div className="flex flex-wrap items-center gap-4 border-t border-border pt-3">
                <div className="flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[0.78rem] font-bold light-heading">{count ?? 30}+ محل</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[0.78rem] light-muted">شارع البستان، باب اللوق</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <Link to="/downtown-directory">
                  <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.78rem] font-bold">
                    دليل المحلات <ArrowLeft className="mr-1 h-3 w-3" />
                  </Button>
                </Link>
                <Link to="/downtown-branch">
                  <Button variant="outline-blue" className="h-9 rounded-lg px-5 text-[0.78rem]">
                    عن الفرع
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden border-r border-border p-5 lg:flex lg:flex-col lg:items-center lg:justify-center" style={{ background: "#F5F2EC" }}>
              <div className="text-center">
                <p className="font-poppins text-[2rem] font-extrabold text-primary">{count ?? 30}+</p>
                <p className="text-[0.82rem] font-bold light-heading">محل تجاري</p>
                <p className="mt-1 text-[0.7rem] light-muted">منذ أكثر من 30 عاما</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
