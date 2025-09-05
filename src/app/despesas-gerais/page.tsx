import { DialogAdd } from "../components/layout/DialogAdd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "../components/common/Header";
import HeaderTitle from "../components/common/HeaderTitle";
import { FiltersContainer } from "../components/filters/FiltersContainer";
import { Home, PieChart } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";

export default function GenralExpensesPage() {
  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Despesas Gerais">
          <PieChart className="h-8 w-8" />
        </HeaderTitle>
        <DialogAdd title="Adicionar Despesa Geral">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label htmlFor="date-1">Data</Label>
              <Input id="date-1" name="date" type="date" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="author-1">Autor</Label>
              <Input id="author-1" name="author" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="establishment-1">Estabelecimento</Label>
              <Input id="establishment-1" name="establishment" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description-1">Descrição</Label>
              <Input id="description-1" name="description" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="installment-1">Parcelas</Label>
              <Input id="installment-1" name="installment" type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="installment-2">Parcela Atual</Label>
              <Input id="installment-2" name="installment" type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="category-1">Categoria</Label>
              <Select>
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
            <div className="grid gap-3">
              <Label htmlFor="amount-1">Valor</Label>
              <Input id="amount-1" name="amount" placeholder="R$ 0" />
            </div>
          </div>
        </DialogAdd>
      </Header>
      <FiltersContainer></FiltersContainer>

      <HeaderTitle title="Moradia">
        <Home className="h-8 w-8" />
      </HeaderTitle>
    </PageContainer>
  );
}
