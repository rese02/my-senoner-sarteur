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
              <p className="font-bold text-lg text-foreground">[Vollständiger Name des Unternehmens/Inhabers]</p>
              <p>[Straße und Hausnummer]<br />[PLZ], [Ort]<br />[Provinz], [Land]</p>
              
              <div>
                <h3 className="font-semibold text-foreground">Kontakt:</h3>
                <p>Telefon: [Ihre Telefonnummer]<br />E-Mail: [Ihre E-Mail-Adresse]</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">Umsatzsteuer-ID:</h3>
                <p>Umsatzsteuer-Identifikationsnummer gemäß §27a UStG:<br />[Ihre USt-IdNr.]</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h3>
                <p>[Name des Verantwortlichen]<br />[Anschrift wie oben]</p>
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
              <p className="font-bold text-lg text-foreground">[Nome completo dell'azienda/proprietario]</p>
              <p>[Via e numero civico]<br />[CAP], [Città]<br />[Provincia], [Paese]</p>
              
              <div>
                <h3 className="font-semibold text-foreground">Contatti:</h3>
                <p>Telefono: [Il tuo numero di telefono]<br />E-mail: [Il tuo indirizzo e-mail]</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">Partita IVA:</h3>
                <p>Numero di identificazione IVA ai sensi della normativa fiscale:<br />[La tua Partita IVA]</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">Responsabile per il contenuto:</h3>
                <p>[Nome del responsabile]<br />[Indirizzo come sopra]</p>
              </div>

              <div>
                  <h3 className="font-semibold text-foreground">Esclusione di responsabilità (Disclaimer):</h3>
                  <p className="text-xs">Nonostante un attento controllo dei contenuti, non ci assumiamo alcuna responsabilità per i contenuti dei link esterni. Per il contenuto delle pagine collegate sono responsabili esclusivamente i loro gestori.</p>
              </div>
               <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive-foreground mt-6">
                <p className="font-bold text-destructive">AVVISO IMPORTANTE:</p>
                <p className="text-xs">Questo testo è generato automaticamente e serve come modello. Non costituisce una consulenza legale. Assicurati di far controllare il tuo colophon da un avvocato.</p>
              </div>
            </div>
          </section>

           <hr className="my-8" />

            {/* ENGLISH */}
            <section>
                <h2 className="text-xl font-bold text-foreground mb-4 font-headline">Legal Notice (English)</h2>
                <div className="space-y-4">
                <p className="font-bold text-lg text-foreground">[Full Company/Owner Name]</p>
                <p>[Street and House Number]<br />[Postal Code], [City]<br />[Province], [Country]</p>
                
                <div>
                    <h3 className="font-semibold text-foreground">Contact:</h3>
                    <p>Phone: [Your Phone Number]<br />Email: [Your Email Address]</p>
                </div>

                <div>
                    <h3 className="font-semibold text-foreground">VAT ID:</h3>
                    <p>Value Added Tax identification number:<br />[Your VAT ID]</p>
                </div>
                
                <div>
                    <h3 className="font-semibold text-foreground">Responsible for the content:</h3>
                    <p>[Name of responsible person]<br />[Address as above]</p>
                </div>

                <div>
                    <h3 className="font-semibold text-foreground">Disclaimer:</h3>
                    <p className="text-xs">Despite careful content control, we assume no liability for the content of external links. The operators of the linked pages are solely responsible for their content.</p>
                </div>

                <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive-foreground mt-6">
                    <p className="font-bold text-destructive">IMPORTANT NOTICE:</p>
                    <p className="text-xs">This is an automatically generated text and serves as a template. It does not constitute legal advice. Please have your legal notice reviewed by a lawyer.</p>
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
