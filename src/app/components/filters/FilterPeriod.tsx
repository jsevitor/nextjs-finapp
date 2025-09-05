import { FiltersProps } from "@/app/types/filters";
import { Input } from "@/components/ui/input";

export default function FilterPeriod({ filters, setFilters }: FiltersProps) {
  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium">Período</label>
      <Input
        type="month"
        value={filters.date}
        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        className="w-full"
      />
    </div>
  );
}
