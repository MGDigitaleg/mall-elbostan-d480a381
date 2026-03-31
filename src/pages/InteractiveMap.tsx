import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FloorPlanSvg } from "@/components/map/FloorPlanSvg";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { exploreNeeds, floorLabelAr, floorMapData, type FloorId, type MapUnitDefinition, type UnitStatus } from "@/lib/floorMapData";
import { Link } from "react-router-dom";

const InteractiveMap = () => {
  const isMobile = useIsMobile();
  const [selectedFloor, setSelectedFloor] = useState<FloorId>("ground");
  const [statusFilter, setStatusFilter] = useState<"all" | UnitStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [needFilter, setNeedFilter] = useState<"all" | (typeof exploreNeeds)[number]>("all");
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
      const matchStatus = statusFilter === "all" || unit.status === statusFilter;
      const matchNeed = needFilter === "all" || unit.category === needFilter;
      return matchSearch && matchStatus && matchNeed;
    });
  }, [floor.units, searchTerm, statusFilter, needFilter]);

  const filteredIds = useMemo(() => new Set(filteredUnits.map((unit) => unit.unit_id)), [filteredUnits]);

  const mutedUnitIds = useMemo(
    () => new Set(floor.units.filter((unit) => !filteredIds.has(unit.unit_id)).map((unit) => unit.unit_id)),
    [filteredIds, floor.units],
  );

  const availableUnits = useMemo(
    () => filteredUnits.filter((unit) => unit.status === "available"),
    [filteredUnits],
  );

  const activeUnit = selectedUnit && selectedUnit.floor_id === selectedFloor ? selectedUnit : null;

  const DetailBody = ({ unit }: { unit: MapUnitDefinition }) => (
    <div className="space-y-4 text-sm text-muted-foreground">
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground">الوحدة</p>
        <p className="text-base font-bold text-foreground">{unit.unit_id}</p>
        <p className="mt-1">{floorLabelAr[unit.floor_id]}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs">المساحة</p>
          <p className="mt-1 text-base font-semibold text-foreground">{unit.area_m2} م²</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs">الفئة</p>
          <p className="mt-1 text-base font-semibold text-foreground">{unit.category}</p>
        </div>
      </div>
      <p className="leading-7">{unit.description_ar}</p>
      <div className="flex flex-wrap gap-2">
        {unit.status === "available" ? (
          <>
            <Link to="/leasing"><Button variant="orange" size="sm">احجز وحدة</Button></Link>
            <Link to="/leasing"><Button variant="outline-blue" size="sm">اطلب معاينة</Button></Link>
          </>
        ) : (
          <Link to="/stores"><Button variant="outline-blue" size="sm">عرض المتاجر</Button></Link>
        )}
      </div>
    </div>
  );

  return (
    <MainLayout>
      <SEOHead title="دليل المول التفاعلي" titleEn="Interactive Directory" description="دليل تفاعلي معماري لمول البستان مع بحث وفلاتر ووحدات متاحة للتأجير." descriptionEn="Architectural interactive directory for Mall Elbostan with search, filters, and leasing units." breadcrumbs={[{ name: "الخريطة", url: "/map" }]} />
      <div className="container py-12 md:py-16">
        <div className="mb-8 chapter-shell pt-5">
          <h1 className="section-title">الدليل التفاعلي</h1>
          <p className="mt-3 text-base text-muted-foreground">استكشف الطوابق، ابحث عن الوحدة، وابدأ خطوة التأجير مباشرة.</p>
        </div>

        <div className="mb-5 flex flex-wrap gap-2 md:gap-3">
          {floorMapData.map((item) => (
            <Button
              key={item.id}
              variant={selectedFloor === item.id ? "default" : "outline"}
              onClick={() => {
                setSelectedFloor(item.id);
                setSelectedUnit(null);
              }}
              className="h-11 rounded-full px-5"
            >
              {item.label}
            </Button>
          ))}
        </div>

        <div className="mb-6 section-shell rounded-[1.5rem] p-4 md:p-5">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="ابحث باسم المتجر أو رقم الوحدة" className="h-11" />
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | UnitStatus)}>
              <SelectTrigger className="h-11"><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="occupied">مشغولة</SelectItem>
                <SelectItem value="available">متاحة</SelectItem>
                <SelectItem value="coming_soon">قريبًا</SelectItem>
              </SelectContent>
            </Select>
            <Select value={needFilter} onValueChange={(value) => setNeedFilter(value as "all" | (typeof exploreNeeds)[number])}>
              <SelectTrigger className="h-11"><SelectValue placeholder="الاستكشاف حسب الاحتياج" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الفئات</SelectItem>
                {exploreNeeds.map((need) => (
                  <SelectItem key={need} value={need}>{need}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline-blue" className="h-11" onClick={() => setStatusFilter("available")}>الوحدات المتاحة فقط</Button>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          <Badge variant="outline" className="border-primary/40 text-primary">مشغولة</Badge>
          <Badge variant="outline" className="border-orange/50 text-orange">متاحة</Badge>
          <Badge variant="outline" className="border-accent/50 text-accent">قريبًا</Badge>
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
            <aside className="lg:col-span-4 lg:w-full lg:max-w-[420px]">
              <div className="surface-panel rounded-[1.5rem] p-4 md:p-5">
                <h2 className="mb-4 text-xl font-bold text-foreground">تفاصيل الوحدة</h2>
                {activeUnit ? (
                  <DetailBody unit={activeUnit} />
                ) : (
                  <p className="text-sm text-muted-foreground">اختر وحدة من الخريطة لعرض بياناتها.</p>
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
                className="text-right rounded-2xl border border-orange/30 bg-card p-4 transition-colors hover:border-orange"
                onClick={() => setSelectedUnit(unit)}
              >
                <p className="text-base font-bold text-foreground">وحدة {unit.unit_id}</p>
                <p className="mt-1 text-sm text-muted-foreground">{unit.area_m2} م²</p>
                <p className="mt-2 text-sm text-muted-foreground">{floorLabelAr[unit.floor_id]}</p>
              </button>
            ))}
          </div>
          {availableUnits.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">لا توجد وحدات متاحة ضمن الفلاتر الحالية.</p> : null}
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
