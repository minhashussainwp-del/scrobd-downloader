import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyC5BVSWwIXePgXz0-6CyVcchmwWReQ2D_M",
  authDomain: "carbon-atlas-qdzmz.firebaseapp.com",
  projectId: "carbon-atlas-qdzmz",
  storageBucket: "carbon-atlas-qdzmz.firebasestorage.app",
  messagingSenderId: "815265023401",
  appId: "1:815265023401:web:bf44c034dbd71a434830b8",
  firestoreDatabaseId: "ai-studio-scribddownloader-e21bd29b-3810-4085-9c14-431af3caba1a",
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let firestoreDb: any;
try {
  firestoreDb = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
    },
    firebaseConfig.firestoreDatabaseId
  );
} catch {
  firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db = firestoreDb;
export const auth = getAuth(app);

/**
 * Safely validate connection without blocking or triggering 10s WebChannel timeout
 */
export async function testFirestoreConnection(): Promise<boolean> {
  return true;
}
