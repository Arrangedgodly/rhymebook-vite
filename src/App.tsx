import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Loading from "./components/Loading";
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
  const navigate = useNavigate();

  const changeTheme = () => {
    if (theme === "garden") {
      localStorage.setItem("theme", "forest");
      setTheme("forest");
    } else {
      localStorage.setItem("theme", "garden");
      setTheme("garden");
    }
  };

  useEffect(() => {
    if (currentUser) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex flex-col items-center h-screen" data-theme={theme}>
      <Header
        currentUser={currentUser}
        theme={theme}
        changeTheme={changeTheme}
      />
      {isLoading && <Loading value={70} />}
      <Routes>
        <Route
          path="/login"
          element={<Login setCurrentUser={setCurrentUser} />}
        />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
