"use client";
import { Event } from "../_utils/types";
import { formatDistanceFromNow, getTagName } from "../_utils/helpers";
import Tag from "./Tag";
import Row from "./Row";
import Menus, { useMenu } from "./Menu";
import { HiEye, HiTrash, HiMiniUsers, HiPencil } from "react-icons/hi2";

import Modal, { ModalOpen, ModalWindow } from "./Modal";
import Link from "next/link";
import ConfirmDelete from "./ConfirmDelete";
import { Box } from "@chakra-ui/react";
import { isToday, format } from "date-fns";
import { useRouter } from "next/navigation";
import useDeleteEvent from "../_hooks/useDeleteEvent";
import { IoGift } from "react-icons/io5";
import CreateEditCabinForm from "./CreateEditCabinForm";
import CreateEditEventForm from "./CreateEditEventForm";

export default function EventRow({ event }: { event: Event }) {
  const {
    _id: eventId,
    name,
    type,
    startDate,
    endDate,
    status,
    participantCount,
    prizeCount,
    remainingPrize,
  } = event;

  const router = useRouter();

  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

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
      <Box className="relative z-[9999]">
        <Menus.Toogle id={eventId} />

        <Menus.Menu id={eventId}>
          <Menus.Button
            icon={
              <HiEye className=" w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
            }
            onClick={() => {}}
            disabled={isDeleting}
          >
            <Link href={`/dashboard/events/${eventId}`}>See details</Link>
          </Menus.Button>

          <ModalOpen name="edit-event">
            <Menus.Button
              icon={
                <HiPencil className="w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
              }
              onClick={() => {
                router.push(`/dashboard/events/${eventId}/participants`);
              }}
              disabled={isDeleting}
            >
              Edit
            </Menus.Button>
          </ModalOpen>

          <ModalWindow name="edit-event">
            <CreateEditEventForm eventToEdit={event} />
          </ModalWindow>

          <Menus.Button
            icon={
              <HiMiniUsers className=" w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
            }
            onClick={() => {
              router.push(`/dashboard/events/${eventId}/participants`);
            }}
            disabled={isDeleting}
          >
            Participants
          </Menus.Button>

          <Menus.Button
            icon={
              <IoGift className=" w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
            }
            onClick={() => {
              router.push(`/dashboard/events/${eventId}/prizes`);
            }}
            disabled={isDeleting}
          >
            Prizes
          </Menus.Button>

          <ModalOpen name="delete-event">
            <Menus.Button
              onClick={() => {}}
              icon={
                <HiTrash className="w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
              }
              disabled={isDeleting}
            >
              Delete event
            </Menus.Button>
          </ModalOpen>

          <ModalWindow name="delete-event">
            <ConfirmDelete
              resourceName="Event"
              isDeleting={isDeleting}
              onConfirm={() => {
                deleteEvent(eventId);
              }}
            />
          </ModalWindow>
        </Menus.Menu>
      </Box>
    </Row>
  );
}
