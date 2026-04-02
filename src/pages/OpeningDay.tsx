import { useQuery } from "@tanstack/react-query";
import { Award, Calendar, Gamepad2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildEventLd } from "@/components/SEOHead";
import { CountdownTimer } from "@/components/CountdownTimer";
import { EmptyState, LoadingGrid } from "@/components/ui/loading-states";

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
      <SEOHead title="يوم الافتتاح" titleEn="Opening Day" description="تابع تفاصيل يوم افتتاح مول البستان من الفعاليات للجوائز وخطة الزيارة." descriptionEn="Follow Mall Elbostan opening day details, from events to rewards and visit planning." breadcrumbs={[{ name: "يوم الافتتاح", url: "/opening-day" }]} jsonLd={events && events.length > 0 ? buildEventLd(events) : undefined} />
      <div className="container py-8 md:py-12">
        <section className="brand-shell page-halo mb-14 grid gap-7 overflow-hidden rounded-[2.5rem] px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10">
          <div>
            <div className="eyebrow-chip mb-4">
              <Calendar className="h-4 w-4 text-primary" />
              برنامج الإطلاق والعد التنازلي
            </div>
            <h1 className="mb-5 max-w-3xl text-4xl font-bold text-foreground md:text-[3.3rem]">الافتتاح الكبير — برنامج واضح من الترقب إلى الحضور</h1>
            <p className="max-w-2xl leading-7 text-muted-foreground">الموعد، الفعاليات، وآلية المشاركة في المكافآت — كل ما تحتاج معرفته قبل يوم الافتتاح.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {["العد التنازلي للافتتاح", "فعاليات مرتقبة", "مكافآت مرتبطة بالحضور"].map((item) => (
                <div key={item} className="editorial-panel rounded-[1.4rem] p-4 text-sm font-semibold text-foreground">{item}</div>
              ))}
            </div>
          </div>
          <div className="section-shell rounded-[2rem] p-6 md:p-8">
            <p className="mb-4 text-sm font-semibold text-muted-foreground">العد التنازلي حتى الافتتاح</p>
            <CountdownTimer />
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-8 grid gap-4 md:grid-cols-3">
              {[
                "اطّلع على الفعاليات وخطّط زيارتك.",
                "شارك في المكافآت واحتفظ بنتيجتك.",
                "تابع هذه الصفحة لمعرفة البرنامج النهائي.",
            ].map((item, index) => (
              <div key={item} className="section-shell p-5">
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">0{index + 1}</p>
                <p className="mt-3 text-sm leading-7 text-foreground/88">{item}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-8 flex items-center gap-2 text-2xl font-bold"><Calendar className="h-6 w-6 text-primary" /> جدول الفعاليات</h2>
          {isLoading ? <LoadingGrid count={3} /> : schedule.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {schedule.map((event) => (
                <div key={event.id} className="section-shell p-6 md:p-7">
                  {event.image_url && <img src={event.image_url} alt={event.title_ar} className="mb-4 h-40 w-full rounded-[1.2rem] object-cover" loading="lazy" />}
                  <h3 className="mb-2 text-lg font-bold text-foreground">{event.title_ar}</h3>
                  {event.description_ar && <p className="mb-3 text-sm leading-7 text-muted-foreground">{event.description_ar}</p>}
                  <div className="flex gap-4 text-xs text-accent">
                    {event.start_time && <span>{event.start_time}</span>}
                    {event.event_date && <span>{event.event_date}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="section-shell p-8"><EmptyState title="برنامج الفعاليات قيد الإعداد — سيُعلن قريبًا" /></div>}
        </section>

        <section className="mb-16">
          <h2 className="mb-8 flex items-center gap-2 text-2xl font-bold"><Users className="h-6 w-6 text-accent" /> الضيوف والشخصيات</h2>
          {guests.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {guests.map((guest) => (
                <div key={guest.id} className="editorial-panel rounded-[1.7rem] p-6 text-center">
                  {guest.image_url && <img src={guest.image_url} alt={guest.title_ar} className="mx-auto mb-4 h-24 w-24 rounded-full object-cover" loading="lazy" />}
                  <h3 className="font-bold text-foreground">{guest.title_ar}</h3>
                  {guest.speaker_or_guest && <p className="text-sm text-accent">{guest.speaker_or_guest}</p>}
                </div>
              ))}
            </div>
          ) : <div className="section-shell p-6 text-muted-foreground">تفاصيل الضيوف ستتوفر قريبًا</div>}
        </section>

        <section className="mb-16">
          <h2 className="mb-8 flex items-center gap-2 text-2xl font-bold"><Gamepad2 className="h-6 w-6 text-orange" /> مسابقات الألعاب</h2>
          {gaming.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {gaming.map((comp) => (
                <div key={comp.id} className="editorial-panel border-orange/20 p-6">
                  <h3 className="mb-2 text-lg font-bold text-orange">{comp.title_ar}</h3>
                  {comp.description_ar && <p className="text-sm leading-7 text-muted-foreground">{comp.description_ar}</p>}
                  {comp.start_time && <p className="mt-2 text-xs text-accent">{comp.start_time}</p>}
                </div>
              ))}
            </div>
          ) : <div className="section-shell p-6 text-muted-foreground">تفاصيل مسابقات الألعاب ستتوفر قريبًا</div>}
        </section>

        <section>
          <h2 className="mb-8 flex items-center gap-2 text-2xl font-bold"><Award className="h-6 w-6 text-primary" /> الرعاة</h2>
          <div className="section-shell p-6 text-muted-foreground">تفاصيل الرعاة ستتحدث قريبًا</div>
        </section>
      </div>
    </MainLayout>
  );
};

export default OpeningDay;