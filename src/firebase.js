// Import the shared app package directly so Auth and Firestore use the same app registry.
import { getApp, getApps, initializeApp } from "@firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace these values with the Web app config from Firebase Console.
const firebaseConfig = {
  apiKey: "AIzaSyB6dwl_OyBQzYLsnV-04wCc6ZKutsAi4oA",
  authDomain: "fitplan-9c529.firebaseapp.com",
  projectId: "fitplan-9c529",
  storageBucket: "fitplan-9c529.firebasestorage.app",
  messagingSenderId: "453732386690",
  appId: "1:453732386690:web:8e26153e85f6b2f610319b",
};

const appAlreadyExists = getApps().length > 0;
const app = appAlreadyExists ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
