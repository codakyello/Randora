"use client";
// import { isToday, format } from "date-fns";
import { Event } from "../_utils/types";
import {
  // formatCurrency,
  // formatDistanceFromNow,
  getTagName,
} from "../_utils/helpers";
import Tag from "./Tag";
import Row from "./Row";
// import Menus, { useMenu } from "./Menu";
// import {
//   HiArrowDownOnSquare,
//   HiArrowUpOnSquare,
//   HiEye,
//   HiTrash,
// } from "react-icons/hi2";
// import { ModalOpen } from "./Modal";
// import Link from "next/link";
// import ConfirmDelete from "./ConfirmDelete";
import { Box } from "@chakra-ui/react";
// import { useRouter } from "next/navigation";
// import useDeleteBookings from "../_hooks/useDeleteBooking";
// import useCheckOut from "../_hooks/useCheckOut";

export default function EventRow({ event }: { event: Event }) {
  const { name, type, startDate, endDate, status, participantCount } = event;

  // const { close: closeMenu } = useMenu();

  // const router = useRouter();

  // const { mutate: checkOut, isPending: isCheckingOut } = useCheckOut();

  // const { mutate: deleteBooking, isPending: isDeleting } = useDeleteBookings();

  return (
    <Row>
      <Box className="font-semibold">{name}</Box>
      <Box className="flex flex-col gap-[.2rem]">{type}</Box>

      <Box className="flex flex-col gap-[.2rem]">{startDate}</Box>

      <Box className="flex flex-col gap-[.2rem]">{endDate}</Box>

      <Tag type={getTagName(status)}>{status.replace("-", " ")}</Tag>
      <Box className="flex flex-col gap-[.2rem]">{participantCount}</Box>

      {/* <Box className="relative z-[9999]">
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
              // onClick={() => {
              //   if (status === "unconfirmed") {
              //     router.push(`/dashboard/checkin/${bookingId}`);
              //   } else {
              //     checkOut(bookingId, {
              //       onSuccess: closeMenu,
              //     });
              //   }
              // }}
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

          {/* <ModalWindow name="delete-booking">
            <ConfirmDelete
              resourceName="Booking"
              isDeleting={isDeleting}
              onConfirm={() => {
                deleteBooking(bookingId);
              }}
            />
          </ModalWindow> */}
      {/* </Menus.Menu> */}
    </Row>
  );
}
