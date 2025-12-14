# My Senoner Sarteur - Anwendungsarchitektur

Dieses Dokument bietet einen umfassenden Überblick über die technische Architektur, die Schlüsselkonzepte und die Designentscheidungen für die "My Senoner Sarteur"-Anwendung.

## 1. Kernphilosophie

Die Anwendung basiert auf einem modernen, serverzentrierten Ansatz unter Verwendung des Next.js App Routers. Das Hauptziel besteht darin, die Leistung und Sicherheit zu maximieren, indem so viel Logik wie möglich auf dem Server belassen wird, während gleichzeitig eine reichhaltige, interaktive Erfahrung auf dem Client geboten wird.

- **Sicherheit an erster Stelle:** Alle sensiblen Operationen, Datenabrufe und Geschäftslogiken werden auf dem Server ausgeführt. Der Client wird als nicht vertrauenswürdige Umgebung behandelt.
- **Leistung:** Die Nutzung von Next.js Server Components reduziert die Menge an JavaScript, die an den Client gesendet wird, was zu schnelleren Ladezeiten der initialen Seite führt.
- **Wartbarkeit:** Eine klare Projektstruktur, die konsequente Verwendung von UI-Komponenten und eine starke Typisierung mit TypeScript stellen sicher, dass die Codebasis leicht zu verstehen und zu erweitern ist.

---

## 2. Technologie-Stack

| Kategorie | Technologie | Begründung |
|---|---|---|
| **Framework** | **Next.js 14+ (App Router)** | Ermöglicht hybrides Rendering (Server/Client Components) für optimale Leistung und Entwicklererfahrung. |
| **Sprache** | **TypeScript** | Bietet Typsicherheit, reduziert Fehler und verbessert die Klarheit und Wartbarkeit des Codes. |
| **UI-Komponenten** | **ShadCN UI** | Eine hochwertige, zugängliche und anpassbare Komponentenbibliothek, die die UI-Entwicklung beschleunigt. |
| **Styling** | **Tailwind CSS** | Ein Utility-First-CSS-Framework für schnelles, konsistentes und responsives Styling. |
| **Backend & Datenbank** | **Firebase (Firestore, Auth, Storage)** | Eine skalierbare, serverlose Plattform für Authentifizierung, Datenbank und Dateispeicherung. |
| **KI-Integration** | **Google Genkit** | Ein modernes Framework zum Erstellen robuster, produktionsreifer KI-Flows und -Agenten. |
| **Formulare** | **React Hook Form & Zod** | Bietet performantes, typsicheres Formular-Zustandsmanagement und Validierung. |
| **Client-Zustand** | **Zustand** | Eine minimalistische Zustandsmanagement-Bibliothek zur Verwaltung von geteiltem Client-seitigem Zustand (z.B. der Warenkorb).|

---

## 3. Datei- & Ordnerorganisation

Die Projektstruktur ist auf eine klare Trennung der Verantwortlichkeiten ausgelegt.

```
/
├── src/
│   ├── app/
│   │   ├── (public)/          # Ungeschützte Routen (Login, Register)
│   │   ├── (customer)/        # Routen für eingeloggte Kunden
│   │   ├── (admin)/           # Routen für Administratoren
│   │   ├── (employee)/        # Routen für Mitarbeiter
│   │   ├── actions/           # **Herzstück des Backends**: Alle Server Actions
│   │   └── layout.tsx         # Haupt-Layout der App
│   │
│   ├── ai/
│   │   ├── flows/             # Genkit AI Flows (serverseitige KI-Logik)
│   │   └── genkit.ts          # Globale Genkit-Konfiguration
│   │
│   ├── components/
│   │   ├── common/            # Allgemeine, wiederverwendbare Komponenten
│   │   ├── custom/            # App-spezifische, komplexere Komponenten
│   │   └── ui/                # Unveränderte ShadCN UI-Komponenten
│   │
│   ├── firebase/              # Firebase Client-Konfiguration & Provider
│   │
│   ├── hooks/                 # Benutzerdefinierte React Hooks (z.B. useSession)
│   │
│   ├── lib/
│   │   ├── firebase-admin.ts  # Serverseitige Firebase Admin Initialisierung
│   │   ├── session.ts         # Serverseitige Session-Verwaltung
│   │   ├── types.ts           # Globale TypeScript-Typdefinitionen
│   │   └── utils.ts           # Allgemeine Hilfsfunktionen
│   │
│   └── middleware.ts          # Next.js Middleware für grundlegenden Routenschutz
│
├── docs/
│   └── backend.json           # "Source of Truth" für das Firebase Datenmodell
│
├── public/                    # Statische Assets (Logo, etc.)
│
├── .env                       # Geheime Umgebungsvariablen
├── next.config.mjs            # Next.js Konfiguration
└── package.json               # Abhängigkeiten
```

