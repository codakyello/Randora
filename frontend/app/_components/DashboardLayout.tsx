"use client";

import { Box } from "@chakra-ui/react";
import useEvents from "../_hooks/useEvents";
import SpinnerFull from "./SpinnerFull";
import Stats from "./Stats";
import ParticipantChart from "./ParticipantChart";
import { Event } from "../_utils/types";
import UpcomingEvents from "./UpcomingEvent";

export default function DashboardLayout() {
  const { data, isLoading, error } = useEvents();

  const events = data?.events;

  const confirmEvents = events.filter(
    (event: Event) => event.status === "inactive"
  );

  if (isLoading) return <SpinnerFull />;

  if (error) return null;

  return (
    <>
      <Box className="grid min-h-[10rem] grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-[2.4rem] ">
        <Stats confirmEvents={confirmEvents} />
      </Box>
      <Box className="grid lg:grid-cols-2 grid-cols-1 gap-[2.4rem]">
        <UpcomingEvents />
        <ParticipantChart events={confirmEvents} />
      </Box>
    </>
  );
}
