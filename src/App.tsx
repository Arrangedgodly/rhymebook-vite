import useAppLogic from "./hooks/useAppLogic";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
import { Suspense, lazy } from "react";
const Notes = lazy(() => import("./components/Notes"));
const Landing = lazy(() => import("./components/Landing"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Settings = lazy(() => import("./components/Settings"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Profile = lazy(() => import("./components/Profile"));
const Missing = lazy(() => import("./components/Missing"));

function App() {
  const {
    isLoading,
    loggedIn,
    currentUser,
    theme,
    setTheme,
    handleLogout,
    setCurrentUser,
  } = useAppLogic();

  // The dashboard is a fixed frame: every pixel goes to writing or suggestions.
  const { pathname } = useLocation();
  const isWriting = pathname.startsWith("/notes/");

  return (
    <div
      className="flex h-dvh flex-col overflow-hidden main-font bg-base-100 text-base-content"
      data-theme={theme}
    >
      <Header
        currentUser={currentUser}
        theme={theme}
        setTheme={setTheme}
        handleLogout={handleLogout}
      />
      {isLoading && <Loading />}
      <main className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
      <Suspense fallback={<Loading />}>
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
          <Route
            path="/settings"
            element={<Settings currentUser={currentUser} setCurrentUser={setCurrentUser} />}
          />
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
          <Route
            path="/profile/:uid"
            element={<Profile currentUser={currentUser} />}
          />
          <Route path="*" element={<Missing loggedIn={loggedIn} />} />
        </Routes>
      </Suspense>
      </main>
      {!isWriting && <Footer />}
    </div>
  );
}

export default App;
