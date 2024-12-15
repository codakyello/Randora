import { Box } from "@chakra-ui/react";
// import useUser from "../_hooks/useUser";
import { getUser } from "../_lib/data-service";
import Modal, { ModalOpen, ModalWindow } from "./Modal";

export default async function UserAvatar() {
  // const { data: user, isLoading, error } = useUser();
  // if (isLoading) return null;
  // if (error) return null;
  const user = await getUser();

  return (
    <Modal>
      <ModalOpen name="user-avatar">
        <Box className="cursor-pointer flex mr-auto md:mr-0 items-center gap-5">
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
      </ModalOpen>

      <ModalWindow name="user-avatar">
        <Box
          className="flex w-[30rem] aspect-square relative items-center rounded-full"
          style={{
            backgroundImage: `url(${user?.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </ModalWindow>
    </Modal>
  );
}
