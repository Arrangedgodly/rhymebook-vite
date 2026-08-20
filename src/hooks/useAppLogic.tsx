import { useCallback, useEffect, useState } from "react";
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
  const [currentUser, setCurrentUserState] = useState<AppUser | null>(cachedUser);
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "pastel"
  );
  const navigate = useNavigate();

  /** Derived rather than stored, so it can never drift from currentUser. */
  const loggedIn = currentUser !== null;

  /*
   * The single place state and the boot-flash cache are written together.
   * Register and login used to call the raw state setter directly after
   * finishing sign-up/sign-in, which updated the UI correctly but never
   * touched localStorage -- only the auth listener below wrote there, and it
   * only fires once per sign-up, carrying a snapshot taken before
   * updateProfile's write landed. The symptom was invisible in the live
   * session (React state was already right) but would flash the wrong name
   * for a moment on an early reload, since the cache never caught up.
   */
  const commitUser = useCallback((next: AppUser | null) => {
    setCurrentUserState(next);
    if (next) localStorage.setItem(CACHE_KEY, JSON.stringify(next));
    else localStorage.removeItem(CACHE_KEY);
  }, []);

  /*
   * Firebase is the source of truth for who is signed in; localStorage is only
   * a cache to avoid a flash on boot. Without this subscription the app trusted
   * the cache alone, so `auth.currentUser` could still be null when account
   * operations needed it.
   */
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        commitUser(null);
        return;
      }

      const next = toAppUser(user);
      setCurrentUserState((prev) => {
        /*
         * Guards the same staleness from the other direction: never let a
         * later notification for the same account erase a field a more
         * recent write (via commitUser) already populated.
         */
        const merged =
          prev && prev.uid === next.uid
            ? {
                ...next,
                displayName: next.displayName ?? prev.displayName,
                photoURL: next.photoURL ?? prev.photoURL,
              }
            : next;
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
        return merged;
      });
    });
  }, [commitUser]);

  const handleLogout = () => {
    setIsLoading(true);
    signOut(auth)
      .then(() => {
        commitUser(null);
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
    setCurrentUser: commitUser,
  };
};

export default useAppLogic;
