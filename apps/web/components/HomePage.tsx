import Link from "next/link";
import type { Locale } from "../lib/content";
import { galleryWorks, waLink } from "../lib/content";
import { routes, t } from "../lib/i18n";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import ArtCard from "./ArtCard";
import Reveal from "./Reveal";
import CursorDot from "./CursorDot";
import SoundSlot from "./SoundSlot";

function pick(ids: string[]) {
  const all = galleryWorks();
  return ids.map((id) => all.find((w) => w.id === id)).filter((w): w is NonNullable<typeof w> => Boolean(w));
}

export default function HomePage({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const anamorphic = pick(["obra-03", "obra-05", "obra-10"]);
  const impossible = pick(["obra-04", "obra-09", "obra-15"]);
  const worlds = pick(["obra-08", "obra-16", "obra-11"]);

  return (
    <>
      <SiteNav locale={locale} />
      <CursorDot />
      <main id="main">
        {/* 01 THRESHOLD */}
        <header className="hero chapter-graphite">
          <SoundSlot chapter="threshold" />
          <svg className="hero-line draw-line" viewBox="0 0 420 60" fill="none" aria-hidden="true">
            <path d="M5 45 C 80 10, 150 55, 210 30 S 340 15, 415 40" stroke="#4a4a4a" strokeWidth="1.6" />
          </svg>
          <h1>FREDO 3D</h1>
          <p className="hero-tagline">{t.hero.tagline[locale]}</p>
          <div className="hero-actions">
            <a href="#ch-2" className="btn btn-solid">{t.hero.scroll[locale]} ↓</a>
            <Link href={routes.gallery[locale]} className="btn">{t.hero.toGallery[locale]}</Link>
          </div>
        </header>

        {/* 02 THE LINE LEAVES THE PAGE */}
        <section id="ch-2" className="chapter chapter-bone" aria-labelledby="ch2h">
          <div className="container">
            <Reveal>
              <p className="chapter-kicker">02 · {es ? "Anamórficos" : "Anamorphic"}</p>
              <h2 id="ch2h">{t.chapters.ch2t[locale]}</h2>
              <p className="chapter-lead">{t.chapters.ch2p[locale]}</p>
            </Reveal>
            <div className="art-row">
              {anamorphic.map((w) => (
                <Reveal key={w.id}><ArtCard work={w} locale={locale} /></Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 03 INSIDE THE IMPOSSIBLE */}
        <section className="chapter chapter-dream" aria-labelledby="ch3h">
          <div className="container">
            <Reveal>
              <p className="chapter-kicker">03 · {es ? "Surrealismo" : "Surreal"}</p>
              <h2 id="ch3h">{t.chapters.ch3t[locale]}</h2>
              <p className="chapter-lead">{t.chapters.ch3p[locale]}</p>
            </Reveal>
            <div className="art-row">
              {impossible.map((w) => (
                <Reveal key={w.id}><ArtCard work={w} locale={locale} /></Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 04 THE WORLDS INSIDE */}
        <section className="chapter chapter-water" aria-labelledby="ch4h">
          <div className="container">
            <Reveal>
              <p className="chapter-kicker">04 · {es ? "Pintura y sueño" : "Paint and dream"}</p>
              <h2 id="ch4h">{t.chapters.ch4t[locale]}</h2>
              <p className="chapter-lead">{t.chapters.ch4p[locale]}</p>
            </Reveal>
            <div className="art-row">
              {worlds.map((w) => (
                <Reveal key={w.id}><ArtCard work={w} locale={locale} /></Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 05 THE HUMAN */}
        <section className="chapter chapter-graphite" aria-labelledby="ch5h">
          <div className="container">
            <Reveal>
              <p className="chapter-kicker">05 · Wladimir Inostroza</p>
              <h2 id="ch5h">{t.chapters.ch5t[locale]}</h2>
              <p className="chapter-lead">{t.chapters.ch5bio[locale]}</p>
              <blockquote style={{ borderLeft: "3px solid var(--dream-rust)", paddingLeft: "1.2rem", fontStyle: "italic" }}>
                {t.chapters.ch5quote[locale]}
              </blockquote>
            </Reveal>
          </div>
        </section>

        {/* 06 THE ARCHIVE */}
        <section className="chapter chapter-museum" aria-labelledby="ch6h">
          <div className="container">
            <Reveal>
              <p className="chapter-kicker">06 · {es ? "Archivo" : "Archive"}</p>
              <h2 id="ch6h">{t.chapters.ch6t[locale]}</h2>
              <p className="chapter-lead">{t.chapters.ch6p[locale]}</p>
              <ul className="timeline">
                <li><span className="year">2010</span><span>{es ? "Primer registro de prensa (BioBioChile) y primera entrevista internacional (My Modern Met)." : "First press record (BioBioChile) and first international interview (My Modern Met)."}</span></li>
                <li><span className="year">2013</span><span>{es ? "Perfil en TVN; reportajes anamórficos en TwistedSifter y Amusing Planet." : "TVN profile; anamorphic features on TwistedSifter and Amusing Planet."}</span></li>
                <li><span className="year">{es ? "Hoy" : "Today"}</span><span>{es ? "Activo en Instagram y Facebook; nuevo trabajo en desarrollo." : "Active on Instagram and Facebook; new work in development."}</span></li>
              </ul>
              <div className="btn-row">
                <Link href={routes.blog[locale]} className="btn">{t.cta.blogArchive[locale]}</Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 07 OWN PART OF THE WORLD */}
        <section className="chapter chapter-bone" aria-labelledby="ch7h">
          <div className="container">
            <Reveal>
              <p className="chapter-kicker">07 · {es ? "Originales" : "Originals"}</p>
              <h2 id="ch7h">{t.chapters.ch7t[locale]}</h2>
              <p className="chapter-lead">{t.chapters.ch7p[locale]}</p>
              <div className="btn-row">
                <Link href={routes.gallery[locale]} className="btn btn-solid">{t.cta.gallery[locale]}</Link>
                <Link href={`${routes.commissions[locale]}?flow=offer`} className="btn">{t.cta.offer[locale]}</Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 08 BRING FREDO INTO YOUR WORLD */}
        <section className="chapter chapter-dream" aria-labelledby="ch8h">
          <div className="container">
            <Reveal>
              <p className="chapter-kicker">08 · {es ? "Proyectos" : "Projects"}</p>
              <h2 id="ch8h">{t.chapters.ch8t[locale]}</h2>
              <p className="chapter-lead">{t.chapters.ch8p[locale]}</p>
              <div className="btn-row">
                <Link href={`${routes.commissions[locale]}?flow=commission`} className="btn">{t.cta.commission[locale]}</Link>
                <Link href={`${routes.commissions[locale]}?flow=mural`} className="btn">{es ? "Proponer un mural" : "Propose a mural"}</Link>
                <Link href={`${routes.commissions[locale]}?flow=licensing`} className="btn">{t.cta.license[locale]}</Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 09 FINAL INVITATION */}
        <section className="chapter chapter-graphite" aria-labelledby="ch9h">
          <div className="container" style={{ textAlign: "center" }}>
            <Reveal>
              <p className="chapter-kicker">09</p>
              <h2 id="ch9h">{t.chapters.ch9t[locale]}</h2>
              <p className="chapter-lead" style={{ margin: "0 auto" }}>{t.chapters.ch9p[locale]}</p>
              <div className="btn-row" style={{ justifyContent: "center" }}>
                <Link href={routes.gallery[locale]} className="btn btn-solid">{t.cta.gallery[locale]}</Link>
                <a
                  href={waLink(es ? "Hola Fredo, vi tu sitio y me interesa tu obra." : "Hi Fredo, I saw your site and I'm interested in your work.")}
                  className="btn btn-wa"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.cta.whatsapp[locale]}
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
