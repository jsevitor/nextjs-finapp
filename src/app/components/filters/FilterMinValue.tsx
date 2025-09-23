import { Filters } from "@/app/types/filters";
import { Input } from "@/components/ui/input";

interface FilterMinValueProps {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
}

export default function FilterMinValue({
  filters,
  setFilter,
}: FilterMinValueProps) {
  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium mb-1">Valor mínimo</label>
      <Input
        type="number"
        placeholder="0,00"
        value={filters.minValue ?? ""}
        onChange={(e) =>
          setFilter(
            "minValue",
            e.target.value === "" ? undefined : Number(e.target.value)
          )
        }
        className="w-full"
      />
    </div>
  );
}
