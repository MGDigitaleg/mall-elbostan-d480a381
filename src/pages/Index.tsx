import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Store, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import heroImage from "@/assets/hero-mall.jpg";

const features = [
  {
    icon: Store,
    title: "أكثر من ١٥٠ متجراً",
    desc: "أفضل العلامات التجارية العالمية في التكنولوجيا",
    link: "/stores",
  },
  {
    icon: MapPin,
    title: "خريطة تفاعلية",
    desc: "تنقل بسهولة داخل المول واعثر على وجهتك",
    link: "/map",
  },
  {
    icon: Calendar,
    title: "يوم الافتتاح",
    desc: "احتفالية كبرى بعروض وجوائز حصرية",
    link: "/opening-day",
  },
  {
    icon: Sparkles,
    title: "أدر واربح",
    desc: "جوائز يومية قيّمة في انتظارك",
    link: "/spin-win",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="مول البستان - مول التكنولوجيا الأول في مصر"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="container relative z-10 text-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-gradient-gold">مول البستان</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto mb-4 font-light">
              وجهة التكنولوجيا الأولى في مصر
            </p>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10">
              اكتشف أحدث المنتجات التقنية وأفضل العلامات التجارية العالمية في تجربة تسوق فريدة من نوعها
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/stores">
              <Button size="lg" className="bg-gradient-gold text-primary-foreground font-bold text-lg px-8 glow-gold hover:opacity-90">
                اكتشف المتاجر
              </Button>
            </Link>
            <Link to="/leasing">
              <Button size="lg" variant="outline" className="border-gold text-primary font-bold text-lg px-8 hover:bg-primary/10">
                احجز مساحتك
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-card">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-14"
          >
            لماذا <span className="text-gradient-gold">مول البستان</span>؟
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link
                  to={feature.link}
                  className="block p-6 rounded-xl bg-secondary/50 border border-border hover:border-primary/40 hover:glow-gold transition-all duration-300 group h-full"
                >
                  <feature.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              مستعد لتجربة <span className="text-gradient-gold">المستقبل</span>؟
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              سجّل الآن لتكون أول من يعرف عن عروضنا وفعالياتنا القادمة
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-gradient-gold text-primary-foreground font-bold glow-gold hover:opacity-90">
                تواصل معنا
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
