"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CreditCard } from "lucide-react";

import PageContainer from "../components/layout/PageContainer";
import Header from "../components/common/Header";
import HeaderTitle from "../components/common/HeaderTitle";
import { ButtonVariant } from "../components/common/ButtonVariant";
import { FiltersContainer } from "../components/filters/FiltersContainer";
import { CreditCardItem } from "../components/ui/card/CreditCardItem";
import CardModal from "../components/ui/card/CardModal";

import { useCardStore, Card } from "@/stores/cardStore";

import NubankLogo from "@/../public/logos/nubank.png";
import MercadoPagoLogo from "@/../public/logos/mercado-pago.png";

export default function CardsPage() {
  const { data: session } = useSession();
  const { cards, fetchCards, addCard, updateCard, removeCard } = useCardStore();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cardBeingEdited, setCardBeingEdited] = useState<Card | null>(null);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const cardStyles: Record<string, { color: string; logo: any }> = {
    Nubank: {
      color: "#8612D2",
      logo: NubankLogo,
    },
    "Mercado Pago": {
      color: "#55B6EA",
      logo: MercadoPagoLogo,
    },
  };

  const handleOpenAddModal = () => {
    setCardBeingEdited({
      id: "",
      name: "",
      closingDate: 1,
      dueDay: 1,
      userId: session?.user?.id || "",
    });
    setModalIsOpen(true);
  };

  const handleEditCard = (card: Card) => {
    setCardBeingEdited(card);
    setModalIsOpen(true);
  };

  const handleDeleteCard = async (id: string | undefined) => {
    if (!id) return;
    await removeCard(id);
  };

  const handleSubmit = async (card: Card) => {
    if (!card.userId) return;

    if (card.id) {
      await updateCard(card); // Edição
    } else {
      await addCard(card); // Adição
    }

    setModalIsOpen(false);
    setCardBeingEdited(null);
  };

  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Cartões">
          <CreditCard className="h-8 w-8" />
        </HeaderTitle>

        <ButtonVariant typeAction="add" action={handleOpenAddModal} />

        <CardModal
          isOpen={modalIsOpen}
          card={cardBeingEdited}
          onChange={setCardBeingEdited}
          onClose={() => setModalIsOpen(false)}
          onSubmit={handleSubmit}
        />
      </Header>

      <FiltersContainer />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((card) => {
          const { color, logo } = cardStyles[card.name] ?? {
            color: "#ccc",
            logo: null,
          };

          return (
            <CreditCardItem
              key={card.id}
              card={card}
              color={color}
              logo={logo}
              onEdit={() => handleEditCard(card)}
              onDelete={() => handleDeleteCard(card.id)}
            />
          );
        })}
      </div>
    </PageContainer>
  );
}
