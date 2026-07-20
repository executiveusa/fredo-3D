import type { Metadata } from "next";
import BlogIndexPage from "../../../components/BlogIndexPage";

export const metadata: Metadata = { title: "Blog", description: "The verified Fredo 3D archive: historical press, process, and collector guides." };

export default function Page() {
  return <BlogIndexPage locale="en" />;
}
