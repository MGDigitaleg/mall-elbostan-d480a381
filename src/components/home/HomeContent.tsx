import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, HelpCircle, Map, MapPin, Monitor, Shield, Smartphone, Sparkles, Store, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapTeaserPreview } from "@/components/home/MapTeaserPreview";
import { allMapUnits, availableMapUnits, exploreNeeds, floorMapData, homepageLeasingUnits, needCategoryDescriptions, needCategoryLabels, type NeedCategory } from "@/lib/floorMapData";
import heroImage from "@/assets/mall-exterior.jpg";
import interiorImage from "@/assets/mall-interior.jpg";
import facadeImage from "@/assets/mall-facade.jpg";

const heroPills = ["وجهة تقنية متخصصة", "دليل واضح للزيارة", "وحدات جاهزة للاستفسار"];

const benefitChips = ["فئات تقنية واضحة", "تنقل أسهل داخل المول", "حضور أوضح للمتاجر", "مسار مباشر للتأجير"];

const whyCards = [
  { icon: Monitor, title: "تركيز تقني واضح", desc: "المشروع موجه لفئات الأجهزة والإكسسوارات والخدمات المرتبطة بها." },
  { icon: MapPin, title: "موقع يخدم الطلب", desc: "التركيز على زوار القاهرة الجديدة ومحيطها يجعل الزيارة أكثر عملية." },
  { icon: Sparkles, title: "إطلاق منظم", desc: "الافتتاح والحملة الترويجية جزء من تجربة مدروسة وليست إضافة جانبية." },
];

