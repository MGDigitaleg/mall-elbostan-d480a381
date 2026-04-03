import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Gift, MapPin, Sparkles, Store, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import { SEOHead, organizationLd } from "@/components/SEOHead";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Button } from "@/components/ui/button";

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

const CampaignHome = () => {
  const { data: featuredStores } = useQuery({
    queryKey: ["campaign-stores"],
    queryFn: async () => {
      const { data } = await supabase
        .from("stores")
        .select("id, name_ar, logo_url, slug, category")
        .eq("featured", true)
        .eq("status", "leased")
        .limit(6);
      return data ?? [];
    },
  });

  const { data: prizes } = useQuery({
    queryKey: ["campaign-prizes"],
    queryFn: async () => {
      const { data } = await supabase
        .from("store_prizes")
        .select("id, name_ar, image_url, competition_store_id")
        .eq("is_active", true)
        .limit(4);
      return data ?? [];
    },
  });

  return (
    <>
      <SEOHead
        title="مول البستان — الافتتاح الكبير قريبًا"
        titleEn="Mall Elbostan — Grand Opening Soon"
        description="الافتتاح الكبير لمول البستان 1 مايو 2026 — أكثر من 150 وحدة تجارية للإلكترونيات والتقنية في القاهرة الجديدة. شارك في المكافآت واستكشف الخريطة."
        descriptionEn="Mall Elbostan grand opening May 1, 2026. 150+ tech retail units in New Cairo. Join rewards and explore the map."
        jsonLd={[organizationLd]}
      />

      {/* ═══ HERO ═══ */}
      <section
        className="relative overflow-hidden min-h-screen flex flex-col"
        style={{ background: "linear-gradient(170deg, hsl(222 36% 7%) 0%, hsl(222 32% 11%) 100%)" }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 55% at 50% 40%, hsl(222 58% 42% / 0.08), transparent 70%)" }}
        />

        {/* Inline logo */}
        <div className="relative z-10 flex justify-center pt-8 md:pt-10">
          <Link to="/" aria-label="مول البستان">
            <BrandLogo className="h-12 md:h-14" align="center" />
          </Link>
        </div>

        <div className="relative flex-1 flex items-center justify-center mx-auto w-full max-w-[1100px] px-5 md:px-8 lg:px-14 py-10 md:py-16 text-center">
          <motion.div custom={0} variants={fade} initial="hidden" animate="visible">
            <div className="mx-auto mb-5 flex items-center justify-center gap-3">
              <div className="h-[2px] w-8" style={{ background: "hsl(222 58% 55% / 0.5)" }} />
              <span
                className="font-poppins text-[0.72rem] font-semibold tracking-[0.2em] uppercase"
                style={{ color: "hsl(220 50% 68%)" }}
              >
                1 مايو 2026
              </span>
              <div className="h-[2px] w-8" style={{ background: "hsl(222 58% 55% / 0.5)" }} />
            </div>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fade}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-[32rem] text-[1.85rem] font-extrabold leading-[1.12] text-white md:text-[2.5rem] lg:text-[3rem]"
          >
            الافتتاح الكبير لمول البستان
          </motion.h1>

          <motion.p
            custom={2}
            variants={fade}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-4 max-w-[28rem] text-[0.95rem] leading-[2]"
            style={{ color: "hsl(220 14% 72%)" }}
          >
            وجهة الإلكترونيات والتقنية في القاهرة الجديدة — جوائز، عروض، وتجربة مختلفة من أول يوم.
          </motion.p>

          {/* Countdown */}
          <motion.div custom={3} variants={fade} initial="hidden" animate="visible" className="mt-10">
            <CountdownTimer />
          </motion.div>

          {/* CTAs */}
          <motion.div custom={4} variants={fade} initial="hidden" animate="visible" className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/spin-win">
              <Button variant="cta" size="lg" className="h-12 gap-2 rounded-xl px-8 font-bold">
                <Sparkles className="h-4 w-4" /> أدر واربح الآن
              </Button>
            </Link>
            <Link to="/map">
              <Button
                size="lg"
                className="h-12 gap-2 rounded-xl border border-white/12 bg-white/6 px-8 font-semibold text-white hover:bg-white/12"
              >
                <MapPin className="h-4 w-4" /> استكشف الخريطة
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ═══ PRIZES TEASER ═══ */}
      <section className="heritage-deep py-12 md:py-16">
        <div className="container max-w-[1000px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="mb-6 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: "hsl(var(--orange) / 0.08)", border: "1px solid hsl(var(--orange) / 0.15)" }}
              >
                <Gift className="h-5 w-5 text-orange" />
              </div>
              <div>
                <p className="section-kicker">المكافآت</p>
                <h2 className="text-lg font-bold text-white">جوائز تنتظرك يوم الافتتاح</h2>
              </div>
            </div>

            {prizes && prizes.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {prizes.map((prize) => (
                  <div
                    key={prize.id}
                    className="rounded-xl p-4 text-center"
                    style={{ background: "hsl(222 30% 10%)", border: "1px solid hsl(222 18% 18%)" }}
                  >
                    {prize.image_url && (
                      <img
                        src={prize.image_url}
                        alt={prize.name_ar}
                        className="mx-auto mb-3 h-16 w-16 rounded-lg object-contain"
                        loading="lazy"
                      />
                    )}
                    <p className="text-[0.82rem] font-semibold text-white">{prize.name_ar}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="rounded-xl p-8 text-center"
                style={{ background: "hsl(222 30% 10%)", border: "1px solid hsl(222 18% 18%)" }}
              >
                <Gift className="mx-auto mb-3 h-8 w-8" style={{ color: "hsl(var(--orange) / 0.5)" }} />
                <p className="text-[0.92rem] font-semibold text-white">جوائز مميزة قيد الإعلان</p>
                <p className="mt-1 text-sm" style={{ color: "hsl(220 12% 62%)" }}>
                  شارك في أدر واربح لتكون من أوائل الفائزين
                </p>
              </div>
            )}

            <div className="mt-5 text-center">
              <Link to="/spin-win">
                <Button variant="orange" size="lg" className="h-11 gap-2 rounded-xl px-7">
                  <Sparkles className="h-4 w-4" /> شارك الآن
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ MERCHANTS TEASER ═══ */}
      <section className="section-ivory py-12 md:py-16">
        <div className="container max-w-[1000px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="mb-6 flex items-center gap-3">
              <div className="icon-shell h-10 w-10">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="section-kicker">المتاجر</p>
                <h2 className="section-title">تعرّف على المتاجر المشاركة</h2>
              </div>
            </div>

            {featuredStores && featuredStores.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                {featuredStores.map((store) => (
                  <Link
                    key={store.id}
                    to={`/stores/${store.slug}`}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition hover:shadow-md"
                  >
                    {store.logo_url ? (
                      <img
                        src={store.logo_url}
                        alt={store.name_ar}
                        className="h-12 w-12 rounded-lg object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <Store className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-center text-[0.72rem] font-semibold text-foreground leading-tight">
                      {store.name_ar}
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to="/stores">
                <Button variant="outline-blue" size="lg" className="h-11 gap-2 rounded-xl px-7">
                  <ArrowLeft className="h-4 w-4" /> تصفح جميع المتاجر
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="secondary" size="lg" className="h-11 gap-2 rounded-xl px-7">
                  تصفح المنتجات
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ LEASING CTA ═══ */}
      <section
        className="py-12 md:py-16"
        style={{ background: "linear-gradient(170deg, hsl(222 36% 7%) 0%, hsl(222 32% 12%) 100%)" }}
      >
        <div className="container max-w-[700px] text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-xl font-bold text-white md:text-2xl">ابدأ مشروعك في مول البستان</h2>
            <p className="mx-auto mt-3 max-w-md text-[0.92rem] leading-[2]" style={{ color: "hsl(220 14% 72%)" }}>
              وحدات تجارية متاحة بمساحات متنوعة — تواصل معنا لحجز وحدتك أو طلب عرض سعر.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/leasing">
                <Button variant="cta" size="lg" className="h-11 rounded-xl px-8">
                  استعلم عن الوحدات المتاحة
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  className="h-11 rounded-xl border border-white/12 bg-white/6 px-8 font-semibold text-white hover:bg-white/12"
                >
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ MINI FOOTER ═══ */}
      <div className="py-6 text-center" style={{ background: "hsl(222 36% 5%)" }}>
        <div className="flex flex-wrap justify-center gap-4 text-[0.78rem] font-medium" style={{ color: "hsl(220 14% 55%)" }}>
          <Link to="/about" className="hover:text-white transition-colors">عن المول</Link>
          <Link to="/stores" className="hover:text-white transition-colors">المتاجر</Link>
          <Link to="/map" className="hover:text-white transition-colors">الخريطة</Link>
          <Link to="/contact" className="hover:text-white transition-colors">تواصل معنا</Link>
          <Link to="/terms" className="hover:text-white transition-colors">الشروط</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">الخصوصية</Link>
        </div>
        <p className="mt-3 text-[0.7rem]" style={{ color: "hsl(220 10% 40%)" }}>
          مول البستان {new Date().getFullYear()} — جميع الحقوق محفوظة
        </p>
      </div>
    </>
  );
};

export default CampaignHome;
