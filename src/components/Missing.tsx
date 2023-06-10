
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
    href: "/dashboard",
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
    name: 'Your Profile',
    href: '/profile',
    description: 'View your profile information and change your settings.',
    icon: UserCircleIcon,
  },
  {
    name: 'Notebook',
    href: '/notes',
    description: 'View your collection of notes.',
    icon: BookmarkSquareIcon,
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    description: 'Create a new note using the API powered interface.',
    icon: UserCircleIcon,
  }
]


interface MissingProps {
  loggedIn: boolean;
}

const Missing = ({ loggedIn }: MissingProps) => {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:pb-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-base font-semibold leading-8 text-secondary">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          This page does not exist
        </h1>
        <p className="mt-4 text-base leading-7 sm:mt-6 sm:text-lg sm:leading-8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
      </div>
      <div className="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
        <h2 className="sr-only">Popular pages</h2>
        <ul
          role="list"
          className="-mt-6 divide-y divide-gray-900/5 border-b border-gray-900/5"
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
