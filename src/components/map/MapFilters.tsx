import { Filter, Search } from "lucide-react";
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
    <div className="rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
      <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto]">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث باسم المتجر أو رقم الوحدة..."
            className="h-10 w-full rounded-lg border border-border bg-secondary/40 pr-9 pl-3 text-[0.85rem] text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary/40 focus:ring-1 focus:ring-primary/15"
          />
        </div>

        {/* Category */}
        <Select value={categoryFilter} onValueChange={(v) => onCategoryChange(v as "all" | MallCategory)}>
          <SelectTrigger className="h-10 rounded-lg border-border bg-secondary/40 text-[0.85rem]">
            <Filter className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="كل الفئات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الفئات</SelectItem>
            {allCategories.map((c) => (
              <SelectItem key={c} value={c}>{categoryLabelsAr[c]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as "all" | MallUnitStatus)}>
          <SelectTrigger className="h-10 rounded-lg border-border bg-secondary/40 text-[0.85rem]">
            <SelectValue placeholder="كل الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            <SelectItem value="occupied">مشغولة</SelectItem>
            <SelectItem value="available">متاحة</SelectItem>
            <SelectItem value="coming_soon">قريبًا</SelectItem>
          </SelectContent>
        </Select>

        {/* Available toggle */}
        <div className="flex h-10 items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-3">
          <span className="text-[0.8rem] font-semibold text-foreground whitespace-nowrap">المتاحة فقط</span>
          <Switch checked={availableOnly} onCheckedChange={onAvailableOnlyChange} />
        </div>
      </div>
    </div>
  );
}
