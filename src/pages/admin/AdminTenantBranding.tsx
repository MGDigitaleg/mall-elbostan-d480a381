import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle, CheckCircle2, CircleHelp, ImageOff,
  ExternalLink, ArrowLeft, Shield, Clock, Pencil, X, Save, Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { TenantLogo } from "@/components/TenantLogo";
import { toast } from "sonner";
import {
  TENANT_LOGO_REGISTRY,
  type TenantLogoEntry,
  type LogoVerification,
  registryStats,
} from "@/lib/tenantLogoRegistry";

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof AlertTriangle }> = {
  critical: { label: "حرج — بدون لوجو", color: "#EF4444", bg: "#EF444415", icon: AlertTriangle },
  high: { label: "مرتفع — لوجو مؤقت", color: "#F97316", bg: "#F9731615", icon: Clock },
  medium: { label: "متوسط — مصدر غير مؤكد", color: "#EAB308", bg: "#EAB30815", icon: CircleHelp },
  verified: { label: "مكتمل — رسمي ومُعتمد", color: "#10B981", bg: "#10B98115", icon: CheckCircle2 },
};

function getPriority(v: LogoVerification): string {
  switch (v) {
    case "missing": return "critical";
    case "generated": return "high";
    case "sourced": return "medium";
    case "verified": return "verified";
  }
}

type ExtendedEntry = TenantLogoEntry & { dbLogoUrl?: string | null; unitCode?: string | null; storeId?: string | null };

interface LogoEditFormProps {
  entry: ExtendedEntry;
  onClose: () => void;
}

