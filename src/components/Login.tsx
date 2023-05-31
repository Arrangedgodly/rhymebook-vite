import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";

interface LoginProps {
  setCurrentUser: any;
}

const Login: React.FC<LoginProps> = ({ setCurrentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center w-full">
      <div className="card card-bordered items-center text-center shadow-lg compact w-96 bg-primary-focus text-secondary-content">
        <h1 className="card-title text-2xl mt-4 mb-2 text-primary-content">
          Login
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
              <button className="btn btn-secondary" onClick={handleLogin}>
                Login
              </button>
            </div>
          </form>
          <div className="text-primary-content flex flex-col items-center">
            <span className="text-md">Don't have an account?</span>
            <Link to="/register" className="btn btn-accent btn-sm m-2">
              Register here!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
