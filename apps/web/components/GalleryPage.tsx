import type { Locale } from "../lib/content";
import { categoryLabels, galleryWorks } from "../lib/content";
import { t } from "../lib/i18n";
import SubPageShell from "./SubPageShell";
import SiteFooter from "./SiteFooter";
import ArtCard from "./ArtCard";

export default function GalleryPage({ locale, category }: { locale: Locale; category?: string }) {
  const works = galleryWorks();
  const cats = [...new Set(works.map((w) => w.category))];
  const active = category && cats.includes(category) ? category : null;
  const shown = active ? works.filter((w) => w.category === active) : works;
  const base = locale === "es" ? "/es/galeria" : "/en/gallery";

  return (
    <SubPageShell locale={locale}>
      <div className="container" style={{ paddingTop: "var(--sp-7)" }}>
        <div className="page-head">
          <p className="chapter-kicker">{t.gallery.title[locale]}</p>
          <h1>{t.gallery.title[locale]}</h1>
          <p className="lead">{t.gallery.intro[locale]}</p>
          <nav className="filter-row" aria-label={locale === "es" ? "Filtrar por categoría" : "Filter by category"}>
            <a href={base} aria-current={!active ? "true" : undefined}>{t.gallery.all[locale]}</a>
            {cats.map((c) => (
              <a key={c} href={`${base}?c=${c}`} aria-current={active === c ? "true" : undefined}>
                {categoryLabels[c]?.[locale] ?? c}
              </a>
            ))}
          </nav>
        </div>
        <div className="gallery-grid">
          {shown.map((w) => (
            <ArtCard key={w.id} work={w} locale={locale} />
          ))}
        </div>
      </div>
      <SiteFooter locale={locale} />
    </SubPageShell>
  );
}
