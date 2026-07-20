import Link from "next/link";
import type { Locale } from "../lib/content";
import { waLink } from "../lib/content";
import { routes, t } from "../lib/i18n";

export default function SiteFooter({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3>FREDO 3D</h3>
            <p>{es ? "Wladimir Inostroza · Chile" : "Wladimir Inostroza · Chile"}</p>
            <p style={{ fontStyle: "italic" }}>{t.hero.tagline[locale]}</p>
          </div>
          <div>
            <h3>{es ? "Explorar" : "Explore"}</h3>
            <p><Link href={routes.gallery[locale]}>{t.nav.gallery[locale]}</Link></p>
            <p><Link href={routes.blog[locale]}>{t.nav.blog[locale]}</Link></p>
            <p><Link href={routes.commissions[locale]}>{t.nav.commissions[locale]}</Link></p>
          </div>
          <div>
            <h3>{es ? "Hablar con Fredo" : "Talk to Fredo"}</h3>
            <p>
              <a href={waLink(es ? "Hola Fredo, vengo de fredo3d.com" : "Hi Fredo, I found you on fredo3d.com")} rel="noopener noreferrer" target="_blank">
                WhatsApp +56 9 9383 8223
              </a>
            </p>
            <p>{t.footer.langNote[locale]}</p>
            <p>
              <a href="https://www.instagram.com/fredosis.art/" rel="noopener noreferrer" target="_blank">Instagram</a>
              {" · "}
              <a href="https://www.facebook.com/Fredosis/" rel="noopener noreferrer" target="_blank">Facebook</a>
              {" · "}
              <a href="https://www.behance.net/fredosis" rel="noopener noreferrer" target="_blank">Behance</a>
            </p>
          </div>
        </div>
        <p className="footer-small">{t.footer.rights[locale]}</p>
      </div>
    </footer>
  );
}
