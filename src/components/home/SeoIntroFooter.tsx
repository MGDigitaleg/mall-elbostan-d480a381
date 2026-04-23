import { Link } from "react-router-dom";
import { trackSeoLinkClick } from "@/lib/analytics";

const t = (label: string, to: string) => () =>
  trackSeoLinkClick("homepage_seo", to.includes("/stores/") ? "store" : to.includes("category=") ? "category" : "page", label, to);

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
            <Link to="/stores?category=الكمبيوتر والأجهزة" className="text-primary font-semibold hover:underline" onClick={t("الكمبيوتر واللابتوبات", "/stores?category=الكمبيوتر والأجهزة")}>محلات الكمبيوتر واللابتوبات</Link>، {" "}
            <Link to="/stores?category=الهواتف والإكسسوارات" className="text-primary font-semibold hover:underline" onClick={t("الموبايلات والإكسسوارات", "/stores?category=الهواتف والإكسسوارات")}>محلات الموبايلات والإكسسوارات</Link>، {" "}
            <Link to="/stores?category=الألعاب والترفيه" className="text-primary font-semibold hover:underline" onClick={t("الجيمنج والألعاب", "/stores?category=الألعاب والترفيه")}>محلات الجيمنج والألعاب</Link>، {" "}
            <Link to="/stores?category=الطباعة والتصوير" className="text-primary font-semibold hover:underline" onClick={t("الطباعة والتصوير", "/stores?category=الطباعة والتصوير")}>محلات الطباعة والتصوير</Link>، {" "}
            <Link to="/stores?category=الشبكات والأنظمة الأمنية" className="text-primary font-semibold hover:underline" onClick={t("الشبكات والأمن", "/stores?category=الشبكات والأنظمة الأمنية")}>محلات الشبكات والأنظمة الأمنية</Link>، {" "}
            و<Link to="/stores?category=الصيانة والدعم الفني" className="text-primary font-semibold hover:underline" onClick={t("الصيانة والدعم الفني", "/stores?category=الصيانة والدعم الفني")}>خدمات الصيانة والدعم الفني</Link>.
          </p>
          <p>
            استخدم <Link to="/map" className="text-primary font-semibold hover:underline" onClick={t("الخريطة التفاعلية", "/map")}>الخريطة التفاعلية</Link>{" "}
            لتصفح المحلات على كل دور، أو تصفّح{" "}
            <Link to="/products" className="text-primary font-semibold hover:underline" onClick={t("كتالوج المنتجات", "/products")}>كتالوج المنتجات</Link>{" "}
            لمقارنة الأسعار. للمستثمرين،{" "}
            <Link to="/leasing" className="text-primary font-semibold hover:underline" onClick={t("وحدات للإيجار", "/leasing")}>وحدات تجارية متاحة للإيجار</Link>{" "}
            بمساحات متنوعة.
          </p>
          <p>
            يخدم مول البستان سكان{" "}
            <strong className="text-foreground">القاهرة الجديدة</strong>، {" "}
            <strong className="text-foreground">مدينتي</strong>، {" "}
            <strong className="text-foreground">الرحاب</strong>، والمناطق المحيطة.{" "}
            <Link to="/about" className="text-primary font-semibold hover:underline" onClick={t("عن المول", "/about")}>اعرف المزيد عن المول</Link>{" "}
            أو <Link to="/contact" className="text-primary font-semibold hover:underline" onClick={t("تواصل", "/contact")}>تواصل مع الفريق</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
