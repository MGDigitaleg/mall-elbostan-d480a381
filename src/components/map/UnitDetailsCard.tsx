import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { MallUnit, MallUnitStatus } from "@/lib/mallFloorGeometry";
import { categoryLabelsAr, floorLabelsAr, statusLabelsAr } from "@/lib/mallFloorGeometry";

const statusTone: Record<MallUnitStatus, string> = {
  occupied: "text-foreground",
  available: "text-orange",
  coming_soon: "text-accent",
};

function UnitDetail({ unit }: { unit: MallUnit }) {
  return (
    <div className="space-y-4 text-sm text-muted-foreground">
      <div className="rounded-[1.5rem] border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">رقم الوحدة</p>
            <p className="text-lg font-bold text-foreground">{unit.code}</p>
          </div>
          <Badge variant="outline" className={statusTone[unit.status]}>
            {statusLabelsAr[unit.status]}
          </Badge>
        </div>
        <p className="mt-2 text-sm">{floorLabelsAr[unit.floor]}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[1.25rem] border border-border bg-card p-4">
          <p className="text-xs">المساحة</p>
          <p className="mt-1 text-base font-semibold text-foreground">{unit.area} م²</p>
        </div>
        <div className="rounded-[1.25rem] border border-border bg-card p-4">
          <p className="text-xs">الفئة</p>
          <p className="mt-1 text-base font-semibold text-foreground">{categoryLabelsAr[unit.category]}</p>
        </div>
      </div>
      {unit.description && (
        <div className="rounded-[1.25rem] border border-border bg-card p-4">
          <p className="text-xs">نبذة سريعة</p>
          <p className="mt-2 leading-7">{unit.description}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {unit.status === "available" ? (
          <>
            <Link to="/leasing">
              <Button variant="orange" size="sm" className="h-11 rounded-[1rem] px-4">ابدأ الاستفسار التجاري</Button>
            </Link>
            <Link to="/leasing">
              <Button variant="outline-blue" size="sm" className="h-11 rounded-[1rem] px-4">اطلب معاينة</Button>
            </Link>
          </>
        ) : unit.status === "occupied" ? (
          <Link to="/stores">
            <Button variant="outline-blue" size="sm" className="h-11 rounded-[1rem] px-4">استعرض بيانات المتجر</Button>
          </Link>
        ) : (
          <Button variant="secondary" size="sm" className="h-11 rounded-[1rem] px-4" disabled>
            تابع التحديثات القادمة
          </Button>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p className="leading-7">اختر وحدة من الخريطة لعرض حالتها، موقعها داخل الدور، والإجراء الأنسب بعدها.</p>
      <div className="grid gap-2">
        <div className="flex items-center justify-between rounded-[1rem] border border-border bg-card px-4 py-3">
          <span>مشغولة</span>
          <span className="text-xs">استعرض بيانات المتجر</span>
        </div>
        <div className="flex items-center justify-between rounded-[1rem] border border-border bg-card px-4 py-3">
          <span className="text-orange">متاحة</span>
          <span className="text-xs">ابدأ الاستفسار التجاري</span>
        </div>
        <div className="flex items-center justify-between rounded-[1rem] border border-border bg-card px-4 py-3">
          <span className="text-accent">قريبًا</span>
          <span className="text-xs">تابع التحديثات القادمة</span>
        </div>
      </div>
      <div className="rounded-[1rem] border border-dashed border-border px-4 py-3 text-xs">
        تلميح سريع: استخدم الفلاتر لتضييق النتائج ثم اختر الوحدة مباشرة من المخطط.
      </div>
    </div>
  );
}

type Props = {
  unit: MallUnit | null;
};

export function UnitDetailsCard({ unit }: Props) {
  return (
    <div className="surface-panel rounded-[1.5rem] p-4 md:p-5">
      <h2 className="mb-4 text-xl font-bold text-foreground">تفاصيل الوحدة</h2>
      {unit ? <UnitDetail unit={unit} /> : <EmptyState />}
    </div>
  );
}
