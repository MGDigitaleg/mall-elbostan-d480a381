import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Compass, Gift, MapPin, Phone, Ruler, Store, Tag } from "lucide-react";
import type { MallUnit, MallUnitStatus } from "@/lib/mallFloorGeometry";
import { categoryLabelsAr, floorLabelsAr, statusLabelsAr } from "@/lib/mallFloorGeometry";
import { UNIT_TENANT_LOGOS, UNIT_TENANT_NAMES } from "@/lib/tenantMapLookup";
export type ActiveRewardContext = {
  prizeName: string;
  claimRules?: string | null;
  storeName?: string;
  isCategory?: boolean;
};

const statusBadge: Record<MallUnitStatus, { bg: string; border: string; text: string; dot: string; darkBg: string; darkBorder: string; darkText: string }> = {
  occupied: { bg: "#EDEBEA", border: "#C8C4BF", text: "#4A4540", dot: "#9B9488", darkBg: "#1E1D1C", darkBorder: "#3A3835", darkText: "#C8C4BF" },
  available: { bg: "#FDE4C4", border: "#E8740E40", text: "#B85C08", dot: "#E8740E", darkBg: "#2A1D0D", darkBorder: "#E8740E40", darkText: "#F5A623" },
  coming_soon: { bg: "#C8E8F4", border: "#0A9AB840", text: "#0A7A96", dot: "#0A9AB8", darkBg: "#0D1F2A", darkBorder: "#0A9AB840", darkText: "#22D3EE" },
};

function RewardBanner({ ctx }: { ctx: ActiveRewardContext }) {
  return (
    <div className="rounded-xl p-3.5 bg-accent/30 dark:bg-primary/10 border border-accent dark:border-primary/20">
      <div className="flex items-center gap-1.5 text-[0.66rem] font-bold uppercase tracking-widest text-primary">
        <Gift className="h-3.5 w-3.5" />
        مكافأة نشطة
      </div>
      <p className="mt-1.5 text-[0.88rem] font-bold text-foreground">{ctx.prizeName}</p>
      {ctx.storeName && <p className="mt-0.5 text-[0.78rem] text-muted-foreground">من {ctx.storeName}</p>}
      {ctx.claimRules && <p className="mt-1.5 text-[0.74rem] leading-5 text-muted-foreground">{ctx.claimRules}</p>}
      {ctx.isCategory && <p className="mt-1.5 text-[0.7rem] font-bold text-primary">جميع المتاجر المُظلّلة مشاركة</p>}
    </div>
  );
}

function UnitDetail({ unit, rewardCtx }: { unit: MallUnit; rewardCtx?: ActiveRewardContext }) {
  const badge = statusBadge[unit.status];

  return (
    <div className="space-y-3.5">
      {rewardCtx && <RewardBanner ctx={rewardCtx} />}

      {/* Logo + Header */}
      {UNIT_TENANT_LOGOS[unit.id] && unit.status === "occupied" && (
        <div className="flex items-center justify-center rounded-xl p-4 bg-secondary dark:bg-muted/30 border border-border">
          <img
            src={UNIT_TENANT_LOGOS[unit.id]}
            alt={UNIT_TENANT_NAMES[unit.id] ?? unit.code}
            className="h-12 w-auto max-w-[160px] object-contain"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[1.35rem] font-extrabold text-foreground">{unit.code}</p>
          {UNIT_TENANT_NAMES[unit.id] && unit.status === "occupied" && (
            <p className="mt-0.5 text-[0.84rem] font-bold text-muted-foreground">{UNIT_TENANT_NAMES[unit.id]}</p>
          )}
          <p className="mt-0.5 text-[0.72rem] font-medium text-muted-foreground">{floorLabelsAr[unit.floor]}</p>
        </div>
        <span
          className="flex items-center gap-1.5 shrink-0 rounded-lg px-2.5 py-1.5 text-[0.7rem] font-bold dark:hidden"
          style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: badge.dot }} />
          {statusLabelsAr[unit.status]}
        </span>
        <span
          className="hidden items-center gap-1.5 shrink-0 rounded-lg px-2.5 py-1.5 text-[0.7rem] font-bold dark:flex"
          style={{ background: badge.darkBg, border: `1px solid ${badge.darkBorder}`, color: badge.darkText }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: badge.dot }} />
          {statusLabelsAr[unit.status]}
        </span>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { icon: Ruler, label: "المساحة", value: `${unit.area} م²` },
          { icon: Building2, label: "الدور", value: floorLabelsAr[unit.floor] },
          { icon: Tag, label: "الفئة", value: categoryLabelsAr[unit.category] },
          { icon: MapPin, label: "الموقع", value: unit.code },
        ].map((item) => (
          <div key={item.label} className="rounded-lg p-2.5 bg-secondary dark:bg-muted/30 border border-border">
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-muted dark:bg-muted/50">
                <item.icon className="h-2.5 w-2.5 text-muted-foreground" />
              </div>
              <span className="text-[0.6rem] font-semibold text-muted-foreground">{item.label}</span>
            </div>
            <p className="mt-1 text-[0.84rem] font-bold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      {unit.description && (
        <div className="rounded-xl border border-border bg-secondary/30 dark:bg-muted/20 p-3">
          <p className="text-[0.8rem] leading-[1.7] text-muted-foreground">{unit.description}</p>
        </div>
      )}

      {/* CTAs */}
      <div className="space-y-2 pt-1">
        {unit.status === "available" ? (
          <>
            <Link to="/leasing" className="block">
              <Button variant="orange" className="h-10 w-full rounded-xl font-bold text-[0.84rem] shadow-sm shadow-orange-500/10">
                <Phone className="ml-1.5 h-3.5 w-3.5" />
                استفسر عن الوحدة
              </Button>
            </Link>
            <Link to="/leasing" className="block">
              <Button variant="outline-blue" className="h-10 w-full rounded-xl text-[0.82rem] font-bold">اطلب معاينة</Button>
            </Link>
          </>
        ) : unit.status === "occupied" ? (
          <>
            <Link to="/stores" className="block">
              <Button variant="cta" className="h-10 w-full rounded-xl text-[0.84rem] font-bold">
                <Store className="ml-1.5 h-3.5 w-3.5" />
                اعرف المتجر
              </Button>
            </Link>
            <Link to="/stores" className="block">
              <Button variant="secondary" className="h-10 w-full rounded-xl text-[0.82rem] font-bold">تواصل مع المتجر</Button>
            </Link>
          </>
        ) : (
          <Button variant="secondary" className="h-10 w-full rounded-xl text-[0.82rem] font-bold" disabled>
            قريبًا — تابع التحديثات
          </Button>
        )}
      </div>
    </div>
  );
}

