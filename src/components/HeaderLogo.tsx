import { useNavigate } from "react-router-dom";

const HeaderLogo = () => {
  const navigate = useNavigate();
  const navigateHome = () => {
    navigate("/");
  }

  return (
    <button className="btn btn-ghost text-3xl font-bold items-center justify-center header-button" onClick={navigateHome}>
      <span className="whitespace-none text-primary-content">R<span className="button-text button-text-main">hyme</span></span>
      <span className="text-secondary-content pt-2">
        <span>P</span><span className="button-text button-text-secondary">age</span>
      </span>
    </button>
  );
};

export default HeaderLogo;
