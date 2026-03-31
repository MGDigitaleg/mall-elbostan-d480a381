import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Gamepad2, HelpCircle, Map, MapPin, Monitor, Printer, Shield, Smartphone, Sparkles, Store, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { floorMapData } from "@/lib/floorMapData";
import heroImage from "@/assets/mall-exterior.jpg";
import interiorImage from "@/assets/mall-interior.jpg";
import facadeImage from "@/assets/mall-facade.jpg";

const heroPills = ["وجهة تقنية متخصصة", "خريطة أسهل للزيارة", "وحدات جاهزة للاستفسار"];

const benefitChips = ["فئات تقنية واضحة", "حركة أسهل داخل المول", "حضور أقوى للمتاجر", "نقطة انطلاق للتأجير"];

const whyCards = [
  { icon: Monitor, title: "تركيز تقني واضح", desc: "المشروع موجه لفئات الأجهزة والإكسسوارات والخدمات المرتبطة بها." },
  { icon: MapPin, title: "موقع يخدم الطلب", desc: "التركيز على زوار القاهرة الجديدة ومحيطها يجعل الزيارة أكثر عملية." },
  { icon: Sparkles, title: "إطلاق منظم", desc: "الافتتاح والحملة الترويجية جزء من تجربة مدروسة وليست إضافة جانبية." },
];

const categoryStories = [
  { name: "الهواتف والإكسسوارات", icon: Smartphone, desc: "خيارات يومية سريعة وواضحة." },
  { name: "الكمبيوتر والأجهزة", icon: Monitor, desc: "حلول للدراسة والعمل والأداء." },
  { name: "الألعاب والترفيه", icon: Gamepad2, desc: "فئة مخصصة لعشاق الأداء والملحقات." },
  { name: "الطباعة والتصوير", icon: Printer, desc: "خدمات عملية في نفس الزيارة." },
  { name: "الصيانة والدعم الفني", icon: Wrench, desc: "حلول ما بعد الشراء والدعم السريع." },
  { name: "الشبكات والحماية", icon: Shield, desc: "احتياجات الشركات والمكاتب والأنظمة المتخصصة." },
];

const launchSteps = [
  { title: "استكشف المول", desc: "ابدأ بالخريطة واعرف موقع الوحدات والمتاجر بسهولة." },
  { title: "تابع الحملة", desc: "شارك في التجربة الترويجية واحتفظ بنتيجتك قبل الافتتاح." },
  { title: "احضر يوم الافتتاح", desc: "تابع الأنشطة وكمّل تجربتك على أرض الواقع." },
];

