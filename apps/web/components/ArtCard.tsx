import Link from "next/link";
import type { Artwork, Locale } from "../lib/content";
import { workImage, workLabel } from "../lib/content";
import { routes, t } from "../lib/i18n";

export default function ArtCard({ work, locale }: { work: Artwork; locale: Locale }) {
  return (
    <Link
      href={`${routes.artwork[locale]}/${work.id}`}
      className="art-card"
      data-cursor-label={t.cta.view[locale]}
    >
      <div className="art-frame">
        <img
          src={workImage(work)}
          alt={work.alt[locale]}
          loading="lazy"
          style={{ width: "100%", height: "auto" }}
        />
        <span className="view-tag">{t.cta.view[locale]}</span>
      </div>
      <div className="art-caption">
        <span>{workLabel(work, locale)}</span>
        <span>{work.category}</span>
      </div>
    </Link>
  );
}
