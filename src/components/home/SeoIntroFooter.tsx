import { Link } from "react-router-dom";

/**
 * SEO footer content for homepage.
 * Provides keyword-rich internal linking and topical relevance for crawlers.
 */
export function SeoIntroFooter() {
  return (
    <section
      className="bg-card dark:bg-background border-t border-border/30"
      style={{ paddingTop: "clamp(24px, 3vw, 40px)", paddingBottom: "clamp(24px, 3vw, 40px)" }}
    >
      <div className="container max-w-4xl">
        <h2 className="text-[0.88rem] font-bold text-foreground mb-3" style={{ fontFamily: "var(--font-arabic-display)" }}>
          لماذا مول البستان؟
        </h2>
        <div className="text-[0.76rem] leading-[2.1] text-muted-foreground space-y-3">
          <p>
            <strong className="text-foreground">مول البستان</strong> هو أول مول متخصص في
            الكمبيوتر والإلكترونيات في مصر منذ عام 1990. يضم المول أكثر من 150 محل تجاري
            متخصص على 3 أدوار، ويقع في قلب التجمع الخامس بالقاهرة الجديدة.
          </p>
          <p>
            يمكنك العثور على{" "}
            <Link to="/stores?category=الكمبيوتر والأجهزة" className="text-primary font-semibold hover:underline">محلات الكمبيوتر واللابتوبات</Link>، {" "}
            <Link to="/stores?category=الهواتف والإكسسوارات" className="text-primary font-semibold hover:underline">محلات الموبايلات والإكسسوارات</Link>، {" "}
            <Link to="/stores?category=الألعاب والترفيه" className="text-primary font-semibold hover:underline">محلات الجيمنج والألعاب</Link>، {" "}
            <Link to="/stores?category=الطباعة والتصوير" className="text-primary font-semibold hover:underline">محلات الطباعة والتصوير</Link>، {" "}
            <Link to="/stores?category=الشبكات والأنظمة الأمنية" className="text-primary font-semibold hover:underline">محلات الشبكات والأنظمة الأمنية</Link>، {" "}
            و<Link to="/stores?category=الصيانة والدعم الفني" className="text-primary font-semibold hover:underline">خدمات الصيانة والدعم الفني</Link>.
          </p>
          <p>
            استخدم <Link to="/map" className="text-primary font-semibold hover:underline">الخريطة التفاعلية</Link>{" "}
            لتصفح المحلات على كل دور، أو تصفّح{" "}
            <Link to="/products" className="text-primary font-semibold hover:underline">كتالوج المنتجات</Link>{" "}
            لمقارنة الأسعار. للمستثمرين،{" "}
            <Link to="/leasing" className="text-primary font-semibold hover:underline">وحدات تجارية متاحة للإيجار</Link>{" "}
            بمساحات متنوعة.
          </p>
          <p>
            يخدم مول البستان سكان{" "}
            <strong className="text-foreground">القاهرة الجديدة</strong>، {" "}
            <strong className="text-foreground">مدينتي</strong>، {" "}
            <strong className="text-foreground">الرحاب</strong>، والمناطق المحيطة.{" "}
            <Link to="/about" className="text-primary font-semibold hover:underline">اعرف المزيد عن المول</Link>{" "}
            أو <Link to="/contact" className="text-primary font-semibold hover:underline">تواصل مع الفريق</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
