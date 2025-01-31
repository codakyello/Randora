import { Box } from "@chakra-ui/react";
import NavBar from "./_components/NavBar";
import Link from "next/link";

export const metadata = {
  title: "Randora",
  description:
    "Create and manage raffles, spin-the-wheel, and giveaways with our platform. Upload thousands of participants via CSV, track results in an analytics dashboard, and send bulk emails—all under flexible pricing tiers.",
};

export default function Home() {
  return (
    <Box className="bg-[var(--color-grey-50)]">
      <header className="h-screen">
        <NavBar />

        <Box className="flex items-center mt-[10rem] text-center justify-center">
          <h1 className="text-[4rem] leading-[5.5rem]">
            <span className="block">Lets manage </span>all your{" "}
            <span className="text-[var(--color-brand-200)]">giveaway</span>{" "}
            events
          </h1>
        </Box>

        <Box className="flex justify-center">
          <Link
            href="/signup"
            className="w-[20rem] flex items-center gap-[.5rem] justify-center  text-[1.6rem] font-medium h-[5.5rem] border border-[#000] rounded-[10rem] mt-[2rem]"
          >
            Sign Up
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.5 22H3.5"
                stroke="black"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 3.5L5 17.5"
                stroke="black"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 13.77V3.5H8.73"
                stroke="black"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Link>
        </Box>
      </header>
    </Box>
  );
}
