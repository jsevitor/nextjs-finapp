import { FiltersProps } from "@/app/types/filters";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchBar({ filters, setFilters }: FiltersProps) {
  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium">Pesquisar</label>
      <div className="flex gap-4">
        <Select
          onValueChange={(value) =>
            setFilters({ ...filters, searchField: value })
          }
        >
          <SelectTrigger className="w-1/3">
            <SelectValue placeholder="Campo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="author">Autor</SelectItem>
            <SelectItem value="business">Estabelecimento</SelectItem>
            <SelectItem value="description">Descrição</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Digite o termo..."
          value={filters?.searchTerm}
          onChange={(e) =>
            setFilters({ ...filters, searchTerm: e.target.value })
          }
        />
      </div>
    </div>
  );
}
