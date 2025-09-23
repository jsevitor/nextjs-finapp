import Header from "../components/common/Header";
import HeaderTitle from "../components/common/HeaderTitle";
import { Column } from "../types/tableColumns";
import { TrendingUp } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";

export default function Income() {
  // const income = [
  //   {
  //     id: 1,
  //     date: "2023-09-01",
  //     author: "Vitor",
  //     source: "Salário",
  //     description: "Pagamento mensal",
  //     category: "Trabalho",
  //     amount: "$5,000.00",
  //   },
  //   {
  //     id: 2,
  //     date: "2023-09-05",
  //     author: "João",
  //     source: "Freelance",
  //     description: "Projeto de design",
  //     category: "Serviços",
  //     amount: "$1,200.00",
  //   },
  // ];

  // const columns: Column<(typeof income)[0]>[] = [
  //   { key: "date", label: "Data" },
  //   { key: "author", label: "Autor" },
  //   { key: "source", label: "Fonte" },
  //   { key: "description", label: "Descrição" },
  //   { key: "category", label: "Categoria" },
  //   { key: "amount", label: "Valor", align: "right" },
  // ];

  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Receitas">
          <TrendingUp className="h-8 w-8" />
        </HeaderTitle>
      </Header>
    </PageContainer>
  );
}
