// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';           // top navigation bar
import Home from './pages/Home';                    // public home page
import Login from './pages/Login';                  // login page
import Register from './pages/Register';            // register page
import FarmerDashboard from './pages/FarmerDashboard'; // farmer-only dashboard
import ProtectedRoute from './components/ProtectedRoute'; // route wrapper that checks auth/role
import AddProduct from "./pages/AddProduct";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
//import Products from './pages/Products';
//import Products from "./pages/Products";

        // add product page (farmer only)
// import Products from './pages/Products';         // (Day 7) public marketplace page
// import ProductDetail from './pages/ProductDetail'; // (Day 7) product detail page

// src/App.jsx (Cleaned Up)
// ... (imports) ...
export default function App() {
  return (
    <div>
      <NavBar />
      <main style={{ padding: 20 }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/products" element={<Products />} /> {/* Single public products route */}
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} /> {/* FINAL CHECKOUT ROUTE */}

          {/* Farmer dashboard (Protected) */}
          <Route path="/farmer" element={<ProtectedRoute role="farmer"><FarmerDashboard /></ProtectedRoute>} />

          {/* Add Product (Protected) */}
          <Route path="/add-product" element={<ProtectedRoute role="farmer"><AddProduct /></ProtectedRoute>} />

        </Routes>
      </main>
    </div>
  );
}
