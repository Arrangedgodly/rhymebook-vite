import { useNavigate } from "react-router-dom";

const HeaderLogo = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/")}
      aria-label="RhymePage home"
      className="rounded-md px-1 text-xl font-extrabold tracking-tight
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="text-primary">Rhyme</span>
      <span className="text-secondary">Page</span>
    </button>
  );
};

export default HeaderLogo;
