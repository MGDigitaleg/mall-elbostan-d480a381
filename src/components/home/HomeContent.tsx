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

const featurePillars = [
  {
    icon: Monitor,
    title: "وجهة تقنية متخصصة",
    desc: "تجربة تركّز على الإلكترونيات والحلول التقنية والمتاجر التي يعرف جمهورها ما يبحث عنه بدقة.",
  },
  {
    icon: MapPin,
    title: "موقع يخدم شرق القاهرة",
    desc: "حضور عملي يخدم القاهرة الجديدة ومدينتي والرحاب ضمن نقطة تجمع تجارية واضحة وسهلة الوصول.",
  },
  {
    icon: Store,
    title: "متاجر مختارة بعناية",
    desc: "تنسيق فئات ومتاجر داعمة يقدّم تجربة منظمة وقابلة للنمو داخل المول وعبر القنوات الرقمية لاحقًا.",
  },
  {
    icon: Sparkles,
    title: "إطلاق مليء بالحوافز",
    desc: "جوائز وحملة إطلاق مدروسة تربط الزيارة بالحضور والتفاعل بطريقة راقية وواضحة.",
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
  "استعد ليوم إطلاق يجمع الحضور الفعلي مع تجربة رقمية متكاملة قبل الافتتاح وبعده.",
  "رحلة المشاركة في الجوائز واضحة: استكشف، شارك، ثم احتفظ بالنتيجة ليوم الافتتاح.",
  "الرسالة التجارية متوازنة بين جذب الزوار، دعم المتاجر، وفتح باب النمو للمستأجرين.",
];

const campaignJourney = [
  "استكشف الخريطة والمتاجر والفئات قبل الزيارة.",
  "شارك في حملة الجوائز واحتفظ بنتيجتك.",
  "احضر الافتتاح واستفد من الأجواء الافتتاحية والأنشطة المعلنة.",
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
      <section className="relative overflow-hidden pb-16 pt-4 md:pb-28 md:pt-8">
        <div className="absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.12),transparent_54%)]" />
        <div className="container relative">
          <div className="brand-shell grid items-center gap-10 overflow-hidden rounded-[2.5rem] px-6 py-8 md:px-8 md:py-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:px-10 lg:py-12">
            <div className="space-y-6 lg:py-6">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <div className="eyebrow-chip mb-5">
                  <Sparkles className="h-4 w-4 text-accent" />
                  افتتاح مرتقب • مايو 2026 • وجهة تقنية جديدة في شرق القاهرة
                </div>
                <h1 className="max-w-3xl text-4xl font-black leading-[1.15] text-foreground md:text-6xl">
                  مول البستان
                  <span className="mt-3 block text-2xl font-semibold leading-tight text-foreground/88 md:text-[2.55rem]">
                    مول تقني راقٍ يربط المتاجر، الافتتاح المرتقب، فرص التأجير، والسوق الإلكتروني القادم ضمن تجربة علامة تجارية واحدة
                  </span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  الصفحة الرئيسية صُممت لتوضح الفكرة كاملة منذ اللحظة الأولى: وجهة تقنية متخصصة، خريطة تفاعلية، متاجر وفئات منظمة،
                  حملة جوائز راقية للافتتاح، وفرص تجارية مدروسة تمهّد لاحقًا إلى Marketplace by Mall Elbostan.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.45 }}
                className="flex flex-wrap gap-3"
              >
                {heroChips.map((item) => (
                  <div key={item} className="rounded-full border border-border/75 bg-card/88 px-4 py-2 text-sm font-semibold text-foreground shadow-[var(--shadow-soft)]">
                    {item}
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.45 }}
                className="flex flex-wrap gap-3"
              >
                <Link to="/map">
                  <Button variant="cta" size="lg" className="min-w-[180px] rounded-xl px-7">استكشف الخريطة</Button>
                </Link>
                <Link to="/leasing">
                  <Button variant="orange" size="lg" className="min-w-[180px] rounded-xl px-7">استفسر عن الوحدات</Button>
                </Link>
                <Link to="/spin-win">
                  <Button variant="outline-blue" size="lg" className="min-w-[180px] rounded-xl px-7">حملة الجوائز</Button>
                </Link>
                <Link to="/stores">
                  <Button variant="secondary" size="lg" className="min-w-[180px] rounded-xl px-7">المتاجر والسوق القادم</Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.45 }}
                className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]"
              >
                <div className="section-shell rounded-[1.75rem] p-5">
                  <p className="mb-4 text-sm font-semibold text-muted-foreground">العد التنازلي للإطلاق</p>
                  <CountdownTimer />
                </div>
                <div className="grid gap-4">
                  <div className="soft-card p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">خريطة ومتاجر</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/88">ابدأ من الخريطة أو الفئات للوصول السريع إلى المتاجر والوحدات والخدمات.</p>
                  </div>
                  <div className="soft-card p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">Marketplace</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/88">امتداد رقمي قادم يربط متاجر المول بتجربة تصفح وشراء إلكتروني.</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55 }}
              className="relative mx-auto w-full max-w-[38rem]"
            >
              <div className="section-shell overflow-hidden rounded-[2.2rem] p-3 shadow-[var(--shadow-elevated)]">
                <div className="image-shell aspect-[4/5] overflow-hidden rounded-[1.8rem] bg-card lg:aspect-[5/6]">
                  <img src={heroImage} alt="الواجهة الرئيسية لمول البستان بتصميم معماري حديث" className="h-full w-full object-cover object-[center_36%]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-background/15" />
                </div>
                <div className="glass absolute inset-x-7 bottom-7 rounded-[1.5rem] p-5 md:inset-x-9 md:bottom-9">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Mall Elbostan</p>
                      <p className="mt-2 text-lg font-bold text-foreground">عنوان تقني جديد يجمع الزيارة الفعلية بالنمو التجاري والامتداد الرقمي</p>
                    </div>
                    <Layers3 className="mt-1 h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>

              <div className="section-shell absolute -left-4 top-8 hidden w-60 overflow-hidden rounded-[1.7rem] p-3 lg:block">
                <div className="image-shell mb-3 aspect-[4/3] rounded-[1.2rem]">
                  <img src={interiorImage} alt="الأتريوم الداخلي لمول البستان" className="h-full w-full object-cover object-center" />
                </div>
                <p className="text-sm font-bold text-foreground">تجربة داخلية متعددة المستويات</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">صورة داعمة تؤكد حضورًا معماريًا حقيقيًا ومسار حركة واضحًا للزوار والعلامات.</p>
              </div>

              <div className="section-shell absolute -right-4 bottom-14 hidden w-56 rounded-[1.7rem] p-5 lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Marketplace by Mall Elbostan</p>
                <p className="mt-3 text-base font-bold text-foreground">سوق إلكتروني قادم يوسّع تجربة المول بعد الزيارة</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">تصفّح المنتجات من المتاجر المفضلة ضمن منظومة موحدة تحمل نفس هوية المشروع.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div className="max-w-3xl">
              <p className="section-kicker">لماذا مول البستان</p>
              <h2 className="section-title">وجهة علامة تجارية تقنية صُممت لتكون أوضح وأكثر تأثيرًا من البداية</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                هذه ليست مجرد صفحة تعريفية لمول جديد، بل منصة تشرح قيمة المشروع: تخصص واضح، موقع يخدم شرق القاهرة، متاجر منتقاة،
                وإطلاق مبني على التفاعل والزيارة الفعلية.
              </p>
            </div>
            <Link to="/about" className="hidden md:block">
              <Button variant="ghost" className="text-primary">تعرف على المشروع</Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featurePillars.map((feature, i) => (
              <motion.div key={feature.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="section-shell h-full rounded-[1.6rem] p-6">
                  <feature.icon className="mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-3 text-lg font-bold text-foreground">{feature.title}</h3>
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
              <h2 className="section-title">مساحة داخلية تمنح العلامات رؤية أوضح وتجعل التجربة أكثر ترابطًا وأناقة</h2>
              <p className="text-base leading-8 text-muted-foreground">
                الصورة الداخلية تؤكد أن المشروع ليس فكرة تسويقية فقط، بل تجربة مول متعددة المستويات تدعم وضوح الحركة، إبراز
                العلامات، وتقديم بيئة تقنية تبدو مقنعة للزائر والمستأجر على حد سواء.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="soft-card rounded-[1.4rem] p-5">
                  <p className="mb-1 text-sm font-semibold text-foreground">حضور معماري راقٍ</p>
                  <p className="text-sm leading-7 text-muted-foreground">أتريوم متعدد الطوابق يقدّم للمشروع شخصية مكانية قوية وقابلة للتذكّر.</p>
                </div>
                <div className="soft-card rounded-[1.4rem] p-5">
                  <p className="mb-1 text-sm font-semibold text-foreground">حركة تجارة أوضح</p>
                  <p className="text-sm leading-7 text-muted-foreground">مساحات تسمح بعرض أفضل للفئات التقنية والأنشطة والظهور التجاري المتدرج.</p>
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
          <div className="mb-10 max-w-3xl">
            <p className="section-kicker">المتاجر والفئات</p>
            <h2 className="section-title">تسوق حسب الفئة ضمن بنية واضحة تدعم الحضور الفعلي وتمهّد لتجربة Marketplace لاحقًا</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              تم تنظيم الفئات التقنية لتكون واضحة اليوم على الموقع والخريطة، وقابلة للامتداد لاحقًا إلى تجربة تصفح منتجات أكثر تطورًا.
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
                    <p className="text-sm leading-7 text-muted-foreground">استكشف المتاجر والخدمات المرتبطة بهذه الفئة داخل منظومة مول البستان المتجهة نحو تجربة رقمية أوسع.</p>
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
                  <h2 className="section-title">معاينة أولية لعلامات وفئات ستشكّل تجربة المول</h2>
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
              <h2 className="section-title">حملة إطلاق أنيقة تربط الافتتاح بالحضور والجوائز والزيارة الفعلية</h2>
              <p className="text-base leading-8 text-muted-foreground">
                تجربة الافتتاح هنا ليست ضوضاء دعائية، بل رحلة مفهومة وواضحة: عد تنازلي، محتوى افتتاحي، مشاركة في الجوائز، ثم
                حضور فعلي يمنح الزائر سببًا للعودة والتفاعل مع المشروع من أول يوم.
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
                  <Button variant="outline-blue" size="lg" className="rounded-xl px-7">تعرف على فعاليات الافتتاح</Button>
                </Link>
                <Link to="/spin-win">
                  <Button variant="cta" size="lg" className="rounded-xl px-7">اكتشف أدر واربح</Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="section-shell rounded-[1.75rem] p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <Gift className="h-9 w-9 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">الجوائز والمكافآت</p>
                    <h3 className="text-2xl font-bold text-foreground">تجربة جوائز أكثر رقيًا ووضوحًا</h3>
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
              <h2 className="section-title">فرص تجارية تُقدَّم بصورة استثمارية أوضح وأكثر إقناعًا</h2>
              <p className="text-base leading-8 text-muted-foreground">
                إذا كنت علامة تقنية أو نشاطًا يبحث عن موطئ قدم داخل بيئة متخصصة، فالموقع يقدّم لك نقطة دخول واضحة لفهم الوحدات
                المتاحة، طبيعة الحضور داخل المول، وخطوة الاستفسار المناسبة لاتخاذ قرار أفضل.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="soft-card rounded-[1.4rem] p-5">
                  <Building className="mb-3 h-8 w-8 text-orange" />
                  <p className="mb-2 text-sm font-bold text-foreground">وحدات متاحة</p>
                  <p className="text-sm leading-7 text-muted-foreground">عرض واضح للمساحات المتاحة مع إبرازها بصريًا داخل المنظومة.</p>
                </div>
                <div className="soft-card rounded-[1.4rem] p-5">
                  <MapPin className="mb-3 h-8 w-8 text-primary" />
                  <p className="mb-2 text-sm font-bold text-foreground">ربط بالموقع والخريطة</p>
                  <p className="text-sm leading-7 text-muted-foreground">سهولة الانتقال من الاستفسار إلى فهم الموقع ومكان الوحدة داخل المشروع.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/leasing"><Button variant="orange" size="lg" className="rounded-xl px-7">ابدأ استفسار التأجير</Button></Link>
                <Link to="/map"><Button variant="outline-blue" size="lg" className="rounded-xl px-7">شاهد الوحدات على الخريطة</Button></Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="marketplace" className="section-soft py-12 md:py-20">
        <div className="container">
          <div className="section-shell rounded-[2rem] p-6 md:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="section-kicker">Marketplace by Mall Elbostan</p>
                <h2 className="section-title">امتداد رقمي استراتيجي يفتح تجربة تسوق إلكتروني من داخل منظومة المول</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
                  Marketplace by Mall Elbostan سيحوّل حضور المتاجر داخل المول إلى تجربة مستمرة بعد الزيارة، حيث يتمكن المستخدم لاحقًا
                  من تصفح المنتجات المفضلة، متابعة العروض، واستكمال علاقة الشراء ضمن هوية رقمية متسقة مع المشروع.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {marketplaceFeatures.map((item) => (
                    <div key={item} className="rounded-[1.35rem] border border-border/70 bg-background px-4 py-4 text-sm font-semibold text-foreground/88 shadow-[var(--shadow-soft)]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-border/70 bg-background p-6 text-center shadow-[var(--shadow-soft)] lg:w-[300px]">
                <ShoppingBag className="mx-auto h-10 w-10 text-primary" />
                <p className="mt-4 text-lg font-bold text-foreground">سوق رقمي متصل بالمتاجر الحالية</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">جزء مهم من رؤية مول البستان التجارية، وليس مجرد إضافة جانبية داخل الموقع.</p>
                <Link to="/stores" className="mt-5 block">
                  <Button variant="secondary" className="w-full rounded-xl">استكشف المتاجر الحالية</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container max-w-4xl">
          <div className="mb-8 text-center">
            <p className="section-kicker">الأسئلة الشائعة</p>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              <HelpCircle className="ml-2 inline-block h-7 w-7 text-accent" />
              أسئلة شائعة قبل الافتتاح
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              إجابات مختصرة وواضحة تساعد الزائر على فهم المشروع، التفاعل مع صفحات الافتتاح، والاستعداد للخطوة التالية.
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