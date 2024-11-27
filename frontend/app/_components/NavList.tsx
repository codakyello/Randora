"use client";
import {
  HomeIcon,
  CalendarDaysIcon,
  HomeModernIcon,
  Cog6ToothIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItems = [
  { name: "Home", icon: <HomeIcon />, to: "/dashboard" },
  { name: "Bookings", icon: <CalendarDaysIcon />, to: "/dashboard/bookings" },
  { name: "Cabins", icon: <HomeModernIcon />, to: "/dashboard/cabins" },
  { name: "Users", icon: <UsersIcon />, to: "/dashboard/users" },
  { name: "Settings", icon: <Cog6ToothIcon />, to: "/dashboard/settings" },
];

export default function NavList({ closeNav }: { closeNav?: () => void }) {
  const pathName = usePathname();
  return (
    <nav>
      <ul className="flex flex-col gap-2">
        {NavItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.to}
              onClick={() => closeNav?.()}
              className={`flex gap-5 text-[var(--color-grey-600)] p-[1.7rem] md:py-[1.2rem] md:px-[2.4rem] font-medium text-[1.6rem] transition-all duration-300 rounded-md ${
                pathName === item.to ? "bg-[var(--color-grey-50)]" : ""
              } group hover:bg-[var(--color-grey-50)]`}
            >
              <span
                className={`h-10 w-10 transition-all duration-300  ${
                  pathName === item.to
                    ? "text-[var(--color-brand-600)]"
                    : "text-gray-400"
                } group-hover:text-[var(--color-brand-600)] `}
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
