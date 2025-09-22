// Definir o tipo para os filtros
interface Filter {
  monthReference?: number;
  yearReference?: number;
  card?: string;
  category?: string;
  minValue?: number;
  maxValue?: number;
  searchField?: string;
  searchTerm?: string;
}

// Definir o tipo para uma transação
interface Transaction {
  amount?: number;
  yearReference: number;
  monthReference: number;
}

export const debugFilters = (filters: Filter, context: string = "") => {
  console.group(`🔧 Debug Filters ${context}`);
  console.table({
    Mês: filters.monthReference,
    Ano: filters.yearReference,
    Cartão: filters.card,
    Categoria: filters.category || "Todas",
    "Valor Min": filters.minValue || "Não definido",
    "Valor Max": filters.maxValue || "Não definido",
    "Campo Busca": filters.searchField || "Nenhum",
    "Termo Busca": filters.searchTerm || "Vazio",
  });
  console.groupEnd();
};

export const debugTransactions = (
  transactions: Transaction[],
  context: string = ""
) => {
  console.group(`📊 Debug Transactions ${context}`);
  console.log(`Total: ${transactions.length} transações`);

  if (transactions.length > 0) {
    const totalAmount = transactions.reduce(
      (sum, t) => sum + (t.amount || 0),
      0
    );
    console.log(`Valor total: R$ ${totalAmount.toFixed(2)}`);

    // Agrupar por mês/ano
    const byPeriod = transactions.reduce((acc, t) => {
      const key = `${t.yearReference}-${String(t.monthReference).padStart(
        2,
        "0"
      )}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.table(byPeriod);

    // Mostrar as primeiras 3 transações
    console.table(transactions.slice(0, 3));
  }

  console.groupEnd();
};
