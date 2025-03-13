import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ Move Firebase configuration to the top before initializing anything
const firebaseConfig = {
  apiKey: "AIzaSyAHketkp7VtOYHnR0sYNOk7ZTLuo6_da1g",
  authDomain: "studyio-bebb8.firebaseapp.com",
  projectId: "studyio-bebb8",
  storageBucket: "studyio-bebb8.appspot.com",
  messagingSenderId: "180091266724",
  appId: "1:180091266724:web:bc75722773500ac2bbe831",
};

// ✅ Initialize Firebase app first
const app = initializeApp(firebaseConfig);

// ✅ Now initialize Firestore and Auth **after** Firebase app
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
