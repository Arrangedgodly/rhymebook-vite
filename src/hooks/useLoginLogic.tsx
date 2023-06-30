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