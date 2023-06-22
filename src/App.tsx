import useAppLogic from "./hooks/useAppLogic";
import { Routes, Route } from "react-router-dom";
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
  const {
    isLoading,
    loggedIn,
    currentUser,
    theme,
    changeTheme,
    handleLogout,
    setCurrentUser,
  } = useAppLogic();

  return (
    <div
      className="flex flex-col items-center h-screen main-font bg-neutral text-neutral-content overflow-x-hidden transform-all"
      data-theme={theme}
    >
      <Header
        currentUser={currentUser}
        theme={theme}
        changeTheme={changeTheme}
        handleLogout={handleLogout}
      />
      {isLoading && <Loading />}
      <Routes>
        <Route path="/" element={<Landing loggedIn={loggedIn} />} />
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
        <Route path="/settings" element={<Settings />} />
        <Route path="/notes" element={<Notes currentUser={currentUser} />} />
        <Route
          path="/notes/new"
          element={<Dashboard currentUser={currentUser} />}
        />
        <Route
          path="/notes/:existingNoteId"
          element={<Dashboard currentUser={currentUser} />}
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
