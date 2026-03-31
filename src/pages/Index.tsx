import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Store, Calendar, Sparkles, Building, Tag, HelpCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { CountdownTimer } from "@/components/CountdownTimer";
import { SEOHead, organizationLd, buildFaqLd } from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImage from "@/assets/hero-mall.jpg";

const features = [
  { icon: Sparkles, title: "أدر واربح", desc: "جوائز فورية قيّمة بانتظارك يوم الافتتاح", link: "/spin-win", color: "text-orange" },
  { icon: MapPin, title: "خريطة تفاعلية", desc: "تصفح المول واعثر على متجرك المفضل بسهولة", link: "/map", color: "text-accent" },
  { icon: Store, title: "دليل المتاجر", desc: "أفضل العلامات التجارية في التكنولوجيا", link: "/stores", color: "text-primary" },
  { icon: Building, title: "احجز وحدتك", desc: "فرص تأجير مميزة في أفضل موقع بالقاهرة الجديدة", link: "/leasing", color: "text-orange" },
];

const categories = [
  { name: "الهواتف والإكسسوارات", icon: "📱" },
  { name: "الكمبيوتر والأجهزة", icon: "💻" },
  { name: "الألعاب والجيمنج", icon: "🎮" },
  { name: "الطباعة والتصوير", icon: "🖨️" },
  { name: "الشبكات والحماية", icon: "🔒" },
  { name: "الصيانة والدعم الفني", icon: "🔧" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const Index = () => {
  const { data: featuredStores } = useQuery({
    queryKey: ["featured-stores"],
    queryFn: async () => {
      const { data } = await supabase.from("stores").select("id, name_ar, category, slug, logo_url, short_description_ar").eq("featured", true).eq("status", "leased").limit(6);
      return data ?? [];
    },
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").eq("featured", true).order("event_date", { ascending: true }).limit(3);
      return data ?? [];
    },
  });

  const { data: faqs } = useQuery({
    queryKey: ["home-faqs"],
    queryFn: async () => {
      const { data } = await supabase.from("faqs").select("*").order("sort_order").limit(5);
      return data ?? [];
    },
  });

  return (
    <MainLayout>
      <SEOHead
        title="الرئيسية"
        description="مول البستان - وجهة التكنولوجيا الأولى في القاهرة الجديدة. أكثر من 150 متجراً للتكنولوجيا والإلكترونيات. افتتاح 1 مايو 2026."
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="مول البستان" width={1920} height={1080} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="container relative z-10 text-center py-20">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <p className="text-accent text-sm font-semibold mb-4 tracking-wider">القاهرة الجديدة • مدينتي • الرحاب</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-gradient-blue">مول البستان</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto mb-2 font-light">
              وجهة التكنولوجيا الأولى في مصر
            </p>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              أحدث المنتجات التقنية وأفضل العلامات التجارية العالمية في تجربة تسوق فريدة
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <p className="text-sm text-muted-foreground mb-4">العد التنازلي للافتتاح الكبير</p>
            <CountdownTimer />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-wrap gap-4 justify-center mt-10">
            <Link to="/spin-win">
              <Button variant="cta" size="lg" className="text-lg px-8">🎡 أدر واربح</Button>
            </Link>
            <Link to="/map">
              <Button variant="outline-blue" size="lg" className="text-lg px-8">🗺️ تصفح الخريطة</Button>
            </Link>
            <Link to="/leasing">
              <Button variant="orange" size="lg" className="text-lg px-8">🏢 احجز وحدتك</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-card">
        <div className="container">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-center mb-14">
            لماذا <span className="text-gradient-blue">مول البستان</span>؟
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to={feature.link} className="block p-6 rounded-xl bg-secondary/50 border border-border hover:border-primary/40 hover:glow-blue transition-all duration-300 group h-full">
                  <feature.icon className={`w-10 h-10 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">تسوّق حسب <span className="text-gradient-blue">الفئة</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to={`/stores?category=${encodeURIComponent(cat.name)}`} className="block text-center p-6 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 transition-all group">
                  <span className="text-3xl block mb-3">{cat.icon}</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      {featuredStores && featuredStores.length > 0 && (
        <section className="py-20 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">متاجر <span className="text-gradient-blue">مميزة</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStores.map((store) => (
                <Link key={store.id} to={`/stores/${store.slug}`} className="card-premium p-6 hover:glow-blue transition-all group">
                  <div className="flex items-center gap-4 mb-3">
                    {store.logo_url ? (
                      <img src={store.logo_url} alt={store.name_ar} className="w-12 h-12 rounded-lg object-cover" loading="lazy" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center"><Store className="w-6 h-6 text-primary" /></div>
                    )}
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{store.name_ar}</h3>
                      {store.category && <span className="text-xs text-accent">{store.category}</span>}
                    </div>
                  </div>
                  {store.short_description_ar && <p className="text-sm text-muted-foreground">{store.short_description_ar}</p>}
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/stores"><Button variant="outline-blue">عرض جميع المتاجر</Button></Link>
            </div>
          </div>
        </section>
      )}

      {/* Events Preview */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">فعاليات <span className="text-gradient-blue">الافتتاح</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="card-premium p-6">
                  {event.image_url && <img src={event.image_url} alt={event.title_ar} className="w-full h-40 object-cover rounded-lg mb-4" loading="lazy" />}
                  <h3 className="font-bold text-lg text-foreground mb-2">{event.title_ar}</h3>
                  {event.description_ar && <p className="text-sm text-muted-foreground mb-3">{event.description_ar}</p>}
                  <div className="flex items-center gap-2 text-xs text-accent">
                    <Calendar className="w-4 h-4" />
                    <span>{event.event_date}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/opening-day"><Button variant="outline-blue">كل فعاليات يوم الافتتاح</Button></Link>
            </div>
          </div>
        </section>
      )}

      {/* Leasing CTA */}
      <section className="py-20 bg-card">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Building className="w-16 h-16 text-orange mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">وحدات تجارية <span className="text-orange">متاحة للتأجير</span></h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              انضم إلى أكبر تجمع تقني في القاهرة الجديدة. مساحات تجارية متنوعة بأسعار تنافسية وموقع استراتيجي.
            </p>
            <Link to="/leasing"><Button variant="orange" size="lg" className="text-lg px-10">استفسر الآن</Button></Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            <HelpCircle className="w-8 h-8 text-accent inline-block ml-2" />
            الأسئلة <span className="text-gradient-blue">الشائعة</span>
          </h2>
          {faqs && faqs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="card-premium px-6">
                  <AccordionTrigger className="text-foreground font-semibold hover:text-primary">
                    {faq.question_ar}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer_ar}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>سيتم إضافة الأسئلة الشائعة قريباً</p>
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/faq"><Button variant="ghost" className="text-primary">عرض كل الأسئلة الشائعة</Button></Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
