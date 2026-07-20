import type { Locale } from "../lib/content";
import { waLink } from "../lib/content";
import { t } from "../lib/i18n";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

export default function ContactPage({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return (
    <>
      <SiteNav locale={locale} />
      <main id="main" className="container">
        <div className="page-head">
          <h1>{es ? "Contacto" : "Contact"}</h1>
          <p>
            {es
              ? "La vía directa es WhatsApp. Fredo responde personalmente, en español o inglés."
              : "The direct channel is WhatsApp. Fredo replies personally, in Spanish or English."}
          </p>
        </div>
        <div className="btn-row" style={{ marginBottom: "2rem" }}>
          <a
            href={waLink(es ? "Hola Fredo, te escribo desde fredo3d.com." : "Hi Fredo, writing you from fredo3d.com.")}
            className="btn btn-wa"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp +56 9 9383 8223
          </a>
        </div>
        <h2 style={{ fontWeight: 400 }}>{t.book.title[locale]}</h2>
        <p style={{ maxWidth: "42rem" }}>{t.book.p[locale]}</p>
        <p style={{ paddingBottom: "4rem" }}>
          <a href="https://www.instagram.com/isla.de.plastico/" target="_blank" rel="noopener noreferrer">
            @isla.de.plastico
          </a>
        </p>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
