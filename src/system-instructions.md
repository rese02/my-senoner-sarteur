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
    - **Primary:** A deep, trustworthy blue (used for primary buttons, headers, and the customer sidebar). `hsl(var(--primary))` which is `212 82% 28%`.
    - **Secondary/Background:** Light, neutral grays and whites to create a clean and airy feel. `hsl(var(--background))`, `hsl(var(--secondary))`
    - **Accent:** A vibrant, modern blue for highlights, active states, and special badges. `hsl(var(--accent))` which is `217 91% 60%`.
- **Fonts:**
    - **Body Text & Headlines:** 'PT Sans' (`font-body`) for a clean, modern, and highly readable interface across all text.
- **Component Styling:**
    - Use rounded corners (`rounded-xl` for cards, `rounded-full` for action buttons).
    - Use subtle shadows (`shadow-sm`, `shadow-lg`) to create depth.
    - Maintain generous spacing between elements to avoid a cluttered look.

## 4. Key Functional Requirements

- **Admin - Responsive Layouts:** All admin pages (Dashboard, Orders, Products, Customers, Marketing) must be fully responsive, switching from detailed tables on desktop to a compact card-based view on mobile.
- **Customer - Seamless Mobile UX:** The customer dashboard, product lists, and special feature pages (Planner, Concierge, Loyalty) must provide a native-app-like experience on mobile, with no layout breaks or horizontal scrolling.
- **Mobile Navigation:** On pages with a fixed bottom navigation bar (Admin and Customer mobile views), the main content area must have a bottom padding (e.g., `pb-24`) to prevent content from being obscured by the navigation bar.
- **Dialogs & Modals:** Must be used for displaying detailed information (e.g., order details, story views) without navigating away from the current page. They must be responsive and correctly sized on all devices.
- **Button Layouts:** Buttons inside cards must be responsive. If multiple buttons are present, they should appear side-by-side on wider screens and automatically stack vertically on smaller screens to prevent overflow and text truncation.

## 5. Detailed Application Structure & User Flows

This section provides a comprehensive overview of each part of the application, broken down by user role.

---

### 5.1 The Customer Journey

The customer is the primary user. Their experience is designed to be seamless, elegant, and highly functional on mobile devices.

#### 5.1.1 Authentication (`/login`, `/register`)
- **Functionality:** Standard login and registration forms with a consistent, premium dark-blue theme. Upon successful authentication, the user is redirected to their main dashboard (`/dashboard`).
- **Navigation:** New users navigate from `/login` to `/register`. After logout, users are returned to `/login`. Links to `/impressum` and `/datenschutz` are present.
- **Registration Form:** A detailed form (`register-form.tsx`) capturing name, email, password, phone, and address. Includes a mandatory `Checkbox` for DSGVO/Privacy Policy consent.

#### 5.1.2 Main Dashboard (`/dashboard`)
- **Core View:** This is the customer's landing page.
- **Layout:**
    - **Mobile:** A single-column layout. A blue `bg-primary` header contains a sheet-based menu and user profile. The main content scrolls vertically. The `MobileNav` is fixed at the bottom.
    - **Desktop:** A two-column layout. A permanent `CustomerSidebar` is on the left. The main content area is in the center, next to a permanently visible, sticky cart sidebar on the right.
- **Components:**
    - **Daily Stories:** A horizontal, scrollable list of stories (`Stories` component). Tapping a story opens a full-screen, responsive `Dialog` viewer.
    - **Recipe of the Week & Wheel of Fortune:** Prominent `RecipeCard` and `WheelOfFortuneCard` components that span the full content width for maximum impact.
    - **Product Listing:** The main area, showing available products grouped by category.
    - **Product Cards:** Each product is displayed in a `ProductCard` (for single items) or `PackageCard` (for bundles), featuring responsive button layouts.
- **Navigation:** The main navigation is handled by the `CustomerSidebar` (desktop) or `MobileNav` (mobile).

#### 5.1.3 AI Sommelier (`/dashboard/sommelier`)
- **Functionality:** An immersive, full-screen camera experience for wine recommendations.
- **Flow:**
    1. The page opens directly into the `SommelierCamera` component, which activates the user's camera.
    2. User takes a photo of their food. The image data is sent to the `suggestWinePairing` Genkit flow and is **never stored**.
    3. An overlay appears with a loading state.
    4. The results are displayed: the name of the detected food and a list of recommended `ProductCard`s for the wines.
    5. The user can add wines to the cart or reset the view to take a new photo, which clears the image from the client state.
