import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { MallFloorMap } from "@/components/map/MallFloorMap";
import { MapFilters } from "@/components/map/MapFilters";
import { FloorTabs } from "@/components/map/FloorTabs";
import { UnitDetailsCard } from "@/components/map/UnitDetailsCard";
import { MapLegend } from "@/components/map/MapLegend";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import {
  mallFloors,
  allMallUnits,
  availableMallUnits,
  floorLabelsAr,
  categoryLabelsAr,
  type MallFloorId,
  type MallUnit,
  type MallUnitStatus,
  type MallCategory,
} from "@/lib/mallFloorGeometry";

const InteractiveMap = () => {
  const isMobile = useIsMobile();
  const [selectedFloor, setSelectedFloor] = useState<MallFloorId>("ground");
  const [statusFilter, setStatusFilter] = useState<"all" | MallUnitStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | MallCategory>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<MallUnit | null>(null);

  const floor = useMemo(
    () => mallFloors.find((f) => f.id === selectedFloor) ?? mallFloors[0],
    [selectedFloor],
  );

  const filteredUnits = useMemo(() => {
    return floor.units.filter((unit) => {
      const q = searchTerm.trim().toLowerCase();
      const matchSearch = q.length === 0 || unit.code.toLowerCase().includes(q) || unit.name.includes(q);
      const matchStatus = availableOnly ? unit.status === "available" : statusFilter === "all" || unit.status === statusFilter;
      const matchCat = categoryFilter === "all" || unit.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [floor.units, searchTerm, statusFilter, categoryFilter, availableOnly]);

  const mutedUnitIds = useMemo(() => {
    const filtered = new Set(filteredUnits.map((u) => u.id));
    return new Set(floor.units.filter((u) => !filtered.has(u.id)).map((u) => u.id));
  }, [filteredUnits, floor.units]);

  const activeUnit = selectedUnit && selectedUnit.floor === selectedFloor ? selectedUnit : null;
  const floorAvailable = floor.units.filter((u) => u.status === "available").length;

  const handleFloorChange = (id: MallFloorId) => {
    setSelectedFloor(id);
    setSelectedUnit(null);
  };

  return (
    <MainLayout>
      <SEOHead
        title="الدليل التفاعلي"
        titleEn="Interactive Directory"
        description="دليل تفاعلي معماري لمول البستان مع بحث وفلاتر ووحدات متاحة للتأجير."
        descriptionEn="Architectural interactive directory for Mall Elbostan with search, filters, and leasing units."
        breadcrumbs={[{ name: "الخريطة", url: "/map" }]}
      />

      <div className="container py-10 md:py-14 lg:py-[5.5rem]">
        {/* ── Header ── */}
        <div className="mb-5 section-shell page-shell grid gap-4 lg:grid-cols-[7fr_5fr] lg:items-center">
          <div className="space-y-3.5">
            <div className="chapter-shell pt-5">
              <h1 className="section-title">الدليل التفاعلي</h1>
              <p className="mt-3 max-w-[38.75rem] text-base leading-7 text-muted-foreground md:text-lg">
                ابدأ من الخريطة لتحديد الدور، فهم حالة الوحدة، والانتقال مباشرة إلى خطوة التأجير أو استكشاف المتاجر.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="editorial-panel flex min-h-[5.75rem] flex-col justify-center rounded-[1.25rem] px-4 py-3.5">
                <p className="text-xs font-semibold text-muted-foreground">عدد الأدوار</p>
                <p className="mt-1.5 text-xl font-bold text-foreground">{mallFloors.length}</p>
              </div>
              <div className="editorial-panel flex min-h-[5.75rem] flex-col justify-center rounded-[1.25rem] px-4 py-3.5">
                <p className="text-xs font-semibold text-muted-foreground">الوحدات المعروضة</p>
                <p className="mt-1.5 text-xl font-bold text-foreground">{allMallUnits.length}</p>
              </div>
              <div className="editorial-panel flex min-h-[5.75rem] flex-col justify-center rounded-[1.25rem] px-4 py-3.5">
                <p className="text-xs font-semibold text-muted-foreground">الوحدات المتاحة</p>
                <p className="mt-1.5 text-xl font-bold text-foreground">{availableMallUnits.length}</p>
              </div>
            </div>
          </div>
          <div className="editorial-panel rounded-[1.5rem] p-5 md:p-6">
            <h2 className="text-2xl font-bold text-foreground">ابدأ من الخريطة</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">
              فلترة حسب الحالة أو الفئة، ثم اختر الوحدة لتظهر بياناتها وإجراءاتها في اللوحة الجانبية مباشرة.
            </p>
            <div className="mt-4 grid gap-2">
              <div className="flex items-center justify-between rounded-[1rem] border border-border bg-card px-4 py-3 text-sm">
                <span className="text-foreground">وحدات هذا الدور</span>
                <span className="font-semibold text-foreground">{floor.units.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-[1rem] border border-border bg-card px-4 py-3 text-sm">
                <span className="text-orange">المتاح في هذا الدور</span>
                <span className="font-semibold text-orange">{floorAvailable}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="default" className="h-[3.375rem] rounded-[1rem] px-6">أنت داخل الخريطة الآن</Button>
              <Link to="/leasing">
                <Button variant="outline-blue" className="h-[3.375rem] rounded-[1rem] px-6">انتقل إلى التأجير</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Floor tabs ── */}
        <div className="mb-5">
          <FloorTabs selected={selectedFloor} onChange={handleFloorChange} />
        </div>

        {/* ── Filters ── */}
        <div className="mb-5">
          <MapFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            availableOnly={availableOnly}
            onAvailableOnlyChange={setAvailableOnly}
          />
        </div>

        {/* ── Legend ── */}
        <div className="mb-5">
          <MapLegend />
        </div>

        {/* ── Map + Details grid ── */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <MallFloorMap
              floor={floor}
              selectedUnitId={activeUnit?.id ?? null}
              mutedUnitIds={mutedUnitIds}
              onSelectUnit={setSelectedUnit}
            />
          </div>

          {!isMobile && (
            <aside className="lg:col-span-4 lg:sticky lg:top-28">
              <UnitDetailsCard unit={activeUnit} />
            </aside>
          )}
        </div>

        {/* ── Available units list ── */}
        <section className="mt-8 section-shell rounded-[1.7rem] p-4 md:p-6">
          <h2 className="mb-4 text-2xl font-bold text-foreground">الوحدات المتاحة في هذا الدور</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredUnits.filter((u) => u.status === "available").map((unit) => (
              <button
                key={unit.id}
                className="text-right rounded-[1.25rem] border border-orange/30 bg-card p-4 transition-colors hover:border-orange"
                onClick={() => setSelectedUnit(unit)}
              >
                <p className="text-base font-bold text-foreground">وحدة {unit.code}</p>
                <p className="mt-1 text-sm text-muted-foreground">{unit.area} م²</p>
                <p className="mt-2 text-sm text-muted-foreground">{floorLabelsAr[unit.floor]}</p>
                <p className="mt-1 text-xs font-semibold text-orange">{categoryLabelsAr[unit.category]}</p>
              </button>
            ))}
          </div>
          {filteredUnits.filter((u) => u.status === "available").length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">لا توجد وحدات متاحة ضمن الفلاتر الحالية على هذا الدور.</p>
          )}
        </section>

        {/* ── Mobile drawer ── */}
        <Drawer open={isMobile && !!activeUnit} onOpenChange={(open) => !open && setSelectedUnit(null)}>
          <DrawerContent className="max-h-[85vh] rounded-t-[1.4rem] border-border bg-card">
            <DrawerHeader className="border-b border-border text-right">
              <DrawerTitle>{activeUnit ? `وحدة ${activeUnit.code}` : "تفاصيل الوحدة"}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto p-4">
              {activeUnit && <UnitDetailsCard unit={activeUnit} />}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </MainLayout>
  );
};

export default InteractiveMap;
