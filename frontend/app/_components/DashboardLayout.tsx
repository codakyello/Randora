"use client";

import { Box } from "@chakra-ui/react";
import SpinnerFull from "./SpinnerFull";
import Stats from "./Stats";
import ParticipantChart from "./ParticipantChart";
import UpcomingEvents from "./UpcomingEvent";
import useAllEvents from "../_hooks/useAllEvents";

export default function DashboardLayout() {
  const { data, isLoading, error } = useAllEvents();

  const events = data?.events;

  const confirmEvents = events;

  console.log(confirmEvents);

  if (isLoading) return <SpinnerFull />;

  if (error) return null;

  return (
    <>
      <Box className="grid min-h-[10rem] grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-[2.4rem] ">
        <Stats confirmEvents={confirmEvents} />
      </Box>
      <Box className="grid lg:grid-cols-2 grid-cols-1 gap-[2.4rem]">
        <UpcomingEvents />

        {<ParticipantChart events={confirmEvents} />}
      </Box>
    </>
  );
}
