// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return null; // Wait while checking auth state

  // Not logged in -> redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required (like 'farmer'), check it
  if (role) {
    const userRole = user?.profile?.role || null; 
    
    if (userRole !== role) {
      console.warn(`Access Denied: User role is '${userRole}', but '${role}' is required.`);
      return <Navigate to="/" replace />; // Redirect non-farmers to home
    }
  }

  return children;
}