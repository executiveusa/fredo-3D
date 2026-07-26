import Link from "next/link";
import type { Locale } from "../lib/content";
import { routes, t } from "../lib/i18n";
import PencilCursor from "./PencilCursor";

export default function SubPageShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const es = locale === "es";
  return (
    <>
      <PencilCursor />
      <div className="paper-grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <a href="#main" className="skip-link">
        {es ? "Saltar al contenido" : "Skip to content"}
      </a>

      <nav className="nav-fixed" aria-label={es ? "Navegación" : "Navigation"}>
        <Link href={routes.home[locale]} className="wordmark" style={{ textDecoration: "none" }}>
          FREDO<span className="dot">·</span>3D
        </Link>
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
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
          <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5 4.5.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.2-.6-.4z" />
          <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18.3c-1.5 0-3-.4-4.3-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.3 8.3 0 1 1 12 20.3z" />
        </svg>
        WhatsApp
      </a>

      <main id="main" style={{ position: "relative", zIndex: 2 }}>
        {children}
      </main>
    </>
  );
}
