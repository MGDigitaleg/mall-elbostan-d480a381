import { useQuery } from "@tanstack/react-query";
import { Tag, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useCountdown } from "@/hooks/useCountdown";
import { LoadingGrid, EmptyState } from "@/components/ui/loading-states";

const LAUNCH_DATE = new Date("2026-05-01T00:00:00+02:00");

const DailyDeals = () => {
  const { isExpired } = useCountdown(LAUNCH_DATE);

  const { data: deals, isLoading } = useQuery({
    queryKey: ["live-deals"],
    queryFn: async () => {
      const { data } = await supabase.from("deals").select("*, stores(name_ar, slug)").eq("is_live", true).order("featured", { ascending: false });
      return data ?? [];
    },
    enabled: isExpired,
  });

  return (
    <MainLayout>
      <SEOHead title="العروض اليومية" titleEn="Daily Deals" description="أحدث العروض والخصومات في مول البستان - عروض يومية حصرية على التكنولوجيا والإلكترونيات." descriptionEn="Latest deals and discounts at Mall Elbostan." breadcrumbs={[{ name: "العروض اليومية", url: "/daily-deals" }]} />
      <div className="container py-20">
        <h1 className="text-4xl font-bold text-gradient-blue mb-8 text-center">عروض المتاجر</h1>

        {!isExpired ? (
          <div className="text-center py-16">
            <Tag className="w-16 h-16 text-orange mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">العروض تنطلق مع الافتتاح الكبير</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">ترقّب عروضًا حصرية وخصومات من متاجر المول على أحدث المنتجات التقنية — بدءًا من يوم الافتتاح.</p>
            <CountdownTimer />
          </div>
        ) : isLoading ? (
          <LoadingGrid />
        ) : deals && deals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <div key={deal.id} className="card-premium p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground">{deal.title_ar}</h3>
                  {deal.featured && <span className="text-xs bg-orange/20 text-orange px-2 py-1 rounded">مميز</span>}
                </div>
                {deal.description_ar && <p className="text-sm text-muted-foreground mb-3">{deal.description_ar}</p>}
                {deal.promo_code && (
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">كود الخصم</p>
                    <p className="font-bold text-primary font-poppins tracking-wider">{deal.promo_code}</p>
                  </div>
                )}
                {deal.valid_to && (
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> صالح حتى {new Date(deal.valid_to).toLocaleDateString("ar-EG")}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="لا توجد عروض حالياً" description="تابعنا للحصول على آخر العروض والخصومات" />
        )}
      </div>
    </MainLayout>
  );
};

export default DailyDeals;
