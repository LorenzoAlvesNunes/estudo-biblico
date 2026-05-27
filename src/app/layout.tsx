import type { Metadata, Viewport } from "next";
import "../styles/index.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://lorenzoalvesnunes.github.io"),
  title: "Lumen Scriptura | Estudo Biblico Premium",
  description: "Plataforma premium de estudo biblico profundo com login, progresso, devocionais, quizzes e IA.",
  manifest: `${basePath}/site.webmanifest`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lumen"
  },
  icons: {
    icon: `${basePath}/favicon.svg`,
    apple: `${basePath}/icon-192.png`
  },
  openGraph: {
    title: "Lumen Scriptura | Estudo Biblico Premium",
    description: "Estude a Biblia inteira em uma experiencia cinematografica e personalizada.",
    images: ["/assets/cinematic-bible-hero.png"]
  }
};

export const viewport: Viewport = {
  themeColor: "#050505"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
