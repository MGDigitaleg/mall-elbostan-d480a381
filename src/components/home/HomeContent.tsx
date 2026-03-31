import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Building, Calendar, Gamepad2, Gift, HelpCircle, Layers3, MapPin, Monitor, Printer, Shield, ShoppingBag, Smartphone, Sparkles, Store, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImage from "@/assets/mall-exterior.jpg";
import interiorImage from "@/assets/mall-interior.jpg";
import facadeImage from "@/assets/mall-facade.jpg";

const heroStatements = ["وجهة تقنية متخصصة", "خريطة ومتاجر واضحة", "افتتاح وجوائز وسوق قادم"];

const categoryStories = [
  { name: "الهواتف والإكسسوارات", icon: Smartphone, desc: "أجهزة وإكسسوارات وحلول سريعة لجمهور التقنية اليومي." },
  { name: "الكمبيوتر والأجهزة", icon: Monitor, desc: "حلول للعمل والدراسة وصناعة المحتوى في مساحة استكشاف أوضح." },
  { name: "الألعاب والترفيه", icon: Gamepad2, desc: "فئة لها جمهورها الواضح ومكانها الطبيعي جوه منظومة تقنية متخصصة." },
  { name: "الطباعة والتصوير", icon: Printer, desc: "احتياجات عملية للشركات والطلبة والمكاتب جوه وجهة واحدة." },
  { name: "الشبكات والحماية", icon: Shield, desc: "حلول بنية تحتية وأمان تقني بشكل أكثر احترافية." },
  { name: "الصيانة والدعم الفني", icon: Wrench, desc: "خدمات ما بعد الشراء والدعم السريع كجزء من التجربة." },
];

const whyCards = [
  { icon: Monitor, title: "المول معمول للتقنية من الأساس", desc: "مش تجميعة محلات وخلاص، لكن مكان له منطق واضح للناس اللي بتدور على أجهزة وخدمات متخصصة." },
  { icon: MapPin, title: "موقع يخدم الحركة والطلب", desc: "قربه من القاهرة الجديدة ومدينتي والرحاب يخلي الزيارة أسهل والحضور التجاري أقوى." },
  { icon: Sparkles, title: "إطلاق يبني الترقب بذوق", desc: "حملة الافتتاح والجوائز معمولة بحس تجاري أهدى يخلّي الناس متحمسة من غير ضجيج." },
];

