import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC6y_7Y-pvsPFDjIzPtSoenal2_jCIRVnU",
  authDomain: "scribd-downloader-719ab.firebaseapp.com",
  projectId: "scribd-downloader-719ab",
  storageBucket: "scribd-downloader-719ab.firebasestorage.app",
  messagingSenderId: "151987038178",
  appId: "1:151987038178:web:67b2642c36522f6b79fbbb"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
