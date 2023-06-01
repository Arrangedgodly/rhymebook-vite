import { BsSun, BsMoon } from "react-icons/bs";
import HeaderLogo from "./HeaderLogo";

interface HeaderProps {
  currentUser: any;
  theme: string;
  changeTheme: () => void;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentUser,
  theme,
  changeTheme,
  handleLogout,
}) => {
  const displayName = currentUser?.displayName;
  const getInitials = (name: string) => {
    const initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  };

  return (
    <div className="navbar bg-primary text-primary-content p-4 fixed top-0 left-0 z-50">
      <div className="navbar-start"></div>
      <div className="navbar-center gap-5">
        <button
          className="btn btn-ghost btn-sm rounded-btn"
          onClick={changeTheme}
        >
          {theme === "garden" ? <BsSun /> : <BsMoon />}
        </button>
        <HeaderLogo />
        <div className="dropdown dropdown-hover">
          <div
            tabIndex={0}
            className={displayName ? "avatar" : "avatar placeholder"}
          >
            <div className="rounded-full w-10 h-10 m-1 bg-neutral-focus">
              <span className="text-3xl">
                {displayName ? `${getInitials(displayName)}` : "?"}
              </span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="p-2 shadow menu dropdown-content bg-neutral text-neutral-content items-center rounded-box w-52"
          >
            <li>
              <a href="/profile">Profile</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
            <li>
              {currentUser ? (
                <a onClick={handleLogout}>Logout</a>
              ) : (
                <a href="/login">Login</a>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-end"></div>
    </div>
  );
};

export default Header;
