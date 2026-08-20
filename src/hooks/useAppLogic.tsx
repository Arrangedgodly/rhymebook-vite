import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toAppUser, type AppUser } from "../types/user";

const CACHE_KEY = "currentUser";

/** Read the last known user so a reload doesn't flash a signed-out header. */
function cachedUser(): AppUser | null {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    return saved ? (JSON.parse(saved) as AppUser) : null;
  } catch {
    return null;
  }
}

const useAppLogic = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(cachedUser);
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "pastel"
  );
  const navigate = useNavigate();

  /** Derived rather than stored, so it can never drift from currentUser. */
  const loggedIn = currentUser !== null;

  /*
   * Firebase is the source of truth for who is signed in; localStorage is only
   * a cache to avoid a flash on boot. Without this subscription the app trusted
   * the cache alone, so `auth.currentUser` could still be null when account
   * operations needed it.
   */
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      const next = user ? toAppUser(user) : null;
      setCurrentUser(next);
      if (next) localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      else localStorage.removeItem(CACHE_KEY);
    });
  }, []);

  const handleLogout = () => {
    setIsLoading(true);
    signOut(auth)
      .then(() => {
        setCurrentUser(null);
        localStorage.removeItem(CACHE_KEY);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  };

  return {
    isLoading,
    loggedIn,
    currentUser,
    theme,
    setTheme,
    handleLogout,
    setCurrentUser,
  };
};

export default useAppLogic;
