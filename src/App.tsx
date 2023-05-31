import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Loading from "./components/Loading";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "garden");

  const changeTheme = () => {
    if (theme === "garden") {
      localStorage.setItem("theme", "forest");
      setTheme("forest");
    } else {
      localStorage.setItem("theme", "garden");
      setTheme("garden");
    }
  }

  return (
    <div className="flex flex-col items-center h-screen" data-theme={theme}>
      <Header currentUser={currentUser} theme={theme} changeTheme={changeTheme} />
      {isLoading && <Loading value={70} />}
    </div>
  )
}

export default App
