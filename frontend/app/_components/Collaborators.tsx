"use client";

import { Box } from "@chakra-ui/react";
import Modal, { ModalOpen, ModalWindow } from "./Modal";
import Button from "./Button";
import Menus from "./Menu";
import CollaboratorTable from "./CollaboratorTable";
import useCollaborators from "../_hooks/useCollaborators";
import SpinnerFull from "./SpinnerFull";
import AddCollaboratorForm from "./AddCollaboratorForm";

export default function Collaborators({
  organisationId,
}: {
  organisationId: string;
}) {
  const { isLoading, data } = useCollaborators(organisationId);

  console.log(data);

  if (isLoading) return <SpinnerFull />;

  const collaborators = data?.collaborators;
  const totalCount = data?.totalCount;

  return (
    <Menus>
      <Modal>
        <Box className="gap-10 min-h-[65vh] md:min-h-[63.5vh] xl:min-h-[72vh] flex flex-col justify-between">
          {collaborators?.length ? (
            <CollaboratorTable
              collaborators={collaborators}
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

          <ModalWindow name="add-collaborator">
            <AddCollaboratorForm />
          </ModalWindow>
        </Box>
      </Modal>
    </Menus>
  );
}
