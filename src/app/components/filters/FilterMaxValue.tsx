import { FiltersProps } from "@/app/types/filters";
import { Input } from "@/components/ui/input";

export default function FilterMaxValue({ filters, setFilter }: FiltersProps) {
  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium mb-1">Valor máximo</label>
      <Input
        type="number"
        placeholder="0,00"
        value={filters.maxValue}
        onChange={(e) => setFilter("maxValue", e.target.value)}
        className="w-full"
      />
    </div>
  );
}
