// components/filters/FiltersContainer.tsx - REFORMULADO
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Filter, X, Search } from "lucide-react";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

type FiltersContainerProps = {
  children?: React.ReactNode;
};

export function FiltersContainer({ children }: FiltersContainerProps) {
  const { filters, setFilter, resetFilters, hasActiveFilters } =
    useTransactionFilters();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border p-4 rounded-lg bg-muted/30"
    >
      <CollapsibleTrigger className="flex items-center justify-between gap-2 hover:underline w-full">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              Ativos
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {isOpen ? "Recolher" : "Expandir"}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {children}
          </div>

          {/* Filtros de valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Valor mínimo</label>
              <Input
                type="number"
                placeholder="0,00"
                value={filters.minValue}
                onChange={(e) => setFilter("minValue", e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Valor máximo</label>
              <Input
                type="number"
                placeholder="0,00"
                value={filters.maxValue}
                onChange={(e) => setFilter("maxValue", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Busca por texto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Buscar em</label>
              <Select
                value={filters.searchField}
                onValueChange={(value) => setFilter("searchField", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o campo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="business">Estabelecimento</SelectItem>
                  <SelectItem value="description">Descrição</SelectItem>
                  <SelectItem value="category">Categoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium mb-1">Termo de busca</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite o termo..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilter("searchTerm", e.target.value)}
                  className="pl-10"
                  disabled={!filters.searchField}
                />
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-2">
            {hasActiveFilters && (
              <Button variant="outline" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
