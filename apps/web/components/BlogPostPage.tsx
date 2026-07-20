import Link from "next/link";
import type { Locale } from "../lib/content";
import type { BlogPost } from "../lib/blog";
import { collectionLabels, formatDate } from "../lib/blog";
import { galleryWorks } from "../lib/content";
import { routes, t } from "../lib/i18n";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import ArtCard from "./ArtCard";

function renderBlock(block: string, i: number) {
  if (block.startsWith("## ")) return <h2 key={i}>{block.slice(3)}</h2>;
  if (block.startsWith("> ")) return <blockquote key={i}>{block.slice(2)}</blockquote>;
  return <p key={i}>{block}</p>;
}

export default function BlogPostPage({ post, locale }: { post: BlogPost; locale: Locale }) {
  const related = galleryWorks().filter((w) => post.relatedWorks.includes(w.id));
  return (
    <>
      <SiteNav locale={locale} />
      <main id="main" className="container">
        <article className="post-body">
          <div className="page-head" style={{ paddingBottom: 0 }}>
            <span className="post-collection">{collectionLabels[post.collection]?.[locale] ?? post.collection}</span>
            <h1>{post.title[locale]}</h1>
            <p className="post-meta">
              {post.sourcePublishedAt
                ? `${t.blog.originally[locale]} ${formatDate(post.sourcePublishedAt, locale)} · `
                : ""}
              {t.blog.published[locale]} {formatDate(post.publishedAt, locale)}
            </p>
          </div>
          {post.body[locale].map(renderBlock)}
          {post.sourceUrl && (
            <div className="source-box">
              {t.blog.source[locale]}:{" "}
              <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer">
                {post.sourceTitle}
              </a>
            </div>
          )}
          {related.length > 0 && (
            <>
              <h2>{t.blog.related[locale]}</h2>
              <div className="art-row">
                {related.map((w) => (
                  <ArtCard key={w.id} work={w} locale={locale} />
                ))}
              </div>
            </>
          )}
          <p style={{ marginTop: "2.5rem" }}>
            <Link href={routes.blog[locale]}>{t.blog.back[locale]}</Link>
          </p>
        </article>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
