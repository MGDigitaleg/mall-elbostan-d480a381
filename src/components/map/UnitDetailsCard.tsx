import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Compass, Gift, MapPin, Phone, Ruler, Store, Tag } from "lucide-react";
import type { MallUnit, MallUnitStatus } from "@/lib/mallFloorGeometry";
import { categoryLabelsAr, floorLabelsAr, statusLabelsAr } from "@/lib/mallFloorGeometry";
import type { SpinReward } from "./AtriumSpinModal";

const statusBadge: Record<MallUnitStatus, { bg: string; border: string; text: string; dot: string }> = {
  occupied: { bg: "#EDEBEA", border: "#C8C4BF", text: "#4A4540", dot: "#9B9488" },
  available: { bg: "#FDE4C4", border: "#E8740E40", text: "#B85C08", dot: "#E8740E" },
  coming_soon: { bg: "#C8E8F4", border: "#0A9AB840", text: "#0A7A96", dot: "#0A9AB8" },
};

export type ActiveRewardContext = {
  reward: SpinReward;
  storeName?: string;
  isCategory?: boolean;
};

function RewardBanner({ ctx }: { ctx: ActiveRewardContext }) {
  return (
    <div className="rounded-xl p-4" style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
      <div className="flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-widest" style={{ color: "#3B52CC" }}>
        <Gift className="h-3.5 w-3.5" />
        مكافأة نشطة
      </div>
      <p className="mt-1.5 text-[0.9rem] font-bold light-heading">{ctx.reward.title_ar}</p>
      {ctx.storeName && (
        <p className="mt-1 text-[0.82rem] light-body">من {ctx.storeName}</p>
      )}
      {ctx.reward.claim_rules_ar && (
        <p className="mt-2 text-[0.78rem] leading-6 light-body">{ctx.reward.claim_rules_ar}</p>
      )}
      {ctx.isCategory && (
        <p className="mt-2 text-[0.74rem] font-bold" style={{ color: "#3B52CC" }}>جميع المتاجر المُظلّلة مشاركة في هذا العرض</p>
      )}
    </div>
  );
}

