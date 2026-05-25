// External commerce connector registry — Phase 2.
// Each connector describes how a tenant store can be linked to an external
// commerce source. The registry is intentionally data-driven so new platforms
// plug in without UI changes.

import type { LucideIcon } from "lucide-react";
import { Store, Globe, ShoppingBag, FileText, Layers, Link2 } from "lucide-react";

export type ConnectorId =
  | "none"
  | "manual"
  | "website"
  | "shopify"
  | "woocommerce"
  | "other";

export type SyncMode = "manual" | "scheduled" | "webhook";

export type ConnectionStatus =
  | "not_connected"
  | "manual_catalog"
  | "connected"
  | "sync_ready"
  | "sync_issue"
  | "disabled";

export interface ConnectorDefinition {
  id: ConnectorId;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
  // operational capabilities
  supportsLiveSync: boolean;
  supportsWebhooks: boolean;
  importsProducts: boolean;
  importsOffers: boolean;
  // form hints (Arabic placeholders)
  urlPlaceholder?: string;
  handlePlaceholder?: string;
  handleLabel?: string;
  requiresUrl?: boolean;
  requiresHandle?: boolean;
  // future readiness note shown in the UI
  futureNote?: string;
}

export const CONNECTORS: ConnectorDefinition[] = [
  {
    id: "none",
    label: "بدون متجر خارجي",
    short: "غير مرتبط",
    description: "لم يتم ربط هذا المحل بأي مصدر خارجي بعد.",
    icon: Link2,
    supportsLiveSync: false,
    supportsWebhooks: false,
    importsProducts: false,
    importsOffers: false,
  },
  {
    id: "manual",
    label: "كتالوج يدوي",
    short: "إدارة يدوية",
    description: "يدير الفريق المنتجات والعروض يدوياً من لوحة التحكم.",
    icon: FileText,
    supportsLiveSync: false,
    supportsWebhooks: false,
    importsProducts: false,
    importsOffers: false,
  },
  {
    id: "website",
    label: "موقع خارجي للعرض فقط",
    short: "موقع خارجي",
    description: "يتم تحويل الزائر إلى موقع التاجر بدون مزامنة منتجات.",
    icon: Globe,
    supportsLiveSync: false,
    supportsWebhooks: false,
    importsProducts: false,
    importsOffers: false,
    urlPlaceholder: "https://example.com",
    requiresUrl: true,
  },
  {
    id: "shopify",
    label: "Shopify",
    short: "Shopify",
    description: "متجر Shopify رسمي — جاهز للمزامنة عند تفعيل الموصِّل.",
    icon: ShoppingBag,
    supportsLiveSync: true,
    supportsWebhooks: true,
    importsProducts: true,
    importsOffers: true,
    urlPlaceholder: "https://my-store.com",
    handlePlaceholder: "my-store.myshopify.com",
    handleLabel: "نطاق Shopify",
    requiresHandle: true,
    futureNote: "سيتم تفعيل المزامنة التلقائية للمنتجات والعروض عند ربط موصِّل Shopify.",
  },
  {
    id: "woocommerce",
    label: "WooCommerce",
    short: "WooCommerce",
    description: "متجر WordPress / WooCommerce — جاهز للمزامنة عبر REST API.",
    icon: ShoppingBag,
    supportsLiveSync: true,
    supportsWebhooks: true,
    importsProducts: true,
    importsOffers: true,
    urlPlaceholder: "https://my-store.com",
    handlePlaceholder: "store-handle",
    handleLabel: "معرّف المتجر",
    requiresUrl: true,
    futureNote: "سيتم تفعيل المزامنة عبر REST API لاحقاً.",
  },
  {
    id: "other",
    label: "موصِّل مخصّص",
    short: "مخصّص",
    description: "نظام آخر سيُدعم لاحقاً عبر موصِّل مخصّص.",
    icon: Layers,
    supportsLiveSync: false,
    supportsWebhooks: false,
    importsProducts: false,
    importsOffers: false,
    futureNote: "هذا الموصِّل قيد التحضير — تُحفظ البيانات الآن وتُربط لاحقاً.",
  },
];

const REGISTRY: Record<ConnectorId, ConnectorDefinition> = CONNECTORS.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<ConnectorId, ConnectorDefinition>,
);

export function getConnector(type: string | null | undefined): ConnectorDefinition {
  if (!type) return REGISTRY.none;
  return REGISTRY[type as ConnectorId] ?? REGISTRY.other;
}

export const SYNC_MODES: { value: SyncMode; label: string; hint: string }[] = [
  { value: "manual", label: "يدوي", hint: "تشغيل المزامنة من لوحة التحكم فقط." },
  { value: "scheduled", label: "دوري", hint: "تشغيل المزامنة على فترات (جاهز للتفعيل لاحقاً)." },
  { value: "webhook", label: "Webhook", hint: "تحديث فوري عند وصول إشعار من المزود (جاهز للتفعيل لاحقاً)." },
];

export interface ConnectionInput {
  external_store_type?: string | null;
  external_store_url?: string | null;
  external_store_handle?: string | null;
  connector_enabled?: boolean | null;
  sync_status?: string | null;
  last_sync_at?: string | null;
}

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

export interface ResolvedStatus {
  status: ConnectionStatus;
  label: string;
  tone: StatusTone;
  hint: string;
}

const STATUS_META: Record<ConnectionStatus, { label: string; tone: StatusTone; hint: string }> = {
  not_connected: { label: "غير مرتبط", tone: "neutral", hint: "لم يُحدَّد مصدر خارجي بعد." },
  manual_catalog: { label: "كتالوج يدوي", tone: "info", hint: "يدار المحتوى يدوياً من لوحة التحكم." },
  connected: { label: "مرتبط", tone: "info", hint: "تم تسجيل بيانات الاتصال — لم تتم مزامنة بعد." },
  sync_ready: { label: "جاهز للمزامنة", tone: "success", hint: "الاتصال مكتمل والموصِّل مفعَّل." },
  sync_issue: { label: "مشكلة في المزامنة", tone: "danger", hint: "آخر محاولة مزامنة فشلت أو غير مكتملة." },
  disabled: { label: "موقوف", tone: "warning", hint: "تم تعطيل الموصِّل يدوياً." },
};

export function resolveConnectionStatus(input: ConnectionInput): ResolvedStatus {
  const def = getConnector(input.external_store_type);
  let status: ConnectionStatus;

  if (def.id === "none") status = "not_connected";
  else if (def.id === "manual") status = "manual_catalog";
  else if (input.sync_status === "error") status = "sync_issue";
  else if (input.connector_enabled === false && def.supportsLiveSync) status = "disabled";
  else if (def.supportsLiveSync && input.connector_enabled) status = "sync_ready";
  else status = "connected";

  const meta = STATUS_META[status];
  return { status, ...meta };
}

export function validateConnection(input: ConnectionInput): string[] {
  const warnings: string[] = [];
  const def = getConnector(input.external_store_type);
  if (def.requiresUrl && !input.external_store_url?.trim()) {
    warnings.push("الرابط مطلوب لهذا الموصِّل.");
  }
  if (def.requiresHandle && !input.external_store_handle?.trim()) {
    warnings.push(`${def.handleLabel ?? "المعرّف"} مطلوب لهذا الموصِّل.`);
  }
  if (def.supportsLiveSync && !input.connector_enabled) {
    warnings.push("الموصِّل غير مفعَّل — لن تبدأ المزامنة حتى يتم التفعيل.");
  }
  return warnings;
}
