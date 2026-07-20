import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { languages: { es: "/es", en: "/en" } },
};

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return <div lang="en">{children}</div>;
}