const fallbackFaqs = [
  { id: "faq-1", question_ar: "أين يقع مول البستان؟", answer_ar: "المشروع يخدم القاهرة الجديدة ومحيطها، ويمكنك متابعة صفحة التواصل للحصول على تفاصيل الوصول فور اعتمادها." },
  { id: "faq-2", question_ar: "متى الافتتاح؟", answer_ar: "الافتتاح المستهدف في 1 مايو 2026، مع تحديثات مستمرة على صفحة الافتتاح والحملة." },
  { id: "faq-3", question_ar: "هل توجد وحدات متاحة للتأجير؟", answer_ar: "نعم، ويمكنك مراجعة الخريطة التفاعلية وصفحة التأجير لمعرفة الوحدات المتاحة حاليًا." },
  { id: "faq-4", question_ar: "كيف أبحث عن متجر داخل المول؟", answer_ar: "من خلال الخريطة التفاعلية وصفحة المتاجر، مع إمكانية التصفية حسب الفئة والدور." },
  { id: "faq-5", question_ar: "هل يمكن متابعة المتاجر لاحقًا رقميًا؟", answer_ar: "هذا جزء من المرحلة التالية للمشروع، وسيتم تقديمه كامتداد رقمي مرتبط بالمتاجر المشاركة." },
  { id: "faq-6", question_ar: "كيف أتواصل للاستفسار التجاري؟", answer_ar: "يمكنك إرسال طلبك مباشرة من صفحة التأجير أو صفحة التواصل وسيتم متابعته من الفريق المختص." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

type HomeContentProps = {
  faqs: Array<{ id: string; question_ar: string; answer_ar: string }>;
  featuredStores: Array<{ id: string; name_ar: string; category: string | null; slug: string; logo_url: string | null; short_description_ar: string | null }>;
  upcomingEvents: Array<{ id: string; title_ar: string; description_ar: string | null; image_url: string | null; event_date: string | null }>;
};

export function HomeContent({ faqs, featuredStores, upcomingEvents }: HomeContentProps) {
  const allUnits = floorMapData.flatMap((floor) => floor.units);
  const totalUnits = allUnits.length;
  const availableUnits = allUnits.filter((unit) => unit.status === "available");
  const floorLabels = Object.fromEntries(floorMapData.map((floor) => [floor.id, floor.label]));
  const faqItems = (faqs.length > 0 ? faqs : fallbackFaqs).slice(0, 6);
  const launchEvent = upcomingEvents[0] ?? null;
  const heroFacts = [
    { label: "عدد الأدوار", value: `${floorMapData.length}` },
    { label: "الوحدات المتاحة", value: `${availableUnits.length}` },
    { label: "الفئات الرئيسية", value: `${categoryStories.length}` },
  ];

  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-2 md:pb-16 lg:pb-20">
        <div className="editorial-grid absolute inset-0 opacity-35" />
        <div className="page-halo absolute inset-0" />
        <div className="container relative">
          <div className="brand-shell page-shell grid min-h-[auto] gap-5 overflow-hidden rounded-[2rem] lg:min-h-[45rem] lg:grid-cols-[5fr_7fr] lg:gap-6">
            <div className="space-y-5 lg:flex lg:flex-col lg:justify-center">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="eyebrow-chip mb-4">افتتاح مايو 2026 • مول تقني في القاهرة الجديدة</div>
                <h1 className="max-w-[38.75rem] text-[2.1rem] font-black leading-[1.08] text-foreground md:text-[2.9rem] lg:text-[4rem]">
                  مول البستان
                  <span className="mt-3 block max-w-[35rem] text-[1.05rem] font-semibold leading-[1.5] text-foreground/90 md:text-[1.35rem] lg:text-[1.6rem]">
                    خريطة أوضح للمتاجر، تجربة زيارة أسهل، وفرصة مباشرة للاستفسار عن الوحدات.
                  </span>
                </h1>
                <p className="mt-4 max-w-[35rem] text-[0.98rem] leading-7 text-muted-foreground md:text-lg">
                  اكتشف المول قبل الزيارة، اعرف الفئات الأساسية، وابدأ خطوتك التجارية من نفس المكان.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4 }} className="flex flex-wrap gap-2.5">
                {heroPills.map((item) => (
                  <span key={item} className="mini-chip h-9 px-4 py-0 text-sm">{item}</span>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.4 }} className="flex flex-wrap gap-3 pt-1">
                <Link to="/map"><Button variant="cta" size="lg" className="h-14 min-w-[12rem] rounded-[1.1rem] px-7">استكشف الخريطة</Button></Link>
                <Link to="/leasing"><Button variant="orange" size="lg" className="h-14 min-w-[12rem] rounded-[1.1rem] px-7">استفسر عن الوحدات</Button></Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.4 }} className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="section-shell rounded-[1.5rem] p-4 md:p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">العد التنازلي للافتتاح</p>
                    <span className="text-xs text-muted-foreground">متابعة يوم الافتتاح</span>
                  </div>
                  <CountdownTimer />
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {heroFacts.map((item) => (
                    <div key={item.label} className="editorial-panel rounded-[1.25rem] p-4">
                      <p className="text-xs font-semibold text-muted-foreground">{item.label}</p>
                      <p className="mt-1.5 text-base font-bold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} className="relative mx-auto flex w-full max-w-[48rem] items-center lg:justify-start">
              <div className="relative w-full">
                <div className="section-shell overflow-hidden rounded-[2.25rem] p-2">
                  <div className="image-shell aspect-[4/5] overflow-hidden rounded-[2rem] bg-card lg:aspect-[4/3]">
                    <img src={heroImage} alt="الواجهة الرئيسية لمول البستان" className="h-full w-full object-cover object-center" loading="eager" />
                    <div className="image-wash absolute inset-0" />
                  </div>
                </div>
                <div className="section-shell absolute bottom-4 right-4 w-[28%] min-w-[9.5rem] overflow-hidden rounded-[1.5rem] p-2 md:bottom-6 md:right-6">
                  <div className="image-shell aspect-[3/4] overflow-hidden rounded-[1.15rem]">
                    <img src={interiorImage} alt="مشهد داخلي داعم لتجربة مول البستان" className="h-full w-full object-cover object-center" loading="lazy" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div className="space-y-5 lg:order-2">
              <div className="chapter-shell pt-5">
                <p className="section-kicker">لماذا مول البستان</p>
                <h2 className="section-title max-w-[35rem]">وجهة تقنية بهوية واضحة وتجربة زيارة أهدأ.</h2>
              </div>
              <p className="max-w-[32.5rem] text-base leading-7 text-muted-foreground md:text-lg">
                المشروع يجمع الفئات الأساسية في مكان واحد، ويقدم للزائر ولصاحب النشاط طريقة أوضح لفهم المول واتخاذ القرار.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {benefitChips.map((item) => (
                  <div key={item} className="mini-chip h-[3.375rem] justify-start rounded-[1rem] px-4 py-0 text-sm">{item}</div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 lg:order-1">
              {whyCards.map((card, index) => (
                <motion.div key={card.title} custom={index} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="editorial-panel min-h-[11.25rem] rounded-[1.5rem] p-5 md:p-6">
                    <card.icon className="icon-shell mb-4 h-12 w-12 p-3" />
                    <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft page-section">
        <div className="container">
          <div className="section-shell page-shell grid gap-5 overflow-hidden lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="order-2 space-y-4 lg:order-1 lg:max-w-[32rem]">
              <p className="section-kicker">داخل المول</p>
              <h2 className="section-title">تنظيم معماري يعطي الزيارة مسارًا أوضح.</h2>
              <p className="text-base leading-7 text-muted-foreground md:text-lg">
                من الأتريوم إلى مسارات الحركة، التجربة مصممة لتسهيل الاستكشاف والعرض داخل بيئة تقنية واضحة.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="editorial-panel rounded-[1.35rem] p-5">
                  <p className="text-base font-bold text-foreground">مشهد داخلي متوازن</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">التوزيع الداخلي يدعم العرض ويقلل التشويش البصري.</p>
                </div>
                <div className="editorial-panel rounded-[1.35rem] p-5">
                  <p className="text-base font-bold text-foreground">حركة أسهل للزائر</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">الوصول للفئات والمتاجر أوضح من أول نظرة.</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="grid gap-3 lg:grid-cols-[1fr_0.38fr]">
                <div className="image-shell aspect-[4/3] overflow-hidden rounded-[2rem] border border-border/80 bg-card">
                  <img src={interiorImage} alt="مشهد داخلي من مول البستان" className="h-full w-full object-cover object-center" loading="lazy" />
                </div>
                <div className="image-shell aspect-[3/4] overflow-hidden rounded-[1.6rem] border border-border/80 bg-card">
                  <img src={facadeImage} alt="تفصيل معماري داعم لهوية مول البستان" className="h-full w-full object-cover object-center" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="chapter-shell mb-7 max-w-[36rem] pt-5">
            <p className="section-kicker">الفئات الرئيسية</p>
            <h2 className="section-title">ابدأ من الفئة الأقرب لاحتياجك.</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">ست فئات أساسية تقدم صورة أوضح لطبيعة المول وما يمكن أن تجده داخله.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryStories.map((category, index) => (
              <motion.div key={category.name} custom={index} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to={`/stores?category=${encodeURIComponent(category.name)}`} className="editorial-panel flex min-h-[11.875rem] h-full flex-col rounded-[1.5rem] p-5 transition-transform duration-200 hover:-translate-y-1">
                  <div className="icon-shell mb-4 h-12 w-12 p-3"><category.icon className="h-6 w-6" /></div>
                  <h3 className="text-xl font-bold text-foreground">{category.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">{category.desc}</p>
                  <span className="mt-auto pt-4 text-sm font-semibold text-primary">استعرض المتاجر</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-soft page-section">
        <div className="container">
          <div className="section-shell page-shell grid gap-5 overflow-hidden lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
            <div className="space-y-4 lg:max-w-[33rem]">
              <p className="section-kicker">الخريطة التفاعلية</p>
              <h2 className="section-title">الدليل التفاعلي هو نقطة البداية داخل المول.</h2>
              <p className="text-base leading-7 text-muted-foreground md:text-lg">
                ابحث عن الوحدة أو المتجر، راجع الحالة، وانتقل بسرعة إلى صفحة التأجير أو المتاجر من نفس التجربة.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="editorial-panel rounded-[1.25rem] p-4">
                  <p className="text-xs font-semibold text-muted-foreground">عدد الأدوار</p>
                  <p className="mt-2 text-xl font-bold text-foreground">{floorMapData.length}</p>
                </div>
                <div className="editorial-panel rounded-[1.25rem] p-4">
                  <p className="text-xs font-semibold text-muted-foreground">الوحدات المتاحة</p>
                  <p className="mt-2 text-xl font-bold text-foreground">{availableUnits.length}</p>
                </div>
                <div className="editorial-panel rounded-[1.25rem] p-4">
                  <p className="text-xs font-semibold text-muted-foreground">الوحدات المعروضة</p>
                  <p className="mt-2 text-xl font-bold text-foreground">{totalUnits}</p>
                </div>
              </div>
              <Link to="/map"><Button variant="outline-blue" size="lg" className="h-14 rounded-[1.1rem] px-7">اذهب إلى الخريطة</Button></Link>
            </div>
            <div className="editorial-panel rounded-[1.7rem] p-5 md:p-6">
              <div className="flex items-start gap-4">
                <Map className="icon-shell h-12 w-12 p-3" />
                <div>
                  <h3 className="text-2xl font-bold text-foreground">استكشاف أسرع قبل الزيارة</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">
                    صفحة واحدة تجمع الأدوار، حالات الوحدات، والانتقال المباشر إلى الاستفسار التجاري أو صفحات المتاجر.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-shell page-shell grid gap-5 overflow-hidden lg:grid-cols-2 lg:items-center">
            <div className="space-y-4 lg:max-w-[33rem]">
              <p className="section-kicker">التأجير والوحدات</p>
              <h2 className="section-title">التأجير هنا قرار تجاري أوضح وأسرع.</h2>
              <p className="text-base leading-7 text-muted-foreground md:text-lg">راجع الوحدات المتاحة على الخريطة ثم ابدأ الاستفسار مباشرة بخطوتين واضحتين.</p>
              <div className="space-y-3">
                {[
                  "وحدات معروضة بحالة واضحة داخل الخريطة.",
                  "فهم أسرع لموقع الوحدة داخل الدور.",
                  "تحويل مباشر من الاستكشاف إلى الاستفسار التجاري.",
                ].map((item) => (
                  <div key={item} className="editorial-panel flex min-h-[3.75rem] items-center rounded-[1.25rem] px-4 py-3 text-sm text-foreground/90 md:text-base">{item}</div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/leasing"><Button variant="orange" size="lg" className="h-14 w-[13.75rem] rounded-[1.1rem] px-7">استفسر عن الوحدة</Button></Link>
                <Link to="/map"><Button variant="outline-blue" size="lg" className="h-14 w-[13.75rem] rounded-[1.1rem] px-7">اطلب معاينة الموقع</Button></Link>
              </div>
            </div>
            <div className="space-y-4">
              <div className="image-shell aspect-[4/3] overflow-hidden rounded-[2rem] border border-border/80 bg-card">
                <img src={facadeImage} alt="واجهة مول البستان الخارجية" className="h-full w-full object-cover object-center" loading="lazy" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {availableUnits.slice(0, 4).map((unit) => (
                  <div key={unit.unit_id} className="editorial-panel rounded-[1.25rem] p-4">
                    <p className="text-base font-bold text-foreground">وحدة {unit.unit_id}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{floorLabels[unit.floor_id]} • {unit.area_m2} م²</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft page-section">
        <div className="container">
          <div className="section-shell page-shell grid gap-5 overflow-hidden lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
            <div className="space-y-4 lg:order-2">
              <p className="section-kicker">الافتتاح والحملة</p>
              <h2 className="section-title">خطوات قصيرة تسبق يوم الافتتاح.</h2>
              <div className="space-y-3">
                {launchSteps.map((item, index) => (
                  <div key={item.title} className="editorial-panel min-h-[7.5rem] rounded-[1.4rem] p-4 md:p-5">
                    <p className="text-xs font-semibold text-muted-foreground">0{index + 1}</p>
                    <p className="mt-2 text-lg font-bold text-foreground">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="section-shell rounded-[1.6rem] p-5 md:p-6 lg:order-1">
              <div className="flex items-start gap-3">
                <Calendar className="icon-shell h-11 w-11 p-2.5" />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">ملخص الحملة</p>
                  <h3 className="mt-1 text-2xl font-bold text-foreground">تابع الموعد، واحتفظ بمسارك قبل الزيارة.</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                {launchEvent?.description_ar ?? "صفحة الافتتاح تجمع تفاصيل اليوم، والحملة، والخطوات المطلوبة للاستفادة من التجربة الترويجية."}
              </p>
              {launchEvent?.event_date ? <p className="mt-4 text-sm font-semibold text-primary">{launchEvent.event_date}</p> : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/opening-day"><Button variant="outline-blue" size="lg" className="h-[3.375rem] rounded-[1rem] px-6">تفاصيل الافتتاح</Button></Link>
                <Link to="/spin-win"><Button variant="cta" size="lg" className="h-[3.375rem] rounded-[1rem] px-6">جرّب أدر واربح</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="marketplace" className="page-section">
        <div className="container">
          <div className="brand-shell page-shell rounded-[2rem]">
            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="section-kicker">الامتداد الرقمي</p>
                <h2 className="section-title">مرحلة تالية تربط الزائر بالمتاجر بعد الزيارة.</h2>
                <p className="mt-3 max-w-[34rem] text-base leading-7 text-muted-foreground md:text-lg">
                  السوق الرقمي ليس بديلًا عن المول، بل امتداد طبيعي للتجربة نفسها عندما تصبح المتابعة والشراء أسهل لاحقًا.
                </p>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {[
                    "ابدأ من الخريطة.",
                    "اختر المتاجر الأقرب لك.",
                    "ثم تابعها رقميًا لاحقًا.",
                  ].map((item, index) => (
                    <div key={item} className="editorial-panel flex min-h-[6rem] items-center rounded-[1.3rem] p-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">0{index + 1}</p>
                        <p className="mt-2 text-sm font-semibold text-foreground md:text-base">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="editorial-panel rounded-[1.6rem] p-5 md:p-6 lg:mr-auto lg:max-w-[20rem]">
                <Store className="icon-shell h-12 w-12 p-3" />
                <h3 className="mt-4 text-2xl font-bold text-foreground">واجهة رقمية من نفس الهوية</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">مسار مختصر يبدأ من المتاجر الحالية ويتوسع لاحقًا دون تغيير روح المشروع.</p>
                <Link to="/stores" className="mt-5 block"><Button variant="secondary" className="h-12 w-full rounded-[1rem]">استعرض المتاجر الحالية</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container max-w-5xl">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="chapter-shell pt-5">
              <p className="section-kicker">الأسئلة الشائعة</p>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                <HelpCircle className="ml-2 inline-block h-7 w-7 text-accent" />
                إجابات سريعة قبل زيارتك الأولى
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">أسئلة أساسية تساعدك تصل للمعلومة بسرعة.</p>
              <Link to="/faq" className="mt-5 inline-flex"><Button variant="ghost" className="text-primary">عرض جميع الأسئلة</Button></Link>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="section-shell overflow-hidden rounded-[1.25rem] px-5">
                  <AccordionTrigger className="min-h-[4.25rem] py-4 text-right text-base font-semibold text-foreground hover:text-primary">
                    {faq.question_ar}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground md:text-base">
                    {faq.answer_ar}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}