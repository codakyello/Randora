"use client";
import { Box } from "@chakra-ui/react";
import Row from "./Row";
import Image from "next/image";
import { Prize } from "../_utils/types";
import Menus from "./Menu";
import { HiPencil, HiTrash } from "react-icons/hi2";
import { deletePrize as deletePrizeApi } from "../_lib/data-service";
import { ModalOpen, ModalWindow, useModal } from "./Modal";
import ConfirmDelete from "./ConfirmDelete";
import CreateEditPrizeForm from "./CreateEditPrizeForm";
import useCustomMutation from "../_hooks/useCustomMutation";
import toast from "react-hot-toast";

export default function PrizeRow({ prize }: { prize: Prize }) {
  const { name, image, quantity, _id: id } = prize;

  const { close: closeModal } = useModal();

  const { mutate: deletePrize, isPending: isDeleting } =
    useCustomMutation(deletePrizeApi);

  const handleDelete = function () {
    deletePrize(id, {
      onSuccess: () => {
        toast.success("Prize deleted successfully");
        closeModal();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
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
        <Menus.Toogle id={id} />

        <Menus.Menu id={id}>
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
