// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc };
