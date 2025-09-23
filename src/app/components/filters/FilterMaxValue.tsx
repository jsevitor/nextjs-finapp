import { Filters, FiltersProps } from "@/app/types/filters";
import { Input } from "@/components/ui/input";

interface FilterMaxValueProps {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
}

export default function FilterMaxValue({
  filters,
  setFilter,
}: FilterMaxValueProps) {
  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium mb-1">Valor máximo</label>
      <Input
        type="number"
        placeholder="0,00"
        value={filters.maxValue ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          setFilter("maxValue", value === "" ? null : Number(value)); // converte string → number | null
        }}
        className="w-full"
      />
    </div>
  );
}