- **Navigation:** Accessed via "AI Scan". A close button (`X`) returns the user to the main dashboard.

#### 5.1.4 Concierge Service (`/dashboard/concierge`)
- **Functionality:** A simple page allowing customers to submit a free-form grocery list.
- **Flow:**
    1. User types their shopping list into a large `Textarea`.
    2. User provides delivery details and selects a delivery date.
    3. On submission, the list is sent as an order of type `grocery_list`.
- **Design:** Clean and simple, focusing on the text area. It is fully responsive and uses a single-column layout on all devices.

#### 5.1.5 Party Planer (`/dashboard/planner`)
- **Functionality:** An AI-powered calculator to help users plan for events.
- **Layout:**
    - At the top, a grid of available events (`PlannerEvent`) is displayed as large, clickable image cards.
    - Below, a central `Card` contains the calculator for the selected event.
- **Flow:**
    1. User selects an event card.
    2. The calculator card below updates. The user uses a `Slider` to select the number of guests.
    3. The page dynamically displays the recommended quantities for each ingredient.
    4. A single button adds all calculated ingredients as a bundle to the cart.

#### 5.1.6 My Loyalty Card (`/dashboard/loyalty`)
- **Functionality:** The customer's digital loyalty hub.
- **Layout:** A responsive grid that stacks vertically on mobile.
- **Components:**
    - **QR Code:** A large, scannable QR code containing the user's ID.
    - **Stamp Card:** A visual grid of 10 slots showing collected stamps.
    - **Available Rewards:** Cards displaying the rewards for 5 and 10 stamps, with a progress bar.

#### 5.1.7 My Orders (`/dashboard/orders`)
- **Functionality:** A history of the customer's past and current orders.
- **Layout:** A modern, card-based list instead of a table. Each order is an individual `Card`.
- **Features:** A "Verwalten" (Manage) mode allows users to select and delete old, completed orders.

#### 5.1.8 My Profile (`/dashboard/profile`)
- **Functionality:** Page for users to manage their account.
- **Features:**
    - **Update Form:** A form to change name, phone, and delivery address.
    - **Privacy Settings:** A form to manage marketing and profiling consent.
    - **Logout:** A button to log out.
    - **Delete Account:** A "Danger Zone" `Card` with a button to permanently delete the user's account, protected by an `AlertDialog`.

---

### 5.2 The Employee Journey

The employee experience is optimized for speed and efficiency at the point of sale.

#### 5.2.1 Main Menu (`/employee/scanner`)
- **Core View:** A simple menu with two options.
- **Option 1: QR Scanner:** Navigates to `/employee/scanner/scan` to open a full-screen camera view. After scanning, it redirects to `/employee/scanner?userId=...` to show results. The results view allows adding stamps or redeeming prizes.
- **Option 2: Einkaufszettel:** Navigates to `/employee/picker` to view and process open grocery lists.

#### 5.2.2 Picker (`/employee/picker`)
- **Functionality:** A list of all open orders with `type: 'grocery_list'` and `status: 'new'`.
- **Flow:**
    1. Employee sees a list of customer orders.
    2. Tapping an order starts "Picking Mode", a full-screen checklist.
    3. After collecting items, the employee enters the final total price.
    4. This updates the order status to `ready_for_delivery`.

---

### 5.3 The Admin Journey

The admin has a comprehensive dashboard. The layout is responsive, using tables on desktop and `Card`-based lists on mobile.

#### 5.3.1 Main Layout (`/admin/layout.tsx`)
- **Structure:** A two-column layout on desktop with a permanent `AdminSidebar` on the left (without a right border). On mobile, the sidebar collapses into a fixed `AdminMobileNav` at the bottom and is accessed via a borderless `Sheet`. The main content area has `pb-24` to avoid overlap.

#### 5.3.2 All Admin Pages
- **Responsiveness:** All pages are fully responsive, switching from tables to cards for mobile views where appropriate.
- **Management via Modals:** Most create/edit actions happen in a `Dialog` or `Sheet`.
- **Key Features:**
    - **Dashboard:** Overview of stats and recent orders.
    - **Orders:** Full list of all orders with search and filter.
    - **Products:** Full CRUD for products and categories.
    - **Customers:** Customer list and newsletter tool with AI-enhancement.
    - **Marketing:** Hub for managing `Recipe of the Week`, `Daily Stories`, `Planner Events`, and `Wheel of Fortune`.
    - **AI Sommelier:** Tool to bulk-import and manage the wine catalog with AI-powered tagging.
    - **Settings:** Database cleanup tools for old orders and inactive users.
