
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

## 5. Detailed Application Structure & User Flows

This section provides a comprehensive overview of each part of the application, broken down by user role.

### 5.1 The Customer Journey

The customer is the primary user. Their experience is designed to be seamless, elegant, and highly functional on mobile devices.

#### 5.1.1 Authentication (`/login`, `/register`)
- **Functionality:** Standard login and registration forms. Upon successful authentication, the user is redirected to their main dashboard (`/dashboard`).
- **Navigation:** New users can navigate from `/login` to `/register`. After logout, users are returned to `/login`.

#### 5.1.2 Main Dashboard (`/dashboard`)
- **Core View:** This is the customer's landing page.
- **Components:**
    - **Daily Stories:** A horizontal, scrollable list of stories (e.g., "Fish of the Day"). Tapping a story opens a full-screen, Instagram-like viewer.
    - **Recipe of the Week:** A prominent card showcasing a special recipe. A button opens a dialog with full details, ingredients, and instructions.
    - **Product Listing:** The main area, showing available products. This is filterable by category.
    - **Category Filters:** A horizontal, scrollable list of buttons to filter products (e.g., "Alle", "Weine", "Pakete").
    - **Product Cards:** Each product is displayed in a `ProductCard` (for single items) or `PackageCard` (for bundles), showing an image, name, price, and "Add to Cart" controls.
- **Mobile Experience:**
    - **Sticky Header:** On mobile, the category filters stick to the top of the screen as the user scrolls down the product list.
    - **Floating Cart Button:** A floating action button with the cart icon and item count is displayed in the bottom-right corner, providing constant access to the cart. Tapping it opens the cart in a bottom sheet.
- **Desktop Experience:**
    - The cart is displayed as a permanent, sticky sidebar on the right.

#### 5.1.3 AI Sommelier (`/dashboard/sommelier`)
- **Functionality:** Provides an immersive, full-screen camera experience. Users can scan a picture of their food.
- **Flow:**
    1. The page opens directly into a full-screen camera view.
    2. User takes a photo.
    3. The app shows a loading/analysis screen while the AI (Genkit flow) processes the image.
    4. The results are displayed: the name of the detected food and a list of recommended wine `ProductCard`s from the store's inventory.
    5. The user can add these wines directly to their cart.
- **Navigation:** Accessed via the "AI Sommelier" tab/link. A close button (`X`) returns the user to the main dashboard.

#### 5.1.4 Concierge Service (`/dashboard/concierge`)
- **Functionality:** A simple page allowing customers to submit a free-form grocery list via a large text area.
- **Flow:**
    1. User types their shopping list (e.g., "- 1L Milk, - 200g Speck").
    2. The user's delivery address is pre-filled but can be edited.
    3. On submission, the list is sent as an order of type `grocery_list` to the admin/employee backend. The order status starts as 'new'.
- **Design:** Clean and simple, focusing on the text area. It's designed to feel like sending a quick note.

#### 5.1.5 Party Planer (`/dashboard/planner`)
- **Functionality:** An AI-powered calculator to help users plan for events like Raclette or Fondue.
- **Flow:**
    1. The user is presented with visually appealing cards for different events (e.g., "Raclette Abend").
    2. After selecting an event, a "calculator" card appears.
    3. The user adjusts a slider to select the number of guests.
    4. The page dynamically displays the recommended quantities for each required ingredient (e.g., "1000g Raclette Cheese", "400g Speck").
    5. A single button allows the user to add all calculated ingredients as a single bundle to their cart.

#### 5.1.6 My Loyalty Card (`/dashboard/loyalty`)
- **Functionality:** The customer's digital loyalty hub.
- **Components:**
    - **QR Code:** A large, scannable QR code containing the user's ID. This is what employees scan at the checkout.
    - **Points & Status:** Displays the user's current loyalty points, their tier (Bronze, Silver, Gold), and a progress bar showing how close they are to the next tier.
    - **Available Coupons:** A list of rewards/coupons the user has earned through their points.

---

### 5.2 The Employee Journey

The employee experience is optimized for speed and efficiency at the point of sale. It's a tool, not a browsing experience.

#### 5.2.1 Main View (`/employee/scanner`)
- **Core View:** This is the only page for the employee, featuring a two-tab interface.
- **Tab 1: QR Scanner:**
    - **Functionality:** The primary tool. A large "Start Scan" button activates the device camera in a full-screen view.
    - **Flow:**
        1. Employee taps "Start Scan".
        2. Employee scans the customer's QR code from the customer's app.
        3. Upon successful scan, the view changes to show the `ScanResultView`:
            - Customer's name, avatar, and loyalty tier are displayed for confirmation.
            - Buttons appear to "Add Points" or "Redeem Coupon".
    - **Navigation:** After completing the action, the employee is returned to the main scanner view to serve the next customer.
