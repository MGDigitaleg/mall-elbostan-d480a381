import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Compass, ShoppingBag, Layers, Store, Gift, ArrowLeft, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LocationMapSection, NEW_CAIRO_LOCATION } from "@/components/location/LocationMapSection";
import { BranchHeroSlider } from "@/components/branch/BranchHeroSlider";
import { CountdownTimer } from "@/components/CountdownTimer";

import mallEntrancePolished from "@/assets/mall-entrance-polished.jpg";
import mallExteriorPolished from "@/assets/mall-exterior-polished.jpg";
import mallInterior from "@/assets/mall-interior.jpg";
import mallFacade from "@/assets/mall-facade.jpg";

const heroSlides = [
  { src: mallEntrancePolished, alt: "مدخل مول البستان — فرع القاهرة الجديدة" },
  { src: mallExteriorPolished, alt: "مول البستان — الواجهة الخارجية، القاهرة الجديدة" },
  { src: mallInterior, alt: "مول البستان — التصميم الداخلي" },
  { src: mallFacade, alt: "واجهة مول البستان — القاهرة الجديدة" },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const NewCairoBranch = () => {
  const { data: storeCount } = useQuery({
    queryKey: ["nc-store-count"],
    queryFn: async () => {
      const { count } = await supabase.from("stores").select("*", { count: "exact", head: true }).neq("status", "hidden");
      return count ?? 0;
    },
  });

  const { data: featuredStores } = useQuery({
    queryKey: ["nc-featured-stores"],
    queryFn: async () => {
      const { data } = await supabase
        .from("stores")
        .select("id, name_ar, slug, logo_url, category, unit_code")
        .eq("featured", true)
        .neq("status", "hidden")
        .limit(6);
      return data ?? [];
    },
  });

  const { data: featuredProducts } = useQuery({
    queryKey: ["nc-featured-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name_ar, slug, price, price_note, image_url, stores(name_ar)")
        .eq("status", "published")
        .eq("featured", true)
        .limit(4);
      return data ?? [];
    },
  });

  return (
    <MainLayout>
      <SEOHead
        title="فرع القاهرة الجديدة"
        titleEn="New Cairo Branch"
        description="مول البستان — فرع القاهرة الجديدة. الامتداد الحديث لأعرق وجهة تقنية في مصر، في قلب التجمع الخامس."
        breadcrumbs={[{ name: "فرع القاهرة الجديدة", url: "/new-cairo-branch" }]}
      />

      {/* ═══════════ 1 · HERO ═══════════ */}
      <BranchHeroSlider
        slides={heroSlides}
        kicker="الفرع الجديد — التجمع الخامس"
        title={<>مول البستان — <span className="text-primary">القاهرة الجديدة</span></>}
        subtitle="الامتداد الحديث لأعرق وجهة تقنية في مصر — منظم، رقمي، وجاهز."
      >
        <div className="mt-4">
          <CountdownTimer compact />
        </div>
      </BranchHeroSlider>

      {/* ═══════════ 2 · IDENTITY INTRO ═══════════ */}
      <section className="py-9 md:py-12 bg-card">
        <div className="container max-w-5xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="max-w-2xl mx-auto text-center">
              <p className="section-kicker">الفصل الجديد</p>
              <h2 className="section-title">نفس الاسم — تجربة جديدة.</h2>
              <p className="mt-3 text-[0.86rem] leading-[1.85] text-muted-foreground max-w-xl mx-auto">
                فرع القاهرة الجديدة يقدم تجربة منظمة ورقمية بالكامل — خريطة تفاعلية، دليل محلات ذكي، وسوق منتجات متكامل — في موقع يخدم مدينتي والرحاب والتجمعات المحيطة.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 3 · QUICK FACTS ═══════════ */}
      <section className="py-8 md:py-10 bg-background">
        <div className="container max-w-5xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Store, value: `${storeCount ?? 27}`, label: "محل نشط", desc: "محلات تقنية متخصصة." },
                { icon: Layers, value: "6", label: "فئات تقنية", desc: "هواتف، كمبيوتر، ألعاب، وأكثر." },
                { icon: Compass, value: "3", label: "أدوار", desc: "خريطة تفاعلية لكل دور." },
                { icon: ShoppingBag, value: "سوق", label: "منتجات رقمي", desc: "تصفّح واطلب مباشرة." },
              ].map((c) => (
                <div key={c.label} className="rounded-lg border border-border bg-card p-4 text-center transition-all hover:shadow-[var(--shadow-card)]">
                  <c.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <p className="font-poppins text-[1.4rem] font-extrabold text-foreground">{c.value}</p>
                  <p className="text-[0.78rem] font-bold text-foreground">{c.label}</p>
                  <p className="mt-0.5 text-[0.72rem] text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 4 · LOCATION MAP ═══════════ */}
      <LocationMapSection {...NEW_CAIRO_LOCATION} />

      {/* ═══════════ 5 · FEATURED STORES ═══════════ */}
      {featuredStores && featuredStores.length > 0 && (
        <section className="py-9 md:py-12 bg-card">
          <div className="container max-w-5xl">
            <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="section-kicker">محلات مميزة</p>
                  <h2 className="section-title">أبرز محلات الفرع.</h2>
                </div>
                <Link to="/stores" className="hidden lg:inline-flex">
                  <Button variant="ghost" className="gap-1 text-[0.78rem] font-bold text-primary">
                    جميع المحلات <ArrowLeft className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {featuredStores.map((s) => (
                  <Link
                    key={s.id}
                    to={`/stores/${s.slug}`}
                    className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-3 text-center transition-all hover:shadow-[var(--shadow-card)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
                      {s.logo_url ? (
                        <img src={s.logo_url} alt={s.name_ar} className="h-10 w-10 object-contain" loading="lazy" />
                      ) : (
                        <Store className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <p className="text-[0.76rem] font-bold text-foreground line-clamp-1">{s.name_ar}</p>
                    {s.category && <p className="text-[0.64rem] text-muted-foreground line-clamp-1">{s.category}</p>}
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex justify-center lg:hidden">
                <Link to="/stores">
                  <Button variant="secondary" className="h-9 rounded-lg px-5 text-[0.78rem] font-bold">جميع المحلات</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════ 6 · FEATURED PRODUCTS ═══════════ */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-8 md:py-10 bg-background">
          <div className="container max-w-5xl">
            <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="section-kicker">منتجات مميزة</p>
                  <h2 className="section-title">أحدث المنتجات من المحلات.</h2>
                </div>
                <Link to="/products" className="hidden lg:inline-flex">
                  <Button variant="ghost" className="gap-1 text-[0.78rem] font-bold text-primary">
                    عرض الكل <ArrowLeft className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-lg border border-border bg-border">
                {featuredProducts.map((p) => {
                  const store = (p as any).stores;
                  return (
                    <Link key={p.id} to={`/products/${p.slug}`} className="group flex flex-col bg-card transition-colors hover:bg-secondary/30">
                      <div className="flex aspect-square items-center justify-center p-3 bg-white">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name_ar} className="h-full w-full object-contain transition-transform group-hover:scale-105" loading="lazy" />
                        ) : (
                          <ShoppingBag className="h-6 w-6 text-muted-foreground/20" />
                        )}
                      </div>
                      <div className="border-t border-border p-2.5">
                        <p className="text-[0.74rem] font-bold text-foreground line-clamp-2">{p.name_ar}</p>
                        {store && <p className="mt-0.5 text-[0.62rem] text-muted-foreground flex items-center gap-1"><Store className="h-2.5 w-2.5" />{store.name_ar}</p>}
                        {p.price ? (
                          <p className="mt-1 font-poppins text-[0.78rem] font-bold text-primary">{Number(p.price).toLocaleString("ar-EG")} ج.م</p>
                        ) : p.price_note ? (
                          <p className="mt-1 text-[0.68rem] font-semibold text-primary">{p.price_note}</p>
                        ) : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-3 flex justify-center lg:hidden">
                <Link to="/products">
                  <Button variant="secondary" className="h-9 rounded-lg px-5 text-[0.78rem] font-bold">جميع المنتجات</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════ 7 · CTA ═══════════ */}
      <section className="heritage-deep py-10 md:py-14 relative overflow-hidden">
        <div className="container max-w-3xl relative text-center">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="section-kicker dark-kicker">ابدأ الاستكشاف</p>
            <h2 className="section-title dark-heading">المول جاهز — اكتشفه الآن.</h2>
            <p className="mt-2 text-[0.84rem] text-navy-foreground/60 max-w-sm mx-auto">
              خريطة تفاعلية، دليل محلات، وسوق منتجات — كل شيء في مكان واحد.
            </p>

            <div className="mt-4 mx-auto max-w-md space-y-2 text-[0.82rem] text-navy-foreground/70 text-right">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>الحى الأول، مركز الخدمات، خلف محكمة القاهرة الجديدة، التجمع الخامس</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>تواصل معنا عبر صفحة الاتصال</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              <Link to="/map">
                <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.8rem] font-bold gap-1.5">
                  <Compass className="h-3.5 w-3.5" /> استكشف الخريطة
                </Button>
              </Link>
              <Link to="/stores">
                <Button className="h-9 rounded-lg border px-5 text-[0.8rem] font-bold" style={{ borderColor: "hsl(var(--navy-foreground) / 0.15)", background: "hsl(var(--navy-foreground) / 0.05)", color: "hsl(var(--navy-foreground) / 0.85)" }}>
                  دليل المحلات
                </Button>
              </Link>
              <Link to="/spin-win">
                <Button variant="ghost" className="h-9 rounded-lg px-4 text-[0.8rem] gap-1.5" style={{ color: "hsl(var(--navy-foreground) / 0.6)" }}>
                  <Gift className="h-3.5 w-3.5" /> أدر واربح
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default NewCairoBranch;
