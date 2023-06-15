import { auth, provider } from "../firebase";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState, useEffect, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setCurrentUser: any;
  currentUser: any;
  loggedIn: boolean;
}

const Login = ({ setCurrentUser, currentUser, loggedIn }: LoginProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  const navigate = useNavigate();
  const db = getFirestore();
  const users = collection(db, "users");

  const getUsers = async () => {
    if (currentUser) {
    const data = await getDocs(users);
    const usersList = data.docs.map((doc) => doc.data());
    setUsersList(usersList);
    }
  };

  const handleLogin = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleUserDoc = (user: any) => {
    const userExists = usersList.find(
      (person) => person.email === user.email
    );
    if (!userExists) {
      setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        username: user.displayName,
        photoURL: user.photoURL,
        notes: [],
      });
    } else {
      console.log(userExists)
    }
  }

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        setGoogleLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setGoogleLoading(false);
      });
  };

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn]);

  useEffect(() => {
    getUsers();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      handleUserDoc(currentUser);
    }
  }
  , [currentUser])

  return (
    <div className="container-main justify-center">
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
                {loading && (
                  <span className="loading loading-spinner loading-md" />
                )}
                {loading ? (
                  <span className="text-md">Loading...</span>
                ) : (
                  <span className="text-md">Login</span>
                )}
              </button>
            </div>
          </form>
          <div className="divider">Or</div>
          <div className="form-control w-4/5 m-auto mb-4">
            <button
              className="btn btn-outline text-primary-content flex flex-col items-center p-2"
              onClick={handleGoogleLogin}
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
