# My Senoner Sarteur - Digitaler Begleiter

Willkommen im offiziellen Repository der "My Senoner Sarteur" App, einem digitalen Begleiter für Kunden des Premium-Supermarkts Senoner Sarteur.

## Inhaltsverzeichnis

1.  [Core App Konzept](#1-core-app-konzept)
2.  [Technologie-Stack](#2-technologie-stack)
3.  [Einrichtung & Lokaler Start](#3-einrichtung--lokaler-start)
4.  [Architektur & Schlüsselkonzepte](#4-architektur--schlüsselkonzepte)
5.  [Version Control mit Git](#5-version-control-mit-git)

---

## 1. Core App Konzept

Diese Anwendung erweitert das Einkaufserlebnis durch digitale Services und optimiert gleichzeitig interne Abläufe.

-   **Kunde:** Die Hauptzielgruppe. Kunden nutzen die App, um Produkte vorzubestellen, den persönlichen Concierge-Service (Einkaufszettel) zu nutzen, ihre Treuepunkte via QR-Code zu verwalten und auf Features wie das Glücksrad, den Party-Planer oder den AI-Sommelier zuzugreifen.
-   **Mitarbeiter:** Nutzt eine minimalistische Kassen-Schnittstelle, um Kundenkarten zu scannen, Stempel zu vergeben, Gewinne einzulösen und Einkaufszettel-Bestellungen abzuwickeln.
-   **Admin:** Verwaltet das gesamte Ökosystem über ein umfassendes, responsives Dashboard (Produkte, Bestellungen, Kunden, Marketing-Inhalte).

## 2. Technologie-Stack

-   **Framework:** Next.js 15+ (App Router)
-   **Sprache:** TypeScript
-   **Backend-as-a-Service:** Firebase (Authentication, Firestore, Storage)
-   **AI-Integration:** Google Genkit
-   **UI-Bibliothek:** ShadCN UI & Radix UI
-   **Styling:** Tailwind CSS
-   **Formular-Management:** React Hook Form & Zod
-   **State Management (Client):** Zustand (für den Warenkorb)

## 3. Einrichtung & Lokaler Start

### Voraussetzungen

-   Node.js >= 18.x
-   `npm` oder ein anderer Paketmanager

### Schritt 1: Umgebungsvariablen

Erstellen Sie eine `.env`-Datei im Stammverzeichnis des Projekts. Füllen Sie die Datei mit Ihren Firebase-Projekt-Credentials.

```bash
# .env

# Firebase Client SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...

# Firebase Admin SDK Configuration (for Server Actions)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...=\n-----END PRIVATE KEY-----\n"

# Email Configuration (for Nodemailer)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=user@example.com
EMAIL_SERVER_PASSWORD=your_password
EMAIL_FROM=noreply@example.com
```

### Schritt 2: Abhängigkeiten installieren

```bash
npm install
```

### Schritt 3: Entwicklungs-Server starten

```bash
npm run dev
```

Die Anwendung ist nun unter `http://localhost:9003` erreichbar.

## 4. Architektur & Schlüsselkonzepte

Dieses Projekt folgt einem modernen, server-zentrierten Ansatz mit dem Next.js App Router. Alle kritischen Operationen wie Datenabruf, Geschäftslogik und AI-Aufrufe finden auf dem Server statt, um maximale Sicherheit und Performance zu gewährleisten.

Eine detaillierte Beschreibung der Architektur, des Datenmodells, des Authentifizierungsflusses und der Design-Entscheidungen finden Sie im folgenden Dokument:

➡️ **[Zum vollständigen Architektur-Dokument](./src/ARCHITECTURE.md)**

---

## 5. Version Control mit Git

Um Ihre Code-Änderungen zu speichern und in Ihr Git-Repository (z.B. auf GitHub) hochzuladen, führen Sie die folgenden drei Befehle in Ihrem Terminal aus.

### Schritt 1: Alle Änderungen zur "Staging Area" hinzufügen

Dieser Befehl bereitet alle neuen und geänderten Dateien für den Upload vor.

```bash
git add .
```

### Schritt 2: Die Änderungen "committen"

Hiermit erstellen Sie einen Schnappschuss Ihrer Änderungen mit einer beschreibenden Nachricht. Ersetzen Sie `"Ihre Nachricht hier"` durch eine kurze Beschreibung dessen, was Sie getan haben.

```bash
git commit -m "Ihre Nachricht hier"
```
_Beispiel: `git commit -m "Feat: Redesign des Admin Dashboards"`_

### Schritt 3: Änderungen zum Remote-Server hochladen

Dieser Befehl lädt Ihre "committeten" Änderungen in das Online-Repository hoch.

```bash
git push
```

Nachdem dieser Befehl abgeschlossen ist, sind Ihre Änderungen sicher im Git-Repository gespeichert.
