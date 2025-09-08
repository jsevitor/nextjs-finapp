// src/app/components/filters/FilterCard.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCardStore } from "@/stores/cardStore";
import { useEffect } from "react";

type FilterCardProps = {
  value: string;
  onChange: (cardId: string) => void;
};

export default function FilterCard({ value, onChange }: FilterCardProps) {
  const { cards, fetchCards } = useCardStore();

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <div className="flex flex-col flex-1">
      <label className="text-sm font-medium">Cartão</label>
      <Select
        value={value && value !== "" ? value : "all"}
        onValueChange={(v) => onChange(v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {cards.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
