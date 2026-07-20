import Link from "next/link";
import type { Locale } from "../lib/content";
import { collectionLabels, formatDate, posts } from "../lib/blog";
import { routes, t } from "../lib/i18n";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

export default function BlogIndexPage({ locale }: { locale: Locale }) {
  return (
    <>
      <SiteNav locale={locale} />
      <main id="main" className="container">
        <div className="page-head">
          <h1>{t.blog.title[locale]}</h1>
          <p>{t.blog.intro[locale]}</p>
        </div>
        <div className="post-list">
          {posts.map((p) => (
            <article key={p.slug} className="post-card">
              <span className="post-collection">{collectionLabels[p.collection]?.[locale] ?? p.collection}</span>
              <Link href={`${routes.blog[locale]}/${p.slug}`}>
                <h2>{p.title[locale]}</h2>
              </Link>
              <p>{p.excerpt[locale]}</p>
              <p className="post-meta">
                {p.sourcePublishedAt
                  ? `${t.blog.originally[locale]} ${formatDate(p.sourcePublishedAt, locale)} · `
                  : ""}
                {t.blog.published[locale]} {formatDate(p.publishedAt, locale)}
              </p>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
