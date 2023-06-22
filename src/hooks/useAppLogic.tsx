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

  /**
   * The function changes the theme from winter to forest and vice versa, and updates the theme in
   * local storage.
   */
  const changeTheme = () => {
    if (theme === "winter") {
      localStorage.setItem("theme", "forest");
      setTheme("forest");
    } else {
      localStorage.setItem("theme", "winter");
      setTheme("winter");
    }
  };

  /**
   * This function logs out the current user, removes their data from local storage, and navigates them
   * to the home page.
   */
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

  /* This `useEffect` hook is checking if the `currentUser` state has changed and updating the
  `loggedIn` state accordingly. If `currentUser` is not null, `loggedIn` is set to `true`, otherwise
  it is set to `false`. The dependency array `[currentUser]` ensures that this effect only runs when
  `currentUser` changes. */
  useEffect(() => {
    if (currentUser) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    }
  }, [loggedIn]);

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