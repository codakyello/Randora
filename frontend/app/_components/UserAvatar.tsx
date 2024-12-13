"use client";
import { Box } from "@chakra-ui/react";
import useUser from "../_hooks/useUser";

export default function UserAvatar() {
  const { data: user, isLoading, error } = useUser();
  if (isLoading) return null;
  if (error) return null;

  return (
    <Box className="flex mr-auto md:mr-0 items-center gap-5">
      <Box
        className="flex w-14 aspect-square relative items-center rounded-full"
        style={{
          backgroundImage: `url(${user?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <span className="text-[1.4rem] font-medium">
        {user?.userName?.split(" ")[0]}
      </span>
    </Box>
  );
}
