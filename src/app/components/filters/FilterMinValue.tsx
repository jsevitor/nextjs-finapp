import { FiltersProps } from "@/app/types/filters";
import { Input } from "@/components/ui/input";

export default function FilterMinValue({ filters, setFilters }: FiltersProps) {
  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium">Valor mínimo</label>
      <Input
        type="number"
        placeholder="R$ 0"
        value={filters.minValue}
        onChange={(e) => setFilters({ ...filters, minValue: e.target.value })}
        className="w-full"
      />
    </div>
  );
}
