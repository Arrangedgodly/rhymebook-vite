import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const useAppLogic = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [theme, setTheme] = useState<string>(localStorage.getItem("theme") || "winter");
  const navigate = useNavigate();

  const changeTheme = () => {
    if (theme === "winter") {
      localStorage.setItem("theme", "forest");
      setTheme("forest");
    } else {
      localStorage.setItem("theme", "winter");
      setTheme("winter");
    }
  };

  const handleLogout = () => {
    setIsLoading(true);
    signOut(auth)
      .then(() => {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
        navigate("/");
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (currentUser) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [currentUser]);

  return {
    isLoading,
    loggedIn,
    currentUser,
    theme,
    changeTheme,
    handleLogout,
    setCurrentUser,
  }
}

export default useAppLogic;