import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBnQQ1V2BbscuK-jPvi4tSpiWwUo77HwTM",
  authDomain: "petpals-ab69d.firebaseapp.com",
  projectId: "petpals-ab69d",
  storageBucket: "petpals-ab69d.firebasestorage.app",
  messagingSenderId: "470813122395",
  appId: "1:470813122395:web:8c24820dbb27da9ed1047e",
  measurementId: "G-B3VH8SKQHX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);