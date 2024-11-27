"use client";
import BookingTable from "./BookingTable";
import SpinnerFull from "./SpinnerFull";
import toast from "react-hot-toast";
import useBookings from "../_hooks/useBookings";

export default function Bookings() {
  const { data, isLoading, error } = useBookings();
  const bookings = data.bookings;
  const count = data.totalCount;

  if (isLoading) return <SpinnerFull />;
  if (error) return toast.error(error.message);
  return bookings.length ? (
    <BookingTable count={count} bookings={bookings} />
  ) : (
    <h2 className="mt-5">No Bookings Found</h2>
  );
}
