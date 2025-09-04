import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

type DialogAddProps = {
  title: string;
  description?: string;
  triggerLabel?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  icon?: ReactNode;
};

export function DialogAdd({
  title,
  description,
  triggerLabel = "Adicionar",
  children,
  actions,
  className,
  icon = <Plus />,
}: DialogAddProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" className={className}>
          {icon}
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}

        <DialogFooter className="jus">
          <DialogClose asChild>
            <Button variant="destructive" className="w-1/3">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" className="w-1/3">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
