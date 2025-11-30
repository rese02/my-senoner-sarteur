import { redirect } from "next/navigation";

export default function HomePage() {
  // Leitet jeden Besucher sofort zum Login weiter
  redirect("/login");
}