const categoryMeta: Record<NeedCategory, { icon: typeof Smartphone }> = {
  Accessories: { icon: Smartphone },
  Laptops: { icon: Monitor },
  Components: { icon: Monitor },
  Networking: { icon: Monitor },
  Maintenance: { icon: Wrench },
  "Security Systems": { icon: Shield },
};

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
  const totalUnits = allMapUnits.length;
  const availableUnits = availableMapUnits;
  const floorLabels = Object.fromEntries(floorMapData.map((floor) => [floor.id, floor.label]));
  const categoryStories = exploreNeeds.map((need) => ({
    key: need,
    name: needCategoryLabels[need],
    icon: categoryMeta[need].icon,
    desc: needCategoryDescriptions[need],
  }));
  const faqItems = (faqs.length >= 6 ? faqs : fallbackFaqs).slice(0, 6);
  const launchEvent = upcomingEvents[0] ?? null;
  const availableByFloor = floorMapData.map((floor) => ({
    id: floor.id,
    label: floor.label,
    count: floor.units.filter((unit) => unit.status === "available").length,
  }));
  const heroFacts = [
    { label: "عدد الأدوار", value: `${floorMapData.length}` },
    { label: "الوحدات المتاحة", value: `${availableUnits.length}` },
    { label: "الفئات الرئيسية", value: `${categoryStories.length}` },
  ];

  return (
    <>
      <section className="relative overflow-hidden pb-6 pt-2 md:pb-10 lg:pb-12">
        <div className="editorial-grid absolute inset-0 opacity-35" />
        <div className="page-halo absolute inset-0" />
        <div className="container relative">
          <div className="brand-shell page-shell grid min-h-[auto] gap-4 overflow-hidden rounded-[2rem] lg:min-h-[42rem] lg:grid-cols-[5fr_7fr] lg:gap-5">
            <div className="space-y-4 lg:flex lg:flex-col lg:justify-center">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="eyebrow-chip mb-4">افتتاح مايو 2026 • وجهة تقنية في القاهرة الجديدة</div>
                <h1 className="max-w-[38.75rem] text-[2.1rem] font-black leading-[1.08] text-foreground md:text-[2.9rem] lg:text-[4rem]">
                  مول البستان
                  <span className="mt-3 block max-w-[35rem] text-[1.05rem] font-semibold leading-[1.5] text-foreground/90 md:text-[1.35rem] lg:text-[1.6rem]">
                    خريطة أوضح للمتاجر وتجربة أسرع للاستكشاف والاستفسار.
                  </span>
                </h1>
                <p className="mt-4 max-w-[35rem] text-[0.98rem] leading-7 text-muted-foreground md:text-lg">
                  ابدأ من الخريطة، افهم الفئات بسرعة، ثم انتقل مباشرة إلى المتاجر أو الوحدات المتاحة.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="section-shell grid gap-3 rounded-[1.6rem] p-4 md:p-5">
                <div className="flex flex-wrap gap-2">
                  {heroPills.map((item) => (
                    <span key={item} className="mini-chip h-8 px-3.5 py-0 text-sm">{item}</span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/map"><Button variant="cta" size="lg" className="h-13 min-w-[11.5rem] rounded-[1rem] px-6">استكشف الخريطة</Button></Link>
                  <Link to="/leasing"><Button variant="orange" size="lg" className="h-13 min-w-[11.5rem] rounded-[1rem] px-6">استفسر عن الوحدات</Button></Link>
                </div>

                <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="grid gap-2 sm:grid-cols-3">
                    {heroFacts.map((item) => (
                      <div key={item.label} className="editorial-panel flex min-h-[4.75rem] flex-col justify-center rounded-[1.1rem] px-4 py-3">
                        <p className="text-xs font-semibold text-muted-foreground">{item.label}</p>
                        <p className="mt-1 text-lg font-bold text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-[1.25rem] border border-border bg-card px-4 py-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">العد التنازلي للافتتاح</p>
                      <span className="text-xs text-muted-foreground">متابعة يوم الافتتاح</span>
                    </div>
                    <CountdownTimer />
                  </div>
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
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="space-y-3.5 lg:order-2">
              <div className="chapter-shell pt-5">
                <p className="section-kicker">لماذا مول البستان</p>
                <h2 className="section-title max-w-[35rem]">وجهة تقنية بهوية واضحة وتجربة زيارة أهدأ.</h2>
              </div>
              <p className="max-w-[31rem] text-base leading-7 text-muted-foreground md:text-lg">
                المشروع يجمع الفئات الأساسية في مسار أسهل للزائر، ويمنح النشاط التجاري عرضًا أوضح داخل المول.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {benefitChips.map((item) => (
                  <div key={item} className="mini-chip h-[3.1rem] justify-start rounded-[1rem] px-4 py-0 text-sm">{item}</div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 lg:order-1">
              {whyCards.map((card, index) => (
                <motion.div key={card.title} custom={index} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="editorial-panel rounded-[1.35rem] p-5">
                    <div className="flex items-start gap-3.5">
                      <card.icon className="icon-shell h-11 w-11 shrink-0 p-2.5" />
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
                        <p className="mt-1.5 text-sm leading-7 text-muted-foreground md:text-base">{card.desc}</p>
                      </div>
                    </div>
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
          <div className="chapter-shell mb-5 max-w-[34rem] pt-5">
            <p className="section-kicker">الفئات الرئيسية</p>
            <h2 className="section-title">ابدأ من الفئة الأقرب لاحتياجك.</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">ست فئات أساسية غير متداخلة تساعدك تفهم طبيعة المول بسرعة.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryStories.map((category, index) => (
              <motion.div key={category.key} custom={index} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                 <div className="editorial-panel flex min-h-[11rem] h-full flex-col rounded-[1.4rem] p-5 transition-colors duration-200 hover:border-primary/35">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="icon-shell h-12 w-12 p-3"><category.icon className="h-6 w-6" /></div>
                    <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{category.name}</h3>
                   <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">{category.desc}</p>
                  <span className="mt-auto pt-3 text-xs font-semibold text-muted-foreground">تصنيف واضح داخل الدليل</span>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex justify-start">
            <Link to="/map"><Button variant="outline-blue" className="h-12 rounded-[1rem] px-6">استكشف الفئات على الخريطة</Button></Link>
          </div>
        </div>
      </section>

      <section className="section-soft page-section">
        <div className="container">
          <div className="section-shell page-shell grid gap-4 overflow-hidden lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="space-y-4 lg:max-w-[33rem]">
              <p className="section-kicker">الخريطة التفاعلية</p>
              <h2 className="section-title">الدليل التفاعلي هو نقطة البداية داخل المول.</h2>
              <p className="text-base leading-7 text-muted-foreground md:text-lg">بدل الحديث عن الخريطة فقط، هذه معاينة مباشرة لطريقة اختيار الدور والوحدة والانتقال الفوري إلى الإجراء التالي.</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="editorial-panel min-h-[5.75rem] rounded-[1.25rem] p-4">
                  <p className="text-xs font-semibold text-muted-foreground">عدد الأدوار</p>
                  <p className="mt-2 text-xl font-bold text-foreground">{floorMapData.length}</p>
                </div>
                <div className="editorial-panel min-h-[5.75rem] rounded-[1.25rem] p-4">
                  <p className="text-xs font-semibold text-muted-foreground">الوحدات المتاحة</p>
                  <p className="mt-2 text-xl font-bold text-foreground">{availableUnits.length}</p>
                </div>
                <div className="editorial-panel min-h-[5.75rem] rounded-[1.25rem] p-4">
                  <p className="text-xs font-semibold text-muted-foreground">الوحدات المعروضة</p>
                  <p className="mt-2 text-xl font-bold text-foreground">{totalUnits}</p>
                </div>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-card px-4 py-4 text-sm leading-7 text-muted-foreground">
                التحديد داخل الدليل يبدأ من الدور، ثم حالة الوحدة، ثم ينتقل مباشرة إلى المتجر أو الاستفسار التجاري من نفس المصدر.
              </div>
            </div>
            <MapTeaserPreview />
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
           <div className="section-shell page-shell grid gap-4 overflow-hidden lg:grid-cols-2 lg:items-start">
             <div className="space-y-4 lg:max-w-[31rem]">
              <p className="section-kicker">التأجير والوحدات</p>
              <h2 className="section-title">التأجير هنا قرار تجاري أوضح وأسرع.</h2>
              <p className="text-base leading-7 text-muted-foreground md:text-lg">الوحدات المعروضة هنا مرتبطة مباشرة ببيانات الخريطة نفسها، لتبدأ الاستفسار من مصدر واحد واضح.</p>
               <div className="space-y-2.5">
                {[
                  "وحدات معروضة بحالة واضحة داخل الخريطة.",
                  "فهم أسرع لموقع الوحدة داخل الدور.",
                  "تحويل مباشر من الاستكشاف إلى الاستفسار التجاري.",
                ].map((item) => (
                   <div key={item} className="editorial-panel flex min-h-[3.5rem] items-center rounded-[1.25rem] px-4 py-3 text-sm text-foreground/90 md:text-base">{item}</div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/leasing"><Button variant="orange" size="lg" className="h-14 w-[13.75rem] rounded-[1.1rem] px-7">استفسر عن الوحدة</Button></Link>
                <Link to="/map"><Button variant="outline-blue" size="lg" className="h-14 w-[13.75rem] rounded-[1.1rem] px-7">اطلب معاينة الموقع</Button></Link>
              </div>
            </div>
            <div className="space-y-4">
              <div className="editorial-panel rounded-[1.6rem] p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">مصدر البيانات</p>
                    <h3 className="mt-1 text-2xl font-bold text-foreground">العرض هنا متصل مباشرة بالدليل التفاعلي.</h3>
                  </div>
                  <span className="rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground">مصدر واحد</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {availableByFloor.map((floor) => (
                    <div key={floor.id} className="rounded-[1.1rem] border border-border bg-card px-4 py-3">
                      <p className="text-xs font-semibold text-muted-foreground">{floor.label}</p>
                      <p className="mt-1 text-lg font-bold text-foreground">{floor.count}</p>
                    </div>
                ))}
              </div>
              </div>
               <div className="grid gap-3 sm:grid-cols-2">
                  {homepageLeasingUnits.map((unit) => (
                   <Link key={unit.unit_id} to="/map" className="editorial-panel flex min-h-[6rem] flex-col justify-center rounded-[1.25rem] p-4 transition-colors hover:border-orange/45">
                     <div className="flex items-start justify-between gap-3">
                       <p className="text-lg font-bold text-foreground">وحدة {unit.unit_id}</p>
                       <span className="rounded-full border border-orange/25 bg-orange/10 px-2.5 py-1 text-[0.7rem] font-semibold text-orange">{needCategoryLabels[unit.category]}</span>
                     </div>
                     <p className="mt-2 text-sm text-muted-foreground">{floorLabels[unit.floor_id]}</p>
                     <p className="mt-1 text-sm font-semibold text-foreground">{unit.area_m2} م²</p>
                  </Link>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft page-section">
        <div className="container">
          <div className="section-shell page-shell grid gap-4 overflow-hidden lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
            <div className="space-y-4 lg:order-2">
              <p className="section-kicker">الافتتاح والحملة</p>
              <h2 className="section-title">خطوات قصيرة تسبق يوم الافتتاح.</h2>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {launchSteps.map((item, index) => (
                  <div key={item.title} className="editorial-panel rounded-[1.35rem] p-4 md:p-5">
                    <p className="text-xs font-semibold text-muted-foreground">0{index + 1}</p>
                    <p className="mt-2 text-base font-bold text-foreground">{item.title}</p>
                    <p className="mt-1.5 text-sm leading-7 text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="section-shell rounded-[1.6rem] p-5 md:p-6 lg:order-1">
              <div className="flex items-start gap-3">
                <Calendar className="icon-shell h-11 w-11 p-2.5" />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">ملخص الحملة</p>
                  <h3 className="mt-1 text-2xl font-bold text-foreground">تابع الموعد وحدد خطوتك التالية قبل الزيارة.</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                 {launchEvent?.description_ar ?? "صفحة الافتتاح تجمع تفاصيل اليوم، والحملة، والخطوات الأساسية للاستفادة من التجربة الترويجية."}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1rem] border border-border bg-card px-4 py-3 text-sm">
                  <p className="text-xs font-semibold text-muted-foreground">المسار</p>
                  <p className="mt-1 font-semibold text-foreground">خريطة ثم حملة ثم حضور فعلي</p>
                </div>
                <div className="rounded-[1rem] border border-border bg-card px-4 py-3 text-sm">
                  <p className="text-xs font-semibold text-muted-foreground">التاريخ</p>
                  <p className="mt-1 font-semibold text-foreground">{launchEvent?.event_date ?? "1 مايو 2026"}</p>
                </div>
              </div>
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
             <div className="brand-shell page-shell rounded-[1.85rem] py-6">
             <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
              <div className="space-y-4">
                <p className="section-kicker">الامتداد الرقمي</p>
                <h2 className="section-title">مرحلة لاحقة تُبنى بعد تثبيت تجربة الدليل والمتاجر.</h2>
                <p className="max-w-[34rem] text-base leading-7 text-muted-foreground md:text-lg">
                   الامتداد الرقمي يظل خطوة لاحقة مختصرة، تبدأ من المتاجر الحالية وتستكمل العلاقة بعد الزيارة دون تشتيت المنتج الأساسي الآن.
                </p>
                 <div className="grid gap-3 md:grid-cols-3">
                  {[
                    "ابدأ من الخريطة.",
                    "اختر المتاجر الأقرب لك.",
                    "ثم تابعها رقميًا لاحقًا.",
                  ].map((item, index) => (
                      <div key={item} className="editorial-panel flex min-h-[4.8rem] items-center rounded-[1.15rem] p-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">0{index + 1}</p>
                        <p className="mt-2 text-sm font-semibold text-foreground md:text-base">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
               <div className="editorial-panel rounded-[1.45rem] p-5 lg:mr-auto lg:max-w-[17.5rem]">
                <Store className="icon-shell h-12 w-12 p-3" />
                <h3 className="mt-4 text-xl font-bold text-foreground">امتداد رقمي من نفس الهوية</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">يبقى مؤجلًا ومضغوطًا حتى يظل الدليل والخريطة هما مركز المنتج الآن.</p>
                <Link to="/stores" className="mt-5 block"><Button variant="secondary" className="h-11 w-full rounded-[1rem]">استعرض المتاجر الحالية</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container max-w-5xl">
          <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div className="chapter-shell pt-5">
              <p className="section-kicker">الأسئلة الشائعة</p>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                <HelpCircle className="ml-2 inline-block h-7 w-7 text-accent" />
                إجابات سريعة قبل زيارتك الأولى
              </h2>
               <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">أسئلة أساسية تساعدك على الوصول للمعلومة بسرعة وبدون تكرار.</p>
              <Link to="/faq" className="mt-5 inline-flex"><Button variant="ghost" className="text-primary">عرض جميع الأسئلة</Button></Link>
            </div>
            <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-3">
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