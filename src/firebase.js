import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCequ-X2TC5SkFSVEmaH8YoCBTrUOq2T1I",
  authDomain: "my-goals-app-89062.firebaseapp.com",
  projectId: "my-goals-app-89062",
  storageBucket: "my-goals-app-89062.firebasestorage.app",
  messagingSenderId: "239780806221",
  appId: "1:239780806221:web:4a4422621788211bcba604",
  measurementId: "G-BDWKCPT37F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);