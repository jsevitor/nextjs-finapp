import { ChevronLeftIcon, Settings, User2Icon } from "lucide-react";
import Header from "../components/common/Header";
import HeaderTitle from "../components/common/HeaderTitle";
import PageContainer from "../components/layout/PageContainer";

export default function SettingsPage() {
  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Configurações">
          <Settings className="h-8 w-8" />
        </HeaderTitle>
      </Header>

      <section className="mt-4">
        <a
          className="flex ite gap-2 p-4 border rounded-2xl overflow-hidden cursor-pointer hover:bg-muted hover:underline"
          href="/configuracoes/perfis"
        >
          <User2Icon className="h-6 w-6" />
          <h2 className="text-lg font-medium">Perfis de Usuários</h2>
        </a>
      </section>
    </PageContainer>
  );
}
