"use client";
import { Box } from "@chakra-ui/react";
import Stats from "./Stats";
import useBookingsAfterDate from "../_hooks/useBookingsAfterDate";
import SpinnerFull from "./SpinnerFull";
import { useSearchParams } from "next/navigation";
import TodayActivity from "./TodayActivity";
import DurationChart from "./DurationChart";
import useStaysAfterDate from "../_hooks/useStaysAfterDate";
import SalesChart from "./SalesChart";

export default function DashboardLayout({
  cabinCount,
}: {
  cabinCount: number;
}) {
  const { isLoading: isLoading1, data: bookings } = useBookingsAfterDate();
  const { isLoading: isLoading2, confirmedStays } = useStaysAfterDate();

  const searchParams = useSearchParams();
  const numDays = Number(searchParams.get("last")) || 7;

  if (isLoading1 || isLoading2) return <SpinnerFull />;

  return (
    <>
      <Box className="grid grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-[2.4rem] ">
        <Stats bookings={bookings} cabinCount={cabinCount} numDays={numDays} />
      </Box>
      <Box className="grid lg:grid-cols-2 grid-cols-1 gap-[2.4rem]">
        <TodayActivity />

        <DurationChart confirmedStays={confirmedStays} />

        <SalesChart bookings={confirmedStays} numDays={numDays} />
      </Box>
    </>
  );
}
