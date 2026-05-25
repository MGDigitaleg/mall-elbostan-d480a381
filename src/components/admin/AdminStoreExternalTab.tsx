import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AdminSectionCard, AdminStatusBadge } from "@/components/admin/AdminPrimitives";
import { AlertTriangle, ExternalLink, Info, Link2, RefreshCw } from "lucide-react";
import {
  CONNECTORS,
  SYNC_MODES,
  getConnector,
  resolveConnectionStatus,
  validateConnection,
  type SyncMode,
} from "@/lib/externalConnectors";

interface Props {
  store: any;
  onPatch: (patch: Record<string, any>) => void;
  onReload: () => void;
}

export default function AdminStoreExternalTab({ store, onPatch, onReload }: Props) {
  const def = getConnector(store.external_store_type);
  const status = useMemo(() => resolveConnectionStatus(store), [store]);
  const warnings = useMemo(() => validateConnection(store), [store]);
  const Icon = def.icon;

  const persist = async (patch: Record<string, any>, msg?: string) => {
    onPatch(patch);
    const { error } = await supabase.from("stores").update(patch as any).eq("id", store.id);
    if (error) {
      toast({ title: "تعذّر الحفظ", description: error.message, variant: "destructive" });
      return;
    }
    if (msg) toast({ title: msg });
    onReload();
  };

  const markSyncAttempt = async () => {
    const now = new Date().toISOString();
    await persist({
      last_sync_at: now,
      sync_status: "success",
      last_sync_result: "تم تسجيل محاولة مزامنة يدوية — المزامنة الفعلية تُفعَّل لاحقاً.",
      last_sync_error: null,
    }, "تم تسجيل محاولة المزامنة");
  };

  const disableConnector = async () => {
    await persist({ connector_enabled: false, sync_status: "idle" }, "تم إيقاف الموصِّل");
  };

  const showSyncFields = def.supportsLiveSync;
  const showLinkFields = def.id !== "none" && def.id !== "manual";

  return (
    <div className="space-y-4">
      {/* Connection summary */}
      <AdminSectionCard title="ملخّص الاتصال">
        <div className="flex flex-wrap items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary border border-border grid place-items-center shrink-0">
            <Icon className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-base font-bold text-foreground">{def.label}</span>
              <AdminStatusBadge tone={status.tone}>{status.label}</AdminStatusBadge>
              {def.supportsLiveSync && (
                <AdminStatusBadge tone={store.connector_enabled ? "success" : "neutral"}>
                  {store.connector_enabled ? "موصِّل مفعَّل" : "موصِّل موقوف"}
                </AdminStatusBadge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{def.description}</p>
            <p className="text-xs text-muted-foreground mt-1">{status.hint}</p>
          </div>
          {store.external_store_url && (
            <a href={store.external_store_url} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="w-4 h-4" /> فتح المتجر
              </Button>
            </a>
          )}
        </div>

        {def.futureNote && (
          <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-3 flex gap-2 text-xs text-muted-foreground">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{def.futureNote}</span>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="mt-4 rounded-lg border border-amber-300/60 bg-amber-50 dark:bg-amber-950/30 p-3 space-y-1">
            {warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}
      </AdminSectionCard>

      {/* Connection form */}
      <AdminSectionCard title="إعداد الاتصال">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label className="text-xs font-bold text-muted-foreground mb-1.5 block">نوع الموصِّل</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CONNECTORS.map((c) => {
                const active = (store.external_store_type ?? "none") === c.id;
                const CIcon = c.icon;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onPatch({ external_store_type: c.id })}
                    className={`rounded-lg border p-3 text-right transition ${
                      active
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-bold text-foreground">{c.short}</span>
                    </div>
                    <p className="text-[0.7rem] leading-snug text-muted-foreground line-clamp-2">
                      {c.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {showLinkFields && (
            <>
              <div>
                <Label className="text-xs font-bold text-muted-foreground mb-1.5 block">
                  رابط المتجر {def.requiresUrl && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  value={store.external_store_url ?? ""}
                  onChange={(e) => onPatch({ external_store_url: e.target.value })}
                  placeholder={def.urlPlaceholder ?? "https://..."}
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-muted-foreground mb-1.5 block">
                  {def.handleLabel ?? "المعرّف / Handle"}{" "}
                  {def.requiresHandle && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  value={store.external_store_handle ?? ""}
                  onChange={(e) => onPatch({ external_store_handle: e.target.value })}
                  placeholder={def.handlePlaceholder ?? ""}
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-4">
          <Label className="text-xs font-bold text-muted-foreground mb-1.5 block">ملاحظات داخلية</Label>
          <Textarea
            rows={2}
            value={store.sync_notes ?? ""}
            onChange={(e) => onPatch({ sync_notes: e.target.value })}
            placeholder="ملاحظات للفريق حول هذا الاتصال (اختياري)."
          />
        </div>
      </AdminSectionCard>

      {/* Sync controls — only when connector supports live sync */}
      {showSyncFields && (
        <AdminSectionCard title="المزامنة والاستيراد">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-secondary/30 p-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-foreground">تفعيل الموصِّل</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  عند الإيقاف لن تُجرى أي مزامنة حتى لو كانت مجدوَلة.
                </p>
              </div>
              <Switch
                checked={!!store.connector_enabled}
                onCheckedChange={(v) => onPatch({ connector_enabled: v })}
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground mb-1.5 block">وضع المزامنة</Label>
              <select
                value={(store.sync_mode as SyncMode) ?? "manual"}
                onChange={(e) => onPatch({ sync_mode: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {SYNC_MODES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <p className="text-[0.7rem] text-muted-foreground mt-1">
                {SYNC_MODES.find((m) => m.value === store.sync_mode)?.hint}
              </p>
            </div>

            {def.importsProducts && (
              <div className="rounded-lg border border-border bg-secondary/30 p-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-foreground">استيراد المنتجات</div>
                  <p className="text-xs text-muted-foreground mt-0.5">جلب المنتجات من المصدر الخارجي تلقائياً.</p>
                </div>
                <Switch
                  checked={!!store.import_products}
                  onCheckedChange={(v) => onPatch({ import_products: v })}
                />
              </div>
            )}

            {def.importsOffers && (
              <div className="rounded-lg border border-border bg-secondary/30 p-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-foreground">استيراد العروض</div>
                  <p className="text-xs text-muted-foreground mt-0.5">جلب التخفيضات والعروض الترويجية.</p>
                </div>
                <Switch
                  checked={!!store.import_offers}
                  onCheckedChange={(v) => onPatch({ import_offers: v })}
                />
              </div>
            )}
          </div>
        </AdminSectionCard>
      )}

      {/* Sync health */}
      {showSyncFields && (
        <AdminSectionCard title="حالة آخر مزامنة">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <AdminStatusBadge
                  tone={
                    store.sync_status === "error"
                      ? "danger"
                      : store.sync_status === "success"
                      ? "success"
                      : "neutral"
                  }
                >
                  {store.sync_status ?? "idle"}
                </AdminStatusBadge>
                <span className="text-xs text-muted-foreground">
                  {store.last_sync_at
                    ? `آخر مزامنة: ${new Date(store.last_sync_at).toLocaleString("ar-EG")}`
                    : "لم تتم أي مزامنة بعد."}
                </span>
              </div>
              {store.last_sync_result && (
                <p className="text-xs text-muted-foreground mt-1">{store.last_sync_result}</p>
              )}
              {store.last_sync_error && (
                <p className="text-xs text-red-600 mt-1 flex items-start gap-1">
                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                  {store.last_sync_error}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {store.connector_enabled && (
                <Button variant="outline" size="sm" onClick={disableConnector}>
                  إيقاف الموصِّل
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-1" onClick={markSyncAttempt}>
                <RefreshCw className="w-4 h-4" /> تسجيل محاولة مزامنة
              </Button>
            </div>
          </div>
          <p className="text-[0.7rem] text-muted-foreground mt-3 flex items-start gap-1">
            <Info className="w-3 h-3 mt-0.5 shrink-0" />
            المزامنة التلقائية الكاملة (Shopify / WooCommerce) ستُفعَّل في مرحلة لاحقة بمجرد ربط Edge Function الخاص بالموصِّل.
            البنية الحالية جاهزة لاستقبال نتائج المزامنة وتسجيلها.
          </p>
        </AdminSectionCard>
      )}

      {def.id === "none" && (
        <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-4 text-center text-sm text-muted-foreground">
          <Link2 className="w-5 h-5 mx-auto mb-2 opacity-60" />
          اختر نوع الموصِّل أعلاه لبدء ربط هذا المحل بمصدر خارجي.
        </div>
      )}
    </div>
  );
}
