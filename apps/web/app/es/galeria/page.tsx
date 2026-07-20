import type { Metadata } from "next";
import GalleryPage from "../../../components/GalleryPage";

export const metadata: Metadata = { title: "Galería", description: "Obras de Fredo 3D: dibujos anamórficos, grafito, surrealismo y pintura." };

export default async function Page({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  return <GalleryPage locale="es" category={c} />;
}
