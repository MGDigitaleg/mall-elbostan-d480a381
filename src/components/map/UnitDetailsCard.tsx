import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Gift, MapPin, Ruler, Store, Tag, Phone } from "lucide-react";
import type { MallUnit, MallUnitStatus } from "@/lib/mallFloorGeometry";
import { categoryLabelsAr, floorLabelsAr, statusLabelsAr } from "@/lib/mallFloorGeometry";
import type { SpinReward } from "./AtriumSpinModal";

const statusBadge: Record<MallUnitStatus, { bg: string; border: string; text: string }> = {
  occupied: { bg: "hsl(222 20% 94%)", border: "hsl(222 20% 86%)", text: "hsl(222 30% 40%)" },
  available: { bg: "hsl(24 90% 95%)", border: "hsl(24 85% 78%)", text: "hsl(24 85% 38%)" },
  coming_soon: { bg: "hsl(190 60% 93%)", border: "hsl(190 50% 75%)", text: "hsl(190 60% 32%)" },
};

export type ActiveRewardContext = {
  reward: SpinReward;
  storeName?: string;
  isCategory?: boolean;
};

function RewardBanner({ ctx }: { ctx: ActiveRewardContext }) {
  return (
    <div className="rounded-xl p-3.5" style={{ background: "hsl(222 40% 96%)", border: "1px solid hsl(222 30% 88%)" }}>
      <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-widest" style={{ color: "hsl(222 58% 42%)" }}>
        <Gift className="h-3.5 w-3.5" />
        مكافأة نشطة
      </div>
      <p className="mt-1.5 text-[0.85rem] font-bold text-foreground">{ctx.reward.title_ar}</p>
      {ctx.storeName && (
        <p className="mt-1 text-[0.78rem] text-muted-foreground">من {ctx.storeName}</p>
      )}
      {ctx.reward.claim_rules_ar && (
        <p className="mt-2 text-[0.75rem] leading-6 text-muted-foreground">{ctx.reward.claim_rules_ar}</p>
      )}
      {ctx.isCategory && (
        <p className="mt-2 text-[0.72rem] font-medium" style={{ color: "hsl(222 58% 42%)" }}>جميع المتاجر المُظلّلة مشاركة في هذا العرض</p>
      )}
    </div>
  );
}

function UnitDetail({ unit, rewardCtx }: { unit: MallUnit; rewardCtx?: ActiveRewardContext }) {
  const badge = statusBadge[unit.status];

  return (
    <div className="space-y-4">
      {rewardCtx && <RewardBanner ctx={rewardCtx} />}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">رقم الوحدة</p>
          <p className="mt-1 text-xl font-bold text-foreground">{unit.code}</p>
        </div>
        <span
          className="shrink-0 rounded-full px-3 py-1 text-[0.72rem] font-semibold"
          style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text }}
        >
          {statusLabelsAr[unit.status]}
        </span>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: Ruler, label: "المساحة", value: `${unit.area} م²` },
          { icon: Building2, label: "الدور", value: floorLabelsAr[unit.floor] },
          { icon: Tag, label: "الفئة", value: categoryLabelsAr[unit.category] },
          { icon: MapPin, label: "الموقع", value: unit.code },
        ].map((item) => (
          <div key={item.label} className="rounded-lg p-2.5" style={{ background: "hsl(var(--secondary) / 0.5)", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <item.icon className="h-3 w-3" />
              <span className="text-[0.68rem]">{item.label}</span>
            </div>
            <p className="mt-0.5 text-[0.82rem] font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      {unit.description && (
        <div className="rounded-lg p-2.5" style={{ background: "hsl(var(--secondary) / 0.3)", border: "1px solid hsl(var(--border))" }}>
          <p className="text-[0.78rem] leading-6 text-muted-foreground">{unit.description}</p>
        </div>
      )}

      {/* CTAs — clear commercial actions */}
      <div className="space-y-2">
        {unit.status === "available" ? (
          <>
            <Link to="/leasing" className="block">
              <Button variant="orange" className="h-10 w-full rounded-xl font-bold text-[0.85rem]">
                <Phone className="ml-2 h-3.5 w-3.5" />
                استفسر عن الوحدة
              </Button>
            </Link>
            <Link to="/leasing" className="block">
              <Button variant="outline-blue" className="h-10 w-full rounded-xl text-[0.85rem]">اطلب معاينة</Button>
            </Link>
          </>
        ) : unit.status === "occupied" ? (
          <>
            <Link to="/stores" className="block">
              <Button variant="default" className="h-10 w-full rounded-xl text-[0.85rem]">
                <Store className="ml-2 h-3.5 w-3.5" />
                اعرف المتجر
              </Button>
            </Link>
            <Link to="/stores" className="block">
              <Button variant="secondary" className="h-10 w-full rounded-xl text-[0.85rem]">تواصل مع المتجر</Button>
            </Link>
          </>
        ) : (
          <Button variant="secondary" className="h-10 w-full rounded-xl text-[0.85rem]" disabled>
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
      <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "hsl(var(--secondary) / 0.5)", border: "1px solid hsl(var(--border))" }}>
        <MapPin className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-[0.92rem] font-bold text-foreground">اختر وحدة من الخريطة</p>
        <p className="mt-1 text-[0.8rem] leading-6 text-muted-foreground">
          اضغط على أي وحدة لعرض تفاصيلها، حالتها، والإجراء المناسب.
        </p>
      </div>
      <div className="space-y-1.5">
        {[
          { bg: "hsl(222 20% 94%)", dot: "#9B9488", label: "مشغولة", action: "اعرف المتجر" },
          { bg: "hsl(24 90% 95%)", dot: "#E8740E", label: "متاحة", action: "استفسر عن الوحدة" },
          { bg: "hsl(190 60% 93%)", dot: "#0A9AB8", label: "قريبًا", action: "تابع التحديثات" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg px-3 py-2 text-[0.78rem]" style={{ background: item.bg }}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: item.dot }} />
              <span className="font-medium text-foreground">{item.label}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-[0.72rem]">{item.action}</span>
              <ArrowLeft className="h-3 w-3" />
            </div>
          </div>
        ))}
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
    <div className="rounded-xl border border-border bg-card p-4 shadow-[0_2px_8px_hsl(0_0%_0%/0.04)]">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-[2px] w-4" style={{ background: unit ? "hsl(24 85% 50%)" : "hsl(222 30% 70%)" }} />
        <h2 className="text-[0.75rem] font-semibold uppercase tracking-widest text-muted-foreground">
          {unit ? "تفاصيل الوحدة" : "لوحة التفاصيل"}
        </h2>
      </div>
      {unit ? <UnitDetail unit={unit} rewardCtx={rewardContext} /> : <EmptyPanel />}
    </div>
  );
}
