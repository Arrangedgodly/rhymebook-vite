import { BsSun, BsMoon } from "react-icons/bs";
import HeaderLogo from "./HeaderLogo";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  currentUser: any;
  theme: string;
  changeTheme: () => void;
  handleLogout: () => void;
}

const Header = ({
  currentUser,
  theme,
  changeTheme,
  handleLogout,
}: HeaderProps) => {
  const displayName = currentUser?.displayName;
  const photoURL = currentUser?.photoURL;
  const getInitials = (name: string) => {
    const initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  };
  const navigate = useNavigate();

  return (
    <div className="navbar bg-primary text-primary-content p-6 lg:px-8">
      <div className="navbar-start"></div>
      <div className="navbar-center gap-5">
        <button
          className="btn btn-ghost btn-sm rounded-btn"
          onClick={changeTheme}
        >
          {theme === "winter" ? <BsSun /> : <BsMoon />}
        </button>
        <HeaderLogo />
        <div className="dropdown dropdown-hover">
          <div tabIndex={0} className="avatar placeholder">
            <div className="rounded-full w-10 h-10 m-1 bg-neutral-focus">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="avatar"
                  className="rounded-full w-10 h-10 m-1"
                />
              ) : displayName ? (
                <span className="text-2xl font-bold">
                  {getInitials(displayName)}
                </span>
              ) : (
                <span className="text-2xl font-bold">?</span>
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="p-2 shadow menu dropdown-content bg-neutral text-neutral-content items-center rounded-box w-52 z-50"
          >
            {currentUser ? (
              <>
                <li>
                  <a onClick={() => navigate("/profile")}>Profile</a>
                </li>
                <li>
                  <a onClick={() => navigate("/notes")}>Notes</a>
                </li>
                <li>
                  <a onClick={() => navigate("/settings")}>Settings</a>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </>
            ) : (
              <li>
                <a onClick={() => navigate("/login")}>Login</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="navbar-end"></div>
    </div>
  );
};

export default Header;
