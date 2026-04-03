import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import {
  Building2, Phone, Globe, MapPin, ExternalLink, CheckCircle,
  AlertCircle, ShieldCheck, ShieldQuestion, Archive, HelpCircle,
  ChevronRight, Mail, MessageCircle, Clock, Tag, Facebook, Instagram,
  Map, Store, Layers, ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: typeof CheckCircle }> = {
  "Verified":               { label: "موثّق", bg: "rgba(16,185,129,0.08)", text: "#10B981", border: "rgba(16,185,129,0.2)", icon: ShieldCheck },
  "Official source linked": { label: "مصدر رسمي", bg: "rgba(37,99,235,0.08)", text: "#2563EB", border: "rgba(37,99,235,0.2)", icon: ExternalLink },
  "Needs review":           { label: "قيد المراجعة", bg: "rgba(249,115,22,0.08)", text: "#F97316", border: "rgba(249,115,22,0.2)", icon: AlertCircle },
  "Archived / inactive":    { label: "غير نشط", bg: "rgba(100,116,139,0.08)", text: "#64748B", border: "rgba(100,116,139,0.2)", icon: Archive },
  "Unknown status":         { label: "غير محدد", bg: "rgba(100,116,139,0.06)", text: "#94A3B8", border: "rgba(100,116,139,0.15)", icon: HelpCircle },
  verified:                 { label: "موثّق", bg: "rgba(16,185,129,0.08)", text: "#10B981", border: "rgba(16,185,129,0.2)", icon: ShieldCheck },
  official_source_linked:   { label: "مصدر رسمي", bg: "rgba(37,99,235,0.08)", text: "#2563EB", border: "rgba(37,99,235,0.2)", icon: ExternalLink },
  needs_review:             { label: "قيد المراجعة", bg: "rgba(249,115,22,0.08)", text: "#F97316", border: "rgba(249,115,22,0.2)", icon: AlertCircle },
};

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} width="16" height="16">
      <path d="M16.6 5.82A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
    </svg>
  );
}

