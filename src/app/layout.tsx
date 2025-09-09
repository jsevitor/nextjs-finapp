import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/layout/AppSidebar";
import AuthSessionProvider from "@/components/auth/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const redHatDisplay = Red_Hat_Display({
  variable: "--font-red-hat-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "FinApp",
  description: "A personal finance app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${redHatDisplay.className} antialiased`}>
        <AuthSessionProvider>
          {session ? (
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full p-4 2xl:px-8">{children}</main>
            </SidebarProvider>
          ) : (
            <main className="w-full p-4 2xl:px-8">{children}</main>
          )}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
