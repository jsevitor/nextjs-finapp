// components/common/DataTable.tsx - MELHORADO
"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { Column } from "@/app/types/tableColumns";

type DataTableProps<T> = {
  caption?: string;
  columns: Column<T>[];
  data: T[];
  showActions?: boolean;
  isLoading?: boolean;
  bulkMode?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
};

export function DataTable<T extends { id: string; amount?: number }>({
  caption,
  columns,
  data,
  showActions = true,
  isLoading = false,
  bulkMode = false,
  selectedIds = [],
  onSelectionChange,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const totalAmount = Array.isArray(data)
    ? data.reduce((acc, item) => acc + (item.amount ?? 0), 0)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Carregando transações...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p className="text-lg">Nenhuma transação encontrada</p>
        <p className="text-sm">
          Tente ajustar os filtros ou adicionar uma nova transação
        </p>
      </div>
    );
  }

  const allSelected = data.length > 0 && selectedIds.length === data.length;

  const toggleAll = () => {
    if (allSelected) onSelectionChange?.([]);
    else onSelectionChange?.(data.map((d) => d.id));
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange?.([...selectedIds, id]);
    }
  };

  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}

      <TableHeader className="bg-muted">
        <TableRow>
          {bulkMode && (
            <TableHead className="w-12 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
              />
            </TableHead>
          )}
          {columns.map((col) => (
            <TableHead
              key={col.key as string}
              className={`font-bold ${
                col.align === "right"
                  ? "text-right"
                  : col.align === "center"
                  ? "text-center"
                  : ""
              }`}
            >
              {col.label}
            </TableHead>
          ))}
          {showActions && (
            <TableHead className="text-right font-bold">Ações</TableHead>
          )}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={row.id ?? rowIndex} className="hover:bg-muted/50">
            {bulkMode && (
              <TableCell className="text-center py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(row.id)}
                  onChange={() => toggleOne(row.id)}
                />
              </TableCell>
            )}
            {columns.map((col) => (
              <TableCell
                key={`cell-${row.id}-${String(col.key)}`}
                className={`${
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : ""
                }`}
              >
                {col.render ? col.render(row) : String(row[col.key] ?? "")}
              </TableCell>
            ))}

            {showActions && (
              <TableCell className="text-right">
                {bulkMode ? (
                  <Button variant="ghost" size="icon" disabled>
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(row)}>
                          Editar
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(row)}
                        >
                          Deletar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>

      {data.length > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={columns.length - 1 + (bulkMode ? 1 : 0)}
            ></TableCell>

            <TableCell className="font-bold text-right py-2">
              Total:{" "}
              {totalAmount.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </TableCell>

            {showActions && <TableCell></TableCell>}
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
