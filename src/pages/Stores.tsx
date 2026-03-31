import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Layers3, Search, Sparkles, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingGrid, EmptyState } from "@/components/ui/loading-states";
import entranceImage from "@/assets/mall-entrance.jpg";

const categoryStory: Record<string, { title: string; description: string }> = {
  "الهواتف والإكسسوارات": {
    title: "هواتف وحلول يومية سريعة",
    description: "فئة مصممة للمتاجر التي تقدّم أجهزة الهواتف، الإكسسوارات، والاحتياجات اليومية التقنية بجودة أوضح.",
  },
  "الكمبيوتر والأجهزة": {
    title: "أجهزة للعمل والدراسة والأداء",
    description: "مسار واضح للابتوبات، الملحقات، وحلول العمل المكتبي والإنتاجي داخل بيئة تقنية متخصصة.",
  },
  "الألعاب والترفيه": {
    title: "تجربة ألعاب أكثر حضورًا",
    description: "فئة تعكس جمهور الجيمينج والترفيه الرقمي ضمن تجربة بيع وعرض أكثر تنظيمًا وجاذبية.",
  },
  "الطباعة والتصوير": {
    title: "حلول للطباعة والصورة",
    description: "وجهة للأنشطة التي تخدم الأعمال، الطلاب، والمستخدمين الباحثين عن خدمات وتجهيزات تصوير وطباعة موثوقة.",
  },
  "الشبكات والحماية": {
    title: "بنية اتصال وحماية تقنية",
    description: "قسم يبرز حلول الشبكات، الحماية، والتجهيزات التي تخدم الأفراد والشركات الصغيرة والمتوسطة.",
  },
  "الصيانة والدعم الفني": {
    title: "خدمات ما بعد الشراء والدعم",
    description: "وجود هذه الفئة يضيف بعدًا عمليًا للمول عبر الصيانة، الدعم، والخدمات التقنية المستمرة.",
  },
};

