// src/utils/sanitizeTransaction.ts
import { Transaction } from "@/stores/transactionsStore";

export function sanitizeTransaction(transaction: Transaction): any {
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
