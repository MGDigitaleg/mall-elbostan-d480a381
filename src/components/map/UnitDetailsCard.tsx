import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Gift, MapPin, Ruler, Store, Tag } from "lucide-react";
import type { MallUnit, MallUnitStatus } from "@/lib/mallFloorGeometry";
import { categoryLabelsAr, floorLabelsAr, statusLabelsAr } from "@/lib/mallFloorGeometry";
import type { SpinReward } from "./AtriumSpinModal";

const statusStyle: Record<MallUnitStatus, string> = {
  occupied: "border-primary/20 bg-primary/8 text-primary",
  available: "border-orange/20 bg-orange/8 text-orange",
  coming_soon: "border-accent/20 bg-accent/8 text-accent",
};

export type ActiveRewardContext = {
  reward: SpinReward;
  storeName?: string;
  isCategory?: boolean;
};

function RewardBanner({ ctx }: { ctx: ActiveRewardContext }) {
  return (
    <div className="rounded-xl border border-primary/15 bg-gradient-to-br from-primary/5 to-accent/5 p-3.5">
      <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-widest text-primary">
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
        <p className="mt-2 text-[0.72rem] font-medium text-primary">جميع المتاجر المُظلّلة مشاركة في هذا العرض</p>
      )}
    </div>
  );
}

function UnitDetail({ unit, rewardCtx }: { unit: MallUnit; rewardCtx?: ActiveRewardContext }) {
  return (
    <div className="space-y-4">
      {/* reward banner */}
      {rewardCtx && <RewardBanner ctx={rewardCtx} />}

      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-widest text-muted-foreground">رقم الوحدة</p>
          <p className="mt-1 text-xl font-bold text-foreground">{unit.code}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-3 py-1 text-[0.72rem] font-semibold ${statusStyle[unit.status]}`}>
          {statusLabelsAr[unit.status]}
        </span>
      </div>

      {/* meta grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: Ruler, label: "المساحة", value: `${unit.area} م²` },
          { icon: Building2, label: "الدور", value: floorLabelsAr[unit.floor] },
          { icon: Tag, label: "الفئة", value: categoryLabelsAr[unit.category] },
          { icon: MapPin, label: "الموقع", value: unit.code },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-border bg-secondary/40 p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <item.icon className="h-3.5 w-3.5" />
              <span className="text-[0.7rem]">{item.label}</span>
            </div>
            <p className="mt-1 text-[0.85rem] font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      {/* description */}
      {unit.description && (
        <div className="rounded-lg border border-border bg-secondary/30 p-3">
          <p className="text-[0.78rem] leading-6 text-muted-foreground">{unit.description}</p>
        </div>
      )}

      {/* CTAs */}
      <div className="space-y-2">
        {unit.status === "available" ? (
          <>
            <Link to="/leasing" className="block">
              <Button variant="orange" className="h-11 w-full rounded-xl font-bold">استفسر عن الوحدة</Button>
            </Link>
            <Link to="/leasing" className="block">
              <Button variant="outline-blue" className="h-11 w-full rounded-xl">اطلب معاينة</Button>
            </Link>
          </>
        ) : unit.status === "occupied" ? (
          <>
            <Link to="/stores" className="block">
              <Button variant="default" className="h-11 w-full rounded-xl">
                <Store className="ml-2 h-4 w-4" />
                اعرف المتجر
              </Button>
            </Link>
            <Link to="/stores" className="block">
              <Button variant="secondary" className="h-11 w-full rounded-xl">تواصل مع المتجر</Button>
            </Link>
          </>
        ) : (
          <Button variant="secondary" className="h-11 w-full rounded-xl" disabled>
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
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-secondary/40">
        <MapPin className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-[0.95rem] font-bold text-foreground">اختر وحدة من الخريطة</p>
        <p className="mt-1 text-[0.82rem] leading-6 text-muted-foreground">
          اضغط على أي وحدة لعرض تفاصيلها، حالتها، والإجراء المناسب.
        </p>
      </div>
      <div className="space-y-2">
        {[
          { color: "bg-foreground/60", label: "مشغولة", action: "اعرف المتجر" },
          { color: "bg-orange", label: "متاحة", action: "استفسر عن الوحدة" },
          { color: "bg-accent", label: "قريبًا", action: "تابع التحديثات" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5 text-[0.78rem]">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${item.color}`} />
              <span className="text-foreground">{item.label}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>{item.action}</span>
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
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <h2 className="mb-4 text-[0.78rem] font-semibold uppercase tracking-widest text-muted-foreground">
        {unit ? "تفاصيل الوحدة" : "لوحة التفاصيل"}
      </h2>
      {unit ? <UnitDetail unit={unit} rewardCtx={rewardContext} /> : <EmptyPanel />}
    </div>
  );
}