- **Tab 2: Einkaufszettel (Grocery Lists):**
    - **Functionality:** A list of all open orders with `type: 'grocery_list'` and `status: 'new'`.
    - **Flow:**
        1. Employee sees a list of customers who have submitted a shopping list.
        2. Tapping a list starts the "Picking Mode".
        3. The view changes to a checklist of all items from the customer's raw text list.
        4. The employee walks through the store, tapping each item on the list to mark it as found.
        5. Once all items are collected, the employee enters the final total price into an input field and clicks "Finish".
        6. This updates the order status to `ready_for_delivery` and saves the final price. The employee is then returned to the main view.

---

### 5.3 The Admin Journey

The admin has a comprehensive, data-rich dashboard to manage the entire application. The layout is responsive, using tables on desktop and cards on mobile.

#### 5.3.1 Main Layout (`/admin/layout.tsx`)
- **Structure:** A two-column layout on desktop with a permanent sidebar on the left and content on the right. On mobile, the sidebar collapses into a bottom navigation bar.

#### 5.3.2 Admin Dashboard (`/admin/dashboard`)
- **Functionality:** A high-level overview of the store's current status.
- **Components:**
    - **Stat Cards:** Key metrics like "New Orders Today," "Pickups Today," and "Overdue Pickups."
    - **Recent Orders List:** A list of the most recent, active orders. Each order is a clickable `OrderCard` that opens a detail modal.
- **Navigation:** Provides links to the full list pages (e.g., "View All Orders").

#### 5.3.3 Orders (`/admin/orders`)
- **Functionality:** A detailed list of all orders, both pre-orders and grocery lists.
- **Features:**
    - **Search & Filter:** Admins can search by customer name/ID and filter by order status.
    - **Status Change:** The status of each order can be changed directly from the list via a dropdown.
    - **Desktop View:** A detailed table with columns for ID, Customer, Type, Total, Status, etc.
    - **Mobile View:** The table is replaced by a list of `OrderCard` components, each providing a summary.
    - **Detail Modal:** Clicking on any order (in table or card view) opens a dialog with full customer and order details, and an option to permanently delete the order.

#### 5.3.4 Products (`/admin/products`)
- **Functionality:** Full CRUD (Create, Read, Update, Delete) for all products and categories.
- **Layout:** Products are grouped by category.
- **Features:**
    - **Category Management:** Admins can create and delete categories.
    - **Product Management:** Admins can add, edit, or delete products within each category. This is done via a modal form.
    - **Product Form:** The form allows editing all product details, including name, price, unit, image (via `ImageUploader`), and type (product vs. package). If 'package' is selected, a special UI appears to define the contents of the bundle.
    - **Toggle Availability:** A switch on each product card allows admins to quickly make a product available or unavailable to customers.

#### 5.3.5 Customers (`/admin/customers`)
- **Functionality:** View customer data and send targeted newsletters.
- **Features:**
    - **Customer List:** A responsive list (table on desktop, cards on mobile) of all customers.
    - **Purchase History Filter:** A powerful feature allowing admins to filter the customer list based on what categories of products they have purchased in the past.
    - **Newsletter Editor:**
        1. Admin filters and selects a group of customers.
        2. Admin writes a newsletter message in a text area.
        3. An "Improve with AI" button uses a Genkit flow (`improveNewsletterText`) to refine the copy.
        4. A "Send" button (currently mock) would send the newsletter to the selected customers.

#### 5.3.6 Marketing (`/admin/marketing`)
- **Functionality:** A hub for managing customer-facing content.
- **Components:**
    - **Recipe of the Week Editor:** A form to update the title, description, ingredients, and image for the recipe shown on the customer dashboard.
    - **Daily Stories Manager:** A UI to create, edit, and delete the daily stories.
    - **Party Planner Events Manager:** A UI to create, edit, and delete the events (like Raclette, Fondue) used in the customer's Party Planner, including defining the ingredient rules.

#### 5.3.7 AI Sommelier (`/admin/sommelier`)
- **Functionality:** Manage the wine database that the AI Sommelier uses for recommendations.
- **Flow:**
    1. Admin pastes a simple list of wine names (one per line) into a large text area.
    2. On import, a Genkit flow (`enrichWineList`) is called. This flow takes the names and uses AI to automatically generate descriptive tags (e.g., "rotwein", "trocken", "passt zu fisch").
    3. The enriched data is saved to the (mock) database.
    - **Danger Zone:** A button allows the admin to completely wipe the wine database to start fresh.

#### 5.3.8 Settings (`/admin/settings`)
- **Functionality:** Contains maintenance and administrative tools.
- **Features:**
    - **Database Cleanup:** A tool to delete old, completed orders (e.g., older than 6 months) to keep the database clean and performant. This is handled by the `deleteOldOrders` server action.
