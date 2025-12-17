
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <div className="bg-secondary min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <PageHeader title="Datenschutzerklärung 'My Senoner Sarteur'" description="Stand: Dezember 2025" />

        <Card className="bg-transparent border-none shadow-none p-6 md:p-8 space-y-8 text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 font-headline">1. Verantwortlicher</h2>
            <p>Verantwortlich für die Datenverarbeitung in dieser App ist:<br/>
            Senoner Sarteur KG-SAS di Senoner Andreas & C.<br/>
            Meisulesstr. 111, 39048 Wolkenstein (BZ), Italien<br/>
            E-Mail: <a href="mailto:info@senoner-sarteur.it" className="text-primary hover:underline">info@senoner-sarteur.it</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 font-headline">2. Wo wir Ihre Daten speichern</h2>
            <p>Wir legen großen Wert darauf, dass Ihre Daten sicher sind. Unsere primären Datenbank-Server (Google Cloud Firestore) befinden sich in <strong>Frankfurt, Deutschland (EU)</strong>. Für die Authentifizierung (Login) nutzen wir Technologie von Google Identity, die teilweise Daten zur Sicherheit in den USA verarbeitet. Google ist unter dem "EU-U.S. Data Privacy Framework" zertifiziert, was ein angemessenes Schutzniveau garantiert.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 font-headline">3. Welche Daten wir sammeln und warum</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.1 Beim Einkaufen & Bestellen (Vertragserfüllung)</h3>
                <p>Um Ihre Vorbestellungen und Einkäufe abzuwickeln, verarbeiten wir:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Ihren Namen und Ihre Kontaktdaten.</li>
                  <li>Bestelldetails und Abholzeiten.</li>
                  <li>Zahlungsinformationen (über verschlüsselte Zahlungsdienstleister).</li>
                </ul>
                <p className="mt-2 text-sm"><strong>Speicherdauer:</strong> Steuerlich relevante Belege bewahren wir gesetzlich verpflichtend 10 Jahre auf.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3.2 Treueprogramm & Profiling (Ihre Einwilligung)</h3>
                <p>Wenn Sie am Treueprogramm teilnehmen, sammeln Sie Punkte.</p>
                 <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Punkte-Verwaltung:</strong> Notwendig zur Einlösung von Prämien.</li>
                  <li><strong>Persönliche Angebote:</strong> Nur wenn Sie ausdrücklich zugestimmt haben ("Opt-in"), analysieren wir Ihre Einkaufshistorie, um Ihnen z.B. passende Weine oder Produkte vorzuschlagen.</li>
                   <li><strong>Widerruf:</strong> Sie können die Analyse Ihres Kaufverhaltens jederzeit in den App-Einstellungen deaktivieren.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3.3 KI-Funktionen (Sommelier & Rezepte)</h3>
                <p>Unsere App nutzt Künstliche Intelligenz (Google Vertex AI), um Ihnen Rezepte oder Weinbegleitungen vorzuschlagen.</p>
                <p className="mt-2">Ihre Eingaben (z.B. "Was passt zu Spargel?") werden an den Server gesendet.</p>
                <p className="mt-2"><strong>Wichtig:</strong> Wir nutzen diese Daten nicht, um KI-Modelle zu trainieren. Ihre Eingaben bleiben vertraulich.</p>
                <p className="mt-2"><strong>Haftungsausschluss:</strong> KI kann Fehler machen. Bitte prüfen Sie Zutaten und Allergene immer auf der physischen Produktverpackung. Die App ersetzt keine medizinische Ernährungsberatung.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 font-headline">4. Löschung von Daten</h2>
            <p>Wir speichern Ihre Daten nur so lange wie nötig.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Inaktive Konten:</strong> Wenn Sie die App 1 Jahr lang nicht nutzen (kein Login, keine Punktebewegung), wird Ihr Konto und alle damit verknüpften persönlichen Daten automatisch gelöscht.</li>
              <li><strong>Kontolöschung:</strong> Sie können Ihr Konto jederzeit manuell in den App-Einstellungen unter "Mein Profil {' > '} Konto löschen" sofort entfernen.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 font-headline">5. Ihre Rechte</h2>
            <p>Sie haben gemäß DSGVO das Recht auf Auskunft, Berichtigung, Löschung und Datenübertragbarkeit. Kontaktieren Sie uns dazu einfach unter <a href="mailto:info@senoner-sarteur.it" className="text-primary hover:underline">info@senoner-sarteur.it</a>.</p>
          </section>

          <div className="text-center mt-8">
            <Link href="/login" className="text-sm font-medium text-primary hover:underline">Zurück zur App</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
