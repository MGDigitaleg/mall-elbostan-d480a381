import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save, RotateCcw, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  OUTER_SHELL,
  CORRIDOR_BOUNDARY,
  ATRIUM_OCTAGON,
} from "@/lib/mallFloorGeometry";

const STATUS_OPTIONS = [
  { value: "occupied", label: "مشغولة" },
  { value: "available", label: "متاحة" },
  { value: "coming_soon", label: "قريباً" },
  { value: "hidden", label: "مخفية" },
];

const CATEGORY_OPTIONS = [
  { value: "Accessories", label: "الإكسسوارات والملحقات" },
  { value: "Laptops", label: "أجهزة الكمبيوتر" },
  { value: "Components", label: "المكوّنات والتجميع" },
  { value: "Networking", label: "الشبكات والطباعة" },
  { value: "Maintenance", label: "الصيانة والدعم" },
  { value: "Security Systems", label: "الأنظمة الأمنية" },
];

const STATUS_FILL: Record<string, string> = {
  occupied: "#E2DDD5",
  available: "#FDE4C4",
  coming_soon: "#C8E8F4",
  hidden: "#EEE9E1",
};
const STATUS_STROKE: Record<string, string> = {
  occupied: "#9B9488",
  available: "#E8740E",
  coming_soon: "#0A9AB8",
  hidden: "#C7BFB2",
};

type EditUnit = {
  id: string; // real uuid or temp id
  isNew: boolean;
  floor_id: string;
  unit_code: string;
  status: string;
  area_sqm: number;
  polygon: string;
  label_x: number;
  label_y: number;
  category: string;
  store_id: string | null;
  is_featured: boolean;
  visibility: boolean;
  name_ar: string;
  description_ar: string;
  sort_order: number;
};

type FloorRow = { id: string; name_ar: string | null; sort_order: number | null };
type StoreRow = {
  id: string;
  name_ar: string | null;
  name_en: string | null;
  logo_url: string | null;
};

const parsePolygon = (poly: string): Array<[number, number]> =>
  poly
    .trim()
    .split(/\s+/)
    .map((p) => p.split(",").map(Number) as [number, number])
    .filter((p) => p.length === 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]));

const stringifyPolygon = (pts: Array<[number, number]>) =>
  pts.map(([x, y]) => `${Math.round(x)},${Math.round(y)}`).join(" ");

const centroid = (pts: Array<[number, number]>): [number, number] => {
  if (!pts.length) return [500, 500];
  const sx = pts.reduce((a, p) => a + p[0], 0);
  const sy = pts.reduce((a, p) => a + p[1], 0);
  return [sx / pts.length, sy / pts.length];
};

