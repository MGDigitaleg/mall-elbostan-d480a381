import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Building,
  Calendar,
  Gamepad2,
  Gift,
  HelpCircle,
  Layers3,
  MapPin,
  Monitor,
  Printer,
  Shield,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImage from "@/assets/mall-exterior.jpg";
import interiorImage from "@/assets/mall-interior.jpg";
import facadeImage from "@/assets/mall-facade.jpg";

const featurePillars = [
  {
    icon: Monitor,
    title: "وجهة تقنية متخصصة",
    desc: "تجربة تسوق تركز على الإلكترونيات والحلول التقنية والعلامات المتخصصة.",
  },
  {
    icon: MapPin,
    title: "موقع يخدم شرق القاهرة",
    desc: "حضور قوي بالقرب من القاهرة الجديدة ومدينتي والرحاب مع سهولة الوصول.",
  },
  {
    icon: Store,
    title: "متاجر مختارة بعناية",
    desc: "مزيج من المتاجر التقنية والخدمات المساندة لتجربة متكاملة تحت سقف واحد.",
  },
  {
    icon: Sparkles,
    title: "إطلاق مليء بالحوافز",
    desc: "جوائز وتجارب افتتاحية ونشاط تفاعلي يربط الزيارة بالمكافآت الحقيقية.",
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
  "عد تنازلي واضح نحو الافتتاح الكبير في 1 مايو 2026",
  "أنشطة افتتاحية وتجارب تفاعلية تبني الحضور من اليوم الأول",
  "ربط مباشر بين الزيارة، الجوائز، واستكشاف الخريطة والمتاجر",
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
      <section className="relative overflow-hidden pb-12 pt-10 md:pb-20 md:pt-16">
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.18),transparent_42%)]" />
        <div className="container relative">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div className="space-y-6 py-8 lg:py-14">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-[var(--shadow-soft)] backdrop-blur">
                  <Sparkles className="h-4 w-4 text-accent" />
                  افتتاح مرتقب في 1 مايو 2026
                </div>
                <h1 className="max-w-3xl text-4xl font-black leading-[1.2] text-foreground md:text-6xl">
                  مول البستان
                  <span className="mt-2 block text-balance text-2xl font-semibold text-foreground/88 md:text-4xl">
                    وجهة تقنية راقية تجمع المتاجر والخريطة التفاعلية وحملات الإطلاق القادمة
                  </span>
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  منصة إطلاق لمول تقني حديث في شرق القاهرة، تجمع بين تجربة الزيارة الفعلية، الجوائز الافتتاحية، فرص التأجير،
                  واستعداد مستقبلي لسوق إلكتروني يربط الزوار بمتاجرهم المفضلة.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.45 }}
                className="grid gap-4 sm:grid-cols-3"
              >
                {[
                  { label: "تقنية ومتاجر", value: "وجهة متخصصة" },
                  { label: "جوائز وإطلاق", value: "حملة افتتاحية" },
                  { label: "تأجير وسوق إلكتروني", value: "نمو مستقبلي" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/70 bg-card/75 px-4 py-4 shadow-[var(--shadow-soft)] backdrop-blur-sm">
                    <p className="text-xs font-semibold text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-base font-bold text-foreground">{item.value}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.45 }}
                className="flex flex-wrap gap-3"
              >
                <Link to="/spin-win">
                  <Button variant="cta" size="lg" className="min-w-[180px] rounded-xl px-7">حملة الجوائز</Button>
                </Link>
                <Link to="/map">
                  <Button variant="outline-blue" size="lg" className="min-w-[180px] rounded-xl px-7">استكشف الخريطة</Button>
                </Link>
                <Link to="/leasing">
                  <Button variant="orange" size="lg" className="min-w-[180px] rounded-xl px-7">استفسر عن الوحدات</Button>
                </Link>
                <Link to="/stores">
                  <Button variant="secondary" size="lg" className="min-w-[180px] rounded-xl px-7">المتاجر والسوق القادم</Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.45 }}
                className="surface-panel max-w-xl rounded-[1.75rem] p-5"
              >
                <p className="mb-4 text-sm font-semibold text-muted-foreground">العد التنازلي للإطلاق</p>
                <CountdownTimer />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55 }}
              className="relative"
            >
              <div className="image-shell aspect-[5/6] overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[var(--shadow-elevated)] lg:aspect-[4/5]">
                <img
                  src={heroImage}
                  alt="الواجهة الرئيسية لمول البستان بتصميم معماري حديث"
                  className="h-full w-full object-cover object-[center_36%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-background/12 to-transparent" />
              </div>
              <div className="surface-panel absolute bottom-4 left-4 right-4 rounded-2xl p-5 md:bottom-6 md:left-6 md:right-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Mall Elbostan</p>
                    <p className="mt-2 text-lg font-bold text-foreground">مركز تقني حديث يربط بين التجربة الفعلية والامتداد الرقمي</p>
                  </div>
                  <Layers3 className="mt-1 h-5 w-5 text-primary" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">لماذا مول البستان</p>
              <h2 className="section-title">هوية واضحة لمول تقني قادم بقوة</h2>
            </div>
            <Link to="/about" className="hidden md:block">
              <Button variant="ghost" className="text-primary">تعرف على المشروع</Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featurePillars.map((feature, i) => (
              <motion.div key={feature.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="surface-panel h-full rounded-2xl p-6">
                  <feature.icon className="mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-3 text-lg font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-18">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 space-y-5 lg:order-1"
            >
              <p className="section-kicker">داخل المول</p>
              <h2 className="section-title">تجربة متعددة المستويات بتصميم يرفع قيمة العلامات والمتسوقين</h2>
              <p className="text-base leading-8 text-muted-foreground">
                الصورة الداخلية لا تُستخدم هنا كاستعراض بصري فقط، بل لتأكيد أن المشروع يقدّم تجربة حقيقية داخلية واسعة، مع حركة
                واضحة بين الطوابق ومساحات عرض تليق بتجربة تقنية معاصرة.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="surface-panel rounded-2xl p-5">
                  <p className="mb-1 text-sm font-semibold text-foreground">تصميم معماري مقنع</p>
                  <p className="text-sm leading-7 text-muted-foreground">مشهد داخلي يعزز الثقة ويمنح الزائر تصورًا واضحًا عن جودة المشروع.</p>
                </div>
                <div className="surface-panel rounded-2xl p-5">
                  <p className="mb-1 text-sm font-semibold text-foreground">تدفق بصري منظم</p>
                  <p className="text-sm leading-7 text-muted-foreground">بيئة مناسبة للمتاجر التقنية والخدمات المصاحبة والأنشطة الافتتاحية.</p>
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
                <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-card/35 py-12 md:py-18">
        <div className="container">
          <div className="mb-8 max-w-2xl">
            <p className="section-kicker">المتاجر والفئات</p>
            <h2 className="section-title">فئات تقنية منظمة تسهّل الاستكشاف اليوم وتمهّد للسوق الإلكتروني لاحقًا</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to={`/stores?category=${encodeURIComponent(cat.name)}`} className="surface-panel flex h-full items-start gap-4 rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-bold text-foreground">{cat.name}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">استكشف المتاجر والخدمات المرتبطة بهذه الفئة داخل منظومة مول البستان.</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-18">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-5">
              <p className="section-kicker">الافتتاح قريبًا</p>
              <h2 className="section-title">صفحة انطلاق تبني الحماس قبل يوم الافتتاح</h2>
              <p className="text-base leading-8 text-muted-foreground">
                يقدّم الموقع الآن رحلة واضحة نحو الافتتاح: متابعة العد التنازلي، استكشاف فعاليات يوم الإطلاق، ومعرفة كيف ترتبط
                الجوائز والحضور الفعلي بتجربة المول منذ البداية.
              </p>
              <div className="space-y-3">
                {launchHighlights.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/70 px-4 py-4">
                    <Calendar className="mt-1 h-5 w-5 text-accent" />
                    <p className="text-sm leading-7 text-foreground/88">{item}</p>
                  </div>
                ))}
              </div>
              <Link to="/opening-day">
                <Button variant="outline-blue" size="lg" className="rounded-xl px-7">تعرف على فعاليات الافتتاح</Button>
              </Link>
            </div>
            <div className="surface-panel rounded-[2rem] p-6 md:p-8">
              <div className="flex items-center gap-3">
                <Gift className="h-9 w-9 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">الجوائز والمكافآت</p>
                  <h3 className="text-2xl font-bold text-foreground">حملة افتتاحية بطابع راقٍ</h3>
                </div>
              </div>
              <p className="mt-5 text-sm leading-8 text-muted-foreground">
                تجربة أدر واربح تُقدَّم هنا كجزء من حملة إطلاق مدروسة، تمنح الزائر سببًا إضافيًا للعودة والمشاركة يوم الافتتاح،
                مع تعليمات واضحة وآلية منظمة للمطالبة بالجائزة.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/55 p-4">
                  <p className="mb-2 text-sm font-bold text-foreground">تجربة تفاعلية</p>
                  <p className="text-sm leading-7 text-muted-foreground">واجهة سلسة ونتيجة قابلة للحفظ والرجوع إليها عند الحضور.</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/55 p-4">
                  <p className="mb-2 text-sm font-bold text-foreground">رسالة موحدة</p>
                  <p className="text-sm leading-7 text-muted-foreground">ربط المكافآت بالحضور الفعلي ومتابعة قنوات المول عند الحاجة.</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/spin-win"><Button variant="cta" className="rounded-xl px-6">اكتشف أدر واربح</Button></Link>
                <Link to="/reward-terms"><Button variant="ghost" className="text-primary">شروط المكافآت</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredStores && featuredStores.length > 0 && (
        <section className="bg-card/35 py-12 md:py-18">
          <div className="container">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="section-kicker">متاجر مختارة</p>
                <h2 className="section-title">معاينة أولية للعلامات والفئات داخل المول</h2>
              </div>
              <Link to="/stores" className="hidden md:block">
                <Button variant="ghost" className="text-primary">عرض كل المتاجر</Button>
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredStores.map((store) => (
                <Link key={store.id} to={`/stores/${store.slug}`} className="surface-panel rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    {store.logo_url ? (
                      <img src={store.logo_url} alt={store.name_ar} className="h-14 w-14 rounded-2xl border border-border/60 object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
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
        </section>
      )}

      <section className="py-12 md:py-18">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
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
              <h2 className="section-title">فرص تجارية تُقدَّم بلغة استثمارية واثقة</h2>
              <p className="text-base leading-8 text-muted-foreground">
                إذا كنت علامة تقنية أو نشاطًا يبحث عن حضور في بيئة متخصصة، فهذه الصفحة تمنحك مدخلًا واضحًا للاستفسار عن الوحدات
                والمساحات المناسبة، مع ربط سريع بالخريطة والفرص المتاحة.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="surface-panel rounded-2xl p-5">
                  <Building className="mb-3 h-8 w-8 text-orange" />
                  <p className="mb-2 text-sm font-bold text-foreground">وحدات متاحة</p>
                  <p className="text-sm leading-7 text-muted-foreground">عرض واضح للمساحات المتاحة مع إبرازها بصريًا داخل المنظومة.</p>
                </div>
                <div className="surface-panel rounded-2xl p-5">
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

      <section className="bg-card/35 py-12 md:py-18">
        <div className="container">
          <div className="surface-panel rounded-[2rem] p-6 md:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="section-kicker">Marketplace by Mall Elbostan</p>
                <h2 className="section-title">تجربة تسوق إلكتروني قادمة تربط المتاجر بالشراء عبر الإنترنت</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
                  قريبًا سيتمكن الزوار من تصفح المنتجات من متاجرهم التقنية المفضلة داخل منظومة مول البستان، مع تقديم تجربة رقمية
                  تكمل الزيارة الفعلية وتفتح باب الشراء عبر الإنترنت لاحقًا.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {[
                    "Coming soon",
                    "Online shopping experience",
                    "Browse products from your favorite tech stores",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-border/70 bg-background/55 px-4 py-4 text-sm font-semibold text-foreground/88">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-border/70 bg-background/60 p-6 text-center lg:w-[280px]">
                <ShoppingBag className="mx-auto h-10 w-10 text-primary" />
                <p className="mt-4 text-lg font-bold text-foreground">سوق رقمي متصل بالمول</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">امتداد استراتيجي للمتاجر الحالية وليس قسمًا منفصلًا عن هوية المشروع.</p>
                <Link to="/stores" className="mt-5 block">
                  <Button variant="secondary" className="w-full rounded-xl">استكشف المتاجر الحالية</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {upcomingEvents && upcomingEvents.length > 0 && (
        <section className="py-12 md:py-18">
          <div className="container">
            <div className="mb-8">
              <p className="section-kicker">فعاليات الافتتاح</p>
              <h2 className="section-title">معاينة لبرنامج الإطلاق والأنشطة القادمة</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="surface-panel overflow-hidden rounded-2xl p-4">
                  {event.image_url ? (
                    <img src={event.image_url} alt={event.title_ar} className="mb-4 h-44 w-full rounded-2xl object-cover" loading="lazy" />
                  ) : null}
                  <h3 className="text-lg font-bold text-foreground">{event.title_ar}</h3>
                  {event.description_ar ? <p className="mt-3 text-sm leading-7 text-muted-foreground">{event.description_ar}</p> : null}
                  {event.event_date ? (
                    <div className="mt-4 flex items-center gap-2 text-sm text-accent">
                      <Calendar className="h-4 w-4" />
                      <span>{event.event_date}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-card/35 py-12 md:py-18">
        <div className="container max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground md:text-4xl">
            <HelpCircle className="ml-2 inline-block h-7 w-7 text-accent" />
            أسئلة شائعة قبل الافتتاح
          </h2>
          {faqs && faqs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="surface-panel rounded-2xl px-5">
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