import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import Logo from "./Logo";
import { Box } from "@chakra-ui/react";
import { ModalOpen } from "./Modal";

export default function LotteryNav() {
  return (
    <header className="left-0 z-[9] fixed top-0 w-full border-b border-b-[var(--color-grey-100)] bg-[var(--color-grey-0)] right-0 h-[7rem] flex items-center justify-between gap-10 py-[1.2rem] md:px-[2rem] px-[1.2rem]">
      <Logo />
      <Box className="flex items-center gap-10">
        <Link className="font-medium text-[1.8rem]" href="/dashboard">
          Dashboard
        </Link>

        <ModalOpen name="prizes">
          <p className="font-medium cursor-pointer  text-[1.8rem]">Prizes</p>
        </ModalOpen>

        <Link className="font-medium text-[1.8rem]" href="/dashboard/events">
          Winners
        </Link>

        <DarkModeToggle />
      </Box>
    </header>
  );
}
