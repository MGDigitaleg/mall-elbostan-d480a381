import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Building, Calendar, Gamepad2, Gift, HelpCircle, Layers3, MapPin, Monitor, Printer, Shield, ShoppingBag, Smartphone, Sparkles, Store, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImage from "@/assets/mall-exterior.jpg";
import interiorImage from "@/assets/mall-interior.jpg";
import facadeImage from "@/assets/mall-facade.jpg";

const heroStatements = ["وجهة تقنية متخصصة", "خريطة ومتاجر واضحة", "افتتاح قريب وسوق قادم"];

const categoryStories = [
  { name: "الهواتف والإكسسوارات", icon: Smartphone, desc: "فئة أساسية بحضور واضح." },
  { name: "الكمبيوتر والأجهزة", icon: Monitor, desc: "حلول للشغل والدراسة." },
  { name: "الألعاب والترفيه", icon: Gamepad2, desc: "فئة بطلب مستمر." },
  { name: "الطباعة والتصوير", icon: Printer, desc: "خدمات عملية في مكان واحد." },
  { name: "الشبكات والحماية", icon: Shield, desc: "حلول احترافية واضحة." },
  { name: "الصيانة والدعم الفني", icon: Wrench, desc: "دعم يكمل التجربة." },
];

const whyCards = [
  { icon: Monitor, title: "وجهة تقنية واضحة", desc: "المشروع مصمم لفئات التقنية من البداية." },
  { icon: MapPin, title: "موقع يخدم الحركة", desc: "قريب من مناطق الطلب الأساسية." },
  { icon: Sparkles, title: "إطلاق محسوب", desc: "افتتاح وجوائز بصورة راقية." },
];

