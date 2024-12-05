"use client";
import { Box } from "@chakra-ui/react";
import useEvents from "../_hooks/useEvents";
import EventTable from "./EventTable";
import Modal, { ModalOpen, ModalWindow } from "./Modal";
import SpinnerFull from "./SpinnerFull";
import Button from "./Button";
import CreateEditEventForm from "./CreateEditEventForm";
import Menus from "./Menu";
import CreatePrizeForm from "./CreatePrizeForm";
import UploadParticipants from "./UploadParticipants";
import { useState } from "react";

export default function Events() {
  const { data, isLoading } = useEvents();

  const [eventId, setEventId] = useState("");

  const events = data?.events;
  const count = data?.totalCount;

  if (isLoading) return <SpinnerFull />;

  return (
    <Menus>
      <Modal>
        <Box className="gap-10 min-h-[65vh] md:min-h-[63.5vh] xl:min-h-[72vh] flex flex-col justify-between">
          {events?.length ? (
            <EventTable events={events} count={count} />
          ) : (
            <h2 className="mt-5">No Events Found</h2>
          )}
          <Box>
            <ModalOpen name="add-event">
              <Button type="primary">Add Event</Button>
            </ModalOpen>
          </Box>

          <ModalWindow name="add-event">
            <CreateEditEventForm setEventId={setEventId} />
          </ModalWindow>

          <ModalWindow name="upload-participant">
            <UploadParticipants eventId={eventId} />
          </ModalWindow>

          <ModalWindow name="add-prize" listenCapturing={true}>
            <CreatePrizeForm eventId={eventId} />
          </ModalWindow>
        </Box>
      </Modal>
    </Menus>
  );
}
