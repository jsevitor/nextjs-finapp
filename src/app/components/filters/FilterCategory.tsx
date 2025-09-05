import { FiltersProps } from "@/app/types/filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterCategory({ filters, setFilters }: FiltersProps) {
  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium">Categoria</label>
      <Select
        onValueChange={(value) => setFilters({ ...filters, category: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="alimentacao">Alimentação</SelectItem>
          <SelectItem value="transporte">Transporte</SelectItem>
          <SelectItem value="lazer">Lazer</SelectItem>
          <SelectItem value="saude">Saúde</SelectItem>
          <SelectItem value="outros">Outros</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
