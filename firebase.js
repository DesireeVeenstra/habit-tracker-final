// ✅ firebase.js (CDN-based and browser-safe)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js"; // optional

// ✅ Use your config here
const firebaseConfig = {
  apiKey: "AIzaSyCwlA4odG3d5IYlwGrs1ilFHNfWvP7teYU",
  authDomain: "habit-tracker-midterm.firebaseapp.com",
  projectId: "habit-tracker-midterm",
  storageBucket: "habit-tracker-midterm.firebasestorage.app",
  messagingSenderId: "893311853458",
  appId: "1:893311853458:web:5c7ec42d01f331ea46574b",
  measurementId: "G-3DBVCE8PEK"
};

// ✅ Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app); // optional

export { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc };
