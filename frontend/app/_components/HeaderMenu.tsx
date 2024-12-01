import { UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

function HeaderMenu() {
  return (
    <div className="flex items-center gap-3">
      <Link
        className="hover:bg-[var(--color-grey-100)] rounded-md p-2"
        href="/dashboard/account"
      >
        <UserIcon className="w-9 text-[5rem] font-bold text-[var(--color-primary)] aspect-square" />
      </Link>
      <DarkModeToggle />
    </div>
  );
}

export default HeaderMenu;
