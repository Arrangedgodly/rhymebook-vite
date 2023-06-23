import { auth, provider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState, useEffect, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

interface RegisterProps {
  setCurrentUser: any;
  loggedIn: boolean;
}

const useRegisterLogic = ({ setCurrentUser, loggedIn }: RegisterProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const db = getFirestore();

  /**
   * This function handles user registration by creating a new user with email and password
   * authentication and storing their information in local storage.
   * @param e - The "e" parameter is an event object of type MouseEvent<HTMLButtonElement>, which is
   * passed as an argument to the handleRegister function. It represents the event that triggered the
   * function, in this case, a click event on a button element.
   */
  const handleRegister = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        createUserDoc(user);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  /**
   * This function creates a user document in a Firestore database if it does not already exist.
   * @param {any} user - The `user` parameter is an object that represents a user in the application.
   * It contains properties such as `uid` (user ID), `email`, `displayName`, and `photoURL`.
   */
  const createUserDoc = async (user: any) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        setDoc(userRef, {
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
        });
      }
    }
  }

  /**
   * This function handles the registration process using Google authentication.
   */
  const handleGoogleRegister = () => {
    setGoogleLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setCurrentUser(user);
        createUserDoc(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
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
    loading,
    handleRegister,
    handleGoogleRegister,
    googleLoading,
  };
};

export default useRegisterLogic;
