import type { Metadata } from "next";
import { Fraunces, Newsreader, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "../components/SmoothScroll";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const body = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "FREDO 3D — Entre el papel y lo imposible", template: "%s · FREDO 3D" },
  description:
    "El mundo del artista chileno Fredo 3D (Wladimir Inostroza): dibujos anamórficos, obra surrealista, galería, encargos y archivo.",
  metadataBase: new URL("https://fredo3d.com"),
  alternates: {
    languages: { es: "/es", en: "/en" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`js ${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
