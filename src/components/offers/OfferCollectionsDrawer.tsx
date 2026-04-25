import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Scale, Trash2, ArrowLeft, Tag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TenantLogo } from "@/components/TenantLogo";
import { OpeningOfferCard, type OpeningOfferRecord } from "./OpeningOfferCard";
import { useOfferCollections, COMPARE_MAX } from "@/hooks/useOfferCollections";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** All offers available in the page; used to resolve saved IDs to records. */
  offers: OpeningOfferRecord[];
};

function formatPrice(value?: number | null, currency = "EGP") {
  if (typeof value !== "number") return "—";
  if (currency === "EGP") return `${value.toLocaleString("ar-EG")} ج.م`;
  return `${value.toLocaleString("ar-EG")} ${currency}`;
}

function discountPct(o: OpeningOfferRecord) {
  const cur = Number(o.price_current ?? 0);
  const old = Number(o.price_old ?? 0);
  if (!cur || !old || old <= cur) return 0;
  return Math.round(((old - cur) / old) * 100);
}

export function OfferCollectionsDrawer({ open, onOpenChange, offers }: Props) {
  const { favorites, compare, clearFavorites, clearCompare, toggleCompare, toggleFavorite } = useOfferCollections();

  const byId = useMemo(() => {
    const m = new Map<string, OpeningOfferRecord>();
    offers.forEach((o) => m.set(o.id, o));
    return m;
  }, [offers]);

  const favoriteOffers = favorites.map((id) => byId.get(id)).filter((o): o is OpeningOfferRecord => !!o);
  const compareOffers = compare.map((id) => byId.get(id)).filter((o): o is OpeningOfferRecord => !!o);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl overflow-y-auto" dir="rtl">
        <SheetHeader className="text-right">
          <SheetTitle className="flex items-center gap-2 text-[1.05rem]">
            <Heart className="h-4 w-4 text-rose-500" />
            عروضي المحفوظة
          </SheetTitle>
          <SheetDescription className="text-[0.78rem]">
            احفظ العروض المهمة وقارن بينها بسهولة. تُحفظ على هذا الجهاز فقط.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="favorites" className="mt-4" dir="rtl">
          <TabsList className="w-full">
            <TabsTrigger value="favorites" className="flex-1 gap-1.5">
              <Heart className="h-3.5 w-3.5" /> المفضلة ({favorites.length.toLocaleString("ar-EG")})
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex-1 gap-1.5">
              <Scale className="h-3.5 w-3.5" /> المقارنة ({compare.length.toLocaleString("ar-EG")}/{COMPARE_MAX})
            </TabsTrigger>
          </TabsList>

          {/* ── Favorites ── */}
          <TabsContent value="favorites" className="mt-4">
            {favoriteOffers.length === 0 ? (
              <EmptyState
                icon={<Heart className="h-5 w-5 text-rose-500" />}
                title="لا توجد عروض محفوظة"
                description="اضغط على أيقونة القلب في أي بطاقة عرض لحفظها هنا."
              />
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[0.74rem] text-muted-foreground">
                    {favoriteOffers.length.toLocaleString("ar-EG")} عرض محفوظ
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFavorites}
                    className="h-7 gap-1 text-[0.7rem] text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" /> مسح الكل
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {favoriteOffers.map((offer) => (
                    <OpeningOfferCard
                      key={offer.id}
                      offer={offer}
                      compact
                      showStoreLink={false}
                      showAllStoreOffersCta={false}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* ── Compare ── */}
          <TabsContent value="compare" className="mt-4">
            {compareOffers.length === 0 ? (
              <EmptyState
                icon={<Scale className="h-5 w-5 text-primary" />}
                title="لم تختر عروضًا للمقارنة"
                description={`اضغط على أيقونة الميزان في أي عرض لإضافته (حتى ${COMPARE_MAX} عروض).`}
              />
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[0.74rem] text-muted-foreground">
                    مقارنة {compareOffers.length.toLocaleString("ar-EG")} من {COMPARE_MAX}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCompare}
                    className="h-7 gap-1 text-[0.7rem] text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" /> مسح المقارنة
                  </Button>
                </div>
                <CompareTable
                  offers={compareOffers}
                  onRemove={(id) => toggleCompare(id)}
                  onToggleFav={(id) => toggleFavorite(id)}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm">{icon}</div>
      <p className="mt-3 text-[0.88rem] font-bold text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-[0.74rem] text-muted-foreground">{description}</p>
    </div>
  );
}

function CompareTable({
  offers,
  onRemove,
  onToggleFav,
}: {
  offers: OpeningOfferRecord[];
  onRemove: (id: string) => void;
  onToggleFav: (id: string) => void;
}) {
  const rows: { label: string; render: (o: OpeningOfferRecord) => React.ReactNode }[] = [
    { label: "العرض", render: (o) => <span className="font-bold text-foreground">{o.title_ar}</span> },
    { label: "السعر الحالي", render: (o) => <span className="font-bold text-primary">{formatPrice(o.price_current, o.currency ?? "EGP")}</span> },
    {
      label: "السعر القديم",
      render: (o) =>
        o.price_old ? <span className="text-muted-foreground line-through">{formatPrice(o.price_old, o.currency ?? "EGP")}</span> : "—",
    },
    {
      label: "الخصم",
      render: (o) => {
        const d = discountPct(o);
        return d > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange/10 px-2 py-0.5 text-[0.68rem] font-bold text-orange">
            <Tag className="h-3 w-3" /> {d}%
          </span>
        ) : (
          "—"
        );
      },
    },
    { label: "الماركة", render: (o) => o.brand ?? "—" },
    { label: "المواصفات", render: (o) => <span className="text-foreground/80">{o.specs_short_ar ?? "—"}</span> },
    { label: "الفئة", render: (o) => o.category ?? o.stores?.category ?? "—" },
    {
      label: "صلاحية العرض",
      render: (o) => (o.valid_to ? new Date(o.valid_to).toLocaleDateString("ar-EG") : "—"),
    },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card">
      <table className="w-full min-w-[520px] border-collapse text-right text-[0.76rem]">
        <thead>
          <tr className="border-b border-border/70 bg-muted/30">
            <th className="sticky right-0 z-10 w-32 bg-muted/30 px-3 py-2.5 text-[0.68rem] font-bold text-muted-foreground">
              المقارنة
            </th>
            {offers.map((o) => (
              <th key={o.id} className="min-w-[180px] border-s border-border/60 p-3 align-top">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    {o.stores ? (
                      <Link to={`/stores/${o.stores.slug}`} className="flex items-center gap-2 min-w-0">
                        <TenantLogo
                          src={o.stores.logo_url}
                          alt={o.stores.name_ar}
                          fallbackName={o.stores.name_ar}
                          size="xs"
                          rounded="md"
                        />
                        <span className="truncate text-[0.74rem] font-bold text-foreground">{o.stores.name_ar}</span>
                      </Link>
                    ) : (
                      <span className="text-[0.74rem] font-bold text-foreground">عرض</span>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemove(o.id)}
                      aria-label="إزالة من المقارنة"
                      className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleFav(o.id)}
                    className="inline-flex items-center justify-center gap-1 rounded-md border border-border/70 bg-background px-2 py-1 text-[0.62rem] font-semibold text-muted-foreground transition-colors hover:text-rose-500"
                  >
                    <Heart className="h-3 w-3" /> حفظ
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border/40 last:border-b-0 even:bg-muted/15">
              <th scope="row" className="sticky right-0 bg-card px-3 py-2 text-[0.7rem] font-semibold text-muted-foreground">
                {row.label}
              </th>
              {offers.map((o) => (
                <td key={o.id} className="border-s border-border/40 px-3 py-2 align-top">
                  {row.render(o)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row" className="sticky right-0 bg-card px-3 py-2 text-[0.7rem] font-semibold text-muted-foreground">
              صفحة المحل
            </th>
            {offers.map((o) => (
              <td key={o.id} className="border-s border-border/40 px-3 py-2">
                {o.stores ? (
                  <Link to={`/stores/${o.stores.slug}`}>
                    <Button variant="outline-blue" size="sm" className="h-7 gap-1 rounded-lg px-2.5 text-[0.66rem] font-bold">
                      زيارة <ArrowLeft className="h-3 w-3" />
                    </Button>
                  </Link>
                ) : (
                  "—"
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
