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
    - **Accent:** A vibrant, modern blue to replace any previous warm tones (like gold/bronze). Used for highlights, active states, and special badges. `hsl(var(--accent))`
- **Fonts:**
    - **Body Text:** 'PT Sans' (`font-body`) for clear, accessible information.
    - **Headlines:** 'Playfair Display' (`font-headline`) for elegant titles.
- **Component Styling:**
    - Use rounded corners (`rounded-xl` for cards, `rounded-full` for action buttons).
    - Use subtle shadows (`shadow-sm`, `shadow-lg`) to create depth.
    - Maintain generous spacing between elements to avoid a cluttered look.

## 4. Key Functional Requirements

- **Admin - Responsive Layouts:** All admin pages (Dashboard, Orders, Products, Customers, Marketing) must be fully responsive, switching from detailed tables on desktop to a compact card-based view on mobile.
- **Customer - Seamless Mobile UX:** The customer dashboard, product lists, and special feature pages (Planner, Concierge, Loyalty) must provide a native-app-like experience on mobile, with no layout breaks or horizontal scrolling.
- **Floating Action Button (Cart):** On the main customer dashboard, a floating cart button must be present in the bottom right corner on mobile, providing quick access to the order summary.
- **Dialogs & Modals:** Must be used for displaying detailed information (e.g., order details, story views) without navigating away from the current page. They must be responsive and correctly sized on all devices.
- **Layout Padding for Mobile Nav:** On pages with a fixed bottom navigation bar (Admin and Customer mobile views), the main content area must have a bottom padding (e.g., `pb-24`) to prevent content from being obscured by the navigation bar.

## 5. Detailed Application Structure & User Flows

This section provides a comprehensive overview of each part of the application, broken down by user role.

---

### 5.1 The Customer Journey

The customer is the primary user. Their experience is designed to be seamless, elegant, and highly functional on mobile devices.

#### 5.1.1 Authentication (`/login`, `/register`)
- **Functionality:** Standard login and registration forms. Upon successful registration, the user is redirected to `/login` to sign in. Upon successful login, they are redirected to their main dashboard (`/dashboard`).
- **Navigation:** New users navigate from `/login` to `/register`. After logout, users are returned to `/login`. Links to `/impressum` and `/datenschutz` are present on both pages.
- **Registration Form:** A detailed form (`register-form.tsx`) capturing name, email, password, phone, and address. Includes a mandatory `Checkbox` for DSGVO/Privacy Policy consent.

#### 5.1.2 Main Dashboard (`/dashboard`)
- **Core View:** This is the customer's landing page.
- **Layout:**
    - **Mobile:** A single-column layout. A header contains the logo and user profile. The main content scrolls vertically. A floating cart `Sheet` button is fixed to the bottom right.
    - **Desktop:** A two-column layout. A permanent `CustomerSidebar` is on the left. The main content area is in the center, next to a permanently visible, sticky cart sidebar on the right.
- **Components:**
    - **Daily Stories:** A horizontal, scrollable list of stories (`Stories` component). Tapping a story opens a full-screen, responsive `Dialog` viewer.
    - **Recipe of the Week:** A prominent `RecipeCard` component showcasing a special recipe. A button opens a `Dialog` with full details.
    - **Product Listing:** The main area, showing available products grouped by category.
    - **Category Filters:** A horizontal, scrollable list of `Button` components to filter products.
    - **Product Cards:** Each product is displayed in a `ProductCard` (for single items) or `PackageCard` (for bundles).
- **Navigation:** The main navigation is handled by the `CustomerSidebar` (desktop) or `MobileNav` (mobile).

#### 5.1.3 AI Sommelier (`/dashboard/sommelier`)
- **Functionality:** An immersive, full-screen camera experience for wine recommendations.
- **Flow:**
    1. The page opens directly into the `SommelierCamera` component, which activates the user's camera (ideally the rear camera).
    2. User takes a photo of their food.
    3. An overlay appears, showing a loading state. The `suggestWinePairing` Genkit flow is called with the image data (which is not stored).
    4. The results are displayed: the name of the detected food and a list of recommended `ProductCard`s for the wines.
    5. The user can add these wines directly to their cart.
- **Navigation:** Accessed via the "AI Scan" tab/link. A close button (`X`) returns the user to the main dashboard.

#### 5.1.4 Concierge Service (`/dashboard/concierge`)
- **Functionality:** A simple page allowing customers to submit a free-form grocery list.
- **Flow:**
    1. User types their shopping list into a large `Textarea`.
    2. The user's delivery address is displayed in `Input` fields.
    3. On submission, the list is sent as an order of type `grocery_list`.
- **Design:** Clean and simple, focusing on the text area. It is fully responsive and uses a single-column layout on all devices.

#### 5.1.5 Party Planer (`/dashboard/planner`)
- **Functionality:** An AI-powered calculator to help users plan for events.
- **Layout:**
    - At the top, a horizontal carousel displays available events (`PlannerEvent`) as large, clickable image cards.
    - Below, a central `Card` contains the calculator for the selected event.
- **Flow:**
    1. User selects an event card from the carousel.
    2. The calculator card below updates. The user uses `+`/`-` buttons to select the number of guests.
    3. The page dynamically displays the recommended quantities for each ingredient in a clean list. This list must wrap correctly on mobile.
    4. A single button adds all calculated ingredients as a bundle to the cart.

#### 5.1.6 My Loyalty Card (`/dashboard/loyalty`)
- **Functionality:** The customer's digital loyalty hub.
- **Layout:** A responsive grid (`grid-cols-1 md:grid-cols-3`) that stacks vertically on mobile.
- **Components:**
    - **QR Code:** A large, scannable QR code containing the user's ID.
    - **Stamp Card:** A visual grid of 10 slots showing collected stamps.
    - **Available Rewards:** Cards displaying the rewards for 5 and 10 stamps, with a progress bar indicating how close the user is to each reward.

