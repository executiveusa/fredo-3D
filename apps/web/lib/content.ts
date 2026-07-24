import manifest from "./artwork-manifest.json";

export type Locale = "es" | "en";

export interface Artwork {
  id: string;
  title: string | null;
  titleStatus: string;
  year: number | null;
  yearStatus: string;
  medium: string | null;
  dimensions: string | null;
  availability: string;
  commerce: {
    originalSaleEnabled: boolean;
    offersEnabled: boolean;
    printsEnabled: boolean;
    merchEnabled: boolean;
    licensingEnabled: boolean;
  };
  masterAsset: string;
  confidence: string;
  showInGallery: boolean;
  category: string;
  alt: { es: string; en: string };
}

const works = manifest as unknown as Artwork[];

export function galleryWorks(): Artwork[] {
  return works.filter((w) => w.showInGallery);
}

export function getWork(id: string): Artwork | undefined {
  return works.find((w) => w.id === id && w.showInGallery);
}

export function workImage(w: Artwork): string {
  return `/art/${w.id}.jpg`;
}

export const WHATSAPP = "56993838223";

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

/** Display label for untitled works — status transparent, never fake titles. */
export function workLabel(w: Artwork, locale: Locale): string {
  if (w.title) return w.title;
  const n = w.id.replace("obra-", "");
  return locale === "es" ? `Obra sin título · N.º ${n}` : `Untitled work · No. ${n}`;
}

export function availabilityLabel(w: Artwork, locale: Locale): string {
  const map: Record<string, { es: string; en: string }> = {
    available: { es: "Disponible", en: "Available" },
    reserved: { es: "Reservada", en: "Reserved" },
    sold: { es: "Colección privada / Vendida", en: "Private collection / Sold" },
    private_collection: { es: "Colección privada", en: "Private collection" },
    unknown: { es: "Consultar disponibilidad", en: "Inquire about availability" },
  };
  return map[w.availability]?.[locale] ?? map.unknown[locale];
}

export const categoryLabels: Record<string, { es: string; en: string }> = {
  anamorphic: { es: "3D / Anamórfico", en: "3D / Anamorphic" },
  surreal: { es: "Surrealista", en: "Surreal" },
  pencil: { es: "Lápiz", en: "Pencil" },
  painting: { es: "Pintura", en: "Painting" },
};
