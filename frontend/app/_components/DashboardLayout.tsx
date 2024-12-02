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

  // Reverse it because by default we are getting events by the time they are created At
  // Meaning the latest is at the top of the list, here we want the latest to be at the bottom
  const confirmEvents = events
    .filter(
      (event: Event) =>
        event.status === "completed" || event.status === "active"
    )
    .reverse();

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
