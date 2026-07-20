import Image from "next/image";
import type { Locale } from "../lib/content";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import IntakeEngine from "./IntakeEngine";

export default function IntakePage({ locale, flow, work }: { locale: Locale; flow?: string; work?: string }) {
  const es = locale === "es";
  return (
    <>
      <SiteNav locale={locale} />
      <main id="main" className="container intake-wrap">
        {/* Artwork as restrained monochrome background — never reduces readability */}
        <div className="intake-bg" aria-hidden="true">
          <Image src="/art/obra-09.jpg" alt="" width={1200} height={1200} sizes="100vw" />
        </div>
        <div className="page-head" style={{ position: "relative", zIndex: 1 }}>
          <h1>{es ? "Encargos y proyectos" : "Commissions and projects"}</h1>
          <p>
            {es
              ? "Ofertas por originales, encargos, murales, licencias y colaboraciones — en Chile y el extranjero."
              : "Offers on originals, commissions, murals, licensing, and collaborations — in Chile and abroad."}
          </p>
        </div>
        <IntakeEngine locale={locale} initialFlow={flow} initialWork={work} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
