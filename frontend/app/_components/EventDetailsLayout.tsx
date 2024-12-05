import { Box } from "@chakra-ui/react";
import React from "react";

export default function EventDetailsLayout() {
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
