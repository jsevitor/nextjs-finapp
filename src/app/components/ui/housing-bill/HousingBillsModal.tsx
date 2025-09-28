import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "../../layout/Modal";
import HeaderModal from "../../common/HeaderModal";
import { HousingBill } from "@/stores/housingBillsStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type HousingBillsModalProps = {
  isOpen: boolean;
  bill: HousingBill | null;
  onChange: (bill: HousingBill | null) => void;
  onClose: () => void;
  onSubmit: (bill: HousingBill) => void;
  categories: { id: string; name: string }[];
  repeatForYear?: boolean;
  setRepeatForYear?: (value: boolean) => void;
};

export default function HousingBillsModal({
  isOpen,
  bill,
  onChange,
  onClose,
  onSubmit,
  categories,
  repeatForYear,
  setRepeatForYear,
}: HousingBillsModalProps) {
  if (!bill) return null;

  const handleChange = (
    field: keyof HousingBill,
    value: string | number | null
  ) => {
    // Aqui ajustamos o tipo de `value` para ser string | number | null, conforme esperado nos campos
    onChange({ ...bill, [field]: value });
  };

  const handleSubmit = () => onSubmit(bill);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <HeaderModal
        title={
          bill.id ? "Editar Conta de Moradia" : "Adicionar Conta de Moradia"
        }
      />

      <form className="grid grid-cols-2 gap-4 mt-4">
        <div className="grid grid-cols-3 col-span-2 gap-3">
          <div className="grid gap-3">
            <Label>Mês de Referência</Label>
            <Select
              onValueChange={(v) => handleChange("monthReference", Number(v))}
              defaultValue={
                bill.monthReference?.toString() ??
                (new Date().getMonth() + 2).toString()
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {monthOptions.map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label>Ano de Referência</Label>
            <Select
              onValueChange={(v) => handleChange("yearReference", Number(v))}
              defaultValue={
                bill.yearReference?.toString() ??
                new Date().getFullYear().toString()
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 justify-center">
            <label className="flex items-center gap-2 mt-8 ">
              <input
                type="checkbox"
                checked={repeatForYear}
                onChange={(e) => setRepeatForYear?.(e.target.checked)}
              />
              Repetir despesa?
            </label>
          </div>
        </div>

        <div className="grid gap-3">
          <Label>Nome</Label>
          <Input
            value={bill.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label>Valor</Label>
          <Input
            type="number"
            value={bill.amount}
            onChange={(e) =>
              handleChange("amount", parseFloat(e.target.value) || 0)
            }
          />
        </div>

        <div className="grid gap-3">
          <Label>Vencimento</Label>
          <Input
            type="date"
            value={bill.dueDate ? bill.dueDate.split("T")[0] : ""}
            onChange={(e) =>
              handleChange("dueDate", new Date(e.target.value).toISOString())
            }
          />
        </div>

        <div className="grid gap-3">
          <Label>Categoria</Label>
          <Select
            onValueChange={(v) => handleChange("categoryId", v)}
            defaultValue={bill.categoryId || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>

      <div className="col-span-2 flex justify-center mt-8 gap-4">
        <Button variant="outline" onClick={onClose} className="w-1/2 lg:w-1/3">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} className="w-1/2 lg:w-1/3">
          Salvar
        </Button>
      </div>
    </Modal>
  );
}
