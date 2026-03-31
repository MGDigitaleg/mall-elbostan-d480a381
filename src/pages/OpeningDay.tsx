import { Calendar, Users, Gamepad2, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { CountdownTimer } from "@/components/CountdownTimer";
import { LoadingGrid, EmptyState } from "@/components/ui/loading-states";

const OpeningDay = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["opening-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").order("start_time", { ascending: true });
      return data ?? [];
    },
  });

  const schedule = events?.filter((e) => e.category !== "gaming" && e.category !== "guest") ?? [];
  const gaming = events?.filter((e) => e.category === "gaming") ?? [];
  const guests = events?.filter((e) => e.category === "guest") ?? [];

  return (
    <MainLayout>
      <SEOHead title="يوم الافتتاح" description="تفاصيل يوم افتتاح مول البستان الكبير - فعاليات، مسابقات، ضيوف، وجوائز حصرية." />
      <div className="container py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-blue mb-6">يوم الافتتاح الكبير</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">استعد لأكبر حدث تقني في القاهرة الجديدة! فعاليات ومسابقات وجوائز حصرية بانتظارك.</p>
          <CountdownTimer />
        </div>

        {/* Event Schedule */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Calendar className="w-6 h-6 text-primary" /> جدول الفعاليات</h2>
          {isLoading ? <LoadingGrid count={3} /> : schedule.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schedule.map((event) => (
                <div key={event.id} className="card-premium p-6">
                  {event.image_url && <img src={event.image_url} alt={event.title_ar} className="w-full h-40 object-cover rounded-lg mb-4" loading="lazy" />}
                  <h3 className="font-bold text-lg text-foreground mb-2">{event.title_ar}</h3>
                  {event.description_ar && <p className="text-sm text-muted-foreground mb-3">{event.description_ar}</p>}
                  <div className="flex gap-4 text-xs text-accent">
                    {event.start_time && <span>🕐 {event.start_time}</span>}
                    {event.event_date && <span>📅 {event.event_date}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState title="سيتم الإعلان عن جدول الفعاليات قريباً" />}
        </section>

        {/* Guests */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Users className="w-6 h-6 text-accent" /> الضيوف والشخصيات</h2>
          {guests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {guests.map((guest) => (
                <div key={guest.id} className="card-premium p-6 text-center">
                  {guest.image_url && <img src={guest.image_url} alt={guest.title_ar} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" loading="lazy" />}
                  <h3 className="font-bold text-foreground">{guest.title_ar}</h3>
                  {guest.speaker_or_guest && <p className="text-sm text-accent">{guest.speaker_or_guest}</p>}
                </div>
              ))}
            </div>
          ) : <p className="text-muted-foreground">سيتم الإعلان عن الضيوف والشخصيات قريباً</p>}
        </section>

        {/* Gaming */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Gamepad2 className="w-6 h-6 text-orange" /> مسابقات الألعاب</h2>
          {gaming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gaming.map((comp) => (
                <div key={comp.id} className="card-premium p-6 border-orange/30">
                  <h3 className="font-bold text-lg text-orange mb-2">{comp.title_ar}</h3>
                  {comp.description_ar && <p className="text-sm text-muted-foreground">{comp.description_ar}</p>}
                  {comp.start_time && <p className="text-xs text-accent mt-2">🕐 {comp.start_time}</p>}
                </div>
              ))}
            </div>
          ) : <p className="text-muted-foreground">سيتم الإعلان عن مسابقات الألعاب قريباً</p>}
        </section>

        {/* Sponsors */}
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Award className="w-6 h-6 text-primary" /> الرعاة</h2>
          <p className="text-muted-foreground">سيتم الإعلان عن رعاة الافتتاح قريباً</p>
        </section>
      </div>
    </MainLayout>
  );
};

export default OpeningDay;
