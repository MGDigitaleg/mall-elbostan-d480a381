import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Calendar, Gamepad2, Gift, MapPin, Sparkles, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildEventLd } from "@/components/SEOHead";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Button } from "@/components/ui/button";
import { EmptyState, LoadingGrid } from "@/components/ui/loading-states";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeChild = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

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
      <SEOHead
        title="يوم الافتتاح"
        titleEn="Opening Day"
        description="تابع تفاصيل يوم افتتاح مول البستان من الفعاليات للجوائز وخطة الزيارة."
        descriptionEn="Follow Mall Elbostan opening day details, from events to rewards and visit planning."
        breadcrumbs={[{ name: "يوم الافتتاح", url: "/opening-day" }]}
        jsonLd={events && events.length > 0 ? buildEventLd(events) : undefined}
      />

      {/* ═══ HERO ═══ */}
      <section className="heritage-section">
        <div className="mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-14">
          <div className="grid min-h-[60vh] items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:py-0">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="accent-line" />
                <span className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-poppins)", color: "hsl(0 0% 100% / 0.35)" }}>
                  1 مايو 2026 — الافتتاح الكبير
                </span>
              </div>

              <h1 className="max-w-[26rem] text-[2rem] font-extrabold leading-[1.04] md:text-[2.8rem] lg:text-[3.2rem]" style={{ color: "hsl(var(--navy-foreground))" }}>
                الافتتاح الكبير — برنامج واضح من الترقب إلى الحضور
              </h1>

              <p className="max-w-[30rem] text-[0.95rem] leading-[2]" style={{ color: "hsl(0 0% 100% / 0.42)" }}>
                الموعد، الفعاليات، وآلية المشاركة في المكافآت — كل ما تحتاج معرفته قبل يوم الافتتاح.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                {[
                  { icon: Calendar, text: "جدول فعاليات كامل" },
                  { icon: Gift, text: "مكافآت مرتبطة بالحضور" },
                  { icon: MapPin, text: "خطّط زيارتك مسبقًا" },
                ].map((item) => (
                  <div key={item.text} className="stat-block-dark flex items-center gap-2.5 px-4 py-3">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-[0.82rem] font-semibold text-white">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/spin-win">
                  <Button variant="cta" size="lg" className="h-12 gap-2 rounded-xl px-7 font-bold">
                    <Sparkles className="h-4 w-4" /> أدر واربح الآن
                  </Button>
                </Link>
                <Link to="/map">
                  <Button size="lg" className="h-12 gap-2 rounded-xl px-7 font-semibold" style={{ border: "1px solid hsl(0 0% 100% / 0.1)", background: "hsl(0 0% 100% / 0.05)", color: "white" }}>
                    <MapPin className="h-4 w-4" /> خريطة المول
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Countdown */}
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}>
              <div className="heritage-surface p-6 md:p-8">
                <p className="section-kicker" style={{ color: "hsl(var(--primary) / 0.55)" }}>العد التنازلي</p>
                <h2 className="mb-5 text-xl font-bold text-white">الوقت المتبقي حتى الافتتاح</h2>
                <CountdownTimer />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ═══ ROADMAP STRIP ═══ */}
      <section className="section-ivory py-10 md:py-14">
        <div className="container max-w-[1200px]">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="grid gap-4 md:grid-cols-3">
            {[
              { n: "01", text: "اطّلع على الفعاليات وخطّط زيارتك." },
              { n: "02", text: "شارك في المكافآت واحتفظ بنتيجتك." },
              { n: "03", text: "تابع هذه الصفحة لمعرفة البرنامج النهائي." },
            ].map((item) => (
              <motion.div key={item.n} variants={fadeChild} className="card-architectural p-5">
                <span className="font-poppins text-xs font-bold text-primary">{item.n}</span>
                <p className="mt-3 text-sm leading-7 text-foreground">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ SCHEDULE ═══ */}
      <section className="heritage-deep page-section">
        <div className="container max-w-[1200px]">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-8 flex items-center gap-3">
              <div className="icon-shell h-10 w-10" style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.15)" }}>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="section-kicker">البرنامج</p>
                <h2 className="section-title">جدول الفعاليات</h2>
              </div>
            </div>

            {isLoading ? (
              <LoadingGrid count={3} />
            ) : schedule.length > 0 ? (
              <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {schedule.map((event) => (
                  <motion.div key={event.id} variants={fadeChild} className="heritage-surface p-6">
                    {event.image_url && (
                      <div className="image-architectural mb-4 aspect-[16/9] overflow-hidden">
                        <img src={event.image_url} alt={event.title_ar} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <h3 className="mb-2 text-lg font-bold text-white">{event.title_ar}</h3>
                    {event.description_ar && <p className="mb-3 text-[0.85rem] leading-7" style={{ color: "hsl(0 0% 100% / 0.4)" }}>{event.description_ar}</p>}
                    <div className="flex gap-4 text-xs font-semibold text-accent">
                      {event.start_time && <span>{event.start_time}</span>}
                      {event.event_date && <span>{event.event_date}</span>}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="heritage-surface p-10 text-center">
                <Calendar className="mx-auto mb-3 h-8 w-8" style={{ color: "hsl(var(--primary) / 0.4)" }} />
                <p className="text-[0.95rem] font-semibold text-white">برنامج الفعاليات قيد الإعداد</p>
                <p className="mx-auto mt-1 max-w-xs text-sm" style={{ color: "hsl(0 0% 100% / 0.35)" }}>سيُعلن مع اقتراب موعد الافتتاح</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══ GUESTS ═══ */}
      <section className="page-section">
        <div className="container max-w-[1200px]">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-8 flex items-center gap-3">
              <div className="icon-shell h-10 w-10">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="section-kicker">شخصيات مرتقبة</p>
                <h2 className="section-title">الضيوف والشخصيات</h2>
              </div>
            </div>

            {guests.length > 0 ? (
              <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {guests.map((guest) => (
                  <motion.div key={guest.id} variants={fadeChild} className="card-editorial p-6 text-center">
                    {guest.image_url && <img src={guest.image_url} alt={guest.title_ar} className="mx-auto mb-4 h-20 w-20 rounded-full object-cover" loading="lazy" style={{ border: "2px solid hsl(var(--border))" }} />}
                    <h3 className="font-bold text-foreground">{guest.title_ar}</h3>
                    {guest.speaker_or_guest && <p className="mt-1 text-sm text-accent">{guest.speaker_or_guest}</p>}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="section-shell p-8 text-center">
                <Users className="mx-auto mb-3 h-7 w-7 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">تفاصيل الضيوف قيد التأكيد</p>
                <p className="mx-auto mt-1 max-w-xs text-[0.82rem] text-muted-foreground">ستتوفر قريبًا مع اقتراب الافتتاح</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══ GAMING ═══ */}
      <section className="section-soft page-section">
        <div className="container max-w-[1200px]">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-8 flex items-center gap-3">
              <div className="icon-shell h-10 w-10" style={{ background: "hsl(var(--orange) / 0.06)", borderColor: "hsl(var(--orange) / 0.15)" }}>
                <Gamepad2 className="h-5 w-5 text-orange" />
              </div>
              <div>
                <p className="section-kicker">المنافسة</p>
                <h2 className="section-title">مسابقات الألعاب</h2>
              </div>
            </div>

            {gaming.length > 0 ? (
              <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {gaming.map((comp) => (
                  <motion.div key={comp.id} variants={fadeChild} className="card-architectural p-6" style={{ borderColor: "hsl(var(--orange) / 0.15)" }}>
                    <h3 className="mb-2 text-lg font-bold text-orange">{comp.title_ar}</h3>
                    {comp.description_ar && <p className="text-[0.85rem] leading-7 text-muted-foreground">{comp.description_ar}</p>}
                    {comp.start_time && <p className="mt-3 text-xs font-semibold text-accent">{comp.start_time}</p>}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="section-shell p-8 text-center">
                <Gamepad2 className="mx-auto mb-3 h-7 w-7 text-orange" />
                <p className="text-sm font-semibold text-foreground">تفاصيل المسابقات قيد الإعداد</p>
                <p className="mx-auto mt-1 max-w-xs text-[0.82rem] text-muted-foreground">ستُعلن مع اقتراب الافتتاح</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══ SPONSORS ═══ */}
      <section className="heritage-deep page-section">
        <div className="container max-w-[900px] text-center">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.15)" }}>
              <Award className="h-6 w-6 text-primary" />
            </div>
            <p className="section-kicker">شراكات</p>
            <h2 className="section-title mx-auto max-w-[22rem]">الرعاة والشركاء</h2>
            <p className="mx-auto mt-3 max-w-md text-[0.92rem] leading-7" style={{ color: "hsl(0 0% 100% / 0.38)" }}>
              تفاصيل الرعاة قيد التأكيد — ستُحدّث هذه المنطقة مع اقتراب موعد الافتتاح.
            </p>
            <Link to="/contact" className="mt-6 inline-block">
              <Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8">تواصل معنا للرعاية</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default OpeningDay;
