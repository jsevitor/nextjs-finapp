import { Card } from "@/stores/cardStore";
import { Profile } from "@/stores/profileStore";
import { Transaction } from "@/stores/transactionsStore";

export type ModalProps<T> = {
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
