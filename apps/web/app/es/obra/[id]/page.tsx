import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkPage from "../../../../components/WorkPage";
import { galleryWorks, getWork, workLabel } from "../../../../lib/content";

export function generateStaticParams() {
  return galleryWorks().map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const work = getWork(id);
  if (!work) return {};
  return { title: workLabel(work, "es"), description: work.alt.es };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const work = getWork(id);
  if (!work) notFound();
  return <WorkPage work={work} locale="es" />;
}
