// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9Ki5bd4GnSllv0j5zP2ohgDZmEllzabw",
  authDomain: "smartcampus-a011d.firebaseapp.com",
  databaseURL: "https://smartcampus-a011d-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "smartcampus-a011d",
  storageBucket: "smartcampus-a011d.appspot.com",
  messagingSenderId: "126313720751",
  appId: "1:126313720751:web:cf0f4e76a07e2bfa27dd5a",
  measurementId: "G-5X0QJVQFPT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, db }; // Export Firestore as well