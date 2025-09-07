import { Card } from "@/stores/cardStore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

type Props = {
  card: Card;
  color: string;
  logo: any;
  onEdit?: (card: Card) => void;
  onDelete?: (card: Card) => void;
};

export function CreditCardItem({ card, color, logo, onEdit, onDelete }: Props) {
  return (
    <div
      className="rounded-2xl h-48 shadow-md flex flex-col gap-2 p-4 justify-between"
      style={{ backgroundColor: color }}
    >
      <Image
        src={logo}
        alt={`${card.name} logo`}
        width={80}
        height={80}
        className="object-contain"
      />

      <div className="flex justify-between">
        <div className="flex flex-col">
          <p className="text-white text-lg font-bold">{card.name}</p>
          <div className="flex gap-4">
            <p className="text-white text-sm">Fecha: {card.closingDate}</p>
            <p className="text-white text-sm">Vence: {card.dueDay}</p>
          </div>
        </div>
        <div className="flex items-end text-white gap-2">
          <Button variant="ghost" onClick={() => onEdit?.(card)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={() => onDelete?.(card)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
