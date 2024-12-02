"use client";
import {
  HomeIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

import { LiaToolsSolid } from "react-icons/lia";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItems = [
  { name: "Dashboard", icon: <HomeIcon />, link: "/dashboard" },
  { name: "Giveaways", icon: <CalendarDaysIcon />, link: "/dashboard/events" },
  { name: "Settings", icon: <Cog6ToothIcon />, link: "/dashboard/settings" },
  {
    name: "Tools",
    icon: <LiaToolsSolid />,
    link: "/dashboard/tools",
  },
];

export default function NavList({ closeNav }: { closeNav?: () => void }) {
  const pathName = usePathname();
  return (
    <nav>
      <ul className="flex flex-col gap-2">
        {NavItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.link}
              onClick={() => closeNav?.()}
              className={`flex gap-10 md:gap-5 items-center text-[var(--color-grey-600)] p-[1.7rem] md:py-[1.5rem] md:px-[2rem] font-medium text-[1.6rem] transition-all duration-300 rounded-2xl group ${
                pathName !== item.link && "hover:bg-[var(--color-grey-100)]"
              }  ${
                pathName === item.link ? "bg-[var(--color-brand-200)]" : ""
              }`}
            >
              <span
                className={`h-8 w-8 ${
                  pathName === item.link ? "text-black" : ""
                } text-[2rem] transition-all duration-300   `}
              >
                {item.icon}
              </span>
              <span
                className={`text-[1.4rem] ${
                  pathName === item.link ? "text-black" : ""
                } `}
              >
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
