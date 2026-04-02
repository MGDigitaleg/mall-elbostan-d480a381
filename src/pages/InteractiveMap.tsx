import { useMemo, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Compass,
  Layers,
  MapPin,
  Phone,
  TrendingUp,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { MallFloorMap } from "@/components/map/MallFloorMap";
import { MapFilters } from "@/components/map/MapFilters";
import { FloorTabs } from "@/components/map/FloorTabs";
import { UnitDetailsCard, type ActiveRewardContext } from "@/components/map/UnitDetailsCard";
import { MapLegend } from "@/components/map/MapLegend";
import { AtriumSpinModal, type SpinWinResult } from "@/components/map/AtriumSpinModal";
import { AtriumHubModal, DEFAULT_ATRIUM_CONFIG, type AtriumConfig } from "@/components/map/AtriumHubModal";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  mallFloors,
  allMallUnits,
  availableMallUnits,
  floorLabelsAr,
  type MallFloorId,
  type MallUnit,
  type MallUnitStatus,
  type MallCategory,
} from "@/lib/mallFloorGeometry";

const storeCategoryToMapCategory: Record<string, MallCategory> = {
  "phones": "Accessories",
  "accessories": "Accessories",
  "computers": "Laptops",
  "laptops": "Laptops",
  "gaming": "Components",
  "components": "Components",
  "printing": "Networking",
  "networking": "Networking",
  "maintenance": "Maintenance",
  "security": "Security Systems",
};

