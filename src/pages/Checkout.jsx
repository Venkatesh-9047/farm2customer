// src/pages/Checkout.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { createOrder } from "../services/OrderService";

export default function Checkout() {
    const { cartItems, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");
    const [error, setError] = useState(null);

    if (cartItems.length === 0) {
        setTimeout(() => navigate('/products', { replace: true }), 100); 
        return null;
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError(null);

        if (!user) {
            setError("You must be logged in to place an order.");
            return;
        }

        setLoading(true);

        try {
            // Trigger the service to save order and delete products
            await createOrder(cartItems, user.uid, total);
            
            // Clear the local cart
            clearCart();
            
            alert(`Order Successful! These items have been removed from the shop and reserved for you.`);
            navigate("/products"); 
            
        } catch (err) {
            console.error("Order placement failed:", err);
            setError("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
            <h1>Checkout</h1>
            {error && <div style={{ marginBottom: 12, color: "white", background: "#ef4444", padding: 10, borderRadius: 8 }}>{error}</div>}

            <div style={{ background: "white", padding: 20, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.1)", marginBottom: 20 }}>
                <h3>Order Summary</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {cartItems.map(item => (
                        <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                            <span>{item.name} x {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                        </li>
                    ))}
                </ul>
                <div style={{ paddingTop: 10, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', fontSize: 18 }}>
                    <span>Total Amount:</span>
                    <span>₹{total}</span>
                </div>
            </div>

            <form onSubmit={handlePlaceOrder} style={{ background: "white", padding: 20, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                <h3>Delivery Details</h3>
                <label style={{ fontWeight: '600' }}>Shipping Address</label>
                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows={3}
                    placeholder="Enter your full delivery address..."
                    style={{ display: "block", width: "100%", padding: 10, marginTop: 8, borderRadius: 8, border: '1px solid #ccc' }}
                />

                <button 
                    type="submit" 
                    disabled={loading || !user || !address} 
                    style={{ 
                        marginTop: 20, 
                        width: '100%', 
                        padding: '12px', 
                        background: '#0f766e', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 8, 
                        fontWeight: 'bold',
                        cursor: 'pointer' 
                    }}
                >
                    {loading ? "Processing..." : `Confirm Order & Pay ₹${total}`}
                </button>
            </form>
        </div>
    );
}