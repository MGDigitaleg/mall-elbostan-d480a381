import { Search, SlidersHorizontal } from "lucide-react";
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
    <div className="rounded-xl border border-border bg-card p-3" style={{ boxShadow: "0 1px 3px hsl(220 30% 10% / 0.04)" }}>
      <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto]">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث باسم المتجر أو رقم الوحدة..."
            className="h-10 w-full rounded-xl border border-border bg-background pr-10 pl-3 text-[0.84rem] font-medium text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:shadow-sm"
          />
        </div>

        {/* Category */}
        <Select value={categoryFilter} onValueChange={(v) => onCategoryChange(v as "all" | MallCategory)}>
          <SelectTrigger className="h-10 rounded-xl border-border bg-background text-[0.84rem] font-medium">
            <SlidersHorizontal className="ml-1.5 h-3 w-3 text-muted-foreground/60" />
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
          <SelectTrigger className="h-10 rounded-xl border-border bg-background text-[0.84rem] font-medium">
            <SelectValue placeholder="كل الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            <SelectItem value="occupied">مشغولة</SelectItem>
            <SelectItem value="available">متاحة</SelectItem>
            <SelectItem value="coming_soon">قريباً</SelectItem>
          </SelectContent>
        </Select>

        {/* Available toggle */}
        <div className="flex h-10 items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5">
          <span className="text-[0.82rem] font-bold light-heading whitespace-nowrap">المتاحة فقط</span>
          <Switch checked={availableOnly} onCheckedChange={onAvailableOnlyChange} />
        </div>
      </div>
    </div>
  );
}
