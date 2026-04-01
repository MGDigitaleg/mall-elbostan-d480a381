import { logoMatchingMatrixRows, missingLogoRows, tenantMasterRows, type LogoStatus } from "@/lib/tenantAssetData";

export type AssetReviewStage = "raw" | "review" | "final";

export type TenantLogoAssetRecord = {
  id: string;
  brand_key: string;
  tenant_provided_name: string;
  normalized_display_name: string;
  units: string[];
  asset_type: string | null;
  source_file_name: string | null;
  source_file_path: string | null;
  raw_file_path: string | null;
  review_file_path: string | null;
  final_file_path: string | null;
  review_status: LogoStatus;
  reviewer_notes: string | null;
  final_export_name: string | null;
  final_export_path: string | null;
  background_removal_needed: boolean;
  crop_needed: boolean;
  transparent_export_ready: boolean;
  square_artboard_ready: boolean;
  safe_margin_applied: boolean;
  approved_for_final_export: boolean;
  requested_source_type: string | null;
  last_follow_up_note: string | null;
  execution_note: string | null;
  created_at: string;
  updated_at: string;
};

export const reviewStatusOptions: LogoStatus[] = [
  "Confirmed",
  "Needs Cleanup",
  "Needs Better Source",
  "Missing",
  "Pending Confirmation",
];

export const assetTypeOptions = [
  "Vector Logo",
  "Transparent PNG",
  "JPEG Source",
  "PDF Reference",
  "Banner Extract",
  "Storefront Photo",
  "Placeholder Only",
];

export const reviewStageLabels: Record<AssetReviewStage, string> = {
  raw: "Raw Source",
  review: "Review Version",
  final: "Final Version",
};

export const cleanupChecklist = [
  { key: "background_removal_needed", label: "Background removal needed" },
  { key: "crop_needed", label: "Crop needed" },
  { key: "transparent_export_ready", label: "Transparent export ready" },
  { key: "square_artboard_ready", label: "Square artboard ready" },
  { key: "safe_margin_applied", label: "Safe margin applied" },
] as const;

const missingReasonEntries = missingLogoRows.map((row) => [row.tenant, row.missingReason] as const);
export const missingReasonByTenant = new Map<string, string>(missingReasonEntries);

export function getUnitExportReferences(units: string[]) {
  const exportMap = new Map(tenantMasterRows.map((row) => [row.unit, row.exportPath]));

  return units.map((unit) => ({
    unit,
    exportPath: exportMap.get(unit) ?? `/logos/final/${unit}_Logo.png`,
  }));
}

export function getMatchedAssetLabel(normalizedDisplayName: string) {
  const row = logoMatchingMatrixRows.find((entry) => entry.normalizedDisplayName === normalizedDisplayName);
  return row?.matchedAsset ?? null;
}

export function normalizeStoragePath(path: string) {
  return path.replace(/^\/+/, "").replace(/^logos\//, "");
}

export function getAssetStoragePath(brandKey: string, stage: AssetReviewStage, file: File) {
  const extension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() ?? "png" : "png";
  const fileName = stage === "raw" ? `source.${extension}` : stage === "review" ? `review.${extension}` : `final.${extension}`;

  return `${stage}/${brandKey}/${fileName}`;
}

export function inferAssetType(file: File) {
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (mime.includes("pdf") || name.endsWith(".pdf")) return "PDF Reference";
  if (mime.includes("svg") || name.endsWith(".svg") || mime.includes("eps") || name.endsWith(".ai")) return "Vector Logo";
  if (mime.includes("png") || name.endsWith(".png")) return "Transparent PNG";
  if (mime.includes("jpeg") || mime.includes("jpg") || name.endsWith(".jpg") || name.endsWith(".jpeg")) return "JPEG Source";
  if (mime.startsWith("image/")) return "Storefront Photo";
  return "Placeholder Only";
}

export function isImageAsset(path?: string | null) {
  if (!path) return false;
  return /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(path);
}