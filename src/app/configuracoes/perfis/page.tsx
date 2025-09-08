"use client";

import { ButtonVariant } from "@/app/components/common/ButtonVariant";
import { GeneralTable } from "@/app/components/common/GeneralTable";
import Header from "@/app/components/common/Header";
import HeaderTitle from "@/app/components/common/HeaderTitle";
import PageContainer from "@/app/components/layout/PageContainer";
import ProfilesModal from "@/app/components/ui/perfis/ProfilesModal";
import { Column } from "@/app/types/tableColumns";
import { Profile, useProfileStore } from "@/stores/profileStore";
import { formatDateBR } from "@/utils/format";
import { ChevronLeftIcon, User2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfilesPage() {
  const { profiles, fetchProfiles, addProfile, updateProfile, removeProfile } =
    useProfileStore();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleOpenAddModal = () => {
    setIsBeingEdited({
      id: "",
      name: "",
      userId: "",
      createdAt: new Date(),
    });
    setModalIsOpen(true);
  };

  const handleSubmit = async (profile: Profile) => {
    try {
      if (!profile.id) {
        await addProfile(profile);
      } else {
        await updateProfile(profile);
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    } finally {
      setModalIsOpen(false);
      setIsBeingEdited(null);
      await fetchProfiles();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeProfile(id);
    } catch (error) {
      console.error("Erro ao excluir perfil:", error);
    } finally {
      await fetchProfiles();
    }
  };

  const columns: Column<Profile>[] = [
    { label: "ID", key: "id" },
    { label: "Nome", key: "name" },
    {
      label: "Criado em",
      key: "createdAt",
      render: (row) => formatDateBR(row.createdAt),
    },
  ];

  return (
    <PageContainer>
      <Header>
        <div className="flex items-end gap-4">
          <a href="/configuracoes">
            <ChevronLeftIcon className="h-8 w-8 cursor-pointer hover:text-muted-foreground" />
          </a>
          <HeaderTitle title="Perfis">
            <User2 className="h-8 w-8" />
          </HeaderTitle>
        </div>
        <ButtonVariant typeAction="add" action={handleOpenAddModal} />
        <ProfilesModal
          isOpen={modalIsOpen}
          profile={isBeingEdited}
          onChange={setIsBeingEdited}
          onClose={() => setModalIsOpen(false)}
          onSubmit={handleSubmit}
        />
      </Header>

      <div className="border rounded-2xl overflow-hidden">
        <GeneralTable
          caption="Lista de perfis"
          columns={columns}
          data={profiles}
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
