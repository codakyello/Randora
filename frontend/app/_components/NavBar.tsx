/* eslint-disable @next/next/no-img-element */
"use client";
import { Box } from "@chakra-ui/react";
import Link from "next/link";
import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export default function NavBar() {
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
    <Box className="h-[10rem] px-[4rem] flex items-center justify-between">
      <Link href={"/"}>
        <img src="img/logo/Randora.svg" alt="logo" />
      </Link>
      <ul className="flex text-[1.8rem] font-medium gap-8 list-none">
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
      <Box className="flex items-center gap-8">
        <Link className="font-medium text-[1.8rem] " href={"/login"}>
          Login
        </Link>

        <Link
          className="font-medium rounded-[8px] px-[2rem] py-[.8rem] border border-[#000] [#000] text-[#000]"
          href={"/signup"}
        >
          Sign Up
        </Link>
      </Box>
    </Box>
  );
}
