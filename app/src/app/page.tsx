import { redirect } from "next/navigation";

export default function HomePage() {
  // Wir leiten von der Startseite "/" direkt zum Login weiter.
  // Wenn der User schon eingeloggt ist, kümmert sich die Middleware 
  // oder die Login-Seite darum, ihn zum Dashboard zu schicken.
  redirect("/login");
}
