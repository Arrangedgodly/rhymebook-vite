import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import useRegisterLogic from "../hooks/useRegisterLogic";

interface RegisterProps {
  setCurrentUser: any;
  loggedIn: boolean;
}

const Register = ({ setCurrentUser, loggedIn }: RegisterProps) => {
  const {
    setEmail,
    setPassword,
    handleRegister,
    handleGoogleRegister,
    googleLoading,
    loading,
  } = useRegisterLogic({ setCurrentUser, loggedIn });

  return (
    <div className="container-main">
      <div className="card card-bordered items-center text-center shadow-lg compact w-96 bg-primary-focus text-secondary-content my-5">
        <h1 className="card-title text-2xl mt-4 mb-2 text-primary-content">
          Register
        </h1>
        <div className="card-body w-full">
          <form className="w-4/5 m-auto mb-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xl text-primary-content">
                  Email
                </span>
              </label>
              <input
                type="text"
                placeholder="email"
                className="input input-bordered text-primary-content bg-primary text-center placeholder-primary-content"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xl text-primary-content">
                  Password
                </span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered text-primary-content bg-primary text-center placeholder-primary-content"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-control mt-2">
              <label className="cursor-pointer label">
                <span className="label-text text-md text-primary-content">
                  Remember me
                </span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-lg checkbox-primary"
                />
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-secondary" onClick={handleRegister}>
                {loading && (
                  <span className="loading loading-spinner loading-md" />
                )}
                {loading ? (
                  <span className="text-md">Loading...</span>
                ) : (
                  <span className="text-md">Register</span>
                )}
              </button>
            </div>
          </form>
          <div className="divider">Or</div>
          <div className="form-control w-4/5 m-auto mb-4">
            <button
              className="btn btn-outline text-primary-content flex flex-col items-center p-2"
              onClick={handleGoogleRegister}
            >
              {googleLoading ? (
                <span className="loading loading-spinner loading-md" />
              ) : (
                <FcGoogle size="2rem" />
              )}
              {googleLoading ? (
                <span className="text-md">Loading...</span>
              ) : (
                <span className="text-md">Login with Google</span>
              )}
            </button>
          </div>
          <div className="text-primary-content flex flex-col items-center">
            Already have an account?
            <Link to="/login" className="btn btn-accent btn-sm m-2">
              Login here!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
