import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostPage from "../../../../components/BlogPostPage";
import { getPost, posts } from "../../../../lib/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title.en,
    description: post.excerpt.en,
    other: post.sourcePublishedAt ? { "article:source-published": post.sourcePublishedAt } : undefined,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <BlogPostPage post={post} locale="en" />;
}
