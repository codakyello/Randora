import { useRef } from "react";
import { Box } from "@chakra-ui/react";
import Row from "./Row";
import Image from "next/image";
import { Prize } from "../_utils/types";
import Menus, { useMenu } from "./Menu";
import { HiPencil, HiTrash } from "react-icons/hi2";
import { deletePrize as deletePrizeApi } from "../_lib/actions";
import { ModalOpen, ModalWindow, useModal } from "./Modal";
import ConfirmDelete from "./ConfirmDelete";
import useCustomMutation from "../_hooks/useCustomMutation";
import toast from "react-hot-toast";
import { useAuth } from "../_contexts/AuthProvider";
import EditPrizeForm from "./EditPrizeForm";

export default function PrizeRow({
  prize,
  actions,
}: {
  prize: Prize;
  actions: boolean;
}) {
  const { name, image, quantity, _id: prizeId } = prize;

  const imageRef = useRef<HTMLImageElement>(null);

  const { getToken } = useAuth();
  const token = getToken();

  const { close: closeModal, open } = useModal();
  const { close: closeMenu } = useMenu();

  const { mutate: deletePrize, isPending: isDeleting } =
    useCustomMutation(deletePrizeApi);

  const handleDelete = function () {
    deletePrize(
      { prizeId, token },
      {
        onSuccess: () => {
          toast.success("Prize deleted successfully");
          closeModal();
          closeMenu();
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  return (
    <Row>
      <Box className="relative w-[6.4rem] aspect-[3/2]">
        <ModalOpen name={`show-image-${name}`}>
          <Image
            ref={imageRef}
            className="scale-150 cursor-pointer translate-x-[-7px]"
            fill
            src={image}
            alt="prize-img"
          />
        </ModalOpen>

        <ModalWindow name={`show-image-${name}`}>
          <Box
            className="flex max-w-[70rem] aspect-square relative items-center rounded-full css-0"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img src={`${image}`} alt="prize-img" />
          </Box>
        </ModalWindow>
      </Box>
      <p className="font-semibold">{name}</p>
      <p className="font-semibold ml-[-1rem] text-center">{quantity}</p>
      <div className="relative grid items-end justify-end">
        {actions && (
          <>
            <Menus.Toogle id={prizeId} />

            <Menus.Menu id={prizeId}>
              <ModalOpen name="edit-prize">
                <Menus.Button
                  disabled={isDeleting}
                  onClick={() => {}}
                  icon={
                    <HiPencil className="w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
                  }
                >
                  Edit
                </Menus.Button>
              </ModalOpen>

              <ModalWindow name="edit-prize" listenCapturing={true}>
                <EditPrizeForm prizeToEdit={prize} />
              </ModalWindow>

              <ModalOpen name="delete-prize">
                <Menus.Button
                  disabled={isDeleting}
                  onClick={() => {}}
                  icon={
                    <HiTrash className="w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
                  }
                >
                  Delete
                </Menus.Button>
              </ModalOpen>

              <ModalWindow name="delete-prize" listenCapturing={true}>
                <ConfirmDelete
                  resourceName="Prize"
                  isDeleting={isDeleting}
                  onConfirm={handleDelete}
                />
              </ModalWindow>
            </Menus.Menu>
          </>
        )}
      </div>
    </Row>
  );
}
