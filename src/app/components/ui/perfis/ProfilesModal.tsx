import { ProfilesModalProps } from "@/types/modal";
import { Modal } from "../../layout/Modal";
import HeaderModal from "../../common/HeaderModal";
import { Profile } from "@/stores/profileStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfilesModal({
  isOpen,
  profile,
  onChange,
  onClose,
  onSubmit,
}: ProfilesModalProps) {
  if (!profile) return null;

  const handleChange = (field: keyof Profile, value: string | number) => {
    onChange({ ...profile, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <HeaderModal title={profile.id ? "Editar Perfil" : "Adicionar Perfil"} />

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="grid gap-3 col-span-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="col-span-2 flex justify-center mt-4">
          <Button
            type="button"
            className="mr-4 w-1/2 lg:w-1/3"
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 w-1/2 lg:w-1/3"
          >
            {profile.id ? "Salvar" : "Adicionar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
