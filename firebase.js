// ✅ Import Firebase modules from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwlA4odG3d5IYlwGrs1ilFHNfWvP7teYU",
  authDomain: "habit-tracker-midterm.firebaseapp.com",
  projectId: "habit-tracker-midterm",
  storageBucket: "habit-tracker-midterm.firebasestorage.app",
  messagingSenderId: "893311853458",
  appId: "1:893311853458:web:5c7ec42d01f331ea46574b",
  measurementId: "G-3DBVCE8PEK"
};

// ✅ Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app); // optional

// ✅ Export Firestore functions for use in other modules
export {
  db,
  collection,
  addDoc,
  getDoc,
  deleteDoc,
  doc,
  updateDoc
};
