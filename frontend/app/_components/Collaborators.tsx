"use client";

import { Box } from "@chakra-ui/react";
import Modal, { ModalOpen, ModalWindow } from "./Modal";
import Button from "./Button";
import Menus from "./Menu";
import CollaboratorTable from "./CollaboratorTable";
import useCollaborators from "../_hooks/useCollaborators";
import SpinnerFull from "./SpinnerFull";
import AddCollaboratorForm from "./AddCollaboratorForm";
import { useSearchParams } from "next/navigation";
import { Collaborator } from "../_utils/types";

export default function Collaborators({
  organisationId,
}: {
  organisationId: string;
}) {
  const { isLoading, data } = useCollaborators(organisationId);

  const searchParams = useSearchParams();

  const status = searchParams.get("status") || "all";
  const sortBy = searchParams.get("sortBy") || "username-asc";

  if (isLoading) return <SpinnerFull />;

  const collaborators = data?.collaborators;
  console.log(collaborators);
  const totalCount = data?.totalCount;

  if (!collaborators) return <h2>No collaborators yet</h2>;

  console.log(collaborators);

  let derivedCollabs = collaborators;

  if (status !== "all") {
    derivedCollabs = collaborators.filter(
      (collabs: Collaborator) => collabs.status === status
    );
  }

  if (sortBy) {
    derivedCollabs = [...derivedCollabs].sort((a, b) => {
      if (sortBy === "username-asc") {
        return a.user.userName.localeCompare(b.user.userName);
      }
      if (sortBy === "username-desc") {
        return b.user.userName.localeCompare(a.user.userName);
      }
      return 0;
    });
  }

  return (
    <Menus>
      <Modal>
        <Box className="gap-10 min-h-[65vh] md:min-h-[63.5vh] xl:min-h-[72vh] flex flex-col justify-between">
          {derivedCollabs?.length ? (
            <CollaboratorTable
              collaborators={derivedCollabs}
              count={totalCount}
            />
          ) : (
            <h2 className="mt-5">No Collaborators yet</h2>
          )}
          <Box>
            <ModalOpen name="add-collaborator">
              <Button type="primary">Add Collaborator</Button>
            </ModalOpen>
          </Box>

          <ModalWindow name="add-collaborator" listenCapturing={true}>
            <AddCollaboratorForm collaborators={collaborators} />
          </ModalWindow>
        </Box>
      </Modal>
    </Menus>
  );
}
