import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  MapPin,
  Navigation,
  Copy,
  ExternalLink,
  Car,
  Footprints,
  Bus,
  Locate,
  Check,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ── Types ── */
type RouteMode = "driving" | "walking" | "transit";

interface LocationLandmark {
  label: string;
  icon: LucideIcon;
}

interface LocationMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  address: string;
  branchName: string;
  subtitle?: string;
  plusCode?: string;
  landmarks: LocationLandmark[];
}

/* ── Presets ── */
export const NEW_CAIRO_LOCATION: LocationMapProps = {
  lat: 30.00688915799785,
  lng: 31.426935129305683,
  zoom: 15,
  address: "الحى الأول، مركز الخدمات، خلف محكمة القاهرة الجديدة، التجمع الخامس، القاهرة",
  branchName: "مول البستان - القاهرة الجديدة",
  subtitle: "التجمع الخامس — سهل الوصول من مدينتي والرحاب",
  plusCode: "2C4G+QQV, New Cairo 1, Cairo Governorate, Egypt",
  landmarks: [
    { label: "محكمة القاهرة الجديدة", icon: Landmark },
    { label: "مركز خدمات الحي الأول", icon: MapPin },
  ],
};

export const DOWNTOWN_LOCATION: LocationMapProps = {
  lat: 30.045817256198642,
  lng: 31.238619215432642,
  zoom: 15,
  address: "شارع البستان، وسط البلد، القاهرة، مصر",
  branchName: "مول البستان - وسط البلد",
  subtitle: "الفرع الأصلي منذ 1990 في قلب القاهرة",
  landmarks: [
    { label: "شارع البستان", icon: Landmark },
    { label: "وسط البلد", icon: MapPin },
  ],
};

/* ── Branch switcher config ── */
const branches = [
  { label: "القاهرة الجديدة", path: "/new-cairo-branch" },
  { label: "وسط البلد", path: "/downtown-branch" },
];

const routeModes: { mode: RouteMode; label: string; icon: LucideIcon }[] = [
  { mode: "driving", label: "سيارة", icon: Car },
  { mode: "walking", label: "مشي", icon: Footprints },
  { mode: "transit", label: "مواصلات", icon: Bus },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateEta(km: number, mode: RouteMode) {
  const speeds: Record<RouteMode, number> = { driving: 35, walking: 5, transit: 20 };
  const mins = Math.round((km / speeds[mode]) * 60);
  if (mins < 60) return `${mins} دقيقة`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} ساعة و ${m} دقيقة` : `${h} ساعة`;
}

function buildGoogleMapsUrl(lat: number, lng: number, mode: RouteMode, fromLat?: number, fromLng?: number) {
  const dest = `${lat},${lng}`;
  if (fromLat && fromLng) {
    const modeIdx = mode === "driving" ? "0" : mode === "walking" ? "2" : "3";
    return `https://www.google.com/maps/dir/${fromLat},${fromLng}/${dest}/@${lat},${lng},15z/data=!4m2!4m1!3e${modeIdx}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${dest}`;
}