---

## 4. Backend & API-Struktur: Server Actions

**Die Anwendung verfügt nicht über eine traditionelle REST- oder GraphQL-API.** Stattdessen wird die gesamte Kommunikation zwischen Client und Server über **Next.js Server Actions** abgewickelt.

- **Ort:** Alle Server Actions sind im Verzeichnis `src/app/actions/` zentralisiert und nach Domänen geordnet (z.B. `auth.actions.ts`, `order.actions.ts`).
- **Sicherheit:** Dies ist der kritischste Aspekt. **Jede Server Action, die eine Mutation durchführt oder auf sensible Daten zugreift, MUSS mit einer Rollenprüfungsfunktion beginnen** (z.B. `requireAdmin()`, `requireRole(['customer'])`). Dadurch wird sichergestellt, dass nur autorisierte Benutzer sie ausführen können.
- **Eingabevalidierung:** Alle vom Client empfangenen Daten werden rigoros mit **Zod** validiert. Dies verhindert, dass ungültige Daten die Datenbank oder KI-Modelle erreichen, und mindert Injektionsrisiken.
- **Aufruf:** Client-Komponenten rufen diese `async`-Funktionen direkt auf, typischerweise innerhalb von Formular-Submissions (`<form action={...}>`) oder Event-Handlern, oft verpackt in `useTransition`, um Ladezustände zu verwalten.

**Beispiel-Flow (Erstellen einer Bestellung):**
1.  **Client (`Cart.tsx`):** Ein Benutzer klickt auf "Jetzt vorbestellen".
2.  Ein Event-Handler ruft die `createPreOrder` Server Action auf und übergibt die Warenkorb-Artikel und das Abholdatum.
3.  **Server (`order.actions.ts`):** Die `createPreOrder`-Funktion wird auf dem Server ausgeführt.
    - Zuerst ruft sie `requireRole(['customer'])` auf, um die Sitzung und Rolle des Benutzers zu überprüfen.
    - Dann verwendet sie `Zod`, um die eingehenden `items` und das `pickupDate` zu validieren.
    - Sie führt die Geschäftslogik aus (Berechnung der Gesamtsumme, Erstellung des Bestellobjekts).
    - Sie schreibt die neue Bestellung über das Firebase Admin SDK in die Firestore-Datenbank.
    - Sie ruft `revalidatePath()` auf, um Next.js anzuweisen, den Cache für relevante Seiten zu aktualisieren.

---

## 5. Authentifizierung & Sitzungsverwaltung

Der Authentifizierungs-Flow ist sicher und robust konzipiert und kombiniert clientseitige Firebase Auth mit serverseitigen Sitzungs-Cookies.

1.  **Client-seitiger Login (`login-form.tsx`):** Der Benutzer gibt seine Anmeldeinformationen ein. Das Formular ruft `signInWithEmailAndPassword` aus dem Firebase *Client* SDK auf.
2.  **Token-Generierung:** Nach erfolgreichem Login stellt das Client SDK ein `idToken` zur Verfügung.
3.  **Serverseitige Sitzungserstellung (`auth.actions.ts`):** Das `idToken` wird sofort an die `createSession` Server Action gesendet.
4.  **Verifizierung & Cookie:**
    - Der Server verifiziert das `idToken` mit dem Firebase *Admin* SDK. Dies ist ein entscheidender Sicherheitsschritt.
    - Bei Gültigkeit generiert der Server ein sicheres, `httpOnly` Sitzungs-Cookie mit `adminAuth.createSessionCookie()`.
    - Dieses Cookie wird an den Browser zurückgesendet. `httpOnly` verhindert den Zugriff durch clientseitiges JavaScript und mindert so XSS-Angriffe.
