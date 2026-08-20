import type { ComponentType, SVGProps } from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

export interface MissingLink {
  name: string;
  href: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const MissingLinks = ({ links }: { links: MissingLink[] }) => {
  const navigate = useNavigate();

  return (
    <ul className="divide-y divide-base-300 border-y border-base-300">
      {links.map((link) => (
        <li key={link.href} className="relative flex items-center gap-4 py-4">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-base-300">
            <link.icon className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-auto">
            <h3 className="text-sm font-semibold">
              <button
                type="button"
                onClick={() => navigate(link.href)}
                className="text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                {link.name}
              </button>
            </h3>
            <p className="mt-0.5 text-sm opacity-65">{link.description}</p>
          </div>
          <ChevronRightIcon className="h-5 w-5 flex-none opacity-40" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
};

export default MissingLinks;
