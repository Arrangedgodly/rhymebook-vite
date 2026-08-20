import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import useRegisterLogic from "../hooks/useRegisterLogic";
import { Field, FormMessage, fieldInput } from "./FormControls";
import type { AppUser } from "../types/user";

interface RegisterProps {
  setCurrentUser: (user: AppUser | null) => void;
  loggedIn: boolean;
}

const Register = ({ setCurrentUser, loggedIn }: RegisterProps) => {
  const {
    displayName,
    setDisplayName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    googleLoading,
    error,
    handleRegister,
    handleGoogleRegister,
  } = useRegisterLogic({ setCurrentUser, loggedIn });

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold">Create an account</h1>
      <p className="mt-1 text-sm opacity-65">
        Save your lyrics and pick up where you left off.
      </p>

      <form className="mt-6 flex flex-col gap-3" onSubmit={handleRegister}>
        <Field
          label="Name"
          htmlFor="register-name"
          hint="Shown on your profile and to anyone you share a note with."
        >
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            className={fieldInput}
            value={displayName}
            placeholder="Your name"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Field>

        <Field label="Email" htmlFor="register-email">
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            className={fieldInput}
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field
          label="Password"
          htmlFor="register-password"
          hint="At least six characters."
        >
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            className={fieldInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        {error && <FormMessage tone="error">{error}</FormMessage>}

        <button type="submit" className="btn btn-primary mt-1" disabled={loading}>
          {loading && <span className="loading loading-spinner loading-sm" />}
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <div className="divider text-xs opacity-60">or</div>

      <button
        type="button"
        className="btn btn-outline w-full gap-2"
        onClick={handleGoogleRegister}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <FcGoogle size="1.25rem" />
        )}
        {googleLoading ? "Creating..." : "Continue with Google"}
      </button>

      <p className="mt-6 text-center text-sm opacity-70">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
