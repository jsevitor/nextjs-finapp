import { FiltersProps } from "@/app/types/filters";
import { Input } from "@/components/ui/input";

export default function FilterMinValue({ filters, setFilter }: FiltersProps) {
  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium mb-1">Valor mínimo</label>
      <Input
        type="number"
        placeholder="0,00"
        value={filters.minValue}
        onChange={(e) => setFilter("minValue", e.target.value)}
        className="w-full"
      />
    </div>
  );
}
