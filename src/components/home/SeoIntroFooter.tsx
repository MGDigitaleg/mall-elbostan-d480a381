import { Link } from "react-router-dom";

/**
 * Hidden-by-default SEO footer content for homepage.
 * Provides keyword-rich internal linking for crawlers.
 */
export function SeoIntroFooter() {
  return (
    <section
      className="bg-card dark:bg-background border-t border-border/30"
      style={{ paddingTop: "clamp(20px, 2.5vw, 32px)", paddingBottom: "clamp(20px, 2.5vw, 32px)" }}
    >
      <div className="container max-w-4xl">
        <div className="text-[0.74rem] leading-[2] text-muted-foreground space-y-2">
          <p>
            <strong className="text-foreground">مول البستان</strong> هو أكبر مول متخصص في{" "}
            <Link to="/stores?category=الكمبيوتر والأجهزة" className="text-primary hover:underline">محلات الكمبيوتر واللابتوبات</Link>، {" "}
            <Link to="/stores?category=الهواتف والإكسسوارات" className="text-primary hover:underline">محلات الموبايلات والإكسسوارات</Link>، {" "}
            <Link to="/stores?category=الألعاب والترفيه" className="text-primary hover:underline">محلات الجيمنج</Link>، {" "}
            و<Link to="/stores?category=الصيانة والدعم الفني" className="text-primary hover:underline">خدمات الصيانة والدعم الفني</Link>{" "}
            في التجمع الخامس بالقاهرة الجديدة.
          </p>
          <p>
            يضم المول أكثر من 150 محل تجاري على 3 أدوار، مع{" "}
            <Link to="/map" className="text-primary hover:underline">خريطة تفاعلية</Link> لتصفح المحلات، {" "}
            <Link to="/products" className="text-primary hover:underline">كتالوج منتجات</Link> شامل، {" "}
            و<Link to="/leasing" className="text-primary hover:underline">وحدات تجارية متاحة للإيجار</Link>.
            يخدم المول سكان القاهرة الجديدة، مدينتي، والرحاب.
          </p>
        </div>
      </div>
    </section>
  );
}
