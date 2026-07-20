"use client";

import { useMemo, useState } from "react";
import type { Locale } from "../lib/content";
import { waLink } from "../lib/content";

/**
 * Reusable multi-step intake engine (master prompt §13).
 * Static mode: submission = structured WhatsApp handoff (verified channel).
 * Email notification joins in phase 2 when EMAIL_PROVIDER is enabled and a
 * verified inbox exists — no fake "sent" states before that.
 */

type Flow = "offer" | "commission" | "mural" | "licensing" | "collab";

interface Field {
  key: string;
  label: { es: string; en: string };
  type?: "text" | "textarea" | "select";
  options?: { value: string; label: { es: string; en: string } }[];
  required?: boolean;
}

const L = (es: string, en: string) => ({ es, en });

const budgetOptions = [
  { value: "<1k", label: L("Menos de USD 1.000", "Under USD 1,000") },
  { value: "1k-5k", label: L("USD 1.000 – 5.000", "USD 1,000 – 5,000") },
  { value: "5k-20k", label: L("USD 5.000 – 20.000", "USD 5,000 – 20,000") },
  { value: ">20k", label: L("Más de USD 20.000", "Over USD 20,000") },
  { value: "open", label: L("Abierto / a conversar", "Open / to discuss") },
];

const flows: Record<Flow, { title: { es: string; en: string }; fields: Field[] }> = {
  offer: {
    title: L("Hacer una oferta", "Make an offer"),
    fields: [
      { key: "work", label: L("Obra (nombre o número)", "Work (name or number)"), required: true },
      { key: "amount", label: L("Tu oferta (monto y moneda)", "Your offer (amount and currency)"), required: true },
      { key: "buyerType", label: L("Tipo de comprador", "Buyer type"), type: "select", options: [
        { value: "private", label: L("Coleccionista privado", "Private collector") },
        { value: "company", label: L("Empresa / institución", "Company / institution") },
        { value: "gallery", label: L("Galería", "Gallery") },
      ]},
      { key: "country", label: L("País y ciudad de envío", "Shipping country and city"), required: true },
      { key: "message", label: L("Mensaje (opcional)", "Message (optional)"), type: "textarea" },
    ],
  },
  commission: {
    title: L("Encargar una obra", "Commission a work"),
    fields: [
      { key: "type", label: L("Tipo de proyecto", "Project type"), type: "select", options: [
        { value: "drawing", label: L("Dibujo / obra en papel", "Drawing / work on paper") },
        { value: "painting", label: L("Pintura", "Painting") },
        { value: "digital", label: L("Ilustración digital", "Digital illustration") },
        { value: "other", label: L("Otro", "Other") },
      ]},
      { key: "direction", label: L("Dirección visual / idea", "Visual direction / idea"), type: "textarea", required: true },
      { key: "size", label: L("Medidas aproximadas", "Approximate dimensions") },
      { key: "timeline", label: L("Plazo deseado", "Desired timeline") },
      { key: "budget", label: L("Rango de presupuesto", "Budget range"), type: "select", options: budgetOptions, required: true },
      { key: "location", label: L("País / ciudad", "Country / city") },
    ],
  },
  mural: {
    title: L("Mural / gran formato", "Mural / large format"),
    fields: [
      { key: "place", label: L("Ciudad y país del proyecto", "Project city and country"), required: true },
      { key: "setting", label: L("Interior o exterior", "Indoor or outdoor"), type: "select", options: [
        { value: "indoor", label: L("Interior", "Indoor") },
        { value: "outdoor", label: L("Exterior", "Outdoor") },
      ]},
      { key: "size", label: L("Tamaño aproximado del muro", "Approximate wall size"), required: true },
      { key: "date", label: L("Fecha estimada", "Estimated date") },
      { key: "budget", label: L("Rango de presupuesto", "Budget range"), type: "select", options: budgetOptions, required: true },
      { key: "message", label: L("Descripción del proyecto", "Project description"), type: "textarea" },
    ],
  },
  licensing: {
    title: L("Licenciar arte o personajes", "License art or characters"),
    fields: [
      { key: "company", label: L("Empresa / proyecto", "Company / project"), required: true },
      { key: "use", label: L("Uso previsto (medio, producto)", "Intended use (media, product)"), type: "textarea", required: true },
      { key: "territory", label: L("Territorio", "Territory") },
      { key: "duration", label: L("Duración deseada", "Desired duration") },
      { key: "exclusive", label: L("¿Exclusividad?", "Exclusivity?"), type: "select", options: [
        { value: "yes", label: L("Sí", "Yes") },
        { value: "no", label: L("No", "No") },
        { value: "tbd", label: L("A conversar", "To discuss") },
      ]},
      { key: "budget", label: L("Rango de presupuesto", "Budget range"), type: "select", options: budgetOptions },
    ],
  },
  collab: {
    title: L("Colaboración / viaje", "Collaboration / travel"),
    fields: [
      { key: "idea", label: L("Cuéntanos la idea", "Tell us the idea"), type: "textarea", required: true },
      { key: "place", label: L("Lugar", "Location") },
      { key: "date", label: L("Fechas tentativas", "Tentative dates") },
    ],
  },
};

