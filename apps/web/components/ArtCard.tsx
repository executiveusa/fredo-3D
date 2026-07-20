import Link from "next/link";
import Image from "next/image";
import type { Artwork, Locale } from "../lib/content";
import { workImage, workLabel } from "../lib/content";
import { routes, t } from "../lib/i18n";

export default function ArtCard({ work, locale, sizes = "(max-width: 700px) 90vw, 30vw" }: { work: Artwork; locale: Locale; sizes?: string }) {
  return (
    <Link href={`${routes.artwork[locale]}/${work.id}`} className="art-card">
      <figure>
        <div className="art-frame">
          <Image src={workImage(work)} alt={work.alt[locale]} width={600} height={600} sizes={sizes} style={{ width: "100%", height: "auto" }} />
        </div>
        <figcaption>
          <span>{workLabel(work, locale)}</span>
          <span className="view-tag" aria-hidden="true">{t.cta.view[locale]} →</span>
        </figcaption>
      </figure>
    </Link>
  );
}
