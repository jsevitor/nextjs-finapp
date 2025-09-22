import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSessionStore } from "@/stores/sessionStore";
import { useEffect, useState } from "react";

export default function WelcomeCard() {
  const [currentDate, setCurrentDate] = useState("");
  const { user } = useSessionStore((state) => state.session);

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(formatted);
  }, []);
  return (
    <Card className="lg:flex-row gap-1 lg:justify-between rounded-md items-center py-3 md:w-full lg:h-10">
      <CardHeader className="w-full">
        <CardTitle className="mt-2">
          Bem-vindo, {user?.name?.split(" ")[0]}!
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex lg:justify-end">
        <p className="w-full text-center lg:text-right text-foreground/50">
          {currentDate}
        </p>
      </CardContent>
    </Card>
  );
}
