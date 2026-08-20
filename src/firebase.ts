// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  connectAuthEmulator,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArkjuqZMCEWfZ4iDXh32ims44svzP7yJU",
  authDomain: "rhymepage-6b98b.firebaseapp.com",
  projectId: "rhymepage-6b98b",
  storageBucket: "rhymepage-6b98b.appspot.com",
  messagingSenderId: "826172871931",
  appId: "1:826172871931:web:67460576ba5ae36885cc5e",
  measurementId: "G-K9094K0YSW"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

if (import.meta.env.DEV) {
  // Debug-only hook for manual console inspection; never present in a build.
  (window as unknown as { __auth?: unknown; __db?: unknown }).__auth = auth;
  (window as unknown as { __auth?: unknown; __db?: unknown }).__db = db;
}

/*
 * Local-only escape hatch for testing against the Firebase emulator suite
 * instead of the real project. Gated on both DEV (never true in a production
 * build, regardless of this flag) and an explicit opt-in env var, so there is
 * no path by which a real user ever gets pointed at a local emulator.
 *
 * connectXEmulator throws if called twice on the same instance, which Vite's
 * HMR can trigger by re-running this module -- the try/catch is for that, not
 * for masking a real connection failure.
 */
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true") {
  try {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    console.info("[firebase] connected to local emulators");
  } catch {
    // Already connected -- expected on hot reload.
  }
}