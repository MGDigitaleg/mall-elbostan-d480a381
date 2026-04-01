import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, CircleHelp, Clock3, Eye, FileImage, FileSearch, FolderTree, ImageUp, Loader2, PackageCheck, RefreshCw, Sparkles, Upload, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { exportStructureExamples, logoMatchingMatrixRows, missingLogoRows, tenantAssetStats, tenantMasterRows, type LogoStatus, workflowSummary } from "@/lib/tenantAssetData";
import { assetTypeOptions, cleanupChecklist, getAssetStoragePath, getMatchedAssetLabel, getUnitExportReferences, inferAssetType, isImageAsset, normalizeStoragePath, reviewStageLabels, reviewStatusOptions, type AssetReviewStage, type TenantLogoAssetRecord } from "@/lib/tenantAssetWorkspace";
import { cn } from "@/lib/utils";

const statusConfig: Record<LogoStatus, { className: string; icon: typeof CheckCircle2; helper: string }> = {
  Confirmed: {
    className: "border-success/20 bg-success/10 text-success",
    icon: CheckCircle2,
    helper: "Ready to move into final export placement.",
  },
  "Needs Cleanup": {
    className: "border-primary/15 bg-primary/10 text-primary",
    icon: Sparkles,
    helper: "Source exists, but it still needs isolation, crop, and transparent export.",
  },
  "Needs Better Source": {
    className: "border-accent/20 bg-accent/10 text-accent",
    icon: Upload,
    helper: "A reference exists, but a cleaner input source is required before production export.",
  },
  Missing: {
    className: "border-destructive/20 bg-destructive/10 text-destructive",
    icon: XCircle,
    helper: "No logo source is currently available.",
  },
  "Pending Confirmation": {
    className: "border-orange/20 bg-orange/10 text-orange",
    icon: Clock3,
    helper: "Source exists, but the unit-to-brand mapping still needs a quick confirmation.",
  },
};

const floorLabels = {
  Ground: "Ground",
  First: "First",
  Second: "Second",
} as const;

const checklistKeyMap = {
  background_removal_needed: "background_removal_needed",
  crop_needed: "crop_needed",
  transparent_export_ready: "transparent_export_ready",
  square_artboard_ready: "square_artboard_ready",
  safe_margin_applied: "safe_margin_applied",
} as const;

function buildStoragePublicUrl(path?: string | null) {
  if (!path) return null;
  const normalizedPath = normalizeStoragePath(path);
  const { data } = supabase.storage.from("logos").getPublicUrl(normalizedPath);
  return data.publicUrl;
}

function StatusBadge({ status }: { status: LogoStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("gap-1.5 rounded-full px-3 py-1 text-[0.76rem] font-semibold", config.className)}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </Badge>
  );
}

function LogoPlaceholder({ title, status }: { title: string; status: LogoStatus }) {
  return (
    <div className="flex aspect-square w-full items-center justify-center rounded-[1.15rem] border border-dashed border-border bg-muted/60 p-4 text-center">
      <div className="space-y-2">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
          <FileImage className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{status === "Missing" ? "Missing Logo" : "Source under review"}</p>
        </div>
      </div>
    </div>
  );
}

function AssetFileBadge({ label }: { label: string }) {
  return <Badge variant="outline" className="rounded-full border-border bg-background px-3 py-1 text-[0.72rem] font-semibold text-foreground">{label}</Badge>;
}

function AssetPreview({ asset }: { asset: TenantLogoAssetRecord }) {
  const previewTarget = asset.review_file_path ?? asset.raw_file_path ?? asset.final_file_path ?? asset.source_file_path;
  const previewUrl = buildStoragePublicUrl(previewTarget);

  if (previewUrl && isImageAsset(previewTarget)) {
    return (
      <div className="overflow-hidden rounded-[1.15rem] border border-border bg-muted/50">
        <img src={previewUrl} alt={asset.normalized_display_name} className="aspect-square w-full object-contain p-4" loading="lazy" />
      </div>
    );
  }

  if (previewTarget) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center rounded-[1.15rem] border border-dashed border-border bg-muted/60 p-4 text-center">
        <FileSearch className="h-7 w-7 text-muted-foreground" />
        <p className="mt-3 text-sm font-semibold text-foreground">Preview available as file</p>
        <p className="mt-1 text-xs text-muted-foreground">{previewTarget.split("/").slice(-2).join("/")}</p>
      </div>
    );
  }

  return <LogoPlaceholder title={asset.normalized_display_name} status={asset.review_status} />;
}

