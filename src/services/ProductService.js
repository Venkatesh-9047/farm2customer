// src/services/ProductService.js
import { db } from "../firebase/firebase";
import { collection, addDoc, getDocs, doc, getDoc, orderBy, query, where } from "firebase/firestore";

/**
 * createProductFromUrl({ name, price, desc, imageUrl, uid })
 * Stores a product doc in Firestore.
 */
export async function createProductFromUrl({ name, price, desc, imageUrl, uid }) {
  const ref = collection(db, "products");
  return await addDoc(ref, {
    name,
    price,
    desc,
    imageUrl,
    uid,
    createdAt: Date.now()
  });
}

/**
 * getProducts() - Public: Returns array of all products.
 */
export async function getProducts() {
  const ref = collection(db, "products");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * getProductsByFarmer(uid) - Farmer-specific
 * Returns array of products posted by a specific farmer.
 */
export async function getProductsByFarmer(uid) {
  const ref = collection(db, "products");
  // Requires Firebase Index: uid (ASC), createdAt (DESC)
  const q = query(ref, where("uid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * getProductById(id) - Retrieves a single product by ID.
 */
export async function getProductById(id) {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * getProductsByLocation(city) - Finds products by querying farmers' locations.
 */
export async function getProductsByLocation(city) {
  if (!city) {
    return getProducts(); 
  }

  // Normalize search term (e.g., "chennai")
  const lowerCity = city.toLowerCase(); // <--- CRUCIAL FIX

    // 1. Find all farmer UIDs in the specified city from the 'users' collection
    const userRef = collection(db, "users");
    const userQuery = query(userRef, 
        where("role", "==", "farmer"), 
        where("location", "==", lowerCity) // <--- Use the normalized term here
    );
  const userSnap = await getDocs(userQuery);
  const farmerUids = userSnap.docs.map(doc => doc.id);

  if (farmerUids.length === 0) {
    return [];
  }

  // 2. Fetch products posted by those farmers (Requires Index: uid, createdAt)
  const productRef = collection(db, "products");
  
  // Note: Firestore 'in' clause has a limit of 10 array items.
  const productQuery = query(productRef, 
    where("uid", "in", farmerUids),
    orderBy("createdAt", "desc")
  );
  const productSnap = await getDocs(productQuery);
  
  return productSnap.docs.map(d => ({ id: d.id, ...d.data() }));
}