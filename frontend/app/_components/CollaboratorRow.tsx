"use client";
import { Collaborator, Organisation } from "../_utils/types";
import { getTagName } from "../_utils/helpers";
import Tag from "./Tag";
import Row from "./Row";
import { Box } from "@chakra-ui/react";
import { deleteCollaborator as deleteCollaboratorApi } from "../_lib/actions";
import useCustomMutation from "../_hooks/useCustomMutation";
import { useAuth } from "../_contexts/AuthProvider";
import { ModalOpen, ModalWindow, useModal } from "./Modal";
import ConfirmDelete from "./ConfirmDelete";
import Menus from "./Menu";
import { HiTrash } from "react-icons/hi2";
import toast from "react-hot-toast";

export function CollaboratorRow({
  collaborator,
  organisation,
}: {
  collaborator: Collaborator;
  organisation: Organisation;
}) {
  const {
    user: { _id, userName, email, image },
    status,
    _id: collaboratorId,
  } = collaborator;

  console.log(collaborator);

  const { user: currentUser, getToken } = useAuth();

  const token = getToken();

  const { mutate: deleteCollaborator, isPending: isDeleting } =
    useCustomMutation(deleteCollaboratorApi);

  const { close: closeModal } = useModal();
  const { close: closeMenu } = useModal();

  return (
    <Row>
      <Box
        className="flex w-[4.5rem] aspect-square relative items-center rounded-full"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Box className="flex flex-col gap-[.2rem]">
        <span className="font-medium">{userName}</span>
        <span className="text-[1.2rem] text-[var(--color-grey-500)]">
          {status === "accepted" && email}{" "}
          {status === "accepted" ? (
            <span>&middot; Collaborator</span>
          ) : (
            "Has a pending invite"
          )}
        </span>
      </Box>

      <Tag
        type={getTagName(
          organisation.subscriptionStatus !== "active" ? "inactive" : status
        )}
      >
        {organisation.subscriptionStatus !== "active" ? "Inactive" : status}
      </Tag>

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

        <ModalWindow name="delete-collaborator" listenCapturing={true}>
          <ConfirmDelete
            resourceName="Collaborator"
            isDeleting={isDeleting}
            onConfirm={() =>
              currentUser?.organisationId &&
              deleteCollaborator(
                {
                  organisationId: currentUser.organisationId,
                  collaboratorId,
                  token,
                },
                {
                  onSuccess: () => {
                    toast.success("Collaborator deleted successfully");
                    closeModal();
                    closeMenu();
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
    </Row>
  );
}
