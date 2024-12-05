"use client";
import { Box } from "@chakra-ui/react";
import FormRow from "./FormRow";
import Input from "./Input";
import Button from "./Button";
import { FormEvent, useState } from "react";
import {
  createEvent as createEventApi,
  updateEvent as updateEventApi,
} from "../_lib/actions";
import { useAuth } from "../_contexts/AuthProvider";

import { Event, EventForm } from "../_utils/types";
import { IoCloseOutline } from "react-icons/io5";
import { DatePicker } from "./DatePicker";
import useCustomMutation from "../_hooks/useCustomMutation";
import toast from "react-hot-toast";
import { useModal } from "./Modal";
import { useMenu } from "./Menu";

export default function CreateEditEventForm({
  eventToEdit,
  onClose,
  setEventId,
}: {
  eventToEdit?: Event;
  onClose?: () => void;
  setEventId?: (id: string) => void;
}) {
  const { open: openModal, close: closeModal } = useModal();
  const { close: closeMenu } = useMenu();

  const { mutate: updateEvent, isPending: isUpdating } =
    useCustomMutation(updateEventApi);

  const { mutate: createEvent, isPending: isCreating } =
    useCustomMutation(createEventApi);

  const { _id: editId, ...editValues } = eventToEdit ?? ({} as Event);
  const isEditSession = Boolean(editId);
  const { getToken } = useAuth();
  const eventTypes = [{ value: "Raffle", name: "Raffle" }];

  const [date, setDate] = useState<Date | null>(
    eventToEdit ? new Date(editValues.startDate) : new Date()
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const type = formData.get("type") as string;
    const name = formData.get("name") as string;
    const startDate = formData.get("date") as string;

    const eventData: EventForm = {
      name,
      type,
      startDate,
    };

    const token = getToken();
    if (!token) return;

    if (isEditSession) {
      updateEvent(
        { eventId: editId, eventData, token },
        {
          onSuccess: () => {
            toast.success("Event updated successfully");
            closeModal();
            closeMenu();
          },

          onError: (err: Error) => {
            toast.error(err.message);
          },
        }
      );
    } else {
      createEvent(
        { eventData, token },
        {
          onSuccess: (event) => {
            console.log(event._id);
            toast.success("Event created successfully");
            setEventId?.(event._id);
            openModal("upload-participant");
          },

          onError: (err: Error) => {
            toast.error(err.message);
          },
        }
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-[3rem] py-[3rem] rounded-[var(--border-radius-lg)] shadow-lg z-50 bg-[var(--color-grey-0)] w-full"
    >
      <Box className="flex justify-between">
        <h2 className="mb-[2rem]">{isEditSession ? "Edit" : "Create"} Event</h2>
        <button type="button" onClick={onClose}>
          <IoCloseOutline size="2.5rem" />
        </button>
      </Box>

      <FormRow htmlFor="event_name" label="Event name" orientation="horizontal">
        <Input
          defaultValue={editValues?.name}
          name="name"
          id="event_name"
          required={true}
          type="text"
        />
      </FormRow>

      <FormRow htmlFor="event_type" label="Event type" orientation="horizontal">
        <select
          name="type"
          onChange={() => {}}
          className={`h-[4.5rem]  px-[1.2rem] border border-[var(--color-grey-300)] rounded-[5px] bg-[var(--color-grey-0)] shadow-sm`}
        >
          {eventTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </FormRow>

      <FormRow htmlFor="date" label="Start Date" orientation="horizontal">
        <DatePicker
          value={date}
          onChange={(value) => {
            setDate(value);
          }}
        />
      </FormRow>

      <Input
        name="date"
        type="text"
        id="date"
        className="hidden"
        defaultValue={editValues.startDate}
        value={date?.toISOString()}
      />

      <Box className="flex mt-5 justify-end gap-5 items-center">
        <Button onClick={onClose} type="cancel">
          Cancel
        </Button>

        <Button
          className="w-[17rem]  h-[4.8rem]"
          loading={isCreating || isUpdating}
          type="primary"
          action="submit"
        >
          {!isEditSession ? "Create new event" : "Edit event"}
        </Button>
      </Box>
    </form>
  );
}
