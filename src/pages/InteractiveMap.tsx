import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FloorPlanSvg } from "@/components/map/FloorPlanSvg";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  allMapUnits,
  availableMapUnits,
  exploreNeeds,
  floorLabelAr,
  floorMapData,
  needCategoryLabels,
  type FloorId,
  type MapUnitDefinition,
  type UnitStatus,
} from "@/lib/floorMapData";
import { Link } from "react-router-dom";

const InteractiveMap = () => {
  const isMobile = useIsMobile();
  const [selectedFloor, setSelectedFloor] = useState<FloorId>("ground");
  const [statusFilter, setStatusFilter] = useState<"all" | UnitStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [needFilter, setNeedFilter] = useState<"all" | (typeof exploreNeeds)[number]>("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<MapUnitDefinition | null>(null);

  const floor = useMemo(
    () => floorMapData.find((item) => item.id === selectedFloor) ?? floorMapData[0],
    [selectedFloor],
  );

  const filteredUnits = useMemo(() => {
    return floor.units.filter((unit) => {
      const normalized = searchTerm.trim().toLowerCase();
      const matchSearch =
        normalized.length === 0 ||
        unit.store_name_ar.toLowerCase().includes(normalized) ||
        unit.unit_id.toLowerCase().includes(normalized);
      const matchStatus = availableOnly ? unit.status === "available" : statusFilter === "all" || unit.status === statusFilter;
      const matchNeed = needFilter === "all" || unit.category === needFilter;
      return matchSearch && matchStatus && matchNeed;
    });
  }, [availableOnly, floor.units, searchTerm, statusFilter, needFilter]);

  const filteredIds = useMemo(() => new Set(filteredUnits.map((unit) => unit.unit_id)), [filteredUnits]);

  const mutedUnitIds = useMemo(
    () => new Set(floor.units.filter((unit) => !filteredIds.has(unit.unit_id)).map((unit) => unit.unit_id)),
    [filteredIds, floor.units],
  );

  const availableUnits = useMemo(() => filteredUnits.filter((unit) => unit.status === "available"), [filteredUnits]);

  const activeUnit = selectedUnit && selectedUnit.floor_id === selectedFloor ? selectedUnit : null;
  const selectedFloorAvailableUnits = floor.units.filter((unit) => unit.status === "available").length;

  const statusLabels: Record<UnitStatus, string> = {
    occupied: "مشغولة",
    available: "متاحة",
    coming_soon: "قريبًا",
  };

  const statusTone: Record<UnitStatus, string> = {
    occupied: "text-foreground",
    available: "text-orange",
    coming_soon: "text-accent",
  };

  const DetailBody = ({ unit }: { unit: MapUnitDefinition }) => (
    <div className="space-y-4 text-sm text-muted-foreground">
      <div className="rounded-[1.5rem] border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">رقم الوحدة</p>
            <p className="text-lg font-bold text-foreground">{unit.unit_id}</p>
          </div>
          <Badge variant="outline" className={statusTone[unit.status]}>{statusLabels[unit.status]}</Badge>
        </div>
        <p className="mt-2 text-sm">{floorLabelAr[unit.floor_id]}</p>
      </div>
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[1.25rem] border border-border bg-card p-4">
            <p className="text-xs">المساحة</p>
            <p className="mt-1 text-base font-semibold text-foreground">{unit.area_m2} م²</p>
          </div>
          <div className="rounded-[1.25rem] border border-border bg-card p-4">
            <p className="text-xs">الفئة</p>
            <p className="mt-1 text-base font-semibold text-foreground">{needCategoryLabels[unit.category]}</p>
          </div>
        </div>
        {unit.store_name_ar ? (
          <div className="rounded-[1.25rem] border border-border bg-card p-4">
            <p className="text-xs">اسم المتجر</p>
            <p className="mt-1 text-base font-semibold text-foreground">{unit.store_name_ar}</p>
          </div>
        ) : null}
        {unit.logo ? (
          <div className="rounded-[1.25rem] border border-border bg-card p-4">
            <img src={unit.logo} alt={unit.store_name_ar || `شعار ${unit.unit_id}`} className="h-14 w-auto object-contain" loading="lazy" />
          </div>
        ) : null}
        {unit.description_ar ? (
          <div className="rounded-[1.25rem] border border-border bg-card p-4">
            <p className="text-xs">نبذة سريعة</p>
            <p className="mt-2 leading-7">{unit.description_ar}</p>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {unit.status === "available" ? (
            <>
              <Link to="/leasing"><Button variant="orange" size="sm" className="h-11 rounded-[1rem] px-4">استفسر عن الوحدة</Button></Link>
              <Link to="/leasing"><Button variant="outline-blue" size="sm" className="h-11 rounded-[1rem] px-4">اطلب معاينة</Button></Link>
            </>
          ) : unit.status === "occupied" ? (
            <>
              <Link to="/stores"><Button variant="outline-blue" size="sm" className="h-11 rounded-[1rem] px-4">اعرف المتجر</Button></Link>
              {unit.whatsapp ? (
                <a href={`https://wa.me/${unit.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                  <Button variant="secondary" size="sm" className="h-11 rounded-[1rem] px-4">تواصل مع المتجر</Button>
                </a>
              ) : unit.phone ? (
                <a href={`tel:${unit.phone}`}>
                  <Button variant="secondary" size="sm" className="h-11 rounded-[1rem] px-4">تواصل مع المتجر</Button>
                </a>
              ) : (
                <Button variant="secondary" size="sm" className="h-11 rounded-[1rem] px-4" disabled>تواصل مع المتجر</Button>
              )}
            </>
          ) : (
            <Button variant="secondary" size="sm" className="h-11 rounded-[1rem] px-4" disabled>قريبًا</Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <SEOHead title="دليل المول التفاعلي" titleEn="Interactive Directory" description="دليل تفاعلي معماري لمول البستان مع بحث وفلاتر ووحدات متاحة للتأجير." descriptionEn="Architectural interactive directory for Mall Elbostan with search, filters, and leasing units." breadcrumbs={[{ name: "الخريطة", url: "/map" }]} />
      <div className="container py-10 md:py-14 lg:py-[5.5rem]">
        <div className="mb-6 section-shell page-shell grid gap-5 lg:grid-cols-[7fr_5fr] lg:items-center">
          <div className="space-y-4">
            <div className="chapter-shell pt-5">
              <h1 className="section-title">الدليل التفاعلي</h1>
              <p className="mt-3 max-w-[38.75rem] text-base leading-7 text-muted-foreground md:text-lg">ابدأ من الخريطة لتحديد الدور، فهم حالة الوحدة، والانتقال مباشرة إلى خطوة التأجير أو استكشاف المتاجر.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="editorial-panel flex min-h-[5.75rem] flex-col justify-center rounded-[1.25rem] px-4 py-3.5">
                <p className="text-xs font-semibold text-muted-foreground">عدد الأدوار</p>
                <p className="mt-1.5 text-xl font-bold text-foreground">{floorMapData.length}</p>
              </div>
              <div className="editorial-panel flex min-h-[5.75rem] flex-col justify-center rounded-[1.25rem] px-4 py-3.5">
                <p className="text-xs font-semibold text-muted-foreground">الوحدات المعروضة</p>
                <p className="mt-1.5 text-xl font-bold text-foreground">{allMapUnits.length}</p>
              </div>
              <div className="editorial-panel flex min-h-[5.75rem] flex-col justify-center rounded-[1.25rem] px-4 py-3.5">
                <p className="text-xs font-semibold text-muted-foreground">الوحدات المتاحة</p>
                <p className="mt-1.5 text-xl font-bold text-foreground">{availableMapUnits.length}</p>
              </div>
            </div>
          </div>
          <div className="editorial-panel rounded-[1.5rem] p-5 md:p-6">
            <h2 className="text-2xl font-bold text-foreground">ابدأ من الخريطة</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">فلترة حسب الحالة أو الفئة، ثم اختر الوحدة لتظهر بياناتها وإجراءاتها في اللوحة الجانبية مباشرة.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="default" className="h-[3.375rem] rounded-[1rem] px-6">أنت داخل الخريطة الآن</Button>
              <Link to="/leasing"><Button variant="outline-blue" className="h-[3.375rem] rounded-[1rem] px-6">انتقل إلى التأجير</Button></Link>
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2 md:gap-2.5">
          {floorMapData.map((item) => (
            <Button
              key={item.id}
              variant={selectedFloor === item.id ? "default" : "outline"}
              onClick={() => {
                setSelectedFloor(item.id);
                setSelectedUnit(null);
              }}
              className="h-12 rounded-full px-[1.375rem] text-sm"
            >
              {item.label}
            </Button>
          ))}
        </div>

        <div className="mb-5 section-shell rounded-[1.5rem] p-4 md:p-5">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="ابحث باسم المتجر أو رقم الوحدة" className="h-[3.25rem] rounded-[1.125rem]" />
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | UnitStatus)}>
              <SelectTrigger className="h-[3.25rem] rounded-[1.125rem]"><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="occupied">مشغولة</SelectItem>
                <SelectItem value="available">متاحة</SelectItem>
                <SelectItem value="coming_soon">قريبًا</SelectItem>
              </SelectContent>
            </Select>
            <Select value={needFilter} onValueChange={(value) => setNeedFilter(value as "all" | (typeof exploreNeeds)[number])}>
              <SelectTrigger className="h-[3.25rem] rounded-[1.125rem]"><SelectValue placeholder="الفئة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الفئات</SelectItem>
                {exploreNeeds.map((need) => (
                    <SelectItem key={need} value={need}>{needCategoryLabels[need]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex h-[3.25rem] items-center justify-between rounded-[1.125rem] border border-border bg-card px-4">
              <span className="text-sm font-semibold text-foreground">المتاحة فقط</span>
              <Switch checked={availableOnly} onCheckedChange={setAvailableOnly} />
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          <Badge variant="outline" className="h-8 rounded-full border-border px-3 text-foreground">مشغولة</Badge>
          <Badge variant="outline" className="h-8 rounded-full border-orange/50 px-3 text-orange">متاحة</Badge>
          <Badge variant="outline" className="h-8 rounded-full border-accent/50 px-3 text-accent">قريبًا</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <FloorPlanSvg
              floorId={selectedFloor}
              units={floor.units}
              selectedUnitId={activeUnit?.unit_id ?? null}
              mutedUnitIds={mutedUnitIds}
              onSelectUnit={setSelectedUnit}
            />
          </div>

          {!isMobile && (
            <aside className="lg:col-span-4 lg:min-w-[380px] lg:w-full lg:max-w-[420px] lg:sticky lg:top-28">
              <div className="surface-panel rounded-[1.5rem] p-4 md:p-5">
                <h2 className="mb-4 text-xl font-bold text-foreground">تفاصيل الوحدة</h2>
                {activeUnit ? (
                  <DetailBody unit={activeUnit} />
                ) : (
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p className="leading-7">اختر وحدة من الخريطة لعرض حالتها، موقعها داخل الدور، والإجراء الأنسب بعدها.</p>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between rounded-[1rem] border border-border bg-card px-4 py-3">
                        <span>مشغولة</span>
                        <span className="text-xs">استعرض بيانات المتجر</span>
                      </div>
                      <div className="flex items-center justify-between rounded-[1rem] border border-border bg-card px-4 py-3">
                        <span className="text-orange">متاحة</span>
                        <span className="text-xs">ابدأ الاستفسار التجاري</span>
                      </div>
                      <div className="flex items-center justify-between rounded-[1rem] border border-border bg-card px-4 py-3">
                        <span className="text-accent">قريبًا</span>
                        <span className="text-xs">تابع التحديثات القادمة</span>
                      </div>
                    </div>
                    <div className="rounded-[1rem] border border-dashed border-border px-4 py-3 text-xs">تلميح سريع: استخدم الفلاتر لتضييق النتائج ثم اختر الوحدة مباشرة من المخطط.</div>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>

        <section className="mt-8 section-shell rounded-[1.7rem] p-4 md:p-6">
          <h2 className="mb-4 text-2xl font-bold text-foreground">الوحدات المتاحة</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {availableUnits.map((unit) => (
              <button
                key={unit.unit_id}
                className="text-right rounded-[1.25rem] border border-orange/30 bg-card p-4 transition-colors hover:border-orange"
                onClick={() => setSelectedUnit(unit)}
              >
                <p className="text-base font-bold text-foreground">وحدة {unit.unit_id}</p>
                <p className="mt-1 text-sm text-muted-foreground">{unit.area_m2} م²</p>
                <p className="mt-2 text-sm text-muted-foreground">{floorLabelAr[unit.floor_id]}</p>
                <p className="mt-1 text-xs font-semibold text-orange">{needCategoryLabels[unit.category]}</p>
              </button>
            ))}
          </div>
          {availableUnits.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">لا توجد وحدات متاحة ضمن الفلاتر الحالية على هذا الدور.</p> : null}
        </section>
        <Drawer open={isMobile && !!activeUnit} onOpenChange={(isOpen) => !isOpen && setSelectedUnit(null)}>
          <DrawerContent className="max-h-[85vh] rounded-t-[1.4rem] border-border bg-card">
            <DrawerHeader className="border-b border-border text-right">
              <DrawerTitle>{activeUnit ? `وحدة ${activeUnit.unit_id}` : "تفاصيل الوحدة"}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto p-4">{activeUnit ? <DetailBody unit={activeUnit} /> : null}</div>
          </DrawerContent>
        </Drawer>
      </div>
    </MainLayout>
  );
};

export default InteractiveMap;
