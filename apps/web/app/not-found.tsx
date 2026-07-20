import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", textAlign: "center", padding: "2rem" }}>
      <h1 style={{ fontWeight: 400 }}>404</h1>
      <p>Esta página no existe. / This page does not exist.</p>
      <p><Link href="/es">← FREDO 3D</Link></p>
    </main>
  );
}
