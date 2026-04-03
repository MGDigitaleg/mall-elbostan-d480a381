import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Building2, Phone, Globe, MapPin, ExternalLink, CheckCircle, AlertCircle, ShieldCheck, ShieldQuestion, Archive, HelpCircle, ChevronRight, Mail, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  "Verified": { label: "موثّق", color: "bg-success/10 text-success border-success/20", icon: ShieldCheck },
  "Official source linked": { label: "مصدر رسمي", color: "bg-primary/10 text-primary border-primary/20", icon: ExternalLink },
  "Needs review": { label: "قيد المراجعة", color: "bg-orange-500/10 text-orange-600 border-orange-500/20", icon: AlertCircle },
  "Archived / inactive": { label: "غير نشط", color: "bg-muted/50 text-muted-foreground border-border", icon: Archive },
  "Unknown status": { label: "غير محدد", color: "bg-muted/30 text-muted-foreground border-border", icon: HelpCircle },
  verified: { label: "موثّق", color: "bg-success/10 text-success border-success/20", icon: ShieldCheck },
  official_source_linked: { label: "مصدر رسمي", color: "bg-primary/10 text-primary border-primary/20", icon: ExternalLink },
  needs_review: { label: "قيد المراجعة", color: "bg-orange-500/10 text-orange-600 border-orange-500/20", icon: AlertCircle },
};

const DowntownMerchantDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: merchant, isLoading } = useQuery({
    queryKey: ["downtown-merchant", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("downtown_merchants")
        .select("*")
        .eq("slug", slug!)
        .eq("is_active", true)
        .single();
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </MainLayout>
    );
  }

  if (!merchant) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <ShieldQuestion className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-bold text-foreground">المحل غير موجود</p>
          <Link to="/downtown-directory">
            <Button variant="outline">العودة للدليل</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const status = statusConfig[merchant.verification_status] ?? statusConfig["Unknown status"];
  const StatusIcon = status.icon;

  const sources = [
    { label: (merchant as Record<string, unknown>).source_1_label as string | null, url: (merchant as Record<string, unknown>).source_1_url as string | null },
    { label: (merchant as Record<string, unknown>).source_2_label as string | null, url: (merchant as Record<string, unknown>).source_2_url as string | null },
    { label: (merchant as Record<string, unknown>).source_3_label as string | null, url: (merchant as Record<string, unknown>).source_3_url as string | null },
    // Legacy field
    { label: "مصدر", url: merchant.source_url },
  ].filter(s => s.url);

  const socialLinks = [
    { label: "Facebook", url: (merchant as Record<string, unknown>).facebook_url as string | null },
    { label: "Instagram", url: (merchant as Record<string, unknown>).instagram_url as string | null },
    { label: "TikTok", url: (merchant as Record<string, unknown>).tiktok_url as string | null },
    { label: "Google Maps", url: (merchant as Record<string, unknown>).google_maps_url as string | null },
  ].filter(s => s.url);

  const merchantLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: merchant.name_ar,
    alternateName: merchant.name_en,
    telephone: merchant.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: merchant.address ?? "18 شارع البستان",
      addressLocality: "باب اللوق",
      addressRegion: "القاهرة",
      addressCountry: "EG",
    },
    url: merchant.website,
    image: merchant.logo_url,
  };

  return (
    <MainLayout>
      <SEOHead
        title={`${merchant.name_ar} — دليل وسط البلد`}
        titleEn={merchant.name_en ? `${merchant.name_en} — Downtown Directory` : undefined}
        description={(merchant as Record<string, unknown>).seo_meta_description_ar as string ?? `${merchant.name_ar} في مول البستان وسط البلد — ${merchant.category ?? "تكنولوجيا وإلكترونيات"}`}
        jsonLd={merchantLd}
        breadcrumbs={[
          { name: "فرع وسط البلد", url: "/downtown-branch" },
          { name: "دليل المحلات", url: "/downtown-directory" },
          { name: merchant.name_ar, url: `/downtown-directory/${merchant.slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="container flex items-center gap-2 py-3 text-[0.72rem] text-muted-foreground">
          <Link to="/" className="hover:text-primary">الرئيسية</Link>
          <ChevronRight className="h-3 w-3 rotate-180" />
          <Link to="/downtown-directory" className="hover:text-primary">دليل وسط البلد</Link>
          <ChevronRight className="h-3 w-3 rotate-180" />
          <span className="text-foreground font-medium">{merchant.name_ar}</span>
        </div>
      </div>

      {/* Content */}
      <section className="py-8 md:py-12" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-4xl">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border bg-white shadow-sm">
                {merchant.logo_url ? (
                  <img src={merchant.logo_url} alt={merchant.name_ar} className="h-14 w-14 object-contain" />
                ) : (
                  <Building2 className="h-8 w-8 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-start gap-2">
                  <h1 className="text-[1.4rem] font-bold text-foreground leading-tight">{merchant.name_ar}</h1>
                  <Badge variant="outline" className={`shrink-0 text-[0.6rem] ${status.color}`}>
                    <StatusIcon className="ml-0.5 h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>
                {merchant.name_en && <p className="font-poppins mt-1 text-[0.88rem] text-muted-foreground">{merchant.name_en}</p>}
                {merchant.category && (
                  <Badge variant="secondary" className="mt-2 text-[0.68rem]">{merchant.category}</Badge>
                )}
              </div>
            </div>

            {/* Summary */}
            {((merchant as Record<string, unknown>).summary_ar as string | null) && (
              <div className="mt-6">
                <h2 className="mb-2 text-[0.92rem] font-bold text-foreground">نبذة عن المحل</h2>
                <p className="text-[0.84rem] leading-[1.9] text-muted-foreground">{(merchant as Record<string, unknown>).summary_ar as string}</p>
              </div>
            )}

            {/* Products/Services */}
            {((merchant as Record<string, unknown>).products_services_ar as string | null) && (
              <div className="mt-5">
                <h2 className="mb-2 text-[0.92rem] font-bold text-foreground">المنتجات والخدمات</h2>
                <p className="text-[0.84rem] leading-[1.9] text-muted-foreground">{(merchant as Record<string, unknown>).products_services_ar as string}</p>
              </div>
            )}

            {/* Contact Info */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <h3 className="mb-3 text-[0.82rem] font-bold text-foreground">معلومات التواصل</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-[0.78rem] text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span>{merchant.address ?? "18 شارع البستان، باب اللوق، القاهرة"}</span>
                  </div>
                  {merchant.floor && (
                    <div className="flex items-center gap-2.5 text-[0.78rem] text-muted-foreground">
                      <Building2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>الدور {merchant.floor}{merchant.unit_number ? ` — وحدة ${merchant.unit_number}` : ""}</span>
                    </div>
                  )}
                  {merchant.phone && (
                    <a href={`tel:${merchant.phone}`} className="flex items-center gap-2.5 text-[0.78rem] text-primary hover:underline">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span dir="ltr">{merchant.phone}</span>
                    </a>
                  )}
                  {((merchant as Record<string, unknown>).whatsapp as string | null) && (
                    <a href={`https://wa.me/${((merchant as Record<string, unknown>).whatsapp as string).replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[0.78rem] text-success hover:underline">
                      <MessageCircle className="h-4 w-4 shrink-0" />
                      <span dir="ltr">{(merchant as Record<string, unknown>).whatsapp as string}</span>
                    </a>
                  )}
                  {((merchant as Record<string, unknown>).email as string | null) && (
                    <a href={`mailto:${(merchant as Record<string, unknown>).email as string}`} className="flex items-center gap-2.5 text-[0.78rem] text-primary hover:underline">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span dir="ltr">{(merchant as Record<string, unknown>).email as string}</span>
                    </a>
                  )}
                  {merchant.website && (
                    <a href={merchant.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[0.78rem] text-primary hover:underline">
                      <Globe className="h-4 w-4 shrink-0" />
                      <span>زيارة الموقع</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Social & Sources */}
              <div className="space-y-3">
                {socialLinks.length > 0 && (
                  <div className="rounded-xl border border-border bg-secondary/30 p-4">
                    <h3 className="mb-3 text-[0.82rem] font-bold text-foreground">الروابط الاجتماعية</h3>
                    <div className="flex flex-wrap gap-2">
                      {socialLinks.map((s, i) => (
                        <a key={i} href={s.url!} target="_blank" rel="noopener noreferrer">
                          <Badge variant="outline" className="cursor-pointer text-[0.65rem] hover:bg-primary/5">
                            <ExternalLink className="ml-1 h-3 w-3" /> {s.label}
                          </Badge>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {sources.length > 0 && (
                  <div className="rounded-xl border border-border bg-secondary/30 p-4">
                    <h3 className="mb-3 text-[0.82rem] font-bold text-foreground">مصادر التوثيق</h3>
                    <div className="space-y-1.5">
                      {sources.map((s, i) => (
                        <a key={i} href={s.url!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[0.72rem] text-primary hover:underline">
                          <ExternalLink className="h-3 w-3 shrink-0" />
                          {s.label || "مصدر التوثيق"}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Verification Notice */}
            {((merchant as Record<string, unknown>).verification_notes as string | null) && (
              <div className="mt-5 rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-[0.72rem] text-muted-foreground">
                  <span className="font-bold">ملاحظات التوثيق:</span> {(merchant as Record<string, unknown>).verification_notes as string}
                </p>
              </div>
            )}
          </div>

          {/* Back to directory */}
          <div className="mt-6 text-center">
            <Link to="/downtown-directory">
              <Button variant="outline" className="rounded-xl">
                <ChevronRight className="ml-1 h-4 w-4 rotate-180" /> العودة لدليل المحلات
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default DowntownMerchantDetail;
