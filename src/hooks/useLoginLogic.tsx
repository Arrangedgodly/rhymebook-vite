import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { auth, provider } from "../firebase";
import { publishProfile } from "../utils/profiles";
import { toAppUser, type AppUser } from "../types/user";
import type { User } from "firebase/auth";

interface LoginProps {
  setCurrentUser: (user: AppUser | null) => void;
  loggedIn: boolean;
}

function readableError(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "That email and password don't match an account.";
    case "auth/invalid-email":
      return "That doesn't look like an email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a minute and try again.";
    case "auth/popup-closed-by-user":
      return "The Google window closed before finishing.";
    default:
      return "Could not sign in. Try again.";
  }
}

const useLoginLogic = ({ setCurrentUser, loggedIn }: LoginProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [resetNotice, setResetNotice] = useState<string>("");
  const navigate = useNavigate();
  const db = getFirestore();

  /** Create the private user document on first sign-in; leave it alone after. */
  const ensureUserDoc = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    }
  };

  const finishSignIn = async (user: User) => {
    const appUser = toAppUser(user);
    setCurrentUser(appUser);
    await ensureUserDoc(user);
    // Republish so people can find this account to share with or follow.
    await publishProfile(appUser);
  };

  /**
   * "Remember me" maps onto Firebase persistence: local survives closing the
   * browser, session does not. Must be set before the sign-in call.
   */
  const applyPersistence = () =>
    setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setResetNotice("");
    setLoading(true);
    try {
      await applyPersistence();
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await finishSignIn(user);
    } catch (err) {
      setError(readableError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setResetNotice("");
    setGoogleLoading(true);
    try {
      await applyPersistence();
      const { user } = await signInWithPopup(auth, provider);
      await finishSignIn(user);
    } catch (err) {
      setError(readableError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  /**
   * Always reports success, even for an address with no account: telling a
   * stranger which emails are registered is a free user-enumeration oracle.
   */
  const handlePasswordReset = async () => {
    setError("");
    if (!email.trim()) {
      setError("Enter your email address first, then choose reset.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch {
      // Deliberately swallowed; see above.
    }
    setResetNotice(
      `If an account uses ${email.trim()}, a reset link is on its way.`
    );
  };

  useEffect(() => {
    if (loggedIn) navigate("/");
  }, [loggedIn, navigate]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    googleLoading,
    loading,
    error,
    resetNotice,
    handleLogin,
    handleGoogleLogin,
    handlePasswordReset,
  };
};

export default useLoginLogic;
