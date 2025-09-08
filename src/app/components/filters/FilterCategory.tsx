// src/app/components/filters/FilterCategory.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoryStore } from "@/stores/categoryStore";
import { useEffect } from "react";

type FilterCategoryProps = {
  value: string;
  onChange: (categoryId: string) => void;
};

export default function FilterCategory({
  value,
  onChange,
}: FilterCategoryProps) {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium">Categoria</label>
      <Select
        value={value && value !== "" ? value : "all"}
        onValueChange={(v) => onChange(v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
