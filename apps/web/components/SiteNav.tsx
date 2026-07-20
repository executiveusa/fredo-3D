import Link from "next/link";
import type { Locale } from "../lib/content";
import { routes, t } from "../lib/i18n";

export default function SiteNav({ locale }: { locale: Locale }) {
  const other: Locale = locale === "es" ? "en" : "es";
  return (
    <>
      <a href="#main" className="skip-link">
        {locale === "es" ? "Saltar al contenido" : "Skip to content"}
      </a>
      <nav className="nav" aria-label={locale === "es" ? "Navegación principal" : "Main navigation"}>
        <div className="nav-inner">
          <Link href={routes.home[locale]} className="nav-brand">
            FREDO&nbsp;3D
          </Link>
          <div className="nav-links">
            <Link href={routes.gallery[locale]}>{t.nav.gallery[locale]}</Link>
            <Link href={routes.blog[locale]}>{t.nav.blog[locale]}</Link>
            <Link href={routes.commissions[locale]}>{t.nav.commissions[locale]}</Link>
            <Link href={routes.contact[locale]}>{t.nav.contact[locale]}</Link>
            <Link href={routes.home[other]} className="locale-switch" aria-label={t.nav.switchAria[locale]} rel="alternate" hrefLang={other}>
              {t.nav.switchLocale[locale]}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
