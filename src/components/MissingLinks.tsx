import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

interface Link {
  name: string;
  href: string;
  description: string;
  icon: any;
}

interface MissingLinksProps {
  links: Link[];
}

const MissingLinks = ({ links }: MissingLinksProps) => {
  const navigate = useNavigate();
  return (
    <ul
      role="list"
      className="-mt-6 divide-y divide-gray-900/5 border-b border-gray-900/5"
    >
      {links.map((link, linkIdx) => (
        <li key={linkIdx} className="relative flex gap-x-6 py-6">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg shadow-sm ring-1 ring-gray-900/10">
            <link.icon className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div className="flex-auto">
            <h3 className="text-sm font-semibold leading-6 text-secondary">
              <a onClick={() => navigate(link.href)} className="cursor-pointer">
                <span className="absolute inset-0" aria-hidden="true" />
                {link.name}
              </a>
            </h3>
            <p className="mt-2 text-sm leading-6">{link.description}</p>
          </div>
          <div className="flex-none self-center">
            <ChevronRightIcon
              className="h-5 w-5 text-secondary"
              aria-hidden="true"
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MissingLinks;