function AssetCard({ asset }: { asset: TenantLogoAssetRecord }) {
  const matchedAsset = getMatchedAssetLabel(asset.normalized_display_name) ?? asset.asset_type ?? "Awaiting source";

  return (
    <Card className="rounded-[1.5rem] border-border/90 shadow-[var(--shadow-soft)]">
      <CardContent className="grid gap-4 p-4 xl:grid-cols-[0.92fr_1.08fr]">
        <AssetPreview asset={asset} />
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">{asset.normalized_display_name}</p>
              <p className="text-sm text-muted-foreground">{asset.tenant_provided_name}</p>
            </div>
            <StatusBadge status={asset.review_status} />
          </div>

          <div className="flex flex-wrap gap-2">
            <AssetFileBadge label={asset.asset_type ?? "No source type"} />
            <AssetFileBadge label={`${asset.units.length} unit${asset.units.length > 1 ? "s" : ""}`} />
            {asset.approved_for_final_export ? <AssetFileBadge label="Approved for export" /> : null}
          </div>

          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div className="rounded-[1rem] border border-border bg-background p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Matched asset</p>
              <p className="mt-2 font-medium text-foreground">{matchedAsset}</p>
            </div>
            <div className="rounded-[1rem] border border-border bg-background p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Final export filename</p>
              <p className="mt-2 font-medium text-foreground" dir="ltr">{asset.final_export_name ?? "Pending final name"}</p>
            </div>
          </div>

          <div className="rounded-[1rem] border border-border bg-background p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Notes</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{asset.reviewer_notes ?? asset.execution_note ?? "No notes yet."}</p>
          </div>

          <div className="rounded-[1rem] border border-border bg-background p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Per-unit final exports</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {getUnitExportReferences(asset.units).map((item) => (
                <span key={item.unit} className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground" dir="ltr">
                  {item.unit} → {item.exportPath}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AssetFormSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      {children}
    </div>
  );
}

