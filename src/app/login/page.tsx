"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession();

  if (session) {
    return redirect("/");
  }

  return (
    <div className="container mx-auto h-screen flex flex-col lg:flex-row justify-center items-center">
      <div className="border bg-primary lg:h-1/2 rounded-t-2xl lg:rounded-t-none lg:rounded-l-2xl shadow-md lg:w-1/3 flex flex-col items-center justify-center gap-4 p-8 text-white">
        <h1 className="font-bold lg:text-4xl">FINAPP</h1>
      </div>

      <div className="border h-1/3 lg:h-1/2 rounded-b-2xl lg:rounded-b-none lg:rounded-r-2xl shadow-md lg:w-1/3 flex flex-col items-center justify-center gap-4 p-8">
        <h2 className="font-bold lg:text-2xl">LOGIN</h2>

        <Button onClick={() => signIn("google")}>Entrar com Google</Button>
      </div>
    </div>
  );
}