export default function AdminMapEditor() {
  const auth = useRequireAdmin();
  const queryClient = useQueryClient();
  const svgRef = useRef<SVGSVGElement>(null);

  const { data: floors } = useQuery({
    queryKey: ["admin-map-floors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("floors")
        .select("id, name_ar, sort_order")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as FloorRow[];
    },
  });

  const { data: stores } = useQuery({
    queryKey: ["admin-map-stores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("id, name_ar, name_en, logo_url")
        .order("name_ar");
      if (error) throw error;
      return (data ?? []) as StoreRow[];
    },
  });

  const { data: dbUnits, isLoading } = useQuery({
    queryKey: ["admin-map-units"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("units")
        .select(
          "id, floor_id, unit_code, status, area_sqm, polygon, label_x, label_y, category, store_id, is_featured, visibility, name_ar, description_ar, sort_order",
        );
      if (error) throw error;
      return data ?? [];
    },
  });

  const [selectedFloorId, setSelectedFloorId] = useState<string>("");
  const [units, setUnits] = useState<EditUnit[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Drag state
  const dragRef = useRef<
    | { type: "move"; id: string; start: [number, number]; orig: Array<[number, number]>; origLabel: [number, number] }
    | { type: "vertex"; id: string; index: number }
    | { type: "label"; id: string }
    | null
  >(null);

  // Initialize floor selection
  useEffect(() => {
    if (floors && floors.length && !selectedFloorId) {
      setSelectedFloorId(floors[0].id);
    }
  }, [floors, selectedFloorId]);

  // Load units into editable state
  useEffect(() => {
    if (!dbUnits) return;
    setUnits(
      dbUnits.map((u: Record<string, unknown>) => ({
        id: u.id as string,
        isNew: false,
        floor_id: u.floor_id as string,
        unit_code: (u.unit_code as string) ?? "",
        status: (u.status as string) ?? "available",
        area_sqm: (u.area_sqm as number) ?? 0,
        polygon: (u.polygon as string) ?? "",
        label_x: (u.label_x as number) ?? 500,
        label_y: (u.label_y as number) ?? 500,
        category: (u.category as string) ?? "Accessories",
        store_id: (u.store_id as string) ?? null,
        is_featured: Boolean(u.is_featured),
        visibility: u.visibility !== false,
        name_ar: (u.name_ar as string) ?? "",
        description_ar: (u.description_ar as string) ?? "",
        sort_order: (u.sort_order as number) ?? 0,
      })),
    );
    setDeletedIds([]);
    setDirty(false);
  }, [dbUnits]);

  const floorUnits = useMemo(
    () => units.filter((u) => u.floor_id === selectedFloorId),
    [units, selectedFloorId],
  );

  const selectedUnit = useMemo(
    () => units.find((u) => u.id === selectedId) ?? null,
    [units, selectedId],
  );

  const currentTenant = useMemo(
    () =>
      selectedUnit?.store_id
        ? (stores ?? []).find((s) => s.id === selectedUnit.store_id) ?? null
        : null,
    [selectedUnit, stores],
  );

  const toSvgPoint = useCallback((clientX: number, clientY: number): [number, number] => {
    const svg = svgRef.current;
    if (!svg) return [0, 0];
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return [0, 0];
    const local = pt.matrixTransform(ctm.inverse());
    return [local.x, local.y];
  }, []);

  const patchUnit = useCallback((id: string, patch: Partial<EditUnit>) => {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
    setDirty(true);
  }, []);

  // Pointer handlers
  const onUnitPointerDown = useCallback(
    (e: React.PointerEvent, unit: EditUnit) => {
      e.stopPropagation();
      setSelectedId(unit.id);
      (e.target as Element).setPointerCapture?.(e.pointerId);
      const start = toSvgPoint(e.clientX, e.clientY);
      dragRef.current = {
        type: "move",
        id: unit.id,
        start,
        orig: parsePolygon(unit.polygon),
        origLabel: [unit.label_x, unit.label_y],
      };
    },
    [toSvgPoint],
  );

  const onVertexPointerDown = useCallback(
    (e: React.PointerEvent, unit: EditUnit, index: number) => {
      e.stopPropagation();
      setSelectedId(unit.id);
      (e.target as Element).setPointerCapture?.(e.pointerId);
      dragRef.current = { type: "vertex", id: unit.id, index };
    },
    [],
  );

  const onLabelPointerDown = useCallback((e: React.PointerEvent, unit: EditUnit) => {
    e.stopPropagation();
    setSelectedId(unit.id);
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = { type: "label", id: unit.id };
  }, []);

  const onSvgPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const [x, y] = toSvgPoint(e.clientX, e.clientY);

      if (drag.type === "move") {
        const dx = x - drag.start[0];
        const dy = y - drag.start[1];
        const moved = drag.orig.map(([px, py]) => [px + dx, py + dy] as [number, number]);
        patchUnit(drag.id, {
          polygon: stringifyPolygon(moved),
          label_x: drag.origLabel[0] + dx,
          label_y: drag.origLabel[1] + dy,
        });
      } else if (drag.type === "vertex") {
        setUnits((prev) =>
          prev.map((u) => {
            if (u.id !== drag.id) return u;
            const pts = parsePolygon(u.polygon);
            pts[drag.index] = [x, y];
            return { ...u, polygon: stringifyPolygon(pts) };
          }),
        );
        setDirty(true);
      } else if (drag.type === "label") {
        patchUnit(drag.id, { label_x: x, label_y: y });
      }
    },
    [toSvgPoint, patchUnit],
  );

  const onSvgPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const addUnit = useCallback(() => {
    if (!selectedFloorId) return;
    const tempId = `new-${Date.now()}`;
    const maxSort = units.reduce((m, u) => Math.max(m, u.sort_order), 0);
    const newUnit: EditUnit = {
      id: tempId,
      isNew: true,
      floor_id: selectedFloorId,
      unit_code: `NEW-${maxSort + 1}`,
      status: "available",
      area_sqm: 25,
      polygon: "440,440 560,440 560,560 440,560",
      label_x: 500,
      label_y: 500,
      category: "Accessories",
      store_id: null,
      is_featured: false,
      visibility: true,
      name_ar: "",
      description_ar: "",
      sort_order: maxSort + 1,
    };
    setUnits((prev) => [...prev, newUnit]);
    setSelectedId(tempId);
    setDirty(true);
  }, [selectedFloorId, units]);

  const deleteSelected = useCallback(() => {
    if (!selectedUnit) return;
    if (!selectedUnit.isNew) {
      setDeletedIds((prev) => [...prev, selectedUnit.id]);
    }
    setUnits((prev) => prev.filter((u) => u.id !== selectedUnit.id));
    setSelectedId(null);
    setDirty(true);
  }, [selectedUnit]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      // Deletes
      if (deletedIds.length) {
        const { error } = await supabase.from("units").delete().in("id", deletedIds);
        if (error) throw error;
      }
      // Upserts
      for (const u of units) {
        const payload = {
          floor_id: u.floor_id,
          unit_code: u.unit_code,
          status: u.status,
          area_sqm: u.area_sqm,
          polygon: u.polygon,
          label_x: u.label_x,
          label_y: u.label_y,
          category: u.category,
          store_id: u.store_id,
          is_featured: u.is_featured,
          visibility: u.visibility,
          name_ar: u.name_ar || null,
          description_ar: u.description_ar || null,
          sort_order: u.sort_order,
        };
        if (u.isNew) {
          const { error } = await supabase.from("units").insert(payload);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("units").update(payload).eq("id", u.id);
          if (error) throw error;
        }
      }
      toast.success("تم حفظ الخريطة بنجاح");
      await queryClient.invalidateQueries({ queryKey: ["admin-map-units"] });
      await queryClient.invalidateQueries({ queryKey: ["map-data"] });
      setDirty(false);
    } catch (err) {
      toast.error("تعذّر الحفظ", { description: (err as Error).message });
    } finally {
      setSaving(false);
    }
  }, [units, deletedIds, queryClient]);

  const handleDiscard = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["admin-map-units"] });
    setSelectedId(null);
  }, [queryClient]);

  if (!auth.isAdmin) return null;

  return (
    <AdminShell>
      <div className="p-4 md:p-6 space-y-4">
        <AdminPageHeader
          title="محرر الخريطة التفاعلية"
          subtitle="أضف الوحدات وحرّك حدودها وحدّد حالتها والمحل المرتبط بها."
        />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedFloorId} onValueChange={setSelectedFloorId}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="اختر الدور" />
            </SelectTrigger>
            <SelectContent>
              {(floors ?? []).map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name_ar ?? "دور"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={addUnit}>
            <Plus className="w-4 h-4 me-1" /> إضافة وحدة
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={deleteSelected}
            disabled={!selectedUnit}
          >
            <Trash2 className="w-4 h-4 me-1" /> حذف المحدد
          </Button>

          <div className="flex-1" />

          <Button variant="ghost" size="sm" onClick={handleDiscard} disabled={!dirty || saving}>
            <RotateCcw className="w-4 h-4 me-1" /> تراجع
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!dirty || saving}>
            {saving ? <Loader2 className="w-4 h-4 me-1 animate-spin" /> : <Save className="w-4 h-4 me-1" />}
            حفظ
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          {/* Canvas */}
          <div className="rounded-lg border border-border bg-card p-2">
            {isLoading ? (
              <div className="grid h-[60vh] place-items-center text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <svg
                ref={svgRef}
                viewBox="-20 -20 1040 1040"
                className="block w-full h-auto touch-none select-none"
                onPointerDown={() => setSelectedId(null)}
                onPointerMove={onSvgPointerMove}
                onPointerUp={onSvgPointerUp}
                onPointerLeave={onSvgPointerUp}
              >
                <polygon points={OUTER_SHELL} fill="#F0EBE3" stroke="#7A7468" strokeWidth={2.5} />
                <polygon points={CORRIDOR_BOUNDARY} fill="#E4DFD6" stroke="#9B9488" strokeWidth={1.2} />
                <polygon points={ATRIUM_OCTAGON} fill="#DCE8F0" stroke="#9B9488" strokeWidth={1} />

                {floorUnits.map((u) => {
                  const isSel = u.id === selectedId;
                  return (
                    <g key={u.id}>
                      <polygon
                        points={u.polygon}
                        fill={STATUS_FILL[u.status] ?? "#E2DDD5"}
                        stroke={isSel ? "#2563EB" : STATUS_STROKE[u.status] ?? "#9B9488"}
                        strokeWidth={isSel ? 3 : 1.2}
                        style={{ cursor: "move" }}
                        onPointerDown={(e) => onUnitPointerDown(e, u)}
                      />
                      <text
                        x={u.label_x}
                        y={u.label_y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-[12px] font-bold pointer-events-none"
                        fill="#1E1C1A"
                      >
                        {u.unit_code}
                      </text>
                      {isSel && (
                        <>
                          {parsePolygon(u.polygon).map((p, i) => (
                            <circle
                              key={i}
                              cx={p[0]}
                              cy={p[1]}
                              r={8}
                              fill="#2563EB"
                              stroke="#fff"
                              strokeWidth={2}
                              style={{ cursor: "nwse-resize" }}
                              onPointerDown={(e) => onVertexPointerDown(e, u, i)}
                            />
                          ))}
                          <circle
                            cx={u.label_x}
                            cy={u.label_y}
                            r={7}
                            fill="#E8740E"
                            stroke="#fff"
                            strokeWidth={2}
                            style={{ cursor: "grab" }}
                            onPointerDown={(e) => onLabelPointerDown(e, u)}
                          />
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Side panel */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            {!selectedUnit ? (
              <div className="grid h-40 place-items-center text-center text-sm text-muted-foreground">
                <div>
                  <MapPin className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  اختر وحدة من الخريطة لتعديلها
                </div>
              </div>
            ) : (
              <>
                <div>
                  <Label className="text-xs">كود الوحدة</Label>
                  <Input
                    value={selectedUnit.unit_code}
                    onChange={(e) => patchUnit(selectedUnit.id, { unit_code: e.target.value })}
                  />
                </div>

                <div>
                  <Label className="text-xs">الحالة</Label>
                  <Select
                    value={selectedUnit.status}
                    onValueChange={(v) => patchUnit(selectedUnit.id, { status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">الفئة</Label>
                  <Select
                    value={selectedUnit.category}
                    onValueChange={(v) => patchUnit(selectedUnit.id, { category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedUnit.status === "occupied" && (
                  <div className="rounded-md border border-border bg-muted/40 p-3">
                    <Label className="text-xs text-muted-foreground">
                      الجهة المستأجرة حالياً
                    </Label>
                    {currentTenant ? (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background">
                          {currentTenant.logo_url ? (
                            <img
                              src={currentTenant.logo_url}
                              alt={currentTenant.name_ar || currentTenant.name_en || "شعار المحل"}
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <MapPin className="h-5 w-5 opacity-40" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {currentTenant.name_ar || currentTenant.name_en || "محل"}
                          </p>
                          {currentTenant.name_en && currentTenant.name_ar && (
                            <p className="truncate text-xs text-muted-foreground">
                              {currentTenant.name_en}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-amber-600">
                        الوحدة مشغولة لكن لم يتم تحديد الجهة المستأجرة. اختر المحل أدناه.
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <Label className="text-xs">
                    {selectedUnit.status === "occupied"
                      ? "تغيير الجهة المستأجرة"
                      : "المحل المرتبط"}
                  </Label>
                  <Select
                    value={selectedUnit.store_id ?? "none"}
                    onValueChange={(v) =>
                      patchUnit(selectedUnit.id, { store_id: v === "none" ? null : v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="بدون" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">بدون</SelectItem>
                      {(stores ?? []).map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name_ar || s.name_en || "محل"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">المساحة (م²)</Label>
                  <Input
                    type="number"
                    value={selectedUnit.area_sqm}
                    onChange={(e) =>
                      patchUnit(selectedUnit.id, { area_sqm: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <Label className="text-xs">الاسم (عربي)</Label>
                  <Input
                    value={selectedUnit.name_ar}
                    onChange={(e) => patchUnit(selectedUnit.id, { name_ar: e.target.value })}
                  />
                </div>

                <div>
                  <Label className="text-xs">الوصف</Label>
                  <Textarea
                    rows={3}
                    value={selectedUnit.description_ar}
                    onChange={(e) =>
                      patchUnit(selectedUnit.id, { description_ar: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs">مميزة</Label>
                  <Switch
                    checked={selectedUnit.is_featured}
                    onCheckedChange={(v) => patchUnit(selectedUnit.id, { is_featured: v })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs">ظاهرة على الخريطة</Label>
                  <Switch
                    checked={selectedUnit.visibility}
                    onCheckedChange={(v) => patchUnit(selectedUnit.id, { visibility: v })}
                  />
                </div>

                <p className="text-[0.65rem] text-muted-foreground pt-1">
                  اسحب جسم الوحدة لتحريكها، النقاط الزرقاء لتغيير الشكل، والنقطة البرتقالية لمكان الاسم.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
