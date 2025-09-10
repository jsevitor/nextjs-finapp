// utils/dateUtils.ts - UTILITÁRIOS DE DATA CORRIGIDOS
export function formatDateBR(dateInput: string | Date): string {
  if (!dateInput) return "—";

  try {
    let date: Date;

    if (typeof dateInput === "string") {
      // Se a data termina com Z (UTC), precisamos tratar especialmente
      if (dateInput.endsWith("Z") || dateInput.includes("T")) {
        // Para datas UTC do banco, criamos uma data local sem conversão de timezone
        const utcDate = new Date(dateInput);
        // Compensar a diferença de timezone para manter a data original
        date = new Date(
          utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
        );
      } else {
        // Para datas já no formato correto
        date = new Date(dateInput);
      }
    } else {
      date = dateInput;
    }

    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      console.warn("Data inválida:", dateInput);
      return "Data inválida";
    }

    // Formatar em pt-BR
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.error("Erro ao formatar data:", error, dateInput);
    return "Erro na data";
  }
}

export function formatDateForInput(dateInput: string | Date): string {
  if (!dateInput) return "";

  try {
    let date: Date;

    if (typeof dateInput === "string") {
      if (dateInput.endsWith("Z") || dateInput.includes("T")) {
        const utcDate = new Date(dateInput);
        date = new Date(
          utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
        );
      } else {
        date = new Date(dateInput);
      }
    } else {
      date = dateInput;
    }

    if (isNaN(date.getTime())) {
      return "";
    }

    // Retorna no formato YYYY-MM-DD para inputs HTML
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Erro ao formatar data para input:", error);
    return "";
  }
}

export function createLocalDate(
  year: number,
  month: number,
  day: number
): Date {
  // Cria uma data local sem conversão de timezone
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function dateToISOLocal(date: Date): string {
  // Converte para ISO string mantendo a data local (sem conversão UTC)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}T12:00:00.000`;
}
