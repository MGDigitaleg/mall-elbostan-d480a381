import { Calendar, Users, Gamepad2, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildEventLd } from "@/components/SEOHead";
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
      <SEOHead title="يوم الافتتاح" titleEn="Opening Day" description="تفاصيل يوم افتتاح مول البستان الكبير - فعاليات، مسابقات، ضيوف، وجوائز حصرية." descriptionEn="Mall Elbostan grand opening - events, competitions, guests, and exclusive prizes." breadcrumbs={[{ name: "يوم الافتتاح", url: "/opening-day" }]} jsonLd={events && events.length > 0 ? buildEventLd(events) : undefined} />
      <div className="container py-16 md:py-20">
        <div className="mb-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
              <Calendar className="h-4 w-4 text-primary" />
              برنامج الإطلاق والعد التنازلي
            </div>
            <h1 className="mb-5 text-4xl font-bold text-foreground md:text-5xl">يوم الافتتاح الكبير</h1>
            <p className="max-w-2xl leading-8 text-muted-foreground">صفحة مصممة لتجميع تفاصيل الإطلاق في شكل أوضح وأكثر أناقة: الفعاليات، المسابقات، الضيوف، والجوائز ضمن تجربة launch premium وليست صفحة مزدحمة أو ثقيلة بصريًا.</p>
          </div>
          <div className="surface-panel rounded-[2rem] p-6 md:p-8">
            <p className="mb-4 text-sm font-semibold text-muted-foreground">العد التنازلي حتى الافتتاح</p>
            <CountdownTimer />
          </div>
        </div>

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
                    {event.start_time && <span>{event.start_time}</span>}
                    {event.event_date && <span>{event.event_date}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="soft-card p-8"><EmptyState title="سيتم الإعلان عن جدول الفعاليات قريباً" /></div>}
        </section>

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
          ) : <div className="soft-card p-6 text-muted-foreground">سيتم الإعلان عن الضيوف والشخصيات قريباً</div>}
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Gamepad2 className="w-6 h-6 text-orange" /> مسابقات الألعاب</h2>
          {gaming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gaming.map((comp) => (
                <div key={comp.id} className="card-premium p-6 border-orange/30">
                  <h3 className="font-bold text-lg text-orange mb-2">{comp.title_ar}</h3>
                  {comp.description_ar && <p className="text-sm text-muted-foreground">{comp.description_ar}</p>}
                  {comp.start_time && <p className="text-xs text-accent mt-2">{comp.start_time}</p>}
                </div>
              ))}
            </div>
          ) : <div className="soft-card p-6 text-muted-foreground">سيتم الإعلان عن مسابقات الألعاب قريباً</div>}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Award className="w-6 h-6 text-primary" /> الرعاة</h2>
          <div className="soft-card p-6 text-muted-foreground">سيتم الإعلان عن رعاة الافتتاح قريباً</div>
        </section>
      </div>
    </MainLayout>
  );
};

export default OpeningDay;
