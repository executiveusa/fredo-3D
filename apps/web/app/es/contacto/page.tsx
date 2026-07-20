import type { Metadata } from "next";
import ContactPage from "../../../components/ContactPage";

export const metadata: Metadata = { title: "Contacto", description: "Habla directamente con Fredo por WhatsApp, en español o inglés." };

export default function Page() {
  return <ContactPage locale="es" />;
}
