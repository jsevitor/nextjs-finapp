"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import SearchBar from "../common/SearchBar";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

type FiltersContainerProps = {
  children?: React.ReactNode;
};

export function FiltersContainer({ children }: FiltersContainerProps) {
  const [filters, setFilters] = useState({
    date: "",
    category: "",
    card: "",
    minValue: "",
    maxValue: "",
    searchField: "",
    searchTerm: "",
  });

  return (
    <Collapsible className="border p-4 rounded-lg bg-muted/30">
      <CollapsibleTrigger className="flex items-center gap-2 hover:underline w-full">
        <Filter className="ml-2 h-4 w-4" />
        Filtros
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-4">{children}</div>

          <div className="flex justify-between items-end gap-4">
            <SearchBar filters={filters} setFilters={setFilters} />

            <div className="flex gap-2">
              <Button variant="outline">Limpar</Button>
              <Button>Aplicar</Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
