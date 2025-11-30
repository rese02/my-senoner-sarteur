import { redirect } from "next/navigation";

export default function HomePage() {
  // Leitet sofort weiter zur Login-Seite
  redirect("/login");
}
