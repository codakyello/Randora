import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { getUser } from "../_lib/data-service";

export default async function UserAvatar() {
  const user = await getUser();

  if (!user) return;

  return (
    <Box className="flex mr-auto md:mr-0 items-center gap-5">
      <Box className="relative w-14 rounded-full overflow-hidden aspect-square">
        <Image fill alt="My Avatar" src={user.image || "/"} />
      </Box>
      <span className="text-[1.4rem] font-medium">
        {user.userName?.split(" ")[0]}
      </span>
    </Box>
  );
}
