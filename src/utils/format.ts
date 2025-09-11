export function formatDateBR(date?: string | Date | null): string {
  if (!date) return "";

  // Se vier string no formato ISO (com "T"), corta só a parte da data
  const d =
    typeof date === "string"
      ? new Date(date.split("T")[0] + "T00:00:00")
      : new Date(date);

  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}
