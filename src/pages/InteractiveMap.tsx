import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Compass,
  Layers,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { MallFloorMap } from "@/components/map/MallFloorMap";
import { MapFilters } from "@/components/map/MapFilters";
import { FloorTabs } from "@/components/map/FloorTabs";
import { UnitDetailsCard } from "@/components/map/UnitDetailsCard";
import { MapLegend } from "@/components/map/MapLegend";
import { AtriumSpinModal } from "@/components/map/AtriumSpinModal";
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

const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const InteractiveMap = () => {
  const isMobile = useIsMobile();
  const [selectedFloor, setSelectedFloor] = useState<MallFloorId>("ground");
  const [statusFilter, setStatusFilter] = useState<"all" | MallUnitStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | MallCategory>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<MallUnit | null>(null);
  const [spinModalOpen, setSpinModalOpen] = useState(false);
  const [highlightedUnitIds, setHighlightedUnitIds] = useState<Set<string>>(new Set());

  const handleAtriumClick = useCallback(() => {
    setSpinModalOpen(true);
  }, []);

  const handleSpinWin = useCallback(() => {
    // Highlight occupied stores as "participating" after a win
    const occupiedIds = new Set(
      mallFloors.flatMap((f) => f.units.filter((u) => u.status === "occupied").map((u) => u.id))
    );
    setHighlightedUnitIds(occupiedIds);
    // Clear highlights after 8 seconds
    setTimeout(() => setHighlightedUnitIds(new Set()), 8000);
  }, []);

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
  const floorOccupied = floor.units.filter((u) => u.status === "occupied").length;

  const handleFloorChange = (id: MallFloorId) => {
    setSelectedFloor(id);
    setSelectedUnit(null);
  };

  return (
    <MainLayout>
      <SEOHead
        title="الدليل التفاعلي"
        titleEn="Interactive Directory"
        description="دليل تفاعلي معماري لمول البستان مع بحث وفلاتر ووحدات متاحة للتأجير في القاهرة الجديدة."
        descriptionEn="Architectural interactive directory for Mall Elbostan with search, filters, and leasing units."
        breadcrumbs={[{ name: "الخريطة", url: "/map" }]}
      />

      {/* ═══════════ HERO INTRO ═══════════ */}
      <section className="heritage-section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 0.6px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-14">
          <div className="py-14 md:py-16 lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-[48rem] text-center"
            >
              <span className="eyebrow-chip border-white/15 bg-white/8 text-[0.76rem] text-white/70">
                <Compass className="h-4 w-4" />
                الدليل التفاعلي
              </span>

              <h1 className="mt-5 text-[1.8rem] font-extrabold leading-[1.1] text-white md:text-[2.6rem] lg:text-[3rem]">
                خريطة دقيقة لكل وحدة في المول.
              </h1>
              <p className="mx-auto mt-4 max-w-[30rem] text-[0.95rem] leading-[2] text-white/45 md:text-[1.05rem]">
                استكشف الأدوار، حدد حالة كل وحدة، وانتقل مباشرة من الخريطة إلى التأجير أو تفاصيل المتجر.
              </p>

              {/* stats row */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {[
                  { icon: Building2, v: `${mallFloors.length}`, l: "أدوار" },
                  { icon: Layers, v: `${allMallUnits.length}`, l: "وحدة" },
                  { icon: TrendingUp, v: `${availableMallUnits.length}`, l: "متاحة" },
                ].map((s) => (
                  <div key={s.l} className="heritage-card flex items-center gap-3 rounded-xl px-5 py-3">
                    <s.icon className="h-4 w-4 text-primary" />
                    <div className="text-right">
                      <span className="font-poppins text-lg font-bold text-white">{s.v}</span>
                      <span className="mr-1.5 text-[0.72rem] text-white/40">{s.l}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ CONTROL PANEL ═══════════ */}
      <section className="page-section !pt-8 !pb-0">
        <div className="container max-w-[1400px]">
          {/* Floor tabs + legend row */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <FloorTabs selected={selectedFloor} onChange={handleFloorChange} />
            <div className="flex items-center gap-4">
              <MapLegend />
              {/* floor mini-stats */}
              <div className="hidden items-center gap-3 text-[0.78rem] md:flex">
                <span className="text-muted-foreground">{floor.units.length} وحدة</span>
                <span className="h-3 w-px bg-border" />
                <span className="font-semibold text-orange">{floorAvailable} متاحة</span>
                <span className="h-3 w-px bg-border" />
                <span className="text-muted-foreground">{floorOccupied} مشغولة</span>
              </div>
            </div>
          </div>

          {/* Filters */}
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
      </section>

      {/* ═══════════ MAP + DETAILS PANEL ═══════════ */}
      <section className="!pt-4 !pb-0">
        <div className="container max-w-[1400px]">
          <div className="grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
            {/* Map */}
            <motion.div
              variants={sectionReveal}
              initial="hidden"
              animate="visible"
            >
              <MallFloorMap
                floor={floor}
                selectedUnitId={activeUnit?.id ?? null}
                mutedUnitIds={mutedUnitIds}
                onSelectUnit={setSelectedUnit}
                onAtriumClick={handleAtriumClick}
                highlightedUnitIds={highlightedUnitIds}
              />
            </motion.div>

            {/* Details panel — desktop */}
            {!isMobile && (
              <aside className="lg:sticky lg:top-24">
                <UnitDetailsCard unit={activeUnit} />
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ AVAILABLE UNITS LIST ═══════════ */}
      <section className="page-section !pt-8">
        <div className="container max-w-[1400px]">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="section-kicker">الوحدات المتاحة</p>
                <h2 className="text-xl font-bold text-foreground md:text-2xl">
                  {floorLabelsAr[selectedFloor]} — {floorAvailable} وحدة متاحة
                </h2>
              </div>
              <Link to="/leasing">
                <Button variant="outline-blue" size="sm" className="hidden rounded-xl px-5 md:inline-flex">
                  صفحة التأجير
                </Button>
              </Link>
            </div>

            {filteredUnits.filter((u) => u.status === "available").length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredUnits.filter((u) => u.status === "available").map((unit) => (
                  <button
                    key={unit.id}
                    onClick={() => setSelectedUnit(unit)}
                    className={`group rounded-xl border bg-card p-4 text-right transition-all hover:border-orange/40 hover:shadow-[var(--shadow-card)] ${
                      activeUnit?.id === unit.id ? "border-orange shadow-[var(--shadow-card)]" : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[0.95rem] font-bold text-foreground">وحدة {unit.code}</p>
                        <p className="mt-0.5 text-[0.78rem] text-muted-foreground">{floorLabelsAr[unit.floor]}</p>
                      </div>
                      <span className="rounded-full border border-orange/20 bg-orange/8 px-2.5 py-0.5 text-[0.68rem] font-semibold text-orange">
                        متاحة
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[0.8rem]">
                      <span className="text-muted-foreground">{unit.area} م²</span>
                      <span className="flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        <MapPin className="h-3 w-3" />
                        عرض على الخريطة
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
                <p className="text-sm text-muted-foreground">لا توجد وحدات متاحة ضمن الفلاتر الحالية.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ CTA STRIP ═══════════ */}
      <section className="heritage-section page-section !py-10">
        <div className="container max-w-[900px] text-center">
          <h2 className="text-xl font-bold text-white md:text-2xl">مهتم بوحدة تجارية؟</h2>
          <p className="mx-auto mt-2 max-w-sm text-[0.9rem] text-white/40">
            انتقل مباشرة من الخريطة إلى صفحة التأجير وابدأ استفسارك.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/leasing">
              <Button variant="orange" size="lg" className="h-12 rounded-xl px-8 font-bold">
                ابدأ استفسار التأجير
              </Button>
            </Link>
            <Link to="/stores">
              <Button size="lg" className="h-12 rounded-xl border border-white/15 bg-white/8 px-8 font-semibold text-white hover:bg-white/14">
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
            {activeUnit && <UnitDetailsCard unit={activeUnit} />}
          </div>
        </DrawerContent>
      </Drawer>

      {/* ── Atrium Spin Modal ── */}
      <AtriumSpinModal
        open={spinModalOpen}
        onClose={() => setSpinModalOpen(false)}
        onWin={handleSpinWin}
      />
    </MainLayout>
  );
};

export default InteractiveMap;
