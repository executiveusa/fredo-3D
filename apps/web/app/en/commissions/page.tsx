import type { Metadata } from "next";
import IntakePage from "../../../components/IntakePage";

export const metadata: Metadata = { title: "Commissions and projects", description: "Commission a work, propose a mural, or license Fredo 3D's art." };

export default async function Page({ searchParams }: { searchParams: Promise<{ flow?: string; work?: string }> }) {
  const { flow, work } = await searchParams;
  return <IntakePage locale="en" flow={flow} work={work} />;
}
