import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCwlA4odG3d5IYlwGrs1ilFHNfWvP7teYU",
  authDomain: "habit-tracker-midterm.firebaseapp.com",
  projectId: "habit-tracker-midterm",
  storageBucket: "habit-tracker-midterm.firebasestorage.app",
  messagingSenderId: "893311853458",
  appId: "1:893311853458:web:5c7ec42d01f331ea46574b",
  measurementId: "G-3DBVCE8PEK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc };