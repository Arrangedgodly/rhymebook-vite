import {
  BookmarkSquareIcon,
  BookOpenIcon,
  UserPlusIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import MissingLinks from "./MissingLinks";

const unloggedLinks = [
  {
    name: "Demo",
    href: "/notes/new",
    description: "Test out our application without creating an account.",
    icon: BookOpenIcon,
  },
  {
    name: "Signup",
    href: "/register",
    description: "Get started with a free user account here!",
    icon: UserPlusIcon,
  },
  {
    name: "Login",
    href: "/login",
    description: "Login with Email/Password or Google Authentication",
    icon: ArrowRightOnRectangleIcon,
  },
];

const loggedLinks = [
  {
    name: "Your Profile",
    href: "/profile",
    description: "View your profile information and change your settings.",
    icon: UserCircleIcon,
  },
  {
    name: "Notebook",
    href: "/notes",
    description: "View your collection of notes.",
    icon: BookmarkSquareIcon,
  },
  {
    name: "Dashboard",
    href: "/notes/new",
    description: "Create a new note using the API powered interface.",
    icon: UserCircleIcon,
  },
];

interface MissingProps {
  loggedIn: boolean;
}

const Missing = ({ loggedIn }: MissingProps) => {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 md:py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
        404
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
        This page does not exist
      </h1>
      <p className="mt-2 text-sm opacity-65">
        The link may be out of date. Here is where else you can go.
      </p>

      <div className="mt-8">
        <h2 className="sr-only">Popular pages</h2>
        <MissingLinks links={loggedIn ? loggedLinks : unloggedLinks} />
      </div>
    </div>
  );
};

export default Missing;
