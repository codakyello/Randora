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
  { name: "Home", icon: <HomeIcon />, link: "/dashboard" },
  { name: "Events", icon: <CalendarDaysIcon />, link: "/dashboard/events" },
  { name: "Settings", icon: <Cog6ToothIcon />, link: "/dashboard/settings" },
  {
    name: "Tools",
    icon: <LiaToolsSolid />,
    link: "/dashboard/cabins",
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
              className={`flex gap-5 text-[var(--color-grey-600)] p-[1.7rem] md:py-[1rem] md:px-[1.5rem] font-medium text-[1.6rem] transition-all duration-300 rounded-3xl group hover:bg-[var(--color-grey-100)] ${
                pathName === item.link ? "bg-[var(--color-grey-100)]" : ""
              }`}
            >
              <span
                className={`h-10 w-10 text-[2.2rem] transition-all duration-300  ${
                  pathName === item.link
                    ? "text-[var(--color-brand-600)]"
                    : "text-gray-400"
                } `}
              >
                {item.icon}
              </span>
              <span
                className={` ${
                  pathName === item.link
                    ? "text-[var(--color-brand-600)]"
                    : "text-[var(--color-grey-700)]"
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
