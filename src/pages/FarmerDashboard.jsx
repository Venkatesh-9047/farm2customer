// src/pages/FarmerDashboard.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { getProductsByFarmer } from "../services/ProductService";
import { getFarmerPendingOrders } from "../services/OrderService"; // IMPORTED

export default function FarmerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Effect 1: Fetch Farmer's Products
  useEffect(() => {
    if (!user?.uid) return;
    
    let mounted = true;
    (async () => {
      try {
        const farmerProducts = await getProductsByFarmer(user.uid);
        if (mounted) setProducts(farmerProducts);
      } catch (err) {
        console.error("Failed to fetch farmer products:", err);
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  // Effect 2: Fetch Pending Orders
  useEffect(() => {
    if (!user?.uid) return;

    let mounted = true;
    (async () => {
        try {
            const pendingOrders = await getFarmerPendingOrders(user.uid);
            if (mounted) setOrders(pendingOrders);
        } catch (err) {
            console.error("Failed to fetch pending orders:", err);
        } finally {
            if (mounted) setLoadingOrders(false);
        }
    })();
    return () => { mounted = false; };
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Farmer Dashboard</h1>
          <p>Welcome, {user?.profile?.name || user?.displayName || user?.email}!</p>
        </div>
        <div>
          <button
            onClick={() => navigate("/add-product")}
            style={{ padding: "10px 14px", background: "#0f766e", color: "white", borderRadius: 8, border: "none" }}
          >
            Add Product
          </button>
        </div>
      </div>

      {/* ORDERS SECTION */}
      <div style={{
        marginTop: "20px",
        padding: "20px",
        background: "#fee2e2",
        borderRadius: "8px",
        border: "1px solid #f87171"
      }}>
        <h2>Pending Orders ({orders?.length || 0})</h2>
        
        {loadingOrders && <p>Loading pending orders...</p>}

        {!loadingOrders && orders?.length === 0 && (
          <p>You have no pending orders right now. Good time to check your inventory!</p>
        )}

        <div style={{ marginTop: 10 }}>
          {orders && orders.map((order) => (
            <div key={order.id} style={{ borderBottom: "1px solid #fecaca", padding: "10px 0" }}>
                <strong>Order ID:</strong> {order.id.substring(0, 8)}...
                <br />
                <strong>Customer:</strong> {order.customerUid.substring(0, 8)}... 
                <br />
                <strong>Total:</strong> ₹{order.totalAmount}
                <br />
                **Items in Order:**
                <ul style={{ margin: "5px 0 0 20px", padding: 0 }}>
                    {/* Filter items to show only what this farmer sold */}
                    {order.items.filter(item => item.uid === user.uid).map(item => (
                        <li key={item.id} style={{ fontSize: 14 }}>
                            {item.name} x {item.quantity} (₹{item.price})
                        </li>
                    ))}
                </ul>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      {/* ... (Your existing products display logic below) ... */}
    </div>
  );
}