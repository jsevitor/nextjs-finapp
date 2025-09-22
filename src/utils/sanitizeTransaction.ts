import { Transaction } from "@/stores/transactionsStore";

// Definindo o tipo para a transação sanitizada
export type SanitizedTransaction = Omit<
  Transaction,
  | "amount"
  | "installmentNumber"
  | "installmentTotal"
  | "description"
  | "business"
  | "parentId"
> & {
  amount: number;
  installmentNumber: number | null;
  installmentTotal: number | null;
  description: string | null;
  business: string | null;
  parentId: string | null;
};

export function sanitizeTransaction(
  transaction: Transaction
): SanitizedTransaction {
  return {
    ...transaction,
    amount: Number(transaction.amount),
    installmentNumber: transaction.installmentNumber || null,
    installmentTotal: transaction.installmentTotal || null,
    description: transaction.description || null,
    business: transaction.business || null,
    parentId: transaction.parentId || null,
    monthReference: transaction.monthReference,
    yearReference: transaction.yearReference,
  };
}
