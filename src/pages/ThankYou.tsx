import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowLeft, MapPin, Sparkles } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { getStoredUtm } from "@/lib/utm";

const COPY: Record<string, { title: string; body: string }> = {
  spin: {
    title: "تم تسجيل مشاركتك في عجلة الجوائز",
    body: "شكراً لمشاركتك في عجلة جوائز مول البستان — احتفظ بكود الفوز وزرنا داخل المول لاستلام جائزتك.",
  },
  lead: {
    title: "تم استلام طلبك",
    body: "تواصلنا معك خلال يوم عمل واحد من فريق مول البستان.",
  },
  leasing: {
    title: "تم استلام طلب التأجير",
    body: "سيتواصل معك فريق التأجير في مول البستان خلال يوم عمل واحد.",
  },
  contact: {
    title: "تم إرسال رسالتك",
    body: "شكراً لتواصلك مع إدارة مول البستان — سنرد عليك في أقرب وقت.",
  },
  default: {
    title: "تم بنجاح",
    body: "شكراً لاهتمامك بمول البستان.",
  },
};

const ThankYou = () => {
  const [params] = useSearchParams();
  const type = (params.get("type") ?? "default").toLowerCase();
  const copy = COPY[type] ?? COPY.default;

  useEffect(() => {
    const utm = getStoredUtm();
    trackEvent("thank_you_view", { conversion_type: type, ...utm });
  }, [type]);

  return (
    <MainLayout>
      <SEOHead
        title={copy.title}
        description={copy.body}
        noIndex
      />
      <section className="container max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/15 mb-6">
          <CheckCircle2 className="h-9 w-9 text-success" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{copy.title}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto mb-10">{copy.body}</p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/">
            <Button variant="cta" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> العودة للرئيسية
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="outline" className="gap-2">
              <MapPin className="h-4 w-4" /> خريطة المول
            </Button>
          </Link>
          <Link to="/daily-deals">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" /> العروض الحالية
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default ThankYou;
