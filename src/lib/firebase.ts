
"use client";
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCmmloITA8CqzBp95FW5omJERWE1UAjWcA",
  authDomain: "govconnect-eden.firebaseapp.com",
  projectId: "govconnect-eden",
  storageBucket: "govconnect-eden.appspot.com",
  messagingSenderId: "387415562879",
  appId: "1:387415562879:web:dfc946a353340a0385bd4a"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
