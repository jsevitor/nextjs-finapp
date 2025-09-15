import { List, Settings, User2Icon } from "lucide-react";
import Header from "../components/common/Header";
import HeaderTitle from "../components/common/HeaderTitle";
import PageContainer from "../components/layout/PageContainer";

export default function SettingsPage() {
  const sections = [
    {
      title: "Perfis de Usuários",
      href: "/configuracoes/perfis",
      icon: User2Icon,
    },
    {
      title: "Categorias",
      href: "/configuracoes/categorias",
      icon: List,
    },
  ];
  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Configurações">
          <Settings className="h-8 w-8" />
        </HeaderTitle>
      </Header>

      <section className="mt-4">
        <div className="flex flex-col gap-2">
          {sections.map((section) => (
            <a
              key={section.title}
              className="flex ite gap-2 p-4 border rounded-2xl overflow-hidden cursor-pointer hover:bg-muted hover:underline"
              href={section.href}
            >
              <section.icon className="h-6 w-6" />
              <h2 className="text-lg font-medium">{section.title}</h2>
            </a>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
