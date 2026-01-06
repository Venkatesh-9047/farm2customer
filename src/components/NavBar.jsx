// src/components/NavBar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext"; // IMPORTED

export default function NavBar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart(); // Get cart item count
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. See console.");
    }
  };

  return (
    <nav style={{ padding: "12px 20px", background: "#0f766e", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
          Farm2Customer
        </Link>
        <Link to="/products" style={{ color: "white", textDecoration: "none" }}>
          Products
        </Link>
        {/* Only show farmer link if logged in */}
        {user?.profile?.role === 'farmer' && (
            <Link to="/farmer" style={{ color: "white", textDecoration: "none" }}>
                Farmer Dashboard
            </Link>
        )}
      </div>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        
        {/* Cart Link for Customer */}
        <Link 
            to="/checkout" 
            style={{ 
                color: "white", 
                textDecoration: "none", 
                fontWeight: "bold",
                padding: '5px 10px',
                borderRadius: '5px',
                background: cartItems.length > 0 ? '#10b981' : 'transparent',
            }}
        >
            🛒 Cart ({cartItems.length})
        </Link>
        
        {user ? (
          <>
            <span>Hi, {user?.profile?.name || user?.displayName || user?.email}</span>
            <button
              onClick={handleLogout}
              style={{ background: "white", color: "#0f766e", padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "white" }}>Login</Link>
            <Link to="/register" style={{ color: "white" }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}