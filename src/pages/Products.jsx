// src/pages/Products.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, getProductsByLocation } from "../services/ProductService";

export default function Products() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(""); 
  const [isFiltered, setIsFiltered] = useState(false); 

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        let items;
        if (city.trim() && isFiltered) {
          items = await getProductsByLocation(city);
        } else {
          items = await getProducts();
        }
        if (mounted) setProducts(items || []);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [city, isFiltered]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsFiltered(true);
  };

  const handleClearFilter = () => {
    setCity("");
    setIsFiltered(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 980, margin: "0 auto" }}>
      <h1>Marketplace</h1>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
          <input
            type="text"
            placeholder="Search city (e.g. chennai)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ flexGrow: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
          />
          <button type="submit" style={{ padding: '0 20px', background: '#0f766e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Search
          </button>
          {isFiltered && (
            <button type="button" onClick={handleClearFilter} style={{ padding: '0 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Clear
            </button>
          )}
      </form>

      {loading && <p>Loading fresh products...</p>}
      
      {!loading && products && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '12px' }}>
             <h3>Sold Out!</h3>
             <p>No products available in this area right now. Check back soon!</p>
          </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 20 }}>
        {products && products.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden", background: "white", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <div style={{ height: 200, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ color: "#9ca3af" }}>No Image</div>
                )}
              </div>
              <div style={{ padding: 15 }}>
                <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>{p.name}</h3>
                <div style={{ color: "#0f766e", fontWeight: "bold", fontSize: '1.2rem' }}>₹{p.price}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}