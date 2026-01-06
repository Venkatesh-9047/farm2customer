// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // firebase user object + merged profile
  const [loading, setLoading] = useState(true);

  // REGISTER: creates auth user and stores profile in Firestore
  const register = async ({ name, email, password, role, city }) => { 
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(result.user, { displayName: name });
    
    // Normalize city to lowercase for reliable searching later
    const normalizedCity = city ? city.toLowerCase() : null;

    // Create Firestore doc
    const userDocRef = doc(db, "users", result.user.uid);
    await setDoc(userDocRef, {
      uid: result.user.uid,
      name,
      email,
      role,
      location: normalizedCity, // <-- NEW: Save the normalized location
      createdAt: serverTimestamp()
    });

    // Manually set user state immediately (with merged profile)
    const newUserState = { ...result.user, profile: { uid: result.user.uid, name, email, role, location: normalizedCity } };
    setUser(newUserState);
    return newUserState;
  };

  // LOGIN: expects email and password
  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  };

  // LOGOUT
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Listen for auth state changes and hydrate user profile from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            // Merge firebase user with profile data from Firestore
            setUser({ ...firebaseUser, profile: snap.data() });
          } else {
            // Fallback for missing profile
            setUser(firebaseUser); 
          }
        } catch (err) {
          console.error("Failed to read user profile:", err);
          setUser(firebaseUser); 
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading, register, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}