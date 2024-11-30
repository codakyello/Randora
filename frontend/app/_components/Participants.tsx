import { Box } from "@chakra-ui/react";
import { getEventParticipants } from "../_lib/data-service";
import Modal, { ModalOpen, ModalWindow } from "./Modal";
import ParticipantTable from "./ParticipantTable";
import Button from "./Button";
import CreateEditCabinForm from "./CreateEditCabinForm";

export default async function Participants({ eventId }: { eventId: string }) {
  const data = await getEventParticipants(eventId);

  const participants = data?.participants;

  const count = data?.totalCount;

  return (
    <Modal>
      {participants.length ? (
        <ParticipantTable participants={participants} count={count} />
      ) : (
        <h2 className="mt-5">No Participants Found</h2>
      )}

      <ModalOpen name="add-cabin">
        <Box>
          <Button type="primary">Add Participant</Button>
        </Box>
      </ModalOpen>

      <ModalWindow name="add-cabin">
        <CreateEditCabinForm />
      </ModalWindow>
    </Modal>
  );
}
