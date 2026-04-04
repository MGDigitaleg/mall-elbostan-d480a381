import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, AlertCircle, Download, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CsvRow {
  title: string;
  slug: string;
  brand?: string;
  category_slug?: string;
  product_type?: string;
  condition?: string;
  status?: string;
  featured?: string;
  description?: string;
  short_description?: string;
  seo_title?: string;
  seo_description?: string;
  variant_name?: string;
  sku?: string;
  price?: string;
  compare_price?: string;
  stock_qty?: string;
  ram?: string;
  storage?: string;
  processor?: string;
  color?: string;
  is_default?: string;
  image_url?: string;
  image_alt?: string;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? "";
    });
    return row as unknown as CsvRow;
  });
}

interface ImportResult {
  productsCreated: number;
  productsUpdated: number;
  variantsCreated: number;
  imagesCreated: number;
  errors: string[];
}

export default function KzCsvImporter({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [rows, setRows] = useState<CsvRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRows(parseCsv(text));
    };
    reader.readAsText(file, "utf-8");
  };

  const doImport = async () => {
    if (!rows.length) return;
    setImporting(true);
    const res: ImportResult = { productsCreated: 0, productsUpdated: 0, variantsCreated: 0, imagesCreated: 0, errors: [] };

    // fetch categories for slug lookup
    const { data: cats } = await supabase.from("kz_categories").select("id, slug");
    const catMap = new Map((cats ?? []).map((c) => [c.slug, c.id]));

    // group rows by slug (each slug = one product, multiple rows = multiple variants/images)
    const grouped = new Map<string, CsvRow[]>();
    for (const row of rows) {
      if (!row.title || !row.slug) {
        res.errors.push(`صف بدون عنوان أو slug: ${JSON.stringify(row).slice(0, 80)}`);
        continue;
      }
      const key = row.slug;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(row);
    }

    for (const [slug, productRows] of grouped) {
      try {
        const first = productRows[0];
        const categoryId = first.category_slug ? catMap.get(first.category_slug) ?? null : null;

        // upsert product
        const { data: existing } = await supabase.from("kz_products").select("id").eq("slug", slug).maybeSingle();

        let productId: string;
        const payload = {
          title: first.title,
          slug,
          brand: first.brand || null,
          category_id: categoryId,
          product_type: first.product_type || null,
          condition: first.condition || "new",
          status: first.status || "published",
          featured: first.featured === "true" || first.featured === "1",
          description: first.description || null,
          short_description: first.short_description || null,
          seo_title: first.seo_title || null,
          seo_description: first.seo_description || null,
        };

        if (existing) {
          await supabase.from("kz_products").update(payload).eq("id", existing.id);
          productId = existing.id;
          res.productsUpdated++;
        } else {
          const { data: inserted, error } = await supabase.from("kz_products").insert(payload).select("id").single();
          if (error) throw error;
          productId = inserted.id;
          res.productsCreated++;
        }

        // insert variants & images from each row
        for (const row of productRows) {
          if (row.price) {
            const { error } = await supabase.from("kz_product_variants").insert({
              product_id: productId,
              variant_name: row.variant_name || null,
              sku: row.sku || null,
              price: Number(row.price) || 0,
              compare_price: row.compare_price ? Number(row.compare_price) : null,
              stock_qty: Number(row.stock_qty) || 0,
              ram: row.ram || null,
              storage: row.storage || null,
              processor: row.processor || null,
              color: row.color || null,
              is_default: row.is_default === "true" || row.is_default === "1",
            });
            if (error) res.errors.push(`متغير ${slug}: ${error.message}`);
            else res.variantsCreated++;
          }

          if (row.image_url) {
            const { error } = await supabase.from("kz_product_images").insert({
              product_id: productId,
              image_url: row.image_url,
              alt_text: row.image_alt || null,
              sort_order: 0,
            });
            if (error) res.errors.push(`صورة ${slug}: ${error.message}`);
            else res.imagesCreated++;
          }
        }
      } catch (err) {
        res.errors.push(`${slug}: ${String(err)}`);
      }
    }

    setResult(res);
    setImporting(false);
    queryClient.invalidateQueries({ queryKey: ["kz-admin-products"] });
    toast({ title: `تم استيراد ${res.productsCreated + res.productsUpdated} منتج` });
  };

  const downloadTemplate = () => {
    const headers = "title,slug,brand,category_slug,product_type,condition,status,featured,description,short_description,seo_title,seo_description,variant_name,sku,price,compare_price,stock_qty,ram,storage,processor,color,is_default,image_url,image_alt";
    const sample = '"Dell Latitude 5440","dell-latitude-5440","Dell","laptops","laptop","new","published","true","وصف المنتج","وصف مختصر","","","i5 / 8GB / 256GB","DL5440-001","22999","25999","10","8GB","256GB SSD","Intel Core i5","Black","true","https://example.com/img.jpg","Dell Latitude"';
    const blob = new Blob([headers + "\n" + sample], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kz-products-template.csv";
    a.click();
  };

  return (
    <div className="space-y-5">
      {/* Download template */}
      <Button variant="outline" size="sm" className="gap-2 text-[0.78rem]" onClick={downloadTemplate}>
        <Download className="h-3.5 w-3.5" /> تحميل نموذج CSV
      </Button>

      {/* File input */}
      <div
        className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{fileName || "اضغط لاختيار ملف CSV"}</p>
      </div>

      {/* Preview */}
      {rows.length > 0 && !result && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">{rows.length} صف جاهز للاستيراد</span>
          </div>

          {/* Preview table */}
          <div className="max-h-48 overflow-auto rounded-lg border border-border">
            <table className="w-full text-[0.72rem]">
              <thead className="bg-secondary sticky top-0">
                <tr>
                  <th className="p-2 text-right font-semibold text-foreground">العنوان</th>
                  <th className="p-2 text-right font-semibold text-foreground">Slug</th>
                  <th className="p-2 text-right font-semibold text-foreground">الماركة</th>
                  <th className="p-2 text-right font-semibold text-foreground">السعر</th>
                  <th className="p-2 text-right font-semibold text-foreground">المتغير</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 10).map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2 text-foreground truncate max-w-[200px]">{r.title}</td>
                    <td className="p-2 text-muted-foreground truncate max-w-[160px]">{r.slug}</td>
                    <td className="p-2 text-muted-foreground">{r.brand}</td>
                    <td className="p-2 text-muted-foreground">{r.price}</td>
                    <td className="p-2 text-muted-foreground">{r.variant_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 10 && <p className="text-center text-[0.68rem] text-muted-foreground py-1">... و {rows.length - 10} صف آخر</p>}
          </div>

          <Button variant="cta" className="w-full gap-2" onClick={doImport} disabled={importing}>
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {importing ? "جاري الاستيراد..." : `استيراد ${rows.length} صف`}
          </Button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            {result.errors.length === 0 ? (
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
            <span className="text-sm font-bold text-foreground">نتيجة الاستيراد</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{result.productsCreated} منتج جديد</Badge>
            <Badge variant="secondary">{result.productsUpdated} منتج محدّث</Badge>
            <Badge variant="secondary">{result.variantsCreated} متغير</Badge>
            <Badge variant="secondary">{result.imagesCreated} صورة</Badge>
          </div>

          {result.errors.length > 0 && (
            <div className="max-h-32 overflow-auto rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-[0.72rem] text-destructive space-y-1">
              {result.errors.map((e, i) => (
                <p key={i}>{e}</p>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { setRows([]); setResult(null); setFileName(""); }}>
              استيراد آخر
            </Button>
            <Button variant="secondary" size="sm" onClick={onClose}>
              إغلاق
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
