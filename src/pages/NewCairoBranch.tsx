import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import {
  Compass, ShoppingBag, Layers, Store, Gift, ArrowLeft, MapPin, Phone,
  Building2, Cpu, Gamepad2, Monitor, Award, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LocationMapSection, NEW_CAIRO_LOCATION } from "@/components/location/LocationMapSection";
import { BranchHeroSlider } from "@/components/branch/BranchHeroSlider";
import { CountdownTimer } from "@/components/CountdownTimer";

import ncHero1 from "@/assets/nc-hero-1-enhanced.webp";
import ncHero2 from "@/assets/nc-hero-2-enhanced.webp";
import ncHero3 from "@/assets/nc-hero-3-enhanced.webp";
import ncHero4 from "@/assets/nc-hero-4-enhanced.webp";

const heroSlides = [
  { src: ncHero1, alt: "مدخل مول البستان — فرع القاهرة الجديدة" },
  { src: ncHero3, alt: "مول البستان — التصميم الداخلي" },
  { src: ncHero4, alt: "واجهة مول البستان — القاهرة الجديدة" },
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
        subtitle="نفس الاسم ونفس الثقة — مع دليل رقمي وخريطة تفاعلية."
      >
        <div className="mt-4">
          <CountdownTimer compact />
        </div>
      </BranchHeroSlider>

      {/* ═══════════ 2 · IDENTITY INTRO ═══════════ */}
      <section className="py-10 md:py-14" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-5xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="max-w-2xl mx-auto text-center">
              <p className="section-kicker">الفصل الجديد</p>
              <h2 className="section-title">نفس الاسم — فرع جديد.</h2>
              <p className="mt-3 text-[0.86rem] leading-[1.85] text-muted-foreground max-w-xl mx-auto">
                خريطة تفاعلية، دليل محلات، ومنتجات من المحلات — في موقع يخدم مدينتي والرحاب والتجمعات المحيطة.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 3 · QUICK FACTS (Dark Premium) ═══════════ */}
      <section className="relative overflow-hidden py-12 md:py-16" style={{ background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)" }}>
        {/* Decorative */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="container relative max-w-5xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Building2, title: "موقع استراتيجي", desc: "في قلب التجمع الخامس.", color: "#2563EB" },
                { icon: Cpu, title: "رقمي بالكامل", desc: "خريطة وسوق إلكتروني.", color: "#06B6D4" },
                { icon: Users, title: "مجتمع متنامي", desc: "يخدم مدينتي والرحاب.", color: "#F97316" },
                { icon: Award, title: "اسم موثوق", desc: "امتداد لإرث البستان.", color: "#10B981" },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl p-5 transition-all hover:bg-white/[0.04]"
                  style={{ background: "#ffffff05", border: "1px solid #ffffff0D" }}
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `${c.color}15`, border: `1px solid ${c.color}28` }}
                  >
                    <c.icon className="h-5 w-5" style={{ color: c.color }} />
                  </div>
                  <p className="text-[0.88rem] font-bold" style={{ color: "#F1F5F9" }}>{c.title}</p>
                  <p className="mt-1 text-[0.8rem] leading-relaxed" style={{ color: "#94A3B8" }}>{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                { v: `+${storeCount && storeCount > 27 ? storeCount : 60}`, l: "محل" },
                { v: "10", l: "فئات تقنية" },
                { v: "3", l: "أدوار" },
                { v: "سوق", l: "منتجات رقمي" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl px-4 py-5 text-center"
                  style={{ background: "#ffffff06", border: "1px solid #ffffff0D" }}
                >
                  <p className="font-poppins text-[1.4rem] font-extrabold" style={{ color: "#F8FAFC" }}>{s.v}</p>
                  <p className="mt-1 text-[0.72rem] font-semibold" style={{ color: "#7C8BA1" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 4 · GALLERY MOSAIC ═══════════ */}
      <section className="py-10 md:py-14" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-5xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <p className="section-kicker mb-4">من داخل المول</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl">
                <img src={ncHero1} alt="مدخل مول البستان — القاهرة الجديدة" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              </div>
              <div className="overflow-hidden rounded-2xl">
                <img src={ncHero2} alt="المبنى من الخارج" className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              </div>
              <div className="overflow-hidden rounded-2xl">
                <img src={ncHero3} alt="التصميم الداخلي" className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              </div>
              <div className="col-span-2 overflow-hidden rounded-2xl">
                <img src={ncHero4} alt="واجهة المول" className="aspect-[2/1] w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 5 · STORE DIRECTORY TEASER (Dark) ═══════════ */}
      <section className="relative overflow-hidden py-10 md:py-14" style={{ background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-[20%] w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #CDBB9A, transparent 70%)" }} />
        </div>

        <div className="container relative max-w-5xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-4" style={{ background: "#CDBB9A14", border: "1px solid #CDBB9A25" }}>
                  <Store className="h-3 w-3" style={{ color: "#CDBB9A" }} />
                  <span className="text-[0.66rem] font-bold" style={{ color: "#CDBB9A" }}>دليل المحلات</span>
                </div>
                <h2 className="text-[1.2rem] md:text-[1.4rem] font-bold leading-[1.15] max-w-[20rem]" style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}>
                  تصفّح محلات الفرع الجديد.
                </h2>
                <p className="mt-3 text-[0.84rem] leading-[1.85] max-w-md" style={{ color: "#94A3B8" }}>
                  هواتف، لابتوبات، ألعاب، إكسسوارات، وصيانة — كل ما يحتاجه السوق تحت سقف واحد في التجمع الخامس.
                </p>

                {/* Featured store logos */}
                {featuredStores && featuredStores.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {featuredStores.slice(0, 6).map((s) => (
                      <Link
                        key={s.id}
                        to={`/stores/${s.slug}`}
                        className="flex h-11 w-11 items-center justify-center rounded-xl transition-all hover:bg-white/[0.08]"
                        style={{ background: "#ffffff08", border: "1px solid #ffffff12" }}
                        title={s.name_ar}
                      >
                        {s.logo_url ? (
                          <img src={s.logo_url} alt={s.name_ar} className="h-7 w-7 object-contain" loading="lazy" />
                        ) : (
                          <Store className="h-4 w-4" style={{ color: "#7C8BA1" }} />
                        )}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link to="/stores">
                    <Button variant="cta" className="h-10 rounded-xl px-6 text-[0.82rem] font-bold gap-1.5 shadow-lg shadow-primary/20">
                      <Store className="h-3.5 w-3.5" /> جميع المحلات
                    </Button>
                  </Link>
                  <Link to="/map">
                    <Button
                      className="h-10 rounded-xl border px-5 text-[0.82rem] font-bold transition-colors hover:bg-white/[0.06] gap-1.5"
                      style={{ borderColor: "#ffffff18", background: "#ffffff06", color: "#CBD5E1" }}
                    >
                      <Compass className="h-3.5 w-3.5" /> الخريطة التفاعلية
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: Monitor, title: "كمبيوتر ولابتوب", desc: "أحدث الأجهزة والمكونات.", color: "#2563EB" },
                  { icon: Cpu, title: "هواتف وإكسسوارات", desc: "كل العلامات التجارية.", color: "#06B6D4" },
                  { icon: Gamepad2, title: "ألعاب وقيمنق", desc: "أجهزة ومعدات الجيمنق.", color: "#F97316" },
                  { icon: Layers, title: "صيانة وقطع غيار", desc: "فنيون متخصصون.", color: "#10B981" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl p-4 transition-all hover:bg-white/[0.04]"
                    style={{ background: "#ffffff05", border: "1px solid #ffffff0D" }}
                  >
                    <div
                      className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ background: `${item.color}15`, border: `1px solid ${item.color}28` }}
                    >
                      <item.icon className="h-4 w-4" style={{ color: item.color }} />
                    </div>
                    <p className="text-[0.82rem] font-bold" style={{ color: "#F1F5F9" }}>{item.title}</p>
                    <p className="mt-0.5 text-[0.72rem]" style={{ color: "#7C8BA1" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 6 · LOCATION MAP ═══════════ */}
      <LocationMapSection {...NEW_CAIRO_LOCATION} />

      {/* ═══════════ 7 · FEATURED PRODUCTS ═══════════ */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-10 md:py-14" style={{ background: "#FAFAF8" }}>
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-xl border border-border bg-border">
                {featuredProducts.map((p) => {
                  const store = (p as Record<string, unknown>).stores as { name_ar: string } | null;
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

      {/* ═══════════ 8 · CTA (Dark Premium) ═══════════ */}
      <section className="relative overflow-hidden py-14 md:py-20" style={{ background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="container relative max-w-[740px] text-center">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {/* Divider accent */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 rounded-full" style={{ background: "linear-gradient(to left, #CDBB9A, transparent)" }} />
              <span className="font-poppins text-[0.6rem] font-bold tracking-[0.22em] uppercase" style={{ color: "#CDBB9A" }}>ابدأ الاستكشاف</span>
              <div className="h-px w-12 rounded-full" style={{ background: "linear-gradient(to right, #CDBB9A, transparent)" }} />
            </div>

            <h2 className="text-[1.2rem] md:text-[1.5rem] font-bold leading-[1.15]" style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}>
              ابدأ من هنا.
            </h2>
            <p className="mt-2 text-[0.84rem] max-w-sm mx-auto" style={{ color: "#94A3B8" }}>
              دليل المحلات، الخريطة التفاعلية، ومنتجات المحلات — كل شيء في مكان واحد.
            </p>

            {/* Contact cards */}
            <div className="mt-6 mx-auto max-w-md grid grid-cols-2 gap-2.5">
              <div className="rounded-xl p-4 text-right" style={{ background: "#ffffff05", border: "1px solid #ffffff0D" }}>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "#2563EB15", border: "1px solid #2563EB28" }}>
                  <MapPin className="h-4 w-4" style={{ color: "#2563EB" }} />
                </div>
                <p className="text-[0.68rem] font-semibold" style={{ color: "#7C8BA1" }}>العنوان</p>
                <p className="mt-0.5 text-[0.78rem] font-bold" style={{ color: "#F1F5F9" }}>الحى الأول، مركز الخدمات، التجمع الخامس</p>
              </div>
              <div className="rounded-xl p-4 text-right" style={{ background: "#ffffff05", border: "1px solid #ffffff0D" }}>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "#06B6D415", border: "1px solid #06B6D428" }}>
                  <Phone className="h-4 w-4" style={{ color: "#06B6D4" }} />
                </div>
                <p className="text-[0.68rem] font-semibold" style={{ color: "#7C8BA1" }}>تواصل</p>
                <p className="mt-0.5 text-[0.78rem] font-bold" style={{ color: "#F1F5F9" }}>عبر صفحة الاتصال</p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              <Link to="/map">
                <Button variant="cta" className="h-10 rounded-xl px-6 text-[0.82rem] font-bold gap-1.5 shadow-lg shadow-primary/20">
                  <Compass className="h-3.5 w-3.5" /> استكشف الخريطة
                </Button>
              </Link>
              <Link to="/stores">
                <Button
                  className="h-10 rounded-xl border px-5 text-[0.82rem] font-bold transition-colors hover:bg-white/[0.06]"
                  style={{ borderColor: "#ffffff18", background: "#ffffff06", color: "#CBD5E1" }}
                >
                  دليل المحلات
                </Button>
              </Link>
              <Link to="/spin-win">
                <Button
                  className="h-10 rounded-xl border px-4 text-[0.82rem] gap-1.5 transition-colors hover:bg-white/[0.06]"
                  style={{ borderColor: "#ffffff10", background: "transparent", color: "#7C8BA1" }}
                >
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
