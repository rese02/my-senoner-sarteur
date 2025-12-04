import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <div className="bg-secondary min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <PageHeader title="Datenschutz" description="Informationen zur Verarbeitung Ihrer Daten" />

        <Card className="p-6 md:p-8 space-y-8 text-muted-foreground">

            <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive-foreground">
                <p className="font-bold text-destructive">WICHTIGER HINWEIS:</p>
                <p className="text-sm">Dies ist eine automatisch generierte Vorlage und stellt keine Rechtsberatung dar. Sie muss von einem Rechtsexperten an Ihr Unternehmen angepasst werden, um die Konformität mit der DSGVO und anderen Gesetzen zu gewährleisten.</p>
            </div>

          {/* DEUTSCH */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 font-headline">Datenschutzerklärung (Deutsch)</h2>
            <div className="space-y-6 text-sm">
                <div>
                    <h3 className="font-semibold text-foreground mb-2">1. Verantwortlicher</h3>
                    <p>[Vollständiger Name des Unternehmens/Inhabers]<br/>[Straße und Hausnummer]<br/>[PLZ], [Ort]<br/>E-Mail: [Ihre E-Mail-Adresse]</p>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground mb-2">2. Datenverarbeitung zur Nutzung der App</h3>
                    <p>Bei der Nutzung unserer App werden personenbezogene Daten verarbeitet. Dies umfasst:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Registrierung und Authentifizierung (Firebase Auth):</strong> Zur Erstellung und Verwaltung Ihres Kontos verarbeiten wir Ihren Namen, Ihre E-Mail-Adresse, Telefonnummer und Adresse. Die Verarbeitung erfolgt durch Google Ireland Limited ("Google").</li>
                        <li><strong>Datenbank (Firestore):</strong> Ihre Profildaten, Bestellungen, Treuepunkte und andere app-spezifische Daten werden in der Firestore-Datenbank von Google gespeichert.</li>
                        <li><strong>Bild-Uploads (Firebase Storage):</strong> Bilder, die Sie hochladen (z.B. für den AI Sommelier), werden im Firebase Storage von Google gespeichert.</li>
                        <li><strong>Server-Log-Files:</strong> Unser Hosting-Provider erhebt Daten über Zugriffe auf die App (IP-Adresse, Zeitpunkt, aufgerufene Seite), die zur Sicherstellung des Betriebs notwendig sind.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground mb-2">3. Einsatz von Künstlicher Intelligenz (KI)</h3>
                    <p>Für bestimmte Funktionen nutzen wir KI-Modelle von Google (Genkit/Gemini). Hierbei werden Daten an Google zur Verarbeitung gesendet:</p>
                     <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>AI Sommelier:</strong> Das von Ihnen aufgenommene Bild eines Gerichts wird zur Analyse an ein KI-Modell gesendet, um Weinempfehlungen zu generieren. Das Bild wird nicht dauerhaft für andere Zwecke als die Analyse gespeichert.</li>
                        <li><strong>Newsletter-Texthilfe:</strong> Der von Ihnen eingegebene Text wird zur sprachlichen Optimierung an ein Textmodell gesendet.</li>
                        <li><strong>Wein-Analyse:</strong> Die von Administratoren eingegebenen Weinnamen werden zur automatischen Kategorisierung an ein KI-Modell übermittelt.</li>
                    </ul>
                    <p className="mt-2">Die Nutzung dieser Funktionen ist freiwillig. Durch die Nutzung stimmen Sie dieser Verarbeitung zu. Google verarbeitet diese Daten gemäß seiner eigenen Datenschutzrichtlinien. Wir haben Google vertraglich zur Einhaltung der DSGVO verpflichtet (Standardvertragsklauseln).</p>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground mb-2">4. Ihre Rechte</h3>
                    <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch bezüglich Ihrer personenbezogenen Daten. Bitte kontaktieren Sie uns dazu unter der oben genannten E-Mail-Adresse.</p>
                </div>
            </div>
          </section>

          <hr className="my-8" />

          {/* ITALIANO */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 font-headline">Informativa sulla Privacy (Italiano)</h2>
            <div className="space-y-6 text-sm">
                <div>
                    <h3 className="font-semibold text-foreground mb-2">1. Titolare del trattamento</h3>
                    <p>[Nome completo dell'azienda/proprietario]<br/>[Via e numero civico]<br/>[CAP], [Città]<br/>E-mail: [Il tuo indirizzo e-mail]</p>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground mb-2">2. Trattamento dei dati per l'utilizzo dell'app</h3>
                    <p>Durante l'utilizzo della nostra app, vengono trattati dati personali. Ciò include:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Registrazione e autenticazione (Firebase Auth):</strong> Per creare e gestire il tuo account, trattiamo il tuo nome, indirizzo e-mail, numero di telefono e indirizzo. Il trattamento è effettuato da Google Ireland Limited ("Google").</li>
                        <li><strong>Database (Firestore):</strong> I dati del tuo profilo, gli ordini, i punti fedeltà e altri dati specifici dell'app vengono memorizzati nel database Firestore di Google.</li>
                        <li><strong>Caricamento di immagini (Firebase Storage):</strong> Le immagini che carichi (ad es. per l'AI Sommelier) vengono salvate su Firebase Storage di Google.</li>
                        <li><strong>File di log del server:</strong> Il nostro provider di hosting raccoglie dati sugli accessi all'app (indirizzo IP, ora, pagina visitata), necessari per garantire il funzionamento.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground mb-2">3. Uso dell'Intelligenza Artificiale (IA)</h3>
                    <p>Per alcune funzioni utilizziamo modelli di IA di Google (Genkit/Gemini). In questo contesto, i dati vengono inviati a Google per l'elaborazione:</p>
                     <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>AI Sommelier:</strong> L'immagine di un piatto da te scattata viene inviata a un modello di IA per l'analisi al fine di generare consigli sui vini. L'immagine non viene memorizzata in modo permanente per scopi diversi dall'analisi.</li>
                        <li><strong>Assistente Testi Newsletter:</strong> Il testo da te inserito viene inviato a un modello di testo per l'ottimizzazione linguistica.</li>
                        <li><strong>Analisi Vini:</strong> I nomi dei vini inseriti dagli amministratori vengono trasmessi a un modello di IA per la categorizzazione automatica.</li>
                    </ul>
                    <p className="mt-2">L'uso di queste funzioni è facoltativo. Utilizzandole, acconsenti a questo trattamento. Google tratta questi dati in conformità con la propria informativa sulla privacy. Abbiamo vincolato contrattualmente Google al rispetto del GDPR (clausole contrattuali standard).</p>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground mb-2">4. I tuoi diritti</h3>
                    <p>Hai il diritto di accesso, rettifica, cancellazione, limitazione del trattamento, portabilità dei dati e opposizione riguardo ai tuoi dati personali. Per esercitare tali diritti, ti preghiamo di contattarci all'indirizzo e-mail sopra indicato.</p>
                </div>
            </div>
          </section>

          <hr className="my-8" />

          {/* ENGLISH */}
            <section>
                <h2 className="text-xl font-bold text-foreground mb-4 font-headline">Privacy Policy (English)</h2>
                <div className="space-y-6 text-sm">
                    <div>
                        <h3 className="font-semibold text-foreground mb-2">1. Data Controller</h3>
                        <p>[Full Company/Owner Name]<br/>[Street and House Number]<br/>[Postal Code], [City]<br/>Email: [Your Email Address]</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-2">2. Data Processing for App Usage</h3>
                        <p>When using our app, personal data is processed. This includes:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Registration and Authentication (Firebase Auth):</strong> To create and manage your account, we process your name, email address, phone number, and address. This processing is carried out by Google Ireland Limited ("Google").</li>
                            <li><strong>Database (Firestore):</strong> Your profile data, orders, loyalty points, and other app-specific data are stored in Google's Firestore database.</li>
                            <li><strong>Image Uploads (Firebase Storage):</strong> Images you upload (e.g., for the AI Sommelier) are saved in Google's Firebase Storage.</li>
                            <li><strong>Server Log Files:</strong> Our hosting provider collects data about access to the app (IP address, time, page visited), which is necessary to ensure its operation.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-2">3. Use of Artificial Intelligence (AI)</h3>
                        <p>For certain features, we use AI models from Google (Genkit/Gemini). In doing so, data is sent to Google for processing:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>AI Sommelier:</strong> The image of a dish you take is sent to an AI model for analysis to generate wine recommendations. The image is not permanently stored for purposes other than the analysis.</li>
                            <li><strong>Newsletter Text Assistant:</strong> The text you enter is sent to a text model for linguistic optimization.</li>
                            <li><strong>Wine Analysis:</strong> Wine names entered by administrators are submitted to an AI model for automatic categorization.</li>
                        </ul>
                        <p className="mt-2">The use of these features is voluntary. By using them, you consent to this processing. Google processes this data in accordance with its own privacy policy. We have contractually bound Google to comply with the GDPR (Standard Contractual Clauses).</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-2">4. Your Rights</h3>
                        <p>You have the right to access, rectify, erase, restrict processing of, and port your personal data, as well as the right to object. To do so, please contact us at the email address provided above.</p>
                    </div>
                </div>
            </section>
             <div className="text-center mt-8">
                <Link href="/login" className="text-sm font-medium text-primary hover:underline">Back to Login</Link>
            </div>
        </Card>
      </div>
    </div>
  );
}
