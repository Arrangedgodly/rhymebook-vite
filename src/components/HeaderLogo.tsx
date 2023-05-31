import { useNavigate } from "react-router-dom";

const HeaderLogo = () => {
  const navigate = useNavigate();

  return (
    <button className="btn btn-ghost text-3xl font-bold logo" onClick={() => {navigate('/')}}>
      R
      <span className="text-secondary-content">
        P
      </span>
    </button>
  );
};

export default HeaderLogo;
