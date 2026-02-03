import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Hoomly AI - Busca de apartamentos com inteligência artificial",
  description:
    "Encontre seu apartamento ideal com IA. Automatize sua busca e receba notificações dos melhores matches.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