const launchJourney = [
  { title: "اعرف قبل ما تنزل", desc: "شوف الخريطة والمتاجر والبرنامج المبدئي علشان تبقى شايف الصورة كاملة." },
  { title: "شارك في الجوائز", desc: "ادخل حملة أدر واربح واحتفظ بالنتيجة علشان تكون جاهز ليوم الافتتاح." },
  { title: "تعالى في الموعد", desc: "احضر الافتتاح واستفد من الجو والفعاليات والفرصة الحقيقية إنك تعيش العلامة على أرض الواقع." },
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
      <section className="relative overflow-hidden pb-16 pt-2 md:pb-22 md:pt-4">
        <div className="editorial-grid absolute inset-0 opacity-40" />
        <div className="page-halo absolute inset-0" />
        <div className="container relative">
          <div className="brand-shell relative grid items-center gap-8 overflow-hidden rounded-[3rem] px-6 py-7 md:px-8 md:py-9 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:px-10 lg:py-10">
            <div className="space-y-6 lg:py-6">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <div className="eyebrow-chip mb-5">
                  <Sparkles className="h-4 w-4 text-accent" />
                  افتتاح قريب • مايو 2026 • وجهة تقنية راقية في شرق القاهرة
                </div>
                <h1 className="max-w-3xl text-4xl font-black leading-[1.04] text-foreground md:text-[4.35rem]">
                  مول البستان
                  <span className="mt-4 block text-[1.9rem] font-semibold leading-[1.25] text-foreground/88 md:text-[2.7rem]">
                    مول تقني راقٍ بيجمع المتاجر، الخريطة، فرص التأجير، حملة الجوائز، والسوق الجاي تحت هوية واحدة واضحة
                  </span>
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  من أول نظرة هتفهم الصورة كاملة: مشروع تقني حقيقي، افتتاح قريب، حملة جوائز معمولة بذوق، فرص تجارية واضحة، وتمهيد طبيعي لسوق رقمي يكمل علاقة الزائر بالمتاجر بعدين.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.45 }} className="flex flex-wrap gap-3">
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

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.45 }} className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                <div className="section-shell rounded-[1.9rem] p-5 md:p-6">
                  <p className="mb-4 text-sm font-semibold text-muted-foreground">فاضل على الافتتاح</p>
                  <CountdownTimer />
                </div>
                <div className="grid gap-4">
                  {[
                    { label: "أقرب خطوة", value: "استكشف الخريطة والمتاجر" },
                    { label: "فرصة تجارية", value: "استفسر عن الوحدات المتاحة" },
                    { label: "المرحلة الجاية", value: "Marketplace by Mall Elbostan" },
                  ].map((item) => (
                    <div key={item.label} className="editorial-panel rounded-[1.4rem] p-4">
                      <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">{item.label}</p>
                      <p className="mt-2 text-base font-bold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="relative mx-auto w-full max-w-[39rem]">
              <div className="section-shell overflow-hidden rounded-[2.5rem] p-3 shadow-[var(--shadow-elevated)]">
                <div className="image-shell aspect-[4/5] overflow-hidden rounded-[2rem] bg-card lg:aspect-[5/6]">
                  <img src={heroImage} alt="الواجهة الرئيسية لمول البستان بتصميم معماري حديث" className="h-full w-full object-cover object-[center_36%]" />
                  <div className="image-wash absolute inset-0" />
                </div>
                <div className="glass absolute inset-x-7 bottom-7 rounded-[1.7rem] p-5 md:inset-x-9 md:bottom-9 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Mall Elbostan</p>
                      <p className="mt-2 text-xl font-bold text-foreground">واجهة معمارية تدي المشروع حضور يبان من أول لحظة</p>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">صورة تخلّي الفكرة ملموسة: مكان حقيقي جاهز يبني ثقة الزائر ويقوّي حضور العلامات التجارية.</p>
                    </div>
                    <Layers3 className="mt-1 h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>

              <div className="section-shell absolute -left-6 top-10 hidden w-64 overflow-hidden rounded-[1.9rem] p-3 lg:block">
                <div className="image-shell mb-3 aspect-[4/3] rounded-[1.2rem]">
                  <img src={interiorImage} alt="الأتريوم الداخلي لمول البستان" className="h-full w-full object-cover object-center" />
                </div>
                <p className="text-sm font-bold text-foreground">تجربة داخلية متعددة المستويات</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">مشهد داخلي يوضح إن التجربة جوه المول بنفس قوة الانطباع الخارجي.</p>
              </div>

              <div className="section-shell absolute -right-6 bottom-16 hidden w-60 rounded-[1.9rem] p-5 lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Marketplace by Mall Elbostan</p>
                <p className="mt-3 text-base font-bold text-foreground">سوق قادم يكمّل التجربة بعد الزيارة</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">امتداد رقمي طبيعي يخلي علاقتك بالمتاجر مستمرة حتى بعد ما تمشي.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-18">
        <div className="container">
          <div className="mb-10 grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div className="chapter-shell pt-5">
              <p className="section-kicker">لماذا مول البستان</p>
              <h2 className="section-title">ليه مول البستان أقرب لفكرة علامة تقنية كاملة مش مجرد مكان بيع</h2>
            </div>
            <div className="space-y-4">
              <p className="text-base leading-8 text-muted-foreground">الفكرة هنا إن المول من البداية بيتقدم كمنظومة: فئات واضحة، حضور معماري، موقع يخدم شرق القاهرة، وإطلاق يخلي الناس عايزة تتابع وتزور وتشارك.</p>
              <Link to="/about" className="inline-flex"><Button variant="ghost" className="text-primary">اعرف حكاية المشروع</Button></Link>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="section-shell h-full rounded-[2.2rem] p-7 md:p-8">
              <p className="text-sm font-semibold text-muted-foreground">قيمة المشروع</p>
              <h3 className="mt-3 max-w-xl text-3xl font-bold text-foreground">مكان يخلي التقنية تظهر بشكل أرتب وأقوى للزائر والعلامة معًا</h3>
              <p className="mt-4 text-base leading-8 text-muted-foreground">مول البستان بيقدّم التقنية في صورة أوضح: فئات متقسمة صح، خريطة مفهومة، حضور معماري يثبت العلامة، وخطة إطلاق تخلّي التجربة من أولها فيها سبب للزيارة والرجوع.</p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {["خريطة تسهّل الاستكشاف قبل ما تنزل.", "حضور بصري وتجاري أقوى للعلامات.", "صفحات مبنية علشان تدفع الخطوة المهمة بسرعة.", "سوق قادم يكمل نفس الهوية بعد الافتتاح."].map((item) => (
                  <div key={item} className="mini-chip min-h-14 justify-start rounded-[1rem]">{item}</div>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              {whyCards.map((feature, i) => (
                <motion.div key={feature.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="editorial-panel rounded-[1.8rem] p-6 transition-transform duration-300 hover:-translate-y-1">
                    <feature.icon className="icon-shell mb-4 h-11 w-11 p-2.5" />
                    <h3 className="mb-3 text-lg font-bold text-foreground">{feature.title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft py-12 md:py-18">
        <div className="container">
          <div className="section-shell grid gap-6 overflow-hidden px-6 py-6 md:px-8 md:py-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="order-2 space-y-5 lg:order-1">
              <p className="section-kicker">داخل المول</p>
              <h2 className="section-title">من جوه، التجربة شكلها يثبت إن المشروع معمول علشان يبقى حاضر ومقنع</h2>
              <p className="text-base leading-8 text-muted-foreground">الصورة الداخلية هنا مش مجرد تجميل. هي دليل إن المكان متفكّر فيه كويس: حركة واضحة، مستويات متعددة، ومساحات تدي فرصة أفضل للعرض والظهور والحضور التجاري.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="editorial-panel rounded-[1.5rem] p-5"><p className="mb-1 text-sm font-semibold text-foreground">شكل معماري يثبت الفكرة</p><p className="text-sm leading-7 text-muted-foreground">أتريوم واضح ومرتب يدي للمشروع شخصية قوية وسهلة التذكّر.</p></div>
                <div className="editorial-panel rounded-[1.5rem] p-5"><p className="mb-1 text-sm font-semibold text-foreground">عرض وحركة أريح</p><p className="text-sm leading-7 text-muted-foreground">المساحات بتخدم المتاجر والأنشطة بشكل أهدى وأوضح للزائر.</p></div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative grid gap-4 lg:grid-cols-[1fr_0.44fr]">
                <div className="image-shell aspect-[16/11] overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[var(--shadow-elevated)]">
                  <img src={interiorImage} alt="الأتريوم الداخلي متعدد الطوابق في مول البستان" className="h-full w-full object-cover object-center" />
                  <div className="image-wash absolute inset-0" />
                </div>
                <div className="editorial-panel flex flex-col justify-between rounded-[1.8rem] p-5">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">الطابع الداخلي</p>
                    <p className="mt-2 text-xl font-bold text-foreground">أكثر من مستوى يخلي المشهد حي ومقنع</p>
                  </div>
                  <div className="image-shell mt-4 aspect-[3/4] overflow-hidden rounded-[1.4rem]"><img src={facadeImage} alt="لقطة معمارية داعمة لهوية مول البستان" className="h-full w-full object-cover object-center" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-18">
        <div className="container">
          <div className="chapter-shell mb-10 max-w-3xl pt-5">
            <p className="section-kicker">المتاجر والفئات</p>
            <h2 className="section-title">ابدأ من الفئة اللي تهمك، وشوف إزاي المنظومة دي جاهزة تكبر كمان بعدين</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">الفئات هنا معمولة بشكل عملي وواضح، علشان تسهّل عليك الاستكشاف دلوقتي، وتبقى أساس طبيعي لتجربة Marketplace بعدين.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categoryStories.map((cat, i) => (
              <motion.div key={cat.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to={`/stores?category=${encodeURIComponent(cat.name)}`} className="editorial-panel flex h-full items-start gap-4 rounded-[1.8rem] p-5 transition-transform duration-300 hover:-translate-y-1">
                  <div className="icon-shell h-12 w-12 p-3"><cat.icon className="h-6 w-6" /></div>
                  <div><h3 className="mb-2 text-base font-bold text-foreground">{cat.name}</h3><p className="text-sm leading-7 text-muted-foreground">{cat.desc}</p></div>
                </Link>
              </motion.div>
            ))}
          </div>

          {featuredStores && featuredStores.length > 0 && (
            <div className="mt-12 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div className="section-shell rounded-[2rem] p-6 md:p-7">
                <p className="section-kicker">متاجر مختارة</p>
                <h2 className="text-3xl font-bold text-foreground md:text-4xl">بداية لمجموعة متاجر هتشكّل شخصية المول</h2>
                <p className="mt-4 text-base leading-8 text-muted-foreground">المتاجر دي بتوضح شكل المنظومة اللي المشروع رايح لها: فئات أوضح، حضور أرتب، وتجربة أسهل في الاكتشاف قبل الزيارة وبعدها.</p>
                <Link to="/stores" className="mt-6 inline-flex"><Button variant="ghost" className="text-primary">عرض كل المتاجر</Button></Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {featuredStores.map((store) => (
                  <Link key={store.id} to={`/stores/${store.slug}`} className="editorial-panel rounded-[1.7rem] p-5 transition-transform duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                      {store.logo_url ? <img src={store.logo_url} alt={store.name_ar} className="h-14 w-14 rounded-[1rem] border border-border/60 object-cover" loading="lazy" /> : <div className="icon-shell h-14 w-14 rounded-[1rem] p-4"><Store className="h-6 w-6" /></div>}
                      <div><h3 className="font-bold text-foreground">{store.name_ar}</h3>{store.category ? <p className="text-sm text-accent">{store.category}</p> : null}</div>
                    </div>
                    {store.short_description_ar ? <p className="mt-4 text-sm leading-7 text-muted-foreground">{store.short_description_ar}</p> : null}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section-soft py-12 md:py-18">
        <div className="container">
          <div className="section-shell grid gap-6 overflow-hidden px-6 py-6 md:px-8 md:py-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div className="space-y-5">
              <p className="section-kicker">الافتتاح قريبًا</p>
              <h2 className="section-title">افتتاح معمول علشان الناس تتحمس، تفهم، وتشارك بخطوات واضحة</h2>
              <p className="text-base leading-8 text-muted-foreground">الفكرة مش ضجيج دعائي. الفكرة إن الزائر يلاقي رحلة واضحة: يعرف الافتتاح إمتى، يشارك في الجوائز، وييجي وهو فاهم هيلاقي إيه جوه المول.</p>
              <div className="space-y-3">
                {launchJourney.map((item, index) => (
                  <div key={item.title} className="editorial-panel rounded-[1.5rem] px-4 py-4">
                    <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">0{index + 1}</p>
                    <p className="mt-3 text-base font-bold text-foreground">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/opening-day"><Button variant="outline-blue" size="lg" className="rounded-xl px-7">شوف تفاصيل الافتتاح</Button></Link>
                <Link to="/spin-win"><Button variant="cta" size="lg" className="rounded-xl px-7">جرّب أدر واربح</Button></Link>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="section-shell rounded-[1.9rem] p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <Gift className="icon-shell h-11 w-11 p-2.5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">الجوائز والمكافآت</p>
                    <h3 className="text-2xl font-bold text-foreground">حملة جوائز شكلها راقٍ وطريقتها سهلة</h3>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {["نتيجتك بتظهر فورًا وتحتفظ بيها بسهولة.", "الاستفادة مرتبطة بالحضور الفعلي وقت الافتتاح.", "الشروط واضحة علشان التجربة تبقى مفهومة من أولها."].map((item, index) => (
                    <div key={item} className="editorial-panel rounded-[1.4rem] p-5">
                      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">0{index + 1}</p>
                      <p className="mt-3 text-sm leading-7 text-foreground/88">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3"><Link to="/reward-terms"><Button variant="ghost" className="text-primary">شروط المكافآت</Button></Link></div>
              </div>

              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="editorial-panel rounded-[1.6rem] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{event.title_ar}</h3>
                          {event.description_ar ? <p className="mt-2 text-sm leading-7 text-muted-foreground">{event.description_ar}</p> : null}
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

      <section className="py-12 md:py-18">
        <div className="container">
          <div className="section-shell grid gap-6 overflow-hidden px-6 py-6 md:px-8 md:py-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
            <div>
              <div className="image-shell aspect-[16/11] overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[var(--shadow-elevated)]">
                <img src={facadeImage} alt="واجهة مول البستان الخارجية في وقت الغروب" className="h-full w-full object-cover object-center" />
                <div className="image-wash absolute inset-0" />
              </div>
            </div>
            <div className="space-y-5">
              <p className="section-kicker">التأجير والوحدات</p>
              <h2 className="section-title">لو بتفكر في وجود قوي داخل المول، دي بداية واضحة ومحترمة</h2>
              <p className="text-base leading-8 text-muted-foreground">سواء أنت علامة تقنية أو نشاط مكمل، الصفحة دي بتوضح الفكرة بسرعة: إيه المتاح، فين مكانه، وإزاي تبدأ استفسار من غير لف ودوران.</p>
              <div className="space-y-3">
                {["وجودك جوه المول يربط نشاطك بجمهور جاي أصلًا للتقنية.", "الخريطة والوحدات المتاحة بتتقدّم بشكل أوضح قبل القرار.", "الافتتاح نفسه جزء من الزخم التجاري لأي علامة تدخل بدري."].map((item) => (
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

      <section id="marketplace" className="section-soft py-12 md:py-18">
        <div className="container">
          <div className="brand-shell rounded-[2.6rem] p-6 md:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
              <div>
                <p className="section-kicker">Marketplace by Mall Elbostan</p>
                <h2 className="section-title">المرحلة الجاية من مول البستان: سوق رقمي من نفس عالم المتاجر</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">Marketplace by Mall Elbostan مش إضافة جانبية، لكنه خطوة منطقية بعد بناء التجربة داخل المول. بعدين هتقدر تتصفح منتجات متاجرك المفضلة، تتابع الجديد، وتكمل الشراء من نفس المنظومة.</p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {["ابدأ من تجربة الزيارة والخريطة والمتاجر.", "كوّن علاقة حقيقية مع العلامات اللي بتهمك.", "بعدها يبقى السوق الرقمي امتداد طبيعي لنفس العالم."].map((item, index) => (
                    <div key={item} className="editorial-panel rounded-[1.4rem] px-4 py-4">
                      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">0{index + 1}</p>
                      <p className="mt-3 text-sm font-semibold text-foreground/88">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="editorial-panel rounded-[2rem] p-6 text-center shadow-[var(--shadow-soft)] lg:mr-auto lg:w-[360px]">
                <ShoppingBag className="mx-auto h-10 w-10 text-primary" />
                <p className="mt-4 text-lg font-bold text-foreground">سوق رقمي متصل بالمتاجر الحالية</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">مرحلة جاية من نفس الرؤية، علشان العلاقة بين الزائر والمتجر تفضل مستمرة من غير ما تبدأ من جديد.</p>
                <Link to="/stores" className="mt-5 block"><Button variant="secondary" className="w-full rounded-xl">ابدأ من المتاجر الحالية</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-18">
        <div className="container max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="chapter-shell pt-5">
              <p className="section-kicker">الأسئلة الشائعة</p>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl"><HelpCircle className="ml-2 inline-block h-7 w-7 text-accent" />أسئلة ناس كتير بتسألها قبل الافتتاح</h2>
              <p className="mt-4 max-w-md text-base leading-8 text-muted-foreground">إجابات سريعة وواضحة تساعدك تفهم المشروع أحسن وتعرف الخطوة اللي تهمك من غير تعقيد.</p>
              <Link to="/faq" className="mt-6 inline-flex"><Button variant="ghost" className="text-primary">عرض جميع الأسئلة<ArrowLeft className="h-4 w-4" /></Button></Link>
            </div>
            {faqs && faqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq) => (
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