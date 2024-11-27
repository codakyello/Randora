"use client";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../_contexts/AuthProvider";

function SignOutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={() => logout()}
      className="p-2 hover:bg-[var(--color-grey-100)] text-[var(--color-brand-600)] hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200 w-full"
    >
      <ArrowRightEndOnRectangleIcon className="h-9 aspect-square text-[var(--color-brand-600)]" />
    </button>
  );
}

export default SignOutButton;
