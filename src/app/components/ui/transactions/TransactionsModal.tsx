import { useState, useEffect } from "react";
import { Modal } from "../../layout/Modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HeaderModal from "../../common/HeaderModal";
import { TransactionsModalProps } from "@/types/modal";
import { Transaction, useTransactionsStore } from "@/stores/transactionsStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategoryStore } from "@/stores/categoryStore";
import { useCardStore } from "@/stores/cardStore";
import { useProfileStore } from "@/stores/profileStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function TransactionsModal({
  isOpen,
  transaction,
  onChange,
  onClose,
  onSubmit,
}: TransactionsModalProps) {
  const { categories, fetchCategories } = useCategoryStore();
  const { cards, fetchCards } = useCardStore();
  const { profiles, fetchProfiles } = useProfileStore();

  const { importTransactions, fetchTransactions } = useTransactionsStore();
  const [jsonInput, setJsonInput] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    fetchProfiles();
    fetchCategories();
    fetchCards();
  }, [fetchProfiles, fetchCategories, fetchCards]);

  if (!transaction) return null;

  const handleChange = (field: keyof Transaction, value: string | number) => {
    onChange({ ...transaction, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(transaction);
  };

  const handleImportJson = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        alert("O JSON precisa ser um array de transações");
        return;
      }

      await importTransactions(parsed);
      setJsonInput("");
      onClose();
    } catch (err) {
      console.error("Erro importando JSON:", err);
      alert("Erro ao importar JSON. Verifique o formato.");
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <HeaderModal
        title={transaction.id ? "Editar Transação" : "Adicionar Transação"}
      />

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>

        {/* --- Aba Manual --- */}
        <TabsContent value="manual">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
            <div className="grid grid-cols-3 col-span-2 gap-3">
              <div className="grid gap-3">
                <Label htmlFor="card">Cartão</Label>
                <Select
                  onValueChange={(value) => handleChange("cardId", value)}
                  defaultValue={
                    transaction.cardId ??
                    cards.find((card) => card.name.toLowerCase() === "nubank")
                      ?.id
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um cartão" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    {cards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="monthReference">Mês de Referência</Label>
                <Select
                  onValueChange={(value) =>
                    handleChange("monthReference", Number(value))
                  }
                  defaultValue={
                    transaction.monthReference?.toString() ??
                    (new Date().getMonth() + 1).toString()
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
                <Label htmlFor="yearReference">Ano de Referência</Label>
                <Select
                  onValueChange={(value) =>
                    handleChange("yearReference", Number(value))
                  }
                  defaultValue={
                    transaction.yearReference?.toString() ??
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
            </div>

            <div className="grid gap-3">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={transaction.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="profileId">Autor</Label>
              <Select
                onValueChange={(value) => handleChange("profileId", value)}
                defaultValue={transaction.profileId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="business">Estabelecimento</Label>
              <Input
                id="business"
                value={transaction.business || ""}
                onChange={(e) => handleChange("business", e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={transaction.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="categoryId">Categoria</Label>
              <Select
                onValueChange={(value) => handleChange("categoryId", value)}
                defaultValue={transaction.categoryId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="installmentNumber">Parcela</Label>
              <Input
                id="installmentNumber"
                type="number"
                value={transaction.installmentNumber ?? 1}
                onChange={(e) =>
                  handleChange("installmentNumber", Number(e.target.value))
                }
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="installmentTotal">Parcelas</Label>
              <Input
                id="installmentTotal"
                type="number"
                value={transaction.installmentTotal ?? 1}
                onChange={(e) =>
                  handleChange("installmentTotal", Number(e.target.value))
                }
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={transaction.amount}
                onChange={(e) =>
                  handleChange("amount", parseFloat(e.target.value))
                }
              />
            </div>

            <div className="col-span-2 flex justify-center mt-4">
              <Button
                type="button"
                className="mr-4 w-1/2 lg:w-1/3"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 w-1/2 lg:w-1/3"
              >
                {transaction.id ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* --- Aba JSON --- */}
        <TabsContent value="json">
          <div className="flex flex-col gap-4 mt-4">
            <Label htmlFor="jsonInput">Cole o JSON</Label>
            <Textarea
              id="jsonInput"
              rows={10}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[ { "date": "...", "amount": 123, ... } ]'
              className="h-80"
            />

            <div className="flex justify-center mt-4 gap-4">
              <Button
                type="button"
                className="w-1/2 lg:w-1/3"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 w-1/2 lg:w-1/3"
                onClick={handleImportJson}
                disabled={isImporting}
              >
                {isImporting ? "Importando..." : "Importar JSON"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Modal>
  );
}
