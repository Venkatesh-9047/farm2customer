// src/pages/ProductDetail.jsx (Full, Final Code)

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/ProductService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useCart } from "../contexts/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = React.useState(null);
  const [farmerName, setFarmerName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = useState(1);

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const p = await getProductById(id);
        
        if (!p) {
          if (mounted) navigate("/products", { replace: true });
          return;
        }
        if (mounted) setProduct(p);

        if (p.uid) {
          const userDocRef = doc(db, "users", p.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists() && mounted) {
            setFarmerName(userSnap.data().name || "Unknown Farmer"); 
          }
        }
        
      } catch (err) {
        console.error("Failed to load product detail:", err);
      } finally {
        if (mounted) setLoading(false); 
      }
    })();

    return () => (mounted = false);
  }, [id, navigate]);
  
  const handleAddToCart = () => {
    if (product && quantity > 0) {
        // Here, we trust the CartContext to handle the number conversion
        addToCart(product, quantity); 
        alert(`${quantity} x ${product.name} added to cart!`);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading product…</div>;
  if (!product) return <div style={{ padding: 20 }}>Product not found.</div>;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>← Back</button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ borderRadius: 8, overflow: "hidden", background: "#f3faf7" }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: 420, objectFit: "cover" }} />
          ) : (
            <div style={{ height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
              No image
            </div>
          )}
        </div>

        <div>
          <h1 style={{ marginTop: 0 }}>{product.name}</h1>
          <p style={{ color: "#0f766e", fontWeight: 700, fontSize: 22 }}>₹ {product.price}</p>
          <p style={{ color: "#6b7280" }}>{product.desc}</p>

          <div style={{ marginTop: 18, padding: 12, background: "#f8faf9", borderRadius: 8 }}>
            <strong>Farmer:</strong> {farmerName || "Unknown"}
            <br />
            <small style={{ color: "#6b7280" }}>{product.createdAt?.toDate ? product.createdAt.toDate().toLocaleString() : ""}</small>
          </div>
          
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 20 }}>
            <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))} 
                style={{ padding: 8, width: 60, borderRadius: 6, border: '1px solid #ccc' }}
            />
            <button 
                onClick={handleAddToCart} 
                className="btn"
                style={{ background: '#3b82f6', color: 'white' }}
            >
                Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}