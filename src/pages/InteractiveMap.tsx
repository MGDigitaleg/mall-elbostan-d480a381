// v2 – dark-mode refresh
import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { trackSeoLinkClick } from "@/lib/analytics";
import {
  Building2,
  Compass,
  Layers,
  MapPin,
  Phone,
  TrendingUp,
  Users,
  ArrowUpLeft,
  Ruler,
  ChevronLeft,
  Sparkles,
  LayoutGrid,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildMapLd, buildPlaceLd, buildSpeakableLd } from "@/components/SEOHead";
import { MallFloorMap } from "@/components/map/MallFloorMap";
import { MerchantLogoWall } from "@/components/home/MerchantLogoWall";
import { MapFilters } from "@/components/map/MapFilters";
import { FloorTabs } from "@/components/map/FloorTabs";
import { MapErrorBoundary } from "@/components/map/MapErrorBoundary";
import { UnitDetailsCard, type ActiveRewardContext } from "@/components/map/UnitDetailsCard";
import { MapQuickPreview } from "@/components/map/MapQuickPreview";
import { UnitInfoDrawer } from "@/components/map/UnitInfoDrawer";
import { useUnitOffersCount } from "@/hooks/useUnitOffersCount";
import { useSelectionByFloor } from "@/hooks/useSelectionByFloor";
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

