import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
  currentUser: any;
}

const Profile: React.FC<ProfileProps> = ({ currentUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  return (
    <div className="flex flex-col flex-grow items-center justify-center">
      <div className="card items-center bordered bg-primary shadow-lg w-96">
        <h1 className="card-title text-2xl m-2">{currentUser.displayName}</h1>
        <div className="card-body items-center">
          <div className="avatar placeholder">
            <div className="w-32 h-32 rounded-full bg-neutral-focus">
              <img src={currentUser.photoURL} alt="profile" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg text-center text-neutral-content m-2">
              {currentUser.email}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
