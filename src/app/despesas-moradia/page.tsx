"use client";

import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { DataTable } from "../components/common/DataTable";
import { Column } from "../types/tableColumns";
import Header from "../components/common/Header";
import HeaderTitle from "../components/common/HeaderTitle";
import { FiltersContainer } from "../components/filters/FiltersContainer";
import FilterPeriod from "../components/filters/FilterPeriod";
import FilterCategory from "../components/filters/FilterCategory";
import PageContainer from "../components/layout/PageContainer";
import { ButtonVariant } from "../components/common/ButtonVariant";
import { HousingBill, useHousingBillsStore } from "@/stores/housingBillsStore";
import { formatCurrencyBRL, formatDateBR } from "@/utils/format";
import { useHousingBillsFilters } from "@/hooks/useHousingBillsFilters";
import HousingBillsModal from "../components/ui/housing-bill/HousingBillsModal";
import { useCategoryStore } from "@/stores/categoryStore";

export default function HousingBillsPage() {
  const { filters, housingBills, isLoading, setFilter } =
    useHousingBillsFilters();
  const { addHousingBill, updateHousingBill, removeHousingBill } =
    useHousingBillsStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState<HousingBill | null>(null);
  const [repeatForYear, setRepeatForYear] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const columns: Column<HousingBill>[] = [
    {
      key: "dueDate",
      label: "Vencimento",
      render: (row) => formatDateBR(row.dueDate),
    },
    { key: "name", label: "Nome" },
    {
      key: "categoryId",
      label: "Categoria",
      render: (row) => row.categoryName ?? "—",
    },
    {
      key: "amount",
      label: "Valor",
      align: "right",
      render: (row) => formatCurrencyBRL(row.amount),
    },
  ];

  const handleOpenAddModal = () => {
    const defaultCategoryId =
      categories.find((c) => c.name === "Moradia")?.id || "";

    setIsBeingEdited({
      id: "",
      name: "",
      amount: 0,
      dueDate: new Date().toISOString().split("T")[0],
      categoryId: defaultCategoryId, // <-- categoria padrão
      profileId: "",
      userId: "",
    });
    setModalIsOpen(true);
  };

  const handleSubmit = async (bill: HousingBill) => {
    try {
      if (!bill.id) {
        if (repeatForYear) {
          const currentYear = new Date().getFullYear();
          const originalDay = bill.dueDate.split("-")[2]; // pega o dia da string YYYY-MM-DD

          const billsForYear = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1; // 1 a 12
            // Monta string YYYY-MM-DD sem passar por Date
            const dueDateString = `${currentYear}-${String(month).padStart(
              2,
              "0"
            )}-${originalDay}`;

            return {
              ...bill,
              dueDate: dueDateString,
            };
          });

          for (const b of billsForYear) {
            await addHousingBill(b);
          }
        } else {
          await addHousingBill(bill);
        }
      } else {
        // Edição
        await updateHousingBill(bill);
      }

      setModalIsOpen(false);
      setIsBeingEdited(null);
    } catch (err) {
      console.error("Erro ao salvar conta de moradia:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeHousingBill(id);
    } catch (err) {
      console.error("Erro ao deletar conta de moradia:", err);
    }
  };

  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Contas de Moradia">
          <Home className="h-8 w-8" />
        </HeaderTitle>

        <ButtonVariant typeAction="add" action={handleOpenAddModal} />

        <HousingBillsModal
          isOpen={modalIsOpen}
          bill={isBeingEdited}
          categories={categories}
          onChange={setIsBeingEdited}
          onClose={() => setModalIsOpen(false)}
          onSubmit={handleSubmit}
          repeatForYear={repeatForYear}
          setRepeatForYear={setRepeatForYear}
        />
      </Header>

      <FiltersContainer>
        {/* Período */}
        <FilterPeriod
          value={{
            monthReference: Number(filters.monthReference),
            yearReference: Number(filters.yearReference),
          }}
          onChange={(month, year) => {
            setFilter("monthReference", month);
            setFilter("yearReference", year);
          }}
        />

        {/* Categoria */}
        <FilterCategory
          value={filters.category}
          onChange={(categoryId) => setFilter("category", categoryId)}
        />
      </FiltersContainer>

      <div className="border rounded-2xl overflow-hidden">
        <DataTable
          caption="Lista de contas de moradia"
          columns={columns}
          data={housingBills}
          isLoading={isLoading}
          onEdit={(row) => {
            setIsBeingEdited(row);
            setModalIsOpen(true);
          }}
          onDelete={(row) => handleDelete(row.id)}
        />
      </div>
    </PageContainer>
  );
}
