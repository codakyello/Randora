"use client";
import { isToday, format } from "date-fns";
import { Booking } from "../_utils/types";
import {
  formatCurrency,
  formatDistanceFromNow,
  getTagName,
} from "../_utils/helpers";
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
import { useRouter } from "next/navigation";
import useDeleteBookings from "../_hooks/useDeleteBooking";
import useCheckOut from "../_hooks/useCheckOut";

export function BookingRow({ booking }: { booking: Booking }) {
  const {
    bookingId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    status,
    guest: { fullName, email },
    cabin: { name: cabinName },
  } = booking;

  const { close: closeMenu } = useMenu();

  const router = useRouter();

  const { mutate: checkOut, isPending: isCheckingOut } = useCheckOut();
  const { mutate: deleteBooking, isPending: isDeleting } = useDeleteBookings();

  return (
    <Row>
      <Box className="font-semibold">{cabinName}</Box>
      <Box className="flex flex-col gap-[.2rem]">
        <span className="font-medium">{fullName}</span>
        <span className="text-[1.2rem] text-[var(--color-grey-500)]">
          {email}
        </span>
      </Box>

      <Box className="flex flex-col gap-[.2rem]">
        <span className="font-medium">
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}{" "}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
      </Box>

      <Tag type={getTagName(status)}>{status.replace("-", " ")}</Tag>
      <Box>{formatCurrency(totalPrice)}</Box>

      <Box className="relative z-[9999]">
        <Menus.Toogle id={bookingId} />

        <Menus.Menu id={bookingId}>
          <Menus.Button
            icon={
              <HiEye className=" w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
            }
            onClick={() => {}}
            disabled={isCheckingOut || isDeleting}
          >
            <Link href={`/dashboard/bookings/${bookingId}`}>See details</Link>
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
                  router.push(`/dashboard/checkin/${bookingId}`);
                } else {
                  checkOut(bookingId, {
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
                deleteBooking(bookingId);
              }}
            />
          </ModalWindow>
        </Menus.Menu>
      </Box>
    </Row>
  );
}
