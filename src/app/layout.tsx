import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://lorenzoalvesnunes.github.io"),
  title: "Lumen Scriptura | Estudo Biblico Premium",
  description: "Plataforma premium de estudo biblico profundo com login, progresso, devocionais, quizzes e IA.",
  openGraph: {
    title: "Lumen Scriptura | Estudo Biblico Premium",
    description: "Estude a Biblia inteira em uma experiencia cinematografica e personalizada.",
    images: ["/assets/cinematic-bible-hero.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
