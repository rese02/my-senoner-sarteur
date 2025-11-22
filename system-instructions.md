
# System Instructions for "My Senoner Sarteur" App

## 1. Core App Concept & Personas

- **App Name:** My Senoner Sarteur
- **Core Goal:** A high-quality, mobile-first digital companion for a premium supermarket in South Tyrol. The app enhances the customer experience and streamlines administrative tasks.
- **Personas & Roles:**
    - **Customer:** Accesses a personalized dashboard for pre-ordering products, viewing daily stories, using a digital loyalty card (QR code), and leveraging AI-powered services like a party planner and sommelier.
    - **Employee:** Uses a minimalistic, robust interface for point-of-sale tasks, primarily scanning customer QR codes to add points/redeem rewards and processing grocery list orders.
    - **Admin:** Manages the entire ecosystem via a comprehensive dashboard, including orders, products, customers, and marketing content.

## 2. Technical Stack & Coding Guidelines

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI Components:** ShadCN UI (must be used whenever possible). Custom components should match the ShadCN aesthetic.
- **Styling:** Tailwind CSS. All styling must be responsive and mobile-first. No fixed widths that break mobile layouts. Use flexible grids (`grid`) and flexbox (`flex`) to ensure layouts adapt to all screen sizes.
- **AI Integration:** Google Genkit for all AI-powered features (e.g., text improvement, wine suggestions).
- **Backend/DB:** Firebase (Authentication and Firestore). Server-side logic and data mutations should be handled via Next.js Server Actions.
- **Guiding Principles:**
    - **Mobile-First is Non-Negotiable:** Every feature and UI component *must* be designed and tested for a flawless experience on small mobile screens first, then scaled up to desktop. Horizontal scrolling on mobile is a critical bug.
    - **Consistency:** The user interface must be consistent across all pages, both visually and functionally. Re-use components (`Card`, `Button`, etc.) to maintain this consistency.
    - **Clarity & Intuitiveness:** All user interactions must be simple, clear, and intuitive. A user should never have to guess what a button does. Icons must be used to support text and improve usability.

## 3. Design & Style Guidelines

- **Overall Feel:** Clean, premium, elegant, and well-spaced. High readability and intuitive navigation are paramount.
- **Color Palette (as implemented):**
    - **Primary:** A corporate, trustworthy blue (used for primary buttons, headers, and the customer sidebar). `hsl(var(--primary))`
    - **Secondary/Background:** Light, neutral grays and whites to create a clean and airy feel. `hsl(var(--background))`, `hsl(var(--secondary))`
    - **Accent:** A subtle bronze/copper tone for highlighting specific elements. `hsl(var(--accent))`
- **Fonts:**
    - **Body Text:** 'PT Sans' (`font-body`) for clear, accessible information.
    - **Headlines:** 'Playfair Display' (`font-headline`) for elegant titles.
- **Component Styling:**
    - Use rounded corners (`rounded-2xl` for cards, `rounded-full` for action buttons).
    - Use subtle shadows (`shadow-sm`, `shadow-lg`) to create depth.
    - Maintain generous spacing between elements to avoid a cluttered look.

## 4. Key Functional Requirements

- **Admin - Responsive Layouts:** All admin pages (Dashboard, Orders, Products, Customers, Marketing) must be fully responsive, switching from detailed tables on desktop to a compact card-based view on mobile.
- **Customer - Seamless Mobile UX:** The customer dashboard, product lists, and special feature pages (Planner, Concierge, Loyalty) must provide a native-app-like experience on mobile, with no layout breaks or horizontal scrolling.
- **Floating Action Button (Cart):** On the main customer dashboard, a floating cart button must be present in the bottom right corner on mobile, providing quick access to the order summary.
- **Dialogs & Modals:** Must be used for displaying detailed information (e.g., order details, story views) without navigating away from the current page. They must be responsive and correctly sized on all devices.
