// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
export const provider = new GoogleAuthProvider();