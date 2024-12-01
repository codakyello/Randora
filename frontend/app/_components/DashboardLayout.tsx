"use client";

import { Box } from "@chakra-ui/react";
// import Stats from "./Stats";
// import SalesChart from "./SalesChart";

// import { Box } from "@chakra-ui/react";
// import Stats from "./Stats";
// import useBookingsAfterDate from "../_hooks/useBookingsAfterDate";
// import SpinnerFull from "./SpinnerFull";
// import { useSearchParams } from "next/navigation";
// import TodayActivity from "./TodayActivity";
// import DurationChart from "./DurationChart";
// import useStaysAfterDate from "../_hooks/useStaysAfterDate";
// import SalesChart from "./SalesChart";

// export default function DashboardLayout({
//   cabinCount,
// }: {
//   cabinCount: number;
// }) {
//   const { isLoading: isLoading1, data: bookings } = useBookingsAfterDate();
//   const { isLoading: isLoading2, confirmedStays } = useStaysAfterDate();

//   const searchParams = useSearchParams();
//   const numDays = Number(searchParams.get("last")) || 7;

//   if (isLoading1 || isLoading2) return <SpinnerFull />;

//
// }

export default function DashboardLayout() {
  return (
    <>
      <Box className="grid min-h-[12rem] grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-[2.4rem] ">
        {/* <Stats bookings={bookings} cabinCount={cabinCount} numDays={numDays} /> */}
        <Box className="bg-[var(--color-brand-200)] text-[#374151] grid grid-cols-[6.4rem_1fr] grid-rows-2 p-[1.6rem] gap-y-[.4rem] gap-x-[1.6rem] rounded-2xl items-center">
          Stat
        </Box>
        <Box className="bg-[var(--color-grey-0)] grid grid-cols-[6.4rem_1fr] grid-rows-2 p-[1.6rem] gap-y-[.4rem] gap-x-[1.6rem] rounded-2xl items-center">
          Stat
        </Box>
        <Box className="bg-[var(--color-grey-0)] grid grid-cols-[6.4rem_1fr] grid-rows-2 p-[1.6rem] gap-y-[.4rem] gap-x-[1.6rem] rounded-2xl items-center">
          Stat
        </Box>
        <Box className="bg-[var(--color-grey-0)] grid grid-cols-[6.4rem_1fr] grid-rows-2 p-[1.6rem] gap-y-[.4rem] gap-x-[1.6rem] rounded-2xl items-center">
          Stat
        </Box>
      </Box>
      <Box className="grid h-[43rem] lg:grid-cols-2 grid-cols-1 gap-[2.4rem]">
        <Box className="h-full bg-[var(--color-grey-0)] grid grid-cols-[6.4rem_1fr] grid-rows-2 p-[1.6rem] gap-y-[.4rem] gap-x-[1.6rem] rounded-2xl items-center">
          Stat
        </Box>

        <Box className="h-full bg-[var(--color-grey-0)] grid grid-cols-[6.4rem_1fr] grid-rows-2 p-[1.6rem] gap-y-[.4rem] gap-x-[1.6rem] rounded-2xl items-center">
          Stat
        </Box>
      </Box>
    </>
  );
}
