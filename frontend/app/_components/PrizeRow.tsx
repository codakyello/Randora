"use client";
import { Box } from "@chakra-ui/react";
import Row from "./Row";
import Image from "next/image";
import { Prize } from "../_utils/types";
import Menus, { useMenu } from "./Menu";
import { HiPencil, HiTrash } from "react-icons/hi2";
import { deletePrize as deletePrizeApi } from "../_lib/actions";
import { ModalOpen, ModalWindow, useModal } from "./Modal";
import ConfirmDelete from "./ConfirmDelete";
import CreateEditPrizeForm from "./CreateEditPrizeForm";
import useCustomMutation from "../_hooks/useCustomMutation";
import toast from "react-hot-toast";
import { useAuth } from "../_contexts/AuthProvider";

export default function PrizeRow({ prize }: { prize: Prize }) {
  const { name, image, quantity, _id: prizeId } = prize;

  const { getToken } = useAuth();

  const token = getToken();

  const { close: closeModal } = useModal();

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
        <Image
          className="scale-150 translate-x-[-7px]"
          fill
          src={image}
          alt="prize-img"
        />
      </Box>
      <p className="font-semibold">{name}</p>
      <p className="font-semibold">{quantity}</p>
      <div className="relative grid items-end justify-end">
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

          <ModalWindow name="edit-prize">
            <CreateEditPrizeForm prizeToEdit={prize} />
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

          <ModalWindow name="delete-prize">
            <ConfirmDelete
              resourceName="Event"
              isDeleting={isDeleting}
              onConfirm={handleDelete}
            />
          </ModalWindow>
        </Menus.Menu>
      </div>
    </Row>
  );
}