function resolveMapCategory(storeCategory: string | null): MallCategory | null {
  if (!storeCategory) return null;
  const lower = storeCategory.toLowerCase();
  for (const [key, val] of Object.entries(storeCategoryToMapCategory)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

const InteractiveMap = () => {
  const isMobile = useIsMobile();
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedFloor, setSelectedFloor] = useState<MallFloorId>("ground");
  const [statusFilter, setStatusFilter] = useState<"all" | MallUnitStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | MallCategory>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<MallUnit | null>(null);
  const [spinModalOpen, setSpinModalOpen] = useState(false);
  const [hubModalOpen, setHubModalOpen] = useState(false);
  const [highlightedUnitIds, setHighlightedUnitIds] = useState<Set<string>>(new Set());
  const [activeRewardCtx, setActiveRewardCtx] = useState<ActiveRewardContext | undefined>();
  const [lastWinResult, setLastWinResult] = useState<SpinWinResult | null>(null);

  const [atriumConfig] = useState<AtriumConfig>(DEFAULT_ATRIUM_CONFIG);

  const handleAtriumClick = useCallback(() => { setHubModalOpen(true); }, []);
  const handleOpenSpinWheel = useCallback(() => { setSpinModalOpen(true); }, []);

  const handleHubFilterCategory = useCallback((cat: MallCategory) => {
    setCategoryFilter(cat);
    const matchingIds = new Set(allMallUnits.filter((u) => u.category === cat && u.status === "occupied").map((u) => u.id));
    setHighlightedUnitIds(matchingIds);
    scrollToMap();
    setTimeout(() => setHighlightedUnitIds(new Set()), 12000);
  }, []);

  const clearRewardState = useCallback(() => {
    setHighlightedUnitIds(new Set());
    setActiveRewardCtx(undefined);
    setLastWinResult(null);
  }, []);

  const scrollToMap = useCallback(() => {
    setTimeout(() => { mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 200);
  }, []);

  const handleSpinWin = useCallback((result: SpinWinResult | null) => {
    if (!result) return;
    setLastWinResult(result);
    const { reward, sponsorStore } = result;

    if (sponsorStore?.unit_code) {
      const unitCode = sponsorStore.unit_code;
      const targetUnit = allMallUnits.find((u) => u.code === unitCode);
      if (targetUnit) {
        setSelectedFloor(targetUnit.floor);
        setSelectedUnit(targetUnit);
        setHighlightedUnitIds(new Set([targetUnit.id]));
        setActiveRewardCtx({ reward, storeName: sponsorStore.name_ar });
      } else {
        const occupiedIds = new Set(mallFloors.flatMap((f) => f.units.filter((u) => u.status === "occupied").map((u) => u.id)));
        setHighlightedUnitIds(occupiedIds);
        setActiveRewardCtx({ reward, storeName: sponsorStore.name_ar });
      }
    } else {
      const mapCat = resolveMapCategory(sponsorStore?.category ?? null);
      if (mapCat) {
        const matchingIds = new Set(allMallUnits.filter((u) => u.category === mapCat && u.status === "occupied").map((u) => u.id));
        setHighlightedUnitIds(matchingIds);
        setCategoryFilter(mapCat);
        setActiveRewardCtx({ reward, isCategory: true });
      } else {
        const occupiedIds = new Set(mallFloors.flatMap((f) => f.units.filter((u) => u.status === "occupied").map((u) => u.id)));
        setHighlightedUnitIds(occupiedIds);
        setActiveRewardCtx({ reward, isCategory: true });
      }
    }
    setTimeout(() => clearRewardState(), 15000);
  }, [clearRewardState]);

  const handleViewOnMap = useCallback(() => { scrollToMap(); }, [scrollToMap]);
  const handleExploreCategory = useCallback(() => { scrollToMap(); }, [scrollToMap]);

  const floor = useMemo(() => mallFloors.find((f) => f.id === selectedFloor) ?? mallFloors[0], [selectedFloor]);

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
  const floorOccupied = floor.units.filter((u) => u.status === "occupied").length;
  const floorComingSoon = floor.units.filter((u) => u.status === "coming_soon").length;

  const handleFloorChange = (id: MallFloorId) => { setSelectedFloor(id); setSelectedUnit(null); };

  return (
    <MainLayout>
      <SEOHead
        title="الدليل التفاعلي"
        titleEn="Interactive Directory"
        description="دليل تفاعلي معماري لمول البستان مع بحث وفلاتر ووحدات متاحة للتأجير في القاهرة الجديدة."
        descriptionEn="Architectural interactive directory for Mall Elbostan with search, filters, and leasing units."
        breadcrumbs={[{ name: "الخريطة", url: "/map" }]}
      />

      {/* ═══════════ HERO — compact, operational ═══════════ */}
      <section style={{ background: "#071326" }}>
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-14">
          <div className="py-8 md:py-10">
            <div className="flex flex-col items-center gap-5 md:flex-row md:items-end md:justify-between">
              {/* left: title + desc */}
              <div className="text-center md:text-right">
                <div className="mb-2 flex items-center justify-center gap-3 md:justify-start">
                  <div className="h-[3px] w-10 rounded-full" style={{ background: "#CDBB9A" }} />
                  <span className="font-poppins text-[0.68rem] font-bold tracking-[0.22em] uppercase" style={{ color: "#CDBB9A" }}>
                    الدليل التفاعلي
                  </span>
                </div>
                <h1 className="mt-2 text-[1.6rem] leading-[1.06] md:text-[2rem] lg:text-[2.4rem] dark-heading">
                  خريطة المول التفاعلية
                </h1>
                <p className="mt-2 max-w-[28rem] text-[0.88rem] leading-7 dark-body">
                  تنقّل بين الأدوار، حدد حالة كل وحدة، وانتقل للتأجير أو تفاصيل المتجر مباشرة.
                </p>
              </div>

              {/* right: compact stats */}
              <div className="flex items-center gap-5">
                {[
                  { v: `${mallFloors.length}`, l: "أدوار", icon: Building2 },
                  { v: `${allMallUnits.length}`, l: "وحدة", icon: Layers },
                  { v: `${availableMallUnits.length}`, l: "متاحة", icon: TrendingUp },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                      <s.icon className="h-3.5 w-3.5" style={{ color: "#5B9AFF" }} />
                      <span className="font-poppins text-[1.1rem] font-extrabold dark-heading">{s.v}</span>
                      <span className="text-[0.72rem] font-semibold dark-muted">{s.l}</span>
                    </div>
                    {i < 2 && <div className="h-5 w-px" style={{ background: "#ffffff14" }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CONTROL BAR — integrated, professional ═══════════ */}
      <section className="sticky top-[60px] z-30 border-b bg-card/95 backdrop-blur-sm md:top-[68px] xl:top-[72px]" style={{ borderColor: "#D8DEE8" }}>
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-14">
          {/* Row 1: floors + legend + floor stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            <FloorTabs selected={selectedFloor} onChange={handleFloorChange} />

            <div className="flex items-center gap-4">
              <MapLegend />
              <div className="hidden items-center gap-2 text-[0.76rem] md:flex" style={{ borderRight: "1px solid #D8DEE8", paddingRight: "12px" }}>
                <span className="font-bold light-heading">{floor.units.length}</span>
                <span className="light-muted">وحدة</span>
                <span className="mx-1 h-3 w-px bg-border" />
                <span className="font-bold" style={{ color: "#E8740E" }}>{floorAvailable}</span>
                <span className="light-muted">متاحة</span>
                <span className="mx-1 h-3 w-px bg-border" />
                <span className="font-bold light-heading">{floorOccupied}</span>
                <span className="light-muted">مشغولة</span>
                {floorComingSoon > 0 && (
                  <>
                    <span className="mx-1 h-3 w-px bg-border" />
                    <span className="font-bold" style={{ color: "#0A9AB8" }}>{floorComingSoon}</span>
                    <span className="light-muted">قريبًا</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: filters */}
          <div className="pb-3">
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
        </div>
      </section>

      {/* ═══════════ MAP + DETAILS PANEL ═══════════ */}
      <section className="py-4 md:py-5" style={{ background: "#FAFAF8" }}>
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-14">
          <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
            {/* Map */}
            <div ref={mapRef}>
              <MallFloorMap
                floor={floor}
                selectedUnitId={activeUnit?.id ?? null}
                mutedUnitIds={mutedUnitIds}
                onSelectUnit={setSelectedUnit}
                onAtriumClick={handleAtriumClick}
                atriumConfig={atriumConfig}
                highlightedUnitIds={highlightedUnitIds}
              />
            </div>

            {/* Details panel — wider, more premium */}
            {!isMobile && (
              <aside className="lg:sticky lg:top-[180px]">
                <UnitDetailsCard unit={activeUnit} rewardContext={activeRewardCtx} />
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ AVAILABLE UNITS — continuation of map ═══════════ */}
      <section className="py-6 md:py-8" style={{ background: "#F5F2EC" }}>
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-14">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-[3px] w-6 rounded-full" style={{ background: "#E8740E" }} />
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em]" style={{ color: "#E8740E" }}>الوحدات المتاحة للتأجير</p>
                <h2 className="mt-0.5 text-[1.1rem] font-bold leading-tight light-heading md:text-[1.3rem]">
                  {floorLabelsAr[selectedFloor]} — {floorAvailable} وحدة متاحة
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/leasing">
                <Button variant="orange" size="sm" className="h-9 rounded-xl px-5 text-[0.82rem] font-bold">
                  <Phone className="ml-1.5 h-3.5 w-3.5" /> استفسر عن التأجير
                </Button>
              </Link>
              <Link to="/leasing" className="hidden md:inline-flex">
                <Button variant="outline-blue" size="sm" className="h-9 rounded-xl px-5 text-[0.82rem]">
                  صفحة التأجير
                </Button>
              </Link>
            </div>
          </div>

          {filteredUnits.filter((u) => u.status === "available").length > 0 ? (
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredUnits.filter((u) => u.status === "available").map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => { setSelectedUnit(unit); mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
                  className={`group rounded-xl border bg-card p-4 text-right transition-all duration-200 ${
                    activeUnit?.id === unit.id
                      ? "border-[#E8740E] shadow-[0_0_0_2px_#E8740E33,var(--shadow-elevated)]"
                      : "border-border hover:border-[#E8740E]/40 hover:shadow-[var(--shadow-card)]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[0.98rem] font-bold light-heading">وحدة {unit.code}</p>
                      <p className="mt-0.5 text-[0.78rem] light-muted">{floorLabelsAr[unit.floor]}</p>
                    </div>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold"
                      style={{ background: "#FDE4C4", border: "1px solid #E8740E40", color: "#B85C08" }}
                    >
                      متاحة
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[0.84rem] font-bold light-heading">{unit.area} م²</span>
                    <span className="flex items-center gap-1 text-[0.76rem] font-semibold opacity-0 transition-opacity group-hover:opacity-100" style={{ color: "#E8740E" }}>
                      <MapPin className="h-3 w-3" />
                      عرض على الخريطة
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card px-6 py-8 text-center">
              <p className="text-[0.88rem] font-semibold light-muted">لا توجد وحدات متاحة ضمن الفلاتر الحالية في هذا الدور.</p>
              <p className="mt-1 text-[0.82rem] light-body">جرّب تغيير الدور أو إعادة ضبط الفلاتر.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ CTA STRIP ═══════════ */}
      <section className="py-12 md:py-14" style={{ background: "#071326" }}>
        <div className="mx-auto max-w-[900px] px-5 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[3px] w-8 rounded-full" style={{ background: "#CDBB9A" }} />
            <span className="font-poppins text-[0.68rem] font-bold tracking-[0.22em] uppercase" style={{ color: "#CDBB9A" }}>فرص التأجير</span>
            <div className="h-[3px] w-8 rounded-full" style={{ background: "#CDBB9A" }} />
          </div>
          <h2 className="text-[1.2rem] font-bold md:text-[1.5rem] dark-heading">تبحث عن وحدة تجارية في موقع فعّال؟</h2>
          <p className="mx-auto mt-2 max-w-sm text-[0.9rem] leading-7 dark-body">
            من الخريطة مباشرة لصفحة التأجير — استفسر الآن وابدأ حوارًا مع الفريق.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/leasing">
              <Button variant="orange" size="lg" className="h-12 rounded-xl px-8 font-bold">
                <Phone className="ml-2 h-4 w-4" /> ابدأ استفسار التأجير
              </Button>
            </Link>
            <Link to="/stores">
              <Button size="lg" className="h-12 rounded-xl border px-8 font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
                تصفّح المتاجر
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mobile drawer ── */}
      <Drawer open={isMobile && !!activeUnit} onOpenChange={(open) => !open && setSelectedUnit(null)}>
        <DrawerContent className="max-h-[85vh] rounded-t-2xl border-border bg-card">
          <DrawerHeader className="border-b border-border text-right">
            <DrawerTitle>{activeUnit ? `وحدة ${activeUnit.code}` : "تفاصيل الوحدة"}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto p-4">
            {activeUnit && <UnitDetailsCard unit={activeUnit} rewardContext={activeRewardCtx} />}
          </div>
        </DrawerContent>
      </Drawer>

      {/* ── Atrium Hub Modal ── */}
      <AtriumHubModal
        open={hubModalOpen}
        onClose={() => setHubModalOpen(false)}
        config={atriumConfig}
        onOpenSpinWheel={handleOpenSpinWheel}
        onFilterCategory={handleHubFilterCategory}
      />

      {/* ── Atrium Spin Modal ── */}
      <AtriumSpinModal
        open={spinModalOpen}
        onClose={() => setSpinModalOpen(false)}
        onWin={handleSpinWin}
        onViewOnMap={handleViewOnMap}
        onExploreCategory={handleExploreCategory}
      />
    </MainLayout>
  );
};

export default InteractiveMap;
