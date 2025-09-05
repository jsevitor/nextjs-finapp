import { FiltersProps } from "@/app/types/filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterCard({ filters, setFilters }: FiltersProps) {
  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium">Cartão</label>
      <Select
        onValueChange={(value) => setFilters({ ...filters, card: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nubank">Nubank</SelectItem>
          <SelectItem value="itau">Itaú</SelectItem>
          <SelectItem value="santander">Santander</SelectItem>
          <SelectItem value="outros">Outros</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