const Stores = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const { data: stores, isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const { data } = await supabase.from("stores").select("id, slug, name_ar, category, short_description_ar, logo_url, status").neq("status", "hidden").order("featured", { ascending: false });
      return data ?? [];
    },
  });

  const categories = [...new Set(stores?.map((s) => s.category).filter(Boolean) ?? [])];
  const activeStory = selectedCategory ? categoryStory[selectedCategory] : null;

  const filtered = stores?.filter((s) => {
    const matchSearch = !search || s.name_ar.includes(search) || s.category?.includes(search);
    const matchCategory = !selectedCategory || s.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <MainLayout>
      <SEOHead title="دليل المتاجر" titleEn="Stores Directory" description="تصفح جميع المتاجر في مول البستان - أجهزة، هواتف، جيمنج، وأكثر." descriptionEn="Browse all stores at Mall Elbostan - phones, computers, gaming, and more." breadcrumbs={[{ name: "المتاجر", url: "/stores" }]} />
      <div className="container py-8 md:py-12">
        <section className="brand-shell mb-10 overflow-hidden rounded-[2.6rem] px-6 py-8 md:px-8 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-5">
              <div className="eyebrow-chip">
                <Sparkles className="h-4 w-4 text-accent" />
                دليل المتاجر والفئات التقنية
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.12] text-foreground md:text-[4rem]">استكشف متاجر مول البستان ضمن تجربة تصفح أكثر أناقة ووضوحًا</h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                صفحة المتاجر صُممت الآن كواجهة flagship توضح الفئات، تسهّل الوصول إلى المتاجر، وتربط تجربة التصفح الحالية بالرؤية الأوسع
                لـ Marketplace by Mall Elbostan لاحقًا.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "التركيز الحالي", value: "الفئات والمتاجر" },
                  { label: "المسار التالي", value: "الخريطة والتفاصيل" },
                  { label: "الامتداد القادم", value: "تجربة Marketplace" },
                ].map((item) => (
                  <div key={item.label} className="soft-card p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">{item.label}</p>
                    <p className="mt-2 text-base font-bold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-shell overflow-hidden rounded-[2.2rem] p-3 shadow-[var(--shadow-elevated)]">
              <div className="image-shell aspect-[16/11] overflow-hidden rounded-[1.8rem]">
                <img src={entranceImage} alt="مدخل مول البستان" className="h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-background/10" />
              </div>
              <div className="glass absolute bottom-7 right-7 max-w-xs rounded-[1.4rem] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Stores Experience</p>
                <p className="mt-2 text-base font-bold text-foreground">تصنيف أوضح للفئات ومسار أسرع للوصول إلى تفاصيل كل متجر</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell mb-10 rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="ابحث عن متجر أو فئة..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-12 border-border bg-background pr-10" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={selectedCategory === "" ? "default" : "outline"} className="cursor-pointer rounded-full px-4 py-2" onClick={() => setSelectedCategory("")}>الكل</Badge>
              {categories.map((cat) => (
                <Badge key={cat} variant={selectedCategory === cat ? "default" : "outline"} className="cursor-pointer rounded-full px-4 py-2" onClick={() => setSelectedCategory(cat ?? "")}>
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {activeStory ? (
            <div className="mt-5 rounded-[1.5rem] border border-border/70 bg-card/80 p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">قراءة الفئة الحالية</p>
                  <h2 className="mt-2 text-xl font-bold text-foreground">{activeStory.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{activeStory.description}</p>
                </div>
                <Layers3 className="mt-1 h-5 w-5 text-primary" />
              </div>
            </div>
          ) : null}
        </section>

        {isLoading ? (
          <LoadingGrid />
        ) : filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((store) => (
              <Link key={store.id} to={`/stores/${store.slug}`} className="section-shell group rounded-[1.9rem] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-premium)]">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {store.logo_url ? (
                      <img src={store.logo_url} alt={store.name_ar} className="h-14 w-14 rounded-[1rem] object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-primary/10"><Store className="h-6 w-6 text-primary" /></div>
                    )}
                    <div>
                      <h3 className="font-bold text-foreground transition-colors group-hover:text-primary">{store.name_ar}</h3>
                      {store.category && <span className="mt-1 inline-block text-xs text-accent">{store.category}</span>}
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${store.status === "available" ? "bg-orange/10 text-orange" : "bg-primary/10 text-primary"}`}>
                    {store.status === "available" ? "مساحة متاحة" : "نشط داخل المول"}
                  </span>
                </div>

                <div className="rounded-[1.3rem] border border-border/70 bg-card/70 p-4">
                  <p className="text-sm leading-7 text-muted-foreground">
                    {store.short_description_ar ?? "سيتم تحديث نبذة هذا المتجر قريبًا ضمن دليل المتاجر الكامل لمول البستان."}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>استكشف صفحة المتجر</span>
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="section-shell rounded-[1.8rem] p-10">
            <EmptyState title="لا توجد متاجر" description="لم يتم إضافة متاجر بعد. تابعنا للتحديثات القادمة داخل دليل مول البستان." />
          </div>
        )}

        <section className="section-soft mt-12 rounded-[2rem] px-6 py-8 md:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="section-kicker">السوق الإلكتروني القادم</p>
              <h2 className="section-title">الفئات الحالية تمهّد مباشرة لتجربة تصفح منتجات أكثر تطورًا لاحقًا</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                هيكلة الفئات والمتاجر هنا ليست فقط لدليل المتاجر، بل خطوة تأسيسية لتجربة Marketplace by Mall Elbostan حيث سيتمكن
                الزوار لاحقًا من متابعة المنتجات من متاجرهم التقنية المفضلة.
              </p>
            </div>
            <Link to="/#marketplace">
              <Button variant="outline-blue" size="lg">اكتشف رؤية السوق القادم</Button>
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Stores;
