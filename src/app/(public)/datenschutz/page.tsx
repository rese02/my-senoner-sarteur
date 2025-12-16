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
                    <p>SENONER SARTEUR SAS DI SENONER ANDREAS & C.<br/>Meisules 111<br/>39048 Wolkenstein in Gröden (BZ), Italien<br/>E-Mail: sarteur@pec.senoner-sarteur.it</p>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground mb-2">2. Arten der verarbeiteten Daten und Rechtsgrundlagen</h3>
                    <p>Bei der Nutzung unserer App werden verschiedene personenbezogene Daten verarbeitet:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Kontodaten (Art. 6 Abs. 1 lit. b DSGVO):</strong> Zur Erstellung und Verwaltung Ihres Kontos und zur Abwicklung von Bestellungen verarbeiten wir Ihren Namen, E-Mail-Adresse, Telefonnummer und Adresse. Die Verarbeitung erfolgt auf Servern von Google Cloud EMEA Ltd. (Irland).</li>
                        <li><strong>Kaufhistorie & Profildaten (Art. 6 Abs. 1 lit. a DSGVO):</strong> Sofern Sie Ihre Einwilligung erteilen, analysieren wir Ihre Einkäufe, um Ihnen personalisierte Angebote zu unterbreiten.</li>
                        <li><strong>Kommunikationsdaten (Art. 6 Abs. 1 lit. a DSGVO):</strong> Ihre E-Mail-Adresse für den Versand von Newslettern, falls Sie dem zugestimmt haben.</li>
                        <li><strong>Nutzungsdaten & KI-Interaktionen (Art. 6 Abs. 1 lit. f DSGVO):</strong> Bilder für den AI Sommelier oder Texte für den Newsletter-Assistenten werden zur Funktionserbringung verarbeitet. Unser berechtigtes Interesse besteht darin, Ihnen innovative App-Funktionen anzubieten. Die Daten werden nicht für andere Zwecke gespeichert.</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-foreground mb-2">3. Speicherdauer und Löschkonzepte</h3>
                    <p>Wir speichern Ihre Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Kontodaten:</strong> Bis zur Löschung Ihres Kontos.</li>
                        <li><strong>Marketingdaten (Newsletter):</strong> 24 Monate nach Ihrer Einwilligung oder bis zu Ihrem Widerruf.</li>
                        <li><strong>Profilingdaten (personalisierte Angebote):</strong> 12 Monate nach Ihrer Einwilligung oder bis zu Ihrem Widerruf.</li>
                    </ul>
                    <p className="mt-2">Die Löschung erfolgt durch automatisierte Time-to-Live (TTL) Policies in unserer Datenbank.</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-foreground mb-2">4. Einsatz von Künstlicher Intelligenz (KI)</h3>
                     <p>Für Funktionen wie den AI Sommelier oder den Newsletter-Assistenten nutzen wir Modelle von Google. Ihre Eingaben (Bilder, Texte) werden an Google zur Verarbeitung gesendet. Google ist vertraglich verpflichtet, diese Daten nicht für das Training eigener Modelle zu verwenden ("Zero Data Retention"). Die Nutzung dieser Funktionen ist freiwillig. Die KI-generierten Vorschläge sind unverbindlich.</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-foreground mb-2">5. Datenempfänger und Übermittlung in Drittländer</h3>
                    <p>Ihre Daten werden von uns und unseren Auftragsverarbeitern (insb. Google Cloud EMEA Ltd., Irland) verarbeitet. Eine Übermittlung in Länder außerhalb der EU (z.B. USA für Wartungszwecke durch Google LLC) wird durch das EU-U.S. Data Privacy Framework oder Standardvertragsklauseln abgesichert.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground mb-2">6. Ihre Rechte</h3>
                    <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch. Ihre Einwilligungen für Marketing und Profiling können Sie jederzeit in Ihren Profileinstellungen widerrufen. Sie haben zudem das Recht, Ihr Konto und alle damit verbundenen Daten jederzeit über Ihre Profileinstellungen endgültig zu löschen.</p>
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
                    <p>SENONER SARTEUR SAS DI SENONER ANDREAS & C.<br/>Via Meisules 111<br/>39048 Selva di Val Gardena (BZ), Italia<br/>E-mail: sarteur@pec.senoner-sarteur.it</p>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground mb-2">2. Tipi di dati trattati e basi giuridiche</h3>
                    <p>Durante l'utilizzo della nostra app, vengono trattati diversi dati personali:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Dati dell'account (Art. 6 par. 1 lett. b GDPR):</strong> Per creare e gestire il tuo account ed evadere gli ordini, trattiamo nome, indirizzo e-mail, numero di telefono e indirizzo. Il trattamento avviene su server di Google Cloud EMEA Ltd. (Irlanda).</li>
                        <li><strong>Cronologia acquisti e dati del profilo (Art. 6 par. 1 lett. a GDPR):</strong> Se fornisci il tuo consenso, analizziamo i tuoi acquisti per offrirti proposte personalizzate.</li>
                        <li><strong>Dati di comunicazione (Art. 6 par. 1 lett. a GDPR):</strong> Il tuo indirizzo e-mail per l'invio di newsletter, se hai acconsentito.</li>
                        <li><strong>Dati di utilizzo e interazioni IA (Art. 6 par. 1 lett. f GDPR):</strong> Le immagini per l'AI Sommelier o i testi per l'assistente newsletter vengono trattati per fornire la funzionalità. Il nostro interesse legittimo consiste nell'offrirti funzioni innovative dell'app. I dati non vengono salvati per altri scopi.</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-foreground mb-2">3. Periodo di conservazione e politiche di cancellazione</h3>
                    <p>Conserviamo i tuoi dati solo per il tempo necessario allo scopo per cui sono stati raccolti:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Dati dell'account:</strong> Fino alla cancellazione del tuo account.</li>
                        <li><strong>Dati di marketing (Newsletter):</strong> 24 mesi dal tuo consenso o fino a revoca.</li>
                        <li><strong>Dati di profilazione (offerte personalizzate):</strong> 12 mesi dal tuo consenso o fino a revoca.</li>
                    </ul>
                    <p className="mt-2">La cancellazione avviene tramite policy Time-to-Live (TTL) automatizzate nel nostro database.</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-foreground mb-2">4. Uso dell'Intelligenza Artificiale (IA)</h3>
                    <p>Per funzioni come l'AI Sommelier o l'assistente newsletter, utilizziamo modelli di Google. I tuoi input (immagini, testi) vengono inviati a Google per l'elaborazione. Google è contrattualmente obbligato a non utilizzare questi dati per l'addestramento dei propri modelli ("Zero Data Retention"). L'uso di queste funzioni è facoltativo. I suggerimenti generati dall'IA non sono vincolanti.</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-foreground mb-2">5. Destinatari dei dati e trasferimento verso paesi terzi</h3>
                    <p>I tuoi dati vengono trattati da noi e dai nostri responsabili del trattamento (in particolare Google Cloud EMEA Ltd., Irlanda). Un trasferimento in paesi al di fuori dell'UE (ad es. USA per manutenzione da parte di Google LLC) è garantito dal EU-U.S. Data Privacy Framework o da clausole contrattuali standard.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground mb-2">6. I tuoi diritti</h3>
                    <p>Hai il diritto di accesso, rettifica, cancellazione, limitazione, portabilità dei dati e opposizione. Puoi revocare in qualsiasi momento i tuoi consensi per marketing e profilazione nelle impostazioni del tuo profilo. Hai inoltre il diritto di cancellare definitivamente il tuo account e tutti i dati associati tramite le impostazioni del tuo profilo.</p>
                </div>
            </div>
          </section>

          <hr className="my-8" />

            <section>
                <h2 className="text-xl font-bold text-foreground mb-4 font-headline">Privacy Policy (English)</h2>
                <div className="space-y-6 text-sm">
                    <div>
                        <h3 className="font-semibold text-foreground mb-2">1. Data Controller</h3>
                        <p>SENONER SARTEUR SAS DI SENONER ANDREAS & C.<br/>Meisules 111<br/>39048 Selva Val Gardena (BZ), Italy<br/>Email: sarteur@pec.senoner-sarteur.it</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-2">2. Data Processing for App Usage</h3>
                        <p>When using our app, personal data is processed. This includes:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Account Data (Art. 6(1)(b) GDPR):</strong> To create and manage your account and process orders, we process your name, email, phone, and address. Processing occurs on servers of Google Cloud EMEA Ltd. (Ireland).</li>
                            <li><strong>Purchase History & Profile Data (Art. 6(1)(a) GDPR):</strong> With your consent, we analyze your purchases to provide personalized offers.</li>
                            <li><strong>Communication Data (Art. 6(1)(a) GDPR):</strong> Your email address for sending newsletters, if you have consented.</li>
                            <li><strong>Usage Data & AI Interactions (Art. 6(1)(f) GDPR):</strong> Images for the AI Sommelier or texts for the newsletter assistant are processed to provide functionality. Our legitimate interest is to offer innovative app features. Data is not stored for other purposes.</li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold text-foreground mb-2">3. Data Retention and Deletion Policies</h3>
                        <p>We store your data only as long as necessary for the respective purpose:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Account Data:</strong> Until you delete your account.</li>
                            <li><strong>Marketing Data (Newsletter):</strong> 24 months after your consent or until you withdraw it.</li>
                            <li><strong>Profiling Data (Personalized Offers):</strong> 12 months after your consent or until you withdraw it.</li>
                        </ul>
                         <p className="mt-2">Deletion is handled by automated Time-to-Live (TTL) policies in our database.</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-foreground mb-2">4. Use of Artificial Intelligence (AI)</h3>
                        <p>For features like the AI Sommelier or the newsletter assistant, we use models from Google. Your inputs (images, texts) are sent to Google for processing. Google is contractually bound not to use this data for training its own models ("Zero Data Retention"). The use of these features is voluntary. AI-generated suggestions are non-binding.</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-foreground mb-2">5. Data Recipients and Transfer to Third Countries</h3>
                        <p>Your data is processed by us and our data processors (esp. Google Cloud EMEA Ltd., Ireland). Any transfer to countries outside the EU (e.g., USA for maintenance by Google LLC) is secured by the EU-U.S. Data Privacy Framework or Standard Contractual Clauses.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-2">6. Your Rights</h3>
                        <p>You have the right to access, rectify, erase, restrict processing, data portability, and object. You can withdraw your consent for marketing and profiling at any time in your profile settings. You also have the right to permanently delete your account and all associated data via your profile settings.</p>
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