function LogoEditForm({ entry, onClose }: LogoEditFormProps) {
  const queryClient = useQueryClient();
  const [logoUrl, setLogoUrl] = useState(entry.dbLogoUrl ?? entry.logoPath ?? "");
  const [status, setStatus] = useState<"verified" | "sourced">("verified");
  const [officialSite, setOfficialSite] = useState(entry.officialSite ?? "");
  const [notes, setNotes] = useState("");

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!logoUrl.trim()) throw new Error("رابط الشعار مطلوب");

      // Update logo_url in stores table
      if (entry.storeId) {
        const { error } = await supabase
          .from("stores")
          .update({ logo_url: logoUrl.trim() })
          .eq("id", entry.storeId);
        if (error) throw error;
      }

      // Upsert into tenant_logo_assets for tracking
      const { error: assetError } = await supabase
        .from("tenant_logo_assets")
        .upsert(
          {
            brand_key: entry.slug,
            tenant_provided_name: entry.displayNameAr,
            normalized_display_name: entry.displayNameEn ?? entry.displayNameAr,
            review_status: status === "verified" ? "Approved" : "Sourced",
            final_file_path: logoUrl.trim(),
            reviewer_notes: [
              notes,
              officialSite ? `الموقع: ${officialSite}` : "",
            ].filter(Boolean).join(" | ") || null,
            approved_for_final_export: status === "verified",
          },
          { onConflict: "brand_key" }
        );
      if (assetError) throw assetError;
    },
    onSuccess: () => {
      toast.success("تم تحديث الشعار بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin-stores-branding"] });
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء التحديث");
    },
  });

  return (
    <div
      className="mt-3 rounded-xl p-4 space-y-3"
      style={{ background: "#0B1A30", border: "1px solid #ffffff14" }}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[0.8rem] font-bold" style={{ color: "#F8FAFC" }}>
          تحديث شعار: {entry.displayNameAr}
        </h4>
        <button onClick={onClose} className="rounded-lg p-1 hover:bg-white/10 transition-colors">
          <X className="h-3.5 w-3.5" style={{ color: "#64748B" }} />
        </button>
      </div>

      {/* Logo URL */}
      <div>
        <label className="block text-[0.68rem] font-semibold mb-1" style={{ color: "#94A3B8" }}>
          رابط الشعار الرسمي
        </label>
        <input
          type="url"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://example.com/logo.webp أو /logos/tenants/name.webp"
          className="w-full rounded-lg px-3 py-2 text-[0.78rem] outline-none transition-colors focus:ring-1"
          style={{
            background: "#ffffff08",
            border: "1px solid #ffffff14",
            color: "#F8FAFC",
          }}
          dir="ltr"
        />
      </div>

      {/* Preview */}
      {logoUrl.trim() && (
        <div className="flex items-center gap-3">
          <span className="text-[0.66rem] font-semibold" style={{ color: "#64748B" }}>معاينة:</span>
          <div
            className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg"
            style={{ background: "#ffffff08", border: "1px solid #ffffff14" }}
          >
            <img
              src={logoUrl.trim()}
              alt="معاينة الشعار"
              className="h-full w-full object-contain p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      )}

      {/* Status */}
      <div>
        <label className="block text-[0.68rem] font-semibold mb-1" style={{ color: "#94A3B8" }}>
          حالة التحقق
        </label>
        <div className="flex gap-2">
          {(["verified", "sourced"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className="rounded-lg px-3 py-1.5 text-[0.72rem] font-bold transition-all"
              style={{
                background: status === s ? (s === "verified" ? "#10B98120" : "#EAB30820") : "#ffffff06",
                border: `1px solid ${status === s ? (s === "verified" ? "#10B981" : "#EAB308") : "#ffffff14"}`,
                color: status === s ? (s === "verified" ? "#10B981" : "#EAB308") : "#64748B",
              }}
            >
              {s === "verified" ? "مُعتمد رسمياً" : "مصدر عام"}
            </button>
          ))}
        </div>
      </div>

      {/* Official site */}
      <div>
        <label className="block text-[0.68rem] font-semibold mb-1" style={{ color: "#94A3B8" }}>
          الموقع الرسمي (اختياري)
        </label>
        <input
          type="url"
          value={officialSite}
          onChange={(e) => setOfficialSite(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-lg px-3 py-2 text-[0.78rem] outline-none transition-colors focus:ring-1"
          style={{
            background: "#ffffff08",
            border: "1px solid #ffffff14",
            color: "#F8FAFC",
          }}
          dir="ltr"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-[0.68rem] font-semibold mb-1" style={{ color: "#94A3B8" }}>
          ملاحظات (اختياري)
        </label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="مصدر الشعار، تاريخ التحقق..."
          className="w-full rounded-lg px-3 py-2 text-[0.78rem] outline-none transition-colors focus:ring-1"
          style={{
            background: "#ffffff08",
            border: "1px solid #ffffff14",
            color: "#F8FAFC",
          }}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-[0.72rem] font-bold transition-colors hover:bg-white/10"
          style={{ border: "1px solid #ffffff14", color: "#94A3B8" }}
        >
          إلغاء
        </button>
        <button
          onClick={() => updateMutation.mutate()}
          disabled={updateMutation.isPending || !logoUrl.trim()}
          className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[0.72rem] font-bold transition-all disabled:opacity-50"
          style={{ background: "#1F61FF", color: "#fff" }}
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Save className="h-3 w-3" />
          )}
          حفظ التحديث
        </button>
      </div>

      <p className="text-[0.6rem]" style={{ color: "#475569" }}>
        سيتم تحديث رابط الشعار في قاعدة البيانات وتسجيل حالة التحقق. لتحديث السجل المركزي في الكود، يجب تعديل ملف tenantLogoRegistry.ts.
      </p>
    </div>
  );
}

export default function AdminTenantBranding() {
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const { data: dbStores } = useQuery({
    queryKey: ["admin-stores-branding"],
    queryFn: async () => {
      const { data } = await supabase
        .from("stores")
        .select("id, slug, name_ar, name_en, logo_url, status, unit_code")
        .neq("status", "hidden")
        .order("name_ar");
      return data ?? [];
    },
  });

  const groups = useMemo(() => {
    const result: Record<string, ExtendedEntry[]> = {
      critical: [],
      high: [],
      medium: [],
      verified: [],
    };

    TENANT_LOGO_REGISTRY.forEach((entry) => {
      const dbStore = dbStores?.find((s) => s.slug === entry.slug);
      const priority = getPriority(entry.verified);
      result[priority].push({
        ...entry,
        dbLogoUrl: dbStore?.logo_url,
        unitCode: dbStore?.unit_code,
        storeId: dbStore?.id,
      });
    });

    dbStores?.forEach((s) => {
      if (!TENANT_LOGO_REGISTRY.some((t) => t.slug === s.slug)) {
        result.critical.push({
          slug: s.slug,
          displayNameAr: s.name_ar,
          displayNameEn: s.name_en,
          logoPath: null,
          verified: "missing",
          officialSite: null,
          backgroundMode: "auto",
          notes: "غير مسجل في السجل المركزي",
          dbLogoUrl: s.logo_url,
          unitCode: s.unit_code,
          storeId: s.id,
        });
      }
    });

    return result;
  }, [dbStores]);

  const totalInRegistry = registryStats.total;
  const totalInDb = dbStores?.length ?? 0;

  return (
    <MainLayout>
      <div style={{ background: "linear-gradient(170deg, #071326, #0D1F3C)" }} className="min-h-screen">
        <div className="container max-w-5xl py-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/admin" className="mb-4 inline-flex items-center gap-1.5 text-[0.74rem] font-medium transition-colors hover:text-white" style={{ color: "#64748B" }}>
              <ArrowLeft className="h-3 w-3" /> لوحة التحكم
            </Link>
            <h1 className="text-[1.6rem] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}>
              تدقيق شعارات المحلات
            </h1>
            <p className="mt-1 text-[0.84rem]" style={{ color: "#94A3B8" }}>
              مراجعة وتحقق من جميع شعارات المحلات في المنصة
            </p>
          </div>

          {/* Stats bar */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "مُعتمد", value: registryStats.verified, color: "#10B981" },
              { label: "مصدر عام", value: registryStats.sourced, color: "#EAB308" },
              { label: "مؤقت (AI)", value: registryStats.generated, color: "#F97316" },
              { label: "مفقود", value: registryStats.missing, color: "#EF4444" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-4" style={{ background: "#ffffff06", border: "1px solid #ffffff0C" }}>
                <span className="font-poppins text-[1.4rem] font-extrabold" style={{ color: s.color }}>{s.value}</span>
                <p className="mt-0.5 text-[0.7rem] font-semibold" style={{ color: "#64748B" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Coverage */}
          <div className="mb-8 rounded-xl p-4" style={{ background: "#ffffff06", border: "1px solid #ffffff0C" }}>
            <div className="flex items-center justify-between text-[0.78rem]" style={{ color: "#94A3B8" }}>
              <span>نسبة التغطية الرسمية</span>
              <span className="font-poppins font-bold" style={{ color: "#5B9AFF" }}>
                {totalInRegistry > 0 ? Math.round(((registryStats.verified + registryStats.sourced) / totalInRegistry) * 100) : 0}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: "#ffffff0A" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${totalInRegistry > 0 ? ((registryStats.verified + registryStats.sourced) / totalInRegistry) * 100 : 0}%`,
                  background: "linear-gradient(90deg, #10B981, #06B6D4)",
                }}
              />
            </div>
            <p className="mt-2 text-[0.66rem]" style={{ color: "#64748B" }}>
              {registryStats.verified + registryStats.sourced} من {totalInRegistry} في السجل | {totalInDb} محل في قاعدة البيانات
            </p>
          </div>

          {/* Priority groups */}
          {(["critical", "high", "medium", "verified"] as const).map((priority) => {
            const config = PRIORITY_CONFIG[priority];
            const items = groups[priority];
            if (!items || items.length === 0) return null;
            const Icon = config.icon;

            return (
              <div key={priority} className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: config.bg }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: config.color }} />
                  </div>
                  <h2 className="text-[0.88rem] font-bold" style={{ color: "#F8FAFC" }}>{config.label}</h2>
                  <span className="rounded-full px-2 py-0.5 text-[0.62rem] font-bold" style={{ background: config.bg, color: config.color }}>
                    {items.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {items.map((entry) => (
                    <div key={entry.slug}>
                      <div
                        className="flex items-center gap-4 rounded-xl p-3.5"
                        style={{ background: "#ffffff05", border: "1px solid #ffffff0A" }}
                      >
                        <TenantLogo
                          src={entry.logoPath}
                          alt={entry.displayNameAr}
                          fallbackName={entry.displayNameAr}
                          size="md"
                          rounded="lg"
                          darkContext
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[0.84rem] font-bold truncate" style={{ color: "#F8FAFC" }}>
                              {entry.displayNameAr}
                            </span>
                            {entry.displayNameEn && (
                              <span className="font-poppins text-[0.68rem] truncate" style={{ color: "#64748B" }}>
                                {entry.displayNameEn}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[0.64rem]" style={{ color: "#64748B" }}>
                            {entry.unitCode && (
                              <span className="rounded px-1.5 py-0.5" style={{ background: "#ffffff08" }}>
                                {entry.unitCode}
                              </span>
                            )}
                            <span className="rounded px-1.5 py-0.5" style={{ background: config.bg, color: config.color }}>
                              {entry.verified}
                            </span>
                            {entry.notes && (
                              <span className="truncate max-w-[200px]" title={entry.notes}>
                                {entry.notes}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          {entry.officialSite && (
                            <a
                              href={entry.officialSite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                              style={{ border: "1px solid #ffffff14" }}
                              title="الموقع الرسمي"
                            >
                              <ExternalLink className="h-3 w-3" style={{ color: "#5B9AFF" }} />
                            </a>
                          )}
                          <button
                            onClick={() => setEditingSlug(editingSlug === entry.slug ? null : entry.slug)}
                            className="flex h-7 items-center gap-1 rounded-lg px-2.5 text-[0.64rem] font-bold transition-colors hover:bg-white/10"
                            style={{
                              border: `1px solid ${editingSlug === entry.slug ? "#1F61FF" : "#ffffff14"}`,
                              color: editingSlug === entry.slug ? "#1F61FF" : "#94A3B8",
                            }}
                          >
                            <Pencil className="h-2.5 w-2.5" />
                            تعديل
                          </button>
                          <Link
                            to={`/stores/${entry.slug}`}
                            className="flex h-7 items-center gap-1 rounded-lg px-2.5 text-[0.64rem] font-bold transition-colors hover:bg-white/10"
                            style={{ border: "1px solid #ffffff14", color: "#94A3B8" }}
                          >
                            عرض
                          </Link>
                        </div>
                      </div>

                      {editingSlug === entry.slug && (
                        <LogoEditForm entry={entry} onClose={() => setEditingSlug(null)} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Action items summary */}
          <div className="mt-8 rounded-xl p-5" style={{ background: "#ffffff06", border: "1px solid #ffffff0C" }}>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4" style={{ color: "#5B9AFF" }} />
              <h3 className="text-[0.88rem] font-bold" style={{ color: "#F8FAFC" }}>ملخص الإجراءات المطلوبة</h3>
            </div>
            <ul className="space-y-1.5 text-[0.78rem]" style={{ color: "#94A3B8" }}>
              {groups.critical.length > 0 && (
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#EF4444" }} />
                  {groups.critical.length} محل بدون شعار — يحتاج تواصل عاجل مع المستأجر
                </li>
              )}
              {groups.high.length > 0 && (
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#F97316" }} />
                  {groups.high.length} محل يستخدم شعار مؤقت (AI) — يظهر بالأحرف الأولى حالياً
                </li>
              )}
              {groups.medium.length > 0 && (
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#EAB308" }} />
                  {groups.medium.length} محل بشعار من مصدر عام — يحتاج تأكيد رسمي
                </li>
              )}
              {groups.verified.length > 0 && (
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#10B981" }} />
                  {groups.verified.length} محل معتمد بالكامل
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
