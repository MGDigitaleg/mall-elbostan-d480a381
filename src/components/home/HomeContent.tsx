import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, HelpCircle, MapPin, Monitor, Shield, Smartphone, Sparkles, Store, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapTeaserPreview } from "@/components/home/MapTeaserPreview";
import { allMapUnits, availableMapUnits, exploreNeeds, floorMapData, homepageLeasingUnits, needCategoryDescriptions, needCategoryLabels, type NeedCategory } from "@/lib/floorMapData";
import heroImage from "@/assets/mall-exterior.jpg";
import interiorImage from "@/assets/mall-interior.jpg";
import facadeImage from "@/assets/mall-facade.jpg";

const heroPills = ["وجهة تقنية متخصصة", "وحدات جاهزة للاستفسار"];

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

const categorySupportLabels: Record<NeedCategory, string> = {
  Accessories: "احتياج يومي سريع",
  Laptops: "دراسة وعمل",
  Components: "أداء وتجميع",
  Networking: "حلول مكتبية",
  Maintenance: "خدمة مباشرة",
  "Security Systems": "مراقبة وحماية",
};

const mobileCategorySummaries: Record<NeedCategory, string> = {
  Accessories: "ملحقات سريعة وواضحة.",
  Laptops: "أجهزة للدراسة والعمل.",
  Components: "مكوّنات وتجميعات أداء.",
  Networking: "حلول شبكات للمكاتب.",
  Maintenance: "صيانة مباشرة وسريعة.",
  "Security Systems": "مراقبة وحماية واضحة.",
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
    supportLabel: categorySupportLabels[need],
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
      <section className="relative overflow-hidden bg-card pb-2 pt-4 md:pb-8 md:pt-8 lg:pb-16 lg:pt-12">
        <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="grid min-h-[auto] gap-4 py-3.5 md:gap-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:min-h-[70vh] lg:py-0">
            {/* Text block — right side in RTL */}
            <div className="order-1 space-y-3 text-right lg:space-y-5">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="eyebrow-chip mb-3 text-[0.72rem] md:mb-4 md:text-sm">افتتاح مايو 2026 • القاهرة الجديدة</div>
                <h1 className="text-[1.7rem] font-black leading-[1.05] text-foreground md:text-[3rem] lg:text-[3.4rem]">
                  مول البستان
                </h1>
                <p className="mt-2.5 max-w-[20rem] text-[0.92rem] font-semibold leading-[1.4] text-foreground/90 md:mt-3 md:max-w-[30rem] md:text-[1.3rem] lg:max-w-[24rem] lg:text-[1.25rem]">
                  خريطة أوضح لاختيار المتجر أو الوحدة.
                </p>
                <p className="mt-2 max-w-[18rem] text-[0.82rem] leading-[1.65] text-muted-foreground md:mt-3 md:max-w-[30rem] md:text-base lg:max-w-[26rem] lg:text-[0.95rem] lg:leading-7">
                  استكشف الدور والوحدة قبل زيارتك أو استفسارك.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="space-y-3 lg:space-y-4">
                <div className="flex flex-wrap gap-2">
                  {heroPills.map((item, index) => (
                    <span key={item} className={`mini-chip h-7 px-3 py-0 text-[0.72rem] md:h-8 md:px-3.5 md:text-sm ${index === 1 ? "inline-flex lg:hidden" : "inline-flex"}`}>{item}</span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 md:hidden">
                  <Link to="/map" className="w-full"><Button variant="cta" size="lg" className="h-12 w-full rounded-[1rem] px-4">استكشف الخريطة</Button></Link>
                  <Link to="/leasing" className="w-full"><Button variant="outline-blue" size="lg" className="h-12 w-full rounded-[1rem] px-4">استفسر عن الوحدات</Button></Link>
                </div>

                <div className="hidden gap-3 sm:flex sm:flex-wrap md:flex lg:flex">
                  <Link to="/map"><Button variant="cta" size="lg" className="h-11 min-w-[11rem] rounded-[1rem] px-6">استكشف الخريطة</Button></Link>
                  <Link to="/leasing"><Button variant="outline-blue" size="lg" className="h-11 min-w-[11rem] rounded-[1rem] px-6">استفسر عن الوحدات</Button></Link>
                </div>

                <div className="rounded-[1rem] border border-border bg-background px-3 py-3 md:rounded-[1.25rem] md:px-4 md:py-3.5 lg:px-5 lg:py-4">
                  <div className="grid grid-cols-3 gap-2.5">
                    {heroFacts.map((item) => (
                      <div key={item.label} className="flex min-h-[3.5rem] flex-col items-center justify-center rounded-xl border border-border/60 bg-card px-2 py-2.5 text-center md:min-h-[4.2rem] md:px-3 md:py-3 lg:min-h-[4.5rem]">
                        <p className="text-[0.65rem] font-semibold text-muted-foreground md:text-xs">{item.label}</p>
                        <p className="mt-0.5 text-[0.95rem] font-bold text-foreground md:text-lg lg:text-xl">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hidden rounded-[1.15rem] border border-border bg-background px-4 py-4 md:block lg:px-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">العد التنازلي</p>
                    <span className="text-xs text-muted-foreground">حتى الافتتاح</span>
                  </div>
                  <CountdownTimer compact />
                </div>
              </motion.div>
            </div>

            {/* Image block — left side in RTL, balanced size */}
            <motion.div initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} className="order-2 flex w-full items-center justify-center">
              <div className="relative mx-auto w-[85%] lg:w-[85%]">
                <div className="section-shell overflow-hidden rounded-2xl p-1.5 md:rounded-[1.75rem] lg:p-2">
                  <div className="image-shell aspect-[3/4] overflow-hidden rounded-xl bg-card md:rounded-2xl">
                    <img src={heroImage} alt="الواجهة الرئيسية لمول البستان" className="h-full w-full object-cover object-center" loading="eager" />
                  </div>
                </div>
                <div className="section-shell absolute -bottom-2 -right-2 hidden w-[38%] min-w-[6rem] overflow-hidden rounded-xl p-1 md:block md:-bottom-3 md:-right-3 lg:rounded-2xl lg:p-1.5">
                  <div className="image-shell aspect-[3/4] overflow-hidden rounded-lg md:rounded-xl">
                    <img src={interiorImage} alt="مشهد داخلي داعم لتجربة مول البستان" className="h-full w-full object-cover object-center" loading="lazy" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="space-y-0 md:hidden">
        <section className="page-section pt-3">
          <div className="container">
            <div className="space-y-2.5">
              <div className="space-y-1.5">
                <p className="section-kicker">الخريطة التفاعلية</p>
                <h2 className="section-title max-w-[16rem]">ابدأ من الدليل.</h2>
                <p className="max-w-[18rem] text-sm leading-6 text-muted-foreground">الوحدة، الدور، والحالة ظاهرة فورًا قبل أي خطوة لاحقة.</p>
              </div>
              <MapTeaserPreview />
            </div>
          </div>
        </section>

        <section className="page-section py-6">
          <div className="container">
            <div className="space-y-2.5">
              <div className="space-y-1.5">
                <p className="section-kicker">الفئات الرئيسية</p>
                <h2 className="section-title max-w-[16rem]">ابدأ من فئة واضحة.</h2>
              </div>
              <Collapsible className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  {categoryStories.slice(0, 4).map((category, index) => (
                    <div key={category.key} className="editorial-panel flex min-h-[7.15rem] flex-col rounded-[1rem] p-3">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="icon-shell h-9 w-9 p-2.5"><category.icon className="h-4.5 w-4.5" /></div>
                        <span className="text-[0.68rem] font-semibold text-muted-foreground">0{index + 1}</span>
                      </div>
                      <h3 className="text-[0.92rem] font-bold leading-5 text-foreground">{category.name}</h3>
                      <p className="mt-1 text-[0.73rem] leading-5 text-muted-foreground">{mobileCategorySummaries[category.key]}</p>
                    </div>
                  ))}
                </div>
                <CollapsibleContent className="grid grid-cols-2 gap-2">
                  {categoryStories.slice(3).map((category, index) => (
                    <div key={category.key} className="editorial-panel flex min-h-[7.15rem] flex-col rounded-[1rem] p-3">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="icon-shell h-9 w-9 p-2.5"><category.icon className="h-4.5 w-4.5" /></div>
                        <span className="text-[0.68rem] font-semibold text-muted-foreground">0{index + 5}</span>
                      </div>
                      <h3 className="text-[0.92rem] font-bold leading-5 text-foreground">{category.name}</h3>
                      <p className="mt-1 text-[0.73rem] leading-5 text-muted-foreground">{mobileCategorySummaries[category.key]}</p>
                    </div>
                  ))}
                </CollapsibleContent>
                <CollapsibleTrigger asChild>
                  <Button variant="secondary" className="h-11 w-full rounded-[1rem]">عرض باقي الفئات</Button>
                </CollapsibleTrigger>
              </Collapsible>
            </div>
          </div>
        </section>

        <section className="page-section py-6">
          <div className="container">
            <div className="section-shell rounded-[1.3rem] px-4 py-4">
              <div className="space-y-2.5">
                <p className="section-kicker">التأجير والوحدات</p>
                <h2 className="section-title max-w-[17rem]">وحدات جاهزة للاستفسار.</h2>
                <p className="max-w-[18rem] text-sm leading-6 text-muted-foreground">عرض مختصر للوحدات المتاحة مع انتقال مباشر إلى التأجير.</p>
                <div className="grid gap-2">
                  {[
                    "حالة كل وحدة واضحة داخل الدليل.",
                    "التحويل إلى الاستفسار يتم بخطوة واحدة.",
                  ].map((item) => (
                    <div key={item} className="editorial-panel flex min-h-[2.8rem] items-center rounded-[0.95rem] px-3 py-2 text-sm text-foreground/90">{item}</div>
                  ))}
                </div>
                <div className="grid gap-2.5">
                  {homepageLeasingUnits.slice(0, 2).map((unit) => (
                    <Link key={unit.unit_id} to="/map" className="editorial-panel flex min-h-[6.35rem] flex-col rounded-[1.05rem] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-bold text-foreground">وحدة {unit.unit_id}</p>
                          <p className="mt-1 text-[0.72rem] font-semibold text-muted-foreground">{needCategoryLabels[unit.category]}</p>
                        </div>
                        <span className="rounded-full border border-orange/25 bg-orange/10 px-2.5 py-1 text-[0.7rem] font-semibold text-orange">متاحة</span>
                      </div>
                      <div className="mt-2.5 grid grid-cols-2 gap-2 text-sm">
                        <div className="rounded-[0.9rem] border border-border bg-card px-3 py-2">
                          <p className="text-[0.7rem] font-semibold text-muted-foreground">الدور</p>
                          <p className="mt-1 font-semibold text-foreground">{floorLabels[unit.floor_id]}</p>
                        </div>
                        <div className="rounded-[0.9rem] border border-border bg-card px-3 py-2">
                          <p className="text-[0.7rem] font-semibold text-muted-foreground">المساحة</p>
                          <p className="mt-1 font-semibold text-foreground">{unit.area_m2} م²</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/leasing"><Button variant="orange" className="h-12 w-full rounded-[1rem]">افتح صفحة التأجير</Button></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section py-6">
          <div className="container">
            <div className="section-shell rounded-[1.3rem] px-4 py-4">
              <div className="space-y-2.5">
                <p className="section-kicker">داخل المول</p>
                <h2 className="section-title max-w-[16rem]">مسار أوضح داخل الزيارة.</h2>
                <p className="max-w-[18rem] text-sm leading-6 text-muted-foreground">تنظيم داخلي يسهّل الوصول للفئات والمتاجر بسرعة.</p>
                <div className="image-shell aspect-[4/3.05] overflow-hidden rounded-[1.35rem] border border-border/80 bg-card">
                  <img src={interiorImage} alt="مشهد داخلي من مول البستان" className="h-full w-full object-cover object-center" loading="lazy" />
                </div>
                <div className="grid gap-2">
                  <div className="editorial-panel rounded-[0.95rem] px-3 py-2.5 text-sm text-foreground">مشهد داخلي متوازن يدعم العرض الواضح.</div>
                  <div className="editorial-panel rounded-[0.95rem] px-3 py-2.5 text-sm text-foreground">حركة أسهل بين الفئات والمتاجر من أول نظرة.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="hidden page-section pt-6 md:block md:pt-12 min-[768px]:max-[1194px]:pt-10 lg:pt-12">
        <div className="container">
          <div className="grid gap-4 min-[768px]:max-[1194px]:grid-cols-[2fr_3fr] min-[768px]:max-[1194px]:items-center min-[768px]:max-[1194px]:gap-5 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-6">
            <div className="order-1 space-y-2.5 min-[768px]:max-[1194px]:order-1 min-[768px]:max-[1194px]:space-y-3 lg:order-1 lg:space-y-3">
              <div className="chapter-shell pt-4 md:pt-5">
                <p className="section-kicker">لماذا مول البستان</p>
                <h2 className="section-title max-w-[35rem]">وجهة تقنية بهوية واضحة وتجربة زيارة أهدأ.</h2>
              </div>
              <p className="max-w-[24rem] text-sm leading-6 text-muted-foreground md:max-w-[29rem] md:text-lg md:leading-7 min-[768px]:max-[1194px]:max-w-[25rem] min-[768px]:max-[1194px]:text-base">
                المشروع يجمع الفئات الأساسية في مسار أقصر للزائر ويمنح النشاط التجاري حضورًا أوضح داخل المول.
              </p>
              <div className="grid gap-1.5 sm:grid-cols-2 md:gap-2.5 min-[768px]:max-[1194px]:grid-cols-2">
                {benefitChips.map((item) => (
                  <div key={item} className="mini-chip h-[2.55rem] justify-start rounded-[0.95rem] px-3 py-0 text-[0.72rem] md:h-[2.9rem] md:rounded-[1rem] md:px-4 md:text-sm">{item}</div>
                ))}
              </div>
            </div>
            <div className="hidden gap-2.5 md:grid md:grid-cols-3 md:gap-3 min-[768px]:max-[1194px]:order-2 min-[768px]:max-[1194px]:grid-cols-3 lg:order-2 lg:grid-cols-3 lg:items-stretch">
              {whyCards.map((card, index) => (
                <motion.div key={card.title} custom={index} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex">
                  <div className={`editorial-panel flex h-full min-h-[11rem] w-full flex-col rounded-[1.15rem] p-4 md:rounded-[1.3rem] md:p-5 min-[768px]:max-[1194px]:min-h-[11rem] min-[768px]:max-[1194px]:p-4`}>
                    <card.icon className="icon-shell mb-3 h-10 w-10 shrink-0 p-2.5 md:h-11 md:w-11 md:p-2.5" />
                    <h3 className="text-[1.05rem] font-extrabold text-foreground md:text-lg">{card.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground min-[768px]:max-[1194px]:text-[0.9rem] min-[768px]:max-[1194px]:leading-6 lg:max-w-[22rem]">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="editorial-panel rounded-[1.2rem] p-3.5 md:hidden">
              <div className="space-y-3">
                {whyCards.map((card, index) => (
                  <div key={card.title} className={`flex items-start gap-2.5 ${index !== whyCards.length - 1 ? "border-b border-border pb-3" : ""}`}>
                    <card.icon className="icon-shell h-9 w-9 shrink-0 p-2" />
                    <div>
                      <h3 className="text-[0.95rem] font-bold text-foreground">{card.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden section-soft page-section md:block min-[768px]:max-[1194px]:py-16 lg:py-20">
        <div className="container">
          <div className="section-shell page-shell grid gap-4 overflow-hidden min-[768px]:max-[1194px]:grid-cols-[1.08fr_0.92fr] min-[768px]:max-[1194px]:items-center min-[768px]:max-[1194px]:gap-4 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-4.5">
            <div className="order-2 space-y-3 min-[768px]:max-[1194px]:order-1 min-[768px]:max-[1194px]:max-w-[28rem] lg:order-1 lg:max-w-[32rem] lg:space-y-4">
              <p className="section-kicker">داخل المول</p>
              <h2 className="section-title">تنظيم معماري يعطي الزيارة مسارًا أوضح.</h2>
              <p className="text-sm leading-6 text-muted-foreground md:text-lg md:leading-7 min-[768px]:max-[1194px]:text-base">
                من الأتريوم إلى مسارات الحركة، التجربة مصممة لتسهيل الاستكشاف والعرض داخل بيئة تقنية واضحة.
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2 md:gap-3 min-[768px]:max-[1194px]:grid-cols-1">
                <div className="editorial-panel rounded-[1.15rem] p-4 md:rounded-[1.35rem] md:p-5 min-[768px]:max-[1194px]:p-4">
                  <p className="text-base font-bold text-foreground">مشهد داخلي متوازن</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">التوزيع الداخلي يدعم العرض ويقلل التشويش البصري.</p>
                </div>
                <div className="editorial-panel rounded-[1.15rem] p-4 md:rounded-[1.35rem] md:p-5 min-[768px]:max-[1194px]:p-4">
                  <p className="text-base font-bold text-foreground">حركة أسهل للزائر</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">الوصول للفئات والمتاجر أوضح من أول نظرة.</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="grid gap-3 min-[768px]:max-[1194px]:grid-cols-[1fr_0.36fr] lg:grid-cols-[1fr_0.38fr]">
                <div className="image-shell aspect-[4/3] overflow-hidden rounded-[2rem] border border-border/80 bg-card min-[768px]:max-[1194px]:aspect-[4/3.2]">
                  <img src={interiorImage} alt="مشهد داخلي من مول البستان" className="h-full w-full object-cover object-center" loading="lazy" />
                </div>
                <div className="image-shell hidden aspect-[3/4] overflow-hidden rounded-[1.6rem] border border-border/80 bg-card min-[768px]:max-[1194px]:block lg:block">
                  <img src={facadeImage} alt="تفصيل معماري داعم لهوية مول البستان" className="h-full w-full object-cover object-center" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden page-section py-8 md:block md:py-12 min-[768px]:max-[1194px]:py-16 lg:py-12">
        <div className="container">
          <div className="chapter-shell mb-4 max-w-[34rem] pt-4 md:pt-5">
            <p className="section-kicker">الفئات الرئيسية</p>
            <h2 className="section-title">ابدأ من الفئة الأقرب لاحتياجك.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground md:mt-2.5 md:text-lg md:leading-7">ست فئات أساسية غير متداخلة تساعدك تفهم طبيعة المول بسرعة.</p>
          </div>
          <div className="hidden gap-3 md:grid md:grid-cols-2 min-[768px]:max-[1194px]:gap-4 lg:grid-cols-3">
            {categoryStories.map((category, index) => (
              <motion.div key={category.key} custom={index} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                 <div className="editorial-panel flex min-h-[10rem] h-full flex-col rounded-[1.35rem] p-4.5 transition-colors duration-200 hover:border-primary/35 min-[768px]:max-[1194px]:min-h-[9.2rem] min-[768px]:max-[1194px]:rounded-[1.5rem] min-[768px]:max-[1194px]:p-4 lg:min-h-[9.6rem]">
                  <div className="mb-2.5 flex items-center justify-between gap-3">
                    <div className="icon-shell h-12 w-12 p-3 shadow-[var(--shadow-soft)]"><category.icon className="h-6 w-6" /></div>
                    <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground md:text-xl">{category.name}</h3>
                   <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base min-[768px]:max-[1194px]:text-[0.92rem] min-[768px]:max-[1194px]:leading-6">{mobileCategorySummaries[category.key]}</p>
                  <div className="mt-auto pt-3">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.72rem] font-semibold ${index % 3 === 0 ? "border-primary/20 bg-secondary text-foreground" : index % 3 === 1 ? "border-accent/20 bg-accent/10 text-foreground" : "border-border bg-card text-muted-foreground"}`}>{category.supportLabel}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <Collapsible className="space-y-2.5 md:hidden">
            {categoryStories.slice(0, 3).map((category, index) => (
              <div key={category.key} className="editorial-panel rounded-[1.15rem] p-3.5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="icon-shell h-10 w-10 p-2.5"><category.icon className="h-5 w-5" /></div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">{category.name}</h3>
                      <p className="mt-0.5 text-[0.74rem] font-semibold text-muted-foreground">0{index + 1}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[0.68rem] font-semibold text-muted-foreground">{category.supportLabel}</span>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{category.desc}</p>
              </div>
            ))}
            <CollapsibleContent className="space-y-2.5">
              {categoryStories.slice(3).map((category, index) => (
                <div key={category.key} className="editorial-panel rounded-[1.15rem] p-3.5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="icon-shell h-10 w-10 p-2.5"><category.icon className="h-5 w-5" /></div>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{category.name}</h3>
                        <p className="mt-0.5 text-[0.74rem] font-semibold text-muted-foreground">0{index + 4}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[0.68rem] font-semibold text-muted-foreground">{category.supportLabel}</span>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{category.desc}</p>
                </div>
              ))}
            </CollapsibleContent>
            <CollapsibleTrigger asChild>
              <Button variant="secondary" className="h-10 w-full rounded-[1rem]">عرض جميع الفئات</Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </section>

      <section className="hidden section-soft page-section py-8 md:block md:py-12 min-[768px]:max-[1194px]:py-16 lg:py-12">
        <div className="container">
          <div className="grid gap-6 overflow-hidden min-[768px]:max-[1194px]:section-shell min-[768px]:max-[1194px]:page-shell min-[768px]:max-[1194px]:grid-cols-[2fr_3fr] min-[768px]:max-[1194px]:items-center min-[768px]:max-[1194px]:gap-6 lg:section-shell lg:page-shell lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-6">
            <div className="order-1 space-y-2.5 min-[768px]:max-[1194px]:order-1 min-[768px]:max-[1194px]:max-w-none min-[768px]:max-[1194px]:space-y-3 lg:order-1 lg:space-y-3.5">
              <p className="section-kicker">الخريطة التفاعلية</p>
              <h2 className="section-title">الدليل التفاعلي هو المنتج الأساسي هنا.</h2>
              <p className="text-sm leading-6 text-muted-foreground md:text-lg md:leading-7 min-[768px]:max-[1194px]:text-base">الدور، الوحدة، والحالة كلها ظاهرة مباشرة قبل الدخول إلى الدليل الكامل.</p>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 min-[768px]:max-[1194px]:grid-cols-3 lg:grid-cols-3">
                <div className="editorial-panel min-h-[4.5rem] rounded-[1rem] p-3 md:min-h-[5.2rem] md:rounded-[1.25rem] md:p-4">
                  <p className="text-xs font-semibold text-muted-foreground">عدد الأدوار</p>
                  <p className="mt-1 text-lg font-bold text-foreground md:mt-1.5 md:text-xl">{floorMapData.length}</p>
                </div>
                <div className="editorial-panel min-h-[4.5rem] rounded-[1rem] p-3 md:min-h-[5.2rem] md:rounded-[1.25rem] md:p-4">
                  <p className="text-xs font-semibold text-muted-foreground">الوحدات المتاحة</p>
                  <p className="mt-1 text-lg font-bold text-foreground md:mt-1.5 md:text-xl">{availableUnits.length}</p>
                </div>
                <div className="editorial-panel min-h-[4.5rem] rounded-[1rem] p-3 md:min-h-[5.2rem] md:rounded-[1.25rem] md:p-4">
                  <p className="text-xs font-semibold text-muted-foreground">الوحدات المعروضة</p>
                  <p className="mt-1 text-lg font-bold text-foreground md:mt-1.5 md:text-xl">{totalUnits}</p>
                </div>
              </div>
              <div className="rounded-[1.05rem] border border-border bg-card px-3 py-2.5 text-sm leading-6 text-muted-foreground md:rounded-[1.25rem] md:px-4 md:py-3.5 md:leading-7">
                ابدأ من الدور، راجع تمييز الحالة، ثم افتح الدليل أو انتقل مباشرة إلى الاستفسار من نفس المصدر.
              </div>
            </div>
            <div className="order-2 min-[768px]:max-[1194px]:order-2 lg:order-2">
              <MapTeaserPreview />
            </div>
          </div>
        </div>
      </section>

      <section className="hidden page-section py-8 md:block md:py-12 min-[768px]:max-[1194px]:py-16 lg:py-12">
        <div className="container">
           <div className="section-shell page-shell grid gap-3.5 overflow-hidden min-[768px]:max-[1194px]:grid-cols-[0.96fr_1.04fr] min-[768px]:max-[1194px]:items-start min-[768px]:max-[1194px]:gap-4 lg:grid-cols-[0.94fr_1.06fr] lg:items-start lg:gap-3.5">
             <div className="space-y-3 min-[768px]:max-[1194px]:max-w-[27rem] lg:max-w-[30rem] lg:space-y-3.5">
              <p className="section-kicker">التأجير والوحدات</p>
              <h2 className="section-title">التأجير هنا قرار تجاري أوضح وأسرع.</h2>
              <p className="text-sm leading-6 text-muted-foreground md:text-lg md:leading-7 min-[768px]:max-[1194px]:text-base">الوحدات المعروضة هنا مرتبطة مباشرة ببيانات الخريطة نفسها، لتبدأ الاستفسار من مصدر واحد واضح.</p>
                <div className="space-y-2">
                {[
                  "وحدات معروضة بحالة واضحة داخل الخريطة.",
                  "فهم أسرع لموقع الوحدة داخل الدور.",
                  "تحويل مباشر من الاستكشاف إلى الاستفسار التجاري.",
                ].slice(0, 2).map((item) => (
                    <div key={item} className="editorial-panel flex min-h-[3rem] items-center rounded-[1rem] px-3.5 py-2.5 text-sm text-foreground/90 md:min-h-[3.2rem] md:rounded-[1.2rem] md:px-4 md:py-3 md:text-base">{item}</div>
                ))}
              </div>
              <div className="grid gap-2.5 pt-1 sm:grid-cols-2">
                <Link to="/leasing"><Button variant="orange" size="lg" className="h-11 w-full rounded-[1.1rem] px-6">استفسر عن الوحدة</Button></Link>
                <Link to="/map"><Button variant="outline-blue" size="lg" className="h-11 w-full rounded-[1.1rem] px-6">افتح الدليل الكامل</Button></Link>
              </div>
            </div>
              <div className="space-y-2.5 md:space-y-3">
               <div className="editorial-panel rounded-[1.3rem] p-4 md:rounded-[1.6rem] md:p-6 min-[768px]:max-[1194px]:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">مصدر البيانات</p>
                    <h3 className="mt-1 text-[1.3rem] font-bold text-foreground md:text-2xl">العرض هنا متصل مباشرة بالدليل التفاعلي.</h3>
                  </div>
                  <span className="rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground">مصدر واحد</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 md:mt-4 md:gap-2.5">
                  {availableByFloor.map((floor) => (
                    <div key={floor.id} className="rounded-[1rem] border border-border bg-card px-3 py-2.5 md:rounded-[1.1rem] md:px-4 md:py-3">
                      <p className="text-xs font-semibold text-muted-foreground">{floor.label}</p>
                      <p className="mt-1 text-lg font-bold text-foreground">{floor.count}</p>
                    </div>
                ))}
              </div>
              </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {homepageLeasingUnits.slice(0, 2).map((unit) => (
                     <Link key={unit.unit_id} to="/map" className="editorial-panel flex min-h-[6.4rem] flex-col rounded-[1.25rem] p-4 transition-colors hover:border-orange/45 min-[768px]:max-[1194px]:min-h-[7rem] lg:min-h-[6.8rem]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-bold text-foreground">وحدة {unit.unit_id}</p>
                          <p className="mt-1 text-[0.72rem] font-semibold text-muted-foreground">{needCategoryLabels[unit.category]}</p>
                        </div>
                        <span className="rounded-full border border-orange/25 bg-orange/10 px-2.5 py-1 text-[0.68rem] font-semibold text-orange">متاحة</span>
                     </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div className="rounded-[0.95rem] border border-border bg-card px-3 py-2">
                          <p className="text-[0.7rem] font-semibold text-muted-foreground">الدور</p>
                          <p className="mt-1 font-semibold text-foreground">{floorLabels[unit.floor_id]}</p>
                        </div>
                        <div className="rounded-[0.95rem] border border-border bg-card px-3 py-2">
                          <p className="text-[0.7rem] font-semibold text-muted-foreground">المساحة</p>
                          <p className="mt-1 font-semibold text-foreground">{unit.area_m2} م²</p>
                        </div>
                      </div>
                  </Link>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden section-soft page-section py-8 md:block md:py-12 min-[768px]:max-[1194px]:py-16 lg:py-12">
        <div className="container">
          <div className="section-shell page-shell flex flex-col gap-4 overflow-hidden min-[768px]:flex-row min-[768px]:items-start min-[768px]:gap-8">
            <div className="w-full shrink-0 space-y-3 min-[768px]:order-2 min-[768px]:w-fit min-[768px]:max-w-[26rem] lg:space-y-2.5">
              <p className="section-kicker">الافتتاح والحملة</p>
              <h2 className="section-title">خطوات قصيرة تسبق يوم الافتتاح.</h2>
              <p className="max-w-[28rem] text-sm leading-6 text-muted-foreground">المسار الأوضح: استكشف، تابع الحملة، ثم احضر يوم الافتتاح.</p>
              <div className="hidden gap-2.5 sm:grid sm:grid-cols-3 min-[768px]:max-[1194px]:grid-cols-1 lg:grid-cols-3">
                {launchSteps.map((item, index) => (
                  <div key={item.title} className="editorial-panel min-h-[6.9rem] rounded-[1.2rem] p-4 md:p-4.5 min-[768px]:max-[1194px]:min-h-[6.2rem] lg:min-h-[7.1rem]">
                    <p className="text-xs font-semibold text-muted-foreground">0{index + 1}</p>
                    <p className="mt-1.5 text-[0.98rem] font-bold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
              <Accordion type="single" collapsible className="space-y-2 sm:hidden">
                {launchSteps.map((item, index) => (
                  <AccordionItem key={item.title} value={item.title} className="editorial-panel overflow-hidden rounded-[1rem] px-4">
                    <AccordionTrigger className="min-h-[3.7rem] py-3 text-right text-sm font-bold text-foreground">
                      <span className="flex items-center gap-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-[0.72rem] text-muted-foreground">0{index + 1}</span>
                        {item.title}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-sm leading-6 text-muted-foreground">
                      {item.desc}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div className="section-shell flex min-w-0 flex-1 flex-col justify-between rounded-[1.25rem] p-4 min-[768px]:order-1 md:rounded-[1.55rem] md:p-5.5 lg:p-5">
              <div>
              <div className="flex items-start gap-3">
                <Calendar className="icon-shell h-11 w-11 p-2.5" />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">ملخص الحملة</p>
                  <h3 className="mt-1 text-[1.28rem] font-bold text-foreground md:text-2xl">تابع الموعد وحدد خطوتك التالية قبل الزيارة.</h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                 {launchEvent?.description_ar ?? "صفحة الافتتاح تجمع تفاصيل اليوم، والحملة، والخطوات الأساسية للاستفادة من التجربة الترويجية."}
              </p>
              <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-[1rem] border border-border bg-card px-4 py-3 text-sm">
                  <p className="text-xs font-semibold text-muted-foreground">المسار</p>
                  <p className="mt-1 font-semibold text-foreground">خريطة ثم حملة ثم حضور فعلي</p>
                </div>
                <div className="rounded-[1rem] border border-border bg-card px-4 py-3 text-sm">
                  <p className="text-xs font-semibold text-muted-foreground">التاريخ</p>
                  <p className="mt-1 font-semibold text-foreground">{launchEvent?.event_date ?? "1 مايو 2026"}</p>
                </div>
              </div>
              </div>
              <div className="mt-4 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3 md:mt-4.5">
                <Link to="/spin-win"><Button variant="cta" size="lg" className="h-11 w-full rounded-[1rem] px-6">جرّب أدر واربح</Button></Link>
                <Link to="/opening-day"><Button variant="outline-blue" size="lg" className="h-11 w-full rounded-[1rem] px-6">تفاصيل الافتتاح</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="marketplace" className="hidden page-section py-8 md:block md:py-10 min-[768px]:max-[1194px]:py-14 lg:py-10">
        <div className="container">
             <div className="brand-shell page-shell rounded-[1.85rem] py-5 min-[768px]:max-[1194px]:py-4.5 lg:py-4.5">
              <div className="grid gap-3 min-[768px]:max-[1194px]:grid-cols-[1.1fr_0.9fr] min-[768px]:max-[1194px]:items-start lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:gap-3.5">
               <div className="space-y-2.5">
                <p className="section-kicker">الامتداد الرقمي</p>
                  <h2 className="section-title">امتداد رقمي لاحق بعد تثبيت المنتج الأساسي.</h2>
                   <p className="max-w-[31rem] text-base leading-7 text-muted-foreground md:text-lg min-[768px]:max-[1194px]:text-base lg:text-[0.98rem] lg:leading-7">
                    الخريطة والمتاجر أولًا، ثم أي توسع رقمي لاحقًا.
                </p>
                   <div className="rounded-[1.2rem] border border-border bg-card px-4 py-3 text-sm leading-7 text-muted-foreground min-[768px]:max-[1194px]:grid min-[768px]:max-[1194px]:gap-2.5">
                    <div className="grid gap-2 min-[768px]:max-[1194px]:grid-cols-3">
                      <div className="rounded-[0.95rem] border border-border/80 bg-background px-3 py-2 text-[0.76rem] font-semibold text-foreground">1. الدليل</div>
                      <div className="rounded-[0.95rem] border border-border/80 bg-background px-3 py-2 text-[0.76rem] font-semibold text-foreground">2. المتاجر</div>
                      <div className="rounded-[0.95rem] border border-border/80 bg-background px-3 py-2 text-[0.76rem] font-semibold text-foreground">3. الامتداد</div>
                    </div>
                 </div>
              </div>
                <div className="editorial-panel rounded-[1.35rem] p-4.5 min-[768px]:max-[1194px]:p-4.5 lg:mr-auto lg:max-w-[16rem]">
                <Store className="icon-shell h-12 w-12 p-3" />
                  <h3 className="mt-3 text-[1.05rem] font-bold text-foreground">التركيز الآن على المنتج الأساسي</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">ابدأ بالمتاجر الحالية والدليل أولًا.</p>
                  <Link to="/stores" className="mt-3.5 block"><Button variant="secondary" className="h-11 w-full rounded-[1rem]">استعرض المتاجر الحالية</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section pt-6 md:pt-10 min-[768px]:max-[1194px]:pt-9 lg:pt-8">
        <div className="container max-w-5xl">
          <div className="grid gap-4 min-[768px]:max-[1194px]:grid-cols-[0.8fr_1.2fr] min-[768px]:max-[1194px]:items-start lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div className="chapter-shell pt-3 md:pt-5">
              <p className="section-kicker">الأسئلة الشائعة</p>
              <h2 className="text-[1.7rem] font-bold leading-[1.08] text-foreground md:text-4xl lg:text-[2.5rem]">
                <HelpCircle className="ml-2 hidden h-7 w-7 text-accent md:inline-block" />
                إجابات سريعة قبل الزيارة
              </h2>
                <p className="mt-2 max-w-[16rem] text-sm leading-6 text-muted-foreground md:mt-3 md:max-w-none md:text-lg md:leading-7 min-[768px]:max-[1194px]:text-base">إجابات مختصرة للأسئلة الأهم قبل الزيارة الأولى.</p>
              <Link to="/faq" className="mt-2.5 inline-flex md:mt-5 min-[768px]:max-[1194px]:mt-4"><Button variant="ghost" className="px-0 text-primary">عرض جميع الأسئلة</Button></Link>
            </div>
            <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-1.5 md:space-y-3">
              {faqItems.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="section-shell overflow-hidden rounded-[1.1rem] px-4 md:rounded-[1.25rem] md:px-5">
                  <AccordionTrigger className="min-h-[3.65rem] py-3 text-right text-sm font-semibold text-foreground hover:text-primary md:min-h-[4.25rem] md:py-4 md:text-base">
                    {faq.question_ar}
                  </AccordionTrigger>
                  <AccordionContent className="pb-3.5 text-sm leading-6 text-muted-foreground md:pb-5 md:text-base md:leading-7">
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