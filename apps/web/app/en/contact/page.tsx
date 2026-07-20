import type { Metadata } from "next";
import ContactPage from "../../../components/ContactPage";

export const metadata: Metadata = { title: "Contact", description: "Talk directly to Fredo on WhatsApp, in Spanish or English." };

export default function Page() {
  return <ContactPage locale="en" />;
}
