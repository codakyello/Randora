"use client";
import { Collaborator } from "../_utils/types";
import { getTagName } from "../_utils/helpers";
import Tag from "./Tag";
import Row from "./Row";
import { Box } from "@chakra-ui/react";
// import Button from "./Button";
// import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import { deleteCollaborator as deleteCollaboratorApi } from "../_lib/actions";
import useCustomMutation from "../_hooks/useCustomMutation";
import { useAuth } from "../_contexts/AuthProvider";
import { ModalOpen, ModalWindow, useModal } from "./Modal";
import ConfirmDelete from "./ConfirmDelete";
import Menus from "./Menu";
import { HiEye, HiTrash } from "react-icons/hi2";
import Link from "next/link";
import toast from "react-hot-toast";

export function CollaboratorRow({
  collaborator,
}: {
  collaborator: Collaborator;
}) {
  const { _id, userName, email, status, image } = collaborator;

  console.log(collaborator);

  const { user: currentUser, getToken } = useAuth();

  const token = getToken();

  const { mutate: deleteCollaborator, isPending: isDeleting } =
    useCustomMutation(deleteCollaboratorApi);

  const { close: closeModal } = useModal();
  const { close: closeMenu } = useModal();

  return (
    <Row>
      <Box className="flex w-[4.5rem] aspect-square relative items-center ">
        <Image className="rounded-full" src={image} alt={userName} fill />
      </Box>
      <Box className="flex flex-col gap-[.2rem]">
        <span className="font-medium">{userName}</span>
        <span className="text-[1.2rem] text-[var(--color-grey-500)]">
          {email}
        </span>
      </Box>

      <Tag type={getTagName(status)}>{status.replace("-", " ")}</Tag>

      <Box className="relative z-[9999]">
        <Menus.Toogle id={_id} />

        <Menus.Menu id={_id}>
          <ModalOpen name="delete-collaborator">
            <Menus.Button
              onClick={() => {}}
              icon={
                <HiTrash className="w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
              }
              disabled={isDeleting}
            >
              Delete
            </Menus.Button>
          </ModalOpen>

          <ModalWindow name="delete-collaborator">
            <ConfirmDelete
              resourceName="Collaborator"
              isDeleting={isDeleting}
              onConfirm={() =>
                currentUser?.organisationId &&
                deleteCollaborator(
                  {
                    organisationId: currentUser.organisationId,
                    collaboratorId: _id,
                    token,
                  },
                  {
                    onSuccess: () => {
                      toast.success("Collaborator deleted successfully");
                      closeModal();
                    },
                    onError: (error) => {
                      toast.error(error.message);
                    },
                  }
                )
              }
            />
          </ModalWindow>
        </Menus.Menu>
      </Box>
    </Row>
  );
}
