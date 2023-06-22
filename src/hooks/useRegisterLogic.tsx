import { auth, provider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState, useEffect, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleRegister = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleGoogleRegister = () => {
    setGoogleLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setCurrentUser(user);
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
