import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Building, Calendar, Gamepad2, Gift, HelpCircle, Layers3, MapPin, Monitor, Printer, Shield, ShoppingBag, Smartphone, Sparkles, Store, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImage from "@/assets/mall-exterior.jpg";
import interiorImage from "@/assets/mall-interior.jpg";
import facadeImage from "@/assets/mall-facade.jpg";

const heroChips = ["وجهة تقنية متخصصة", "حملة افتتاحية وجوائز", "Marketplace by Mall Elbostan"];

const heroStats = [
  { label: "الافتتاح", value: "مايو 2026" },
  { label: "الخطوة الأولى", value: "الخريطة والمتاجر" },
  { label: "المرحلة الجاية", value: "تجربة Marketplace" },
];

const featurePillars = [
  {
    icon: Monitor,
    title: "وجهة معمولة للتقنية من الأساس",
    desc: "مش تجميعة محلات وخلاص، لكن مكان واضح الهوية للناس اللي رايحة تدور على أجهزة وحلول وخدمة متخصصة.",
  },
  {
    icon: MapPin,
    title: "موقع يخدم شرق القاهرة بوضوح",
    desc: "قريب من القاهرة الجديدة ومدينتي والرحاب، وده يديه قيمة حقيقية للزيارة والحضور التجاري طوال الأسبوع.",
  },
  {
    icon: Store,
    title: "فئات ومتاجر متنسقة صح",
    desc: "تنظيم الفئات عامل التجربة أسهل للزائر، وفي نفس الوقت بيجهّز المنظومة لسوق إلكتروني بعدين.",
  },
  {
    icon: Sparkles,
    title: "افتتاح فيه حماس بس بذوق",
    desc: "الجوائز والأنشطة هنا جزء من إطلاق محسوب يخلّي الناس متحمسة من غير ما الإحساس يبقى صاخب أو طفولي.",
  },
];

const categories = [
  { name: "الهواتف والإكسسوارات", icon: Smartphone },
  { name: "الكمبيوتر والأجهزة", icon: Monitor },
  { name: "الألعاب والترفيه", icon: Gamepad2 },
  { name: "الطباعة والتصوير", icon: Printer },
  { name: "الشبكات والحماية", icon: Shield },
  { name: "الصيانة والدعم الفني", icon: Wrench },
];

const launchHighlights = [
  "يوم الافتتاح معمول كحدث واضح ومتحضر، مش مجرد إعلان تقليدي وخلاص.",
  "المشاركة في الجوائز سهلة ومفهومة من أول خطوة لحد الاستفادة يوم الافتتاح.",
  "التجربة كلها بتربط بين الزيارة، المتاجر، والجو العام اللي هيبدأ مع الافتتاح.",
];

const campaignJourney = [
  "شوف الخريطة والمتاجر قبل ما تنزل.",
  "ادخل حملة الجوائز واحتفظ بالنتيجة.",
  "تعالى يوم الافتتاح واستفيد من الأجواء والأنشطة المعلنة.",
];

const marketplaceFeatures = [
  "Coming soon",
  "Online shopping experience",
  "Browse products from your favorite tech stores",
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
  featuredStores: Array<{
    id: string;
    name_ar: string;
    category: string | null;
    slug: string;
    logo_url: string | null;
    short_description_ar: string | null;
  }>;
  upcomingEvents: Array<{
    id: string;
    title_ar: string;
    description_ar: string | null;
    image_url: string | null;
    event_date: string | null;
  }>;
};