const common: Field[] = [
  { key: "name", label: L("Tu nombre", "Your name"), required: true },
  { key: "contact", label: L("Tu contacto (teléfono o email)", "Your contact (phone or email)"), required: true },
];

const ui = {
  intro: L(
    "Elige el tipo de proyecto. Al enviar, se abre WhatsApp con tu solicitud ya escrita — Fredo responde personalmente, en español o inglés.",
    "Choose your project type. On submit, WhatsApp opens with your request pre-written — Fredo replies personally, in Spanish or English."
  ),
  travel: L(
    "Proyectos con viaje: los pasajes aéreos y el alojamiento corren por cuenta del cliente como parte del paquete. Consulta los detalles.",
    "Travel projects: airfare and lodging are covered by the client as part of the package. Ask for details."
  ),
  send: L("Enviar por WhatsApp", "Send via WhatsApp"),
  required: L("Completa los campos obligatorios marcados con *", "Complete the required fields marked with *"),
  noCommit: L(
    "Enviar este formulario no crea ningún compromiso: todo acuerdo se conversa y confirma personalmente.",
    "Submitting this form creates no commitment: every agreement is discussed and confirmed personally."
  ),
};

export default function IntakeEngine({ locale, initialFlow, initialWork }: { locale: Locale; initialFlow?: string; initialWork?: string }) {
  const validFlow = (f: string | undefined): Flow =>
    f && f in flows ? (f as Flow) : "commission";
  const [flow, setFlow] = useState<Flow>(validFlow(initialFlow));
  const [values, setValues] = useState<Record<string, string>>(initialWork ? { work: initialWork } : {});
  const [error, setError] = useState(false);

  const fields = useMemo(() => [...flows[flow].fields, ...common], [flow]);

  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = fields.some((f) => f.required && !values[f.key]?.trim());
    if (missing) {
      setError(true);
      return;
    }
    setError(false);
    const lines = [
      locale === "es" ? `Solicitud desde fredo3d.com — ${flows[flow].title.es}` : `Request from fredo3d.com — ${flows[flow].title.en}`,
      ...fields
        .filter((f) => values[f.key]?.trim())
        .map((f) => `${f.label[locale]}: ${values[f.key].trim()}`),
    ];
    window.open(waLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <div className="intake-tabs" role="group" aria-label={locale === "es" ? "Tipo de solicitud" : "Request type"}>
        {(Object.keys(flows) as Flow[]).map((f) => (
          <button key={f} type="button" aria-pressed={flow === f} onClick={() => setFlow(f)}>
            {flows[f].title[locale]}
          </button>
        ))}
      </div>
      <form className="intake-card" onSubmit={submit} noValidate>
        <h2 style={{ marginTop: 0, fontWeight: 400 }}>{flows[flow].title[locale]}</h2>
        <p className="intake-note">{ui.intro[locale]}</p>
        {(flow === "mural" || flow === "collab") && <p className="note">{ui.travel[locale]}</p>}
        {fields.map((f) => (
          <div className="field" key={f.key}>
            <label htmlFor={`f-${f.key}`}>
              {f.label[locale]}
              {f.required ? " *" : ""}
            </label>
            {f.type === "textarea" ? (
              <textarea id={`f-${f.key}`} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} required={f.required} />
            ) : f.type === "select" ? (
              <select id={`f-${f.key}`} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} required={f.required}>
                <option value="">—</option>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label[locale]}
                  </option>
                ))}
              </select>
            ) : (
              <input id={`f-${f.key}`} type="text" value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} required={f.required} />
            )}
          </div>
        ))}
        {error && (
          <p role="alert" style={{ color: "#b3261e", fontFamily: "var(--sans)", fontSize: "0.85rem" }}>
            {ui.required[locale]}
          </p>
        )}
        <button type="submit" className="btn btn-solid" style={{ width: "100%" }}>
          {ui.send[locale]}
        </button>
        <p className="intake-note">{ui.noCommit[locale]}</p>
      </form>
    </div>
  );
}