5.  **Sitzungszugriff:**
    - **Server:** Bei nachfolgenden Anfragen liest und verifiziert die `getSession()`-Funktion (`/lib/session.ts`) das Cookie auf dem Server und stellt Benutzerdaten für Server Components und Server Actions bereit.
    - **Client:** Der `useSession()`-Hook (`/hooks/use-session.ts`) verwendet den `onAuthStateChanged`-Listener von Firebase, um eine reaktive, clientseitige Ansicht des Sitzungszustands des Benutzers für UI-Zwecke bereitzustellen.

---

## 6. Datenbankschema (Firestore)

Die "Quelle der Wahrheit" für das Datenmodell ist in `docs/backend.json` definiert. Alle Interaktionen mit Firestore auf dem Server erfolgen über das Firebase Admin SDK, das in `lib/firebase-admin.ts` initialisiert wird.

### Schlüssel-Sammlungen:
- `/users/{userId}`: Speichert Benutzerprofile, einschließlich `role`, `loyaltyStamps`, `activePrize` und persönliche Details.
- `/orders/{orderId}`: Enthält alle Kundenbestellungen, unterschieden durch ein `type`-Feld (`preorder` oder `grocery_list`).
- `/products/{productId}`: Der Hauptproduktkatalog.
- `/categories/{categoryId}`: Eine einfache Sammlung zur Gruppierung von Produkten.
- `/stories/{storyId}`: Inhalte für die "Daily Stories"-Funktion auf dem Kunden-Dashboard.
- `/plannerEvents/{eventId}`: Vorlagen für die Party-Planer-Funktion.
- `/wine_catalog/{wineId}`: Ein spezieller Katalog für den AI Sommelier, angereichert mit KI-generierten Tags.
- `/content/{documentId}`: Eine Sammlung für Singleton-Dokumente, wie `recipe_of_the_week` und `wheel_of_fortune`-Einstellungen.

---

## 7. KI-Integration (Genkit)

Alle KI-gestützten Funktionen folgen einem sicheren, reinen Server-Muster.

- **Architektur:** `Client Component` -> `Server Action` -> `Genkit Flow`
- **Genkit Flows (`/ai/flows`):** Jede KI-Aufgabe ist in einer eigenen Flow-Datei gekapselt (z.B. `suggest-wine-pairing.ts`).
    - Flows sind mit `'use server';` und `'server-only';` gekennzeichnet, um zu verhindern, dass sie auf dem Client gebündelt werden.
    - Sie definieren Eingabe-/Ausgabe-Schemata mit `Zod` für Typsicherheit und strukturiertes Prompting.
    - Sie interagieren mit dem KI-Modell (z.B. Google Gemini).
- **Server Actions als Brücke (`/app/actions/ai.actions.ts`):**
    - Client-Komponenten importieren oder rufen **niemals** einen Flow direkt auf.
    - Stattdessen rufen sie eine dedizierte Server Action auf (z.B. `getWineSuggestion`).
    - Diese Aktion führt Autorisierungsprüfungen durch und ruft dann den entsprechenden Genkit-Flow auf dem Server auf. Diese Abstraktionsschicht ist entscheidend für die Sicherheit und verhindert, dass KI-Logik oder -Schlüssel an den Client gelangen.

---

## 8. Styling & UI

- **Komponentenbibliothek:** Die Benutzeroberfläche basiert fast ausschließlich auf **ShadCN UI**-Komponenten. Dies gewährleistet visuelle Konsistenz, Barrierefreiheit und eine hochwertige Verarbeitung.
- **Theming:** Die Farbpalette der Anwendung ist über CSS-Variablen in `src/app/globals.css` definiert. Dies ermöglicht einfache Anpassungen des Themas für die gesamte App. Die Primärfarben sind ein Unternehmensblau (`--primary`), ein helles Grau (`--secondary`) und ein leuchtendes Blau für Highlights (`--accent`).
- **Responsivität:** Alle Seiten und Komponenten sind **Mobile-First** gestaltet. `flex`, `grid` und responsive Tailwind-Varianten (z.B. `md:grid-cols-2`) werden umfassend genutzt, um sicherzustellen, dass sich die UI von kleinen Telefonen bis zu großen Desktops elegant anpasst.
- **Schriftarten:** Die App verwendet eine Kombination aus einer serifenlosen Schriftart für den Fließtext (`PT Sans`) und einer Serifenschrift für Überschriften (`Playfair Display`), um einen professionellen und eleganten Look zu erzeugen, der in `src/app/layout.tsx` definiert ist.
