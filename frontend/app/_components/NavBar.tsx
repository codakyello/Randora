/* eslint-disable @next/next/no-img-element */
"use client";
import { Box } from "@chakra-ui/react";
import Link from "next/link";
import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { User } from "../_utils/types";
import Menus from "./Menu";
import NavToggle from "./NavToogle";

export default function NavBar({
  user,
  logout,
}: {
  user: User | null;
  logout?: () => void;
}) {
  useLayoutEffect(() => {
    document.documentElement.classList.add("light-mode");
  }, []);

  const pathName = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "#features" },
    { name: "Pricing", path: "/pricing" },
  ];

  return (
    <Box className="bg-white h-[7rem] left-0 z-10 w-screen fixed p-[2rem] sm:px-[4rem] flex items-center justify-between">
      <Link href={"/"}>
        <img src="img/logo/randora.svg" alt="logo" />
      </Link>
      <ul className="hidden md:flex text-[1.8rem] font-medium gap-8 list-none">
        {navLinks.map((link, index) => (
          <li key={index}>
            <Link
              className={`${
                pathName === link.path ? "text-[#000] underline" : ""
              }`}
              href={link.path}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <Box className="hidden md:flex items-center gap-8">
        {user ? (
          <>
            <Menus.Toogle id="userMenu">
              <img
                src={user.image}
                alt="avatar"
                className="w-[4rem] h-[4rem] rounded-full"
              />
            </Menus.Toogle>

            <Menus.Menu id="userMenu">
              <Menus.Button onClick={() => logout?.()}>Sign Out</Menus.Button>
            </Menus.Menu>
          </>
        ) : (
          <>
            <Link className="font-medium text-[1.8rem] " href={"/login"}>
              Login
            </Link>

            <Link
              className="font-medium rounded-[8px] px-[2rem] py-[.8rem] border border-[#000] [#000] text-[#000]"
              href={"/signup"}
            >
              Sign Up
            </Link>
          </>
        )}
      </Box>

      <NavToggle />
    </Box>
  );
}
