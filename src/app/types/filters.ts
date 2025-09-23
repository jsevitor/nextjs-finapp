// Tipagem centralizada para filtros
export type Filters = {
  monthReference: number;
  yearReference: number;
  category: string;
  profile: string; // usado em transações e despesas gerais
  card?: string; // opcional, só em transações
  minValue?: number | null;
  maxValue?: number | null;
  searchField?: string;
  searchTerm?: string;
};

// Props comuns para componentes que usam filtros
export type FiltersProps = {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
};
