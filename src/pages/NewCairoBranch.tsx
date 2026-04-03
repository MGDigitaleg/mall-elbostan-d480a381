import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { MapPin, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import entranceImage from "@/assets/mall-entrance.jpg";
import { LocationMapSection } from "@/components/location/LocationMapSection";

const NewCairoBranch = () => (
  <MainLayout>
    <SEOHead title="فرع القاهرة الجديدة" titleEn="New Cairo Branch" description="مول البستان - فرع القاهرة الجديدة. الموقع والتفاصيل." descriptionEn="Mall Elbostan New Cairo branch location and details." breadcrumbs={[{ name: "فرع القاهرة الجديدة", url: "/new-cairo-branch" }]} />

    {/* Hero with entrance image */}
    <section className="relative min-h-[44vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={entranceImage}
          alt="مدخل مول البستان - فرع القاهرة الجديدة"
          className="w-full h-full object-cover object-[center_48%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/84 via-background/38 to-background/8" />
      </div>
      <div className="container relative z-10 pb-12 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-accent text-sm font-semibold mb-3 tracking-wider">زوروا فرعنا</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">فرع <span className="text-gradient-blue">القاهرة الجديدة</span></h1>
        </motion.div>
      </div>
    </section>

    <div className="container py-16 max-w-4xl">
        <div className="space-y-6 text-foreground/90 leading-relaxed">
        <p>يقع الفرع في موقع استراتيجي بقلب القاهرة الجديدة — يخدم سكان مدينتي والرحاب والتجمعات المحيطة ضمن منطقة طلب متنامٍ على التقنية.</p>
        <div className="surface-panel mt-8 rounded-[1.75rem] p-8">
          <h2 className="text-xl font-bold text-foreground mb-6">معلومات الفرع</h2>
          <div className="space-y-4 text-muted-foreground">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <div><strong className="text-foreground">العنوان:</strong> سيتم الإعلان عنه قريبا</div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <div><strong className="text-foreground">مواعيد العمل:</strong> سيتم الإعلان عنها عند الافتتاح</div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <div><strong className="text-foreground">للاستفسار:</strong> تواصل معنا عبر صفحة الاتصال</div>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/contact">
              <Button variant="outline-blue">تواصل معنا</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
);

export default NewCairoBranch;
