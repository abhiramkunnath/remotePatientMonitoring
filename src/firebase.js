// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPaRsUpcUuhp0WeXcc2dBmgxenrh8C8ZI",
  authDomain: "remotepatientmonitoring-20778.firebaseapp.com",
  projectId: "remotepatientmonitoring-20778",
  storageBucket: "remotepatientmonitoring-20778.firebasestorage.app",
  messagingSenderId: "634958984979",
  appId: "1:634958984979:web:c4f0d28ac5f737c5858ce6",
  measurementId: "G-RV6N5WXHHB",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
