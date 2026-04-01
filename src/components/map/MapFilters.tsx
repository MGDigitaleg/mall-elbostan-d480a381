import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { MallCategory, MallUnitStatus } from "@/lib/mallFloorGeometry";
import { categoryLabelsAr } from "@/lib/mallFloorGeometry";

const allCategories: MallCategory[] = [
  "Accessories", "Laptops", "Components", "Networking", "Maintenance", "Security Systems",
];

type Props = {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  statusFilter: "all" | MallUnitStatus;
  onStatusChange: (v: "all" | MallUnitStatus) => void;
  categoryFilter: "all" | MallCategory;
  onCategoryChange: (v: "all" | MallCategory) => void;
  availableOnly: boolean;
  onAvailableOnlyChange: (v: boolean) => void;
};

export function MapFilters({
  searchTerm, onSearchChange,
  statusFilter, onStatusChange,
  categoryFilter, onCategoryChange,
  availableOnly, onAvailableOnlyChange,
}: Props) {
  return (
    <div className="section-shell rounded-[1.5rem] p-4 md:p-5">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث باسم المتجر أو رقم الوحدة"
          className="h-[3.25rem] rounded-[1.125rem]"
        />
        <Select value={categoryFilter} onValueChange={(v) => onCategoryChange(v as "all" | MallCategory)}>
          <SelectTrigger className="h-[3.25rem] rounded-[1.125rem]">
            <SelectValue placeholder="كل الفئات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الفئات</SelectItem>
            {allCategories.map((c) => (
              <SelectItem key={c} value={c}>{categoryLabelsAr[c]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as "all" | MallUnitStatus)}>
          <SelectTrigger className="h-[3.25rem] rounded-[1.125rem]">
            <SelectValue placeholder="كل الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            <SelectItem value="occupied">مشغولة</SelectItem>
            <SelectItem value="available">متاحة</SelectItem>
            <SelectItem value="coming_soon">قريبًا</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex h-[3.25rem] items-center justify-between rounded-[1.125rem] border border-border bg-card px-4">
          <span className="text-sm font-semibold text-foreground">المتاحة فقط</span>
          <Switch checked={availableOnly} onCheckedChange={onAvailableOnlyChange} />
        </div>
      </div>
    </div>
  );
}
