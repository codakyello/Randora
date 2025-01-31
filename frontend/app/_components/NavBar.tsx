"use client";
import { Box } from "@chakra-ui/react";
import Logo from "./Logo";
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
    { name: "Support", path: "/support" },
  ];

  return (
    <Box className="h-[7rem] p-[4rem] flex items-center justify-between">
      <Logo />
      <ul className="flex text-[2rem] font-medium gap-6 list-none">
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
      <Box className="flex items-center">
        <Link className="text-[1.8rem] font-medium" href={"/login"}>
          Login
        </Link>
      </Box>
    </Box>
  );
}
