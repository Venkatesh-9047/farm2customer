import { db } from "../firebase/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  doc, 
  deleteDoc 
} from "firebase/firestore";

/**
 * createOrder(cartItems, customerUid, total)
 * 1. Saves order for the farmer to see.
 * 2. Deletes the items from the 'products' collection so they "go off" the web.
 */
export async function createOrder(cartItems, customerUid, total) {
    if (!cartItems || cartItems.length === 0) {
        throw new Error("Cannot create an empty order.");
    }
    
    const orderRef = collection(db, "orders");
    
    const orderData = {
        customerUid: customerUid,
        items: cartItems, 
        totalAmount: total,
        status: "Pending", 
        createdAt: serverTimestamp()
    };
    
    // 1. Create the Order document
    const docRef = await addDoc(orderRef, orderData);

    // 2. Delete the purchased products from Firestore
    // This makes them disappear from the Products page instantly
    const deletePromises = cartItems.map((item) => {
        const productDocRef = doc(db, "products", item.id);
        return deleteDoc(productDocRef);
    });

    await Promise.all(deletePromises);

    return docRef.id;
}

/**
 * getFarmerPendingOrders(farmerUid)
 * Finds orders that contain items belonging to a specific farmer.
 */
export async function getFarmerPendingOrders(farmerUid) {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("status", "==", "Pending"));
    const snap = await getDocs(q);
    
    const pendingOrders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return pendingOrders.filter(order => 
        order.items.some(item => item.uid === farmerUid) 
    );
}