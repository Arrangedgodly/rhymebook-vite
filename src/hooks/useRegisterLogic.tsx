import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { auth, provider } from "../firebase";
import { publishProfile } from "../utils/profiles";
import { toAppUser, type AppUser } from "../types/user";

interface RegisterProps {
  setCurrentUser: (user: AppUser | null) => void;
  loggedIn: boolean;
}

function readableError(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  switch (code) {
    case "auth/email-already-in-use":
      return "An account already uses that address. Try logging in.";
    case "auth/invalid-email":
      return "That doesn't look like an email address.";
    case "auth/weak-password":
      return "Pick a password of at least six characters.";
    case "auth/popup-closed-by-user":
      return "The Google window closed before finishing.";
    default:
      return "Could not create the account. Try again.";
  }
}

const useRegisterLogic = ({ setCurrentUser, loggedIn }: RegisterProps) => {
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const db = getFirestore();

  const createUserDoc = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      });
    }
  };

  /*
   * Reads auth.currentUser fresh rather than trusting a `User` object handed
   * in by the caller, so this always publishes whatever updateProfile most
   * recently wrote rather than a snapshot taken before it.
   */
  const finishSignUp = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const appUser = toAppUser(user);
    setCurrentUser(appUser);
    await createUserDoc(user);
    await publishProfile(appUser);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Set the name before publishing, so the public card isn't born blank.
      const chosen = displayName.trim();
      if (chosen) await updateProfile(user, { displayName: chosen });
      await finishSignUp();
    } catch (err) {
      setError(readableError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, provider);
      await finishSignUp();
    } catch (err) {
      setError(readableError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (loggedIn) navigate("/");
  }, [loggedIn, navigate]);

  return {
    displayName,
    setDisplayName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    googleLoading,
    error,
    handleRegister,
    handleGoogleRegister,
  };
};

export default useRegisterLogic;
