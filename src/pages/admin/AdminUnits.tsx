import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, MapPin, Building2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { TenantLogo } from "@/components/TenantLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_META: Record<string, { label: string; chip: string }> = {
  occupied: { label: "مشغولة", chip: "bg-stone-200 text-stone-700 border-stone-300" },
  available: { label: "متاحة", chip: "bg-amber-100 text-amber-800 border-amber-300" },
  coming_soon: { label: "قريباً", chip: "bg-sky-100 text-sky-800 border-sky-300" },
  hidden: { label: "مخفية", chip: "bg-muted text-muted-foreground border-border" },
};

const STATUS_ORDER = ["occupied", "available", "coming_soon", "hidden"];
const NONE = "__none__";

type UnitRow = {
  id: string;
  unit_code: string | null;
  status: string | null;
  store_id: string | null;
  floor_id: string | null;
  area_sqm: number | null;
};
type StoreRow = {
  id: string;
  name_ar: string | null;
  name_en: string | null;
  logo_url: string | null;
};
type FloorRow = { id: string; name_ar: string | null; sort_order: number | null };

export default function AdminUnits() {
  const auth = useRequireAdmin();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { status: string; store_id: string | null }>>({});

  const { data: units, isLoading } = useQuery({
    queryKey: ["admin-units-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("units")
        .select("id, unit_code, status, store_id, floor_id, area_sqm")
        .order("unit_code");
      if (error) throw error;
      return (data ?? []) as UnitRow[];
    },
  });

  const { data: stores } = useQuery({
    queryKey: ["admin-units-stores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("id, name_ar, name_en, logo_url")
        .order("name_ar");
      if (error) throw error;
      return (data ?? []) as StoreRow[];
    },
  });

  const { data: floors } = useQuery({
    queryKey: ["admin-units-floors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("floors")
        .select("id, name_ar, sort_order")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as FloorRow[];
    },
  });

  const storeById = useMemo(() => {
    const m = new Map<string, StoreRow>();
    (stores ?? []).forEach((s) => m.set(s.id, s));
    return m;
  }, [stores]);

  const floorById = useMemo(() => {
    const m = new Map<string, FloorRow>();
    (floors ?? []).forEach((f) => m.set(f.id, f));
    return m;
  }, [floors]);

  const draftFor = useCallback(
    (u: UnitRow) =>
      drafts[u.id] ?? { status: u.status ?? "available", store_id: u.store_id ?? null },
    [drafts],
  );

  const setDraft = useCallback(
    (u: UnitRow, patch: Partial<{ status: string; store_id: string | null }>) => {
      setDrafts((prev) => {
        const base = prev[u.id] ?? { status: u.status ?? "available", store_id: u.store_id ?? null };
        return { ...prev, [u.id]: { ...base, ...patch } };
      });
    },
    [],
  );

  const isDirty = useCallback(
    (u: UnitRow) => {
      const d = drafts[u.id];
      if (!d) return false;
      return d.status !== (u.status ?? "available") || (d.store_id ?? null) !== (u.store_id ?? null);
    },
    [drafts],
  );

  const saveUnit = useCallback(
    async (u: UnitRow) => {
      const d = draftFor(u);
      // If no tenant is assigned, never keep it "occupied".
      const status = d.store_id ? "occupied" : d.status === "occupied" ? "available" : d.status;
      setSavingId(u.id);
      try {
        const { error } = await supabase
          .from("units")
          .update({ store_id: d.store_id, status })
          .eq("id", u.id);
        if (error) throw error;
        toast.success(`تم حفظ الوحدة ${u.unit_code ?? ""}`);
        setDrafts((prev) => {
          const next = { ...prev };
          delete next[u.id];
          return next;
        });
        await queryClient.invalidateQueries({ queryKey: ["admin-units-list"] });
        await queryClient.invalidateQueries({ queryKey: ["map-data"] });
      } catch (err) {
        toast.error("تعذّر الحفظ", { description: (err as Error).message });
      } finally {
        setSavingId(null);
      }
    },
    [draftFor, queryClient],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (units ?? []).filter((u) => {
      if (!q) return true;
      const store = u.store_id ? storeById.get(u.store_id) : null;
      return (
        (u.unit_code ?? "").toLowerCase().includes(q) ||
        (store?.name_ar ?? "").toLowerCase().includes(q) ||
        (store?.name_en ?? "").toLowerCase().includes(q)
      );
    });
  }, [units, search, storeById]);

  const grouped = useMemo(() => {
    const groups: Record<string, UnitRow[]> = {};
    filtered.forEach((u) => {
      const key = u.status && STATUS_META[u.status] ? u.status : "available";
      (groups[key] ??= []).push(u);
    });
    return groups;
  }, [filtered]);

  if (!auth.isAdmin) return null;

  return (
    <AdminShell>
      <div className="p-4 md:p-6 space-y-5">
        <AdminPageHeader
          title="الوحدات والمحلات"
          subtitle="كل وحدة مرتبطة بمساحتها على الخريطة. عدّل الحالة، أزل المستأجر الحالي أو عيّن محلاً جديداً."
        />

        <div className="relative max-w-sm">
          <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برمز الوحدة أو اسم المحل…"
            className="pe-9"
          />
        </div>

        {isLoading ? (
          <div className="grid h-[50vh] place-items-center text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {STATUS_ORDER.filter((s) => grouped[s]?.length).map((statusKey) => {
              const meta = STATUS_META[statusKey];
              const list = grouped[statusKey];
              return (
                <section key={statusKey} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold">{meta.label}</h2>
                    <Badge variant="outline" className={meta.chip}>
                      {list.length}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {list.map((u) => {
                      const d = draftFor(u);
                      const tenant = d.store_id ? storeById.get(d.store_id) : null;
                      const floor = u.floor_id ? floorById.get(u.floor_id) : null;
                      const dirty = isDirty(u);
                      return (
                        <div
                          key={u.id}
                          className="rounded-lg border border-border bg-card p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-bold">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              {u.unit_code ?? "—"}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {floor?.name_ar ?? ""}
                              {u.area_sqm ? ` · ${u.area_sqm} م²` : ""}
                            </span>
                          </div>

                          {/* Current tenant */}
                          <div className="flex items-center gap-3 rounded-md bg-muted/40 p-2">
                            {tenant ? (
                              <>
                                <TenantLogo
                                  src={tenant.logo_url}
                                  alt={tenant.name_ar ?? ""}
                                  fallbackName={tenant.name_ar ?? tenant.name_en ?? undefined}
                                  size="sm"
                                />
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold truncate">
                                    {tenant.name_ar ?? tenant.name_en}
                                  </div>
                                  <div className="text-xs text-muted-foreground">المستأجر الحالي</div>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="w-4 h-4" />
                                لا يوجد مستأجر — وحدة متاحة
                              </div>
                            )}
                          </div>

                          {/* Assign / change tenant */}
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                              المحل المستأجر
                            </label>
                            <div className="flex items-center gap-2">
                              <Select
                                value={d.store_id ?? NONE}
                                onValueChange={(v) =>
                                  setDraft(u, { store_id: v === NONE ? null : v })
                                }
                              >
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="اختر محلاً" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={NONE}>بدون مستأجر (متاحة)</SelectItem>
                                  {(stores ?? []).map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                      {s.name_ar ?? s.name_en}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {d.store_id && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  title="إزالة المستأجر"
                                  onClick={() => setDraft(u, { store_id: null })}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Status */}
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                              الحالة
                            </label>
                            <Select
                              value={d.status}
                              onValueChange={(v) => setDraft(u, { status: v })}
                              disabled={!!d.store_id}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_ORDER.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {STATUS_META[s].label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {d.store_id && (
                              <p className="text-[11px] text-muted-foreground">
                                الوحدة مشغولة تلقائياً عند وجود مستأجر.
                              </p>
                            )}
                          </div>

                          <Button
                            size="sm"
                            className="w-full"
                            disabled={!dirty || savingId === u.id}
                            onClick={() => saveUnit(u)}
                          >
                            {savingId === u.id ? (
                              <Loader2 className="w-4 h-4 me-1 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4 me-1" />
                            )}
                            حفظ
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
