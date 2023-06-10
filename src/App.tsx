import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import Header from "./components/Header";
import Loading from "./components/Loading";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import Settings from "./components/Settings";
import Dashboard from "./components/Dashboard";
import Notes from "./components/Notes";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import Missing from "./components/Missing";

function App() {
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

  return (
    <div className="flex flex-col items-center h-screen main-font bg-neutral text-neutral-content" data-theme={theme}>
      <Header
        currentUser={currentUser}
        theme={theme}
        changeTheme={changeTheme}
        handleLogout={handleLogout}
      />
      {isLoading && <Loading />}
      <Routes>
        <Route
          path="/"
          element={<Landing loggedIn={loggedIn} />}
        />
        <Route
          path="/login"
          element={
            <Login setCurrentUser={setCurrentUser} loggedIn={loggedIn} />
          }
        />
        <Route
          path="/register"
          element={
            <Register setCurrentUser={setCurrentUser} loggedIn={loggedIn} />
          }
        />
        <Route
          path="/settings"
          element={<Settings currentUser={currentUser} />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard currentUser={currentUser}/>}
        />
        <Route
          path="/notes"
          element={<Notes currentUser={currentUser} />}
        />
        <Route
          path="/profile"
          element={<Profile currentUser={currentUser} />}
        />
        <Route path="*" element={<Missing loggedIn={loggedIn} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
