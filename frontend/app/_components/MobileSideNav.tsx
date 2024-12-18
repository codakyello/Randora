"use client";
import useOutsideClick from "../_hooks/useOutsideClick";
import Logo from "./Logo";
import Nav from "./Nav";
import { useNav } from "../_contexts/NavProvider";
import LogoutButton from "./LogoutButton";
import UpgradePlan from "./UpgradePlan";
import { User } from "../_utils/types";
import { Box } from "@chakra-ui/react";

export default function MobileSideNav({
  user,
  daysUntilExpiry,
}: {
  user: User;
  daysUntilExpiry: number;
}) {
  const { closeNav } = useNav();

  const ref = useOutsideClick(closeNav);
  return (
    <aside
      ref={ref}
      className="mobile-nav md:hidden bg-[var(--color-grey-0)] w-[28rem] fixed border-r border-r-[var(--color-grey-100)] top-0 left-0 h-full flex px-[1rem] pt-[3.2rem] pb-[1.5rem] flex-col gap-16 row-span-2 z-[9999]"
    >
      <Logo />
      <Nav closeNav={closeNav} user={user} />

      <Box className="flex flex-col gap-16 mt-auto">
        {daysUntilExpiry && daysUntilExpiry < 7 && daysUntilExpiry > 0 && (
          <UpgradePlan daysUntilExpiry={daysUntilExpiry} />
        )}

        <LogoutButton />
      </Box>
    </aside>
  );
}
