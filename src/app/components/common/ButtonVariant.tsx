import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import React from "react";

type ButtonVariantProps = {
  typeAction?: "save" | "close" | "add" | "edit" | "delete";
  action?: () => void;
  label?: string;
  icon?: React.ReactNode; // <- Corrigido: não é string
  className?: string;
};

export function ButtonVariant({
  typeAction = "save",
  action,
  label,
  icon,
  className,
}: ButtonVariantProps) {
  const base = "px-4 py-1 rounded-lg cursor-pointer";

  // Variações de estilos (mapeadas para variantes do componente Button)
  const variants: Record<
    NonNullable<ButtonVariantProps["typeAction"]>,
    "default" | "destructive" | "ghost"
  > = {
    save: "default",
    close: "destructive",
    add: "default",
    edit: "ghost",
    delete: "ghost",
  };

  const defaultLabels: Record<
    NonNullable<ButtonVariantProps["typeAction"]>,
    string
  > = {
    save: "Salvar",
    close: "Fechar",
    add: "Adicionar",
    edit: "Editar",
    delete: "Deletar",
  };

  const defaultIcons: Record<
    NonNullable<ButtonVariantProps["typeAction"]>,
    React.ReactNode
  > = {
    save: null,
    close: null,
    add: <Plus size={16} />,
    edit: <Pencil size={16} />,
    delete: <Trash size={16} />,
  };

  const finalLabel = label ?? defaultLabels[typeAction];
  const finalIcon = icon ?? defaultIcons[typeAction];
  const variant = variants[typeAction];

  return (
    <Button
      variant={variant}
      className={`${base} ${className ?? ""}`}
      onClick={action}
    >
      {finalIcon && <span className="mr-2">{finalIcon}</span>}
      {finalLabel}
    </Button>
  );
}