function EmptyPanel() {
  return (
    <div className="space-y-4">
      {/* prompt */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary dark:bg-muted/30">
          <Compass className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <p className="text-[0.88rem] font-bold text-foreground">اختر وحدة من الخريطة</p>
          <p className="text-[0.74rem] text-muted-foreground">اضغط على أي وحدة لعرض تفاصيلها.</p>
        </div>
      </div>

      {/* status guide */}
      <div className="space-y-1.5">
        {[
          { label: "مشغولة", action: "اعرف المتجر", status: "occupied" as MallUnitStatus },
          { label: "متاحة", action: "استفسر عن الوحدة", status: "available" as MallUnitStatus },
          { label: "قريبًا", action: "تابع التحديثات", status: "coming_soon" as MallUnitStatus },
        ].map((item) => {
          const badge = statusBadge[item.status];
          return (
            <div key={item.label} className="flex items-center justify-between rounded-lg px-3.5 py-2.5 bg-secondary dark:bg-muted/30 border border-border">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: badge.dot }} />
                <span className="text-[0.78rem] font-bold text-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-[0.7rem] font-semibold">{item.action}</span>
                <ArrowLeft className="h-2.5 w-2.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* quick links */}
      <div className="grid grid-cols-2 gap-2">
        <Link to="/stores" className="rounded-xl border border-border bg-secondary/50 dark:bg-muted/20 p-3 text-center transition-all hover:border-primary/20 hover:shadow-sm">
          <Store className="mx-auto h-4 w-4 text-primary" />
          <p className="mt-1.5 text-[0.74rem] font-bold text-foreground">دليل المتاجر</p>
        </Link>
        <Link to="/leasing" className="rounded-xl border border-border bg-secondary/50 dark:bg-muted/20 p-3 text-center transition-all hover:border-primary/20 hover:shadow-sm">
          <Phone className="mx-auto h-4 w-4 text-primary" />
          <p className="mt-1.5 text-[0.74rem] font-bold text-foreground">استفسار التأجير</p>
        </Link>
      </div>
    </div>
  );
}

type Props = {
  unit: MallUnit | null;
  rewardContext?: ActiveRewardContext;
};

export function UnitDetailsCard({ unit, rewardContext }: Props) {
  return (
    <div
      className="rounded-xl border bg-card transition-all duration-200 overflow-hidden"
      style={{
        borderColor: unit ? statusBadge[unit.status].dot + "50" : undefined,
        boxShadow: unit
          ? `0 0 0 1px ${statusBadge[unit.status].dot}20, 0 4px 20px hsl(0 0% 0% / 0.06)`
          : "var(--shadow-card)",
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center gap-2 border-b border-border px-4 py-2.5 bg-muted/50"
      >
        <div
          className="h-[3px] w-4 rounded-full transition-colors"
          style={{ background: unit ? statusBadge[unit.status].dot : undefined }}
        />
        <h2 className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {unit ? "تفاصيل الوحدة" : "لوحة التفاصيل"}
        </h2>
      </div>
      <div className="p-4">
        {unit ? <UnitDetail unit={unit} rewardCtx={rewardContext} /> : <EmptyPanel />}
      </div>
    </div>
  );
}
