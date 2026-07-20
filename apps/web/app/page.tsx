import { redirect } from "next/navigation";

// Spanish-first (decision ledger): root goes to /es.
export default function Root() {
  redirect("/es");
}
