import { auth, provider } from "../firebase";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState, useEffect, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setCurrentUser: any;
  loggedIn: boolean;
}

const useLoginLogic = ({ setCurrentUser, loggedIn }: LoginProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const db = getFirestore();

  /**
   * This function handles the login process by signing in with email and password, setting the current
   * user, and storing the user in local storage.
   * @param e - MouseEvent<HTMLButtonElement> - This is the event object that is passed when the login
   * button is clicked. It is of type MouseEvent and specifically for a button element.
   */
  const handleLogin = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        handleUserDoc(user);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  /**
   * This function checks if a user document exists in a Firestore database and creates one if it
   * doesn't.
   * @param {any} user - The `user` parameter is an object that represents a user in the application.
   * It contains properties such as `uid` (user ID) and `email` (user email address).
   */
  const handleUserDoc = async (user: any) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        setDoc(userRef, {
          email: user.email,
          uid: user.uid,
        });
      } else {
        console.log("User already exists.");
      }
    }
  };

  /**
   * This function handles the Google login process using Firebase authentication and updates the
   * current user state.
   */
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        handleUserDoc(user);
        setGoogleLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setGoogleLoading(false);
      });
  };

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn]);

  return {
    setEmail,
    setPassword,
    googleLoading,
    loading,
    handleLogin,
    handleGoogleLogin,
  };
}

export default useLoginLogic;