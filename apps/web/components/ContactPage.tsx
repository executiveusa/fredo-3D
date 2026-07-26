import type { Locale } from "../lib/content";
import { waLink } from "../lib/content";
import { t } from "../lib/i18n";
import SubPageShell from "./SubPageShell";
import SiteFooter from "./SiteFooter";

export default function ContactPage({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return (
    <SubPageShell locale={locale}>
      <div className="container" style={{ paddingTop: "var(--sp-7)" }}>
        <div className="page-head">
          <p className="chapter-kicker">{es ? "Contacto" : "Contact"}</p>
          <h1>{es ? "Contacto" : "Contact"}</h1>
          <p className="lead">
            {es
              ? "La vía directa es WhatsApp. Fredo responde personalmente, en español o inglés."
              : "The direct channel is WhatsApp. Fredo replies personally, in Spanish or English."}
          </p>
        </div>
        <div className="btn-row" style={{ marginBottom: "var(--sp-5)" }}>
          <a
            href={waLink(es ? "Hola Fredo, te escribo desde fredo3d.com." : "Hi Fredo, writing you from fredo3d.com.")}
            className="btn btn-wa"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp +56 9 9383 8223
          </a>
        </div>
        <div style={{ marginTop: "var(--sp-6)" }}>
          <h2>{t.book.title[locale]}</h2>
          <p className="lead" style={{ maxWidth: "38em" }}>{t.book.p[locale]}</p>
          <p style={{ marginTop: "var(--sp-3)" }}>
            <a href="https://www.instagram.com/isla.de.plastico/" target="_blank" rel="noopener noreferrer">
              @isla.de.plastico
            </a>
          </p>
        </div>
      </div>
      <SiteFooter locale={locale} />
    </SubPageShell>
  );
}
