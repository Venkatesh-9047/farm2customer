# Farm2Customer (F2C) Marketplace

A full-stack, serverless e-commerce platform built to bridge the gap between local farmers and consumers. This application allows farmers to list fresh produce and customers to buy them directly based on their location.

## 🚀 Key Features

* **Role-Based Access Control (RBAC):** Separate user flows and dashboards for **Farmers** and **Customers** powered by Firebase Auth.
* **Real-time Inventory Management:** Implemented "Auto-Delete" logic where purchased items are instantly removed from the marketplace to ensure stock accuracy.
* **Location-Based Search:** Advanced filtering using Firestore composite indexing to help customers find fresh produce in their specific city.
* **Global State Management:** Used React Context API to manage persistent Shopping Cart and User Authentication states across the app.

## 🛠️ Tech Stack

### Frontend
- **React.js (v18):** Core UI library.
- **React Router (v6):** Client-side navigation and protected routes.
- **CSS3:** Responsive grid and flexbox layouts.

### Backend (Serverless)
- **Firebase Authentication:** Secure login and registration.
- **Cloud Firestore:** NoSQL database for products, users, and orders.
- **Firebase Hosting:** Global deployment.

### Tools
- **Vite:** Next-generation frontend tool for fast development.
- **Git/GitHub:** Version control and repository management.

## 📁 Project Structure
- `/src/contexts`: Global state management (Auth/Cart).
- `/src/services`: Firebase logic (Order creation, Product fetching).
- `/src/pages`: UI Views (Marketplace, Dashboard, Checkout).

## 🧑‍💻 Author
**Venkatesh**
- [GitHub Profile](https://github.com/Venkatesh-9047)
