// src/types/modal.ts
import { Card } from "@/stores/cardStore";
import { GeneralExpense } from "@/stores/generalExpesnsesStore";
import { Profile } from "@/stores/profileStore";
import { Transaction } from "@/stores/transactionsStore";

export type ModalProps<T> = {
  isLoading?: boolean;
  isOpen: boolean;
  onChange: (data: T) => void;
  onClose: () => void;
  onSubmit: (data: T) => void;
};

export type CardModalProps = ModalProps<Card> & {
  card: Card | null;
};

export type TransactionsModalProps = ModalProps<Transaction> & {
  transaction: Transaction | null;
};

export type ProfilesModalProps = ModalProps<Profile> & {
  profile: Profile | null;
};

export type GeneralExpensesModalProps = ModalProps<Transaction> & {
  generalExpense: GeneralExpense | null;
};
