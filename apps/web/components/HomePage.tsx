import Link from "next/link";
import type { Locale } from "../lib/content";
import { galleryWorks, waLink } from "../lib/content";
import { routes, t } from "../lib/i18n";
import ThresholdHero from "./ThresholdHero";
import PencilCursor from "./PencilCursor";
import Reveal from "./Reveal";
import SiteFooter from "./SiteFooter";

function pick(ids: string[]) {
  const all = galleryWorks();
  return ids.map((id) => all.find((w) => w.id === id)).filter(Boolean) as ReturnType<typeof galleryWorks>;
}

export default function HomePage({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const anamorphic = pick(["obra-03", "obra-05", "obra-10"]);
  const impossible = pick(["obra-04", "obra-09", "obra-15"]);
  const worlds = pick(["obra-08", "obra-16", "obra-11"]);
  const originals = pick(["obra-03", "obra-05", "obra-08", "obra-16"]);

  return (
    <>
      <PencilCursor />

      <nav className="nav-fixed" aria-label={es ? "Navegación" : "Navigation"}>
        <a href="#threshold" className="wordmark" style={{ textDecoration: "none" }}>
          FREDO<span className="dot">·</span>3D
        </a>
        <div className="nav-links">
          <Link href={routes.gallery[locale]}>{t.nav.gallery[locale]}</Link>
          <Link href={routes.blog[locale]}>{t.nav.blog[locale]}</Link>
          <Link href={routes.commissions[locale]}>{t.nav.commissions[locale]}</Link>
          <Link href={routes.home[es ? "en" : "es"]} aria-label={t.nav.switchAria[locale]}>
            {es ? "EN" : "ES"}
          </Link>
        </div>
      </nav>

      <a
        href="https://wa.me/56993838223?text=Hola%20Fredo%2C%20acabo%20de%20ver%20tu%20sitio."
        className="wa-fab"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5 4.5.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.2-.6-.4z" />
          <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18.3c-1.5 0-3-.4-4.3-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.3 8.3 0 1 1 12 20.3z" />
        </svg>
        WhatsApp
      </a>

      <main id="main">
        <ThresholdHero locale={locale} />

        <section id="ch-2" className="chapter" aria-labelledby="ch2h">
          <div className="container">
            <Reveal>
              <p className="chapter-kicker">02 · {es ? "Anamórficos" : "Anamorphic"}</p>
              <h2 id="ch2h">{t.chapters.ch2t[locale]}</h2>
              <p className="lead">{t.chapters.ch2p[locale]}</p>
            </Reveal>
            <div className="art-row">
              {anamorphic.map((w) => (
                <Reveal key={w.id}>
                  <a
                    href={`${routes.artwork[locale]}/${w.id}`}
                    className="art-card"
                    data-cursor-label={es ? "VER" : "VIEW"}
                  >
                    <div className="art-frame">
                      <img src={`/art/${w.id}.jpg`} alt={w.alt[locale]} loading="lazy" />
                      <span className="view-tag">{t.cta.view[locale]}</span>
                    </div>
                    <div className="art-caption">
                      <span>{w.id.replace("obra-", "Obra ")}</span>
                      <span>{w.category}</span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter chapter-dream" aria-labelledby="ch3h">
          <div className="container">
            <Reveal>
              <p className="chapter-kicker">03 · {es ? "Surrealismo" : "Surreal"}</p>
              <h2 id="ch3h">{t.chapters.ch3t[locale]}</h2>
              <p className="lead">{t.chapters.ch3p[locale]}</p>
            </Reveal>
            <div className="art-row">
              {impossible.map((w) => (
                <Reveal key={w.id}>
                  <a
                    href={`${routes.artwork[locale]}/${w.id}`}
                    className="art-card"
                    data-cursor-label={es ? "VER" : "VIEW"}
                  >
                    <div className="art-frame">
                      <img src={`/art/${w.id}.jpg`} alt={w.alt[locale]} loading="lazy" />
                      <span className="view-tag">{t.cta.view[locale]}</span>
                    </div>
                    <div className="art-caption">
                      <span>{w.id.replace("obra-", "Obra ")}</span>
                      <span>{w.category}</span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter chapter-dream" aria-labelledby="ch4h">
          <div className="container">
            <Reveal>
              <p className="chapter-kicker">04 · {es ? "Pintura y sueño" : "Paint and dream"}</p>
              <h2 id="ch4h">{t.chapters.ch4t[locale]}</h2>
              <p className="lead">{t.chapters.ch4p[locale]}</p>
            </Reveal>
            <div className="art-row">
              {worlds.map((w) => (
                <Reveal key={w.id}>
                  <a
                    href={`${routes.artwork[locale]}/${w.id}`}
                    className="art-card"
                    data-cursor-label={es ? "VER" : "VIEW"}
                  >
                    <div className="art-frame">
                      <img src={`/art/${w.id}.jpg`} alt={w.alt[locale]} loading="lazy" />
                      <span className="view-tag">{t.cta.view[locale]}</span>
                    </div>
                    <div className="art-caption">
                      <span>{w.id.replace("obra-", "Obra ")}</span>
                      <span>{w.category}</span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter" aria-labelledby="ch5h">
          <div className="container">
            <Reveal>
              <p className="chapter-kicker">05 · Wladimir Inostroza</p>
              <h2 id="ch5h">{t.chapters.ch5t[locale]}</h2>
              <p className="lead">{t.chapters.ch5bio[locale]}</p>
              <blockquote style={{
                borderLeft: `2px solid var(--accent)`,
                paddingLeft: "var(--sp-3)",
                fontStyle: "italic",
                color: "var(--ink-2)",
                margin: "var(--sp-4) 0",
              }}>
                {t.chapters.ch5quote[locale]}
              </blockquote>
            </Reveal>
          </div>
        </section>

        <section className="chapter" aria-labelledby="ch6h">
          <div className="container">
            <Reveal>
              <p className="chapter-kicker">06 · {es ? "Archivo" : "Archive"}</p>
              <h2 id="ch6h">{t.chapters.ch6t[locale]}</h2>
              <p className="lead">{t.chapters.ch6p[locale]}</p>
              <ul className="timeline">
                <li>
                  <span className="year">2010</span>
                  <span>{es
                    ? "Primer registro de prensa (BioBioChile) y primera entrevista internacional (My Modern Met)."
                    : "First press record (BioBioChile) and first international interview (My Modern Met)."
                  }</span>
                </li>
                <li>
                  <span className="year">2013</span>
                  <span>{es
                    ? "Perfil en TVN; reportajes anamórficos en TwistedSifter y Amusing Planet."
                    : "TVN profile; anamorphic features on TwistedSifter and Amusing Planet."
                  }</span>
                </li>
                <li>
                  <span className="year">{es ? "Hoy" : "Today"}</span>
                  <span>{es
                    ? "Activo en Instagram y Facebook; nuevo trabajo en desarrollo."
                    : "Active on Instagram and Facebook; new work in development."
                  }</span>
                </li>
              </ul>
              <div className="btn-row">
                <Link href={routes.blog[locale]} className="btn">{t.cta.blogArchive[locale]}</Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="chapter" aria-labelledby="ch7h">
          <div className="container">
            <Reveal>
              <p className="chapter-kicker">07 · {es ? "Originales" : "Originals"}</p>
              <h2 id="ch7h">{t.chapters.ch7t[locale]}</h2>
              <p className="lead">{t.chapters.ch7p[locale]}</p>
              <div className="art-row">
                {originals.map((w) => (
                  <Reveal key={w.id}>
                    <a
                      href={`${routes.artwork[locale]}/${w.id}`}
                      className="art-card"
                      data-cursor-label={es ? "OFRECER" : "OFFER"}
                    >
                      <div className="art-frame">
                        <img src={`/art/${w.id}.jpg`} alt={w.alt[locale]} loading="lazy" />
                        <span className="view-tag">{t.cta.offer[locale]}</span>
                      </div>
                      <div className="art-caption">
                        <span>{w.id.replace("obra-", "Obra ")}</span>
                        <span>{es ? "Consultar" : "Inquire"}</span>
                      </div>
                    </a>
                  </Reveal>
                ))}
              </div>
              <div className="btn-row">
                <Link href={routes.gallery[locale]} className="btn btn-solid">{t.cta.gallery[locale]}</Link>
                <Link href={`${routes.commissions[locale]}?flow=offer`} className="btn">{t.cta.offer[locale]}</Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="chapter chapter-dream" aria-labelledby="ch8h">
          <div className="container">
            <Reveal>
              <p className="chapter-kicker">08 · {es ? "Proyectos" : "Projects"}</p>
              <h2 id="ch8h">{t.chapters.ch8t[locale]}</h2>
              <p className="lead">{t.chapters.ch8p[locale]}</p>
              <div className="btn-row">
                <Link href={`${routes.commissions[locale]}?flow=commission`} className="btn">{t.cta.commission[locale]}</Link>
                <Link href={`${routes.commissions[locale]}?flow=mural`} className="btn">
                  {es ? "Proponer un mural" : "Propose a mural"}
                </Link>
                <Link href={`${routes.commissions[locale]}?flow=licensing`} className="btn">{t.cta.license[locale]}</Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="chapter" aria-labelledby="ch9h">
          <div className="container" style={{ textAlign: "center" }}>
            <Reveal>
              <p className="chapter-kicker">09</p>
              <h2 id="ch9h">{t.chapters.ch9t[locale]}</h2>
              <p className="lead" style={{ margin: "0 auto", maxWidth: "38em" }}>{t.chapters.ch9p[locale]}</p>
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
