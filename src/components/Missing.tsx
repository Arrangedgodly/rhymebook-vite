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
    <main className="w-full px-6 pt-10 pb-16 mx-auto max-w-7xl sm:pb-24 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-base text-3xl font-semibold leading-8 sm:text-5xl text-secondary">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          This page does not exist
        </h1>
        <p className="mt-4 text-base leading-7 sm:mt-6 sm:text-lg sm:leading-8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
      </div>
      <div className="flow-root max-w-lg mx-auto mt-16 sm:mt-20">
        <h2 className="sr-only">Popular pages</h2>
        <ul
          role="list"
          className="-mt-6 border-b divide-y divide-gray-900/5 border-gray-900/5"
        >
          {loggedIn ? (
            <MissingLinks links={loggedLinks} />
          ) : (
            <MissingLinks links={unloggedLinks} />
          )}
        </ul>
      </div>
    </main>
  );
};

export default Missing;
