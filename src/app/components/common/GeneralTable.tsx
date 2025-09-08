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
import { MoreHorizontal } from "lucide-react";
import { Column } from "@/app/types/tableColumns";

type GeneralTableProps<T> = {
  caption?: string;
  columns: Column<T>[];
  data: T[];
  showActions?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
};

export function GeneralTable<T extends { id: string }>({
  caption,
  columns,
  data,
  showActions = true,
  onEdit,
  onDelete,
}: GeneralTableProps<T>) {
  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}

      <TableHeader className="bg-muted">
        <TableRow>
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
          {showActions && <TableHead className="text-right">Ações</TableHead>}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell
                key={`${row.id}-${String(col.key)}`}
                className={`${
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : ""
                }`}
              >
                {col.render ? col.render(row) : String(row[col.key])}
              </TableCell>
            ))}

            {showActions && (
              <TableCell className="text-right">
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
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
