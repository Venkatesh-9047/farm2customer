// src/pages/AddProduct.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createProductFromUrl } from "../services/ProductService";

export default function AddProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // <-- paste the Direct Link from PostImages
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Example test image (local path you uploaded to chat) — you can paste this into the Image URL field for a quick test:
  // '/mnt/data/Screenshot 2025-11-22 141100.png'
  // (Better: upload to https://postimages.org/ and use the Direct Link they give.)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be logged in to add a product.");
      return;
    }
    if (!imageUrl) {
      setError("Please paste the product image URL (from PostImages or other host).");
      return;
    }

    setSubmitting(true);
    try {
      await createProductFromUrl({
        name,
        price,
        desc,
        imageUrl,
        uid: user.uid
      });
      // success -> navigate to farmer dashboard (or product view)
      navigate("/farmer");
    } catch (err) {
      console.error("Failed to create product:", err);
      setError(err.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 12 }}>
      <h1>Add Product</h1>
      {error && <div style={{ marginBottom: 12, color: "white", background: "#ef4444", padding: 10 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Product name
          <input value={name} onChange={(e) => setName(e.target.value)} required style={{display:"block", width:"100%", padding:8, marginTop:6}} />
        </label>

        <label style={{ marginTop: 12 }}>
          Price (INR)
          <input value={price} onChange={(e) => setPrice(e.target.value)} required style={{display:"block", width:"100%", padding:8, marginTop:6}} />
        </label>

        <label style={{ marginTop: 12 }}>
          Description
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} style={{display:"block", width:"100%", padding:8, marginTop:6}} />
        </label>

        <label style={{ marginTop: 12 }}>
          Image URL (paste the **Direct Link** from PostImages)
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://i.postimg.cc/your-image.png"
            required
            style={{display:"block", width:"100%", padding:8, marginTop:6}}
          />
        </label>

        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={submitting} style={{padding:"10px 14px", background:"#0ea5a4", color:"white", border:"none", borderRadius:6}}>
            {submitting ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
