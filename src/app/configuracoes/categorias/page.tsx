// src/app/configuracoes/categorias/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon, List, Plus, Loader2 } from "lucide-react";

import PageContainer from "@/app/components/layout/PageContainer";
import Header from "@/app/components/common/Header";
import HeaderTitle from "@/app/components/common/HeaderTitle";
import { GeneralTable } from "@/app/components/common/GeneralTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Column } from "@/app/types/tableColumns";
import { useCategoryStore, Category } from "@/stores/categoryStore";

export default function CategoriesPage() {
  const {
    categories,
    isLoading,
    fetchCategories,
    addCategory,
    removeCategory,
  } = useCategoryStore();

  const [newCategory, setNewCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function handleAddCategory() {
    if (!newCategory.trim()) return;

    setIsAdding(true);
    try {
      await addCategory(newCategory);
      setNewCategory("");
    } finally {
      setIsAdding(false);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await removeCategory(id);
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    } finally {
      await fetchCategories();
    }
  };

  const columns: Column<Category>[] = [
    // { label: "ID", key: "id" },
    { label: "Nome", key: "name" },
  ];

  return (
    <PageContainer>
      <Header>
        <div className="flex items-end gap-4">
          <a href="/configuracoes">
            <ChevronLeftIcon className="h-8 w-8 cursor-pointer hover:text-muted-foreground" />
          </a>
          <HeaderTitle title="Categorias">
            <List className="h-8 w-8" />
          </HeaderTitle>
        </div>
      </Header>

      {/* Form de adicionar categoria */}
      <div className="flex items-center gap-2 my-4">
        <Input
          placeholder="Nova categoria"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAddCategory} disabled={isAdding}>
          {isAdding ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus />}
        </Button>
      </div>

      <div className="border rounded-2xl overflow-hidden">
        <GeneralTable
          caption="Lista de categorias"
          columns={columns}
          data={categories}
          onDelete={(row) => handleDelete(row.id)}
        />
      </div>
    </PageContainer>
  );
}
