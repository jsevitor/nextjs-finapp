import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useCategoryStore } from "@/stores/categoryStore";

export default function CategoriesCard() {
  const { categories, isLoading, fetchCategories, addCategory } =
    useCategoryStore();

  const [newCategory, setNewCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function handleAddCategory() {
    if (!newCategory.trim()) return;

    setIsAdding(true);
    await addCategory(newCategory);
    setNewCategory("");
    setIsAdding(false);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Categorias</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : (
          <>
            <ul className="space-y-1 mb-4">
              {categories.map((cat) => (
                <li key={cat.id} className="text-muted-foreground">
                  {cat.name}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Nova categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddCategory} disabled={isAdding}>
                {isAdding ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Plus />
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
