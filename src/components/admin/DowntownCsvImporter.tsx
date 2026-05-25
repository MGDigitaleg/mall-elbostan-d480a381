import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { parseCsv, parseBoolAr, cleanUncertain, slugify } from "@/lib/downtownVerification";

// Maps a CSV header to our column key.
const HEADER_MAP: Record<string, string> = {
  "Store Name EN": "name_en",
  "Store Name AR": "name_ar",
  "Store Category": "category",
  "Detailed Specialisation": "detailed_specialisation",
  "Products / Services Offered": "products_services",
  "Tech Related? نعم / لا": "tech_related",
  "Floor / Unit / Location Inside Mall": "floor_unit_location",
  "Phone Number": "phone",
  "WhatsApp": "whatsapp",
  "Email": "email",
  "Website": "website",
  "Facebook": "facebook_url",
  "Instagram": "instagram_url",
  "Google Maps Link": "google_maps_url",
  "Opening Hours": "opening_hours",
  "Current Status: Open / Closed / Unclear / Needs Field Verification": "current_status",
  "Evidence Summary": "evidence_summary",
  "Source 1": "source_1_url",
  "Source 2": "source_2_url",
  "Source 3": "source_3_url",
  "Last Evidence Date": "last_evidence_date",
  "Confidence Score من 1 إلى 5": "confidence_score",
  "Notes for Website Team": "notes_for_website_team",
  "Verification Status": "verification_status",
  "Recommended Website Badge": "recommended_badge",
  "Show Verified Publicly?": "show_verified_publicly",
  "Missing Data": "missing_data",
  "Arabic Website Description": "summary_ar",
  "English Website Description": "summary_en",
  "Next Action": "next_action",
  "Original Directory Presence": "original_directory_presence",
  "Source Date Quality": "source_date_quality",
  "Row Type": "row_type",
};

type Parsed = {
  rows: Record<string, unknown>[];
  duplicates: string[];
  invalid: number;
};

function rowsToRecords(rows: string[][]): Parsed {
  if (rows.length < 2) return { rows: [], duplicates: [], invalid: 0 };
  const headers = rows[0].map(h => h.trim().replace(/^\uFEFF/, ""));
  const colIdx: Record<string, number> = {};
  headers.forEach((h, i) => {
    const key = HEADER_MAP[h];
    if (key) colIdx[key] = i;
  });

  const seen = new Set<string>();
  const duplicates: string[] = [];
  let invalid = 0;
  const out: Record<string, unknown>[] = [];

  for (let r = 1; r < rows.length; r++) {
    const raw = rows[r];
    const get = (k: string) => (colIdx[k] != null ? cleanUncertain(raw[colIdx[k]]) : null);

    const name_en = get("name_en");
    const name_ar = get("name_ar") ?? name_en;
    if (!name_en && !name_ar) { invalid++; continue; }

    const finalNameAr = name_ar ?? name_en ?? "محل بدون اسم";
    const slug = slugify(name_en ?? finalNameAr);

    if (seen.has(slug)) {
      duplicates.push(finalNameAr);
      continue;
    }
    seen.add(slug);

    const confidence = colIdx["confidence_score"] != null ? raw[colIdx["confidence_score"]] : "";
    const confidenceNum = confidence ? Number(String(confidence).match(/\d+/)?.[0]) : null;

    out.push({
      name_en,
      name_ar: finalNameAr,
      slug,
      branch: "downtown",
      category: get("category"),
      detailed_specialisation: get("detailed_specialisation"),
      products_services: get("products_services"),
      tech_related: colIdx["tech_related"] != null ? parseBoolAr(raw[colIdx["tech_related"]]) : null,
      floor_unit_location: get("floor_unit_location"),
      phone: get("phone"),
      whatsapp: get("whatsapp"),
      email: get("email"),
      website: get("website"),
      facebook_url: get("facebook_url"),
      instagram_url: get("instagram_url"),
      google_maps_url: get("google_maps_url"),
      opening_hours: get("opening_hours"),
      current_status: get("current_status"),
      evidence_summary: get("evidence_summary"),
      source_1_url: get("source_1_url"),
      source_2_url: get("source_2_url"),
      source_3_url: get("source_3_url"),
      last_evidence_date: get("last_evidence_date"),
      confidence_score: Number.isFinite(confidenceNum) ? confidenceNum : null,
      notes_for_website_team: get("notes_for_website_team"),
      verification_status: get("verification_status") ?? "UNREVIEWED_LISTED_ONLY",
      recommended_badge: get("recommended_badge"),
      show_verified_publicly: false, // never auto-publish; admin must confirm
      missing_data: get("missing_data"),
      summary_ar: get("summary_ar"),
      summary_en: get("summary_en"),
      next_action: get("next_action"),
      original_directory_presence: get("original_directory_presence"),
      source_date_quality: get("source_date_quality"),
      row_type: get("row_type"),
      is_active: true,
    });
  }
  return { rows: out, duplicates, invalid };
}

