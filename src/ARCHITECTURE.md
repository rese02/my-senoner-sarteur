# My Senoner Sarteur - Application Architecture

This document provides a comprehensive overview of the technical architecture, key concepts, and design decisions for the "My Senoner Sarteur" application.

## 1. Core Philosophy

The application is built on a modern, server-centric approach using the Next.js App Router. The primary goal is to maximize performance and security by keeping as much logic as possible on the server while providing a rich, interactive experience on the client.

- **Security First:** All sensitive operations, data fetching, and business logic are executed on the server. The client is treated as an untrusted environment.
- **Performance:** Leveraging Next.js Server Components reduces the amount of JavaScript shipped to the client, leading to faster initial page loads.
- **Maintainability:** A clear project structure, consistent use of UI components, and strong typing with TypeScript ensure the codebase is easy to understand and extend.

---

## 2. Technology Stack

| Category              | Technology                                       | Rationale                                                                                             |
| --------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Framework**         | **Next.js 14+ (App Router)**                     | Enables hybrid rendering (Server/Client Components) for optimal performance and developer experience. |
| **Language**          | **TypeScript**                                   | Provides type safety, reducing bugs and improving code clarity and maintainability.                 |
- **UI Components**     | **ShadCN UI**                                    | A high-quality, accessible, and customizable component library that accelerates UI development.       |
| **Styling**           | **Tailwind CSS**                                 | A utility-first CSS framework for rapid, consistent, and responsive styling.                        |
| **Backend & Database**| **Firebase (Firestore, Auth, Storage)**          | A scalable, serverless platform for authentication, database, and file storage.                       |
| **AI Integration**    | **Google Genkit**                                | A modern framework for building robust, production-ready AI flows and agents.                         |
| **Forms**             | **React Hook Form & Zod**                        | Provides performant, type-safe form state management and validation.                                |
| **Client State**      | **Zustand**                                      | A minimalist state management library for managing shared client-side state (e.g., the shopping cart).|

---

## 3. File & Folder Organization

The project structure is designed for a clear separation of concerns.

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
│   │   ├── flows/             # Genkit AI Flows (serverseitige AI-Logik)
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

## 4. Backend & API Structure: Server Actions

**The application does not have a traditional REST or GraphQL API.** Instead, all communication between the client and server is handled by **Next.js Server Actions**.

- **Location:** All Server Actions are centralized in the `src/app/actions/` directory, organized by domain (e.g., `auth.actions.ts`, `order.actions.ts`).
- **Security:** This is the most critical aspect. **Every Server Action that performs a mutation or accesses sensitive data MUST start with a role-check function** (e.g., `requireAdmin()`, `requireRole(['customer'])`). This ensures that only authorized users can execute them.
- **Input Validation:** All data received from the client is rigorously validated using **Zod**. This prevents invalid data from reaching the database or AI models and mitigates injection risks.
- **Invocation:** Client components call these `async` functions directly, typically within form submissions (`<form action={...}>`) or event handlers, often wrapped in `useTransition` to manage loading states.

**Example Flow (Creating an Order):**
1.  **Client (`Cart.tsx`):** A user clicks "Jetzt vorbestellen".
2.  An event handler calls the `createPreOrder` Server Action, passing the cart items and pickup date.
3.  **Server (`order.actions.ts`):** The `createPreOrder` function executes on the server.
    - It first calls `requireRole(['customer'])` to verify the user's session and role.
    - It then uses `Zod` to validate the incoming `items` and `pickupDate`.
    - It performs the business logic (calculating total, creating order object).
    - It writes the new order to the Firestore database using the Firebase Admin SDK.
    - It calls `revalidatePath()` to instruct Next.js to update the cache for relevant pages.

---

## 5. Authentication & Session Management

The authentication flow is designed to be secure and robust, combining client-side Firebase Auth with server-side session cookies.

