"use client";
import { useDarkMode } from "../_contexts/DarkModeProvider";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      className="p-2 hover:bg-[var(--color-grey-100)] font-semibold rounded-md"
      onClick={toggleDarkMode}
    >
      {isDarkMode ? (
        <SunIcon className="h-9 aspect-square text-[var(--color-brand-600)]" />
      ) : (
        <MoonIcon className="h-9 aspect-square text-[var(--color-brand-600)]" />
      )}
    </button>
  );
}
