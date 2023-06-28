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
  const [theme, setTheme] = useState<string>(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

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

  return {
    isLoading,
    loggedIn,
    currentUser,
    theme,
    setTheme,
    handleLogout,
    setCurrentUser,
  }
}

export default useAppLogic;