function buildWazeUrl(lat: number, lng: number) {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

export function LocationMapSection(props: LocationMapProps) {
  const { lat, lng, zoom = 15, address, branchName, subtitle, plusCode, landmarks } = props;
  const location = useLocation();

  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [routeMode, setRouteMode] = useState<RouteMode>("driving");

  const distance = userPos ? haversineKm(userPos.lat, userPos.lng, lat, lng) : null;
  const eta = distance !== null ? estimateEta(distance, routeMode) : null;

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("المتصفح لا يدعم تحديد الموقع");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        toast.error("لم يتم السماح بتحديد الموقع");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    navigator.permissions?.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted") requestLocation();
    });
  }, [requestLocation]);

  const copyAddress = useCallback(() => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      toast.success("تم نسخ العنوان");
      setTimeout(() => setCopied(false), 2000);
    });
  }, [address]);

  const embedSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.5!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f${zoom}!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sar!2seg!4v1700000000000`;

  return (
    <section className="py-10 md:py-14" style={{ background: "hsl(var(--card))" }}>
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
        >
          {/* Header + Branch Switcher */}
          <div className="mb-6 flex flex-col items-center gap-4 text-center">
            <div>
              <p className="section-kicker">الموقع والوصول</p>
              <h2 className="section-title">كيف تصل إلى مول البستان</h2>
              {subtitle && (
                <p className="mx-auto mt-1.5 max-w-md text-[0.8rem] leading-relaxed text-muted-foreground">{subtitle}</p>
              )}
            </div>

            {/* Branch switcher */}
            <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: "hsl(var(--secondary))" }}>
              {branches.map((b) => {
                const isActive = location.pathname === b.path;
                return (
                  <Link
                    key={b.path}
                    to={b.path}
                    className={`rounded-md px-4 py-1.5 text-[0.76rem] font-bold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {b.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
            {/* Map */}
            <div className="relative overflow-hidden rounded-xl border border-border shadow-sm" style={{ minHeight: 400 }}>
              <iframe
                title={`موقع ${branchName}`}
                src={embedSrc}
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="pointer-events-auto flex flex-col items-center -translate-y-6">
                  <div className="rounded-full bg-primary px-2.5 py-1 shadow-lg">
                    <span className="text-[0.66rem] font-bold text-primary-foreground whitespace-nowrap">مول البستان</span>
                  </div>
                  <div className="h-2.5 w-px bg-primary" />
                  <div className="h-2.5 w-2.5 rounded-full border-2 border-primary bg-primary-foreground shadow" />
                </div>
              </div>

              <button
                onClick={requestLocation}
                disabled={locating}
                className="absolute bottom-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card shadow-sm transition hover:bg-secondary"
                title="حدد موقعي"
              >
                <Locate className={`h-3.5 w-3.5 text-primary ${locating ? "animate-pulse" : ""}`} />
              </button>

              {/* Distance badge — lighter */}
              {distance !== null && (
                <div className="absolute top-3 left-3 z-10 rounded-md bg-card/80 px-2.5 py-1 shadow-sm backdrop-blur-sm" style={{ border: "1px solid hsl(var(--border))" }}>
                  <p className="text-[0.68rem] text-muted-foreground">
                    <span className="font-bold text-foreground">
                      {distance < 1 ? `${Math.round(distance * 1000)} م` : `${distance.toFixed(1)} كم`}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Directions card — tighter */}
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              {/* Branch name + address */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[0.84rem] font-bold text-foreground leading-snug">{branchName}</h3>
                  <p className="mt-0.5 text-[0.72rem] leading-relaxed text-muted-foreground">{address}</p>
                </div>
              </div>

              {/* Landmarks — smaller chips */}
              {landmarks.length > 0 && (
                <div className="flex flex-wrap gap-1 border-t border-border pt-2.5">
                  {landmarks.map((lm) => (
                    <span key={lm.label} className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.64rem] font-medium text-muted-foreground" style={{ background: "hsl(var(--secondary))" }}>
                      <lm.icon className="h-2.5 w-2.5 text-primary/60" />
                      {lm.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Route mode tabs */}
              <div className="border-t border-border pt-2.5">
                <div className="flex gap-1">
                  {routeModes.map((rm) => (
                    <button
                      key={rm.mode}
                      onClick={() => setRouteMode(rm.mode)}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[0.68rem] font-bold transition ${
                        routeMode === rm.mode
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      style={routeMode !== rm.mode ? { background: "hsl(var(--secondary))" } : undefined}
                    >
                      <rm.icon className="h-3 w-3" />
                      {rm.label}
                    </button>
                  ))}
                </div>

                {distance !== null && eta ? (
                  <p className="mt-2 text-[0.72rem] text-muted-foreground">
                    {distance < 1 ? `${Math.round(distance * 1000)} م` : `${distance.toFixed(1)} كم`}
                    <span className="mx-1">·</span>
                    <span className="font-semibold text-foreground">{eta} تقريبًا</span>
                  </p>
                ) : (
                  <button
                    onClick={requestLocation}
                    disabled={locating}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-2 text-[0.72rem] text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
                    style={{ background: "hsl(var(--secondary) / 0.5)" }}
                  >
                    <Locate className={`h-3 w-3 ${locating ? "animate-pulse" : ""}`} />
                    {locating ? "جارٍ تحديد الموقع..." : "حدد موقعك لحساب المسافة"}
                  </button>
                )}
              </div>

              {/* CTAs */}
              <div className="mt-auto space-y-1.5 border-t border-border pt-2.5">
                <a href={buildGoogleMapsUrl(lat, lng, routeMode, userPos?.lat, userPos?.lng)} target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="cta" className="h-9 w-full rounded-lg text-[0.78rem] font-bold gap-1.5">
                    <Navigation className="h-3.5 w-3.5" />
                    ابدأ التوجيه
                  </Button>
                </a>

                <div className="grid grid-cols-3 gap-1.5">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="h-8 w-full rounded-md text-[0.66rem] gap-1 px-1.5">
                      <ExternalLink className="h-3 w-3" />
                      خرائط جوجل
                    </Button>
                  </a>
                  <a href={buildWazeUrl(lat, lng)} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="h-8 w-full rounded-md text-[0.66rem] gap-1 px-1.5">
                      <ExternalLink className="h-3 w-3" />
                      Waze
                    </Button>
                  </a>
                  <Button variant="outline" onClick={copyAddress} className="h-8 w-full rounded-md text-[0.66rem] gap-1 px-1.5">
                    {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    {copied ? "تم" : "نسخ"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {plusCode && (
            <p className="mt-2.5 text-center text-[0.64rem] text-muted-foreground/60">Plus Code: {plusCode}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