/* ── Animations ── */
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const InteractiveMap = () => {
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedFloor, setSelectedFloor] = useState<MallFloorId>(() => {
    const saved = localStorage.getItem("map-selected-floor");
    return saved && mallFloors.some((f) => f.id === saved) ? (saved as MallFloorId) : "ground";
  });
  const [statusFilter, setStatusFilter] = useState<"all" | MallUnitStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | MallCategory>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  // Per-floor selection memory: keep one selected unit per floor so switching
  // floors does not lose context. The active unit is derived from the current
  // floor; setting from URL/search routes to the unit's own floor.
  const { activeUnit, setActiveUnit, clearFloorSelection } = useSelectionByFloor(selectedFloor);
  // Backwards-compatible alias used throughout the page (any callsite that
  // previously called setSelectedUnit now writes through the per-floor map).
  const setSelectedUnit = setActiveUnit;
  const [spinModalOpen, setSpinModalOpen] = useState(false);
  const [hubModalOpen, setHubModalOpen] = useState(false);
  const [highlightedUnitIds, setHighlightedUnitIds] = useState<Set<string>>(new Set());
  const [activeRewardCtx, setActiveRewardCtx] = useState<ActiveRewardContext | undefined>();
  const [lastWinResult, setLastWinResult] = useState<SpinWinResult | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [atriumConfig] = useState<AtriumConfig>(DEFAULT_ATRIUM_CONFIG);
  // Controls the mobile full-details Drawer; the compact in-map UnitInfoDrawer
  // remains the default surface after selection on mobile.
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const { data: offersBySlug } = useUnitOffersCount();

  // Auto-highlight unit from URL params
  useEffect(() => {
    const highlightCode = searchParams.get("highlight");
    const prizeName = searchParams.get("prize");
    const storeName = searchParams.get("store");
    if (!highlightCode) return;

    const targetUnit = allMallUnits.find((u) => u.code === highlightCode);
    if (targetUnit) {
      setSelectedFloor(targetUnit.floor);
      setSelectedUnit(targetUnit);
      setHighlightedUnitIds(new Set([targetUnit.id]));
      setActiveRewardCtx({ prizeName: prizeName ?? undefined, storeName: storeName ?? undefined });
      setTimeout(() => mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 500);
      setTimeout(() => {
        setHighlightedUnitIds(new Set());
        setActiveRewardCtx(undefined);
      }, 15000);
    } else {
      // Graceful fallback: the linked unit code no longer exists on the map.
      const storeLabel = storeName ? `"${storeName}"` : "المطلوب";
      toast.warning(`لم نتمكن من تحديد موقع المحل ${storeLabel} على الخريطة`, {
        description: "ربما تغيّر موقعه أو لم يُحدَّث بعد — تصفّح الخريطة لاكتشاف المحلات المتاحة.",
        duration: 6000,
      });
      setTimeout(() => mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 400);
    }
    setSearchParams({}, { replace: true });
  }, []);

  // Escape key exits fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  // Mark map as loaded after SVG has time to paint
  useEffect(() => {
    setMapLoaded(false);
    const timer = setTimeout(() => setMapLoaded(true), 400);
    return () => clearTimeout(timer);
  }, [selectedFloor]);

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

  const handleSpinWin = useCallback((result: SpinWinResult) => {
    if (!result.won || !result.result) return;
    setLastWinResult(result);
    const { result: spinData } = result;
    const store = spinData.store;
    const prizeName = spinData.prize.name_ar;

    if (store?.unit_code) {
      const targetUnit = allMallUnits.find((u) => u.code === store.unit_code);
      if (targetUnit) {
        setSelectedFloor(targetUnit.floor);
        setSelectedUnit(targetUnit);
        setHighlightedUnitIds(new Set([targetUnit.id]));
        setActiveRewardCtx({ prizeName, storeName: store.name_ar ?? undefined });
      } else {
        const occupiedIds = new Set(mallFloors.flatMap((f) => f.units.filter((u) => u.status === "occupied").map((u) => u.id)));
        setHighlightedUnitIds(occupiedIds);
        setActiveRewardCtx({ prizeName, storeName: store.name_ar ?? undefined });
        const storeLabel = store.name_ar ? `"${store.name_ar}"` : "الفائز";
        toast.info(`موقع المحل ${storeLabel} غير محدد بعد على الخريطة`, {
          description: "أضأنا كل المحلات المتاحة لتختار منها بسهولة.",
          duration: 6000,
        });
      }
    } else {
      const mapCat = resolveMapCategory(store?.category ?? null);
      if (mapCat) {
        const matchingIds = new Set(allMallUnits.filter((u) => u.category === mapCat && u.status === "occupied").map((u) => u.id));
        setHighlightedUnitIds(matchingIds);
        setCategoryFilter(mapCat);
        setActiveRewardCtx({ prizeName, isCategory: true });
      } else {
        const occupiedIds = new Set(mallFloors.flatMap((f) => f.units.filter((u) => u.status === "occupied").map((u) => u.id)));
        setHighlightedUnitIds(occupiedIds);
        setActiveRewardCtx({ prizeName, isCategory: true });
        toast.info("لم نحدّد محلاً واحداً لهذه المكافأة", {
          description: "أضأنا كل المحلات المتاحة لتختار منها بسهولة.",
          duration: 6000,
        });
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

  // `activeUnit` is provided by useSelectionByFloor and is automatically scoped
  // to the currently visible floor — no extra derivation needed here.

  // Keep selection in sync with filters: drop selection on the current floor
  // when it has been filtered out by the user.
  useEffect(() => {
    if (activeUnit && mutedUnitIds.has(activeUnit.id)) {
      clearFloorSelection(selectedFloor);
    }
  }, [mutedUnitIds, activeUnit, selectedFloor, clearFloorSelection]);

  // Close the mobile full-details sheet whenever the active unit clears
  // (e.g. user taps × on the compact UnitInfoDrawer or switches floors).
  useEffect(() => {
    if (!activeUnit) setDetailsSheetOpen(false);
  }, [activeUnit]);

  const floorAvailable = floor.units.filter((u) => u.status === "available").length;
  const floorOccupied = floor.units.filter((u) => u.status === "occupied").length;
  const floorComingSoon = floor.units.filter((u) => u.status === "coming_soon").length;

  const handleFloorChange = (id: MallFloorId) => { setSelectedFloor(id); setMapLoaded(false); localStorage.setItem("map-selected-floor", id); };

  return (
    <MainLayout>
      <SEOHead
        title="خريطة مول البستان التفاعلية — تصفح المحلات والطوابق"
        titleEn="Mall Elbostan Interactive Map — Browse Stores & Floors"
        description="استخدم خريطة مول البستان التفاعلية لتصفح المحلات على 3 أدوار. اعثر على محلات الكمبيوتر، الموبايلات، الجيمنج، والوحدات المتاحة للتأجير في التجمع الخامس، القاهرة."
        descriptionEn="Use Mall Elbostan's interactive map to browse stores across 3 floors. Find computer, mobile, gaming shops and available units in New Cairo."
        keywords="خريطة مول البستان, دليل الطوابق, وحدات تجارية, محلات كمبيوتر, محلات موبايلات, القاهرة الجديدة, interactive mall map"
        breadcrumbs={[{ name: "الخريطة", url: "/map" }]}
        jsonLd={[
          buildMapLd({ name: "خريطة مول البستان التفاعلية", url: "/map" }),
          buildPlaceLd({ name: "مول البستان", url: "/map", latitude: 30.03, longitude: 31.46 }),
          buildSpeakableLd(["h1"]),
        ]}
      />

      {/* ═══════════ HERO (compact, single-row) ═══════════ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(165deg, #071326 0%, #0B1B34 50%, #0D1F3C 100%)" }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-3 py-2.5 md:py-3.5">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="min-w-0 flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: "#ffffff08", border: "1px solid #ffffff14" }}>
                <Compass className="h-3.5 w-3.5" style={{ color: "#CDBB9A" }} />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-[0.95rem] font-bold leading-tight md:text-[1.05rem]" style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}>
                  الخريطة التفاعلية
                </h1>
                <p className="truncate text-[0.62rem] font-medium md:text-[0.66rem]" style={{ color: "#7C8BA1" }}>
                  تنقّل بين الأدوار وحدد الوحدات
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
                        className="flex items-center gap-1.5 shrink-0">
              {[
                { v: `${mallFloors.length}`, l: "أدوار", color: "#F8FAFC" },
                { v: `${allMallUnits.length}`, l: "وحدة", color: "#F8FAFC" },
                { v: `${availableMallUnits.length}`, l: "متاحة", color: "#F97316" },
              ].map((s) => (
                <div key={s.l} className="flex items-baseline gap-1 rounded-md px-2 py-1"
                     style={{ background: "#ffffff06", border: "1px solid #ffffff0D" }}>
                  <span className="font-poppins text-[0.78rem] font-extrabold leading-none" style={{ color: s.color }}>{s.v}</span>
                  <span className="text-[0.55rem] font-semibold" style={{ color: "#7C8BA1" }}>{s.l}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 10%, #2D6BFF20, transparent 90%)" }} />
      </section>

      {/* ═══════════ CONTROL BAR ═══════════ */}
      {(() => {
        const activeFiltersCount =
          (searchTerm.trim() ? 1 : 0) +
          (categoryFilter !== "all" ? 1 : 0) +
          (statusFilter !== "all" ? 1 : 0) +
          (availableOnly ? 1 : 0);
        return (
          <section className="sticky top-[56px] z-30 border-b border-border bg-card/[0.97] backdrop-blur-xl md:top-[64px] xl:top-[68px]"
                   style={{ boxShadow: "0 1px 4px hsl(var(--foreground) / 0.05), 0 4px 16px hsl(var(--foreground) / 0.02)" }}>
            <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
              {/* Mobile compact row */}
              <div className="flex items-center justify-between gap-2 py-1.5 md:hidden">
                <FloorTabs selected={selectedFloor} onChange={handleFloorChange} />
                <Sheet>
                  <SheetTrigger asChild>
                    <button
                      className="relative flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-[0.74rem] font-bold text-foreground"
                      aria-label="فلترة وبحث"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>فلترة</span>
                      {activeFiltersCount > 0 && (
                        <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-poppins text-[0.6rem] font-bold text-primary-foreground">
                          {activeFiltersCount}
                        </span>
                      )}
                    </button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="rounded-t-2xl">
                    <SheetHeader>
                      <SheetTitle className="text-right text-[0.95rem] font-bold light-heading">فلترة وبحث</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
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
                    <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      <MapLegend
                        activeStatus={availableOnly ? "available" : statusFilter}
                        onStatusChange={(s) => { setAvailableOnly(false); setStatusFilter(s); }}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop full bar */}
              <div className="hidden flex-wrap items-center justify-between gap-2 py-2.5 md:flex">
                <FloorTabs selected={selectedFloor} onChange={handleFloorChange} />
                <div className="flex items-center gap-3">
                  <MapLegend
                    activeStatus={availableOnly ? "available" : statusFilter}
                    onStatusChange={(s) => { setAvailableOnly(false); setStatusFilter(s); }}
                  />
                  <div className="hidden items-center gap-2 rounded-xl px-3.5 py-2 text-[0.7rem] md:flex bg-muted/50 border border-border">
                    <span className="font-bold text-foreground">{floor.units.length}</span>
                    <span className="text-muted-foreground">وحدة</span>
                    <span className="h-3.5 w-px bg-border" />
                    <span className="font-bold" style={{ color: "hsl(25 95% 50%)" }}>{floorAvailable}</span>
                    <span className="text-muted-foreground">متاحة</span>
                    {floorComingSoon > 0 && (
                      <>
                        <span className="h-3.5 w-px bg-border" />
                        <span className="font-bold" style={{ color: "hsl(190 85% 40%)" }}>{floorComingSoon}</span>
                        <span className="text-muted-foreground">قريباً</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden pb-2.5 md:block">
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
        );
      })()}

      {/* ═══════════ MAP + DETAILS PANEL ═══════════ */}
      <section className="py-3 md:py-4 bg-secondary dark:bg-background">
        <div className="mx-auto w-full max-w-[1440px] px-3 md:px-6 lg:px-10">
          <div className="grid gap-3 lg:grid-cols-[1fr_340px] lg:items-start">
            <div
              ref={mapRef}
              className={`relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 ${
                isFullscreen
                  ? "fixed inset-0 z-50 rounded-none border-0"
                  : "aspect-square min-h-[260px] max-w-full max-h-[min(calc(100vh-160px),720px)] lg:max-h-[calc(100vh-220px)] mx-auto w-full"
              }`}
            >
              {/* Fullscreen toggle */}
              <button
                onClick={() => setIsFullscreen((p) => !p)}
                className="absolute top-3 end-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/90 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors shadow-sm"
                aria-label={isFullscreen ? "إغلاق الشاشة الكاملة" : "شاشة كاملة"}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              {/* Loading skeleton */}
              {!mapLoaded && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-card rounded-2xl">
                  <div className="relative w-3/4 aspect-square max-w-[320px]">
                    <Skeleton className="absolute inset-0 rounded-xl" />
                    <Skeleton className="absolute top-[15%] start-[10%] h-[30%] w-[35%] rounded-lg" />
                    <Skeleton className="absolute top-[15%] end-[10%] h-[30%] w-[35%] rounded-lg" />
                    <Skeleton className="absolute bottom-[15%] start-[10%] h-[30%] w-[35%] rounded-lg" />
                    <Skeleton className="absolute bottom-[15%] end-[10%] h-[30%] w-[35%] rounded-lg" />
                    <Skeleton className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[25%] w-[25%] rounded-full" />
                  </div>
                  <p className="text-[0.78rem] font-semibold text-muted-foreground animate-pulse">جاري تحميل الخريطة...</p>
                </div>
              )}

              <MapErrorBoundary>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedFloor}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: mapLoaded ? 1 : 0, scale: mapLoaded ? 1 : 0.97 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full"
                  >
                    <MallFloorMap
                      floor={floor}
                      selectedUnitId={activeUnit?.id ?? null}
                      mutedUnitIds={mutedUnitIds}
                      onSelectUnit={setSelectedUnit}
                      onAtriumClick={handleAtriumClick}
                      atriumConfig={atriumConfig}
                      highlightedUnitIds={highlightedUnitIds}
                      activeMarkerUnitId={activeUnit?.id ?? null}
                      floorLabel={floorLabelsAr[selectedFloor]}
                      onClearSelection={() => setSelectedUnit(null)}
                      className={isFullscreen ? "min-h-screen" : undefined}
                    />
                  </motion.div>
                </AnimatePresence>
              </MapErrorBoundary>

              {/* Quick preview panel — appears in-map on desktop without leaving the map */}
              {!isMobile && (
                <MapQuickPreview
                  unit={activeUnit}
                  onClose={() => setSelectedUnit(null)}
                  onExpand={() => {
                    document.getElementById("unit-details-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                />
              )}

              {/* Compact unit info drawer — mobile-only bottom bar with name, status,
                  offers count and a clear button to deselect/return to overview. */}
              {isMobile && (
                <UnitInfoDrawer
                  unit={activeUnit}
                  offersBySlug={offersBySlug}
                  onClear={() => setSelectedUnit(null)}
                  onViewDetails={() => setDetailsSheetOpen(true)}
                />
              )}
            </div>

            {!isMobile && (
              <aside className="lg:sticky lg:top-[120px] space-y-3">
                <div id="unit-details-anchor" className="scroll-mt-[120px]">
                  <UnitDetailsCard unit={activeUnit} rewardContext={activeRewardCtx} />
                </div>

                {/* Floor summary card — enhanced */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/50">
                    <div className="h-[3px] w-4 rounded-full bg-primary" />
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      {floorLabelsAr[selectedFloor]}
                    </p>
                  </div>
                  <div className="p-3">
                     <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { v: floorOccupied, l: "مشغولة", colorClass: "text-foreground", bgClass: "bg-muted/50 border border-border" },
                        { v: floorAvailable, l: "متاحة", colorClass: "text-[hsl(25_95%_45%)] dark:text-[hsl(25_95%_65%)]", bgClass: "bg-[hsl(35_100%_97%)] dark:bg-[hsl(25_50%_15%)] border border-[hsl(25_95%_55%/0.2)]" },
                        { v: floorComingSoon, l: "قريباً", colorClass: "text-[hsl(190_85%_35%)] dark:text-[hsl(190_85%_55%)]", bgClass: "bg-[hsl(190_50%_96%)] dark:bg-[hsl(190_50%_15%)] border border-[hsl(190_85%_40%/0.2)]" },
                      ].map((s) => (
                        <div key={s.l} className={`rounded-lg py-3 transition-all ${s.bgClass}`}>
                          <p className={`font-poppins text-[1.1rem] font-extrabold ${s.colorClass}`}>{s.v}</p>
                          <p className="mt-0.5 text-[0.54rem] font-semibold text-muted-foreground">{s.l}</p>
                        </div>
                      ))}
                    </div>

                    {/* Quick CTA */}
                    <Link to="/leasing" className="mt-2.5 flex items-center justify-between rounded-lg px-3 py-2 transition-all hover:shadow-sm bg-orange/5 dark:bg-orange/10 border border-orange/15">
                      <span className="text-[0.72rem] font-bold text-orange dark:text-orange-foreground">استفسر عن وحدة متاحة</span>
                      <ChevronLeft className="h-3.5 w-3.5 text-orange dark:text-orange-foreground" />
                    </Link>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ AVAILABLE UNITS GRID ═══════════ */}
      <section className="border-t border-border bg-background py-6 md:py-8">
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="font-poppins text-[0.6rem] font-bold uppercase tracking-[0.25em]"
                    style={{ color: "hsl(25 85% 45%)" }}>Available Units</span>
              <h2 className="mt-2 text-[1.15rem] font-bold leading-tight md:text-[1.3rem] text-foreground"
                  style={{ fontFamily: "var(--font-arabic-display)" }}>
                {floorLabelsAr[selectedFloor]} — {floorAvailable} وحدة متاحة
              </h2>
            </div>
            <Link to="/leasing">
              <Button variant="orange" size="sm" className="h-11 rounded-xl px-7 text-[0.8rem] font-bold shadow-sm">
                <Phone className="ml-1.5 h-3.5 w-3.5" /> استفسر الآن
              </Button>
            </Link>
          </div>

          {filteredUnits.filter((u) => u.status === "available").length > 0 ? (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}
                        className={`grid gap-3 ${
                          filteredUnits.filter((u) => u.status === "available").length <= 3
                            ? "sm:grid-cols-2 lg:grid-cols-3 max-w-[860px] mx-auto"
                            : "sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
                        }`}>
              {filteredUnits.filter((u) => u.status === "available").map((unit) => (
                <motion.button
                  key={unit.id}
                  variants={fadeUp}
                  onClick={() => { setSelectedUnit(unit); mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
                  className={`group min-h-[130px] rounded-xl border p-4 text-right transition-all duration-200 ${
                    activeUnit?.id === unit.id
                      ? "border-orange-400 shadow-[0_0_0_1px_hsl(25_95%_55%/0.3)]"
                      : "border-border bg-card hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/5"
                  }`}
                  style={activeUnit?.id === unit.id ? { background: "hsl(35 100% 97%)" } : {}}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[0.88rem] font-bold text-foreground">{unit.code}</p>
                    <span className="flex items-center gap-1 text-[0.68rem] font-bold" style={{ color: "hsl(25 85% 40%)" }}>
                      <Ruler className="h-3 w-3" />
                      {unit.area} م²
                    </span>
                  </div>
                  <p className="mt-2 text-[0.7rem] font-medium text-muted-foreground">{floorLabelsAr[unit.floor]}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.6rem] font-bold"
                          style={{ background: "hsl(35 100% 95%)", color: "hsl(25 85% 40%)", border: "1px solid hsl(25 95% 55% / 0.2)" }}>
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: "hsl(25 95% 55%)" }} />
                      متاحة
                    </span>
                    <ArrowUpLeft className="h-3.5 w-3.5 text-muted-foreground/30 transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
              <Compass className="mx-auto mb-3 h-7 w-7 text-muted-foreground/30" />
              <p className="text-[0.84rem] font-semibold text-muted-foreground">لا توجد وحدات متاحة ضمن الفلاتر الحالية.</p>
              <p className="mt-1 text-[0.72rem] text-muted-foreground/70">جرّب تغيير الفلاتر أو اختيار دور آخر</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ COMMERCIAL OPPORTUNITY ═══════════ */}
      <section className="border-t border-border bg-secondary py-6 md:py-8 dark:bg-background">
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
                        className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3"
                     style={{ background: "hsl(var(--primary) / 0.06)", border: "1px solid hsl(var(--primary) / 0.12)" }}>
                  <TrendingUp className="h-3 w-3 text-primary" />
                  <span className="font-poppins text-[0.6rem] font-bold uppercase tracking-[0.25em] text-primary">
                    Commercial Leasing
                  </span>
                </div>
                <h2 className="text-[1.2rem] font-bold leading-tight md:text-[1.45rem] text-foreground"
                    style={{ fontFamily: "var(--font-arabic-display)" }}>
                  وحدتك في موقع مُثبت.
                </h2>
              </div>
              <p className="text-[0.88rem] leading-[1.85] max-w-[30rem] text-muted-foreground">
                وحدات متعددة المساحات — في مكان يعرفه السوق ويقصده. موقع استراتيجي في قلب القاهرة الجديدة.
              </p>

              {/* Floor availability cards */}
              <div className="grid grid-cols-3 gap-3">
                {mallFloors.map((f) => {
                  const avail = f.units.filter((u) => u.status === "available").length;
                  return (
                    <div key={f.id} className="flex min-h-[110px] flex-col items-center justify-center rounded-xl border border-border bg-card px-4 py-4 text-center transition-all hover:shadow-md hover:border-primary/20">
                      <p className="font-poppins text-[1.35rem] font-extrabold text-foreground">{avail}</p>
                      <p className="mt-1 text-[0.68rem] font-semibold text-muted-foreground">{f.label}</p>
                      <div className="mx-auto mt-2 h-1 w-8 rounded-full" style={{ background: avail > 0 ? "hsl(25 95% 55%)" : "hsl(220 20% 88%)" }} />
                    </div>
                  );
                })}
              </div>

              {/* Value props */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: MapPin, label: "موقع مقصود", desc: "قلب المنطقة التجارية" },
                  { icon: Users, label: "جمهور بنيّة شراء", desc: "عملاء مستهدفون يومياً" },
                  { icon: TrendingUp, label: "طلب متنامٍ", desc: "سوق التكنولوجيا ينمو" },
                  { icon: Layers, label: "تصنيف دقيق", desc: "كل دور بتخصصه" },
                ].map((p) => (
                  <div key={p.label} className="flex min-h-[72px] items-start gap-3 rounded-xl border border-border bg-card px-4 py-3.5 transition-all hover:border-primary/20 hover:shadow-sm">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: "hsl(var(--primary) / 0.08)" }}>
                      <p.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="text-[0.82rem] font-bold text-foreground">{p.label}</span>
                      <p className="mt-0.5 text-[0.66rem] text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/leasing">
                  <Button variant="orange" className="h-11 rounded-xl px-7 font-bold text-[0.84rem] shadow-md shadow-orange-500/15">
                    <Phone className="ml-2 h-4 w-4" />
                    استفسار التأجير
                  </Button>
                </Link>
                <Link to="/stores">
                  <Button variant="outline-blue" className="h-11 rounded-xl px-7 text-[0.84rem] font-bold">
                    تصفّح المتاجر
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Featured available units */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45, delay: 0.1 }}
                        className="space-y-3 rounded-2xl border border-border bg-muted/30 p-4 dark:bg-card/50">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-[3px] w-5 rounded-full" style={{ background: "hsl(25 95% 55%)" }} />
                <p className="font-poppins text-[0.6rem] font-bold tracking-[0.25em] uppercase text-muted-foreground">Featured Units</p>
              </div>
              {availableMallUnits.slice(0, 3).map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => { setSelectedFloor(unit.floor); setSelectedUnit(unit); mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
                  className="group flex w-full flex-col rounded-xl border border-border bg-card p-5 text-right transition-all duration-200 hover:border-orange-300/40 hover:shadow-lg hover:shadow-orange-500/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.95rem] font-bold text-foreground">وحدة {unit.code}</p>
                      <p className="mt-0.5 text-[0.78rem] text-muted-foreground">{unit.category ?? ""}</p>
                    </div>
                    <span className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[0.66rem] font-bold"
                          style={{ background: "hsl(35 100% 95%)", color: "hsl(25 85% 40%)", border: "1px solid hsl(25 95% 55% / 0.2)" }}>
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: "hsl(25 95% 55%)" }} />
                      متاحة
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg py-2.5 px-3 bg-muted/50">
                      <p className="text-[0.62rem] text-muted-foreground">الدور</p>
                      <p className="mt-0.5 text-[0.88rem] font-bold text-foreground">{floorLabelsAr[unit.floor]}</p>
                    </div>
                    <div className="rounded-lg py-2.5 px-3 bg-muted/50">
                      <p className="text-[0.62rem] text-muted-foreground">المساحة</p>
                      <p className="mt-0.5 text-[0.88rem] font-bold text-foreground">{unit.area} م²</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[0.68rem] font-semibold text-muted-foreground/60">اضغط لعرض الموقع على الخريطة</span>
                    <ArrowUpLeft className="h-3.5 w-3.5 text-muted-foreground/30 transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
                  </div>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ SEO LANDING SECTION ═══════════ */}
      <section className="border-t border-border bg-background py-6 md:py-8">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-14">
          <div className="mb-8 text-center">
            <span className="font-poppins text-[0.6rem] font-bold uppercase tracking-[0.25em] text-primary/80">Floor Directory</span>
            <h2
              className="mt-2 text-[1.25rem] font-bold leading-[1.2] md:text-[1.55rem] text-foreground"
              style={{ fontFamily: "var(--font-arabic-display)" }}
            >
              دليل مول البستان — محلات تكنولوجيا وإلكترونيات في القاهرة الجديدة
            </h2>
            <p className="mx-auto mt-3 max-w-[640px] text-[0.82rem] leading-[1.9] text-muted-foreground">
              يضم مول البستان أكثر من {allMallUnits.length} وحدة تجارية متخصصة في
              الهواتف والإكسسوارات، أجهزة الكمبيوتر واللاب توب، قطع الغيار
              والصيانة، الشبكات وأنظمة الأمان — موزّعة على {mallFloors.length} أدوار
              في قلب التجمع الخامس بالقاهرة الجديدة.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mallFloors.map((f) => {
              const flAvail = f.units.filter((u) => u.status === "available").length;
              const flOccupied = f.units.filter((u) => u.status === "occupied").length;
              const categories = [...new Set(f.units.map((u) => u.category))];
              const floorNameMap: Record<string, string> = {
                ground: "الدور الأرضي",
                first: "الدور الأول",
                second: "الدور الثاني",
              };
              const floorDescMap: Record<string, string> = {
                ground:
                  "يضم الدور الأرضي محلات الهواتف والإكسسوارات ومراكز الصيانة المعتمدة — الوجهة الأولى لزوار المول.",
                first:
                  "الدور الأول مخصص لأجهزة الكمبيوتر واللاب توب وملحقاتها، مع وحدات متنوعة المساحات تناسب التجار والموزعين.",
                second:
                  "يحتضن الدور الثاني محلات الشبكات وأنظمة المراقبة والأمان، إضافة إلى وحدات تجارية متاحة للتأجير.",
              };
              const categoryLabelsAr: Record<string, string> = {
                Accessories: "إكسسوارات",
                Laptops: "لاب توب وكمبيوتر",
                Components: "قطع غيار",
                Networking: "شبكات",
                Maintenance: "صيانة",
                "Security Systems": "أنظمة أمان",
              };
              const floorIcons: Record<string, typeof Layers> = {
                ground: MapPin,
                first: Layers,
                second: Building2,
              };
              const FloorIcon = floorIcons[f.id] ?? Layers;

              return (
                <article
                  key={f.id}
                  className="flex min-h-[240px] flex-col rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/15"
                >
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "hsl(var(--primary) / 0.08)" }}>
                      <FloorIcon className="h-4 w-4 text-primary" />
                    </div>
                    <h3
                      className="text-[1rem] font-bold text-foreground md:text-[1.1rem]"
                      style={{ fontFamily: "var(--font-arabic-display)" }}
                    >
                      {floorNameMap[f.id] ?? floorLabelsAr[f.id]} — {f.units.length} وحدة
                    </h3>
                  </div>
                  <p className="text-[0.78rem] leading-[1.85] text-muted-foreground">
                    {floorDescMap[f.id] ?? ""}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-[0.68rem]">
                    <span className="rounded-full bg-primary/5 px-2.5 py-1 font-bold text-primary">
                      {flOccupied} محل مؤجّر
                    </span>
                    {flAvail > 0 && (
                      <span
                        className="rounded-full px-2.5 py-1 font-bold"
                        style={{ background: "#F9731610", color: "#E8740E" }}
                      >
                        {flAvail} وحدة متاحة
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <span
                        key={cat}
                        className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-[0.62rem] text-muted-foreground"
                      >
                        {categoryLabelsAr[cat] ?? cat}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 flex flex-wrap gap-3 text-[0.74rem]">
                    <Link to="/stores" className="font-bold text-primary hover:underline">
                      تصفّح المحلات
                    </Link>
                    {flAvail > 0 && (
                      <Link to="/leasing" className="font-bold hover:underline" style={{ color: "#E8740E" }}>
                        استفسر عن التأجير
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 max-w-[720px]">
            <h3
              className="text-[0.95rem] font-bold text-foreground"
              style={{ fontFamily: "var(--font-arabic-display)" }}
            >
              لماذا مول البستان؟
            </h3>
            <p className="mt-2 text-[0.78rem] leading-[1.95] text-muted-foreground">
              مول البستان هو أحدث مراكز التكنولوجيا في القاهرة الجديدة، يقع في
              موقع استراتيجي يخدم سكان التجمع الخامس والرحاب ومدينتي. يوفّر
              المول تجربة تسوّق متكاملة تشمل محلات الهواتف الذكية، أجهزة
              الكمبيوتر المحمولة، قطع غيار الحاسب، معدات الشبكات، كاميرات
              المراقبة وأنظمة الحماية، ومراكز الصيانة المتخصصة. بإجمالي{" "}
              {allMallUnits.length} وحدة تجارية وأكثر من{" "}
              {availableMallUnits.length} وحدة متاحة للتأجير، يُعدّ المول فرصة
              استثمارية مميزة لتجار التجزئة والموزعين في قطاع التكنولوجيا.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link to="/stores">
                <Button variant="outline" size="sm" className="h-9 rounded-lg text-[0.72rem]">
                  <MapPin className="ml-1.5 h-3 w-3" /> دليل المحلات
                </Button>
              </Link>
              <Link to="/leasing">
                <Button variant="outline" size="sm" className="h-9 rounded-lg text-[0.72rem]">
                  <Building2 className="ml-1.5 h-3 w-3" /> فرص التأجير
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="sm" className="h-9 rounded-lg text-[0.72rem]">
                  <Compass className="ml-1.5 h-3 w-3" /> عن المول
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="relative overflow-hidden py-7 md:py-10" style={{ background: "var(--gradient-hero)" }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full opacity-[0.05]"
               style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 65%)" }} />
          <div className="absolute bottom-0 right-0 h-[200px] w-[300px] rounded-full opacity-[0.04]"
               style={{ background: "radial-gradient(circle, hsl(25 95% 55%), transparent 70%)" }} />
        </div>
        <div className="relative mx-auto max-w-[640px] px-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4"
               style={{ background: "hsl(0 0% 100% / 0.05)", border: "1px solid hsl(0 0% 100% / 0.1)" }}>
            <Building2 className="h-3 w-3" style={{ color: "hsl(220 15% 55%)" }} />
            <span className="font-poppins text-[0.6rem] font-bold tracking-[0.25em] uppercase" style={{ color: "hsl(220 15% 55%)" }}>
              Commercial Leasing
            </span>
          </div>
          <h2 className="text-[1.15rem] font-bold md:text-[1.4rem]"
              style={{ color: "hsl(0 0% 97%)", fontFamily: "var(--font-arabic-display)" }}>
            تبحث عن وحدة تجارية في موقع فعّال؟
          </h2>
          <p className="mx-auto mt-3 max-w-[360px] text-[0.84rem] leading-relaxed" style={{ color: "hsl(220 15% 60%)" }}>
            وحدات متنوعة المساحات في قلب القاهرة الجديدة — ابدأ بالاستفسار الآن
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/leasing">
              <Button variant="orange" className="h-11 rounded-xl px-8 text-[0.84rem] font-bold shadow-lg shadow-orange-500/20">
                <Phone className="ml-2 h-4 w-4" /> استفسار التأجير
              </Button>
            </Link>
            <Link to="/stores">
              <Button className="h-11 rounded-xl px-8 text-[0.84rem] font-bold transition-all"
                      style={{ background: "hsl(0 0% 100% / 0.06)", border: "1px solid hsl(0 0% 100% / 0.12)", color: "hsl(220 20% 80%)" }}>
                تصفّح المتاجر
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ MERCHANT LOGO WALL ═══════════ */}
      <MerchantLogoWall />

      {/* ── Mobile full-details drawer ── opens via the compact UnitInfoDrawer's
          "تفاصيل" button so selecting a unit no longer auto-pops a heavy sheet. */}
      <Drawer
        open={isMobile && !!activeUnit && detailsSheetOpen}
        onOpenChange={(open) => setDetailsSheetOpen(open)}
      >
        <DrawerContent className="max-h-[85vh] rounded-t-2xl border-border bg-card">
          <DrawerHeader className="border-b border-border text-right">
            <DrawerTitle>{activeUnit ? `وحدة ${activeUnit.code}` : "تفاصيل الوحدة"}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto p-3">
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
        onViewOnMap={(unitCode: string) => {
          const targetUnit = allMallUnits.find((u) => u.code === unitCode);
          if (targetUnit) {
            setSelectedFloor(targetUnit.floor);
            setSelectedUnit(targetUnit);
            setHighlightedUnitIds(new Set([targetUnit.id]));
            scrollToMap();
          } else {
            toast.warning("لم نتمكن من تحديد موقع المحل على الخريطة", {
              description: "ربما لم يُحدَّث موقعه بعد — تصفّح الخريطة لاكتشاف المحلات المتاحة.",
              duration: 6000,
            });
            scrollToMap();
          }
        }}
      />

      {/* ═══════════ MAP SEO CONTENT ═══════════ */}
      <section className="bg-card dark:bg-background border-t border-border/30" style={{ paddingTop: "clamp(24px, 3vw, 40px)", paddingBottom: "clamp(24px, 3vw, 40px)" }}>
        <div className="container max-w-4xl">
          <h2 className="text-[0.92rem] font-bold text-foreground mb-3" style={{ fontFamily: "var(--font-arabic-display)" }}>
            تصفّح خريطة مول البستان
          </h2>
          <div className="text-[0.76rem] leading-[2.1] text-muted-foreground space-y-3">
            <p>
              خريطة مول البستان التفاعلية تتيح لك تصفّح المحلات على 3 أدوار في المول — اعثر على الوحدة المناسبة بسهولة.
            </p>

            <div className="space-y-1.5">
              <p>
                <Link to="/stores?category=الكمبيوتر والأجهزة" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("map_seo", "category", "الكمبيوتر واللابتوبات", "/stores?category=الكمبيوتر والأجهزة")}>محلات الكمبيوتر واللابتوبات</Link>
                <span className="text-muted-foreground/50 mx-1">—</span>
                <Link to="/stores/2b" className="hover:underline" onClick={() => trackSeoLinkClick("map_seo", "store", "2B", "/stores/2b")}>2B</Link>
                <span className="text-muted-foreground/40 mx-1">•</span>
                <Link to="/stores/egypt-laptop" className="hover:underline" onClick={() => trackSeoLinkClick("map_seo", "store", "Egypt Laptop", "/stores/egypt-laptop")}>Egypt Laptop</Link>
                <span className="text-muted-foreground/40 mx-1">•</span>
                <Link to="/stores/digital-plus" className="hover:underline" onClick={() => trackSeoLinkClick("map_seo", "store", "Digital Plus", "/stores/digital-plus")}>Digital Plus</Link>
                <span className="text-muted-foreground/40 mx-1">•</span>
                <Link to="/stores/kasr-zero" className="hover:underline" onClick={() => trackSeoLinkClick("map_seo", "store", "كسر زيرو", "/stores/kasr-zero")}>كسر زيرو</Link>
              </p>
              <p>
                <Link to="/stores?category=الهواتف والإكسسوارات" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("map_seo", "category", "الموبايلات والإكسسوارات", "/stores?category=الهواتف والإكسسوارات")}>محلات الموبايلات والإكسسوارات</Link>
                <span className="text-muted-foreground/50 mx-1">—</span>
                <Link to="/stores/hk" className="hover:underline" onClick={() => trackSeoLinkClick("map_seo", "store", "HK", "/stores/hk")}>HK</Link>
                <span className="text-muted-foreground/40 mx-1">•</span>
                <Link to="/stores/ics" className="hover:underline" onClick={() => trackSeoLinkClick("map_seo", "store", "Infinity Computer Services / ICS", "/stores/ics")}>Infinity Computer Services / ICS</Link>
                <span className="text-muted-foreground/40 mx-1">•</span>
                <Link to="/stores/static" className="hover:underline" onClick={() => trackSeoLinkClick("map_seo", "store", "ستاتيك", "/stores/static")}>ستاتيك</Link>
                <span className="text-muted-foreground/40 mx-1">•</span>
                <Link to="/stores/sharaf" className="hover:underline" onClick={() => trackSeoLinkClick("map_seo", "store", "شرف", "/stores/sharaf")}>شرف</Link>
              </p>
              <p>
                <Link to="/stores?category=الألعاب والترفيه" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("map_seo", "category", "الجيمنج والألعاب", "/stores?category=الألعاب والترفيه")}>محلات الجيمنج والألعاب</Link>
                <span className="text-muted-foreground/50 mx-1">—</span>
                <Link to="/stores/games-to-egypt" className="hover:underline" onClick={() => trackSeoLinkClick("map_seo", "store", "Games to Egypt", "/stores/games-to-egypt")}>Games to Egypt</Link>
              </p>
              <p>
                <Link to="/stores?category=الصيانة والدعم الفني" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("map_seo", "category", "الصيانة والدعم الفني", "/stores?category=الصيانة والدعم الفني")}>مراكز الصيانة والدعم الفني</Link>
                <span className="text-muted-foreground/40 mx-1">•</span>
                <Link to="/stores?category=الشبكات والأنظمة الأمنية" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("map_seo", "category", "الشبكات والأمن", "/stores?category=الشبكات والأنظمة الأمنية")}>حلول الشبكات والأمن</Link>
                <span className="text-muted-foreground/40 mx-1">•</span>
                <Link to="/stores?category=الطباعة والتصوير" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("map_seo", "category", "الطباعة والتصوير", "/stores?category=الطباعة والتصوير")}>الطباعة والتصوير</Link>
              </p>
            </div>

            <p>
              الوحدات المتاحة للتأجير معروضة باللون البرتقالي.{" "}
              <Link to="/leasing" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("map_seo", "page", "التأجير", "/leasing")}>استفسر عن التأجير</Link>
              <span className="text-muted-foreground/40 mx-1">•</span>
              <Link to="/stores" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("map_seo", "page", "دليل المحلات", "/stores")}>تصفّح دليل المحلات الكامل</Link>
              <span className="text-muted-foreground/40 mx-1">•</span>
              <Link to="/about" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("map_seo", "page", "عن المول", "/about")}>عن المول</Link>
              <span className="text-muted-foreground/40 mx-1">•</span>
              <Link to="/contact" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("map_seo", "page", "التواصل", "/contact")}>التواصل معنا</Link>.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default InteractiveMap;
