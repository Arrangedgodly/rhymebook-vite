import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import useLoginLogic from "../hooks/useLoginLogic";
import { Field, FormMessage, fieldInput } from "./FormControls";
import type { AppUser } from "../types/user";

interface LoginProps {
  setCurrentUser: (user: AppUser | null) => void;
  loggedIn: boolean;
}

const Login = ({ setCurrentUser, loggedIn }: LoginProps) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    googleLoading,
    loading,
    error,
    resetNotice,
    handleLogin,
    handleGoogleLogin,
    handlePasswordReset,
  } = useLoginLogic({ setCurrentUser, loggedIn });

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm opacity-65">
        Sign in to reach your notebook.
      </p>

      <form className="mt-6 flex flex-col gap-3" onSubmit={handleLogin}>
        <Field label="Email" htmlFor="login-email">
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className={fieldInput}
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field label="Password" htmlFor="login-password">
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            className={fieldInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Keep me signed in</span>
          </label>
          <button
            type="button"
            className="text-sm underline underline-offset-2 opacity-70 hover:opacity-100"
            onClick={handlePasswordReset}
          >
            Forgot password?
          </button>
        </div>

        {error && <FormMessage tone="error">{error}</FormMessage>}
        {resetNotice && <FormMessage tone="success">{resetNotice}</FormMessage>}

        <button type="submit" className="btn btn-primary mt-1" disabled={loading}>
          {loading && <span className="loading loading-spinner loading-sm" />}
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="divider text-xs opacity-60">or</div>

      <button
        type="button"
        className="btn btn-outline w-full gap-2"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <FcGoogle size="1.25rem" />
        )}
        {googleLoading ? "Signing in..." : "Continue with Google"}
      </button>

      <p className="mt-6 text-center text-sm opacity-70">
        No account yet?{" "}
        <Link to="/register" className="underline underline-offset-2">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;
