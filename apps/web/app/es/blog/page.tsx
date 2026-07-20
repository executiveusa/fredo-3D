import type { Metadata } from "next";
import BlogIndexPage from "../../../components/BlogIndexPage";

export const metadata: Metadata = { title: "Blog", description: "Archivo verificado de Fredo 3D: prensa histórica, proceso y guías de coleccionismo." };

export default function Page() {
  return <BlogIndexPage locale="es" />;
}
