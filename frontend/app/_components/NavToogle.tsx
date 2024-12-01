"use client";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useNav } from "../_contexts/NavProvider";

export default function NavToggle() {
  const { toggleNav, isOpen } = useNav();
  return (
    <button
      className="md:hidden flex bg-[var(--color-grey-50)] h-16 items-center justify-center rounded-[var(--border-radius-md)] aspect-square"
      onClick={toggleNav}
    >
      {!isOpen ? (
        <HamburgerIcon className="text-[var(--color-primary)] text-[3rem]" />
      ) : (
        <CloseIcon className="text-[var(--color-primary)] text-[2rem]" />
      )}
    </button>
  );
}
