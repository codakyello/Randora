import Link from "next/link";
import Logo from "./Logo";
import { Box } from "@chakra-ui/react";
import { ModalOpen } from "./Modal";

export default function LotteryNav({
  numberOfWinners,
}: {
  numberOfWinners: number;
}) {
  return (
    <header className="left-0 z-[9] fixed top-0 w-full border-b border-b-[var(--color-grey-100)] bg-[var(--color-grey-0)] right-0 h-[7rem] flex items-center justify-between gap-10 py-[1.2rem] md:px-[2rem] px-[1.2rem]">
      <Logo />

      <Box className="flex items-center gap-10">
        <ModalOpen name="prizes">
          <p className="font-medium cursor-pointer  text-[1.8rem]">Prizes</p>
        </ModalOpen>
        <Link className="font-medium text-[1.8rem]" href="/dashboard">
          Dashboard
        </Link>

        <ModalOpen name="show-winners">
          <Box className="relative">
            <button className="font-medium text-[1.8rem]">Winners</button>

            <Box className="absolute text-[1.4rem] p-[.5rem] right-[-18px] text-white flex items-center justify-center top-[-3px] z-10 bg-[var(--brand-color)] rounded-full w-[2rem] h-[2rem]">
              {numberOfWinners || 0}
            </Box>
          </Box>
        </ModalOpen>

        {/* <DarkModeToggle /> */}
      </Box>
    </header>
  );
}