export function DowntownCsvImporter() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [overwriteConfirmed, setOverwriteConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    const text = await file.text();
    const matrix = parseCsv(text);
    setParsed(rowsToRecords(matrix));
  };

  const loadSeed = async () => {
    const res = await fetch("/downtown-seed.csv");
    const text = await res.text();
    setParsed(rowsToRecords(parseCsv(text)));
  };

  const commit = async () => {
    if (!parsed?.rows.length) return;
    setBusy(true);
    try {
      // Find existing rows by slug to decide insert vs upsert behaviour.
      const slugs = parsed.rows.map(r => r.slug as string);
      const { data: existing } = await supabase
        .from("downtown_merchants")
        .select("slug, confirmed_by_team_at")
        .in("slug", slugs);
      const existingMap = new Map((existing ?? []).map(e => [e.slug, e]));

      const toUpsert = parsed.rows.filter(r => {
        const ex = existingMap.get(r.slug as string);
        if (!ex) return true;                              // brand new row
        if (overwriteConfirmed) return true;               // explicit overwrite
        return !ex.confirmed_by_team_at;                   // safe to update unconfirmed rows
      });

      // Chunked upsert (Supabase row payload limits).
      const chunkSize = 50;
      let upserted = 0;
      for (let i = 0; i < toUpsert.length; i += chunkSize) {
        const chunk = toUpsert.slice(i, i + chunkSize);
        const { error } = await supabase
          .from("downtown_merchants")
          .upsert(chunk as never, { onConflict: "slug" });
        if (error) throw error;
        upserted += chunk.length;
      }

      const skipped = parsed.rows.length - upserted;
      queryClient.invalidateQueries({ queryKey: ["admin-downtown-merchants"] });
      toast({
        title: "اكتمل الاستيراد",
        description: `تم تحديث/إضافة ${upserted} محل. تم تخطي ${skipped} محل محمي.`,
      });
      setParsed(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "خطأ غير معروف";
      toast({ title: "فشل الاستيراد", description: msg, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card-premium p-4">
        <h3 className="text-[0.88rem] font-bold text-foreground">استيراد دليل وسط البلد</h3>
        <p className="mt-1 text-[0.72rem] text-muted-foreground">
          يقبل ملف CSV/Excel بأعمدة الورقة الأصلية. لن يتم تجاوز المحلات المؤكدة يدوياً إلا عند تفعيل الخيار أدناه.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            <Button variant="outline" asChild className="h-9 text-[0.78rem]">
              <span><Upload className="ml-1 h-4 w-4" /> اختر ملف CSV</span>
            </Button>
          </label>
          <Button variant="cta" size="sm" onClick={loadSeed} className="text-[0.78rem]">
            <FileText className="ml-1 h-4 w-4" /> تحميل البذرة الأصلية (61 محل)
          </Button>
        </div>

        <label className="mt-3 flex items-center gap-2 text-[0.72rem] text-muted-foreground">
          <input type="checkbox" checked={overwriteConfirmed} onChange={(e) => setOverwriteConfirmed(e.target.checked)} />
          استبدال البيانات المؤكدة يدوياً (غير موصى به)
        </label>
      </div>

      {parsed && (
        <div className="card-premium p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[0.7rem]">
              <CheckCircle2 className="ml-1 h-3 w-3" /> {parsed.rows.length} صف جاهز
            </Badge>
            {parsed.duplicates.length > 0 && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.7rem]">
                <AlertTriangle className="ml-1 h-3 w-3" /> {parsed.duplicates.length} مكرر
              </Badge>
            )}
            {parsed.invalid > 0 && (
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[0.7rem]">
                {parsed.invalid} صف غير صالح
              </Badge>
            )}
          </div>

          {parsed.duplicates.length > 0 && (
            <div className="rounded-md bg-amber-500/5 p-2 text-[0.7rem] text-amber-700 dark:text-amber-400">
              تم تجاهل التكرارات: {parsed.duplicates.slice(0, 6).join("، ")}{parsed.duplicates.length > 6 ? "…" : ""}
            </div>
          )}

          <div className="max-h-64 overflow-y-auto rounded-md border border-border">
            <table className="w-full text-[0.7rem]">
              <thead className="bg-secondary text-muted-foreground">
                <tr><th className="px-2 py-1.5 text-right">الاسم</th><th className="px-2 py-1.5">الحالة</th><th className="px-2 py-1.5">ثقة</th><th className="px-2 py-1.5">تقنية</th></tr>
              </thead>
              <tbody>
                {parsed.rows.slice(0, 30).map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-2 py-1 text-right">{r.name_ar as string}</td>
                    <td className="px-2 py-1 text-center text-muted-foreground">{(r.verification_status as string) ?? "—"}</td>
                    <td className="px-2 py-1 text-center">{r.confidence_score as number ?? "—"}</td>
                    <td className="px-2 py-1 text-center">{r.tech_related === true ? "نعم" : r.tech_related === false ? "لا" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsed.rows.length > 30 && <p className="border-t border-border bg-secondary/40 p-2 text-center text-[0.65rem] text-muted-foreground">+{parsed.rows.length - 30} صف إضافي</p>}
          </div>

          <div className="flex gap-2">
            <Button variant="cta" onClick={commit} disabled={busy} className="text-[0.78rem]">
              {busy ? "جاري التنفيذ..." : `تأكيد الاستيراد (${parsed.rows.length})`}
            </Button>
            <Button variant="ghost" onClick={() => setParsed(null)} className="text-[0.78rem]">إلغاء</Button>
          </div>
        </div>
      )}
    </div>
  );
}
