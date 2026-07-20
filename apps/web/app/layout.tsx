import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "FREDO 3D — Entre el papel y lo imposible", template: "%s · FREDO 3D" },
  description:
    "El mundo del artista chileno Fredo 3D (Wladimir Inostroza): dibujos anamórficos, obra surrealista, galería, encargos y archivo.",
  metadataBase: new URL("https://fredo3d.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="js">
      <body>{children}</body>
    </html>
  );
}
