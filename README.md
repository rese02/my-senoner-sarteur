# My Senoner Sarteur - Digitaler Begleiter

Willkommen im offiziellen Repository der "My Senoner Sarteur" App, einem digitalen Begleiter für Kunden des Premium-Supermarkts Senoner Sarteur.

## Inhaltsverzeichnis

1.  [Core App Konzept & Personas](#1-core-app-konzept--personas)
2.  [Technologie-Stack](#2-technologie-stack)
3.  [Projektstruktur](#3-projektstruktur)
4.  [Einrichtung & Lokaler Start](#4-einrichtung--lokaler-start)
5.  [Architektur & Schlüsselkonzepte](#5-architektur--schlüsselkonzepte)
    -   [Server- & Client-Komponenten](#server--client-komponenten)
    -   [Server Actions als Backend-Schnittstelle](#server-actions-als-backend-schnittstelle)
    -   [Authentifizierung & Sessions](#authentifizierung--sessions)
    -   [AI Integration mit Genkit](#ai-integration-mit-genkit)
    -   [Datenbank (Firebase)](#datenbank-firebase)
6.  [Styling & UI](#6-styling--ui)

---

## 1. Core App Konzept & Personas

Diese Anwendung erweitert das Einkaufserlebnis durch digitale Services und optimiert gleichzeitig interne Abläufe.

-   **Kunde:** Die Hauptzielgruppe. Kunden nutzen die App, um Produkte vorzubestellen, den persönlichen Concierge-Service zu nutzen, ihre Treuepunkte via QR-Code zu verwalten und auf AI-gestützte Features wie den Party-Planer oder den AI-Sommelier zuzugreifen.
-   **Mitarbeiter:** Nutzt eine minimalistische Kassen-Schnittstelle, um Kundenkarten zu scannen, Stempel zu vergeben, Gewinne einzulösen und Einkaufszettel-Bestellungen abzuwickeln.
-   **Admin:** Verwaltet das gesamte Ökosystem über ein umfassendes Dashboard (Produkte, Bestellungen, Kunden, Marketing-Inhalte).

## 2. Technologie-Stack

-   **Framework:** Next.js 15+ (App Router)
-   **Sprache:** TypeScript
-   **Backend-as-a-Service:** Firebase (Authentication, Firestore, Storage)
-   **AI-Integration:** Google Genkit
-   **UI-Bibliothek:** ShadCN UI
-   **Styling:** Tailwind CSS
-   **Formular-Management:** React Hook Form & Zod
-   **State Management (Client):** Zustand

## 3. Projektstruktur

Die Ordnerstruktur ist darauf ausgelegt, eine klare Trennung der Verantwortlichkeiten zu gewährleisten.

```
/
├── src/
│   ├── app/
│   │   ├── (public)/          # Seiten ohne Login (Login, Register, Impressum)
│   │   ├── (customer)/        # Geschützter Bereich für Kunden
│   │   ├── (admin)/           # Geschützter Bereich für Admins
│   │   ├── (employee)/        # Geschützter Bereich für Mitarbeiter
│   │   ├── actions/           # Alle Server Actions (API-Logik)
│   │   └── layout.tsx         # Haupt-Layout
│   │
│   ├── ai/
│   │   ├── flows/             # Genkit AI Flows
│   │   └── genkit.ts          # Globale Genkit-Initialisierung
│   │
│   ├── components/
│   │   ├── common/            # App-weite, allgemeine Komponenten (Logo, PageHeader)
│   │   ├── custom/            # Komplexere, App-spezifische Komponenten (ProductCard)
│   │   └── ui/                # ShadCN UI Komponenten (Button, Card, etc.)
│   │
│   ├── firebase/              # Firebase Client-Konfiguration & Provider
│   │
│   ├── hooks/                 # Benutzerdefinierte React Hooks (useSession, useToast)
│   │
│   ├── lib/
│   │   ├── firebase-admin.ts  # Serverseitige Firebase Admin Initialisierung
│   │   ├── session.ts         # Serverseitige Session-Verwaltung
│   │   ├── types.ts           # Globale TypeScript-Typdefinitionen
│   │   └── utils.ts           # Hilfsfunktionen
│   │
│   └── middleware.ts        # Next.js Middleware für Route-Schutz
│
├── docs/
│   └── backend.json         # Firebase Data Model (Quelle der Wahrheit)
│
├── public/                    # Statische Assets (Bilder, etc.)
│
├── .env.example               # Vorlage für Umgebungsvariablen
├── next.config.mjs            # Next.js Konfiguration
└── package.json               # Abhängigkeiten und Skripte
```

## 4. Einrichtung & Lokaler Start

### Voraussetzungen

-   Node.js >= 18.x
-   `npm` oder ein anderer Paketmanager

### Schritt 1: Umgebungsvariablen

Erstellen Sie eine `.env`-Datei im Stammverzeichnis des Projekts, indem Sie die `.env.example`-Datei kopieren.

```bash
cp .env.example .env
```

Füllen Sie die `.env`-Datei mit Ihren Firebase-Projekt-Credentials aus. Sie benötigen ein **Service Account JSON** von Ihrem Firebase-Projekt.

### Schritt 2: Abhängigkeiten installieren

```bash
npm install
```

### Schritt 3: Entwicklungs-Server starten

```bash
npm run dev
```

Die Anwendung ist nun unter `http://localhost:9002` erreichbar.

## 5. Architektur & Schlüsselkonzepte

### Server- & Client-Komponenten

Die App nutzt konsequent das hybride Modell des Next.js App Routers:

-   **Server Components (`page.tsx`)**: Übernehmen das Laden der Daten (`async/await`) und die Weitergabe an Client-Komponenten. Sie sind die Standardeinstellung.
-   **Client Components (`client.tsx`, `_components/*.tsx`)**: Werden für jegliche Interaktivität verwendet (z.B. `useState`, `useEffect`, Klick-Handler) und sind mit `'use client';` gekennzeichnet.

### Server Actions als Backend-Schnittstelle

Anstelle einer klassischen REST-API wird die gesamte serverseitige Logik über **Server Actions** abgewickelt.

-   **Ort:** Alle Aktionen sind im Verzeichnis `src/app/actions/` zentralisiert und nach Zuständigkeit gruppiert (z.B. `auth.actions.ts`, `order.actions.ts`).
-   **Sicherheit:** Jede Aktion validiert die Benutzersession und die Eingabedaten (mittels Zod), bevor sie Datenbankoperationen ausführt.
-   **Aufruf:** Client-Komponenten rufen diese `async` Funktionen direkt auf, z.B. in `form action={...}` oder via `startTransition`.

### Authentifizierung & Sessions

-   Die Authentifizierung erfolgt über **Firebase Authentication** auf dem Client.
-   Nach erfolgreichem Login wird ein ID-Token an die `createSession` Server Action gesendet.
-   Diese Action verifiziert das Token serverseitig und erstellt einen sicheren, `httpOnly` **Session-Cookie**.
-   Die `getSession()`-Funktion in `src/lib/session.ts` liest diesen Cookie serverseitig aus und stellt die Benutzerdaten für Server-Komponenten und Server Actions bereit.
-   Der `useSession()`-Hook in `src/hooks/use-session.ts` stellt die Session-Daten für Client-Komponenten reaktiv zur Verfügung.

### AI Integration mit Genkit

-   Alle AI-Funktionen werden über **Google Genkit** implementiert.
-   Die Logik ist in `Flows` gekapselt, die sich in `src/ai/flows/` befinden.
-   **Architektur:** UI-Komponente -> Server Action (`/actions/ai.actions.ts`) -> Genkit Flow (`/ai/flows/*.ts`). Dieser Aufbau stellt sicher, dass keine sensible AI-Logik zum Client gelangt.

### Datenbank (Firebase)

-   **Firestore** wird als primäre Datenbank für alle Anwendungsdaten (Benutzer, Produkte, Bestellungen) genutzt.
-   Das **Datenmodell** ist in `docs/backend.json` definiert und dient als "Source of Truth".
-   Die serverseitige Interaktion erfolgt über das **Firebase Admin SDK** (`src/lib/firebase-admin.ts`).

## 6. Styling & UI

-   **UI-Bibliothek:** Die App basiert vollständig auf **ShadCN UI**. Alle UI-Elemente (`Button`, `Card`, `Dialog`, etc.) stammen aus diesem System. Eigene Komponenten sollten sich stilistisch daran orientieren.
-   **Styling:** **Tailwind CSS** wird für das gesamte Styling verwendet. Die Markenfarben und das Design-System sind in `src/app/globals.css` und `tailwind.config.ts` definiert.
-   **Responsiveness:** Das Layout ist **Mobile-First**. Alle Seiten und Komponenten müssen auf kleinen Bildschirmen einwandfrei funktionieren und dürfen keinen horizontalen Scrollbalken erzeugen. `flex` und `grid` sind die primären Werkzeuge für responsive Layouts.
