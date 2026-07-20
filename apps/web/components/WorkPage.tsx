import Link from "next/link";
import Image from "next/image";
import type { Artwork, Locale } from "../lib/content";
import { availabilityLabel, categoryLabels, waLink, workImage, workLabel } from "../lib/content";
import { routes, t } from "../lib/i18n";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

export default function WorkPage({ work, locale }: { work: Artwork; locale: Locale }) {
  const es = locale === "es";
  const label = workLabel(work, locale);
  const unknown = t.work.unknown[locale];
  const waMsg = es
    ? `Hola Fredo, me interesa la obra "${label}" (${work.id}) que vi en fredo3d.com.`
    : `Hi Fredo, I'm interested in the work "${label}" (${work.id}) I saw on fredo3d.com.`;

  return (
    <>
      <SiteNav locale={locale} />
      <main id="main" className="container">
        <div className="work-layout">
          <div className="art-frame">
            <Image
              src={workImage(work)}
              alt={work.alt[locale]}
              width={1000}
              height={1000}
              sizes="(max-width: 900px) 94vw, 60vw"
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </div>
          <div className="work-meta">
            <p className="chapter-kicker">{categoryLabels[work.category]?.[locale] ?? work.category}</p>
            <h1 style={{ fontWeight: 400, fontSize: "1.8rem", marginTop: 0 }}>{label}</h1>
            <dl>
              <dt>{t.work.metaYear[locale]}</dt>
              <dd>{work.year ?? unknown}</dd>
              <dt>{t.work.metaMedium[locale]}</dt>
              <dd>{work.medium ?? unknown}</dd>
              <dt>{t.work.metaDims[locale]}</dt>
              <dd>{work.dimensions ?? unknown}</dd>
              <dt>{t.work.metaAvail[locale]}</dt>
              <dd>{availabilityLabel(work, locale)}</dd>
            </dl>
            {(!work.title || !work.year || !work.medium) && (
              <p className="note">{t.work.untitledNote[locale]}</p>
            )}
            <div className="btn-row">
              {work.commerce.offersEnabled && (
                <Link href={`${routes.commissions[locale]}?flow=offer&work=${work.id}`} className="btn btn-solid">
                  {t.cta.offer[locale]}
                </Link>
              )}
              <a href={waLink(waMsg)} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
                {t.cta.whatsapp[locale]}
              </a>
              <Link href={`${routes.commissions[locale]}?flow=commission`} className="btn">
                {es ? "Encargar una obra similar" : "Commission a similar work"}
              </Link>
            </div>
            <p style={{ marginTop: "2rem" }}>
              <Link href={routes.gallery[locale]}>{t.work.back[locale]}</Link>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
