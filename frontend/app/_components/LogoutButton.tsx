"use client";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../_contexts/AuthProvider";
import { Box } from "@chakra-ui/react";

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Box className="flex gap-4  items-center">
      <button
        onClick={() => logout()}
        className=" hover:bg-[var(--color-grey-50)] rounded-3xl text-[var(--color-red-500)] hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200 p-[1.7rem] md:py-[1rem] md:px-[1.5rem] w-full"
      >
        <ArrowRightStartOnRectangleIcon className="h-9 aspect-square text-[var(--color-red-600)]" />

        <span className="text-[var(--color-red-600)] font-medium text-[1.4rem]">
          Logout
        </span>
      </button>
    </Box>
  );
}

export default LogoutButton;
