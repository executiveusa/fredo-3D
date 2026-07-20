import type { Metadata } from "next";
import IntakePage from "../../../components/IntakePage";

export const metadata: Metadata = { title: "Encargos y proyectos", description: "Encarga una obra, propone un mural o licencia el arte de Fredo 3D." };

export default async function Page({ searchParams }: { searchParams: Promise<{ flow?: string; work?: string }> }) {
  const { flow, work } = await searchParams;
  return <IntakePage locale="es" flow={flow} work={work} />;
}
