import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function ImpressumPage() {
  return (
    <div className="bg-secondary min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <PageHeader title="Impressum" description="Angaben gemäß gesetzlicher Verpflichtung" />

        <Card className="p-6 md:p-8 space-y-8 text-muted-foreground">
          {/* DEUTSCH */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 font-headline">Impressum (Deutsch)</h2>
            <div className="space-y-4">
              <p className="font-bold text-lg text-foreground">SENONER SARTEUR SAS DI SENONER ANDREAS & C.</p>
              <p>Meisules 111<br />39048 Wolkenstein in Gröden (BZ)<br />Italien</p>
              
              <div>
                <h3 className="font-semibold text-foreground">Kontakt:</h3>
                <p>Telefon: +39 0471 795261<br />E-Mail: <a href="mailto:info@senoner-sarteur.com" className="text-primary hover:underline">info@senoner-sarteur.com</a><br />PEC: <a href="mailto:sarteur@pec.senoner-sarteur.it" className="text-primary hover:underline">sarteur@pec.senoner-sarteur.it</a></p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">Gesetzlicher Vertreter:</h3>
                <p>Andreas Senoner</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">Umsatzsteuer-ID:</h3>
                <p>USt-IdNr. (P.IVA): IT01184640215</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">Handelsregister:</h3>
                <p>Handelskammer Bozen, REA-Nummer: BZ - 106161</p>
              </div>

               <div>
                <h3 className="font-semibold text-foreground">Online-Streitbeilegung:</h3>
                <p className="text-sm">Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie hier finden: <a href="http://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">http://ec.europa.eu/consumers/odr/</a>. Wir sind nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
              </div>

              <div>
                  <h3 className="font-semibold text-foreground">Haftungsausschluss (Disclaimer):</h3>
                  <p className="text-xs">Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.</p>
              </div>

            </div>
          </section>

          <hr className="my-8" />

          {/* ITALIANO */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 font-headline">Colophon (Italiano)</h2>
             <div className="space-y-4">
              <p className="font-bold text-lg text-foreground">SENONER SARTEUR SAS DI SENONER ANDREAS & C.</p>
              <p>Via Meisules 111<br />39048 Selva di Val Gardena (BZ)<br />Italia</p>
              
              <div>
                <h3 className="font-semibold text-foreground">Contatti:</h3>
                <p>Telefono: +39 0471 795261<br />E-mail: <a href="mailto:info@senoner-sarteur.com" className="text-primary hover:underline">info@senoner-sarteur.com</a><br />PEC: <a href="mailto:sarteur@pec.senoner-sarteur.it" className="text-primary hover:underline">sarteur@pec.senoner-sarteur.it</a></p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">Legale Rappresentante:</h3>
                <p>Andreas Senoner</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">Partita IVA:</h3>
                <p>P.IVA: IT01184640215</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">Registro delle Imprese:</h3>
                <p>Camera di Commercio di Bolzano, Numero REA: BZ - 106161</p>
              </div>
              
               <div>
                <h3 className="font-semibold text-foreground">Risoluzione online delle controversie:</h3>
                <p className="text-sm">La Commissione Europea fornisce una piattaforma per la risoluzione online delle controversie (ODR), disponibile qui: <a href="http://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">http://ec.europa.eu/consumers/odr/</a>. Non siamo obbligati a partecipare a procedure di risoluzione delle controversie dinanzi a un organismo di conciliazione per i consumatori.</p>
              </div>

              <div>
                  <h3 className="font-semibold text-foreground">Esclusione di responsabilità (Disclaimer):</h3>
                  <p className="text-xs">Nonostante un attento controllo dei contenuti, non ci assumiamo alcuna responsabilità per i contenuti dei link esterni. Per il contenuto delle pagine collegate sono responsabili esclusivamente i loro gestori.</p>
              </div>
            </div>
          </section>
             <div className="text-center mt-8">
                <Link href="/login" className="text-sm font-medium text-primary hover:underline">Zurück zum Login</Link>
            </div>
        </Card>
      </div>
    </div>
  );
}
