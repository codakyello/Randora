import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import Logo from "./Logo";

export default function LotteryNav() {
  return (
    <header className="left-0 fixed top-0 w-full border-b border-b-[var(--color-grey-100)] bg-[var(--color-grey-0)] right-0 h-[7rem] flex items-center justify-between gap-10 py-[1.2rem] md:px-[2rem] px-[1.2rem]">
      <Logo />
      <div className="flex items-center gap-10">
        <Link className="font-medium text-[1.8rem]" href="/dashboard">
          Dashboard
        </Link>
        <Link className="font-medium text-[1.8rem]" href="/dashboard/events">
          Winners
        </Link>
        <DarkModeToggle />
      </div>
    </header>
  );
}
