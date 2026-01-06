// src/pages/Login.jsx
// src/pages/Login.jsx

import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom"; // <-- ADD Navigate here
import { useAuth } from "../contexts/AuthContext";
// ...
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state
  const { login, user: currentUser } = useAuth(); // Renamed user to currentUser to avoid conflict
  const navigate = useNavigate();

  // If user is already logged in, redirect them immediately
  if (currentUser) {
    const role = currentUser?.profile?.role || "customer";
    
    // Determine target path
    const targetPath = (role === "farmer") ? "/farmer" : "/";
    
    // Render the Navigate component to handle the redirect
    // Use 'replace' to prevent users from hitting the back button to get back to login.
    return <Navigate to={targetPath} replace />; 
  }

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // FIX: Pass email and password separately, matching AuthContext signature
      const authUser = await login(form.email, form.password);

      // Give AuthContext a moment to fetch the profile in the background (via onAuthStateChanged)
      // Since login is successful, we can navigate based on the expected role saved in the database.
      // For a robust check, you'd fetch the profile here, but for now we rely on the redirect logic.
      
      // Navigate to the dashboard, relying on ProtectedRoute to handle the role check after state is fully set
      navigate("/farmer"); // If they log in, they land on /farmer. If they aren't a farmer, ProtectedRoute redirects them home.
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to login: Check email and password."); // Friendly error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      {error && <div style={{ marginBottom: 12, color: "white", background: "#ef4444", padding: 10 }}>{error}</div>}
      <form onSubmit={submit} className="card">
        {/* Email */}
        <div style={{ marginBottom: 8 }}>
          <label>Email</label>
          <input
            className="input"
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 8 }}>
          <label>Password</label>
          <input
            className="input"
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Your password"
          />
        </div>

        {/* Submit */}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}