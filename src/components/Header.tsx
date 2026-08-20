import { NavLink, useNavigate } from "react-router-dom";
import HeaderLogo from "./HeaderLogo";
import HeaderTheme from "./HeaderTheme";
import type { AppUser } from "../types/user";

interface HeaderProps {
  currentUser: AppUser | null;
  theme: string;
  setTheme: (theme: string) => void;
  handleLogout: () => void;
}

function initials(name: string): string {
  const parts = name.match(/\b\w/g) ?? [];
  return ((parts.shift() ?? "") + (parts.pop() ?? "")).toUpperCase();
}

const navLink = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-2.5 py-1.5 text-sm font-medium transition",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    isActive ? "bg-base-200 text-base-content" : "opacity-70 hover:opacity-100",
  ].join(" ");

const Header = ({
  currentUser,
  theme,
  setTheme,
  handleLogout,
}: HeaderProps) => {
  const navigate = useNavigate();
  const displayName = currentUser?.displayName;
  const photoURL = currentUser?.photoURL;

  return (
    <header className="flex flex-none items-center gap-2 border-b border-base-300 bg-base-100 px-3 py-2 md:px-5">
      <HeaderLogo />

      {currentUser && (
        <nav className="ml-2 hidden items-center gap-1 sm:flex">
          <NavLink to="/notes/new" className={navLink}>
            Write
          </NavLink>
          <NavLink to="/notes" end className={navLink}>
            Notebook
          </NavLink>
        </nav>
      )}

      <div className="ml-auto flex items-center gap-1">
        <HeaderTheme theme={theme} setTheme={setTheme} />

        {currentUser ? (
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              type="button"
              aria-label="Account menu"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full
                         bg-base-300 focus-visible:outline-2 focus-visible:outline-offset-2
                         focus-visible:outline-primary"
            >
              {photoURL ? (
                <img src={photoURL} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-bold opacity-75">
                  {displayName ? initials(displayName) : "?"}
                </span>
              )}
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu z-50 mt-2 w-48 rounded-lg border
                         border-base-300 bg-base-100 p-1.5 shadow-lg"
            >
              <li className="px-2 py-1.5">
                <span className="pointer-events-none block truncate text-xs opacity-55">
                  {currentUser.email}
                </span>
              </li>
              <li>
                <button type="button" onClick={() => navigate("/profile")}>
                  Profile
                </button>
              </li>
              <li className="sm:hidden">
                <button type="button" onClick={() => navigate("/notes")}>
                  Notebook
                </button>
              </li>
              <li className="sm:hidden">
                <button type="button" onClick={() => navigate("/notes/new")}>
                  Write
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate("/settings")}>
                  Settings
                </button>
              </li>
              <li>
                <button type="button" className="text-error" onClick={handleLogout}>
                  Log out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
