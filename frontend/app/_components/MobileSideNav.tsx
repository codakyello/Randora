"use client";
import useOutsideClick from "../_hooks/useOutsideClick";
import Logo from "./Logo";
import Nav from "./Nav";
import { useNav } from "../_contexts/NavProvider";
import LogoutButton from "./LogoutButton";
import UpgradePlan from "./UpgradePlan";

export default function MobileSideNav() {
  const { closeNav } = useNav();

  const ref = useOutsideClick(closeNav);
  return (
    <aside
      ref={ref}
      className="mobile-nav md:hidden bg-[var(--color-grey-0)] w-[28rem] fixed border-r border-r-[var(--color-grey-100)] top-0 left-0 h-full flex px-[1rem] pt-[3.2rem] pb-[1.5rem] flex-col gap-16 row-span-2 z-[9999]"
    >
      <Logo className="ml-[2rem]" />
      <Nav closeNav={closeNav} />

      <UpgradePlan />

      <LogoutButton />
    </aside>
  );
}
