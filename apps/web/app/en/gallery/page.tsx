import type { Metadata } from "next";
import GalleryPage from "../../../components/GalleryPage";

export const metadata: Metadata = { title: "Gallery", description: "Works by Fredo 3D: anamorphic drawings, graphite, surrealism, and painting." };

export default async function Page({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  return <GalleryPage locale="en" category={c} />;
}