const AdminTenantAssets = () => {
  const { loading } = useRequireAdmin();
  const queryClient = useQueryClient();
  const [selectedBrandKey, setSelectedBrandKey] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<AssetReviewStage>("raw");
  const [statusValue, setStatusValue] = useState<LogoStatus>("Missing");
  const [assetTypeValue, setAssetTypeValue] = useState<string>("Placeholder Only");
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [lastFollowUpNote, setLastFollowUpNote] = useState("");
  const [requestedSourceType, setRequestedSourceType] = useState("");
  const [finalExportName, setFinalExportName] = useState("");
  const [checklistState, setChecklistState] = useState({
    background_removal_needed: false,
    crop_needed: false,
    transparent_export_ready: false,
    square_artboard_ready: false,
    safe_margin_applied: false,
  });
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const { data: tenantAssets, isLoading: assetsLoading } = useQuery({
    queryKey: ["tenant-logo-assets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tenant_logo_assets").select("*").order("normalized_display_name");
      if (error) throw error;
      return (data ?? []) as TenantLogoAssetRecord[];
    },
  });

  const selectedAsset = useMemo(
    () => tenantAssets?.find((asset) => asset.brand_key === selectedBrandKey) ?? tenantAssets?.[0] ?? null,
    [selectedBrandKey, tenantAssets],
  );

  const confirmedQueue = useMemo(
    () => (tenantAssets ?? []).filter((asset) => asset.review_status !== "Missing"),
    [tenantAssets],
  );

  const missingQueue = useMemo(
    () => (tenantAssets ?? []).filter((asset) => asset.review_status === "Missing"),
    [tenantAssets],
  );

  const summaryCounts = useMemo(() => {
    const all = tenantAssets ?? [];
    return {
      approved: all.filter((asset) => asset.approved_for_final_export).length,
      review: all.filter((asset) => asset.review_file_path).length,
      raw: all.filter((asset) => asset.raw_file_path).length,
      final: all.filter((asset) => asset.final_file_path).length,
    };
  }, [tenantAssets]);

  const syncFormFromAsset = (asset: TenantLogoAssetRecord | null) => {
    if (!asset) return;
    setSelectedBrandKey(asset.brand_key);
    setStatusValue(asset.review_status);
    setAssetTypeValue(asset.asset_type ?? "Placeholder Only");
    setReviewerNotes(asset.reviewer_notes ?? "");
    setLastFollowUpNote(asset.last_follow_up_note ?? "");
    setRequestedSourceType(asset.requested_source_type ?? "");
    setFinalExportName(asset.final_export_name ?? "");
    setChecklistState({
      background_removal_needed: asset.background_removal_needed,
      crop_needed: asset.crop_needed,
      transparent_export_ready: asset.transparent_export_ready,
      square_artboard_ready: asset.square_artboard_ready,
      safe_margin_applied: asset.safe_margin_applied,
    });
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAsset || !fileToUpload) throw new Error("Missing asset or source file.");
      const storagePath = getAssetStoragePath(selectedAsset.brand_key, selectedStage, fileToUpload);
      const { error: uploadError } = await supabase.storage.from("logos").upload(storagePath, fileToUpload, { upsert: true });
      if (uploadError) throw uploadError;

      const normalizedPath = `logos/${storagePath}`;
      const updates: Partial<TenantLogoAssetRecord> = {
        source_file_name: fileToUpload.name,
        source_file_path: normalizedPath,
        asset_type: inferAssetType(fileToUpload),
        review_status: selectedAsset.review_status === "Missing" ? "Pending Confirmation" : selectedAsset.review_status,
      };

      if (selectedStage === "raw") updates.raw_file_path = normalizedPath;
      if (selectedStage === "review") updates.review_file_path = normalizedPath;
      if (selectedStage === "final") {
        updates.final_file_path = normalizedPath;
        updates.approved_for_final_export = true;
      }

      const { error: updateError } = await supabase.from("tenant_logo_assets").update(updates).eq("brand_key", selectedAsset.brand_key);
      if (updateError) throw updateError;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tenant-logo-assets"] });
      setFileToUpload(null);
      toast.success("Asset file uploaded successfully.");
    },
    onError: (error: Error) => toast.error(error.message || "Could not upload asset file."),
  });

  const saveReviewMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAsset) throw new Error("Choose a tenant brand first.");
      const finalExportPath = selectedAsset.units[0] ? `/logos/final/${selectedAsset.units[0]}_${finalExportName || selectedAsset.normalized_display_name}.png` : selectedAsset.final_export_path;

      const { error } = await supabase.from("tenant_logo_assets").update({
        review_status: statusValue,
        asset_type: assetTypeValue,
        reviewer_notes: reviewerNotes.trim() || null,
        last_follow_up_note: lastFollowUpNote.trim() || null,
        requested_source_type: requestedSourceType.trim() || null,
        final_export_name: finalExportName.trim() || null,
        final_export_path: finalExportPath,
        background_removal_needed: checklistState.background_removal_needed,
        crop_needed: checklistState.crop_needed,
        transparent_export_ready: checklistState.transparent_export_ready,
        square_artboard_ready: checklistState.square_artboard_ready,
        safe_margin_applied: checklistState.safe_margin_applied,
      }).eq("brand_key", selectedAsset.brand_key);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tenant-logo-assets"] });
      toast.success("Review details saved.");
    },
    onError: (error: Error) => toast.error(error.message || "Could not save review details."),
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAsset) throw new Error("Choose a tenant brand first.");
      const { error } = await supabase.from("tenant_logo_assets").update({
        approved_for_final_export: true,
        review_status: "Confirmed",
        transparent_export_ready: true,
        square_artboard_ready: true,
        safe_margin_applied: true,
      }).eq("brand_key", selectedAsset.brand_key);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tenant-logo-assets"] });
      toast.success("Asset approved for final export.");
    },
    onError: (error: Error) => toast.error(error.message || "Could not approve asset."),
  });

  const flagMissingMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAsset) throw new Error("Choose a tenant brand first.");
      const { error } = await supabase.from("tenant_logo_assets").update({
        review_status: "Missing",
        approved_for_final_export: false,
        review_file_path: null,
        final_file_path: null,
      }).eq("brand_key", selectedAsset.brand_key);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tenant-logo-assets"] });
      toast.success("Asset moved to missing queue.");
    },
    onError: (error: Error) => toast.error(error.message || "Could not flag as missing."),
  });

  if (!selectedBrandKey && tenantAssets?.length) {
    syncFormFromAsset(tenantAssets[0]);
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Loading tenant assets...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex min-h-16 items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-primary transition-colors hover:text-foreground" aria-label="Back to admin dashboard">
              <ArrowRight className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Tenant Logo Workspace</h1>
              <p className="text-sm text-muted-foreground">Master list, matching matrix, missing logos, review status, and final export planning.</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="outline" size="sm" asChild>
              <a href="#matching-matrix">Logo Matching Matrix</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="#asset-review">Asset Review</a>
            </Button>
            <Button variant="cta" size="sm" asChild>
              <a href="#missing-logos">Missing Logos</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container space-y-8 py-8 md:space-y-10 md:py-10">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Occupied Units", value: tenantAssetStats.totalUnits, note: "Exact tenant list locked by unit." },
            { label: "Unique Brands", value: tenantAssetStats.totalBrands, note: "One matrix row per tenant brand." },
            { label: "Matched Sources", value: tenantAssetStats.confirmedSourceMatches, note: "Sources available for cleanup or confirmation." },
            { label: "Missing Logos", value: tenantAssetStats.missingBrands, note: "Brands still waiting for a usable source file." },
            { label: "Raw Files", value: summaryCounts.raw, note: "Brands with at least one raw source file uploaded." },
            { label: "Review Versions", value: summaryCounts.review, note: "Brands with review-stage files ready for QA." },
            { label: "Final Files", value: summaryCounts.final, note: "Brands with approved final-stage exports in storage." },
            { label: "Approved", value: summaryCounts.approved, note: "Brands approved for final directory placement." },
          ].map((item) => (
            <Card key={item.label} className="rounded-[1.5rem] border-border/90 shadow-[var(--shadow-soft)]">
              <CardHeader className="space-y-2 pb-3">
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{item.label}</CardDescription>
                <CardTitle className="text-4xl font-bold text-foreground">{item.value}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm leading-6 text-muted-foreground">{item.note}</CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="rounded-[1.75rem] border-border/90 shadow-[var(--shadow-card)]">
            <CardHeader className="space-y-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Asset Review Workflow</CardDescription>
              <CardTitle className="text-2xl text-foreground">Simple production flow for every occupied unit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid gap-3 lg:grid-cols-2">
                {workflowSummary.map((item) => {
                  const config = statusConfig[item.status];
                  const Icon = config.icon;

                  return (
                    <div key={item.status} className="rounded-[1.35rem] border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className={cn("flex h-9 w-9 items-center justify-center rounded-full border", config.className)}>
                              <Icon className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{item.status}</p>
                              <p className="text-xs text-muted-foreground">{item.count} brands</p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-muted-foreground">{config.helper}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.brands.length > 0 ? item.brands.map((brand) => (
                          <span key={brand} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
                            {brand}
                          </span>
                        )) : (
                          <span className="text-sm text-muted-foreground">No brands in this stage.</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-[1.35rem] border border-border bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">Operational rules</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  <li>1. Keep the tenant list locked to Ground, First, and Second with exact unit IDs.</li>
                  <li>2. Only clean existing sources: remove background, crop safely, center on a square, export transparent PNG.</li>
                  <li>3. Never redraw, recolor, or invent missing logos — unresolved brands stay flagged as Missing.</li>
                  <li>4. Repeated brands reuse one cleaned master source, then export one file per occupied unit.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border-border/90 shadow-[var(--shadow-card)]">
            <CardHeader className="space-y-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Export Structure</CardDescription>
              <CardTitle className="text-2xl text-foreground">Final logo naming and placement logic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="rounded-[1.35rem] border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FolderTree className="h-4.5 w-4.5 text-primary" />
                  Directory tree
                </div>
                <div className="mt-3 rounded-[1rem] bg-secondary/70 p-4 font-mono text-xs leading-6 text-foreground" dir="ltr">
                  /logos/raw/\n
                  /logos/review/\n
                  /logos/final/
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Example final exports</p>
                <div className="mt-3 space-y-2 rounded-[1rem] bg-secondary/70 p-4 font-mono text-xs leading-6 text-foreground" dir="ltr">
                  {exportStructureExamples.map((path) => (
                    <p key={path}>{path}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-border bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">Current export rule</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground" dir="ltr">
                  /logos/final/[UNIT]_[Normalized-Brand-Name].png
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="asset-review" className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Asset Upload + Review</p>
            <h2 className="text-2xl font-bold text-foreground">Real upload, review, approval, and file organization flow</h2>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
            <Card className="rounded-[1.75rem] border-border/90 shadow-[var(--shadow-card)]">
              <CardHeader className="space-y-2">
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Review Controls</CardDescription>
                <CardTitle className="text-2xl text-foreground">Per-brand asset execution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-0">
                {assetsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 rounded-[1rem]" />
                    <Skeleton className="h-10 rounded-[1rem]" />
                    <Skeleton className="h-32 rounded-[1rem]" />
                  </div>
                ) : (
                  <>
                    <AssetFormSection label="Tenant Brand">
                      <Select
                        value={selectedAsset?.brand_key ?? ""}
                        onValueChange={(value) => syncFormFromAsset(tenantAssets?.find((asset) => asset.brand_key === value) ?? null)}
                      >
                        <SelectTrigger className="h-12 rounded-[1rem] border-border bg-background">
                          <SelectValue placeholder="Choose tenant brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {(tenantAssets ?? []).map((asset) => (
                            <SelectItem key={asset.brand_key} value={asset.brand_key}>{asset.normalized_display_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </AssetFormSection>

                    <div className="grid gap-4 md:grid-cols-2">
                      <AssetFormSection label="Units">
                        <div className="rounded-[1rem] border border-border bg-background px-4 py-3 text-sm text-foreground">
                          {selectedAsset?.units.join(" / ") ?? "—"}
                        </div>
                      </AssetFormSection>
                      <AssetFormSection label="Final Export Path">
                        <div className="rounded-[1rem] border border-border bg-background px-4 py-3 text-sm text-foreground" dir="ltr">
                          {selectedAsset?.final_export_path ?? "—"}
                        </div>
                      </AssetFormSection>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <AssetFormSection label="Asset Type">
                        <Select value={assetTypeValue} onValueChange={setAssetTypeValue}>
                          <SelectTrigger className="h-12 rounded-[1rem] border-border bg-background">
                            <SelectValue placeholder="Select source type" />
                          </SelectTrigger>
                          <SelectContent>
                            {assetTypeOptions.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </AssetFormSection>
                      <AssetFormSection label="Current Review Status">
                        <Select value={statusValue} onValueChange={(value: LogoStatus) => setStatusValue(value)}>
                          <SelectTrigger className="h-12 rounded-[1rem] border-border bg-background">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {reviewStatusOptions.map((status) => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </AssetFormSection>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <AssetFormSection label="Final Export Name">
                        <Input value={finalExportName} onChange={(event) => setFinalExportName(event.target.value)} className="h-12 rounded-[1rem] border-border bg-background" dir="ltr" placeholder="e.g. Quick-Fix.png" />
                      </AssetFormSection>
                      <AssetFormSection label="Upload Stage">
                        <Select value={selectedStage} onValueChange={(value: AssetReviewStage) => setSelectedStage(value)}>
                          <SelectTrigger className="h-12 rounded-[1rem] border-border bg-background">
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(reviewStageLabels) as AssetReviewStage[]).map((stage) => (
                              <SelectItem key={stage} value={stage}>{reviewStageLabels[stage]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </AssetFormSection>
                    </div>

                    <div className="rounded-[1.25rem] border border-border bg-muted/35 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">Upload source file</p>
                          <p className="text-xs text-muted-foreground">Raw, review, and final all store inside the private logos bucket.</p>
                        </div>
                        <AssetFileBadge label={`/logos/${selectedStage}/`} />
                      </div>
                      <Input type="file" className="mt-4 h-12 rounded-[1rem] border-border bg-background file:font-semibold" onChange={(event) => setFileToUpload(event.target.files?.[0] ?? null)} />
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button variant="cta" className="min-w-[13rem]" onClick={() => uploadMutation.mutate()} disabled={!selectedAsset || !fileToUpload || uploadMutation.isPending}>
                          {uploadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}
                          upload source file
                        </Button>
                        <Button variant="outline" className="min-w-[13rem]" onClick={() => setFileToUpload(null)} disabled={!fileToUpload || uploadMutation.isPending}>
                          <RefreshCw className="h-4 w-4" />
                          replace selected file
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <AssetFormSection label="Reviewer Notes">
                        <Textarea value={reviewerNotes} onChange={(event) => setReviewerNotes(event.target.value)} className="min-h-[120px] rounded-[1rem] border-border bg-background" placeholder="What needs cleanup, what is approved, or what still needs a better source?" />
                      </AssetFormSection>
                      <div className="space-y-4">
                        <AssetFormSection label="Requested Source Type">
                          <Input value={requestedSourceType} onChange={(event) => setRequestedSourceType(event.target.value)} className="h-12 rounded-[1rem] border-border bg-background" placeholder="Official logo file, PDF, storefront photo..." />
                        </AssetFormSection>
                        <AssetFormSection label="Last Follow-up Note">
                          <Textarea value={lastFollowUpNote} onChange={(event) => setLastFollowUpNote(event.target.value)} className="min-h-[72px] rounded-[1rem] border-border bg-background" placeholder="Latest outreach or missing-source note" />
                        </AssetFormSection>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-border bg-background p-4">
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-foreground">Cleanup readiness tracking</p>
                        <p className="text-xs text-muted-foreground">Mark what is still required before a final transparent PNG export.</p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {cleanupChecklist.map((item) => (
                          <label key={item.key} className="flex items-center gap-3 rounded-[1rem] border border-border bg-muted/35 px-3 py-3 text-sm text-foreground">
                            <Checkbox
                              checked={checklistState[checklistKeyMap[item.key]]}
                              onCheckedChange={(checked) => setChecklistState((current) => ({ ...current, [item.key]: checked === true }))}
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button variant="cta" className="min-w-[12rem]" onClick={() => saveReviewMutation.mutate()} disabled={!selectedAsset || saveReviewMutation.isPending}>
                        {saveReviewMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        save review
                      </Button>
                      <Button variant="outline-blue" className="min-w-[12rem]" onClick={() => approveMutation.mutate()} disabled={!selectedAsset || approveMutation.isPending}>
                        {approveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageCheck className="h-4 w-4" />}
                        approve for export
                      </Button>
                      <Button variant="outline" className="min-w-[12rem]" onClick={() => flagMissingMutation.mutate()} disabled={!selectedAsset || flagMissingMutation.isPending}>
                        {flagMissingMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        flag as missing
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[1.75rem] border-border/90 shadow-[var(--shadow-card)]">
              <CardHeader className="space-y-2">
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Review Queue</CardDescription>
                <CardTitle className="text-2xl text-foreground">Confirmed cleanup queue and missing collection queue</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs defaultValue="confirmed" className="space-y-4">
                  <TabsList className="h-auto rounded-[1rem] bg-muted/60 p-1">
                    <TabsTrigger value="confirmed" className="rounded-[0.85rem] px-4 py-2">Confirmed asset review queue</TabsTrigger>
                    <TabsTrigger value="missing" className="rounded-[0.85rem] px-4 py-2">Missing logo collection queue</TabsTrigger>
                  </TabsList>

                  <TabsContent value="confirmed" className="space-y-4">
                    <ScrollArea className="h-[56rem] pr-4">
                      <div className="space-y-4">
                        {confirmedQueue.map((asset) => (
                          <AssetCard key={asset.brand_key} asset={asset} />
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="missing" className="space-y-4">
                    <Card className="rounded-[1.5rem] border-border shadow-[var(--shadow-soft)]">
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tenant</TableHead>
                              <TableHead>Unit(s)</TableHead>
                              <TableHead>Missing Reason</TableHead>
                              <TableHead>Requested Source Type</TableHead>
                              <TableHead>Last Follow-up Note</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {missingQueue.map((asset) => (
                              <TableRow key={asset.brand_key}>
                                <TableCell className="font-medium text-foreground">{asset.normalized_display_name}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-2">
                                    {asset.units.map((unit) => (
                                      <span key={unit} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground" dir="ltr">{unit}</span>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{missingLogoRows.find((row) => row.tenant === asset.normalized_display_name)?.missingReason ?? "No approved logo source exists in the current asset pool."}</TableCell>
                                <TableCell className="text-muted-foreground">{asset.requested_source_type ?? "Official logo file or readable storefront photo"}</TableCell>
                                <TableCell className="text-muted-foreground">{asset.last_follow_up_note ?? "No follow-up logged yet."}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                      {missingQueue.map((asset) => (
                        <Card key={asset.brand_key} className="rounded-[1.5rem] border-border/90 shadow-[var(--shadow-soft)]">
                          <CardContent className="space-y-4 p-4">
                            <LogoPlaceholder title={asset.normalized_display_name} status="Missing" />
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-foreground">{asset.normalized_display_name}</p>
                                <p className="text-xs text-muted-foreground">{asset.units.join(" / ")}</p>
                              </div>
                              <StatusBadge status="Missing" />
                            </div>
                            <Separator />
                            <div className="space-y-2 text-sm">
                              <p className="text-muted-foreground"><span className="font-semibold text-foreground">Requested source:</span> {asset.requested_source_type ?? "Official logo file or readable storefront photo"}</p>
                              <p className="text-muted-foreground"><span className="font-semibold text-foreground">Follow-up:</span> {asset.last_follow_up_note ?? "No follow-up logged yet."}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="tenant-master" className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Tenant Master</p>
              <h2 className="text-2xl font-bold text-foreground">One row per occupied unit</h2>
            </div>
          </div>

          <Card className="rounded-[1.75rem] border-border/90 shadow-[var(--shadow-card)]">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Floor</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Tenant Provided Name</TableHead>
                    <TableHead>Normalized Display Name</TableHead>
                    <TableHead>Logo Status</TableHead>
                    <TableHead>Matched Asset</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Final Export Path</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantMasterRows.map((row) => (
                    <TableRow key={row.unit}>
                      <TableCell className="font-medium text-foreground">{floorLabels[row.floor]}</TableCell>
                      <TableCell className="font-semibold text-foreground" dir="ltr">{row.unit}</TableCell>
                      <TableCell>{row.tenantProvidedName}</TableCell>
                      <TableCell className="font-medium text-foreground">{row.normalizedDisplayName}</TableCell>
                      <TableCell><StatusBadge status={row.logoStatus} /></TableCell>
                      <TableCell className="text-muted-foreground">{row.matchedAsset ?? "Missing Logo"}</TableCell>
                      <TableCell className="min-w-[20rem] text-muted-foreground">{row.notes}</TableCell>
                      <TableCell className="font-mono text-xs text-foreground" dir="ltr">{row.exportPath}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section id="matching-matrix" className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Logo Matching Matrix</p>
            <h2 className="text-2xl font-bold text-foreground">One row per tenant brand</h2>
          </div>

          <Card className="rounded-[1.75rem] border-border/90 shadow-[var(--shadow-card)]">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant Provided Name</TableHead>
                    <TableHead>Normalized Display Name</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Logo Status</TableHead>
                    <TableHead>Matched Asset</TableHead>
                    <TableHead>Execution Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logoMatchingMatrixRows.map((row) => (
                    <TableRow key={row.normalizedDisplayName}>
                      <TableCell>{row.tenantProvidedName}</TableCell>
                      <TableCell className="font-medium text-foreground">{row.normalizedDisplayName}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {row.units.map((unit) => (
                            <span key={unit} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground" dir="ltr">
                              {unit}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={row.logoStatus} /></TableCell>
                      <TableCell className="text-muted-foreground">{row.matchedAsset ?? "Missing Logo"}</TableCell>
                      <TableCell className="min-w-[22rem] text-muted-foreground">{row.executionNote}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section id="missing-logos" className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Missing Logos</p>
            <h2 className="text-2xl font-bold text-foreground">Only unresolved tenant marks</h2>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <Card className="rounded-[1.75rem] border-border/90 shadow-[var(--shadow-card)]">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Missing Reason</TableHead>
                      <TableHead>Next Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missingLogoRows.map((row) => (
                      <TableRow key={row.tenant}>
                        <TableCell className="font-medium text-foreground">{row.tenant}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {row.units.map((unit) => (
                              <span key={unit} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground" dir="ltr">
                                {unit}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{row.missingReason}</TableCell>
                        <TableCell className="text-muted-foreground">{row.nextAction}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="rounded-[1.75rem] border-border/90 shadow-[var(--shadow-card)]">
              <CardHeader className="space-y-2">
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Placeholder Review</CardDescription>
                <CardTitle className="text-2xl text-foreground">Clear missing-logo placeholders</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 pt-0 sm:grid-cols-2 xl:grid-cols-1">
                {missingLogoRows.slice(0, 5).map((row) => (
                  <div key={row.tenant} className="rounded-[1.35rem] border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
                    <LogoPlaceholder title={row.tenant} status="Missing" />
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{row.tenant}</p>
                        <p className="text-xs text-muted-foreground">{row.units.join(" / ")}</p>
                      </div>
                      <CircleHelp className="mt-0.5 h-4.5 w-4.5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminTenantAssets;