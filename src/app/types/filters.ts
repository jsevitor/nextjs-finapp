// Definindo o tipo para filters
export type Filters = {
  category?: string | null;
  minValue?: number | null;
  maxValue?: number | null;
  monthReference?: number;
  yearReference?: number;
};

// Usando o tipo Filters para tipar filters e setFilter
import { Dispatch, SetStateAction } from "react";

export type FiltersProps = {
  filters: Filters;
  setFilter: Dispatch<SetStateAction<Filters>>;
};
