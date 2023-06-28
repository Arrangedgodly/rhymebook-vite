import { MdOutlineColorLens } from "react-icons/md";
import { useEffect } from "react";

type HeaderThemeProps = {
  theme: string;
  setTheme: (arg0: string) => void;
};

const HeaderTheme = ({ theme, setTheme }: HeaderThemeProps) => {
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const themes = [
    "pastel",
    "retro",
    "winter",
    "forest",
    "corporate",
    "business",
  ];

  return (
    <div className="dropdown dropdown-hover">
      <div tabIndex={1} className="m-1">
        <MdOutlineColorLens className="text-2xl" />
      </div>
      <ul
        tabIndex={1}
        className="dropdown-content p-2 shadow menu menu-vertical bg-accent text-accent-content rounded-box w-52 z-50"
      >
        <h3 className="text-lg font-bold text-center m-1">Theme Selector</h3>
        <div className="divider m-0"></div>
        {themes.map((themeOption) => (
          <li
            className="btn btn-ghost btn-sm w-full h-6 m-0 p-0"
            onClick={() => setTheme(themeOption)}
          >
            {themeOption}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeaderTheme;
