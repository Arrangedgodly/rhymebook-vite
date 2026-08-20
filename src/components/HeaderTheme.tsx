import { useEffect } from "react";
import { MdOutlineColorLens } from "react-icons/md";

type HeaderThemeProps = {
  theme: string;
  setTheme: (theme: string) => void;
};

const THEMES = ["pastel", "retro", "winter", "forest", "corporate", "business"];

const HeaderTheme = ({ theme, setTheme }: HeaderThemeProps) => {
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        type="button"
        aria-label="Change theme"
        className="btn btn-ghost btn-sm btn-square"
      >
        <MdOutlineColorLens className="h-5 w-5" />
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-50 mt-2 w-44 rounded-lg border
                   border-base-300 bg-base-100 p-1.5 shadow-lg"
      >
        <li className="px-2 pb-1">
          <span className="pointer-events-none text-[0.68rem] font-medium uppercase tracking-wider opacity-55">
            Theme
          </span>
        </li>
        {THEMES.map((option) => (
          <li key={option}>
            <button
              type="button"
              onClick={() => setTheme(option)}
              className={theme === option ? "font-semibold text-primary" : ""}
            >
              <span className="capitalize">{option}</span>
              {theme === option && <span className="ml-auto text-xs">Active</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeaderTheme;
