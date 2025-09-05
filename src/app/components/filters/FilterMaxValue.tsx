import { FiltersProps } from "@/app/types/filters";
import { Input } from "@/components/ui/input";

export default function FilterMaxValue({ filters, setFilters }: FiltersProps) {
  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium">Valor máximo</label>
      <Input
        type="number"
        placeholder="R$ 0"
        value={filters.maxValue}
        onChange={(e) => setFilters({ ...filters, maxValue: e.target.value })}
        className="w-full"
      />
    </div>
  );
}
