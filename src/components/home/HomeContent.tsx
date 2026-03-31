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
      <section className="relative overflow-hidden pb-3 pt-1 md:pb-8 lg:pb-10">
        <div className="editorial-grid absolute inset-0 opacity-35" />
        <div className="page-halo absolute inset-0" />
        <div className="container relative">
          <div className="brand-shell grid min-h-[auto] gap-3 overflow-hidden rounded-[2rem] px-3.5 py-4 lg:page-shell lg:min-h-[40rem] lg:grid-cols-[5fr_7fr] lg:gap-4">
            <div className="order-2 space-y-2.5 lg:order-1 lg:flex lg:flex-col lg:justify-center lg:space-y-3">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="eyebrow-chip mb-2.5 text-[0.78rem] md:mb-3 md:text-sm">افتتاح مايو 2026 • وجهة تقنية في القاهرة الجديدة</div>
                <h1 className="max-w-[19rem] text-[1.72rem] font-black leading-[1.05] text-foreground md:max-w-[38.75rem] md:text-[2.9rem] lg:text-[4rem]">
                  مول البستان
                  <span className="mt-2 block max-w-[18rem] text-[0.9rem] font-semibold leading-[1.42] text-foreground/90 md:mt-3 md:max-w-[35rem] md:text-[1.35rem] lg:text-[1.6rem]">
                    خريطة أوضح لاستكشاف المتاجر والوحدات.
                  </span>
                </h1>
                <p className="mt-2 max-w-[18rem] text-[0.82rem] leading-6 text-muted-foreground md:mt-3 md:max-w-[33rem] md:text-lg md:leading-7">
                  ابدأ من الدليل ثم تحرك مباشرة إلى المتجر أو الوحدة المناسبة.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="section-shell grid gap-2 rounded-[1.35rem] p-3 md:gap-2.5 md:rounded-[1.6rem] md:p-5">
                <div className="flex flex-wrap gap-2">
                  {heroPills.map((item, index) => (
                    <span key={item} className={`mini-chip h-7 px-3 py-0 text-[0.76rem] md:h-8 md:px-3.5 md:text-sm ${index === 1 ? "hidden sm:inline-flex" : "inline-flex"}`}>{item}</span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                  <Link to="/map" className="w-full sm:w-auto"><Button variant="cta" size="lg" className="h-11 w-full min-w-[11rem] rounded-[1rem] px-6">استكشف الخريطة</Button></Link>
                  <Link to="/leasing" className="w-full sm:w-auto"><Button variant="orange" size="lg" className="h-11 w-full min-w-[11rem] rounded-[1rem] px-6">استفسر عن الوحدات</Button></Link>
                </div>

                <div className="grid gap-2 lg:grid-cols-[1.08fr_0.92fr] lg:gap-2.5">
                  <div className="rounded-[1.1rem] border border-border bg-card px-2.5 py-2.5 md:rounded-[1.25rem] md:px-3.5 md:py-3">
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {heroFacts.map((item, index) => (
                      <div key={item.label} className={`editorial-panel flex min-h-[3.8rem] flex-col justify-center rounded-[0.95rem] px-2.5 py-2 md:min-h-[4.4rem] md:rounded-[1.1rem] md:px-3.5 md:py-2.5 ${index === 2 ? "col-span-2 md:col-span-1" : ""}`}>
                        <p className="text-[0.68rem] font-semibold leading-4 text-muted-foreground md:text-xs">{item.label}</p>
                        <p className="mt-1 text-sm font-bold text-foreground md:text-lg">{item.value}</p>
                      </div>
                    ))}
                    </div>
                  </div>
                  <div className="hidden rounded-[1.15rem] border border-border bg-card px-3.5 py-3 md:block md:rounded-[1.25rem] md:px-4 md:py-3.5">
                    <div className="mb-2 flex items-center justify-between gap-3 md:mb-2.5">
                      <p className="text-sm font-semibold text-foreground">العد التنازلي</p>
                      <span className="text-[0.72rem] text-muted-foreground md:text-xs">حتى الافتتاح</span>
                    </div>
                    <CountdownTimer compact />
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} className="order-1 relative mx-auto flex w-full max-w-[48rem] items-center lg:order-2 lg:justify-start">
              <div className="relative w-full">
                <div className="section-shell overflow-hidden rounded-[1.8rem] p-2 md:rounded-[2.25rem]">
                  <div className="image-shell aspect-[4/4.2] overflow-hidden rounded-[1.5rem] bg-card md:rounded-[2rem] lg:aspect-[4/3]">
                    <img src={heroImage} alt="الواجهة الرئيسية لمول البستان" className="h-full w-full object-cover object-center" loading="eager" />
                    <div className="image-wash absolute inset-0" />
                  </div>
                </div>
                <div className="section-shell absolute bottom-4 right-4 hidden w-[28%] min-w-[9.5rem] overflow-hidden rounded-[1.5rem] p-2 sm:block md:bottom-6 md:right-6">
                  <div className="image-shell aspect-[3/4] overflow-hidden rounded-[1.15rem]">
                    <img src={interiorImage} alt="مشهد داخلي داعم لتجربة مول البستان" className="h-full w-full object-cover object-center" loading="lazy" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="space-y-0 md:hidden">
        <section className="page-section pt-5">
          <div className="container">
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="section-kicker">الخريطة التفاعلية</p>
                <h2 className="section-title max-w-[18rem]">ابدأ من الدليل مباشرة.</h2>
                <p className="max-w-[20rem] text-sm leading-6 text-muted-foreground">الدور، الوحدة، والحالة كلها ظاهرة مباشرة قبل الدخول إلى الدليل الكامل.</p>
              </div>
              <MapTeaserPreview />
            </div>
          </div>
        </section>

        <section className="page-section py-7">
          <div className="container">
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="section-kicker">الفئات الرئيسية</p>
                <h2 className="section-title max-w-[18rem]">ابدأ من فئة واضحة.</h2>
              </div>
              <Collapsible className="space-y-2.5">
                {categoryStories.slice(0, 3).map((category, index) => (
                  <div key={category.key} className="editorial-panel rounded-[1.1rem] p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="icon-shell h-10 w-10 p-2.5"><category.icon className="h-5 w-5" /></div>
                        <div>
                          <h3 className="text-base font-bold text-foreground">{category.name}</h3>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">{mobileCategorySummaries[category.key]}</p>
                        </div>
                      </div>
                      <span className="text-[0.72rem] font-semibold text-muted-foreground">0{index + 1}</span>
                    </div>
                  </div>
                ))}
                <CollapsibleContent className="space-y-2.5">
                  {categoryStories.slice(3).map((category, index) => (
                    <div key={category.key} className="editorial-panel rounded-[1.1rem] p-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="icon-shell h-10 w-10 p-2.5"><category.icon className="h-5 w-5" /></div>
                          <div>
                            <h3 className="text-base font-bold text-foreground">{category.name}</h3>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">{mobileCategorySummaries[category.key]}</p>
                          </div>
                        </div>
                        <span className="text-[0.72rem] font-semibold text-muted-foreground">0{index + 4}</span>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
                <CollapsibleTrigger asChild>
                  <Button variant="secondary" className="h-10 w-full rounded-[1rem]">عرض باقي الفئات</Button>
                </CollapsibleTrigger>
              </Collapsible>
            </div>
          </div>
        </section>

        <section className="section-soft page-section py-7">
          <div className="container">
            <div className="section-shell rounded-[1.45rem] px-4 py-4">
              <div className="space-y-3">
                <p className="section-kicker">التأجير والوحدات</p>
                <h2 className="section-title max-w-[18rem]">وحدات مرتبطة بالدليل نفسه.</h2>
                <p className="max-w-[21rem] text-sm leading-6 text-muted-foreground">ابدأ من المصدر نفسه ثم انتقل مباشرة إلى الاستفسار التجاري.</p>
                <div className="space-y-2">
                  {[
                    "حالة كل وحدة واضحة داخل الدليل.",
                    "التحويل إلى الاستفسار يتم مباشرة.",
                  ].map((item) => (
                    <div key={item} className="editorial-panel flex min-h-[2.9rem] items-center rounded-[1rem] px-3.5 py-2.5 text-sm text-foreground/90">{item}</div>
                  ))}
                </div>
                <div className="grid gap-2.5">
                  {homepageLeasingUnits.slice(0, 2).map((unit) => (
                    <Link key={unit.unit_id} to="/map" className="editorial-panel flex min-h-[6rem] flex-col rounded-[1.15rem] p-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-lg font-bold text-foreground">وحدة {unit.unit_id}</p>
                        <span className="rounded-full border border-orange/25 bg-orange/10 px-2.5 py-1 text-[0.7rem] font-semibold text-orange">متاحة</span>
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
                <Link to="/leasing"><Button variant="orange" className="h-11 w-full rounded-[1rem]">افتح صفحة التأجير</Button></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section py-7">
          <div className="container">
            <div className="section-shell rounded-[1.45rem] px-4 py-4">
              <div className="space-y-3">
                <p className="section-kicker">داخل المول</p>
                <h2 className="section-title max-w-[18rem]">مسار أوضح داخل الزيارة.</h2>
                <p className="max-w-[21rem] text-sm leading-6 text-muted-foreground">تنظيم داخلي يساعد على الوصول الأسرع للفئات والمتاجر داخل المول.</p>
                <div className="image-shell aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-border/80 bg-card">
                  <img src={interiorImage} alt="مشهد داخلي من مول البستان" className="h-full w-full object-cover object-center" loading="lazy" />
                </div>
                <div className="grid gap-2">
                  <div className="editorial-panel rounded-[1rem] px-3.5 py-3 text-sm text-foreground">مشهد داخلي متوازن يدعم العرض الواضح.</div>
                  <div className="editorial-panel rounded-[1rem] px-3.5 py-3 text-sm text-foreground">حركة أسهل بين الفئات والمتاجر من أول نظرة.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section py-7">
          <div className="container">
            <div className="section-shell rounded-[1.3rem] px-4 py-4">
              <div className="space-y-2.5">
                <p className="section-kicker">لماذا مول البستان</p>
                <h2 className="section-title max-w-[16rem]">هوية تقنية أوضح.</h2>
                <p className="max-w-[20rem] text-sm leading-6 text-muted-foreground">المشروع يجمع الفئات الأساسية في مسار أقصر ويمنح النشاط التجاري حضورًا أوضح.</p>
                <div className="grid gap-2">
                  {benefitChips.slice(0, 2).map((item) => (
                    <div key={item} className="mini-chip h-[2.7rem] justify-start rounded-[0.95rem] px-3.5 py-0 text-[0.76rem]">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="hidden page-section pt-6 md:block md:pt-12 lg:pt-14">
        <div className="container">
          <div className="grid gap-3 lg:grid-cols-[0.84fr_1.16fr] lg:items-start lg:gap-4">
            <div className="space-y-2.5 lg:order-2 lg:space-y-3">
              <div className="chapter-shell pt-4 md:pt-5">
                <p className="section-kicker">لماذا مول البستان</p>
                <h2 className="section-title max-w-[35rem]">وجهة تقنية بهوية واضحة وتجربة زيارة أهدأ.</h2>
              </div>
              <p className="max-w-[24rem] text-sm leading-6 text-muted-foreground md:max-w-[29rem] md:text-lg md:leading-7">
                المشروع يجمع الفئات الأساسية في مسار أقصر للزائر ويمنح النشاط التجاري حضورًا أوضح داخل المول.
              </p>
              <div className="grid gap-1.5 sm:grid-cols-2 md:gap-2.5">
                {benefitChips.map((item) => (
                  <div key={item} className="mini-chip h-[2.55rem] justify-start rounded-[0.95rem] px-3 py-0 text-[0.72rem] md:h-[2.9rem] md:rounded-[1rem] md:px-4 md:text-sm">{item}</div>
                ))}
              </div>
            </div>
            <div className="hidden gap-2 md:grid md:grid-cols-3 md:gap-2.5 lg:order-1">
              {whyCards.map((card, index) => (
                <motion.div key={card.title} custom={index} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="editorial-panel h-full rounded-[1.15rem] p-3.5 md:rounded-[1.3rem] md:p-4">
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <card.icon className="icon-shell h-9 w-9 shrink-0 p-2 md:h-10 md:w-10 md:p-2.5" />
                      <div>
                        <h3 className="text-[0.98rem] font-bold text-foreground md:text-lg">{card.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{card.desc}</p>
                      </div>
                    </div>
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

      <section className="hidden section-soft page-section md:block">
        <div className="container">
          <div className="section-shell page-shell grid gap-4 overflow-hidden lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-5">
            <div className="order-2 space-y-3 lg:order-1 lg:max-w-[32rem] lg:space-y-4">
              <p className="section-kicker">داخل المول</p>
              <h2 className="section-title">تنظيم معماري يعطي الزيارة مسارًا أوضح.</h2>
              <p className="text-sm leading-6 text-muted-foreground md:text-lg md:leading-7">
                من الأتريوم إلى مسارات الحركة، التجربة مصممة لتسهيل الاستكشاف والعرض داخل بيئة تقنية واضحة.
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2 md:gap-3">
                <div className="editorial-panel rounded-[1.15rem] p-4 md:rounded-[1.35rem] md:p-5">
                  <p className="text-base font-bold text-foreground">مشهد داخلي متوازن</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">التوزيع الداخلي يدعم العرض ويقلل التشويش البصري.</p>
                </div>
                <div className="editorial-panel rounded-[1.15rem] p-4 md:rounded-[1.35rem] md:p-5">
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
                <div className="image-shell hidden aspect-[3/4] overflow-hidden rounded-[1.6rem] border border-border/80 bg-card lg:block">
                  <img src={facadeImage} alt="تفصيل معماري داعم لهوية مول البستان" className="h-full w-full object-cover object-center" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden page-section py-8 md:block md:py-12 lg:py-14">
        <div className="container">
          <div className="chapter-shell mb-4 max-w-[34rem] pt-4 md:pt-5">
            <p className="section-kicker">الفئات الرئيسية</p>
            <h2 className="section-title">ابدأ من الفئة الأقرب لاحتياجك.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground md:mt-2.5 md:text-lg md:leading-7">ست فئات أساسية غير متداخلة تساعدك تفهم طبيعة المول بسرعة.</p>
          </div>
          <div className="hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
            {categoryStories.map((category, index) => (
              <motion.div key={category.key} custom={index} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                 <div className="editorial-panel flex min-h-[10.25rem] h-full flex-col rounded-[1.35rem] p-4.5 transition-colors duration-200 hover:border-primary/35">
                  <div className="mb-2.5 flex items-center justify-between gap-3">
                    <div className="icon-shell h-12 w-12 p-3"><category.icon className="h-6 w-6" /></div>
                    <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground md:text-xl">{category.name}</h3>
                   <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">{category.desc}</p>
                  <div className="mt-auto pt-3">
                    <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-[0.72rem] font-semibold text-muted-foreground">{category.supportLabel}</span>
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

      <section className="hidden section-soft page-section py-8 md:block md:py-12 lg:py-14">
        <div className="container">
          <div className="grid gap-3 overflow-hidden lg:section-shell lg:page-shell lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-4">
            <div className="order-2 space-y-2.5 lg:max-w-[29rem] lg:order-2 lg:space-y-3.5">
              <p className="section-kicker">الخريطة التفاعلية</p>
              <h2 className="section-title">الدليل التفاعلي هو المنتج الأساسي هنا.</h2>
              <p className="max-w-[21rem] text-sm leading-6 text-muted-foreground md:text-lg md:leading-7">الدور، الوحدة، والحالة كلها ظاهرة مباشرة قبل الدخول إلى الدليل الكامل.</p>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
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
            <div className="order-1 lg:order-1">
              <MapTeaserPreview />
            </div>
          </div>
        </div>
      </section>

      <section className="hidden page-section py-8 md:block md:py-12 lg:py-14">
        <div className="container">
           <div className="section-shell page-shell grid gap-3.5 overflow-hidden lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-4">
             <div className="space-y-3 lg:max-w-[30rem] lg:space-y-3.5">
              <p className="section-kicker">التأجير والوحدات</p>
              <h2 className="section-title">التأجير هنا قرار تجاري أوضح وأسرع.</h2>
              <p className="text-sm leading-6 text-muted-foreground md:text-lg md:leading-7">الوحدات المعروضة هنا مرتبطة مباشرة ببيانات الخريطة نفسها، لتبدأ الاستفسار من مصدر واحد واضح.</p>
                <div className="space-y-2">
                {[
                  "وحدات معروضة بحالة واضحة داخل الخريطة.",
                  "فهم أسرع لموقع الوحدة داخل الدور.",
                  "تحويل مباشر من الاستكشاف إلى الاستفسار التجاري.",
                ].map((item) => (
                    <div key={item} className="editorial-panel flex min-h-[3rem] items-center rounded-[1rem] px-3.5 py-2.5 text-sm text-foreground/90 md:min-h-[3.2rem] md:rounded-[1.2rem] md:px-4 md:py-3 md:text-base">{item}</div>
                ))}
              </div>
              <div className="grid gap-2.5 pt-1 sm:grid-cols-2">
                <Link to="/leasing"><Button variant="orange" size="lg" className="h-11 w-full rounded-[1.1rem] px-6">استفسر عن الوحدة</Button></Link>
                <Link to="/map"><Button variant="outline-blue" size="lg" className="h-11 w-full rounded-[1.1rem] px-6">افتح الدليل الكامل</Button></Link>
              </div>
            </div>
             <div className="space-y-2.5 md:space-y-3">
              <div className="editorial-panel rounded-[1.3rem] p-4 md:rounded-[1.6rem] md:p-6">
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
                    <Link key={unit.unit_id} to="/map" className="editorial-panel flex min-h-[6.4rem] flex-col rounded-[1.25rem] p-4 transition-colors hover:border-orange/45">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-lg font-bold text-foreground">وحدة {unit.unit_id}</p>
                        <span className="rounded-full border border-orange/25 bg-orange/10 px-2.5 py-1 text-[0.7rem] font-semibold text-orange">متاحة</span>
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
                      <p className="mt-2 text-xs font-semibold text-muted-foreground">{needCategoryLabels[unit.category]}</p>
                  </Link>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden section-soft page-section py-8 md:block md:py-12 lg:py-14">
        <div className="container">
          <div className="section-shell page-shell grid gap-3 overflow-hidden lg:grid-cols-[0.98fr_1.02fr] lg:items-stretch">
            <div className="space-y-3 lg:order-2">
              <p className="section-kicker">الافتتاح والحملة</p>
              <h2 className="section-title">خطوات قصيرة تسبق يوم الافتتاح.</h2>
              <div className="hidden gap-2.5 sm:grid sm:grid-cols-3 lg:grid-cols-1">
                {launchSteps.map((item, index) => (
                  <div key={item.title} className="editorial-panel min-h-[7.6rem] rounded-[1.3rem] p-4 md:p-4.5">
                    <p className="text-xs font-semibold text-muted-foreground">0{index + 1}</p>
                    <p className="mt-2 text-base font-bold text-foreground">{item.title}</p>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.desc}</p>
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
            <div className="section-shell flex h-full flex-col justify-between rounded-[1.25rem] p-4 md:rounded-[1.55rem] md:p-5.5 lg:order-1">
              <div>
              <div className="flex items-start gap-3">
                <Calendar className="icon-shell h-11 w-11 p-2.5" />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">ملخص الحملة</p>
                  <h3 className="mt-1 text-[1.28rem] font-bold text-foreground md:text-2xl">تابع الموعد وحدد خطوتك التالية قبل الزيارة.</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                 {launchEvent?.description_ar ?? "صفحة الافتتاح تجمع تفاصيل اليوم، والحملة، والخطوات الأساسية للاستفادة من التجربة الترويجية."}
              </p>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
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
              <div className="mt-4 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3 md:mt-5">
                <Link to="/opening-day"><Button variant="outline-blue" size="lg" className="h-11 w-full rounded-[1rem] px-6">تفاصيل الافتتاح</Button></Link>
                <Link to="/spin-win"><Button variant="cta" size="lg" className="h-11 w-full rounded-[1rem] px-6">جرّب أدر واربح</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="marketplace" className="hidden page-section py-8 md:block md:py-10 lg:py-12">
        <div className="container">
             <div className="brand-shell page-shell rounded-[1.85rem] py-5">
              <div className="grid gap-3 lg:grid-cols-[1.22fr_0.78fr] lg:items-center">
               <div className="space-y-3">
                <p className="section-kicker">الامتداد الرقمي</p>
                 <h2 className="section-title">مرحلة لاحقة بعد تثبيت تجربة الدليل والمتاجر.</h2>
                 <p className="max-w-[33rem] text-base leading-7 text-muted-foreground md:text-lg">
                    الامتداد الرقمي يظل مؤجلًا ومضغوطًا حتى تبقى الخريطة والمتاجر هما مركز المنتج الآن.
                </p>
                 <div className="rounded-[1.2rem] border border-border bg-card px-4 py-3 text-sm leading-7 text-muted-foreground">
                   الترتيب المنطقي الآن: الخريطة أولًا، المتاجر ثانيًا، ثم أي امتداد رقمي لاحقًا دون تشتيت المسار الأساسي.
                 </div>
              </div>
                <div className="editorial-panel rounded-[1.45rem] p-5 lg:mr-auto lg:max-w-[17rem]">
                <Store className="icon-shell h-12 w-12 p-3" />
                 <h3 className="mt-4 text-xl font-bold text-foreground">التركيز الآن على المنتج الأساسي</h3>
                 <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">ابدأ بالمتاجر الحالية والدليل قبل أي طبقة إضافية لاحقة.</p>
                 <Link to="/stores" className="mt-4 block"><Button variant="secondary" className="h-11 w-full rounded-[1rem]">استعرض المتاجر الحالية</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section pt-7 md:pt-10">
        <div className="container max-w-5xl">
          <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div className="chapter-shell pt-4 md:pt-5">
              <p className="section-kicker">الأسئلة الشائعة</p>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                <HelpCircle className="ml-2 inline-block h-7 w-7 text-accent" />
                إجابات سريعة قبل زيارتك الأولى
              </h2>
                <p className="mt-2 max-w-[19rem] text-sm leading-6 text-muted-foreground md:mt-3 md:max-w-none md:text-lg md:leading-7">إجابات مختصرة للأسئلة الأهم قبل الزيارة الأولى.</p>
              <Link to="/faq" className="mt-3 inline-flex md:mt-5"><Button variant="ghost" className="text-primary">عرض جميع الأسئلة</Button></Link>
            </div>
            <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-2 md:space-y-3">
              {faqItems.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="section-shell overflow-hidden rounded-[1.1rem] px-4 md:rounded-[1.25rem] md:px-5">
                  <AccordionTrigger className="min-h-[3.85rem] py-3 text-right text-sm font-semibold text-foreground hover:text-primary md:min-h-[4.25rem] md:py-4 md:text-base">
                    {faq.question_ar}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm leading-6 text-muted-foreground md:pb-5 md:text-base md:leading-7">
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