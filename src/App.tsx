import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import Header from "./components/Header";
import Loading from "./components/Loading";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "garden");

  const changeTheme = () => {
    if (theme === "garden") {
      localStorage.setItem("theme", "forest");
      setTheme("forest");
    } else {
      localStorage.setItem("theme", "garden");
      setTheme("garden");
    }
  };

  const handleLogout = () => {
    setIsLoading(true);
    signOut(auth)
      .then(() => {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
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
          element={<Landing />}
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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
