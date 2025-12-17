
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function ImpressumPage() {
  return (
    <div className="bg-secondary min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <PageHeader title="Impressum / Note Legali" description="Angaben gemäß gesetzlicher Verpflichtung" />

        <Card className="bg-transparent border-none shadow-none p-6 md:p-8 space-y-8 text-muted-foreground">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground font-headline">Senoner Sarteur KG-SAS di Senoner Andreas & C.</h2>

              <div>
                <h3 className="font-semibold text-foreground">Betreiber der App und Medieninhaber / Titolare e editore</h3>
                <p>Senoner Sarteur KG-SAS di Senoner Andreas & C.</p>
              </div>

               <div>
                <h3 className="font-semibold text-foreground">Rechtsform / Forma giuridica</h3>
                <p>Kommanditgesellschaft / Società in accomandita semplice (S.a.s.)</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">Sitz der Gesellschaft / Sede legale</h3>
                <p>Meisulesstraße 111 / Streda Mëisules 111<br />I-39048 Wolkenstein in Gröden (BZ) / Selva di Val Gardena<br/>Südtirol / Italien</p>
              </div>

               <div>
                <h3 className="font-semibold text-foreground">Vertretungsberechtigte / Rappresentanti legali</h3>
                <p>Andreas Senoner<br/>Simon Senoner</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">Kontakt / Contatti</h3>
                <p>Tel.: +39 0471 795128<br />
                   E-Mail: <a href="mailto:info@senoner-sarteur.it" className="text-primary hover:underline">info@senoner-sarteur.it</a><br />
                   PEC: <a href="mailto:sarteur@pec.senoner-sarteur.it" className="text-primary hover:underline">sarteur@pec.senoner-sarteur.it</a>
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">Registereintragungen / Iscrizioni</h3>
                <p>Handelsregister Bozen / Registro Imprese di Bolzano<br/>REA-Nummer: BZ - 106161</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">Steuernummer & MwSt.-Nr. / P.IVA & Cod. Fisc.</h3>
                <p>IT01184640215</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">Verantwortlich für den Inhalt</h3>
                <p>Senoner Sarteur KG-SAS</p>
              </div>

               <div>
                <h3 className="font-semibold text-foreground">Online-Streitbeilegung (EU)</h3>
                <p className="text-sm">Verbraucher haben die Möglichkeit, Beschwerden an die Online-Streitbeilegungsplattform der EU zu richten: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://ec.europa.eu/consumers/odr/</a></p>
              </div>
            </div>
             <div className="mt-8">
                <Button asChild>
                    <Link href="/login">Zurück zur App</Link>
                </Button>
            </div>
        </Card>
      </div>
    </div>
  );
}
