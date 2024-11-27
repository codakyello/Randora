"use client";
import useOutsideClick from "../_hooks/useOutsideClick";
import Logo from "./Logo";
import Nav from "./Nav";
import { useNav } from "../_contexts/NavProvider";

export default function MobileSideNav() {
  const { closeNav } = useNav();

  const ref = useOutsideClick(closeNav);
  return (
    <aside
      ref={ref}
      className="mobile-nav md:hidden bg-[var(--color-grey-0)] w-[30rem] fixed border-r border-r-[var(--color-grey-100)] top-0 left-0 h-full flex py-[1.5rem] md:py-[3.2rem] flex-col gap-16 row-span-2 z-[9999]"
    >
      <Logo />
      <Nav closeNav={closeNav} />
    </aside>
  );
}
