import type { Locale } from "../lib/content";
import SubPageShell from "./SubPageShell";
import SiteFooter from "./SiteFooter";
import IntakeEngine from "./IntakeEngine";

export default function IntakePage({ locale, flow, work }: { locale: Locale; flow?: string; work?: string }) {
  const es = locale === "es";
  return (
    <SubPageShell locale={locale}>
      <div className="container intake-wrap" style={{ paddingTop: "var(--sp-7)" }}>
        <div className="intake-bg" aria-hidden="true">
          <img src="/art/obra-09.jpg" alt="" style={{ width: "140%", opacity: 0.04, filter: "grayscale(1)" }} />
        </div>
        <div className="page-head" style={{ position: "relative", zIndex: 1 }}>
          <p className="chapter-kicker">{es ? "Encargos" : "Commissions"}</p>
          <h1>{es ? "Encargos y proyectos" : "Commissions and projects"}</h1>
          <p className="lead">
            {es
              ? "Ofertas por originales, encargos, murales, licencias y colaboraciones — en Chile y el extranjero."
              : "Offers on originals, commissions, murals, licensing, and collaborations — in Chile and abroad."}
          </p>
        </div>
        <IntakeEngine locale={locale} initialFlow={flow} initialWork={work} />
      </div>
      <SiteFooter locale={locale} />
    </SubPageShell>
  );
}
