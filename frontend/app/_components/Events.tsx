"use client";
import { Box } from "@chakra-ui/react";
import useEvents from "../_hooks/useEvents";
import EventTable from "./EventTable";
import Modal, { ModalOpen, ModalWindow } from "./Modal";
import SpinnerFull from "./SpinnerFull";
import Button from "./Button";
import CreateEditEventForm from "./CreateEditEventForm";

export default function Events() {
  const { data, isLoading } = useEvents();

  const events = data?.events;
  const count = data?.totalCount;

  if (isLoading) return <SpinnerFull />;

  return (
    <Modal>
      {events?.length ? (
        <EventTable events={events} count={count} />
      ) : (
        <h2 className="mt-5">No Events Found</h2>
      )}

      <ModalOpen name="add-event">
        <Box>
          <Button type="primary">Add Event</Button>
        </Box>
      </ModalOpen>

      <ModalWindow name="add-event">
        <CreateEditEventForm />
      </ModalWindow>
    </Modal>
  );
}
