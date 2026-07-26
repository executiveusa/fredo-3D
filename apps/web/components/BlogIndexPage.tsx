import Link from "next/link";
import type { Locale } from "../lib/content";
import { collectionLabels, formatDate, posts } from "../lib/blog";
import { routes, t } from "../lib/i18n";
import SubPageShell from "./SubPageShell";
import SiteFooter from "./SiteFooter";

export default function BlogIndexPage({ locale }: { locale: Locale }) {
  return (
    <SubPageShell locale={locale}>
      <div className="container" style={{ paddingTop: "var(--sp-7)" }}>
        <div className="page-head">
          <p className="chapter-kicker">{t.blog.title[locale]}</p>
          <h1>{t.blog.title[locale]}</h1>
          <p className="lead">{t.blog.intro[locale]}</p>
        </div>
        <div className="post-list">
          {posts.map((p) => (
            <article key={p.slug} className="post-card">
              <span className="post-collection">{collectionLabels[p.collection]?.[locale] ?? p.collection}</span>
              <Link href={`${routes.blog[locale]}/${p.slug}`}>
                <h2>{p.title[locale]}</h2>
              </Link>
              <p className="lead" style={{ fontSize: "1rem", fontStyle: "normal" }}>{p.excerpt[locale]}</p>
              <p className="post-meta">
                {p.sourcePublishedAt
                  ? `${t.blog.originally[locale]} ${formatDate(p.sourcePublishedAt, locale)} · `
                  : ""}
                {t.blog.published[locale]} {formatDate(p.publishedAt, locale)}
              </p>
            </article>
          ))}
        </div>
      </div>
      <SiteFooter locale={locale} />
    </SubPageShell>
  );
}
