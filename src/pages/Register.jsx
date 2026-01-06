// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer", city: "" }); // ADDED city
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Pass the entire form object, including the new 'city'
      const user = await register(form); 

      // Navigate based on the role in the merged user object
      if (user?.profile?.role === "farmer") {
        navigate("/farmer");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("[Register] register error:", err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: 560, margin: "40px auto" }}>
      <h2>Register</h2>
      {error && <div style={{ color: "white", background: "#ef4444", padding: 10 }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
        
        {/* Name input */}
        <label>Name
          <input name="name" value={form.name} onChange={handleChange} required style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }} />
        </label>

        {/* Email input */}
        <label style={{ marginTop: 12 }}>Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }} />
        </label>

        {/* Password input */}
        <label style={{ marginTop: 12 }}>Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }} />
        </label>
        
        {/* Role selector */}
        <label style={{ marginTop: 12 }}>Role
          <select name="role" value={form.role} onChange={handleChange} style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}>
            <option value="customer">Customer</option>
            <option value="farmer">Farmer</option>
          </select>
        </label>

        {/* NEW: City Input (Required for Farmers) */}
        {form.role === 'farmer' && (
            <label style={{ marginTop: 12 }}>City (e.g., Chennai, Bengaluru)
                <input 
                    name="city" 
                    value={form.city} 
                    onChange={handleChange} 
                    required={form.role === 'farmer'} 
                    placeholder="Where your farm is located"
                    style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }} 
                />
            </label>
        )}

        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={loading} style={{ padding: "10px 14px", background: "#0ea5a4", color: "white", border: "none", borderRadius: 6 }}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}