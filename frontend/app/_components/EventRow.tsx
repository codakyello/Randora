"use client";
import { Event } from "../_utils/types";
import { formatDistanceFromNow, getTagName } from "../_utils/helpers";
import Tag from "./Tag";
import Row from "./Row";
import Menus, { useMenu } from "./Menu";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiTrash,
} from "react-icons/hi2";
import { ModalOpen, ModalWindow } from "./Modal";
import Link from "next/link";
import ConfirmDelete from "./ConfirmDelete";
import { Box } from "@chakra-ui/react";
import { isToday, format } from "date-fns";
import { useRouter } from "next/navigation";
import useDeleteBookings from "../_hooks/useDeleteBooking";
import useCheckOut from "../_hooks/useCheckOut";
import useDeleteEvent from "../_hooks/useDeleteBooking";

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

  const { close: closeMenu } = useMenu();

  const router = useRouter();

  const { mutate: checkOut, isPending: isCheckingOut } = useCheckOut();

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
        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
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
            disabled={isCheckingOut || isDeleting}
          >
            <Link href={`/dashboard/bookings/${eventId}`}>See details</Link>
          </Menus.Button>

          {status !== "checked-out" ? (
            <Menus.Button
              icon={
                status === "unconfirmed" ? (
                  <HiArrowDownOnSquare className=" w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
                ) : (
                  <HiArrowUpOnSquare className=" w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
                )
              }
              onClick={() => {
                if (status === "unconfirmed") {
                  router.push(`/dashboard/checkin/${eventId}`);
                } else {
                  checkOut(eventId, {
                    onSuccess: closeMenu,
                  });
                }
              }}
              disabled={isCheckingOut || isDeleting}
            >
              {status === "unconfirmed" ? "Check in" : "Check out"}
            </Menus.Button>
          ) : (
            ""
          )}

          <ModalOpen name="delete-booking">
            <Menus.Button
              onClick={() => {}}
              icon={
                <HiTrash className="w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
              }
              disabled={isCheckingOut || isDeleting}
            >
              Delete booking
            </Menus.Button>
          </ModalOpen>

          <ModalWindow name="delete-booking">
            <ConfirmDelete
              resourceName="Booking"
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
