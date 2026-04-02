import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { MapPin, Clock, Phone, Mail, Building2, Award, Users, Globe, Layers, Wrench, ShoppingBag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import downtownExterior from "@/assets/downtown-exterior.jpg";
import downtownNight from "@/assets/downtown-night.jpg";
import downtownInterior1 from "@/assets/downtown-interior-1.jpg";
import downtownInterior2 from "@/assets/downtown-interior-2.jpg";
import downtownInterior3 from "@/assets/downtown-interior-3.jpg";
import downtownInterior4 from "@/assets/downtown-interior-4.jpg";
import downtownInterior5 from "@/assets/downtown-interior-5.jpg";
import downtownInterior6 from "@/assets/downtown-interior-6.jpg";

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const galleryImages = [
  { src: downtownExterior, alt: "الواجهة الرئيسية — مول البستان وسط البلد" },
  { src: downtownNight, alt: "مول البستان ليلًا — وسط البلد" },
  { src: downtownInterior1, alt: "داخل المول — الممرات الرئيسية" },
  { src: downtownInterior2, alt: "الطوابق الداخلية — مول البستان" },
  { src: downtownInterior3, alt: "المتاجر الداخلية — مول البستان وسط البلد" },
  { src: downtownInterior4, alt: "التصميم الداخلي للمول" },
  { src: downtownInterior5, alt: "ممرات مول البستان" },
  { src: downtownInterior6, alt: "واجهات المتاجر — مول البستان" },
];

const DowntownBranch = () => (
  <MainLayout>
    <SEOHead
      title="فرع وسط البلد"
      titleEn="Downtown Branch"
      description="مول البستان وسط البلد — الفرع الأصلي منذ 1990. وجهة مصر التقنية التاريخية في قلب القاهرة. إحدى مشروعات مجموعة العباسي."
      descriptionEn="Mall Elbostan Downtown — the original branch since 1990. Egypt's historic technology destination in the heart of Cairo. A project by Al-Abbasy Group."
      breadcrumbs={[{ name: "فرع وسط البلد", url: "/downtown-branch" }]}
    />

    {/* Hero with real exterior image */}
    <section className="relative min-h-[50vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={downtownNight}
          alt="مول البستان وسط البلد — المنظر الليلي"
          className="h-full w-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #071326 0%, #07132699 40%, #07132640 100%)" }} />
      </div>
      <div className="container relative z-10 pb-12 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[2px] w-8 rounded-full" style={{ background: "#CDBB9A" }} />
            <span className="font-poppins text-[0.58rem] font-bold tracking-[0.22em] uppercase" style={{ color: "#CDBB9A" }}>
              الفرع الأصلي — منذ 1990
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold dark-heading max-w-[28rem]">
            مول البستان <span style={{ color: "#CDBB9A" }}>وسط البلد</span>
          </h1>
          <p className="mt-3 max-w-[28rem] text-[0.92rem] leading-[1.85] dark-body">
            حيث بدأت القصة — الوجهة التقنية الأعرق في مصر، في قلب القاهرة التاريخي. إحدى مشروعات مجموعة العباسي.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Origin Story — official content */}
    <section className="py-10 md:py-14" style={{ background: "#FAFAF8" }}>
      <div className="container max-w-[1100px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <div className="chapter-shell pt-4 mb-6">
                <p className="section-kicker">البداية</p>
                <h2 className="section-title max-w-[22rem]">حيث وُلدت الثقة.</h2>
              </div>

              <div className="space-y-4 text-[0.88rem] leading-[1.85] light-body max-w-[30rem]">
                <p>
                  في عام 1990، وبالتزامن مع حركة الاستثمار في مصر، تم افتتاح مول البستان كمركز تجاري يجمع بين العديد من الأنشطة التجارية المختلفة تحت سقف واحد.
                </p>
                <p>
                  واستمر على هذا النهج حتى بداية الألفية الجديدة، ليصبح الوجهة الرئيسية لجميع عشاق التكنولوجيا والإلكترونيات. فتحول من صرح تجاري إلى معلم رئيسي من معالم القاهرة، خاصة في منطقة وسط البلد.
                </p>
                <p>
                  منذ افتتاحه، لعب مول البستان دورًا محوريًا في الاستثمار، والاستيراد، وتجارة وصيانة الأجهزة الإلكترونية، مما يجعله الخيار المثالي للمستثمرين بفضل مساحته المؤهلة، وموقعه المتميز، وعدد زواره المرتفع طوال اليوم.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="frame-cinematic overflow-hidden rounded-lg">
                <img src={downtownExterior} alt="الواجهة الرئيسية — مول البستان وسط البلد" className="img-grade aspect-[16/10] max-h-[260px] w-full object-cover object-center" loading="lazy" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="frame-heritage overflow-hidden rounded-lg">
                  <img src={downtownInterior1} alt="داخل المول" className="img-grade aspect-[4/3] max-h-[120px] w-full object-cover" loading="lazy" />
                </div>
                <div className="frame-heritage overflow-hidden rounded-lg">
                  <img src={downtownInterior2} alt="الطوابق الداخلية" className="img-grade aspect-[4/3] max-h-[120px] w-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {[
              { icon: Building2, title: "تأسيس 1990", desc: "أول مركز تقنية متخصص في مصر." },
              { icon: Award, title: "إرث تجاري", desc: "أكثر من ثلاثة عقود من الثقة." },
              { icon: Users, title: "مقصد التجار", desc: "وجهة التجار والمستوردين." },
              { icon: Globe, title: "سوق الجملة والتجزئة", desc: "استيراد وتوزيع وبيع مباشر." },
            ].map((c) => (
              <div key={c.title} className="card-architectural rounded-lg p-4">
                <c.icon className="mb-2 h-5 w-5 text-primary" />
                <p className="text-[0.88rem] font-bold light-heading">{c.title}</p>
                <p className="mt-1 text-[0.8rem] leading-6 light-body">{c.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* Vision, Mission, Goals — from official site */}
    <section className="heritage-deep py-10 md:py-14 relative overflow-hidden">
      <div className="relative container max-w-[1100px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="mb-8">
            <p className="section-kicker dark-kicker">الرؤية والرسالة</p>
            <h2 className="section-title dark-heading max-w-[22rem]">أكثر من مبنى تجاري.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "رؤيتنا",
                desc: "مول البستان ليس مجرد مبنى يجمع في ممراته أهم وكلاء وموزعي الأجهزة الإلكترونية في مصر، بل هو مركز جذب تجاري ومؤسسة تلعب دورًا استثماريًا محوريًا. رؤيتنا تطوير هذا الصرح التجاري ليلبي كافة احتياجات شركائنا من مستثمرين وتجار وزائرين.",
              },
              {
                title: "مهمتنا",
                desc: "توفير المناخ المناسب والآمن الذي يساعد على ازدهار الأعمال ونموها، مما يساعد رواد الأعمال والمستثمرين على تحقيق أهدافهم. التطوير والتحديث أحد أهم عناصر الجذب لزوار ورواد مول البستان.",
              },
              {
                title: "أهدافنا",
                desc: "توفير بيئة مناسبة وداعمة للاستثمار مجهزة بكافة الخدمات، والعمل على جعل مول البستان وجهة لكل الراغبين في بدء مشروعهم في مجال الإلكترونيات، والحفاظ على مكانته كمكان تجتمع فيه كافة الحلول التقنية.",
              },
            ].map((item) => (
              <div key={item.title} className="heritage-surface rounded-lg p-5">
                <p className="text-[1rem] font-bold dark-heading mb-2">{item.title}</p>
                <p className="text-[0.82rem] leading-7 dark-body">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { v: "1990", l: "سنة التأسيس" },
              { v: "30+", l: "عامًا في السوق" },
              { v: "مئات", l: "التجار والعلامات" },
              { v: "ملايين", l: "الزوار عبر السنين" },
            ].map((s) => (
              <div key={s.l} className="heritage-surface rounded-lg px-3 py-4 text-center">
                <p className="font-poppins text-[1.3rem] font-extrabold dark-heading">{s.v}</p>
                <p className="mt-1 text-[0.7rem] font-semibold dark-muted">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* Market Reputation */}
    <section className="py-10 md:py-14" style={{ background: "#FAFAF8" }}>
      <div className="container max-w-[1100px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="chapter-shell pt-4 mb-6">
            <p className="section-kicker">السمعة السوقية</p>
            <h2 className="section-title max-w-[22rem]">اسم يعرفه كل من دخل السوق.</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Layers, title: "تخصصات متنوعة", desc: "هواتف، كمبيوتر، قطع غيار، طباعة، شبكات، وأنظمة مراقبة — كل ما يحتاجه السوق تحت سقف واحد." },
              { icon: Award, title: "ثقة بالعودة", desc: "الزبون الذي يشتري مرة يعود عشرات المرات. هذا ما بنى الاسم." },
              { icon: Users, title: "مجتمع التجار", desc: "مئات التجار والفنيين بنوا أعمالهم داخل المول وأصبحوا جزءًا من هويته." },
              { icon: Globe, title: "حركة مستمرة", desc: "وسط البلد يعني حركة دائمة — زبائن من كل أنحاء مصر يقصدون هذا العنوان." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-[var(--shadow-card)]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[0.88rem] font-bold light-heading">{item.title}</p>
                  <p className="mt-1 text-[0.82rem] leading-7 light-body">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* Photo Gallery */}
    <section className="py-10 md:py-14" style={{ background: "#F5F2EC" }}>
      <div className="container max-w-[1100px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="chapter-shell pt-4 mb-6">
            <p className="section-kicker">معرض الصور</p>
            <h2 className="section-title max-w-[22rem]">من داخل مول البستان.</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="overflow-hidden rounded-lg"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="img-grade aspect-square w-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* Branch Info — real contact data */}
    <section className="py-10 md:py-14" style={{ background: "#FAFAF8" }}>
      <div className="container max-w-[1100px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="surface-panel rounded-[1.75rem] p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">معلومات الفرع</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <div><strong className="text-foreground">العنوان:</strong> شارع البستان، وسط البلد، القاهرة، مصر</div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <div><strong className="text-foreground">الخط الساخن:</strong> <span className="font-poppins font-bold" dir="ltr">15215</span></div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <div><strong className="text-foreground">البريد الإلكتروني:</strong> <span className="font-poppins" dir="ltr">info@albostan-mall.com</span></div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0" />
                  <div><strong className="text-foreground">مواعيد العمل:</strong> يوميًا من الصباح حتى المساء</div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[0.84rem] leading-7 text-muted-foreground mb-4">
                  إحدى مشروعات <strong className="text-foreground">مجموعة العباسي</strong> — أكثر من 30 عامًا في تطوير وإدارة المنشآت التجارية المتخصصة في قطاع التقنية والإلكترونيات.
                </p>
                <a href="https://alabbasy-group.com/ar/index/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline-blue" size="sm" className="gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" />
                    مجموعة العباسي
                  </Button>
                </a>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/downtown-directory">
                <Button variant="cta">دليل محلات الفرع</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline-blue">تواصل معنا</Button>
              </Link>
              <Link to="/new-cairo-branch">
                <Button variant="outline-blue">فرع القاهرة الجديدة</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  </MainLayout>
);

export default DowntownBranch;
