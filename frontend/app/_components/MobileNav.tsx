"use client";
import { Box } from "@chakra-ui/react";
import { useNav } from "../_contexts/NavProvider";
import Link from "next/link";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Features", path: "#features" },
  { name: "Pricing", path: "/pricing" },
];

export default function MobileNav() {
  const { isOpen, closeNav } = useNav();
  if (!isOpen) return null;
  return (
    <Box className="md:hidden z-10 backdrop-blur bg-[#ffffffbb] fixed top-0 left-0 h-screen w-screen">
      <Box className="pt-[10rem] flex flex-col items-center  h-full ">
        <ul className="flex flex-col gap-8 text-[3rem] font-normal list-none">
          {navLinks.map((link, index) => (
            <li onClick={closeNav} key={index}>
              <Link href={link.path}>{link.name}</Link>
            </li>
          ))}
        </ul>
        <Box className="mt-[4rem] flex flex-col gap-8  items-center ">
          <Link
            onClick={closeNav}
            className="font-medium rounded-[8px] px-[9rem] py-[2rem] border border-[#000] [#000] text-[#000]"
            href={"/login"}
          >
            Login
          </Link>

          <Link
            onClick={closeNav}
            className="font-medium rounded-[8px] px-[8rem] py-[2rem] border bg-[#000] [#000] text-[#fff]"
            href={"/signup"}
          >
            Sign Up
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