function UnitDetail({ unit, rewardCtx }: { unit: MallUnit; rewardCtx?: ActiveRewardContext }) {
  const badge = statusBadge[unit.status];

  return (
    <div className="space-y-4">
      {rewardCtx && <RewardBanner ctx={rewardCtx} />}

      {/* Header — strong visual hierarchy */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[1.5rem] font-extrabold" style={{ color: "#0F172A" }}>{unit.code}</p>
          <p className="mt-0.5 text-[0.76rem] font-medium" style={{ color: "#64748B" }}>{floorLabelsAr[unit.floor]}</p>
        </div>
        <span
          className="flex items-center gap-1.5 shrink-0 rounded-md px-2.5 py-1.5 text-[0.72rem] font-bold"
          style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: badge.dot }} />
          {statusLabelsAr[unit.status]}
        </span>
      </div>

      {/* Meta grid — tight, informative */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { icon: Ruler, label: "المساحة", value: `${unit.area} م²` },
          { icon: Building2, label: "الدور", value: floorLabelsAr[unit.floor] },
          { icon: Tag, label: "الفئة", value: categoryLabelsAr[unit.category] },
          { icon: MapPin, label: "الموقع", value: unit.code },
        ].map((item) => (
          <div key={item.label} className="rounded-md p-2.5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <div className="flex items-center gap-1.5">
              <item.icon className="h-3 w-3" style={{ color: "#64748B" }} />
              <span className="text-[0.64rem] font-semibold" style={{ color: "#94A3B8" }}>{item.label}</span>
            </div>
            <p className="mt-0.5 text-[0.84rem] font-bold" style={{ color: "#0F172A" }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      {unit.description && (
        <div className="rounded-lg border border-border bg-secondary/30 p-3">
          <p className="text-[0.82rem] leading-6 light-body">{unit.description}</p>
        </div>
      )}

      {/* CTAs — clear commercial actions */}
      <div className="space-y-2 pt-1">
        {unit.status === "available" ? (
          <>
            <Link to="/leasing" className="block">
              <Button variant="orange" className="h-11 w-full rounded-xl font-bold text-[0.9rem]">
                <Phone className="ml-2 h-4 w-4" />
                استفسر عن هذه الوحدة
              </Button>
            </Link>
            <Link to="/leasing" className="block">
              <Button variant="outline-blue" className="h-11 w-full rounded-xl text-[0.88rem] font-bold">اطلب معاينة</Button>
            </Link>
          </>
        ) : unit.status === "occupied" ? (
          <>
            <Link to="/stores" className="block">
              <Button variant="cta" className="h-11 w-full rounded-xl text-[0.9rem] font-bold">
                <Store className="ml-2 h-4 w-4" />
                اعرف المتجر
              </Button>
            </Link>
            <Link to="/stores" className="block">
              <Button variant="secondary" className="h-11 w-full rounded-xl text-[0.88rem] font-bold">تواصل مع المتجر</Button>
            </Link>
          </>
        ) : (
          <Button variant="secondary" className="h-11 w-full rounded-xl text-[0.88rem] font-bold" disabled>
            قريبًا — تابع التحديثات
          </Button>
        )}
      </div>
    </div>
  );
}

function EmptyPanel() {
  return (
    <div className="space-y-5">
      {/* prompt */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary">
          <Compass className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-[0.95rem] font-bold light-heading">اختر وحدة من الخريطة</p>
          <p className="text-[0.8rem] light-muted">اضغط على أي وحدة لعرض تفاصيلها.</p>
        </div>
      </div>

      {/* status guide — clear, tight */}
      <div className="space-y-1.5">
        {[
          { bg: "#EDEBEA", dot: "#9B9488", label: "مشغولة", action: "اعرف المتجر", textColor: "#4A4540" },
          { bg: "#FDE4C4", dot: "#E8740E", label: "متاحة", action: "استفسر عن الوحدة", textColor: "#B85C08" },
          { bg: "#C8E8F4", dot: "#0A9AB8", label: "قريبًا", action: "تابع التحديثات", textColor: "#0A7A96" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg px-3.5 py-2.5" style={{ background: item.bg }}>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.dot }} />
              <span className="text-[0.82rem] font-bold" style={{ color: item.textColor }}>{item.label}</span>
            </div>
            <div className="flex items-center gap-1 light-muted">
              <span className="text-[0.74rem] font-semibold">{item.action}</span>
              <ArrowLeft className="h-3 w-3" />
            </div>
          </div>
        ))}
      </div>

      {/* quick links */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Link to="/stores" className="rounded-lg border border-border bg-secondary/50 p-3 text-center transition-all hover:border-primary/20 hover:shadow-sm">
          <Store className="mx-auto h-4 w-4 text-primary" />
          <p className="mt-1.5 text-[0.78rem] font-bold light-heading">دليل المتاجر</p>
        </Link>
        <Link to="/leasing" className="rounded-lg border border-border bg-secondary/50 p-3 text-center transition-all hover:border-primary/20 hover:shadow-sm">
          <Phone className="mx-auto h-4 w-4 text-primary" />
          <p className="mt-1.5 text-[0.78rem] font-bold light-heading">استفسار التأجير</p>
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
      className="rounded-xl border bg-card transition-all duration-200"
      style={{
        borderColor: unit ? statusBadge[unit.status].dot + "50" : "#D8DEE8",
        boxShadow: unit
          ? `0 0 0 1px ${statusBadge[unit.status].dot}20, 0 4px 20px hsl(0 0% 0% / 0.06)`
          : "var(--shadow-card)",
      }}
    >
      {/* Panel header — anchored */}
      <div className="flex items-center gap-2 border-b px-5 py-3" style={{ borderColor: unit ? statusBadge[unit.status].dot + "20" : "#D8DEE8" }}>
        <div
          className="h-[3px] w-4 rounded-full transition-colors"
          style={{ background: unit ? statusBadge[unit.status].dot : "#94A3B8" }}
        />
        <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.2em]" style={{ color: "#64748B" }}>
          {unit ? "تفاصيل الوحدة" : "لوحة التفاصيل"}
        </h2>
      </div>
      <div className="p-5">
        {unit ? <UnitDetail unit={unit} rewardCtx={rewardContext} /> : <EmptyPanel />}
      </div>
    </div>
  );
}
