"use client";
import useTodayActivity from "../_hooks/useTodaysActivity";
import { Booking } from "../_utils/types";
import Activity from "./Activity";
import Spinner from "./Spinner";
import { Box } from "@chakra-ui/react";

export default function TodayActivity() {
  const { activities: todayActivity, isLoading } = useTodayActivity();

  return (
    <Box className="bg-[var(--color-grey-0)] rounded-[var(--border-radius-md)] flex flex-col gap-8 overflow-scroll no-scrollbar min-h-[32.7rem] pt-[2.4rem] pb-[3.2rem] px-[3.2rem]">
      {isLoading && <Spinner />}
      {!isLoading && todayActivity.length ? (
        <>
          <h2 className="mb-[1.6rem]">Today</h2>
          <ul className="no-scrollbar ">
            {todayActivity.map((activity: Booking) => (
              <Activity key={activity.bookingId} activity={activity} />
            ))}
          </ul>
        </>
      ) : (
        !isLoading && (
          <p className="text-center text-[1.8rem] font-medium mt-[.8rem]">
            No Recent Activity
          </p>
        )
      )}
    </Box>
  );
}
