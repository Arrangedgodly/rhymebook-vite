import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { BookmarkSquareIcon, BookOpenIcon, QueueListIcon } from '@heroicons/react/24/solid'

const unloggedLinks = [
  {
    name: 'Documentation',
    href: '#',
    description: 'Learn how to integrate our tools with your app.',
    icon: BookOpenIcon,
  },
  { name: 'API Reference', href: '#', description: 'A complete API reference for our libraries.', icon: QueueListIcon },
  {
    name: 'Guides',
    href: '#',
    description: 'Installation guides that cover popular setups.',
    icon: BookmarkSquareIcon,
  },
];

const loggedLinks = [
  {
    name: 'Your Profile',
    href: '#',
    description: 'View your profile information and change your settings.',
    icon: UserCircleIcon,
  },
  {
    name: 'Your Profile',
    href: '#',
    description: 'View your profile information and change your settings.',
    icon: UserCircleIcon,
  },
  {
    name: 'Your Profile',
    href: '#',
    description: 'View your profile information and change your settings.',
    icon: UserCircleIcon,
  },
  {
    name: 'Your Profile',
    href: '#',
    description: 'View your profile information and change your settings.',
    icon: UserCircleIcon,
  }
]

interface MissingProps {
  loggedIn: boolean;
}

const Missing = ({ loggedIn }: MissingProps) => {
  return (
    <main className='mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:pb-24 lg:px-8'>
      <div className="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
          <p className="text-base font-semibold leading-8">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">This page does not exist</h1>
          <p className="mt-4 text-base leading-7 sm:mt-6 sm:text-lg sm:leading-8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
          <h2 className="sr-only">Popular pages</h2>
          <ul role="list" className="-mt-6 divide-y divide-gray-900/5 border-b border-gray-900/5">
            {unloggedLinks.map((link, linkIdx) => (
              <li key={linkIdx} className="relative flex gap-x-6 py-6">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg shadow-sm ring-1 ring-gray-900/10">
                  <link.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="flex-auto">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    <a href={link.href}>
                      <span className="absolute inset-0" aria-hidden="true" />
                      {link.name}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{link.description}</p>
                </div>
                <div className="flex-none self-center">
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </li>
            ))}
          </ul>
        </div>
    </main>
  )
}

export default Missing;