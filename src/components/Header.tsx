import { BsSun, BsMoon } from "react-icons/bs";
import HeaderLogo from "./HeaderLogo";

interface HeaderProps {
  currentUser: any;
  theme: string;
  changeTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, theme, changeTheme }) => {
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
        <div className={currentUser ? "avatar" : "avatar placeholder"}>
          <div className="rounded-full w-10 h-10 m-1 bg-neutral-focus">
            <span className="text-3xl">?</span>
          </div>
        </div>
      </div>
      <div className="navbar-end"></div>
    </div>
  );
};

export default Header;
