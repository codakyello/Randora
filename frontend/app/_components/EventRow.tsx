"use client";
import { Event } from "../_utils/types";
import { formatDistanceFromNow, getTagName } from "../_utils/helpers";
import Tag from "./Tag";
import Row from "./Row";
import Menus, { useMenu } from "./Menu";
import { HiEye, HiTrash, HiPencil } from "react-icons/hi2";
import { ModalOpen, ModalWindow, useModal } from "./Modal";
import Link from "next/link";
import ConfirmDelete from "./ConfirmDelete";
import { Box } from "@chakra-ui/react";
import { isToday, format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  deleteEvent as deleteEventApi,
  updateEvent as updateEventApi,
} from "../_lib/actions";
import CreateEditEventForm from "./CreateEditEventForm";
import useCustomMutation from "../_hooks/useCustomMutation";
import toast from "react-hot-toast";
import { useAuth } from "../_contexts/AuthProvider";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

export default function EventRow({ event }: { event: Event }) {
  const {
    _id: eventId,
    name,
    type,
    startDate,
    status,
    participantCount,
    prizeCount,
    remainingPrize,
  } = event;

  const { getToken } = useAuth();

  const token = getToken();

  const router = useRouter();

  const { close: closeModal } = useModal();

  const { close: closeMenu } = useMenu();

  const { mutate: updateEvent, isPending: isUpdating } =
    useCustomMutation(updateEventApi);

  const { mutate: deleteEvent, isPending: isDeleting } =
    useCustomMutation(deleteEventApi);

  const handleDelete = function () {
    deleteEvent(
      { eventId, token },
      {
        onSuccess: () => {
          toast.success("Event deleted successfully");
          closeModal();
          closeMenu();
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };
  return (
    <Row>
      <Box className="font-semibold">{name}</Box>
      <Box className="flex flex-col gap-[.2rem]">{type.toUpperCase()}</Box>
      <Box className="flex flex-col gap-[.2rem]">
        <span className="font-medium">
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}
        </span>
        <span>{format(new Date(startDate), "MMM dd yyyy")} </span>
      </Box>
      <Tag type={getTagName(status)}>{status.replace("-", " ")}</Tag>
      <Box className="flex items-center justify-center">{participantCount}</Box>
      <Box className="flex justify-center items-center flex-col gap-[.2rem]">
        {remainingPrize}
      </Box>
      <Box className="flex justify-center items-center flex-col gap-[.2rem]">
        {prizeCount}
      </Box>

      <Menus.Toogle id={eventId} />

      <Menus.Menu id={eventId}>
        <Menus.Button
          icon={
            <HiEye className=" w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
          }
          onClick={() => {}}
          disabled={isDeleting || isUpdating}
        >
          <Link href={`/dashboard/events/${eventId}`}>See details</Link>
        </Menus.Button>

        {event.status === "active" ? (
          <Menus.Button
            icon={
              <IoCheckmarkDoneSharp className=" w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
            }
            onClick={() => {
              updateEvent(
                {
                  eventData: { status: "completed" },
                  token,
                  eventId,
                },
                {
                  onSuccess: () => {
                    toast.success("Event has been marked complete");
                    closeMenu();
                  },
                  onError: (err) => {
                    toast.error(err.message);
                  },
                }
              ); // change from active to complete
            }}
            disabled={isDeleting || isUpdating}
          >
            Complete
          </Menus.Button>
        ) : (
          ""
        )}

        {event.status !== "inactive" ? (
          ""
        ) : (
          <ModalOpen name="edit-event">
            <Menus.Button
              icon={
                <HiPencil className="w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
              }
              onClick={() => {
                router.push(`/dashboard/events/${eventId}/participants`);
              }}
              disabled={isDeleting || isUpdating}
            >
              Edit
            </Menus.Button>
          </ModalOpen>
        )}

        <ModalWindow name="edit-event" listenCapturing={true}>
          <CreateEditEventForm eventToEdit={event} />
        </ModalWindow>

        <ModalOpen name="delete-event">
          <Menus.Button
            onClick={() => {}}
            icon={
              <HiTrash className="w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
            }
            disabled={isDeleting || isUpdating}
          >
            Delete
          </Menus.Button>
        </ModalOpen>

        <ModalWindow name="delete-event">
          <ConfirmDelete
            resourceName="Event"
            isDeleting={isDeleting}
            onConfirm={handleDelete}
          />
        </ModalWindow>
      </Menus.Menu>
    </Row>
  );
}
