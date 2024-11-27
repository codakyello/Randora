"use client";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { ModalOpen, ModalWindow } from "./Modal";
import ConfirmDelete from "./ConfirmDelete";
import { Settings } from "../_utils/types";
import BookingDataBox from "./BookingDataBox";
import useBooking from "../_hooks/useBooking";
import SpinnerFull from "./SpinnerFull";
import useDeleteBookings from "../_hooks/useDeleteBooking";
import { useEffect } from "react";

export default function Booking({
  settings,
  bookingId,
}: {
  settings: Settings;
  bookingId: string;
}) {
  const router = useRouter();

  const { isLoading, data: booking, error } = useBooking(bookingId);

  const { mutate: deleteBooking, isPending: isDeleting } = useDeleteBookings();

  useEffect(() => {
    if (error) router.push("/not-found");
  }, [error, router]);

  if (isLoading) return <SpinnerFull />;
  if (error) return null;

  return (
    <Box className="flex flex-col gap-8 px-[2rem] py-[4rem]">
      <BookingDataBox booking={booking} settings={settings} />
      <Box className="flex justify-end gap-5">
        {booking?.status === "unconfirmed" && (
          <Button
            type="primary"
            onClick={() => {
              router.push(`/dashboard/checkin/${bookingId}`);
            }}
          >
            Check in
          </Button>
        )}

        <ModalOpen name="delete-booking">
          <Button type="danger">Delete booking</Button>
        </ModalOpen>

        <ModalWindow name="delete-booking">
          <ConfirmDelete
            resourceName="Booking"
            isDeleting={isDeleting}
            onConfirm={() =>
              deleteBooking(bookingId, {
                onSuccess: () => {
                  router.push("/dashboard/bookings");
                },
              })
            }
          />
        </ModalWindow>
        <Button onClick={() => router.back()} type="cancel">
          Back
        </Button>
      </Box>
    </Box>
  );
}