1.  **Client-Side Login (`login-form.tsx`):** The user enters their credentials. The form calls `signInWithEmailAndPassword` from the Firebase *client* SDK.
2.  **Token Generation:** Upon successful login, the client SDK provides an `idToken`.
3.  **Server-Side Session Creation (`auth.actions.ts`):** The `idToken` is immediately sent to the `createSession` Server Action.
4.  **Verification & Cookie:**
    - The server verifies the `idToken` using the Firebase *Admin* SDK. This is a crucial security step.
    - If valid, the server generates a secure, `httpOnly` session cookie using `adminAuth.createSessionCookie()`.
    - This cookie is sent back to the browser. `httpOnly` prevents it from being accessed by client-side JavaScript, mitigating XSS attacks.
5.  **Session Access:**
    - **Server:** On subsequent requests, the `getSession()` function (`/lib/session.ts`) reads and verifies the cookie on the server, providing user data to Server Components and Server Actions.
    - **Client:** The `useSession()` hook (`/hooks/use-session.ts`) uses Firebase's `onAuthStateChanged` listener to provide a reactive, client-side view of the user's session state for UI purposes.

---

## 6. Database Schema (Firestore)

The "source of truth" for the data model is defined in `docs/backend.json`. All interactions with Firestore on the server happen via the Firebase Admin SDK, initialized in `lib/firebase-admin.ts`.

### Key Collections:
- `/users/{userId}`: Stores user profiles, including `role`, `loyaltyStamps`, `activePrize`, and personal details.
- `/orders/{orderId}`: Contains all customer orders, distinguished by a `type` field (`preorder` or `grocery_list`).
- `/products/{productId}`: The main product catalog.
- `/categories/{categoryId}`: A simple collection to group products.
- `/stories/{storyId}`: Content for the "Daily Stories" feature on the customer dashboard.
- `/plannerEvents/{eventId}`: Templates for the Party Planner feature.
- `/wine_catalog/{wineId}`: A specialized catalog for the AI Sommelier, enriched with AI-generated tags.
- `/content/{documentId}`: A collection for singleton documents, such as `recipe_of_the_week` and `wheel_of_fortune` settings.

---

## 7. AI Integration (Genkit)

All AI-powered features follow a secure, server-only pattern.

- **Architecture:** `Client Component` -> `Server Action` -> `Genkit Flow`
- **Genkit Flows (`/ai/flows`):** Each AI task is encapsulated in its own flow file (e.g., `suggest-wine-pairing.ts`).
    - Flows are marked with `'use server';` to prevent them from being bundled on the client.
    - They define input/output schemas using `Zod` for type safety and structured prompting.
    - They interact with the AI model (e.g., Google's Gemini).
- **Server Actions as a Bridge (`/app/actions/ai.actions.ts`):**
    - Client components **never** import or call a flow directly.
    - Instead, they call a dedicated Server Action (e.g., `getWineSuggestion`).
    - This action performs authorization checks and then calls the corresponding Genkit flow on the server. This abstraction layer is vital for security and prevents leaking AI logic or keys to the client.

---

## 8. Styling & UI

- **Component Library:** The UI is built almost exclusively with **ShadCN UI** components. This ensures visual consistency, accessibility, and a high-quality finish.
- **Theming:** The application's color palette is defined using CSS variables in `src/app/globals.css`. This allows for easy theme adjustments across the entire app. The primary colors are a corporate blue (`--primary`), a light gray (`--secondary`), and a vibrant blue for highlights (`--accent`).
- **Responsiveness:** All pages and components are designed **mobile-first**. `flex`, `grid`, and responsive Tailwind variants (e.g., `md:grid-cols-2`) are used extensively to ensure the UI adapts gracefully from small phones to large desktops.
- **Fonts:** The app uses a combination of a sans-serif font for body text (`PT Sans`) and a serif font for headlines (`Playfair Display`) to create a professional and elegant look, defined in `src/app/layout.tsx`.
