import { Modal } from "../../layout/Modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/stores/cardStore";
import { Button } from "@/components/ui/button";
import HeaderModal from "../../common/HeaderModal";
import { CardModalProps } from "@/types/modal";

export default function CardModal({
  isOpen,
  card,
  onChange,
  onClose,
  onSubmit,
}: CardModalProps) {
  if (!card) return null;

  const handleChange = (field: keyof Card, value: string | number) => {
    onChange({ ...card, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(card);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <HeaderModal
        title={card.id ? "Editar Cartão" : "Adicionar Cartão"}
      ></HeaderModal>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="grid gap-3">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            value={card.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="closingDate">Dia de Fechamento</Label>
          <Input
            id="closingDate"
            name="closingDate"
            type="number"
            value={card.closingDate}
            onChange={(e) =>
              handleChange("closingDate", Number(e.target.value))
            }
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="dueDay">Dia de Vencimento</Label>
          <Input
            id="dueDay"
            name="dueDay"
            type="number"
            value={card.dueDay}
            onChange={(e) => handleChange("dueDay", Number(e.target.value))}
          />
        </div>

        <div className="col-span-2 flex justify-center mt-4">
          <Button
            className="mr-4 w-1/2 lg:w-1/3"
            onClick={onClose}
            variant="outline"
            type="button"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 w-1/2 lg:w-1/3"
          >
            {card.id ? "Salvar" : "Adicionar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