#### 5.1.7 My Profile (`/dashboard/profile`)
- **Functionality:** Page for users to manage their account.
- **Features:**
    - **Update Form:** A form (`ProfileUpdateForm`) to change name, phone, and delivery address.
    - **Logout:** A button to log out.
    - **Delete Account:** A "Danger Zone" `Card` with a button to permanently delete the user's account, protected by an `AlertDialog` for confirmation.
    - **Legal Links:** Footer links to Impressum and Datenschutz.

---

### 5.2 The Employee Journey

The employee experience is optimized for speed and efficiency at the point of sale. It's a tool, not a browsing experience. The layout is simple, robust, and centered on all devices.

#### 5.2.1 Main View (`/employee/scanner`)
- **Core View:** The only page for the employee, featuring a two-tab interface (`Tabs` component).
- **Tab 1: QR Scanner:**
    - **Functionality:** The primary tool. A "Start Scan" `Button` activates the `Webcam` in a full-screen view. A "Simulate Scan" button is present for testing.
    - **Flow:**
        1. Employee taps "Start Scan".
        2. Employee scans the customer's QR code.
        3. On success, the view changes to the `ScanResultView`, showing the customer's name and stamp count.
        4. Employee can input a purchase amount to add a stamp or redeem available rewards (3€ or 7€ discount).
    - **Navigation:** After action, the employee is returned to the main scanner view.
- **Tab 2: Einkaufszettel (Grocery Lists):**
    - **Functionality:** A list of all open orders with `type: 'grocery_list'` and `status: 'new'`.
    - **Flow:**
        1. Employee sees a list of customer orders.
        2. Tapping an order starts "Picking Mode" (`PickerModeView`), a full-screen checklist.
        3. The employee checks off items as they are collected.
        4. After collecting items, the employee enters the final total price into an `Input` field. The "Finish" button is disabled until a valid price is entered.
        5. This updates the order status to `ready_for_delivery` and saves the final price.

---

### 5.3 The Admin Journey

The admin has a comprehensive dashboard. The layout is responsive, using tables on desktop and `Card`-based lists on mobile.

#### 5.3.1 Main Layout (`/admin/layout.tsx`)
- **Structure:** A two-column layout on desktop with a permanent `AdminSidebar` on the left. On mobile, the sidebar collapses into a fixed `AdminMobileNav` at the bottom. The main content area has `pb-24` to avoid overlap.

#### 5.3.2 Admin Dashboard (`/admin/dashboard`)
- **Functionality:** A high-level overview.
- **Components:**
    - **Stat Cards:** Key metrics (New Orders, Pickups, Overdue).
    - **Recent Orders List:** A list of recent `OrderCard`s. Clicking an order opens a detail `Dialog`.

#### 5.3.3 Orders (`/admin/orders`)
- **Functionality:** A list of all orders.
- **Features:**
    - **Search & Filter:** `Input` for search, `Select` for status filtering.
    - **Desktop View:** A detailed `Table`.
    - **Mobile View:** A list of `OrderCard` components.
    - **Detail Modal:** Clicking an order opens a `Dialog` with full details and a "Delete" option protected by an `AlertDialog`.

#### 5.3.4 Products (`/admin/products`)
- **Functionality:** Full CRUD for products and categories.
- **Layout:** Products are grouped by category within `Card`s.
- **Features:**
    - **Management via Modals:** All create/edit actions happen in a `Dialog`.
    - **Product Form:** The modal form includes fields for name, price, unit, an `ImageUploader` component, and a `Select` for type ('product' vs. 'package'). If 'package', a UI to define contents appears.
    - **Availability Toggle:** A `Switch` on each product card.

#### 5.3.5 Customers (`/admin/customers`)
- **Functionality:** View customers and send newsletters.
- **Features:**
    - **Customer List:** A responsive list (table/cards).
    - **Purchase History Filter:** A `Popover` with a `Command` component allows filtering customers by purchased product categories.
    - **Newsletter Editor:** A `Textarea` for the message, with an "Improve with AI" button that calls the `improveTextWithAI` Genkit flow.
    - **Customer Detail Page:** Clicking a customer leads to `admin/customers/[id]` to view specific details like open payments.

#### 5.3.6 Marketing (`/admin/marketing`)
- **Functionality:** A hub for managing customer-facing content.
- **Layout:** A tab-based interface (`Tabs` component) for organizing different marketing areas.
- **Components:**
    - **Recipe of the Week Editor:** A form to update the recipe.
    - **Daily Stories Manager:** A UI to create/edit/delete stories via a `Dialog`.
    - **Party Planner Events Manager:** A UI to create/edit/delete planner events, including defining ingredient rules in a `Dialog`.

#### 5.3.7 AI Sommelier (`/admin/sommelier`)
- **Functionality:** Manage the wine database for the AI Sommelier.
- **Flow:**
    1. Admin pastes a list of wine names into a `Textarea`.
    2. On import, the `enrichWineList` Genkit flow is called to generate tags.
    3. The enriched data is saved to the `wine_catalog` collection.
    - **Danger Zone:** A section with a `Button` inside an `AlertDialog` to confirm deletion of all wines.

#### 5.3.8 Settings (`/admin/settings`)
- **Functionality:** Maintenance tools.
- **Features:**
    - **Database Cleanup:** A tool to delete old, completed orders via the `deleteOldOrders` server action, with a `Select` dropdown to choose the time frame and an `AlertDialog` for confirmation.