const socialIconMap: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="h-4 w-4" />,
  Instagram: <Instagram className="h-4 w-4" />,
  TikTok: <TikTokIcon className="h-4 w-4" />,
  "Google Maps": <Map className="h-4 w-4" />,
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

  // Fetch related merchants for "similar stores" section
  const { data: relatedMerchants } = useQuery({
    queryKey: ["related-merchants", merchant?.category, merchant?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("downtown_merchants")
        .select("id, name_ar, name_en, slug, category, phone, floor, verification_status, logo_url")
        .eq("is_active", true)
        .eq("category", merchant!.category!)
        .neq("id", merchant!.id)
        .limit(4);
      return data ?? [];
    },
    enabled: !!merchant?.category && !!merchant?.id,
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
    { label: merchant.source_1_label, url: merchant.source_1_url },
    { label: merchant.source_2_label, url: merchant.source_2_url },
    { label: merchant.source_3_label, url: merchant.source_3_url },
    { label: "مصدر", url: merchant.source_url },
  ].filter(s => s.url);

  const socialLinks = [
    { label: "Facebook", url: merchant.facebook_url },
    { label: "Instagram", url: merchant.instagram_url },
    { label: "TikTok", url: merchant.tiktok_url },
    { label: "Google Maps", url: merchant.google_maps_url },
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
        description={merchant.seo_meta_description_ar ?? `${merchant.name_ar} في مول البستان وسط البلد — ${merchant.category ?? "تكنولوجيا وإلكترونيات"}`}
        jsonLd={merchantLd}
        breadcrumbs={[
          { name: "فرع وسط البلد", url: "/downtown-branch" },
          { name: "دليل المحلات", url: "/downtown-directory" },
          { name: merchant.name_ar, url: `/downtown-directory/${merchant.slug}` },
        ]}
      />

      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #071326 0%, #0B1B34 50%, #0D1F3C 100%)" }}>
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[250px] w-[500px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(ellipse, #2563EB, transparent 70%)" }} />

        <div className="container relative py-6 md:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[0.72rem] mb-6" style={{ color: "#64748B" }}>
            <Link to="/" className="transition-colors hover:text-white/70">الرئيسية</Link>
            <ChevronRight className="h-3 w-3 rotate-180" />
            <Link to="/downtown-directory" className="transition-colors hover:text-white/70">دليل وسط البلد</Link>
            <ChevronRight className="h-3 w-3 rotate-180" />
            <span style={{ color: "#CBD5E1" }}>{merchant.name_ar}</span>
          </nav>

          {/* Merchant identity */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div
              className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                backdropFilter: "blur(8px)",
              }}
            >
              {merchant.logo_url ? (
                <img src={merchant.logo_url} alt={merchant.name_ar} className="h-14 w-14 rounded-lg object-contain" />
              ) : (
                <Store className="h-9 w-9" style={{ color: "#4B8BFF" }} />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[1.45rem] md:text-[1.6rem] font-bold leading-tight" style={{ color: "#F8FAFC" }}>
                  {merchant.name_ar}
                </h1>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.65rem] font-bold"
                  style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}` }}
                >
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </span>
              </div>

              {merchant.name_en && (
                <p className="font-poppins text-[0.9rem]" style={{ color: "#8896AB" }}>
                  {merchant.name_en}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {merchant.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[0.7rem] font-medium" style={{ background: "rgba(255,255,255,0.05)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Tag className="h-3 w-3" />
                    {merchant.category}
                  </span>
                )}
                {merchant.category_secondary && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[0.7rem] font-medium" style={{ background: "rgba(255,255,255,0.03)", color: "#64748B", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {merchant.category_secondary}
                  </span>
                )}
                {merchant.floor && (
                  <span className="inline-flex items-center gap-1.5 text-[0.72rem]" style={{ color: "#64748B" }}>
                    <Layers className="h-3 w-3" />
                    الدور {merchant.floor}
                    {merchant.unit_number ? ` — وحدة ${merchant.unit_number}` : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-8 md:py-12" style={{ background: "#F5F2EC" }}>
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            {/* ── Left: Main info ── */}
            <div className="space-y-6">
              {/* Summary */}
              {merchant.summary_ar && (
                <div className="rounded-2xl border bg-white p-6 md:p-7" style={{ borderColor: "#D8DEE8" }}>
                  <h2 className="mb-3 flex items-center gap-2 text-[0.95rem] font-bold" style={{ color: "#0F172A" }}>
                    <Building2 className="h-4.5 w-4.5" style={{ color: "#2563EB" }} />
                    نبذة عن المحل
                  </h2>
                  <p className="text-[0.84rem] leading-[2] whitespace-pre-line" style={{ color: "#334155" }}>
                    {merchant.summary_ar}
                  </p>
                </div>
              )}

              {/* Products & Services */}
              {merchant.products_services_ar && (
                <div className="rounded-2xl border bg-white p-6 md:p-7" style={{ borderColor: "#D8DEE8" }}>
                  <h2 className="mb-3 flex items-center gap-2 text-[0.95rem] font-bold" style={{ color: "#0F172A" }}>
                    <Tag className="h-4.5 w-4.5" style={{ color: "#2563EB" }} />
                    المنتجات والخدمات
                  </h2>
                  <p className="text-[0.84rem] leading-[2] whitespace-pre-line" style={{ color: "#334155" }}>
                    {merchant.products_services_ar}
                  </p>
                </div>
              )}

              {/* Verification Sources */}
              {sources.length > 0 && (
                <div className="rounded-2xl border bg-white p-6 md:p-7" style={{ borderColor: "#D8DEE8" }}>
                  <h2 className="mb-4 flex items-center gap-2 text-[0.95rem] font-bold" style={{ color: "#0F172A" }}>
                    <ShieldCheck className="h-4.5 w-4.5" style={{ color: "#10B981" }} />
                    مصادر التوثيق
                  </h2>
                  <div className="space-y-2.5">
                    {sources.map((s, i) => (
                      <a
                        key={i}
                        href={s.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-[0.78rem] font-medium transition-all duration-200 hover:shadow-sm"
                        style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#2563EB" }}
                      >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        {s.label || "مصدر التوثيق"}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Notes */}
              {merchant.verification_notes && (
                <div className="rounded-2xl px-5 py-4" style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.12)" }}>
                  <p className="text-[0.76rem] leading-[1.8]" style={{ color: "#92400E" }}>
                    <span className="font-bold">ملاحظات التوثيق: </span>
                    {merchant.verification_notes}
                  </p>
                </div>
              )}
            </div>

            {/* ── Right: Contact Sidebar ── */}
            <div className="space-y-5">
              {/* Contact Card */}
              <div className="rounded-2xl border bg-white p-5 md:p-6" style={{ borderColor: "#D8DEE8" }}>
                <h3 className="mb-4 text-[0.88rem] font-bold" style={{ color: "#0F172A" }}>
                  معلومات التواصل
                </h3>

                <div className="space-y-3">
                  {/* Address */}
                  <div className="flex items-start gap-3 text-[0.8rem]" style={{ color: "#334155" }}>
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(37,99,235,0.08)" }}>
                      <MapPin className="h-4 w-4" style={{ color: "#2563EB" }} />
                    </span>
                    <span className="pt-1">{merchant.address ?? "18 شارع البستان، باب اللوق، القاهرة"}</span>
                  </div>

                  {/* Floor */}
                  {merchant.floor && (
                    <div className="flex items-center gap-3 text-[0.8rem]" style={{ color: "#334155" }}>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(37,99,235,0.08)" }}>
                        <Layers className="h-4 w-4" style={{ color: "#2563EB" }} />
                      </span>
                      <span>الدور {merchant.floor}{merchant.unit_number ? ` — وحدة ${merchant.unit_number}` : ""}</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-5 space-y-2.5">
                  {merchant.phone && (
                    <a href={`tel:${merchant.phone}`} className="block">
                      <Button
                        className="w-full h-11 rounded-xl text-[0.8rem] font-bold gap-2"
                        style={{ background: "#2563EB", color: "#fff" }}
                      >
                        <Phone className="h-4 w-4" />
                        <span dir="ltr">{merchant.phone}</span>
                      </Button>
                    </a>
                  )}

                  {merchant.whatsapp && (
                    <a
                      href={`https://wa.me/${(merchant.whatsapp).replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        className="w-full h-11 rounded-xl text-[0.8rem] font-bold gap-2"
                        style={{ background: "#10B981", color: "#fff" }}
                      >
                        <MessageCircle className="h-4 w-4" />
                        واتساب
                      </Button>
                    </a>
                  )}

                  {merchant.email && (
                    <a href={`mailto:${merchant.email}`} className="block">
                      <Button
                        variant="outline"
                        className="w-full h-11 rounded-xl text-[0.8rem] font-bold gap-2"
                        style={{ borderColor: "#D8DEE8" }}
                      >
                        <Mail className="h-4 w-4" />
                        {merchant.email}
                      </Button>
                    </a>
                  )}

                  {merchant.website && (
                    <a href={merchant.website} target="_blank" rel="noopener noreferrer" className="block">
                      <Button
                        variant="outline"
                        className="w-full h-11 rounded-xl text-[0.8rem] font-bold gap-2"
                        style={{ borderColor: "#D8DEE8" }}
                      >
                        <Globe className="h-4 w-4" />
                        زيارة الموقع
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {/* Social Links Card */}
              {socialLinks.length > 0 && (
                <div className="rounded-2xl border bg-white p-5 md:p-6" style={{ borderColor: "#D8DEE8" }}>
                  <h3 className="mb-4 text-[0.88rem] font-bold" style={{ color: "#0F172A" }}>
                    تابعنا
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {socialLinks.map((s, i) => (
                      <a
                        key={i}
                        href={s.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[0.75rem] font-medium transition-all duration-200 hover:shadow-sm"
                        style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#334155" }}
                      >
                        <span style={{ color: "#2563EB" }}>
                          {socialIconMap[s.label] ?? <ExternalLink className="h-4 w-4" />}
                        </span>
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Google Maps */}
              {merchant.google_maps_url && (
                <a
                  href={merchant.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border bg-white p-4 transition-all duration-200 hover:shadow-md"
                  style={{ borderColor: "#D8DEE8" }}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "rgba(37,99,235,0.08)" }}>
                    <Map className="h-5 w-5" style={{ color: "#2563EB" }} />
                  </span>
                  <div>
                    <p className="text-[0.82rem] font-bold" style={{ color: "#0F172A" }}>عرض على خرائط جوجل</p>
                    <p className="text-[0.7rem]" style={{ color: "#64748B" }}>احصل على الاتجاهات</p>
                  </div>
                  <ExternalLink className="mr-auto h-4 w-4" style={{ color: "#94A3B8" }} />
                </a>
              )}
            </div>
          </div>

          {/* ── Related Merchants ── */}
          {relatedMerchants && relatedMerchants.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-5 text-[1.05rem] font-bold" style={{ color: "#0F172A" }}>
                محلات مشابهة في نفس التصنيف
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {relatedMerchants.map((rm) => {
                  const rmStatus = statusConfig[rm.verification_status] ?? statusConfig["Unknown status"];
                  return (
                    <Link
                      key={rm.id}
                      to={`/downtown-directory/${rm.slug}`}
                      className="group flex items-center gap-3 rounded-2xl border bg-white p-4 transition-all duration-200 hover:shadow-md hover:border-primary/20"
                      style={{ borderColor: "#D8DEE8" }}
                    >
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                      >
                        {rm.logo_url ? (
                          <img src={rm.logo_url} alt={rm.name_ar} className="h-8 w-8 object-contain" />
                        ) : (
                          <Store className="h-5 w-5" style={{ color: "#94A3B8" }} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.82rem] font-bold group-hover:text-primary transition-colors" style={{ color: "#0F172A" }}>
                          {rm.name_ar}
                        </p>
                        {rm.name_en && (
                          <p className="truncate text-[0.7rem] font-poppins" style={{ color: "#64748B" }}>
                            {rm.name_en}
                          </p>
                        )}
                        <span className="mt-0.5 inline-block text-[0.6rem] font-medium" style={{ color: rmStatus.text }}>
                          {rmStatus.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Back to directory */}
          <div className="mt-8 text-center">
            <Link to="/downtown-directory">
              <Button
                variant="outline"
                className="h-11 rounded-xl px-6 text-[0.82rem] font-bold gap-2"
                style={{ borderColor: "#D8DEE8", color: "#334155" }}
              >
                <ArrowLeft className="h-4 w-4 rotate-180" />
                العودة لدليل المحلات
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default DowntownMerchantDetail;
