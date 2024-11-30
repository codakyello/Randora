"use client";
import { Participant } from "../_utils/types";
import Tag from "./Tag";
import Row from "./Row";
import Menus, { useMenu } from "./Menu";
import { HiPencil, HiTrash } from "react-icons/hi2";

import { ModalOpen, ModalWindow } from "./Modal";
import ConfirmDelete from "./ConfirmDelete";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import useCheckOut from "../_hooks/useCheckOut";
import useDeleteEvent from "../_hooks/useDeleteEvent";
import CreateEditCabinForm from "./CreateEditCabinForm";
import { useState } from "react";
import { deleteParticipant } from "../_lib/data-service";
import toast from "react-hot-toast";
import { showToastMessage } from "../_utils/utils";

export default function ParticipantRow({
  participant,
}: {
  participant: Participant;
}) {
  const { _id: participantId, name, email, ticketNumber } = participant;

  const { mutate: checkOut, isPending: isCheckingOut } = useCheckOut();

  //   const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    const res = await deleteParticipant(participantId);

    if (res?.status !== "error")
      toast.success("Participant deleted successfully");
    else {
      toast.error(new Error(res.message!).message);
    }

    setIsDeleting(false);
  };

  return (
    <Row>
      <Box>{name || <div className="ml-4">&mdash;</div>}</Box>
      <Box>{email || <div className="ml-4">&mdash;</div>}</Box>
      <Box className="flex font-semibold items-center justify-center">
        {ticketNumber}
      </Box>
      <Box className="flex justify-center items-center flex-col gap-[.2rem]">
        Iphone
      </Box>

      <Box className="relative">
        <Menus.Toogle id={participantId} />

        <Menus.Menu id={participantId}>
          <ModalOpen name="edit-participant">
            <Menus.Button
              disabled={false}
              onClick={() => {}}
              icon={
                <HiPencil className="w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
              }
            >
              Edit
            </Menus.Button>
          </ModalOpen>

          <ModalWindow name="edit-participant">
            <CreateEditCabinForm cabinToEdit={""} />
          </ModalWindow>

          <ModalOpen name="delete-participant">
            <Menus.Button
              onClick={() => {}}
              icon={
                <HiTrash className="w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
              }
              disabled={isDeleting}
            >
              <div className="w-full">Delete</div>
            </Menus.Button>
          </ModalOpen>

          <ModalWindow name="delete-participant">
            <ConfirmDelete
              resourceName="Participant"
              isDeleting={isDeleting}
              onConfirm={() => {
                handleDelete();
              }}
            />
          </ModalWindow>
        </Menus.Menu>
      </Box>
    </Row>
  );
}
