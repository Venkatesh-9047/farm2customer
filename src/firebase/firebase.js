// src/firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your correct Firebase Web App configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu8vrVyKBJuszG_nX3bLarUky3zK53fC8", // REPLACE with your actual API key
  authDomain: "farm2customer-2bc6e.firebaseapp.com",
  projectId: "farm2customer-2bc6e",
  storageBucket: "farm2customer-2bc6e.appspot.com", 
  messagingSenderId: "324760786388",
  appId: "1:324760786388:web:2a9959cf9ae867e499b241",
  measurementId: "G-E5QXKBTH9S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export Firebase services to use in your app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);