const launchJourney = [
  { title: "ابدأ بالخريطة", desc: "شوف المتاجر قبل الزيارة." },
  { title: "شارك في الجوائز", desc: "ادخل الحملة واحتفظ بالنتيجة." },
  { title: "احضر يوم الافتتاح", desc: "تابع الفعاليات من أول يوم." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

type HomeContentProps = {
  faqs: Array<{ id: string; question_ar: string; answer_ar: string }>;
  featuredStores: Array<{ id: string; name_ar: string; category: string | null; slug: string; logo_url: string | null; short_description_ar: string | null }>;
  upcomingEvents: Array<{ id: string; title_ar: string; description_ar: string | null; image_url: string | null; event_date: string | null }>;
};

export function HomeContent({ faqs, featuredStores, upcomingEvents }: HomeContentProps) {
  return (
    <>
      <section className="relative overflow-hidden pb-10 pt-1 md:pb-14 md:pt-1">
        <div className="editorial-grid absolute inset-0 opacity-40" />
        <div className="page-halo absolute inset-0" />
        <div className="container relative">
          <div className="brand-shell relative grid items-center gap-5 overflow-hidden rounded-[2.35rem] px-5 py-5 md:px-6 md:py-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-7 lg:px-7 lg:py-6">
            <div className="space-y-4 lg:py-1">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <div className="eyebrow-chip mb-4">
                  <Sparkles className="h-4 w-4 text-accent" />
                  افتتاح قريب • مايو 2026 • وجهة تقنية في القاهرة الجديدة
                </div>
                <h1 className="max-w-3xl text-4xl font-black leading-[1.04] text-foreground md:text-[3.95rem]">
                  مول البستان
                  <span className="mt-3 block text-[1.34rem] font-semibold leading-[1.28] text-foreground/88 md:text-[1.95rem]">
                    وجهة تقنية راقية تجمع المتاجر والخريطة وفرص التأجير في صورة أوضح
                  </span>
                </h1>
                <p className="mt-4 max-w-md text-[0.98rem] leading-7 text-muted-foreground md:text-base">
                  اكتشف المتاجر والخريطة، تابع الافتتاح، وابدأ استفسارك التجاري من مكان واحد.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.45 }} className="flex flex-wrap gap-2.5">
                {heroStatements.map((item) => (
                  <div key={item} className="mini-chip">{item}</div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.45 }} className="grid gap-3 pt-1 sm:grid-cols-2">
                <Link to="/map"><Button variant="cta" size="lg" className="w-full rounded-xl px-7">استكشف الخريطة</Button></Link>
                <Link to="/leasing"><Button variant="orange" size="lg" className="w-full rounded-xl px-7">استفسر عن الوحدات</Button></Link>
                <Link to="/spin-win"><Button variant="outline-blue" size="lg" className="w-full rounded-xl px-7">حملة الجوائز</Button></Link>
                <Link to="/#marketplace"><Button variant="secondary" size="lg" className="w-full rounded-xl px-7">السوق القادم</Button></Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.45 }} className="grid gap-3 xl:grid-cols-[1.08fr_0.92fr]">
                <div className="section-shell rounded-[1.65rem] p-4 md:p-4.5">
                  <p className="mb-3 text-sm font-semibold text-muted-foreground">العد التنازلي</p>
                  <CountdownTimer />
                </div>
                <div className="grid gap-3">
                  {[
                    { label: "ابدأ الآن", value: "الخريطة والمتاجر" },
                    { label: "للاستثمار", value: "الوحدات المتاحة" },
                    { label: "قريبًا", value: "Marketplace by Mall Elbostan" },
                  ].map((item) => (
                    <div key={item.label} className="editorial-panel rounded-[1.35rem] p-4">
                      <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">{item.label}</p>
                      <p className="mt-1.5 text-[0.98rem] font-bold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="relative mx-auto w-full max-w-[40rem]">
              <div className="section-shell overflow-hidden rounded-[2rem] p-2 shadow-[var(--shadow-elevated)]">
                <div className="image-shell aspect-[4/5] overflow-hidden rounded-[1.7rem] bg-card lg:aspect-[5/6]">
                  <img src={heroImage} alt="الواجهة الرئيسية لمول البستان بتصميم معماري حديث" className="h-full w-full object-cover object-[center_36%]" />
                  <div className="image-wash absolute inset-0" />
                </div>
                <div className="glass absolute inset-x-4 bottom-4 rounded-[1.35rem] p-3.5 md:inset-x-6 md:bottom-6 md:p-4.5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Mall Elbostan</p>
                      <p className="mt-2 text-lg font-bold text-foreground">واجهة معمارية واضحة تعكس حضور المشروع</p>
                    </div>
                    <Layers3 className="mt-1 h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>

              <div className="section-shell absolute -left-5 top-10 hidden w-52 overflow-hidden rounded-[1.55rem] p-2 lg:block">
                <div className="image-shell mb-3 aspect-[4/3] rounded-[1.2rem]">
                  <img src={interiorImage} alt="الأتريوم الداخلي لمول البستان" className="h-full w-full object-cover object-center" />
                </div>
                <p className="text-sm font-bold text-foreground">مشهد داخلي منظم</p>
              </div>

              <div className="section-shell absolute -right-4 bottom-12 hidden w-52 rounded-[1.55rem] p-4 lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Marketplace by Mall Elbostan</p>
                <p className="mt-2 text-base font-bold text-foreground">امتداد رقمي للتجربة</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div className="chapter-shell pt-5">
              <p className="section-kicker">لماذا مول البستان</p>
              <h2 className="section-title">وجهة تقنية بهوية أوضح</h2>
            </div>
            <div className="space-y-4">
              <p className="text-base leading-7 text-muted-foreground">المشروع يجمع الفئات التقنية في مكان واحد بخطوات زيارة أسهل.</p>
              <Link to="/about" className="inline-flex"><Button variant="ghost" className="text-primary">اعرف حكاية المشروع</Button></Link>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="section-shell h-full rounded-[2rem] p-6 md:p-7">
              <p className="text-sm font-semibold text-muted-foreground">قيمة المشروع</p>
              <h3 className="mt-3 max-w-lg text-3xl font-bold text-foreground">صورة أهدأ وأقوى للمتاجر والزائر</h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">منظومة واضحة تبدأ بالخريطة والمتاجر وتمتد لافتتاح مدروس.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {["خريطة أسهل للاستكشاف.", "حضور بصري أقوى للعلامات.", "زيارة بخطوات أوضح.", "امتداد رقمي قريب."].map((item) => (
                  <div key={item} className="mini-chip min-h-14 justify-start rounded-[1rem]">{item}</div>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              {whyCards.map((feature, i) => (
                <motion.div key={feature.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="editorial-panel rounded-[1.55rem] p-5 transition-transform duration-300 hover:-translate-y-1">
                    <feature.icon className="icon-shell mb-3 h-10 w-10 p-2.5" />
                    <h3 className="mb-2 text-base font-bold text-foreground">{feature.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft py-12 md:py-15">
        <div className="container">
           <div className="section-shell grid gap-5 overflow-hidden px-5 py-5 md:px-7 md:py-7 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
             <div className="order-2 space-y-4 lg:order-1">
              <p className="section-kicker">داخل المول</p>
              <h2 className="section-title">من الداخل، التجربة تبدو واضحة ومتوازنة</h2>
              <p className="text-base leading-7 text-muted-foreground">المشهد الداخلي يعكس تنظيمًا أفضل للحركة والعرض ويعطي المشروع حضورًا أكثر ثقة.</p>
               <div className="grid gap-3 sm:grid-cols-2">
                <div className="editorial-panel rounded-[1.5rem] p-5"><p className="mb-1 text-sm font-semibold text-foreground">مشهد معماري منظم</p><p className="text-sm leading-6 text-muted-foreground">أتريوم واضح يثبت شخصية المكان.</p></div>
                <div className="editorial-panel rounded-[1.5rem] p-5"><p className="mb-1 text-sm font-semibold text-foreground">حركة أريح للزائر</p><p className="text-sm leading-6 text-muted-foreground">مساحات تساعد على العرض والتنقل بسهولة.</p></div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
               <div className="relative grid gap-3 lg:grid-cols-[1fr_0.42fr]">
                <div className="image-shell aspect-[16/11] overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[var(--shadow-elevated)]">
                  <img src={interiorImage} alt="الأتريوم الداخلي متعدد الطوابق في مول البستان" className="h-full w-full object-cover object-center" />
                  <div className="image-wash absolute inset-0" />
                </div>
                <div className="editorial-panel flex flex-col justify-between rounded-[1.8rem] p-5">
                  <div>
                     <p className="text-sm font-semibold text-muted-foreground">الطابع الداخلي</p>
                      <p className="mt-2 text-xl font-bold text-foreground">أكثر من مستوى يعزز حضور التجربة</p>
                  </div>
                  <div className="image-shell mt-4 aspect-[3/4] overflow-hidden rounded-[1.4rem]"><img src={facadeImage} alt="لقطة معمارية داعمة لهوية مول البستان" className="h-full w-full object-cover object-center" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-15">
        <div className="container">
          <div className="chapter-shell mb-8 max-w-2xl pt-5">
            <p className="section-kicker">المتاجر والفئات</p>
              <h2 className="section-title">ابدأ من الفئة الأقرب لك</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">تنظيم واضح للفئات اليوم، وأساس طبيعي للسوق الرقمي لاحقًا.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {categoryStories.map((cat, i) => (
              <motion.div key={cat.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link
                  to={`/stores?category=${encodeURIComponent(cat.name)}`}
                  className={`editorial-panel flex h-full flex-col rounded-[1.55rem] p-5 transition-transform duration-300 hover:-translate-y-1 ${i === 0 ? "xl:col-span-2" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="icon-shell h-12 w-12 p-3"><cat.icon className="h-6 w-6" /></div>
                    <div>
                      <h3 className="mb-2 text-base font-bold text-foreground">{cat.name}</h3>
                      <p className="text-sm leading-7 text-muted-foreground">{cat.desc}</p>
                    </div>
                  </div>
                  {i === 0 ? <div className="mt-5 mini-chip w-fit rounded-[1rem] px-4 py-2">فئة محورية</div> : null}
                </Link>
              </motion.div>
            ))}
          </div>

          {featuredStores && featuredStores.length > 0 && (
            <div className="mt-10 grid gap-4 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
              <div className="section-shell rounded-[1.85rem] p-6 md:p-7">
                <p className="section-kicker">متاجر مختارة</p>
                <h2 className="text-3xl font-bold text-foreground md:text-[2.7rem]">متاجر مختارة ترسم ملامح التجربة</h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">عينة أولى توضح اتجاه المشروع وفئاته.</p>
                <Link to="/stores" className="mt-6 inline-flex"><Button variant="ghost" className="text-primary">عرض كل المتاجر</Button></Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {featuredStores.slice(0, 4).map((store) => (
                  <Link key={store.id} to={`/stores/${store.slug}`} className="editorial-panel rounded-[1.7rem] p-5 transition-transform duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                      {store.logo_url ? <img src={store.logo_url} alt={store.name_ar} className="h-14 w-14 rounded-[1rem] border border-border/60 object-cover" loading="lazy" /> : <div className="icon-shell h-14 w-14 rounded-[1rem] p-4"><Store className="h-6 w-6" /></div>}
                      <div><h3 className="font-bold text-foreground">{store.name_ar}</h3>{store.category ? <p className="text-sm text-accent">{store.category}</p> : null}</div>
                    </div>
                    {store.short_description_ar ? <p className="mt-4 text-sm leading-6 text-muted-foreground line-clamp-2">{store.short_description_ar}</p> : null}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section-soft py-12 md:py-15">
        <div className="container">
          <div className="section-shell grid gap-5 overflow-hidden px-5 py-5 md:px-7 md:py-7 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="space-y-4">
              <p className="section-kicker">الافتتاح قريبًا</p>
              <h2 className="section-title">افتتاح بخطوات واضحة وحملة جوائز بسيطة</h2>
              <p className="text-base leading-7 text-muted-foreground">اعرف الموعد، شارك في الحملة، واحتفظ بنتيجتك قبل يوم الافتتاح.</p>
              <div className="space-y-3">
                {launchJourney.map((item, index) => (
                  <div key={item.title} className="editorial-panel rounded-[1.5rem] px-4 py-4">
                    <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">0{index + 1}</p>
                    <p className="mt-3 text-base font-bold text-foreground">{item.title}</p>
                     <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/opening-day"><Button variant="outline-blue" size="lg" className="rounded-xl px-7">شوف تفاصيل الافتتاح</Button></Link>
                <Link to="/spin-win"><Button variant="cta" size="lg" className="rounded-xl px-7">جرّب أدر واربح</Button></Link>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="section-shell rounded-[1.7rem] p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <Gift className="icon-shell h-11 w-11 p-2.5 text-primary" />
                  <div>
                     <p className="text-sm font-semibold text-muted-foreground">الجوائز والمكافآت</p>
                     <h3 className="text-2xl font-bold text-foreground">حملة واضحة وسهلة المتابعة</h3>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                   {["النتيجة تظهر فورًا.", "الاستفادة مرتبطة بالحضور.", "الشروط واضحة من البداية."].map((item, index) => (
                    <div key={item} className="editorial-panel rounded-[1.4rem] p-5">
                      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">0{index + 1}</p>
                      <p className="mt-3 text-sm leading-7 text-foreground/88">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3"><Link to="/reward-terms"><Button variant="ghost" className="text-primary">شروط المكافآت</Button></Link></div>
              </div>

              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {upcomingEvents.slice(0, 2).map((event) => (
                    <div key={event.id} className="editorial-panel rounded-[1.6rem] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{event.title_ar}</h3>
                          {event.description_ar ? <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">{event.description_ar}</p> : null}
                        </div>
                        <Calendar className="h-5 w-5 text-accent" />
                      </div>
                      {event.event_date ? <p className="mt-4 text-sm font-semibold text-primary">{event.event_date}</p> : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-15">
        <div className="container">
          <div className="section-shell grid gap-5 overflow-hidden px-5 py-5 md:px-7 md:py-7 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <div className="image-shell aspect-[16/11] overflow-hidden rounded-[1.8rem] border border-border/70 bg-card shadow-[var(--shadow-elevated)]">
                <img src={facadeImage} alt="واجهة مول البستان الخارجية في وقت الغروب" className="h-full w-full object-cover object-center" />
                <div className="image-wash absolute inset-0" />
              </div>
            </div>
            <div className="space-y-4">
              <p className="section-kicker">التأجير والوحدات</p>
              <h2 className="section-title">التأجير بخطوات مباشرة وصورة أوضح</h2>
              <p className="text-base leading-7 text-muted-foreground">تعرف على الوحدات المتاحة، موقعها، وكيف تبدأ استفسارك بسرعة.</p>
              <div className="space-y-3">
                {["حضور داخل وجهة تقنية متخصصة.", "خريطة أوضح قبل القرار.", "الافتتاح يعزز الزخم التجاري."].map((item) => (
                  <div key={item} className="editorial-panel rounded-[1.4rem] px-4 py-4 text-sm leading-7 text-foreground/88">{item}</div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/leasing"><Button variant="orange" size="lg" className="rounded-xl px-7">ابدأ استفسارك</Button></Link>
                <Link to="/map"><Button variant="outline-blue" size="lg" className="rounded-xl px-7">شوف الوحدات على الخريطة</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="marketplace" className="section-soft py-12 md:py-15">
        <div className="container">
          <div className="brand-shell rounded-[2.4rem] p-5 md:p-7 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div>
                <p className="section-kicker">Marketplace by Mall Elbostan</p>
                 <h2 className="section-title">المرحلة التالية: سوق رقمي من نفس الهوية</h2>
                 <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">خطوة تكمّل تجربة المول وتربط الزائر بمتاجره المفضلة بعد الزيارة.</p>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                   {["ابدأ من الخريطة والمتاجر.", "تابع العلامات الأقرب لك.", "ثم انتقل للسوق الرقمي."].map((item, index) => (
                    <div key={item} className="editorial-panel rounded-[1.4rem] px-4 py-4">
                      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">0{index + 1}</p>
                      <p className="mt-3 text-sm font-semibold text-foreground/88">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
               <div className="editorial-panel rounded-[1.8rem] p-5 text-center shadow-[var(--shadow-soft)] lg:mr-auto lg:w-[320px]">
                <ShoppingBag className="mx-auto h-10 w-10 text-primary" />
                 <p className="mt-4 text-lg font-bold text-foreground">سوق رقمي متصل بالمتاجر الحالية</p>
                 <p className="mt-2 text-sm leading-6 text-muted-foreground">امتداد طبيعي للتجربة الحالية بنفس الروح والوضوح.</p>
                <Link to="/stores" className="mt-5 block"><Button variant="secondary" className="w-full rounded-xl">ابدأ من المتاجر الحالية</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-15">
        <div className="container max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="chapter-shell pt-5">
              <p className="section-kicker">الأسئلة الشائعة</p>
               <h2 className="text-3xl font-bold text-foreground md:text-4xl"><HelpCircle className="ml-2 inline-block h-7 w-7 text-accent" />أسئلة أساسية قبل الافتتاح</h2>
               <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">إجابات مختصرة تساعدك تصل للمعلومة بسرعة.</p>
              <Link to="/faq" className="mt-6 inline-flex"><Button variant="ghost" className="text-primary">عرض جميع الأسئلة<ArrowLeft className="h-4 w-4" /></Button></Link>
            </div>
            {faqs && faqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.slice(0, 4).map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="section-shell rounded-[1.5rem] px-5">
                    <AccordionTrigger className="text-right text-base font-semibold text-foreground hover:text-primary">{faq.question_ar}</AccordionTrigger>
                    <AccordionContent className="text-sm leading-7 text-muted-foreground">{faq.answer_ar}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="surface-panel rounded-2xl p-8 text-center text-muted-foreground">سيتم إضافة الأسئلة الشائعة قريبًا</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}