export function HomeContent({ faqs, featuredStores, upcomingEvents }: HomeContentProps) {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-2 md:pb-24 md:pt-4">
        <div className="editorial-grid absolute inset-0 opacity-50" />
        <div className="absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.12),transparent_54%)]" />
        <div className="container relative">
          <div className="brand-shell relative grid items-center gap-8 overflow-hidden rounded-[2.8rem] px-6 py-7 md:px-8 md:py-9 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:px-10 lg:py-10">
            <div className="absolute left-10 top-10 hidden h-28 w-28 rounded-full bg-primary/10 blur-3xl lg:block" />
            <div className="absolute bottom-12 right-14 hidden h-24 w-24 rounded-full bg-accent/10 blur-3xl lg:block" />
            <div className="space-y-6 lg:py-6">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <div className="eyebrow-chip mb-5">
                  <Sparkles className="h-4 w-4 text-accent" />
                  افتتاح قريب • مايو 2026 • وجهة تقنية جديدة في شرق القاهرة
                </div>
                <h1 className="max-w-3xl text-4xl font-black leading-[1.08] text-foreground md:text-[4.1rem]">
                  مول البستان
                  <span className="mt-4 block text-[2rem] font-semibold leading-tight text-foreground/88 md:text-[2.65rem]">
                    مول تقني راقٍ بيجمع المتاجر، الخريطة، الافتتاح، فرص التأجير، والسوق الإلكتروني الجاي تحت هوية واحدة واضحة
                  </span>
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  من أول نظرة هتفهم الصورة كاملة: مول بيتركّز على التقنية، افتتاح قريب، حملة جوائز معمولة بذوق، فرص تأجير واضحة،
                  وتمهيد طبيعي لسوق إلكتروني يكمّل تجربة الزيارة بعدين.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.45 }}
                className="flex flex-wrap gap-3"
              >
                {heroChips.map((item) => (
                  <div key={item} className="rounded-full border border-border/75 bg-card/92 px-4 py-2 text-sm font-semibold text-foreground shadow-[var(--shadow-soft)]">
                    {item}
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.45 }}
                className="flex flex-wrap gap-3 pt-1"
              >
                <Link to="/map">
                  <Button variant="cta" size="lg" className="min-w-[190px] rounded-xl px-7">استكشف الخريطة</Button>
                </Link>
                <Link to="/leasing">
                  <Button variant="orange" size="lg" className="min-w-[190px] rounded-xl px-7">استفسر عن الوحدات</Button>
                </Link>
                <Link to="/spin-win">
                  <Button variant="outline-blue" size="lg" className="min-w-[190px] rounded-xl px-7">حملة الجوائز</Button>
                </Link>
                <Link to="/stores">
                  <Button variant="secondary" size="lg" className="min-w-[190px] rounded-xl px-7">المتاجر والسوق القادم</Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.45 }}
                className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]"
              >
                <div className="section-shell rounded-[1.9rem] p-5">
                  <p className="mb-4 text-sm font-semibold text-muted-foreground">فاضل على الافتتاح</p>
                  <CountdownTimer />
                </div>
                <div className="grid gap-4">
                  {heroStats.map((item) => (
                    <div key={item.label} className="soft-card p-4">
                      <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">{item.label}</p>
                      <p className="mt-2 text-base font-bold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55 }}
              className="relative mx-auto w-full max-w-[38rem]"
            >
              <div className="section-shell overflow-hidden rounded-[2.4rem] p-3 shadow-[var(--shadow-elevated)]">
                <div className="image-shell aspect-[4/5] overflow-hidden rounded-[2rem] bg-card lg:aspect-[5/6]">
                  <img src={heroImage} alt="الواجهة الرئيسية لمول البستان بتصميم معماري حديث" className="h-full w-full object-cover object-[center_36%]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/42 via-transparent to-background/12" />
                </div>
                <div className="glass absolute inset-x-7 bottom-7 rounded-[1.7rem] p-5 md:inset-x-9 md:bottom-9 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Mall Elbostan</p>
                      <p className="mt-2 text-xl font-bold text-foreground">واجهة معمارية تدي المشروع حضور يبان من أول لحظة</p>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">صورة تخلّي فكرة المول ملموسة: مكان حقيقي جاهز يبني ثقة الزائر ويقوّي حضور العلامات.</p>
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
                <p className="mt-3 text-base font-bold text-foreground">سوق إلكتروني قادم يكمّل التجربة بعد الزيارة</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">امتداد رقمي طبيعي يخلي علاقتك بالمتاجر مستمرة حتى بعد ما تمشي.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container">
          <div className="mb-10 grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div className="chapter-shell pt-5">
              <p className="section-kicker">لماذا مول البستان</p>
              <h2 className="section-title">ليه مول البستان ممكن يبقى علامة أقوى من مجرد مول تقني تقليدي</h2>
            </div>
            <div className="space-y-4">
              <p className="text-base leading-8 text-muted-foreground">
                الفكرة هنا إن المول من البداية بيتقدم كمنظومة: فئات واضحة، حضور معماري، موقع يخدم شرق القاهرة، وحملة افتتاح تخلي
                الناس عايزة تتابع وتزور وتشارك. كل جزء في الصفحة معمول علشان يوضح ده من غير زحمة أو تكرار.
              </p>
              <Link to="/about" className="inline-flex">
                <Button variant="ghost" className="text-primary">اعرف حكاية المشروع</Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            {featurePillars.map((feature, i) => (
              <motion.div key={feature.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={i === 0 ? "lg:row-span-2" : undefined}>
                <div className={`section-shell h-full transition-transform duration-300 hover:-translate-y-1 ${i === 0 ? "rounded-[2rem] p-7" : "rounded-[1.8rem] p-6"}`}>
                  <feature.icon className="mb-4 h-10 w-10 text-primary" />
                  <h3 className={`${i === 0 ? "text-2xl" : "text-lg"} mb-3 font-bold text-foreground`}>{feature.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-soft py-12 md:py-20">
        <div className="container">
          <div className="section-shell grid gap-6 overflow-hidden px-6 py-6 md:px-8 md:py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 space-y-5 lg:order-1"
            >
              <p className="section-kicker">داخل المول</p>
              <h2 className="section-title">من جوه، المول شكله فعلاً يدي ثقة ويخلي التجربة أرقى</h2>
              <p className="text-base leading-8 text-muted-foreground">
                الصورة الداخلية هنا مش مجرد تجميل. هي دليل إن المكان متفكّر فيه كويس: حركة واضحة، مستويات متعددة، ومساحات تدي
                فرصة أفضل للعرض والظهور والبيع.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="soft-card rounded-[1.4rem] p-5">
                  <p className="mb-1 text-sm font-semibold text-foreground">شكل معماري يثبت الفكرة</p>
                  <p className="text-sm leading-7 text-muted-foreground">أتريوم واضح ومرتب يدي للمشروع شخصية قوية وسهلة التذكّر.</p>
                </div>
                <div className="soft-card rounded-[1.4rem] p-5">
                  <p className="mb-1 text-sm font-semibold text-foreground">عرض وحركة أريح</p>
                  <p className="text-sm leading-7 text-muted-foreground">المساحات بتخدم المتاجر والأنشطة بشكل أهدى وأوضح للزائر.</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="image-shell aspect-[16/11] overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[var(--shadow-elevated)]">
                <img src={interiorImage} alt="الأتريوم الداخلي متعدد الطوابق في مول البستان" className="h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-background/10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container">
          <div className="chapter-shell mb-10 max-w-3xl pt-5">
            <p className="section-kicker">المتاجر والفئات</p>
            <h2 className="section-title">ابدأ من الفئة اللي تهمك، وشوف إزاي المنظومة دي جاهزة تكبر بعدين</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              الفئات هنا معمولة بشكل عملي وواضح، علشان تسهّل عليك الاستكشاف دلوقتي، وتبقى أساس طبيعي لتجربة Marketplace بعدين.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to={`/stores?category=${encodeURIComponent(cat.name)}`} className="section-shell flex h-full items-start gap-4 rounded-[1.6rem] p-5 transition-transform duration-300 hover:-translate-y-1">
                  <div className="rounded-[1.2rem] bg-primary/10 p-3 text-primary">
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-bold text-foreground">{cat.name}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">شوف المتاجر والخدمات اللي تحت الفئة دي جوه منظومة بتتجه لتجربة رقمية أوسع مع الوقت.</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {featuredStores && featuredStores.length > 0 && (
            <div className="mt-12">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="section-kicker">متاجر مختارة</p>
                  <h2 className="section-title">بداية لمجموعة متاجر هتشكّل شخصية المول</h2>
                </div>
                <Link to="/stores" className="hidden md:block">
                  <Button variant="ghost" className="text-primary">عرض كل المتاجر</Button>
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {featuredStores.map((store) => (
                  <Link key={store.id} to={`/stores/${store.slug}`} className="section-shell rounded-[1.6rem] p-5 transition-transform duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                      {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name_ar} className="h-14 w-14 rounded-[1rem] border border-border/60 object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-primary/10 text-primary">
                          <Store className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-foreground">{store.name_ar}</h3>
                        {store.category ? <p className="text-sm text-accent">{store.category}</p> : null}
                      </div>
                    </div>
                    {store.short_description_ar ? <p className="mt-4 text-sm leading-7 text-muted-foreground">{store.short_description_ar}</p> : null}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section-soft py-12 md:py-20">
        <div className="container">
          <div className="section-shell grid gap-6 overflow-hidden px-6 py-6 md:px-8 md:py-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
            <div className="space-y-5">
              <p className="section-kicker">الافتتاح قريبًا</p>
              <h2 className="section-title">افتتاح معمول علشان الناس تتحمس وتفهم وتشارك بسهولة</h2>
              <p className="text-base leading-8 text-muted-foreground">
                الفكرة مش ضجيج دعائي. الفكرة إن الزائر يلاقي رحلة واضحة: يعرف الافتتاح إمتى، يشارك في الجوائز، ويجي وهو فاهم
                هيلاقي إيه جوه المول.
              </p>
              <div className="space-y-3">
                {launchHighlights.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[1.3rem] border border-border/70 bg-card px-4 py-4 shadow-[var(--shadow-soft)]">
                    <Calendar className="mt-1 h-5 w-5 text-accent" />
                    <p className="text-sm leading-7 text-foreground/88">{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/opening-day">
                  <Button variant="outline-blue" size="lg" className="rounded-xl px-7">شوف تفاصيل الافتتاح</Button>
                </Link>
                <Link to="/spin-win">
                  <Button variant="cta" size="lg" className="rounded-xl px-7">جرّب أدر واربح</Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="section-shell rounded-[1.75rem] p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <Gift className="h-9 w-9 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">الجوائز والمكافآت</p>
                    <h3 className="text-2xl font-bold text-foreground">حملة جوائز شكلها راقٍ وطريقتها سهلة</h3>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {campaignJourney.map((item, index) => (
                    <div key={item} className="soft-card rounded-[1.35rem] p-5">
                      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">0{index + 1}</p>
                      <p className="mt-3 text-sm leading-7 text-foreground/88">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/reward-terms"><Button variant="ghost" className="text-primary">شروط المكافآت</Button></Link>
                </div>
              </div>

              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="soft-card rounded-[1.5rem] p-4">
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

      <section className="py-12 md:py-20">
        <div className="container">
          <div className="section-shell grid gap-6 overflow-hidden px-6 py-6 md:px-8 md:py-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="image-shell aspect-[16/11] overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[var(--shadow-elevated)]">
                <img src={facadeImage} alt="واجهة مول البستان الخارجية في وقت الغروب" className="h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-l from-background/20 via-transparent to-background/30" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <p className="section-kicker">التأجير والوحدات</p>
              <h2 className="section-title">لو بتفكر في وجود قوي داخل المول، دي بداية واضحة ومحترمة</h2>
              <p className="text-base leading-8 text-muted-foreground">
                سواء أنت علامة تقنية أو نشاط مكمل، الصفحة دي بتوضح الفكرة بسرعة: إيه المتاح، فين مكانه، وإزاي تبدأ استفسار من غير
                لف ودوران.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="soft-card rounded-[1.4rem] p-5">
                  <Building className="mb-3 h-8 w-8 text-orange" />
                  <p className="mb-2 text-sm font-bold text-foreground">وحدات متاحة</p>
                  <p className="text-sm leading-7 text-muted-foreground">مساحات ظاهرة بوضوح علشان تعرف الأنسب لنشاطك بسرعة.</p>
                </div>
                <div className="soft-card rounded-[1.4rem] p-5">
                  <MapPin className="mb-3 h-8 w-8 text-primary" />
                  <p className="mb-2 text-sm font-bold text-foreground">ربط بالموقع والخريطة</p>
                  <p className="text-sm leading-7 text-muted-foreground">انتقال سهل من الاستفسار لفهم مكان الوحدة داخل المشروع.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/leasing"><Button variant="orange" size="lg" className="rounded-xl px-7">ابدأ استفسارك</Button></Link>
                <Link to="/map"><Button variant="outline-blue" size="lg" className="rounded-xl px-7">شوف الوحدات على الخريطة</Button></Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="marketplace" className="section-soft py-12 md:py-20">
        <div className="container">
          <div className="brand-shell rounded-[2.3rem] p-6 md:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="section-kicker">Marketplace by Mall Elbostan</p>
                <h2 className="section-title">المرحلة الجاية من مول البستان: تجربة شراء أونلاين من نفس عالم المتاجر</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
                  Marketplace by Mall Elbostan مش إضافة جانبية، لكنه خطوة منطقية بعد بناء التجربة داخل المول. بعدين هتقدر تتصفح
                  منتجات متاجرك المفضلة، تتابع الجديد، وتكمل الشراء من نفس المنظومة.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {marketplaceFeatures.map((item) => (
                    <div key={item} className="rounded-[1.35rem] border border-border/70 bg-background px-4 py-4 text-sm font-semibold text-foreground/88 shadow-[var(--shadow-soft)]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.95rem] border border-border/70 bg-background/92 p-6 text-center shadow-[var(--shadow-soft)] lg:w-[320px]">
                <ShoppingBag className="mx-auto h-10 w-10 text-primary" />
                <p className="mt-4 text-lg font-bold text-foreground">سوق رقمي متصل بالمتاجر الحالية</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">مرحلة جاية من نفس الرؤية، علشان العلاقة بين الزائر والمتجر تفضل مستمرة.</p>
                <Link to="/stores" className="mt-5 block">
                  <Button variant="secondary" className="w-full rounded-xl">ابدأ من المتاجر الحالية</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container max-w-4xl">
          <div className="chapter-shell mb-8 pt-5 text-center">
            <p className="section-kicker">الأسئلة الشائعة</p>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              <HelpCircle className="ml-2 inline-block h-7 w-7 text-accent" />
              أسئلة ناس كتير ممكن تكون عايزة تعرفها قبل الافتتاح
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              إجابات سريعة وواضحة تساعدك تفهم المشروع أحسن وتعرف الخطوة اللي تهمك من غير تعقيد.
            </p>
          </div>
          {faqs && faqs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="section-shell rounded-[1.5rem] px-5">
                  <AccordionTrigger className="text-right text-base font-semibold text-foreground hover:text-primary">
                    {faq.question_ar}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-7 text-muted-foreground">{faq.answer_ar}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="surface-panel rounded-2xl p-8 text-center text-muted-foreground">سيتم إضافة الأسئلة الشائعة قريبًا</div>
          )}
          <div className="mt-8 text-center">
            <Link to="/faq">
              <Button variant="ghost" className="text-primary">
                عرض جميع الأسئلة
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}